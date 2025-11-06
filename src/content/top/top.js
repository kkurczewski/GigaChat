// @ts-nocheck

const HIDDEN_CLASS = "x-hidden"

window.addEventListener("load", async () => {
  console.debug("Lookup nodes...")

  const root = await find(document.body, "#page-manager", true) // deep search prevents node miss
  console.debug("Found", root)

  const videoContainer = await find(root, "ytd-watch-flexy")
  console.debug("Found", videoContainer)

  const panelsContainer = /** @type {HTMLElement} */ (await find(videoContainer, "#panels-full-bleed-container"))
  console.debug("Found", panelsContainer)

  options.enabled(enabled => {
    panelsContainer.classList.toggle("overlay", enabled)
  })
  options.position(position => {
    panelsContainer.classList.toggle("left", position === "left")
  })
  options.topMargin(topMargin => {
    panelsContainer.style.setProperty("--top-margin", topMargin)
  })
  options.chatHeight(chatHeight => {
    panelsContainer.style.setProperty("--chat-height", chatHeight)
  })

  /* comments section only */
  options.opacity(opacity => {
    panelsContainer.style.setProperty("--opacity", opacity)
  })
  options.header(async header => {
    const commentsHeader = await find(panelsContainer, "#panels #header:has(+ #content)")
    commentsHeader.classList.toggle(HIDDEN_CLASS, !header)
  })
  options.chatInput(async chatInput => {
    const commentsInput = await find(panelsContainer, "#panels #header > ytd-comments-header-renderer")
    commentsInput.classList.toggle(HIDDEN_CLASS, !chatInput)
  })
})