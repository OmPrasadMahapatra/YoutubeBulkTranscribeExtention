let stopFlag = false;
let linksQueue = [];
let currentIndex = 0;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "startFetch") {
    stopFlag = false;
    linksQueue = msg.links;
    currentIndex = 0;
    fetchNext();
    sendResponse({status: "started"});
  } else if (msg.action === "stopFetch") {
    stopFlag = true;
    sendResponse({status: "stopped"});
  } else if (msg.action === "resetFetch") {
    stopFlag = true;
    linksQueue = [];
    currentIndex = 0;
    chrome.storage.local.set({transcripts: {}}, () => {});
    sendResponse({status: "reset"});
  }
});

async function fetchNext() {
  if (stopFlag || currentIndex >= linksQueue.length) {
    chrome.runtime.sendMessage({action: "allDone"});
    return;
  }

  const link = linksQueue[currentIndex];
  chrome.runtime.sendMessage({action: "status", index: currentIndex, total: linksQueue.length, link});

  try {
    let videoId = "";
    if (link.includes("youtu.be")) {
      videoId = link.split("youtu.be/")[1].split("?")[0];
    } else if (link.includes("v=")) {
      videoId = new URL(link).searchParams.get("v");
    }

    if (!videoId) throw new Error("Invalid YouTube link");

    const url = `https://youtubetotranscript.com/transcript?v=${videoId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch");

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const segments = doc.querySelectorAll("span.transcript-segment");
    const transcript = Array.from(segments).map(el => el.textContent.trim()).join(" ") || "Transcript not found";

    // Save in storage
    chrome.storage.local.get({transcripts: {}}, data => {
      const transcripts = data.transcripts;
      transcripts[link] = transcript;
      chrome.storage.local.set({transcripts});
      chrome.runtime.sendMessage({action: "update", link, transcript});
    });

  } catch (err) {
    const errorText = `❌ ${err.message}`;
    chrome.storage.local.get({transcripts: {}}, data => {
      const transcripts = data.transcripts;
      transcripts[link] = errorText;
      chrome.storage.local.set({transcripts});
      chrome.runtime.sendMessage({action: "update", link, transcript: errorText});
    });
  }

  currentIndex++;
  setTimeout(fetchNext, 500); // 0.5s delay
}
