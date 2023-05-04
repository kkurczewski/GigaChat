function installDragActions(chat) {
  const draggableChat = new DraggableElement(chat)
  const { topResizeHandle, dragHandle, bottomResizeHandle } = createDragOverlay()

  onDrag(topResizeHandle, (_, dy) => {
    draggableChat.top = clamp(0, draggableChat.top - dy, window.innerHeight - draggableChat.minHeight - draggableChat.bottom)
  })

  onDrag(bottomResizeHandle, (_, dy) => {
    draggableChat.bottom = clamp(0, draggableChat.bottom + dy, window.innerHeight - draggableChat.minHeight - draggableChat.top)
  })

  onDrag(dragHandle, (dx, dy) => {
    dx = clamp(-draggableChat.right, dx, draggableChat.left)
    dy = clamp(-draggableChat.bottom, dy, draggableChat.top)
    draggableChat.top = draggableChat.top - dy
    draggableChat.left = draggableChat.left - dx
    draggableChat.right = draggableChat.right + dx
    draggableChat.bottom = draggableChat.bottom + dy
  })

  function createDragOverlay() {
    const topResizeHandle = document.createElement("div")
    topResizeHandle.classList.add("top-resize")
    chat.append(topResizeHandle)

    const dragHandle = document.createElement("div")
    dragHandle.classList.add("drag")
    addHelpInfo()
    chat.append(dragHandle)

    const bottomResizeHandle = document.createElement("div")
    bottomResizeHandle.classList.add("bottom-resize")
    chat.append(bottomResizeHandle)

    return { topResizeHandle, dragHandle, bottomResizeHandle }

    function addHelpInfo() {
      const header = document.createElement("h3")
      header.textContent = "DRAGGING MODE"
      dragHandle.append(header)

      const info = document.createElement("p")
      info.textContent = "Drag chat window and resize it using handlers on edges. For better precision you may hide chat during action."
      dragHandle.append(info)

      const hideChatCheckbox = document.createElement("input")
      hideChatCheckbox.type = "checkbox"

      const label = document.createElement("label")
      label.append(hideChatCheckbox)
      label.append(document.createTextNode("Hide chat"))
      dragHandle.append(label)

      const exitButtton = document.createElement("button")
      exitButtton.textContent = "Exit"
      exitButtton.onclick = () => document.body.classList.remove("drag-mode")
      dragHandle.append(exitButtton)
    }
  }

  function clamp(min, val, max) {
    return Math.max(min, Math.min(val, max))
  }
}