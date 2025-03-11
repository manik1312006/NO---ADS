window.onload = function () {
    const params = new URLSearchParams(window.location.search);

    // Get shared URL (it could be in "url" or "text")
    let sharedUrl = params.get("url") || params.get("text");

    if (sharedUrl) {
        sharedUrl = decodeURIComponent(sharedUrl.trim()); // Decode & clean up
        document.getElementById("videoLink").value = sharedUrl;

        // Auto-detect if it's a video or playlist and embed it
        if (sharedUrl.includes("youtube.com") || sharedUrl.includes("youtu.be")) {
            if (sharedUrl.includes("list=")) {
                embedPlaylist(); // Auto-load playlist
            } else {
                embedVideo(); // Auto-load video
            }
        }
    }
};

// Function to embed a video
function embedVideo() {
    const link = document.getElementById("videoLink").value;
    const videoId = extractVideoID(link);
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.innerHTML = ""; // Clear previous video

    if (videoId) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframe.width = "858";
        iframe.height = "429";
        videoContainer.appendChild(iframe);
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

// Function to embed a playlist
function embedPlaylist() {
    const link = document.getElementById("videoLink").value;
    const playlistId = extractPlaylistID(link);
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.innerHTML = ""; // Clear previous content

    if (playlistId) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("frameborder", "0");
        iframe.width = "858";
        iframe.height = "429";
        videoContainer.appendChild(iframe);
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

// Auto-enable PiP when app is minimized or screen is turned off
document.addEventListener("visibilitychange", async () => {
    let iframe = document.querySelector("iframe");

    if (document.hidden && iframe) {
        try {
            let videoDocument = iframe.contentDocument || iframe.contentWindow.document;
            let video = videoDocument.querySelector("video");

            if (video && document.pictureInPictureEnabled && !document.pictureInPictureElement) {
                await video.requestPictureInPicture();
            }
        } catch (err) {
            console.error("Error enabling PiP:", err);
        }
    } else if (!document.hidden && document.pictureInPictureElement) {
        try {
            await document.exitPictureInPicture();
        } catch (err) {
            console.error("Error exiting PiP:", err);
        }
    }
});

// Register Service Worker for offline caching
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((error) => console.log("Service Worker Registration Failed", error));
});