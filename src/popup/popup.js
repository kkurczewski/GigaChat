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
          options[slider.id] = slider.value;
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
        .querySelectorAll("input[type=radio]")
        .forEach(radioBtn => {
          radioBtn.oninput = (event) => saveProperty(event.target.name, event.target.value);
        });
      document.querySelectorAll("input[type=range]")
        .forEach(slider => {
          slider.oninput = event => saveProperty(event.target.id, event.target.value0);
        });
      addCustomListeners();

      function addCustomListeners() {
        chatHeight.oninput = event => {
          const newValue = event.target.value;
          topMargin.value = Math.min(1.0 - newValue, topMargin.value);
          saveProperty(event.target.id, newValue);
          saveProperty(topMargin.id, topMargin.value);
        };
        topMargin.oninput = event => {
          const newValue = event.target.value;
          chatHeight.value = Math.min(1.0 - newValue, chatHeight.value);
          saveProperty(event.target.id, newValue);
          saveProperty(chatHeight.id, chatHeight.value);
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