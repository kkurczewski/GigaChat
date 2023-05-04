const options = (() => {
  const callbacksRegistry = {}
  chrome.storage.onChanged.addListener(options => {
    for (let [property, change] of Object.entries(options)) {
      if (change.newValue != null) {
        callbacksRegistry?.[property]?.(change.newValue)
      }
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
    bottomMargin: (callback) => registerCallback("bottomMargin", callback),
    chatInput: (callback) => registerCallback("chatInput", callback),
    chatMode: (callback) => registerCallback("chatMode", callback),
    enabled: (callback) => registerCallback("enabled", callback),
    header: (callback) => registerCallback("header", callback),
    opacity: (callback) => registerCallback("opacity", callback),
    placement: (callback) => registerCallback("placement", callback),
    position: (callback) => registerCallback("position", callback),
    settings: (callback) => registerCallback("settings", callback),
    toggleButton: (callback) => registerCallback("toggleButton", callback),
    topMargin: (callback) => registerCallback("topMargin", callback),
  }
})()