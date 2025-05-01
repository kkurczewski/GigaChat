window.onload = async () => {
  // @ts-ignore
  const options = await chrome.storage.local.get()
  const box = /** @type {HTMLElement} */ (document.getElementById("box"))
  const maxHeight = /** @type {number} */ (box.offsetParent?.clientHeight) - 6

  preloadData()
  addListeners()

  console.info("Loaded options:", options)

  /** 
   * @param {HTMLElement} box
   * @param {(draggable: HTMLElement) => void} callback
   **/
  dragElement(box, (draggable) => {
    // @ts-ignore
    chrome.storage.local.set({
      chatHeight: draggable.offsetHeight / maxHeight,
      topMargin: draggable.offsetTop / maxHeight,
      position: draggable.offsetLeft > 0 ? "right" : "left",
    })
  })

  // @ts-ignore
  chrome.storage.onChanged.addListener((/** @type {any} */ options) => {
    const opacity = options?.opacity?.newValue
    if (opacity) {
      box.style.setProperty("--opacity", opacity)
    }
  })

  function preloadData() {
    if (!options) {
      return
    }

    document.querySelectorAll("input[type=checkbox]")
      .forEach(cbox => {
        cbox.checked = options[cbox.id]
      })
    document
      .querySelectorAll("input[type=range]")
      .forEach(slider => {
        slider.value = options[slider.id]
      })
    document
      .querySelectorAll("select")
      .forEach(select => {
        select.value = options[select.id]
      })

    box.style.top = `${options.topMargin * maxHeight}px`
    box.style.height = `${Math.min(maxHeight - options.topMargin * maxHeight, options.chatHeight * maxHeight)}px`
    box.style.right = options.position == "right" ? "0" : ""
    box.style.setProperty("--opacity", options.opacity)
  }

  function addListeners() {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach(cbox => {
        cbox.onchange = ({ target }) => saveOption({ [target.id]: target.checked })
      })
    document
      .querySelectorAll("select")
      .forEach(select => {
        select.onchange = ({ target }) => saveOption({ [target.id]: target.value })
      })
    document
      .querySelectorAll("input[type=range]")
      .forEach(slider => {
        slider.onchange = ({ target }) => saveOption({ [target.id]: target.value })
      })

    function saveOption(option) {
      console.log("Saving:", option)
      chrome.storage.local.set(option)
    }
  }
}