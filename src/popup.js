window.onload = () => {
  console.debug("YLCHO started (popup)");
  const options = {};

  chrome.storage.local.get("options", loadOptions);

  function loadOptions(data) {
    console.debug("Load options:", data.options);
    if (data.options) syncForm(data);
    else syncOptions();
    addListeners();

    function syncForm(data) {
      Object.assign(options, data.options);
      enabled.checked = options.enabled;
      opacity.value = options.opacity * 10.0;
      height.value = options.height * 10.0;
      if (options.position != null) {
        document.querySelector(`input[name=position][value=${options.position}]`).checked = true;
      } else {
        document.querySelector("input[name=position][checked]").checked = true;
      }
      console.debug("Form synced");
    }

    function syncOptions() {
      options.enabled = enabled.checked;
      options.opacity = opacity.value / 10.0;
      options.height = height.value / 10.0;
      options.position = document.querySelector("input[name=position][checked]").value;
      saveOptions();

      console.debug("Options synced");
    }

    function addListeners() {
      enabled.oninput = event => saveProperty(event.target.id, event.target.checked);
      opacity.oninput = event => saveProperty(event.target.id, event.target.value / 10.0);
      height.oninput = event => saveProperty(event.target.id, event.target.value / 10.0);

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
    chrome.storage.local.set({options});
  }

  console.debug("YLCHO initialized");
}