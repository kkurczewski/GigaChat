// @ts-nocheck
const HIDDEN_CLASS = "x-hidden"

window.addEventListener("load", async () => {
  window.performance.mark("frame-loaded")
  const chat = document.querySelector("yt-live-chat-app")
  const chatFrame = chat.querySelector("yt-live-chat-renderer")

  if (!chatFrame) {
    // ended premiere doesn't contains chat frame
    return
  }

  options.opacity(opacity => {
    window.performance.mark("opacity-changed")
    chatFrame.style.setProperty("--opacity", opacity)
  })
  options.header(header => {
    chatFrame.querySelector("yt-live-chat-header-renderer").classList.toggle(HIDDEN_CLASS, !header)
  })
  options.chatInput(chatInput => {
    chatFrame.querySelector("#panel-pages").classList.toggle(HIDDEN_CLASS, !chatInput)
  })
  options.chatMode(chatMode => {
    const chatMenu = chatFrame.querySelector("#trigger #label")
    chatMenu.click()

    const index = ["topChat", "liveChat"].indexOf(chatMode)
    chatFrame.querySelectorAll("#menu a")[index].click()
  })

  const topDocument = window.parent.document
  topDocument.addEventListener("fullscreenchange", ({ target }) => {
    chat.classList.toggle("fullscreen", target.ownerDocument.fullscreenElement != null)
  })
  chat.classList.toggle("fullscreen", topDocument.fullscreenElement != null)
})