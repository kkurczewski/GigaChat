const options = {
  enabled: async (callback) => {
    const { enabled } = await chrome.storage.local.get("enabled")
    callback(enabled)
    chrome.storage.onChanged.addListener(({ enabled }) => callback(enabled.newValue))
  },
  position: async (callback) => {
    const { position } = await chrome.storage.local.get("position")
    callback(position)
    chrome.storage.onChanged.addListener(({ position }) => callback(position.newValue))
  },
  topMargin: async (callback) => {
    const { topMargin } = await chrome.storage.local.get("topMargin")
    callback(topMargin)
    chrome.storage.onChanged.addListener(({ topMargin }) => callback(topMargin.newValue))
  },
  bottomMargin: async (callback) => {
    const { bottomMargin } = await chrome.storage.local.get("bottomMargin")
    callback(bottomMargin)
    chrome.storage.onChanged.addListener(({ bottomMargin }) => callback(bottomMargin.newValue))
  },
  opacity: async (callback) => {
    const { opacity } = await chrome.storage.local.get("opacity")
    callback(opacity)
    chrome.storage.onChanged.addListener(({ opacity }) => callback(opacity.newValue))
  },
  chatMode: async (callback) => {
    const { chatMode } = await chrome.storage.local.get("chatMode")
    callback(chatMode)
    chrome.storage.onChanged.addListener(({ chatMode }) => callback(chatMode.newValue))
  },
  header: async (callback) => {
    const { header } = await chrome.storage.local.get("header")
    callback(header)
    chrome.storage.onChanged.addListener(({ header }) => callback(header.newValue))
  },
  chatInput: async (callback) => {
    const { chatInput } = await chrome.storage.local.get("chatInput")
    callback(chatInput)
    chrome.storage.onChanged.addListener(({ chatInput }) => callback(chatInput.newValue))
  },
  toggleButton: async (callback) => {
    const { toggleButton } = await chrome.storage.local.get("toggleButton")
    callback(toggleButton)
    chrome.storage.onChanged.addListener(({ toggleButton }) => callback(toggleButton.newValue))
  },
}