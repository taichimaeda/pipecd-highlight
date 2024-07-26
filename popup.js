const textareaEl = document.getElementById("textarea");

chrome.storage.local.get("text", (data) => {
  textareaEl.value = data.text || "";
});

chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get("text", (data) => {
    if (textareaEl.value === data.text) {
      return;
    }
    textareaEl.value = data.text;
  });
});

textareaEl.addEventListener("input", () => {
  const text = textareaEl.value;
  chrome.storage.local.set({ text });
});
