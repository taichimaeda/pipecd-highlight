const observer = new MutationObserver(() => {
  chrome.storage.local.get("text", (data) => {
    highlightItems(data.text);
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get("text", (data) => {
    highlightItems(data.text);
  });
});

function hashString(string) {
  let hash = 0;
  if (string.length === 0) return hash;
  for (const char of string) {
    hash ^= char.charCodeAt(0);
  }
  return hash;
}

function highlightItems(text) {
  if (text === undefined) {
    return;
  }

  const aEls = document.querySelectorAll("a");
  for (const aEl of aEls) {
    for (let i = 1; i <= 5; i++) {
      aEl.classList.remove(`highlight-${i}`);
    }
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
        const index = (hashString(hash) % 5) + 1;
        aEl.classList.add(`highlight-${index}`);
      }
    }
  }
}
