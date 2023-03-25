const options = (() => {
  async function propertyCallback(property, callback) {
    const options = await chrome.storage.local.get(property)
    chrome.storage.onChanged.addListener(options => callback(options[property].newValue))
    callback(options[property])
  }
  return {
    enabled: (callback) => propertyCallback("enabled", callback),
    position: (callback) => propertyCallback("position", callback),
    topMargin: (callback) => propertyCallback("topMargin", callback),
    bottomMargin: (callback) => propertyCallback("bottomMargin", callback),
    opacity: (callback) => propertyCallback("opacity", callback),
    chatMode: (callback) => propertyCallback("chatMode", callback),
    header: (callback) => propertyCallback("header", callback),
    chatInput: (callback) => propertyCallback("chatInput", callback),
    toggleButton: (callback) => propertyCallback("toggleButton", callback),
  }
})()
