function embedVideo() {
    const link = document.getElementById('videoLink').value;
    const videoId = extractVideoID(link);
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = ''; // Clear previous video

    if (videoId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.width = "858";
        iframe.height = "429";
        videoContainer.appendChild(iframe);
    } else {
        alert('Please enter a valid YouTube link.');
    }
}

function extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed|live)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
