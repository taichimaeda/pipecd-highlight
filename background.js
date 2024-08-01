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
    id: "unhighlight-all",
    title: "Clear all highlights",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "remind",
    title: "Remind me of this PR",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "unremind-all",
    title: "Clear all reminders",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "highlight":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: highlight,
      });
      break;
    case "unhighlight":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: unhighlight,
      });
      break;
    case "unhighlight-all":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: unhighlightAll,
      });
      break;
    case "remind":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: remind,
      });
      break;
    case "unremind-all":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: unremindAll,
      });
      break;
  }
});

function highlight() {
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
    alert("Unable to find the merge commit hash");
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

function unhighlight() {
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
    alert("Unable to find the merge commit hash");
  }

  chrome.storage.local.get("text", (data) => {
    const text = data.text || "";
    const lines = text.split("\n").filter((line) => line !== hash);
    const newText = lines.join("\n");
    chrome.storage.local.set({ text: newText });
  });
}

function unhighlightAll() {
  chrome.storage.local.set({ text: "" });
}

const timeoutIds = [];

function remind() {
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

  const timeoutId = setTimeout(() => {
    alert(`Don't forget to check PR: ${hash}`);
  }, 1000 * 60 * 30);
  timeoutIds.push(timeoutId);
}

function unremindAll() {
  timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
}
