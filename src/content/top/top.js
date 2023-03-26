const HIDDEN_CLASS = "x-hidden"

addEventListener("load", async () => {
  const cssRoot = document.querySelector(":root")
  const root = document.querySelector("#content #page-manager");
  const videoContainer = await find(root, "ytd-watch-flexy");
  const chatContainer = videoContainer.querySelector("#secondary #secondary-inner");
  const chat = await find(chatContainer, "#chat");

  options.enabled(enabled => {
    document.body.classList.toggle("overlay", enabled)
  })
  options.position(position => {
    document.body.classList.toggle("left", position === "left")
  })
  options.toggleButton(toggleButton => {
    chat.querySelector("#show-hide-button").classList.toggle(HIDDEN_CLASS, !toggleButton)
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
})