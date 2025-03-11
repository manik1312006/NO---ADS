window.onload = function () {
    const params = new URLSearchParams(window.location.search);

    // Get shared URL (it could be in "url" or "text")
    let sharedUrl = params.get("url") || params.get("text");

    if (sharedUrl) {
        sharedUrl = decodeURIComponent(sharedUrl.trim()); // Decode & clean up
        document.getElementById("videoLink").value = sharedUrl;

        // Auto-detect if it's a video or playlist and open in a new tab
        if (sharedUrl.includes("youtube.com") || sharedUrl.includes("youtu.be")) {
            if (sharedUrl.includes("list=")) {
                openPlaylistInNewTab(); // Open playlist in YouTube app
            } else {
                openVideoInNewTab(); // Open video in YouTube app
            }
        }
    }
};

// Function to open video in YouTube app or new tab
function openVideoInNewTab() {
    const link = document.getElementById("videoLink").value;
    const videoId = extractVideoID(link);

    if (videoId) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        window.open(youtubeUrl, "_blank");
    } else {
        alert("Please enter a valid YouTube link.");
    }
}

// Function to extract video ID
function extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed|live)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Function to open a playlist in YouTube
function openPlaylistInNewTab() {
    const link = document.getElementById("videoLink").value;
    const playlistId = extractPlaylistID(link);

    if (playlistId) {
        const youtubeUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
        window.open(youtubeUrl, "_blank");
    } else {
        alert("Please enter a valid YouTube playlist link.");
    }
}

// Function to extract playlist ID
function extractPlaylistID(url) {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Auto-open YouTube in PiP mode when app is minimized
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        const link = document.getElementById("videoLink").value;
        if (link.includes("youtube.com") || link.includes("youtu.be")) {
            alert("Your video will continue playing in the YouTube app. Enable PiP manually.");
            openVideoInNewTab();
        }
    }
});

// Register Service Worker for offline caching
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((error) => console.log("Service Worker Registration Failed", error));
}