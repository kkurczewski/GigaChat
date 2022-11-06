const CHAT_SIBLING = "#chat-template";

function updateChatPosition(chat, player) {
  const chatParent = chat?.parentNode;
  console.assert(chatParent != null, "Chat parent is null");

  console.assert(player != null, "Player is null");
  player.appendChild(chat);

  console.log("Updated chat position");

  return cleanup;

  function cleanup() {
    const chatSibling = chatParent.querySelector(CHAT_SIBLING);
    if (chatSibling != null) { // this is always true apparently
      chatParent.insertBefore(chat, chatSibling);
      console.log("Restore old chat position");
    } else {
      chat.remove();
      console.log("Chat removed");
    }
  }
}