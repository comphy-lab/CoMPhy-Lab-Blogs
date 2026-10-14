// Quartz's downloaded Explorer attaches a new set of toggle listeners on each
// nav/render event. Handle these controls once in capture phase so a click
// changes state exactly once, including after SPA navigation.
const explorerWindow = window as Window & { comphyExplorerControlsReady?: boolean }

if (!explorerWindow.comphyExplorerControlsReady) {
  explorerWindow.comphyExplorerControlsReady = true

  const isMobile = () => window.matchMedia("(max-width: 800px)").matches

  function setExpanded(element: HTMLElement, expanded: boolean) {
    const next = expanded ? "true" : "false"
    // Setting the same value still notifies a MutationObserver in this browser
    // and retriggers this sync. The page then never paints.
    if (element.getAttribute("aria-expanded") !== next) {
      element.setAttribute("aria-expanded", next)
    }
  }

  function clearExpanded(element: Element | null) {
    if (element?.hasAttribute("aria-expanded")) element.removeAttribute("aria-expanded")
  }

  function syncExplorer(explorer: HTMLElement) {
    const expanded = !explorer.classList.contains("collapsed")
    const content = explorer.querySelector<HTMLElement>(".explorer-content")
    // The explorer root is a plain div. aria-expanded is only valid on the toggle button.
    clearExpanded(explorer)
    clearExpanded(content)
    explorer.querySelectorAll<HTMLButtonElement>(".explorer-toggle").forEach((button) => {
      setExpanded(button, expanded)
      // The desktop toggle already contains the visible word "Explorer".
      // Replacing that name with "Close navigation" fails the accessible-name
      // check. The icon-only mobile toggle still needs a name.
      if (button.classList.contains("desktop-explorer")) button.removeAttribute("aria-label")
      else button.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation")
      if (content?.id) button.setAttribute("aria-controls", content.id)
    })
  }

  function setExplorerOpen(explorer: HTMLElement, open: boolean) {
    explorer.classList.toggle("collapsed", !open)
    document.documentElement.classList.toggle("mobile-no-scroll", open && isMobile())
    syncExplorer(explorer)
  }

  window.matchMedia("(max-width: 800px)").addEventListener("change", (event) => {
    document.querySelectorAll<HTMLElement>(".explorer").forEach((explorer) => {
      setExplorerOpen(explorer, !event.matches)
    })
  })

  function syncFolder(icon: HTMLElement) {
    const outer = icon.closest(".folder-container")?.nextElementSibling
    const open = outer?.classList.contains("open") ?? false
    const title = icon
      .closest(".folder-container")
      ?.querySelector(".folder-title")
      ?.textContent?.trim()
    icon.setAttribute("role", "button")
    icon.setAttribute("tabindex", "0")
    setExpanded(icon, open)
    icon.setAttribute("aria-label", `${open ? "Collapse" : "Expand"} ${title || "folder"}`)
  }

  function toggleFolder(icon: HTMLElement) {
    const container = icon.closest<HTMLElement>(".folder-container")
    const outer = container?.nextElementSibling
    if (!container || !(outer instanceof HTMLElement)) return
    const open = outer.classList.toggle("open")
    syncFolder(icon)
    const folderPath = container.dataset.folderpath
    if (!folderPath) return
    try {
      const saved = JSON.parse(localStorage.getItem("fileTree") || "[]") as Array<{
        path: string
        collapsed: boolean
      }>
      const state = Array.isArray(saved) ? saved : []
      const entry = state.find((item) => item.path === folderPath)
      if (entry) entry.collapsed = !open
      else state.push({ path: folderPath, collapsed: !open })
      localStorage.setItem("fileTree", JSON.stringify(state))
    } catch {
      // Navigation still works if saved UI state is corrupt or unavailable.
    }
  }

  function syncToc() {
    document.querySelectorAll<HTMLButtonElement>("button.toc-header").forEach((button) => {
      const list = button.parentElement?.querySelector("ul.toc-content")
      if (list instanceof HTMLElement && list.id) button.setAttribute("aria-controls", list.id)
      else button.removeAttribute("aria-controls")
    })
  }

  function annotateControls() {
    document.querySelectorAll<HTMLElement>(".explorer").forEach(syncExplorer)
    document.querySelectorAll<HTMLElement>(".explorer .folder-icon").forEach(syncFolder)
    syncToc()
  }

  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return
      const toggle = event.target.closest<HTMLElement>(".explorer-toggle")
      if (toggle) {
        const explorer = toggle.closest<HTMLElement>(".explorer")
        if (!explorer) return
        event.preventDefault()
        event.stopImmediatePropagation()
        setExplorerOpen(explorer, explorer.classList.contains("collapsed"))
        return
      }
      const icon = event.target.closest<HTMLElement>(".explorer .folder-icon")
      if (icon) {
        event.preventDefault()
        event.stopImmediatePropagation()
        toggleFolder(icon)
      }
    },
    true,
  )

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && isMobile()) {
        document
          .querySelectorAll<HTMLElement>(".explorer:not(.collapsed)")
          .forEach((explorer) => setExplorerOpen(explorer, false))
      }
      if (!(event.target instanceof Element)) return
      const icon = event.target.closest<HTMLElement>(".explorer .folder-icon")
      if (icon && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault()
        event.stopImmediatePropagation()
        toggleFolder(icon)
      }
    },
    true,
  )

  new MutationObserver(annotateControls).observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class", "aria-expanded"],
  })
  // Quartz's explorer script sets aria-expanded on the root div during nav,
  // after our synchronous pass. Strip it on the next microtask.
  document.addEventListener("nav", () => queueMicrotask(annotateControls))
  document.addEventListener("render", () => queueMicrotask(annotateControls))
  annotateControls()

  // Keep wide equations at a readable size, with an explicit scroll affordance
  // and keyboard access instead of silently cropping or shrinking the maths.
  let equationObserver: ResizeObserver | undefined
  let equationId = 0
  function prepareEquations() {
    equationObserver?.disconnect()
    equationObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const equation = entry.target as HTMLElement
        const overflows = equation.scrollWidth > equation.clientWidth + 1
        let hint = equation.nextElementSibling
        if (!hint?.classList.contains("equation-scroll-hint")) hint = null
        if (overflows) {
          equation.tabIndex = 0
          if (!hint) {
            hint = document.createElement("span")
            hint.className = "equation-scroll-hint"
            hint.id = `equation-scroll-hint-${equationId++}`
            hint.textContent = "Scroll to read the full equation ↔"
            equation.after(hint)
          }
          equation.setAttribute("aria-describedby", hint.id)
        } else {
          equation.removeAttribute("tabindex")
          equation.removeAttribute("aria-describedby")
          hint?.remove()
        }
      }
    })
    document.querySelectorAll("article mjx-container.MathJax").forEach((equation) => {
      equationObserver!.observe(equation)
    })
  }
  document.addEventListener("nav", prepareEquations)
  document.addEventListener("render", prepareEquations)
  prepareEquations()
}
