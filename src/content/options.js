// Note: every iframe has separate options object
const options = (() => {
  const listeners = {}
  // @ts-ignore
  chrome.storage.onChanged.addListener((/** @type {any} */ options) => {
    for (const [property, change] of Object.entries(options)) {
      if (change.newValue != null) {
        listeners?.[property]?.(change.newValue)
      }
    }
  })
  async function registerListener(/** @type {string} */ property, /** @type {function} */ callback) {
    listeners[property] = callback
    // @ts-ignore
    const options = await chrome.storage.local.get(property)
    const currentValue = options[property]
    if (currentValue != null) {
      callback(currentValue)
    }
  }
  return Object.assign({}, ...[
    "chatInput",
    "chatMode",
    "enabled",
    "header",
    "opacity",
    "position",
    "topMargin",
    "chatHeight",
  ].map(property => ({
    [property]: (/** @type {function} */ callback) => registerListener(property, callback)
  })))
})()