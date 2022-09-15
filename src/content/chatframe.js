const CSS_ROOT = ":root";
const CHAT_FRAME_ROOT = "yt-live-chat-app";
const CHAT = "#chat-messages";
const CHAT_SEPARATOR = "#input-panel";
const CHAT_HEADER_MENU = "#trigger #label";
const CHAT_HEADER_OPTIONS = "#menu a";
const CHAT_INPUT = "#input-panel"

const CHAT_MSG_BG_COLOR = "--yt-live-chat-background-color";
const CHAT_HEADER_COLOR = "--yt-live-chat-header-background-color"
const RAW_COLOR_POSTFIX = "-raw";

const OPACITY_VAR = "--opacity";

const HIDDEN_CLASS = "x-hidden";

const TOP_CHAT_MODE = "topChat";
const LIVE_CHAT_MODE = "liveChat";

const STORAGE_OPTIONS = "options";

window.onload = async () => {
  const cssRoot = document.querySelector(CSS_ROOT);
  const chatFrame = document.querySelector(CHAT_FRAME_ROOT);
  const options = (await chrome.storage.local.get(STORAGE_OPTIONS)).options;

  logger.info("Loading options:", options);

  chrome.storage.onChanged.addListener(changes => {
    const updatedOptions = changes.options.newValue;
    logger.info("Reloading options:", updatedOptions);
    loadOptions(updatedOptions);
  });

  createRawColors();
  loadOptions(options);

  function loadOptions(options) {
    updateOpacity();
    updateChatHeader();
    updateChatMode();
    updateChatInput();

    function updateChatMode() {
      const chatMenu = chatFrame.querySelector(CHAT_HEADER_MENU);
      chatMenu.click();

      const index = getOptionIndex(options.chatMode);
      chatFrame.querySelectorAll(CHAT_HEADER_OPTIONS)[index].click();

      function getOptionIndex(chatMode) {
        switch (chatMode) {
          case TOP_CHAT_MODE:
            return 0;
          case LIVE_CHAT_MODE:
            return 1;
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
      CHAT_HEADER_COLOR,
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