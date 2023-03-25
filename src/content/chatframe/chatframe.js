const HIDDEN_CLASS = "x-hidden"

window.addEventListener("load", async () => {
  const chatFrame = document.querySelector("yt-live-chat-app")
  const cssRoot = document.querySelector(":root")

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
  options.enabled(enabled => {
    document.body.classList.toggle("overlay", enabled)
  })

  createRawColorProperty("--yt-live-chat-background-color")
  createRawColorProperty("--yt-live-chat-header-background-color")

  const topDocument = window.parent.document
  topDocument.addEventListener("fullscreenchange", ({ target }) => {
    document.body.classList.toggle("fullscreen", target.ownerDocument.fullscreenElement != null)
  })
  document.body.classList.toggle("fullscreen", topDocument.fullscreenElement != null)

  function createRawColorProperty(property) {
    const color = getComputedStyle(cssRoot).getPropertyValue(property).trim()
    cssRoot.style.setProperty(property + "-raw", extractRawColor(color))

    function extractRawColor(color) {
      return color.startsWith("#")
        ? extractRawColorFromHex(color)
        : extractRawColorFromRgb(color)

      function extractRawColorFromHex(hexColor) {
        return hexColor
          .replace("#", "")
          .split(/(..)/)
          .filter(String)
          .map(s => parseInt(s, 16))
          .join(',')
      }

      function extractRawColorFromRgb(rgbColor) {
        return rgbColor
          .replace("rgba(", "")
          .replace(/,[^,]*[)]/, "")
          .trim()
      }
    }
  }
})
