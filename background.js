chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "highlight",
    title: "Highlight this PR",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "unhighlight",
    title: "Unhighlight this PR",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "clear",
    title: "Clear all PRs",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "highlight":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: addHash,
      });
      break;
    case "unhighlight":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: removeHash,
      });
      break;
    case "clear":
      chrome.storage.local.set({ text: "" });
      break;
  }
});

function addHash() {
  // NOTE: This cannot be extracted to a function because of `chrome.scripting.executeScript`
  let hash;
  const divEls = document.querySelectorAll("div");
  for (const divEl of divEls) {
    if (divEl.textContent.includes("merged commit")) {
      const aEl = divEl.querySelector("a > code");
      hash = aEl.textContent.trim();
    }
  }
  if (hash === undefined) {
    window.alert("Unable to find the merge commit hash");
  }

  chrome.storage.local.get("text", (data) => {
    const text = data.text || "";
    const lines = text.split("\n");
    if (lines.includes(hash)) {
      return;
    }
    const newText = `${data.text || ""}${hash}\n`;
    chrome.storage.local.set({ text: newText });
  });
}

function removeHash() {
  // NOTE: This cannot be extracted to a function because of `chrome.scripting.executeScript`
  let hash;
  const divEls = document.querySelectorAll("div");
  for (const divEl of divEls) {
    if (divEl.textContent.includes("merged commit")) {
      const aEl = divEl.querySelector("a > code");
      hash = aEl.textContent.trim();
    }
  }
  if (hash === undefined) {
    window.alert("Unable to find the merge commit hash");
  }

  chrome.storage.local.get("text", (data) => {
    const text = data.text || "";
    const lines = text.split("\n").filter((line) => line !== hash);
    const newText = lines.join("\n");
    chrome.storage.local.set({ text: newText });
  });
}
