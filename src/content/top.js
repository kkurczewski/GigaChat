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

const randomId = () => (37e16 * Math.random() + 37e16).toString(32);

let currentTaskId = randomId();
let previousTaskId = currentTaskId;
let isOverlayEnabled = false;
let stopFullscreenObserver = null;

console.log(prefix("Initialize extension"));
window.addEventListener("yt-navigate-finish", onNavigationFinished);
window.addEventListener("yt-navigate-start", onNavigationStarted);
onPageChanged();

async function onPageChanged() {
  const isVideo = isVideoPage();
  console.log(prefix("Is Youtube video?"), isVideo);
  if (!isVideo) {
    return;
  }
  let { options } = await chrome.storage.local.get(STORAGE_OPTIONS);
  prepareOverlay();

  async function prepareOverlay() {
    const isEnabled = options.enabled;
    console.log(prefix("Is overlay enabled?"), isEnabled);
    if (!options.enabled) {
      return;
    }

    console.groupCollapsed(prefix("Prepare overlay"));
    console.time(prefix("Prepare overlay"));
    const appRoot = document.querySelector(APP_ROOT);
    const chat = await queryNode(appRoot, CHAT, false);

    console.log(prefix("Has live chat?"), chat != null);
    if (!chat) {
      return;
    }

    const chatFrame = await queryNode(appRoot, CHAT_FRAME);

    updateStyles();

    const videoContainer = await queryNode(appRoot, VIDEO_CONTAINER);
    const video = await queryNode(appRoot, VIDEO);
    console.timeEnd(prefix("Prepare overlay"));
    console.groupEnd(prefix("Prepare overlay"));

    toggleOverlay();
    setupListeners();

    function toggleOverlay() {
      if (shouldEnableOverlay()) {
        console.groupCollapsed(prefix("Apply overlay"));
        chat.classList.add(currentTaskId);
        updateTreePosition();
        console.debug(prefix("Output state"), chat);
        console.groupEnd(prefix("Apply overlay"));

        isOverlayEnabled = true;
      } else {
        console.log(prefix("Is cleanup needed?"), isOverlayEnabled);
        if (isOverlayEnabled) {
          restoreChatPosition();
        }
      }

      function updateTreePosition() {
        const isPositionUpdated = videoContainer.contains(chat);
        console.log(prefix("Is position updated?"), isPositionUpdated);
        if (isPositionUpdated) {
          return;
        }
        console.info(prefix("Moving chat node"));
        const chatParent = chat.parentNode;
        videoContainer.appendChild(chat);
        console.debug(prefix("Moved chat [from] -> [to]"), chatParent, videoContainer);
      }
    }

    function updateStyles() {
      console.log(prefix("Update styles"));
      updateStyleVariables();
      updateCssChat();

      function updateStyleVariables() {
        const cssRoot = document.querySelector(CSS_ROOT);
        cssRoot.style.setProperty(OPACITY_VAR, options.opacity);
        cssRoot.style.setProperty(TOP_MARGIN_VAR, options.topMargin + "%");
        cssRoot.style.setProperty(BOTTOM_MARGIN_VAR, options.bottomMargin + "%");
      }

      function updateCssChat() {
        updateCssPosition();
        updateToggleButton();

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

        function updateToggleButton() {
          chat.querySelector(TOGGLE_BUTTON).classList.toggle(HIDDEN_CLASS, !options.toggleButton);
        }
      }
    }

    function setupListeners() {
      chatFrame.onload = (event) => {
        console.groupCollapsed(prefix("Styling iframe"));
        const chatFrame = event.target;
        const chatFrameBody = chatFrame.contentDocument.body;
        chatFrameBody.classList.toggle(OVERLAY_CLASS, shouldEnableOverlay());
        console.debug(prefix("Output"), chatFrame, chatFrameBody);
        console.groupEnd(prefix("Styling iframe"));
      };
      console.assert(stopFullscreenObserver == null, "Orphan observer detected");
      stopFullscreenObserver = attributeMutationsListener(video, FULLSCREEN_ATTRIBUTE, (enabled) => {
        console.debug(prefix(`Fullscreen ${enabled ? "enabled" : "disabled"}`));

        toggleOverlay();
      });

      chrome.storage.onChanged.addListener(changes => {
        console.debug(prefix("Previous options"), options);
        options = changes.options.newValue;
        console.log(prefix("Options changed"), options);
        updateStyles();
        toggleOverlay();
      });
    }

    async function queryNode(parent, selector, required) {
      const groupLabel = prefix(`Await ${selector} node`);
      console.groupCollapsed(groupLabel);
      const node = await awaitNode(parent, selector, required);
      console.groupEnd(groupLabel);
      return node;
    }

    function shouldEnableOverlay() {
      const isFullscreen = isFullscreenEnabled();
      console.log(prefix("Is fullscreen active?"), isFullscreen);
      if (!isFullscreen) {
        const isPreviewEnabled = options.preview;
        console.log(prefix("Is preview enabled?"), isPreviewEnabled);
        if (!isPreviewEnabled) {
          return false;
        }
      }
      return true;

      function isFullscreenEnabled() {
        return video.hasAttribute(FULLSCREEN_ATTRIBUTE);
      }
    }
  }

  function isVideoPage() {
    return window.location.pathname === "/watch";
  }
}

function onNavigationStarted() {
  const oldTaskId = currentTaskId;
  currentTaskId = randomId();
  console.log(`[${oldTaskId} -> ${currentTaskId}] Reassign task id`);
  cleanupOverlay();
}

function onNavigationFinished() {
  if (previousTaskId !== currentTaskId) {
    onPageChanged();
    previousTaskId = currentTaskId;
  }
}

function cleanupOverlay() {
  console.groupCollapsed(prefix("Cleanup overlay"));

  if (stopFullscreenObserver != null) {
    stopFullscreenObserver();
    stopFullscreenObserver = null;
  }
  if (isOverlayEnabled) {
    restoreChatPosition();
  }

  console.groupEnd(prefix("Cleanup overlay"));
}

function restoreChatPosition() {
  console.groupCollapsed(prefix("Restore chat position"));

  const chatSibling = document.querySelector(CHAT_SIBLING);
  console.info(prefix("Chat sibling found?"), chatSibling != null);

  const chat = document.querySelector(CHAT);
  console.info(prefix("Chat found?"), chat != null);

  console.info(prefix("Moving chat node"));
  const previousParent = chat.parentNode;
  const originalParent = chatSibling.parentNode;
  originalParent.insertBefore(chat, chatSibling);
  console.debug(prefix("Moved chat [from] -> [to]"), previousParent, originalParent);
  console.debug(prefix("Output state"), chat);

  console.groupEnd(prefix("Restore chat position"));

  isOverlayEnabled = false;
}

function prefix(message) {
  return `[${currentTaskId}] ${message}`;
}