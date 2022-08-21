const STORAGE_OPTIONS = "options";

window.onload = () => {
  const options = {};

  chrome.storage.local.get(STORAGE_OPTIONS, loadOptions);

  function loadOptions(data) {
    console.debug("Load options:", data.options);
    if (data.options) syncForm(data);
    else syncOptions();
    addListeners();

    function syncForm(data) {
      Object.assign(options, data.options);
      document.querySelectorAll("input[type=checkbox]")
        .forEach(cbox => {
          cbox.checked = options[cbox.id];
        });
      document
        .querySelectorAll("input[type=range]")
        .forEach(slider => {
          slider.value = options[slider.id];
        });
      document
        .querySelectorAll("select")
        .forEach(select => {
          select.value = options[select.id];
        });
      console.debug("Form synced");
    }

    function syncOptions() {
      document
        .querySelectorAll("input[type=checkbox]")
        .forEach(cbox => {
          options[cbox.id] = cbox.checked;
        });
      document
        .querySelectorAll("input[type=range]")
        .forEach(slider => {
          options[slider.id] = slider.value;
        });
      document
        .querySelectorAll("select")
        .forEach(select => {
          options[select.id] = select.value;
        });
      saveOptions();

      console.debug("Options synced");
    }

    function addListeners() {
      document
        .querySelectorAll("input[type=checkbox]")
        .forEach(cbox => {
          cbox.oninput = event => saveProperty(event.target.id, event.target.checked);
        });
      document
        .querySelectorAll("select")
        .forEach(select => {
          select.onchange = (event) => saveProperty(event.target.id, event.target.value);
        });
      document
        .querySelectorAll("input[type=range]")
        .forEach(slider => applySliderListener(slider));

      function applySliderListener(slider) {
        const convolute = document.getElementById(slider.dataset.convolute);
        slider.oninput = event => {
          const newValue = event.target.value;
          saveProperty(event.target.id, newValue);
          if (convolute) {
            convolute.value = Math.min(slider.max - newValue, convolute.value);
            saveProperty(convolute.id, convolute.value);
          }
        };
      }

      function saveProperty(nodeId, nodeValue) {
        options[nodeId] = nodeValue;
        saveOptions();
      }
    }
  }

  function saveOptions() {
    console.debug("Save options:", options);
    chrome.storage.local.set({ options });
  }
}