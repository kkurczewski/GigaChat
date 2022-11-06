const STORAGE_OPTIONS = "options";

async function addOptionChangesListener(rawCallback) {
  const callback = (changes) => rawCallback(changes.options.newValue);
  chrome.storage.onChanged.addListener(callback);
  const { options } = await chrome.storage.local.get(STORAGE_OPTIONS);
  console.assert(options != null, "Options is null");
  rawCallback(options);

  return () => chrome.storage.onChanged.removeListener(callback);
}
