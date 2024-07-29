chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "highlight",
    title: "Highlight this PR",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "highlight") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractHash,
    });
  }
});

function extractHash() {
  const divEls = document.querySelectorAll("div");
  for (const divEl of divEls) {
    if (divEl.textContent.includes("merged commit")) {
      const aEl = divEl.querySelector("a > code");
      const hash = aEl.textContent;

      chrome.storage.local.get("text", (data) => {
        const text = data.text || "";
        const lines = text.split("\n");
        if (lines.includes(hash)) {
          return;
        }
        const newText = `${data.text || ""}${hash}\n`;
        chrome.storage.local.set({ text: newText });
      });
      return;
    }
  }
  window.alert("Unable to find the merge commit hash");
}
