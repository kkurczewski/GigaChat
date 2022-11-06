const ON_ENTER = "_onEnter";
const NAVIGATION_STARTED = "navigationStarted";
const FULLSCREEN_CHANGED = "fullscreenChanged";

const ENABLE_OVERLAY = "enable-overlay";
const DISABLE_OVERLAY = "disable-overlay";
const DESTROY_OVERLAY = "destroy-overlay";

setupGlobalListeners();

// runs once per page
function setupGlobalListeners() {
  const overlayState = buildOverlayState();
  manageStateTransitions();
  addEventListener("chat-ready", () => overlayState.consumeEvent(ON_ENTER));
  addEventListener("fullscreenchange", () => overlayState.consumeEvent(FULLSCREEN_CHANGED));
  addEventListener("yt-navigate-start", () => overlayState.consumeEvent(NAVIGATION_STARTED));

  console.log("Setup global listeners");

  function buildOverlayState() {
    return stateMachine("overlay", {
      disabled: {
        [ON_ENTER]: () => disableOverlay(),
      },
      fullscreen: {
        [ON_ENTER]: () => toggleOverlay(),
        [FULLSCREEN_CHANGED]: () => toggleOverlay(),
        [NAVIGATION_STARTED]: () => destroyOverlay(),
      },
      preview: {
        [ON_ENTER]: () => enableOverlay(),
        [NAVIGATION_STARTED]: () => destroyOverlay(),
      },
    });

    function enableOverlay() {
      dispatchEvent(new Event(ENABLE_OVERLAY));
    }

    function disableOverlay() {
      dispatchEvent(new Event(DISABLE_OVERLAY));
    }

    function destroyOverlay() {
      dispatchEvent(new Event(DESTROY_OVERLAY));
    }

    function toggleOverlay() {
      return isFullscreenEnabled() ? enableOverlay() : disableOverlay();
    }

    function isFullscreenEnabled() {
      return document.fullscreenElement != null;
    }
  }

  function manageStateTransitions() {
    addOptionChangesListener(optionsHandler);

    function optionsHandler(options) {
      if (options.enabled) {
        overlayState.changeState(options.preview ? "preview" : "fullscreen");
      } else {
        overlayState.changeState("disabled");
      }
    }
  }
}