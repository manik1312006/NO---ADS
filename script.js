window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    let sharedUrl = params.get("url") || params.get("text");

    if (sharedUrl) {
        sharedUrl = decodeURIComponent(sharedUrl.trim());
        document.getElementById("videoLink").value = sharedUrl;

        if (sharedUrl.includes("youtube.com") || sharedUrl.includes("youtu.be")) {
            fetchAndPlayVideo(sharedUrl);
        }
    }
};

// Function to fetch the direct video URL and play it
function fetchAndPlayVideo(youtubeUrl) {
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.innerHTML = ""; // Clear previous content

    // Use a 3rd party API to get the raw video link (replace this with a better one if needed)
    fetch(`https://ytapi.org/getvideo?url=${encodeURIComponent(youtubeUrl)}`)
        .then(response => response.json())
        .then(data => {
            if (data.video_url) {
                const video = document.createElement("video");
                video.src = data.video_url;
                video.controls = true;
                video.autoplay = true;
                video.playsInline = true;
                video.width = "858";
                video.height = "429";

                videoContainer.appendChild(video);

                // Auto-enable PiP when the user minimizes the app
                document.addEventListener("visibilitychange", async () => {
                    if (document.hidden && document.pictureInPictureEnabled) {
                        try {
                            await video.requestPictureInPicture();
                        } catch (err) {
                            console.error("PiP Error:", err);
                        }
                    }
                });
            } else {
                alert("Failed to fetch video. Try another link.");
            }
        })
        .catch(error => console.error("Error fetching video:", error));
}

// Register Service Worker for offline caching
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((error) => console.log("Service Worker Registration Failed", error));
}