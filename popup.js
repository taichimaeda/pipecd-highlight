const textareaEl = document.getElementById("textarea");

chrome.storage.local.get("text", (data) => {
  if (data.text !== undefined) {
    const text = data.text;
    textareaEl.value = text;
  }
});

textareaEl.addEventListener("input", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const text = textareaEl.value;
    chrome.tabs.sendMessage(tabs[0].id, { text });
    chrome.storage.local.set({ text });
  });
});
