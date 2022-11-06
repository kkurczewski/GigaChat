const OVERLAY_CLASS = "overlay";

function updateChatFrameStyle(chatFrame) {
  console.assert(chatFrame != null, "Chat iframe is null");
  chatFrame.addEventListener("load", onReload);

  return cleanup;

  function onReload(event) {
    const chatFrame = event.target;
    const chatFrameBody = chatFrame.contentDocument.body;
    chatFrameBody.classList.toggle(OVERLAY_CLASS, true);
    console.debug("Applied iframe style");
  }

  function cleanup() {
    chatFrame.removeEventListener("load", onReload);
    console.log("Removed iframe style");
  }
}