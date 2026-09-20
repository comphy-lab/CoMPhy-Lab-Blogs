// @ts-nocheck
// Based on quartz-community/graph 701bda442cf08f521e88ec326b12a7559320eef4.
// This tracked browser script replaces the downloaded plugin script so Pixi
// instances survive SPA navigation without rendering after destruction.
import {
  removeAllChildren,
  getFullSlugFromUrl,
  simplifySlug,
  resolvePath,
} from "@quartz-community/utils"
;(function () {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script")
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  Promise.all([loadScript("/static/graph/d3.min.js"), loadScript("/static/graph/pixi.min.js")])
    .then(function () {
      initGraph()
    })
    .catch(function (err) {
      console.error("[Graph] Failed to load libraries:", err)
    })

  function initGraph() {
    var d3 = window.d3
    var PIXI = window.PIXI

    if (!d3 || !PIXI) {
      console.error("[Graph] Libraries not loaded")
      return
    }

    var localStorageKey = "graph-visited"

    function getVisited() {
      return new Set(JSON.parse(localStorage.getItem(localStorageKey) || "[]"))
    }

    function addToVisited(slug) {
      var visited = getVisited()
      visited.add(slug)
      localStorage.setItem(localStorageKey, JSON.stringify(Array.from(visited)))
    }

    async function renderGraph(graph, fullSlug, renderGeneration, isActive) {
      var app = null
      var simulation = null
      var animationFrameId = 0
      var stopped = false
      function current() {
        return (
          graph.isConnected &&
          (renderGeneration === undefined || renderGeneration === currentRenderGeneration) &&
          (!isActive || isActive())
        )
      }
      function cleanup() {
        if (stopped) return
        stopped = true
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
        if (simulation) simulation.stop()
        if (app) {
          if (app.renderer && app.canvas && graph.contains(app.canvas)) {
            delete graph.dataset.graphReady
            delete graph.dataset.graphSlug
            delete graph.dataset.graphNodeCount
            delete graph.dataset.graphNodeIds
          }
          if (app.ticker) app.ticker.stop()
          // Pixi's boolean `true` releases shared texture pools, which can
          // break another graph whose renderer is still alive.
          if (app.renderer && app.stage)
            app.destroy({ removeView: true, releaseGlobalResources: false }, { children: true })
          else if (app.stage) app.stage.destroy()
        }
      }

      // Apply the same normalization as the content-index keys, including /.
      var slug = simplifySlug(fullSlug || "index")
      var visited = getVisited()
      if (!current()) {
        console.log("[Graph] Stale render, skipping")
        return function () {}
      }

      var config = JSON.parse(graph.dataset["cfg"] || "{}")
      var enableDrag = config.drag
      var enableZoom = config.zoom
      var depth = config.depth
      var scale = config.scale || 1
      var repelForce = config.repelForce || 0.5
      var centerForce = config.centerForce || 0.3
      var linkDistance = config.linkDistance || 30
      var fontSize = config.fontSize || 0.6
      var opacityScale = config.opacityScale || 1
      var removeTags = config.removeTags || []
      var showTags = config.showTags
      var focusOnHover = config.focusOnHover
      var enableRadial = config.enableRadial

      var data
      try {
        var response = await fetch("/static/contentIndex.json")
        var dataRaw = await response.json()
        data = new Map()
        for (var key in dataRaw) {
          data.set(simplifySlug(key), dataRaw[key])
        }
      } catch (err) {
        console.error("[Graph] Error loading data:", err)
        return function () {}
      }

      if (!current()) return function () {}

      var width = graph.offsetWidth
      var height = Math.max(graph.offsetHeight, 250)

      var links = []
      var allTags = []
      var validLinks = new Set(data.keys())

      data.forEach(function (details, source) {
        var outgoing = details.links || []
        for (var i = 0; i < outgoing.length; i++) {
          var dest = simplifySlug(outgoing[i])
          if (validLinks.has(dest)) {
            links.push({ source: source, target: dest })
          }
        }

        if (showTags) {
          var tags = details.tags || []
          for (var i = 0; i < tags.length; i++) {
            var tag = tags[i]
            if (removeTags.indexOf(tag) === -1) {
              var tagSlug = simplifySlug("tags/" + tag)
              if (allTags.indexOf(tagSlug) === -1) {
                allTags.push(tagSlug)
              }
              links.push({ source: source, target: tagSlug })
            }
          }
        }
      })

      var neighbourhood = new Set()
      if (depth >= 0) {
        var queue = [slug]
        var seen = new Set([slug])
        for (var d = 0; d <= depth && queue.length > 0; d++) {
          var nextQueue = []
          for (var qi = 0; qi < queue.length; qi++) {
            var cur = queue[qi]
            neighbourhood.add(cur)
            for (var li = 0; li < links.length; li++) {
              var link = links[li]
              if (link.source === cur && !seen.has(link.target)) {
                seen.add(link.target)
                nextQueue.push(link.target)
              }
              if (link.target === cur && !seen.has(link.source)) {
                seen.add(link.source)
                nextQueue.push(link.source)
              }
            }
          }
          queue = nextQueue
        }
      } else {
        validLinks.forEach(function (id) {
          neighbourhood.add(id)
        })
        for (var i = 0; i < allTags.length; i++) {
          neighbourhood.add(allTags[i])
        }
      }

      var nodes = []
      var nodeMap = new Map()
      neighbourhood.forEach(function (url) {
        var isTag = url.startsWith("tags/")
        var text = isTag ? "#" + url.substring(5) : data.get(url)?.title || url
        var nodeTags = isTag ? [] : data.get(url)?.tags || []
        var node = {
          id: url,
          text: text,
          tags: nodeTags,
          x: Math.random() * width - width / 2,
          y: Math.random() * height - height / 2,
          vx: 0,
          vy: 0,
        }
        nodes.push(node)
        nodeMap.set(url, node)
      })

      // The page the graph was opened from: pinned at the centre of the
      // global graph, drawn larger with a ring, and labelled permanently.
      var isGlobal = depth < 0
      var currentNode = nodeMap.get(slug) || null
      var currentNeighbours = new Set()
      if (currentNode && isGlobal) {
        currentNode.x = 0
        currentNode.y = 0
        currentNode.fx = 0
        currentNode.fy = 0
      }
      if (currentNode) {
        for (var ci = 0; ci < links.length; ci++) {
          if (links[ci].source === slug) currentNeighbours.add(links[ci].target)
          if (links[ci].target === slug) currentNeighbours.add(links[ci].source)
        }
      }

      var graphLinks = []
      for (var i = 0; i < links.length; i++) {
        var link = links[i]
        if (neighbourhood.has(link.source) && neighbourhood.has(link.target)) {
          var sourceNode = nodeMap.get(link.source)
          var targetNode = nodeMap.get(link.target)
          if (sourceNode && targetNode) {
            graphLinks.push({ source: sourceNode, target: targetNode })
          }
        }
      }

      var styles = getComputedStyle(document.documentElement)
      var secondary = styles.getPropertyValue("--secondary").trim() || "#c792ea"
      var tertiary = styles.getPropertyValue("--tertiary").trim() || "#82aaff"
      var gray = styles.getPropertyValue("--gray").trim() || "#6c6c6c"
      var lightgray = styles.getPropertyValue("--lightgray").trim() || "#d4d4d4"
      var dark = styles.getPropertyValue("--dark").trim() || "#1a1a1a"
      var light = styles.getPropertyValue("--light").trim() || "#f5f5f5"
      var bodyFont = styles.getPropertyValue("--bodyFont").trim() || "inherit"

      try {
        app = new PIXI.Application()
        await app.init({
          width: width,
          height: height,
          antialias: true,
          backgroundAlpha: 0,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          eventMode: "static",
        })

        if (!current()) {
          cleanup()
          return function () {}
        }

        removeAllChildren(graph)
        graph.appendChild(app.canvas)
        graph.dataset.graphReady = "false"

        var stage = new PIXI.Container()
        app.stage.addChild(stage)

        simulation = d3
          .forceSimulation(nodes)
          .force("charge", d3.forceManyBody().strength(-100 * repelForce))
          .force("center", d3.forceCenter().strength(centerForce))
          .force("link", d3.forceLink(graphLinks).distance(linkDistance))
          .force(
            "collide",
            d3
              .forceCollide()
              .radius(function (d) {
                var numLinks = 0
                for (var i = 0; i < graphLinks.length; i++) {
                  if (graphLinks[i].source.id === d.id || graphLinks[i].target.id === d.id) {
                    numLinks++
                  }
                }
                return 2 + Math.sqrt(numLinks)
              })
              .iterations(3),
          )

        if (enableRadial) {
          var radius = (Math.min(width, height) / 2) * 0.8
          simulation.force("radial", d3.forceRadial(radius).strength(0.2))
        }

        var linkContainer = new PIXI.Container()
        var nodesContainer = new PIXI.Container()
        var labelsContainer = new PIXI.Container()
        stage.addChild(linkContainer)
        stage.addChild(nodesContainer)
        stage.addChild(labelsContainer)

        var nodeRenderData = []
        var linkRenderData = []
        var hoveredNodeId = null
        var hoveredNeighbours = new Set()
        var dragStartTime = 0
        var dragging = false
        var currentTransform = d3.zoomIdentity

        function nodeRadius(d) {
          var numLinks = 0
          for (var i = 0; i < graphLinks.length; i++) {
            if (graphLinks[i].source.id === d.id || graphLinks[i].target.id === d.id) {
              numLinks++
            }
          }
          return 2 + Math.sqrt(numLinks) + (d.id === slug ? 2.5 : 0)
        }

        function nodeColor(d) {
          var isCurrent = d.id === slug
          if (isCurrent) {
            return secondary
          } else if (visited.has(d.id) || d.id.startsWith("tags/")) {
            return tertiary
          } else {
            return gray
          }
        }

        function updateHoverInfo(newHoveredId) {
          hoveredNodeId = newHoveredId

          if (newHoveredId === null) {
            hoveredNeighbours = new Set()
            for (var i = 0; i < nodeRenderData.length; i++) {
              nodeRenderData[i].active = false
            }
            for (var i = 0; i < linkRenderData.length; i++) {
              linkRenderData[i].active = false
            }
          } else {
            hoveredNeighbours = new Set()

            for (var i = 0; i < linkRenderData.length; i++) {
              var linkData = linkRenderData[i].simulationData
              if (linkData.source.id === newHoveredId || linkData.target.id === newHoveredId) {
                hoveredNeighbours.add(linkData.source.id)
                hoveredNeighbours.add(linkData.target.id)
                linkRenderData[i].active = true
              } else {
                linkRenderData[i].active = false
              }
            }

            hoveredNeighbours.add(newHoveredId)

            for (var i = 0; i < nodeRenderData.length; i++) {
              if (hoveredNeighbours.has(nodeRenderData[i].simulationData.id)) {
                nodeRenderData[i].active = true
              } else {
                nodeRenderData[i].active = false
              }
            }
          }
        }

        function renderLinks() {
          for (var i = 0; i < linkRenderData.length; i++) {
            var linkData = linkRenderData[i]
            var alpha = 1
            if (hoveredNodeId !== null) {
              alpha = linkData.active ? 1 : 0.2
            }
            linkData.alpha = alpha
            var sim = linkData.simulationData
            var touchesCurrent = sim.source.id === slug || sim.target.id === slug
            linkData.color = linkData.active ? gray : touchesCurrent ? secondary : lightgray
            if (touchesCurrent && hoveredNodeId === null) linkData.alpha = 0.9
          }
        }

        function renderLabels() {
          var defaultScale = 1 / scale
          var activeScale = defaultScale * 1.1

          for (var i = 0; i < nodeRenderData.length; i++) {
            var nodeData = nodeRenderData[i]
            if (hoveredNodeId === nodeData.simulationData.id) {
              nodeData.label.alpha = 1
              nodeData.label.scale.set(activeScale)
            } else if (isGlobal && nodeData.simulationData.id === slug) {
              nodeData.label.alpha = 1
              nodeData.label.scale.set(defaultScale)
            } else {
              nodeData.label.scale.set(defaultScale)
            }
          }
        }

        function renderNodes() {
          for (var i = 0; i < nodeRenderData.length; i++) {
            var nodeData = nodeRenderData[i]
            var alpha = 1
            if (hoveredNodeId !== null && focusOnHover) {
              alpha = nodeData.active ? 1 : 0.2
            }
            nodeData.gfx.alpha = alpha
          }
        }

        function renderPixiFromD3() {
          renderNodes()
          renderLinks()
          renderLabels()
        }

        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i]
          var nodeId = node.id
          var isTagNode = nodeId.startsWith("tags/")
          var radius = nodeRadius(node)
          var color = nodeColor(node)

          var isCurrentNode = nodeId === slug
          var label = new PIXI.Text({
            text: node.text,
            style: {
              fontSize: fontSize * 15 * (isCurrentNode ? 1.15 : 1),
              fill: dark,
              fontFamily: bodyFont,
              fontWeight: isCurrentNode ? "600" : "normal",
            },
            resolution: window.devicePixelRatio * 4,
          })
          label.anchor.set(0.5, isCurrentNode ? 1.6 : 1.2)
          label.alpha = isCurrentNode && isGlobal ? 1 : 0
          label.scale.set(1 / scale)
          labelsContainer.addChild(label)

          var gfx = new PIXI.Graphics()
          gfx.circle(0, 0, radius)
          gfx.fill({ color: isTagNode ? light : color })
          if (isTagNode) {
            gfx.stroke({ width: 2, color: tertiary })
          }
          if (isCurrentNode) {
            gfx.circle(0, 0, radius + 4)
            gfx.stroke({ width: 1.5, color: secondary, alpha: 0.6 })
          }

          gfx.eventMode = "static"
          gfx.cursor = "pointer"
          gfx.label = nodeId
          ;(function (n, g, labelRef) {
            var oldLabelOpacity = 0
            g.on("pointerover", function (e) {
              updateHoverInfo(n.id)
              oldLabelOpacity = labelRef.alpha
              if (!dragging) {
                renderPixiFromD3()
              }
            })

            g.on("pointerleave", function () {
              updateHoverInfo(null)
              labelRef.alpha = oldLabelOpacity
              if (!dragging) {
                renderPixiFromD3()
              }
            })
          })(node, gfx, label)

          nodesContainer.addChild(gfx)

          nodeRenderData.push({
            simulationData: node,
            gfx: gfx,
            label: label,
            color: color,
            alpha: 1,
            active: false,
          })
        }

        for (var i = 0; i < graphLinks.length; i++) {
          var link = graphLinks[i]
          var gfx = new PIXI.Graphics()
          gfx.eventMode = "none"
          linkContainer.addChild(gfx)

          linkRenderData.push({
            simulationData: link,
            gfx: gfx,
            color: lightgray,
            alpha: 1,
            active: false,
          })
        }

        if (enableDrag) {
          var dragSubject = function (event) {
            var mouseX = (event.x - currentTransform.x) / currentTransform.k
            var mouseY = (event.y - currentTransform.y) / currentTransform.k

            for (var i = 0; i < nodes.length; i++) {
              var n = nodes[i]
              var dx = mouseX - n.x - width / 2
              var dy = mouseY - n.y - height / 2
              var dist = Math.sqrt(dx * dx + dy * dy)
              var rad = nodeRadius(n)
              if (dist < rad + 5) {
                return n
              }
            }
            return null
          }

          var dragStarted = function (event) {
            if (!event.active) simulation.alphaTarget(1).restart()
            event.subject.fx = event.subject.x
            event.subject.fy = event.subject.y
            var mouseSimX = (event.x - currentTransform.x) / currentTransform.k - width / 2
            var mouseSimY = (event.y - currentTransform.y) / currentTransform.k - height / 2
            event.subject.__dragOffset = {
              x: mouseSimX - event.subject.x,
              y: mouseSimY - event.subject.y,
            }
            dragStartTime = Date.now()
            dragging = true
            hoveredNodeId = event.subject.id
          }

          var dragDragged = function (event) {
            var mouseSimX = (event.x - currentTransform.x) / currentTransform.k - width / 2
            var mouseSimY = (event.y - currentTransform.y) / currentTransform.k - height / 2
            event.subject.fx = mouseSimX - event.subject.__dragOffset.x
            event.subject.fy = mouseSimY - event.subject.__dragOffset.y
          }

          var dragEnded = function (event) {
            if (!event.active) simulation.alphaTarget(0)
            event.subject.fx = null
            event.subject.fy = null
            dragging = false
            updateHoverInfo(null)
            renderPixiFromD3()

            if (Date.now() - dragStartTime < 500) {
              var target = resolvePath(event.subject.id)
              window.location.href = target
            }
          }

          var drag = d3
            .drag()
            .container(app.canvas)
            .subject(dragSubject)
            .on("start", dragStarted)
            .on("drag", dragDragged)
            .on("end", dragEnded)

          d3.select(app.canvas).call(drag)
        } else {
          for (var i = 0; i < nodeRenderData.length; i++) {
            ;(function (nodeData) {
              nodeData.gfx.on("click", function () {
                var target = resolvePath(nodeData.simulationData.id)
                window.location.href = target
              })
            })(nodeRenderData[i])
          }
        }

        if (enableZoom) {
          var zoomed = function (event) {
            currentTransform = event.transform
            stage.scale.set(currentTransform.k, currentTransform.k)
            stage.position.set(currentTransform.x, currentTransform.y)

            var newScale = currentTransform.k * opacityScale
            var scaleOpacity = Math.max((newScale - 1) / 3.75, 0)

            var activeLabels = []
            for (var i = 0; i < nodeRenderData.length; i++) {
              if (nodeRenderData[i].active) {
                activeLabels.push(nodeRenderData[i].label)
              }
            }

            for (var i = 0; i < labelsContainer.children.length; i++) {
              var label = labelsContainer.children[i]
              if (activeLabels.indexOf(label) === -1) {
                label.alpha = scaleOpacity
              }
            }
            if (currentLabel && isGlobal) currentLabel.alpha = 1
          }
          var currentLabel = null
          for (var i = 0; i < nodeRenderData.length; i++) {
            if (nodeRenderData[i].simulationData.id === slug) currentLabel = nodeRenderData[i].label
          }

          var zoom = d3
            .zoom()
            .extent([
              [0, 0],
              [width, height],
            ])
            .scaleExtent([0.25, 4])
            .on("zoom", zoomed)

          d3.select(app.canvas).call(zoom)

          if (isGlobal && currentNode) {
            // Open the global graph centred and zoomed on the current page.
            var k = 1.6
            var cx = width / 2
            var cy = height / 2
            d3.select(app.canvas).call(
              zoom.transform,
              d3.zoomIdentity.translate(cx - k * cx, cy - k * cy).scale(k),
            )
          }
        }

        function animate() {
          if (stopped || !current()) {
            cleanup()
            return
          }

          for (var i = 0; i < nodeRenderData.length; i++) {
            var n = nodeRenderData[i]
            var x = n.simulationData.x
            var y = n.simulationData.y
            if (x != null && y != null) {
              n.gfx.position.set(x + width / 2, y + height / 2)
              if (n.label) {
                n.label.position.set(x + width / 2, y + height / 2)
              }
            }
          }

          for (var i = 0; i < linkRenderData.length; i++) {
            var l = linkRenderData[i]
            var linkData = l.simulationData
            var sx = linkData.source.x
            var sy = linkData.source.y
            var tx = linkData.target.x
            var ty = linkData.target.y
            if (sx != null && sy != null && tx != null && ty != null) {
              l.gfx.clear()
              l.gfx.moveTo(sx + width / 2, sy + height / 2)
              l.gfx.lineTo(tx + width / 2, ty + height / 2)
              l.gfx.stroke({ alpha: l.alpha, width: 1, color: l.color })
            }
          }

          animationFrameId = requestAnimationFrame(animate)
        }

        simulation.on("tick", function () {})
        simulation.restart()
        renderPixiFromD3()
        animate()
        graph.dataset.graphSlug = fullSlug || "index"
        graph.dataset.graphNodeCount = String(nodes.length)
        graph.dataset.graphNodeIds = JSON.stringify(
          nodes.map(function (node) {
            return node.id
          }),
        )
        graph.dataset.graphReady = "true"

        return cleanup
      } catch (err) {
        cleanup()
        throw err
      }
    }

    var localCleanups = []
    var globalCleanups = []
    var currentRenderGeneration = 0
    var globalRenderGeneration = 0
    var lastLocalSlug = null
    var lastLocalContainers = []

    function cleanupLocal() {
      for (var i = 0; i < localCleanups.length; i++) {
        localCleanups[i]()
      }
      localCleanups = []
    }

    function cleanupGlobal() {
      globalRenderGeneration++
      for (var i = 0; i < globalCleanups.length; i++) {
        globalCleanups[i]()
      }
      globalCleanups = []
    }

    var globalContainers = []
    var globalIcons = []
    var documentClickHandler = null
    var documentKeydownHandler = null
    var iconClickHandler = null

    function hideGlobalGraph() {
      cleanupGlobal()
      for (var i = 0; i < globalContainers.length; i++) {
        globalContainers[i].classList.remove("active")
        var sidebar = globalContainers[i].closest(".sidebar")
        if (sidebar) {
          sidebar.style.zIndex = ""
        }
      }
    }

    function anyGlobalGraphActive() {
      for (var i = 0; i < globalContainers.length; i++) {
        if (globalContainers[i].classList.contains("active")) {
          return true
        }
      }
      return false
    }

    function showGlobalGraph() {
      cleanupGlobal()
      var thisGeneration = globalRenderGeneration
      var currentSlug = getFullSlugFromUrl()
      for (var i = 0; i < globalContainers.length; i++) {
        var container = globalContainers[i]
        container.classList.add("active")
        var sidebar = container.closest(".sidebar")
        if (sidebar) {
          sidebar.style.zIndex = "1"
        }

        var graphContainer = container.querySelector(".global-graph-container")
        if (graphContainer) {
          ;(function (gc, outer) {
            var isActive = function () {
              return (
                thisGeneration === globalRenderGeneration &&
                outer.classList.contains("active") &&
                gc.isConnected
              )
            }
            renderGraph(gc, currentSlug, undefined, isActive)
              .then(function (cleanup) {
                if (isActive()) globalCleanups.push(cleanup)
                else cleanup()
              })
              .catch(function (err) {
                console.error("[Graph] Global render error:", err)
              })
          })(graphContainer, container)
        }
      }
    }

    function toggleGlobalGraph() {
      if (anyGlobalGraphActive()) {
        hideGlobalGraph()
      } else {
        showGlobalGraph()
      }
    }

    function renderLocal(force) {
      var slug = getFullSlugFromUrl()
      var localContainers = Array.from(document.querySelectorAll(".graph-container"))
      if (
        !force &&
        slug === lastLocalSlug &&
        localContainers.length === lastLocalContainers.length &&
        localContainers.every(function (node, index) {
          return node === lastLocalContainers[index]
        })
      ) {
        return
      }
      lastLocalSlug = slug
      lastLocalContainers = localContainers
      cleanupLocal()
      var thisGeneration = ++currentRenderGeneration
      addToVisited(slug)

      for (var i = 0; i < localContainers.length; i++) {
        ;(function (container) {
          renderGraph(container, slug, thisGeneration)
            .then(function (cleanup) {
              if (thisGeneration === currentRenderGeneration && container.isConnected) {
                localCleanups.push(cleanup)
              } else cleanup()
            })
            .catch(function (err) {
              console.error("[Graph] Local render error:", err)
            })
        })(localContainers[i])
      }
    }

    function handleNav(e) {
      var slug = e.detail ? e.detail.url : getFullSlugFromUrl()
      addToVisited(simplifySlug(slug))

      renderLocal()

      if (
        e.type === "nav" ||
        globalContainers.some(function (container) {
          return !container.isConnected
        })
      ) {
        hideGlobalGraph()
      }

      globalContainers = Array.from(document.querySelectorAll(".global-graph-outer"))

      if (iconClickHandler) {
        for (var i = 0; i < globalIcons.length; i++) {
          globalIcons[i].removeEventListener("click", iconClickHandler)
        }
      }

      globalIcons = Array.from(document.querySelectorAll(".global-graph-icon"))
      iconClickHandler = function () {
        toggleGlobalGraph()
      }
      for (var i = 0; i < globalIcons.length; i++) {
        globalIcons[i].addEventListener("click", iconClickHandler)
      }

      if (documentClickHandler) {
        document.removeEventListener("click", documentClickHandler)
      }
      documentClickHandler = function (e) {
        if (anyGlobalGraphActive()) {
          var inContainer = e.target.closest(".global-graph-container")
          var inIcon = e.target.closest(".global-graph-icon")
          if (!inContainer && !inIcon) {
            hideGlobalGraph()
          }
        }
      }
      document.addEventListener("click", documentClickHandler)

      if (documentKeydownHandler) {
        document.removeEventListener("keydown", documentKeydownHandler)
      }
      documentKeydownHandler = function (e) {
        if (e.key === "Escape") {
          if (anyGlobalGraphActive()) {
            hideGlobalGraph()
          }
          return
        }

        if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
          e.preventDefault()
          toggleGlobalGraph()
        }
      }
      document.addEventListener("keydown", documentKeydownHandler)

      if (anyGlobalGraphActive()) {
        showGlobalGraph()
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        handleNav({ detail: { url: getFullSlugFromUrl() } })
      })
    } else {
      handleNav({ detail: { url: getFullSlugFromUrl() } })
    }
    document.addEventListener("nav", handleNav)
    document.addEventListener("render", handleNav)

    function refreshVisibleGraphs() {
      renderLocal(true)
      if (anyGlobalGraphActive()) showGlobalGraph()
    }
    var resizeTimer = 0
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(refreshVisibleGraphs, 150)
    })
    document.addEventListener("themechange", refreshVisibleGraphs)
  }
})()
