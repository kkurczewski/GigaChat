function onDrag(handle, callback) {
  let lastX, lastY

  handle.addEventListener("mousedown", enableDragging)
  document.addEventListener("mouseup", disableDragging)

  function enableDragging(e) {
    e.preventDefault() // disable accidental selections
    lastX = e.clientX
    lastY = e.clientY
    document.addEventListener("mousemove", updatePosition)
  }

  function updatePosition(e) {
    let dx = lastX - e.clientX
    let dy = lastY - e.clientY
    lastX = e.clientX
    lastY = e.clientY

    callback(dx, dy)
  }

  function disableDragging() {
    document.removeEventListener("mousemove", updatePosition)
  }
}