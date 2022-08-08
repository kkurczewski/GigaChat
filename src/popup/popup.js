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
          slider.value = options[slider.id] * 10.0;
        });
      document
        .querySelectorAll("input[type=radio]")
        .forEach(radio => {
          if (radio.value === options[radio.name]) {
            radio.checked = true;
          }
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
          options[slider.id] = slider.value / 10.0;
        });
      document
        .querySelectorAll("input[type=radio][checked]")
        .forEach(radio => {
          options[radio.name] = radio.value;
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
        .querySelectorAll("input[type=range]")
        .forEach(slider => {
          slider.oninput = event => saveProperty(event.target.id, event.target.value / 10.0);
        });
      document
        .querySelectorAll("input[type=radio]")
        .forEach(radioBtn => {
          radioBtn.oninput = (event) => saveProperty(event.target.name, event.target.value);
        });

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