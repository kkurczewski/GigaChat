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
  const isLive = event.detail.pageData.playerResponse.videoDetails.isLiveContent;
  console.log(`Is live? ${isLive}`);
  if (isLive) {
    overlay = await newOverlay();
  }
});

async function newOverlay() {
  console.log("Creating new overlay");

  const chat = await queryNode(document, "#chat");
  const { options } = await chrome.storage.local.get(STORAGE_OPTIONS);

  onOptionsChanged(chat, options);
  onFullscreenChanged(chat, options);

  await styleNestedFrame(chat);

  return {
    onFullscreenChanged: () => onFullscreenChanged(chat, options),
    onOptionsChanged: (newOptions) => onOptionsChanged(chat, newOptions),
  }

  function onFullscreenChanged(chat, options) {
    const isFullscreen = document.fullscreenElement != null;
    console.debug(`Fullscren enabled? ${isFullscreen}`);

    const isEnabled = options.enabled;
    console.debug(`Overlay enabled? ${isEnabled}`);

    chat.classList.toggle(OVERLAY_CLASS, isFullscreen && isEnabled);
  }

  function onOptionsChanged(chat, options) {
    console.debug("Options changed");

    const isEnabled = options.enabled;
    console.debug(`Overlay enabled? ${isEnabled}`);

    chat.classList.toggle(OVERLAY_CLASS, isEnabled);

    updateChatContainerStyle(chat, options);
  }

  async function styleNestedFrame(chat) {
    const chatFrame = await queryNode(chat, "#chatframe");
    chatFrame.addEventListener("load", (event) => {
      event.target.contentDocument.body.classList.toggle(OVERLAY_CLASS, true);
    });
  }
}