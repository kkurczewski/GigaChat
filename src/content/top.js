const CSS_ROOT = ":root";
const APP_ROOT = "ytd-app";
const CHAT = "#chat";
const VIDEO_CONTAINER = "#ytd-player #container";
const TOGGLE_BUTTON = "#show-hide-button";

const OVERLAY_CLASS = "overlay";
const HIDDEN_CLASS = "hidden";
const LEFT_CLASS = "left";
const RIGHT_CLASS = "right";

const OPACITY_VAR = "--opacity";
const CHAT_HEIGHT_VAR = "--chat-height";

const STORAGE_OPTIONS = "options";

window.onload = async () => {
  const cssRoot = document.querySelector(CSS_ROOT);
  let chat;
  try {
    chat = await pollNode(document.querySelector(APP_ROOT), CHAT);
  } catch (e) {
    if (e instanceof Error) {
      console.error("Failed to load chat", e);
    } else {
      console.warn("Failed to load chat", e);
    }
    return;
  }
  const options = (await chrome.storage.local.get(STORAGE_OPTIONS)).options;
  console.log("Loading options:", options);

  chrome.storage.onChanged.addListener(changes => {
    const options = changes.options.newValue;
    console.log("Reloading options:", options);
    onOptionsUpdated(options);
  });

  onOptionsUpdated(options);

  function onOptionsUpdated(options) {
    updateTreePosition();
    updateCssPosition();
    updateStyleVariables();
    updateToggleButton();

    function updateToggleButton() {
      chat.querySelector(TOGGLE_BUTTON).classList.toggle(HIDDEN_CLASS, !options.toggleButton);
    }

    function updateStyleVariables() {
      cssRoot.style.setProperty(OPACITY_VAR, options.opacity);
      cssRoot.style.setProperty(CHAT_HEIGHT_VAR, options.height);
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

    function updateTreePosition() {
      const videoContainer = document.querySelector(VIDEO_CONTAINER);
      console.debug("Updating tree position:", options.enabled);
      if (!options.enabled) {
        restoreOldPosition();
      } else if (chat.parentNode !== videoContainer) {
        console.debug("Chat old parent node:", chat.parentNode);
        videoContainer.appendChild(chat);
      }

      function restoreOldPosition() {
        const chatSibling = document.querySelector("#chat-template");
        const originalParent = chatSibling.parentNode;
        if (chat.parentNode !== originalParent) {
          console.debug("Restoring original parent node:", originalParent);
          originalParent.insertBefore(chat, chatSibling);
        }
      }
    }
  }
}