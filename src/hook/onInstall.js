chrome.runtime.onInstalled.addListener(async () => {
    await migrateLegacyStorageFormat()

    const options = await chrome.storage.local.get()
    if (!options) {
        loadDefaultOptions()
    }

    function loadDefaultOptions() {
        const defaultOptions = {
            enabled: true,
            topMargin: 0,
            bottomMargin: 0,
            opacity: 0.6,
            chatMode: "topChat",
            position: "right",
            header: false,
            toggleButton: true,
            chatInput: true,
        }
        chrome.storage.local.set(defaultOptions)
    }

    async function migrateLegacyStorageFormat() {
        const { options } = await chrome.storage.local.get()
        if (options) {
            chrome.storage.local.remove("options")
            chrome.storage.local.set(options)
        }
    }
})