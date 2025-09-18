let stopFlag = false;
let transcripts = []; // store fetched transcripts

const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");
const youtubeLinksTextarea = document.getElementById("youtubeLinks");
const fetchBtn = document.getElementById("fetchBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const copyAllBtn = document.getElementById("copyAllBtn");

// ---------------------- Fetch Button ----------------------
fetchBtn.addEventListener("click", async () => {
  const linksText = youtubeLinksTextarea.value.trim();
  if (!linksText) {
    statusDiv.textContent = "❌ Please paste at least one YouTube link.";
    return;
  }

  stopFlag = false;
  const links = linksText.split("\n").map(l => l.trim()).filter(Boolean);
  statusDiv.textContent = `Starting to fetch ${links.length} transcripts...`;

  for (let i = 0; i < links.length; i++) {
    if (stopFlag) {
      statusDiv.textContent = "⚠ Fetching stopped!";
      break;
    }

    const link = links[i];
    statusDiv.textContent = `Fetching transcript ${i + 1} of ${links.length}...`;

    let videoId = "";
    try {
      if (link.includes("youtu.be")) videoId = link.split("youtu.be/")[1].split("?")[0];
      else if (link.includes("v=")) videoId = new URL(link).searchParams.get("v");
    } catch (err) {
      videoId = null;
    }

    if (!videoId) {
      appendTranscript(link, "❌ Invalid link", i + 1);
      continue;
    }

    try {
      const text = await fetchTranscript(videoId);
      appendTranscript(link, text, i + 1);
    } catch (err) {
      console.error("Error fetching transcript:", link, err);
      appendTranscript(link, "❌ Failed to fetch", i + 1);
    }

    await new Promise(r => setTimeout(r, 500)); // small delay
  }

  if (!stopFlag) statusDiv.textContent = "✅ All done!";
});

// ---------------------- Stop Button ----------------------
stopBtn.addEventListener("click", () => {
  stopFlag = true;
  statusDiv.textContent = "🛑 Fetching stopped!";
});

// ---------------------- Reset Button ----------------------
resetBtn.addEventListener("click", () => {
  stopFlag = true;
  transcripts = [];
  resultsDiv.innerHTML = "";
  statusDiv.textContent = "🔄 Reset complete";
});

// ---------------------- Copy All Button ----------------------
copyAllBtn.addEventListener("click", () => {
  if (!transcripts.length) return;

  const combined = transcripts
    .map(t => t.length > 50000 ? "[TRANSCRIPT TOO LONG]" : t.replace(/[\r\n]+/g, " ").trim())
    .join("\n"); // separate each transcript clearly

  navigator.clipboard.writeText(combined).then(() => {
    statusDiv.textContent = "📋 All transcripts copied!";
  });
});

// ---------------------- Append Individual Transcript ----------------------
function appendTranscript(link, text, index) {
  const cleanedText = text
    .replace(/[\r\n]+/g, " ")   // remove all newlines
    .replace(/\s+/g, " ")       // collapse multiple spaces
    .trim();

  transcripts[index - 1] = cleanedText; // store in order

  const block = document.createElement("div");
  block.className = "transcript-block";
  block.innerHTML = `
    <b>${index}. ${link}</b><br>
    <pre>${cleanedText}</pre>
    <button>📋 Copy Transcript</button>
  `;

  const btn = block.querySelector("button");
  btn.onclick = () => {
    navigator.clipboard.writeText(cleanedText).then(() => {
      btn.textContent = "✅ Copied!";
      setTimeout(() => btn.textContent = "📋 Copy Transcript", 1500);
    });
  };

  resultsDiv.appendChild(block);
}

// ---------------------- Fetch Transcript Function ----------------------
async function fetchTranscript(videoId) {
  const url = `https://youtubetotranscript.com/transcript?v=${videoId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch transcript");

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const segments = doc.querySelectorAll("span.transcript-segment");
  const text = Array.from(segments).map(el => el.textContent.trim()).join(" ");

  if (!text) return "⚠ Transcript not found";
  return text;
}
