// @ts-nocheck

window.addEventListener("load", async () => {
  console.debug("Lookup nodes...")

  const root = await find(document, "#page-manager", true) // deep search prevents node miss
  console.debug("Found", root)

  const videoContainer = await find(root, "ytd-watch-flexy")
  console.debug("Found", videoContainer)

  const chatContainer = await find(videoContainer, "#chat-container")
  console.debug("Found", chatContainer)

  options.enabled(enabled => {
    window.performance.mark("enabled-changed")
    chatContainer.classList.toggle("overlay", enabled)
  })
  options.position(position => {
    window.performance.mark("position-changed")
    chatContainer.classList.toggle("left", position === "left")
  })
  options.topMargin(topMargin => {
    chatContainer.style.setProperty("--top-margin", `${topMargin}%`)
  })
  options.chatHeight(chatHeight => {
    chatContainer.style.setProperty("--chat-height", `${chatHeight}%`)
  })
})