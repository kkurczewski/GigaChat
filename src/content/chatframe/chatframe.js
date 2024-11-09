// @ts-nocheck
const HIDDEN_CLASS = "x-hidden"

window.addEventListener("load", async () => {
  const chatFrame = document.querySelector("yt-live-chat-app")
  const cssRoot = document.querySelector(":root")

  options.enabled(enabled => {
    document.body.classList.toggle("overlay", enabled)
  })
  options.opacity(opacity => {
    cssRoot.style.setProperty("--opacity", opacity)
  })
  options.header(header => {
    chatFrame.querySelector("#chat-messages").classList.toggle(HIDDEN_CLASS, !header)
  })
  options.chatInput(chatInput => {
    chatFrame.querySelector("#input-panel").classList.toggle(HIDDEN_CLASS, !chatInput)
  })
  options.chatMode(chatMode => {
    const chatMenu = chatFrame.querySelector("#trigger #label")
    chatMenu.click()

    const index = ["topChat", "liveChat"].indexOf(chatMode)
    chatFrame.querySelectorAll("#menu a")[index].click()
  })

  const topDocument = window.parent.document
  topDocument.addEventListener("fullscreenchange", ({ target }) => {
    document.body.classList.toggle("fullscreen", target.ownerDocument.fullscreenElement != null)
  })
  document.body.classList.toggle("fullscreen", topDocument.fullscreenElement != null)
})
