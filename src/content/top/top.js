const STORAGE_OPTIONS = "options";
const OVERLAY_CLASS = "overlay";

let overlay = null;

chrome.storage.onChanged.addListener((changes) => {
  const options = changes[STORAGE_OPTIONS].newValue;
  overlay?.onOptionsChanged(options);
});

addEventListener("yt-navigate-start", () => { overlay = null; });
addEventListener("fullscreenchange", () => overlay?.onFullscreenChanged());
addEventListener("yt-page-data-fetched", async (event) => {
  const pageData = event.detail.pageData;
  const isLive = pageData?.playerResponse?.videoDetails?.isLiveContent;
  if (isLive == null) {
    return;
  }
  console.log("[yt-page-data-fetched]");
  console.debug("Got event: ", event.detail);

  console.log(`Is live? ${isLive}`);
  if (isLive) {
    const videoId = pageData.endpoint.watchEndpoint.videoId;
    overlay = await newOverlay(videoId);
  } else {
    overlay = null;
  }
  console.log("Current overlay state: ", overlay);
});

async function newOverlay(videoId) {
  console.log(`Creating new overlay for ${videoId}`);

  const chat = await queryNode(document, "#chat");
  const chatFrame = await queryNode(chat, "#chatframe");
  let { options } = await chrome.storage.local.get(STORAGE_OPTIONS);

  onOptionsChanged(options);

  chatFrame.onload = (event) => {
    console.log("[chatFrame.onload]");
    const chatFrame = event.target;
    toggleNestedFrameState(chatFrame, chat.classList.contains(OVERLAY_CLASS));
  }

  return {
    videoId,
    onFullscreenChanged: () => {
      console.log("[onFullscreenChanged]");
      updateStateOverlay(options);
    },
    onOptionsChanged: (newOptions) => {
      onOptionsChanged(newOptions);
    },
  }

  function onOptionsChanged(newOptions) {
    console.log("[onOptionsChanged]");
    options = newOptions;

    updateStateOverlay(newOptions);
    updateChatContainerStyle(chat, newOptions);
  }

  function updateStateOverlay(options) {
    const isEnabled = options.enabled;
    console.log(`Overlay enabled? ${isEnabled}`);

    const isFullscreen = document.fullscreenElement != null;
    console.log(`Fullscren enabled? ${isFullscreen}`);

    chat.classList.toggle(OVERLAY_CLASS, isFullscreen && isEnabled);
    toggleNestedFrameState(chatFrame, isFullscreen && isEnabled);
  }

  function toggleNestedFrameState(chatFrame, enabled) {
    console.log(`Nested frame enabled? ${enabled}`);
    chatFrame.contentDocument.body.classList.toggle(OVERLAY_CLASS, enabled);
  }
}