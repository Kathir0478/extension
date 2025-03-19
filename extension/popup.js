document.getElementById("filterBtn").addEventListener("click", () => {
    const prompt = document.getElementById("prompt").value;
    const timeout = parseInt(document.getElementById("timeout").value, 10) * 1000; // Convert to milliseconds

    if (!prompt || isNaN(timeout) || timeout <= 0) {
        alert("Please enter a valid prompt and timeout value.");
        return;
    }

    chrome.runtime.sendMessage({ action: "fetchVideos", prompt, timeout }, (response) => {
        if (response.success) {
            chrome.windows.create({
                url: response.playlist,
                incognito: true
            }, (newWindow) => {
                setTimeout(() => {
                    // Close the tab after the timeout
                    chrome.windows.remove(newWindow.id);
                }, timeout);
            });
        } else {
            alert("Error fetching videos: " + response.error);
        }
    });
});
