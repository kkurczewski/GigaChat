const HIDDEN_CLASS = "x-hidden"

window.addEventListener("load", async () => {
  const cssRoot = document.querySelector(":root")
  const root = document.querySelector("#content #page-manager")

  options.enabled(enabled => {
    document.body.classList.toggle("overlay", enabled)
    document.body.classList.toggle("drag-mode", enabled)
    document.body.classList.toggle("manual-placement", enabled)
  })
  options.placement(placement => {
    const dragMode = placement == "drag"
    document.body.classList.toggle("drag-mode", dragMode)
    document.body.classList.toggle("manual-placement", dragMode)
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

  const videoContainer = await find(root, "ytd-watch-flexy")
  const chatContainer = videoContainer.querySelector("#secondary #secondary-inner")

  const chat = await find(chatContainer, "#chat")
  options.toggleButton(toggleButton => {
    chat.querySelector("#show-hide-button").classList.toggle(HIDDEN_CLASS, !toggleButton)
  })

  installDragActions(chat)
})