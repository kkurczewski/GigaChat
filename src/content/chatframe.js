const CSS_ROOT = ":root";
const CHAT_FRAME_ROOT = "yt-live-chat-app";
const CHAT_MESSAGES = "#chat-messages";
const CHAT_SEPARATOR = "#input-panel";

const CHAT_BG_COLOR_VAR = "--yt-live-chat-background-color";
const CHAT_INPUT_BG_COLOR_VAR = "--yt-spec-brand-background-primary"

const CHAT_BG_RAW_COLOR_VAR = "--chat-bg-color";
const CHAT_INPUT_BG_RAW_COLOR_VAR = "--chat-input-bg-color";

const OPACITY_VAR = "--opacity";

const HIDDEN_CLASS = "x-hidden";

const STORAGE_OPTIONS = "options";

window.onload = async () => {
  const cssRoot = document.querySelector(CSS_ROOT);
  const chatFrame = document.querySelector(CHAT_FRAME_ROOT);
  const options = (await chrome.storage.local.get(STORAGE_OPTIONS)).options;

  console.log("Loading options:", options);

  chrome.storage.onChanged.addListener(changes => {
    const options = changes.options.newValue;
    console.log("Reloading options:", options);
    onOptionsUpdated(options);
  });

  addChatBgColorConst();
  addChatInputBgColorConst();
  onOptionsUpdated(options);

  function onOptionsUpdated(options) {
    updateOpacity();
    updateChatHeader();

    function updateChatHeader() {
      chatFrame.querySelector(CHAT_MESSAGES).classList.toggle(HIDDEN_CLASS, !options.header);
      chatFrame.querySelector(CHAT_SEPARATOR).classList.toggle(HIDDEN_CLASS, !options.toggleButton);
    }

    function updateOpacity() {
      cssRoot.style.setProperty(OPACITY_VAR, options.opacity);
    }
  }

  function addChatBgColorConst() {
    const bgHex = getComputedStyle(cssRoot).getPropertyValue(CHAT_BG_COLOR_VAR).trim();
    cssRoot.style.setProperty(CHAT_BG_RAW_COLOR_VAR, asRgbColor(bgHex));

    function asRgbColor(hex) {
      return hex
        .replace("#", "")
        .split(/(..)/)
        .filter(String)
        .map(s => parseInt(s, 16))
        .join(',');
    }
  }

  function addChatInputBgColorConst() {
    const bgRgba = getComputedStyle(cssRoot).getPropertyValue(CHAT_INPUT_BG_COLOR_VAR).trim();
    cssRoot.style.setProperty(CHAT_INPUT_BG_RAW_COLOR_VAR, asRgbColor(bgRgba));

    function asRgbColor(rgba) {
      return rgba
        .replace("rgba(", "")
        .replace(/,[^,]*[)]/, "")
        .trim();
    }
  }
}