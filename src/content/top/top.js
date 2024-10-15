// @ts-nocheck
const HIDDEN_CLASS = "x-hidden"

// requires "run_at" in manifest to be set to "document_start" in order to not miss event
// "DOMContentLoaded" causes CSS recalculation to take less time (order of 1ms instead of ~50ms)
window.addEventListener("DOMContentLoaded", async () => {
  window.performance.mark("top-loaded")
  const cssRoot = document.querySelector(":root") // accessing :root causes recalculation but it doesn't adds up a lot on initial load

  options.enabled(enabled => {
    window.performance.mark("enabled-changed")
    document.body.classList.toggle("overlay", enabled)
  })
  options.position(position => {
    window.performance.mark("position-changed")
    document.body.classList.toggle("left", position === "left")
  })
  options.settings(settings => {
    window.performance.mark("settings-changed")
    document.body.dataset.settings = settings
  })

  const root = await find(document, "#content #page-manager")
  const videoContainer = await find(root, "ytd-watch-flexy")
  const chat = await find(videoContainer, "#chat")

  options.opacity(opacity => {
    window.performance.mark("opacity-changed")
    chat.style.setProperty("--opacity", opacity)
  })
  options.topMargin(topMargin => {
    window.performance.mark("top-margin-changed")
    chat.style.setProperty("--top-margin", topMargin + "%")
  })
  options.bottomMargin(bottomMargin => {
    window.performance.mark("bottom-margin-changed")
    chat.style.setProperty("--bottom-margin", bottomMargin + "%")
  })
  options.toggleButton(toggleButton => {
    chat.querySelector("#show-hide-button").classList.toggle(HIDDEN_CLASS, !toggleButton)
  })
})