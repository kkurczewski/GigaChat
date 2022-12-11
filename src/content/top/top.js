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
  console.debug("Got event: ", event.detail);

  const pageData = event.detail.pageData;
  if (!pageData) {
    return;
  }

  console.log("[yt-page-data-fetched]");

  const isLiveOrReplay = pageData?.response?.contents?.twoColumnWatchNextResults?.conversationBar != null;
  console.log(`Is live? ${isLiveOrReplay}`);

  if (isLiveOrReplay) {
    const videoId = pageData.endpoint.watchEndpoint.videoId;
    overlay = await newOverlay(videoId);
  } else {
    overlay = null;
  }
  console.log("Current overlay state: ", overlay);
});

async function newOverlay(videoId) {
  console.log(`Creating new overlay for ${videoId}`);

  const chatParent = await queryNode(document, "#secondary.ytd-watch-flexy");
  const chat = await queryNode(chatParent, "#chat");
  const chatFrame = await queryNode(chat, "#chatframe");
  let { options } = await chrome.storage.local.get(STORAGE_OPTIONS);

  onOptionsChanged(options);

  chatFrame.onload = async (event) => {
    console.log("[chatFrame.onload]");
    const chatFrame = event.target;
    await toggleNestedFrameState(chatFrame, chatParent.classList.contains(OVERLAY_CLASS));
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

    chatParent.classList.toggle(OVERLAY_CLASS, isFullscreen && isEnabled);
    toggleNestedFrameState(chatFrame, isFullscreen && isEnabled);
  }

  async function toggleNestedFrameState(chatFrame, enabled) {
    console.log(`Nested frame enabled? ${enabled}`);
    const body = await queryNode(chatFrame.contentDocument, "body");
    body.classList.toggle(OVERLAY_CLASS, enabled);
  }
}