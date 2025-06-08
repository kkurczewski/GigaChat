/** 
 * @param {HTMLElement} draggable
 * @param {(draggable: HTMLElement) => void} callback
 **/
function dragElement(draggable, callback) {
  const [top, bottom] = draggable.getElementsByClassName("handle")
  const maxHeight = /** @type {number} */ (draggable.offsetParent?.clientHeight) - 6 // height minus borders
  const minHeight = 40

  let x0, y0, h0, t0

  top.onmousedown = dragFunction(dragTopHandle)
  bottom.onmousedown = dragFunction(dragBottomHandle)
  draggable.onmousedown = dragFunction(dragBody)

  document.onmouseup = () => {
    callback(draggable)
    document.onmousemove = null
  }

  /** @param {(this: GlobalEventHandlers, ev: MouseEvent) => any} handler */
  function dragFunction(handler) {
    function dragMouseDown(/** @type MouseEvent */ e) {
      e.preventDefault() // fixes issue with missed mouse up signal
      e.stopPropagation() // prevents propagating event to parent

      x0 = e.clientX
      y0 = e.clientY
      h0 = draggable.clientHeight
      t0 = draggable.offsetTop

      document.onmousemove = handler
    }

    return dragMouseDown
  }

  function dragBody(/** @type MouseEvent */ e) {
    const delta = y0 - e.clientY
    const t1 = Math.min(t0 - delta, maxHeight - h0)
    draggable.style.top = Math.max(0, t1) + "px"

    if (e.clientX - x0 > 75) {
      draggable.style.right = "0"
      x0 = e.clientX
    } else if (e.clientX - x0 < -75) {
      draggable.style.right = ""
      x0 = e.clientX
    }
  }

  function dragTopHandle(/** @type MouseEvent */ e) {
    const delta = y0 - e.clientY
    const h1 = Math.max(h0 + delta, minHeight)

    draggable.style.top = Math.max(0, t0 + h0 - h1) + "px"
    draggable.style.height = `calc(${h0 + Math.min(delta, t0)}px)`
  }

  function dragBottomHandle(/** @type MouseEvent */ e) {
    const delta = y0 - e.clientY
    const h1 = Math.min(h0 - delta, maxHeight - t0)
    draggable.style.height = h1 + "px"
  }
}