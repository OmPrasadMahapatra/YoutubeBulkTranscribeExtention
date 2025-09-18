YouTube Bulk Transcribe (Chrome Extension)

A lightweight Chrome extension that lets you fetch transcripts from multiple YouTube videos in one go.
Paste in a list of video links, click fetch, and the extension will automatically pull transcripts for each video, clean them up, and make them available for copy/export.

✨ Features

🚀 Batch Processing – Fetch transcripts from multiple YouTube videos at once.

🔄 Background Queue – Uses a Manifest V3 service worker to keep fetching even if the popup is closed.

📡 Real-time Updates – See progress for each link as it’s processed.

📋 One-click Copy – Copy individual transcripts or export them all at once.

💾 Persistent Storage – Saves progress locally so nothing is lost mid-fetch.

⚡ Error Handling – Detects invalid links and failed fetches gracefully.

🛠 How It Works

Open the extension from the Chrome toolbar.

Paste one or more YouTube video links into the input box.

Hit Fetch to start transcript extraction.

Copy transcripts individually or use Copy All for bulk export.

Use Stop or Reset anytime to control the process.


🔧 Tech Stack

JavaScript (ES6+) – async/await, Fetch API, DOMParser

Chrome Extension APIs – Manifest V3, Service Worker, Storage, Runtime Messaging

HTML5 + CSS3 – clean popup UI

🚀 Installation (Developer Mode)

Download or clone this repo.

Open chrome://extensions/ in Chrome.

Enable Developer mode (toggle in top-right).

Click Load unpacked and select the project folder.

The extension will now appear in your Chrome toolbar.

✅ Roadmap

 Export transcripts to .txt or .csv

 Dark mode UI

 Support for multi-language transcripts

🧑‍💻 Author

Developed with ❤ to save creators, educators, and researchers time when working with YouTube content.
