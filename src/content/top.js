const CSS_ROOT = ":root";
const APP_ROOT = "ytd-app";
const CHAT = "#chat";
const CHAT_SIBLING = "#chat-template";
const VIDEO_CONTAINER = "#ytd-player #container #movie_player";
const VIDEO = "ytd-watch-flexy";
const TOGGLE_BUTTON = "#show-hide-button";

const OVERLAY_CLASS = "overlay";
const HIDDEN_CLASS = "x-hidden";
const LEFT_CLASS = "left";
const RIGHT_CLASS = "right";

const FULLSCREEN_ATTRIBUTE = "fullscreen";

const OPACITY_VAR = "--opacity";
const TOP_MARGIN_VAR = "--top-margin";
const BOTTOM_MARGIN_VAR = "--bottom-margin";

const STORAGE_OPTIONS = "options";

window.addEventListener("onload", applyOverlay);
window.addEventListener("yt-navigate-start", cleanupStaleOverlay);
window.addEventListener("yt-navigate-finish", applyOverlay);

async function applyOverlay() {
  if (window.location.pathname !== "/watch") {
    return;
  }
  let options = (await chrome.storage.local.get(STORAGE_OPTIONS)).options;
  console.log("Loading options:", options);

  const cssRoot = document.querySelector(CSS_ROOT);
  const appRoot = document.querySelector(APP_ROOT);

  const videoContainer = await pollNode(appRoot, VIDEO_CONTAINER);
  const video = await pollNode(appRoot, VIDEO);

  const chat = await tryLoad(CHAT); if (!chat) return;
  const chatSibling = appRoot.querySelector(CHAT_SIBLING);

  setupListeners();
  loadOptions();

  function loadOptions() {
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
      cssRoot.style.setProperty(TOP_MARGIN_VAR, options.topMargin + "%");
      cssRoot.style.setProperty(BOTTOM_MARGIN_VAR, options.bottomMargin + "%");
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
      loadOptions();
    });

    chatframe.onload = () => {
      console.debug("Frame reloaded");
      loadOptions();
    }

    registerAttributeObserver(video, FULLSCREEN_ATTRIBUTE, () => {
      console.log("Fullscreen toggled");
      loadOptions();
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

function cleanupStaleOverlay() {
  const chat = document.querySelector(CHAT);
  if (chat != null) {
    restoreOldPosition();
  }

  function restoreOldPosition() {
    const chatSibling = document.querySelector(CHAT_SIBLING);
    const originalParent = chatSibling.parentNode;
    if (chat.parentNode !== originalParent) {
      console.debug("Restoring original parent node:", originalParent);
      originalParent.insertBefore(chat, chatSibling);
    }
  }
}
