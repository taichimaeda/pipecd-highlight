const observer = new MutationObserver(() => {
  chrome.storage.local.get("text", (data) => {
    if (data.text !== undefined) {
      highlightUlEls(data.text);
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.text !== undefined) {
    highlightUlEls(message.text);
  }
});

function highlightUlEls(text) {
  const aEls = document.querySelectorAll("a");
  for (const aEl of aEls) {
    aEl.classList.remove("highlighted");
  }

  const hashes = text.split("\n").filter((hash) => hash !== "");
  const divEls = document.querySelectorAll("div");
  for (const divEl of divEls) {
    for (const hash of hashes) {
      if (divEl.textContent.includes(hash)) {
        const aEl = divEl.closest("a");
        if (aEl === null) {
          continue;
        }
        aEl.classList.add("highlighted");
      }
    }
  }
}
