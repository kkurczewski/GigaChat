const CSS_ROOT = ":root";
const APP_ROOT = "ytd-app";
const CHAT = "#chat";
const CHAT_SIBLING = "#chat-template";
const VIDEO_CONTAINER = "#ytd-player #container";
const VIDEO = "ytd-watch-flexy";
const TOGGLE_BUTTON = "#show-hide-button";

const OVERLAY_CLASS = "overlay";
const HIDDEN_CLASS = "x-hidden";
const LEFT_CLASS = "left";
const RIGHT_CLASS = "right";

const FULLSCREEN_ATTRIBUTE = "fullscreen";

const OPACITY_VAR = "--opacity";
const CHAT_HEIGHT_VAR = "--chat-height";
const TOP_MARGIN_VAR = "--top-margin";

const STORAGE_OPTIONS = "options";

const MAX_CHAT_HEIGHT = 100;
const MAX_TOP_MARGIN = 60;

window.onload = async () => {
  let options = (await chrome.storage.local.get(STORAGE_OPTIONS)).options;
  console.log("Loading options:", options);

  const cssRoot = document.querySelector(CSS_ROOT);
  const appRoot = document.querySelector(APP_ROOT);

  const videoContainer = await pollNode(appRoot, VIDEO_CONTAINER);
  const video = await pollNode(appRoot, VIDEO);

  const chat = await tryLoad(CHAT); if (!chat) return;
  const chatSibling = appRoot.querySelector(CHAT_SIBLING);

  setupListeners();
  onOptionsUpdated();

  function onOptionsUpdated() {
    updateTreePosition();
    updateCssPosition();
    updateStyleVariables();
    updateToggleButton();
    styleFrame();

    function updateTreePosition() {
      console.debug("Updating tree position:", options.enabled);
      if (!overlayActive()) {
        restoreOldPosition();
      } else if (chat.parentNode !== videoContainer) {
        console.debug("Moving chat, old parent:", chat.parentNode);
        videoContainer.appendChild(chat);
      }

      function restoreOldPosition() {
        const originalParent = chatSibling.parentNode;
        if (chat.parentNode !== originalParent) {
          console.debug("Restoring original parent node:", originalParent);
          originalParent.insertBefore(chat, chatSibling);
        }
      }
    }

    function updateCssPosition() {
      console.debug("Update position:", options.position);
      switch (options.position) {
        case LEFT_CLASS:
          chat.classList.add(LEFT_CLASS);
          chat.classList.remove(RIGHT_CLASS);
          break;
        case RIGHT_CLASS:
          chat.classList.add(RIGHT_CLASS);
          chat.classList.remove(LEFT_CLASS);
          console.debug(chat.classList);
          break;
      }
    }

    function updateStyleVariables() {
      cssRoot.style.setProperty(OPACITY_VAR, options.opacity);
      cssRoot.style.setProperty(CHAT_HEIGHT_VAR, options.chatHeight * MAX_CHAT_HEIGHT + "%");
      cssRoot.style.setProperty(TOP_MARGIN_VAR, options.topMargin * MAX_TOP_MARGIN + "%");
    }

    function updateToggleButton() {
      chat.querySelector(TOGGLE_BUTTON).classList.toggle(HIDDEN_CLASS, !options.toggleButton);
    }

    function styleFrame() {
      chatframe.contentDocument.body.classList.toggle(OVERLAY_CLASS, overlayActive());
    }

    function overlayActive() {
      return options.enabled && (options.preview || isFullscreen());

      function isFullscreen() {
        return video.hasAttribute(FULLSCREEN_ATTRIBUTE);
      }
    }
  }

  function setupListeners() {
    chrome.storage.onChanged.addListener(changes => {
      options = changes.options.newValue;
      console.log("Reloading options:", options);
      onOptionsUpdated();
    });

    chatframe.onload = () => {
      console.debug("Frame reloaded");
      onOptionsUpdated();
    }

    registerAttributeObserver(video, FULLSCREEN_ATTRIBUTE, () => {
      console.log("Fullscreen toggled");
      onOptionsUpdated();
    });
  }

  async function tryLoad(selector) {
    try {
      return await pollNode(appRoot, selector);
    } catch (e) {
      if (e instanceof Error) {
        console.error("Failed to load", selector, e);
      } else {
        console.debug("Failed to load", selector, e);
      }
      return null;
    }
  }
}