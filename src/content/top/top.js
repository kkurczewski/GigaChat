const HIDDEN_CLASS = "x-hidden"

addEventListener("load", async () => {
  const cssRoot = document.querySelector(":root")
  const container = await queryNode(document, "ytd-watch-flexy");
  const chat = await queryNode(container, "#chat");

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