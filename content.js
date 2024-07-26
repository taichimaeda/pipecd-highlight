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

function highlightItems(text) {
  if (text === undefined) {
    return;
  }

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
