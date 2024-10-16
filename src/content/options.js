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
  return Object.assign({}, ...[
    "bottomMargin",
    "chatInput",
    "chatMode",
    "enabled",
    "header",
    "opacity",
    "position",
    "reactions",
    "settings",
    "topMargin",
  ].map(property => ({
    [property]: (/** @type {function} */ callback) => registerListener(property, callback)
  })))
})()