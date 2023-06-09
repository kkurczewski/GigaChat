window.onload = async () => {
  const options = await chrome.storage.local.get()

  preloadData()
  addListeners()
  console.info("Loaded options:", options)

  function preloadData() {
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
      .querySelectorAll("input[type=range]:not([data-convolute])")
      .forEach(slider => {
        slider.onchange = ({ target }) => saveOption({ [target.id]: target.value })
      })
    document
      .querySelectorAll("input[type=range][data-convolute]")
      .forEach(addConvolutedListeners)

    function addConvolutedListeners(slider) {
      const convolutedElement = document.getElementById(slider.dataset.convolute)
      slider.onchange = ({ target }) => {
        const newValue = target.value
        convolutedElement.value = Math.min(slider.max - newValue, convolutedElement.value)
        saveOption({
          [convolutedElement.id]: convolutedElement.value,
          [target.id]: newValue,
        })
      }
    }

    function saveOption(option) {
      console.log("Saving: ", option)
      chrome.storage.local.set(option)
    }
  }
}