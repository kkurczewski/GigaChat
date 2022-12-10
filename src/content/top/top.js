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
  const chatFrame = await queryNode(chat, "#chatframe");
  let { options } = await chrome.storage.local.get(STORAGE_OPTIONS);

  onOptionsChanged(options);

  chatFrame.addEventListener("load", (event) => {
    event.target.contentDocument.body.classList.toggle(OVERLAY_CLASS, chat.classList.contains(OVERLAY_CLASS));
  });

  return {
    onFullscreenChanged: () => updateStateOverlay(options),
    onOptionsChanged: (newOptions) => onOptionsChanged(newOptions),
  }

  function onOptionsChanged(newOptions) {
    options = newOptions;
    console.debug("Options changed");

    updateStateOverlay(newOptions);
    updateChatContainerStyle(chat, newOptions);
  }

  function updateStateOverlay(options) {
    const isEnabled = options.enabled;
    console.debug(`Overlay enabled? ${isEnabled}`);

    const isFullscreen = document.fullscreenElement != null;
    console.debug(`Fullscren enabled? ${isFullscreen}`);

    chat.classList.toggle(OVERLAY_CLASS, isFullscreen && isEnabled);
    chatFrame.contentDocument.body.classList.toggle(OVERLAY_CLASS, isFullscreen && isEnabled);
  }
}