const STORAGE_OPTIONS = "options";
const DEFAULT_OPTIONS = {
    enabled: true,
    topMargin: 0,
    bottomMargin: 0,
    opacity: 0.6,
    chatMode: "topChat",
    position: "right",
    header: false,
    toggleButton: true,
    chatInput: true,
};

chrome.runtime.onInstalled.addListener(_details => {
    chrome.storage.local.set({ [STORAGE_OPTIONS]: DEFAULT_OPTIONS });
    console.log("Loaded default options");
});