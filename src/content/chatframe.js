const CSS_ROOT = ":root";
const CHAT_FRAME_ROOT = "yt-live-chat-app";
const CHAT = "#chat-messages";
const CHAT_SEPARATOR = "#input-panel";
const CHAT_HEADER_MENU = "#trigger #label";
const CHAT_HEADER_OPTION = "#menu a:not(.iron-selected)";
const CHAT_INPUT = "#input-panel"

const CHAT_MSG_BG_COLOR = "--yt-live-chat-background-color";
const CHAT_INPUT_BG_COLOR = "--yt-spec-brand-background-primary"
const CHAT_HIGHLIGHT_MSG_BG_COLOR = "--yt-live-chat-message-highlight-background-color";
const RAW_COLOR_POSTFIX = "-raw";

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

  createRawColors();
  onOptionsUpdated(options);

  function onOptionsUpdated(options) {
    updateOpacity();
    updateChatHeader();
    updateChatMode();
    updateChatInput();

    function updateChatMode() {
      if (options.liveChat) {
        const chatMenu = chatFrame.querySelector(CHAT_HEADER_MENU);
        if (chatMenu.innerText === 'Top chat replay') {
          chatMenu.click();
          chatFrame.querySelector(CHAT_HEADER_OPTION).click();
        }
      }
    }

    function updateChatHeader() {
      chatFrame.querySelector(CHAT).classList.toggle(HIDDEN_CLASS, !options.header);
      chatFrame.querySelector(CHAT_SEPARATOR).classList.toggle(HIDDEN_CLASS, !options.toggleButton);
    }

    function updateChatInput() {
      chatFrame.querySelector(CHAT_INPUT).classList.toggle(HIDDEN_CLASS, !options.chatInput);
    }

    function updateOpacity() {
      cssRoot.style.setProperty(OPACITY_VAR, options.opacity);
    }
  }

  function createRawColors() {
    [
      CHAT_MSG_BG_COLOR,
      CHAT_INPUT_BG_COLOR,
      CHAT_HIGHLIGHT_MSG_BG_COLOR,
    ].forEach(createRawColorProperty);

    function createRawColorProperty(property) {
      const color = getComputedStyle(cssRoot).getPropertyValue(property).trim();
      cssRoot.style.setProperty(property + RAW_COLOR_POSTFIX, extractRawColor(color));

      function extractRawColor(color) {
        return color.startsWith("#")
          ? extractRawColorFromHex(color)
          : extractRawColorFromRgb(color);

        function extractRawColorFromHex(hexColor) {
          return hexColor
            .replace("#", "")
            .split(/(..)/)
            .filter(String)
            .map(s => parseInt(s, 16))
            .join(',');
        }

        function extractRawColorFromRgb(rgbColor) {
          return rgbColor
            .replace("rgba(", "")
            .replace(/,[^,]*[)]/, "")
            .trim();
        }
      }
    }
  }
}