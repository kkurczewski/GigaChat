// @ts-nocheck

window.addEventListener("load", async () => {
  console.debug("Lookup nodes...")

  const root = await find(document, "#content #page-manager")
  console.debug("Found", root)

  const videoContainer = await find(root, "ytd-watch-flexy")
  console.debug("Found", videoContainer)

  options.enabled(enabled => {
    window.performance.mark("enabled-changed")
    videoContainer.classList.toggle("overlay", enabled)
  })
  options.position(position => {
    window.performance.mark("position-changed")
    videoContainer.classList.toggle("left", position === "left")
  })
  options.settings(settings => {
    window.performance.mark("settings-changed")
    videoContainer.dataset.settings = settings
  })

  observe(videoContainer, "#chat", async (chat) => {
    console.debug("Found", chat)

    options.topMargin(topMargin => {
      window.performance.mark("top-margin-changed")
      chat.style.setProperty("--top-margin", `${topMargin}%`)
    })
    options.bottomMargin(bottomMargin => {
      window.performance.mark("bottom-margin-changed")
      chat.style.setProperty("--bottom-margin", `${bottomMargin}%`)
    })
  })
})