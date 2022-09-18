const CSS_ROOT = ":root";
const APP_ROOT = "ytd-app";
const CHAT = "#chat";
const CHAT_FRAME = "#chatframe";
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

window.addEventListener("onload", () => applyOverlay("onload"));
window.addEventListener("yt-navigate-start", cleanupStaleOverlay);
window.addEventListener("yt-navigate-finish", () => applyOverlay("navigate-finish"));

function applyOverlay(reason) {
  try {
    const traceId = randomId();
    _applyOverlay(traceId, reason);
  } catch (e) {
    logger.info(`[${traceId}]`, e);
  }
}

async function _applyOverlay(traceId, reason) {
  logger.debug(`Trace id: ${traceId}`);
  logger.debug(`applyOverlay(${reason})`);
  if (window.location.pathname !== "/watch") {
    logger.debug("Not video page, skipping...");
    return;
  }
  let options = (await chrome.storage.local.get(STORAGE_OPTIONS)).options;

  logger.group("Await nodes");
  logger.info(options);
  const cssRoot = document.querySelector(CSS_ROOT);
  const appRoot = document.querySelector(APP_ROOT);

  const videoContainer = await awaitNode(appRoot, VIDEO_CONTAINER);
  const video = await awaitNode(appRoot, VIDEO);
  const chat = await awaitNode(appRoot, CHAT, false); if (!chat) return;
  const chatFrame = await awaitNode(appRoot, CHAT_FRAME);
  const chatSibling = appRoot.querySelector(CHAT_SIBLING);

  chat.classList.toggle(traceId);
  logger.groupEnd();

  setupListeners();
  updateOverlay(reason);

  async function updateOverlay(reason) {
    try {
      const chatNodes = document.querySelectorAll(CHAT);
      logger.debug(`[${traceId}] updateOverlay`, chatNodes, Array.from(chatNodes)
        .map(el => "chat: " + el.className + ", parent: " + el.parentNode.classList));
      logger.group(`Update overlay(${reason})`);

      updateStyleVariables();
      updateCssPosition();
      updateToggleButton();
      styleFrame();
      updateTreePosition();
      logger.groupEnd();
    } catch (e) {
      console.error(traceId, e);
    }

    function updateTreePosition() {
      if (!overlayActive()) {
        restoreOldPosition();
      } else if (chat.parentNode !== videoContainer) {
        logger.debug("Moving chat, old parent:", chat.parentNode);
        videoContainer.appendChild(chat);
      }

      function restoreOldPosition() {
        const originalParent = chatSibling.parentNode;
        if (chat.parentNode !== originalParent) {
          logger.debug("Restoring original parent node:", originalParent);
          originalParent.insertBefore(chat, chatSibling);
        }
      }
    }

    function updateCssPosition() {
      switch (options.position) {
        case LEFT_CLASS:
          chat.classList.add(LEFT_CLASS);
          chat.classList.remove(RIGHT_CLASS);
          break;
        case RIGHT_CLASS:
          chat.classList.add(RIGHT_CLASS);
          chat.classList.remove(LEFT_CLASS);
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
      chatFrame.contentDocument.body.classList.toggle(OVERLAY_CLASS, overlayActive());
    }

    function overlayActive() {
      return options.enabled && (options.preview || isFullscreen());

      function isFullscreen() {
        return video.hasAttribute(FULLSCREEN_ATTRIBUTE);
      }
    }
  }

  async function setupListeners() {
    chrome.storage.onChanged.addListener(changes => {
      options = changes.options.newValue;
      updateOverlay("optionsChanged");
    });

    attributeMutationsListener(video, FULLSCREEN_ATTRIBUTE, () => updateOverlay("fullscreenToggled"));

    chatFrame.onload = () => updateOverlay("frameReloaded");
  }
}

function cleanupStaleOverlay() {
  const chat = document.querySelector(CHAT);
  if (chat != null) {
    restoreOldPosition();
  }
  logger.debug(`[${traceId}] cleanuStaleOverlay`, document.querySelectorAll(CHAT));

  function restoreOldPosition() {
    const chatSibling = document.querySelector(CHAT_SIBLING);
    const originalParent = chatSibling.parentNode;
    if (chat.parentNode !== originalParent) {
      logger.debug("Restoring original parent node:", originalParent);
      originalParent.insertBefore(chat, chatSibling);
    }
  }
}