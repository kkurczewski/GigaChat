const CHAT = "#chat";
const PLAYER = "#ytd-player #container #movie_player";
const CHAT_FRAME = "#chatframe";
const CHAT_PARENT = "#secondary-inner"

// never runs on first visit
addEventListener("yt-navigate-start", (event) => {
  console.debug("Navigation start:", event.detail);
  disableOverlay();
});
// runs on every page transition
addEventListener("yt-page-data-updated", async () => {
  if (!isVideoPage()) {
    return;
  }
  console.debug("Page data updated");

  const chat = await queryNode(document, CHAT, false);
  if (chat) {
    setupChatListeners();
  } else {
    console.log("No chat found");
  }

  async function setupChatListeners() {
    const chatFrame = await queryNode(chat, CHAT_FRAME);
    const player = await queryNode(document, PLAYER);

    addOverlayDisabledCallback(await addOptionChangesListener((options) => updateChatContainerStyle(chat, options)));
    addEventListener(ENABLE_OVERLAY, enableOverlay);
    addEventListener(DESTROY_OVERLAY, destroy, { once: true, capture: true });

    console.assert(chat != null, "Chat is null");

    dispatchEvent(new Event("chat-ready"));
    console.log("Setup chat listeners");

    function enableOverlay() {
      addOverlayDisabledCallback(updateChatFrameStyle(chatFrame));
      addOverlayDisabledCallback(updateChatPosition(chat, player));
    }

    function destroy() {
      removeEventListener(ENABLE_OVERLAY, enableOverlay);
      disableOverlay();
    }
  }

  function isVideoPage() {
    return window.location.pathname === "/watch";
  }
});

function disableOverlay() {
  dispatchEvent(new Event(DISABLE_OVERLAY));
}

function addOverlayDisabledCallback(callback) {
  addEventListener(DISABLE_OVERLAY, callback, { once: true, capture: true });
}
