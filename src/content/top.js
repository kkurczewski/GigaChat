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

configureOverlay();

console.log("Extension initialized");

async function enableOverlay() {
  const appRoot = document.querySelector(APP_ROOT);
  const isVideo = isVideoPage();
  console.log("Is Youtube video?", isVideo);
  if (!isVideo) {
    return;
  }

  const chat = await queryNode(appRoot, CHAT, false);
  console.log("Is chat found?", chat != null);
  if (!chat) {
    return;
  }

  const removeListener = await addOptionChangesListener(updateStyles);
  addCleanupCallback(removeListener);

  setChatFrameListener();

  updateChatPosition();

  function updateStyles(options) {
    console.log("Update styles");
    updateStyleVariables();
    updateCssPosition();
    updateToggleButton();

    function updateStyleVariables() {
      const cssRoot = document.querySelector(CSS_ROOT);
      cssRoot.style.setProperty(OPACITY_VAR, options.opacity);
      cssRoot.style.setProperty(TOP_MARGIN_VAR, options.topMargin + "%");
      cssRoot.style.setProperty(BOTTOM_MARGIN_VAR, options.bottomMargin + "%");
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

    function updateToggleButton() {
      chat.querySelector(TOGGLE_BUTTON).classList.toggle(HIDDEN_CLASS, !options.toggleButton);
    }
  }

  async function setChatFrameListener() {
    console.log("Set chat frame listener");
    const chatFrame = await queryNode(appRoot, CHAT_FRAME);
    chatFrame.addEventListener("load", onLoad);
    addCleanupCallback(() => chatFrame.removeEventListener("load", onLoad));

    function onLoad(event) {
      console.groupCollapsed("Styling iframe");
      const chatFrame = event.target;
      const chatFrameBody = chatFrame.contentDocument.body;
      chatFrameBody.classList.toggle(OVERLAY_CLASS, true);
      console.debug("Output", chatFrame, chatFrameBody);
      console.groupEnd("Styling iframe");
    }
  }

  async function updateChatPosition() {
    const chatParent = chat.parentNode;
    const videoContainer = await queryNode(appRoot, VIDEO_CONTAINER);
    videoContainer.append(chat);

    addCleanupCallback(cleanup);

    function cleanup() {
      const chatSibling = appRoot.querySelector(CHAT_SIBLING);
      chatParent.insertBefore(chat, chatSibling);
      console.debug("Restored chat position");
    }
  }

  function isVideoPage() {
    return window.location.pathname === "/watch";
  }
}

function disableOverlay() {
  console.log("disableOverlay");
  document.dispatchEvent(new Event("restore-chat-position"));
}

function configureOverlay() {
  const overlayMode = buildOverlayMode();
  addOptionChangesListener(optionsHandler);

  addEventListener("fullscreenchange", fullscreenHandler);
  addEventListener("yt-navigate-start", () => {
    overlayMode.consumeEvent("navigationChanged");
    disableOverlay();
  });
  addEventListener("yt-navigate-finish", () => overlayMode.consumeEvent("onEnter"));

  function buildOverlayMode() {
    const overlay = buildOverlay();
    return stateMachine({
      disabled: {
        fullscreenMode: (changeState) => changeState("fullscreen"),
        previewMode: (changeState) => changeState("preview"),
        onEnter: () => overlay.disable(),
      },
      fullscreen: {
        disabledMode: (changeState) => changeState("disabled"),
        previewMode: (changeState) => changeState("preview"),
        fullscreenOn: () => overlay.enable(),
        fullscreenOff: () => overlay.disable(),
        navigationChanged: () => overlay.disable(),
        onEnter: () => isFullscreenEnabled() ? overlay.enable() : overlay.disable(),
      },
      preview: {
        disabledMode: (changeState) => changeState("disabled"),
        fullscreenMode: (changeState) => changeState("fullscreen"),
        navigationChanged: () => overlay.disable(),
        onEnter: () => overlay.enable(),
      },
    });

    function buildOverlay() {
      // this fsm make sure that once chat is 
      // enabled it is not enabled again
      //
      // if state is enabled further enable-actions will be omitted
      const overlayState = stateMachine({
        disabled: {
          enable: (changeState) => {
            changeState("enabled");
            enableOverlay();
          }
        },
        enabled: {
          disable: (changeState) => {
            changeState("disabled");
            disableOverlay();
          }
        },
      });

      return {
        disable: () => overlayState.consumeEvent("disable"),
        enable: () => overlayState.consumeEvent("enable"),
      }
    }
  }

  function optionsHandler(options) {
    if (options.enabled) {
      overlayMode.consumeEvent(options.preview ? "previewMode" : "fullscreenMode");
    } else {
      overlayMode.consumeEvent("disabledMode");
    }
    overlayMode.consumeEvent("onEnter");
  }

  function fullscreenHandler() {
    overlayMode.consumeEvent(isFullscreenEnabled() ? "fullscreenOn" : "fullscreenOff");
  }

  function isFullscreenEnabled() {
    return document.fullscreenElement != null;
  }
}

async function addOptionChangesListener(rawCallback) {
  const callback = (changes) => rawCallback(changes.options.newValue);
  chrome.storage.onChanged.addListener(callback);
  const { options } = await chrome.storage.local.get(STORAGE_OPTIONS);
  rawCallback(options);

  return () => chrome.storage.onChanged.removeListener(callback);
}

function addCleanupCallback(callback) {
  addEventListener("restore-chat-position", callback, { once: true, capture: true });
}

async function queryNode(parent, selector, required) {
  const groupLabel = `Await ${selector} node`;
  console.groupCollapsed(groupLabel);
  const node = await awaitNode(parent, selector, required);
  console.groupEnd(groupLabel);
  return node;
}
