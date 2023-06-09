const options = (() => {
  const callbacksRegistry = {}
  chrome.storage.onChanged.addListener(options => {
    for (let [property, change] of Object.entries(options)) {
      callbacksRegistry?.[property]?.(change.newValue)
    }
  })
  async function registerCallback(property, callback) {
    callbacksRegistry[property] = callback
    const options = await chrome.storage.local.get(property)
    const currentValue = options[property]
    if (currentValue != null) {
      callback(currentValue)
    }
  }
  return {
    enabled: (callback) => registerCallback("enabled", callback),
    position: (callback) => registerCallback("position", callback),
    topMargin: (callback) => registerCallback("topMargin", callback),
    bottomMargin: (callback) => registerCallback("bottomMargin", callback),
    opacity: (callback) => registerCallback("opacity", callback),
    chatMode: (callback) => registerCallback("chatMode", callback),
    header: (callback) => registerCallback("header", callback),
    chatInput: (callback) => registerCallback("chatInput", callback),
    toggleButton: (callback) => registerCallback("toggleButton", callback),
  }
})()
