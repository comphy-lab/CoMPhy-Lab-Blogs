// Quartz's downloaded Explorer attaches a new set of toggle listeners on each
// nav/render event. Handle these controls once in capture phase so a click
// changes state exactly once, including after SPA navigation.
const explorerWindow = window as Window & { comphyExplorerControlsReady?: boolean }

if (!explorerWindow.comphyExplorerControlsReady) {
  explorerWindow.comphyExplorerControlsReady = true

  const isMobile = () => window.matchMedia("(max-width: 800px)").matches

  function syncExplorer(explorer: HTMLElement) {
    const expanded = !explorer.classList.contains("collapsed")
    const content = explorer.querySelector<HTMLElement>(".explorer-content")
    content?.setAttribute("aria-expanded", String(expanded))
    explorer.setAttribute("aria-expanded", String(expanded))
    explorer.querySelectorAll<HTMLButtonElement>(".explorer-toggle").forEach((button) => {
      button.setAttribute("aria-expanded", String(expanded))
      button.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation")
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
    icon.setAttribute("aria-expanded", String(open))
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

  function annotateControls() {
    document.querySelectorAll<HTMLElement>(".explorer").forEach(syncExplorer)
    document.querySelectorAll<HTMLElement>(".explorer .folder-icon").forEach(syncFolder)
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
    attributeFilter: ["class"],
  })
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
