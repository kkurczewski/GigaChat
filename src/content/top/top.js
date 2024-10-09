// @ts-nocheck
const HIDDEN_CLASS = "x-hidden"

window.addEventListener("load", async () => {
  const cssRoot = document.querySelector(":root")

  options.enabled(enabled => {
    document.body.classList.toggle("overlay", enabled)
  })
  options.position(position => {
    document.body.classList.toggle("left", position === "left")
  })
  options.settings(settings => {
    document.body.dataset.settings = settings
  })
  options.opacity(opacity => {
    cssRoot.style.setProperty("--opacity", opacity)
  })
  options.topMargin(topMargin => {
    cssRoot.style.setProperty("--top-margin", topMargin + "%")
  })
  options.bottomMargin(bottomMargin => {
    cssRoot.style.setProperty("--bottom-margin", bottomMargin + "%")
  })

  const root = await find(document, "#content #page-manager")
  const videoContainer = await find(root, "ytd-watch-flexy")
  const chat = await find(videoContainer, "#chat")

  options.toggleButton(toggleButton => {
    chat.querySelector("#show-hide-button").classList.toggle(HIDDEN_CLASS, !toggleButton)
  })
})