chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchVideos") {
        fetch("https://youtube-fetch.onrender.com/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: request.prompt })
        })
            .then(response => response.json())
            .then(data => sendResponse({ success: true, playlist: data.playlist }))
            .catch(error => sendResponse({ success: false, error: error.message }));

        return true;  // Keeps sendResponse valid for async response
    }
});
