function fetchVideos(prompt, timeout, unit) {
    const loader = document.getElementById("loader");
    loader.style.display = "flex"
    let ntimeout = unit === "hours" ? timeout * 3600000 : timeout * 60000;
    chrome.runtime.sendMessage({ action: "fetchVideos", prompt }, (response) => {
        loader.style.display = "none"
        if (response.success) {
            chrome.windows.create({
                url: response.playlist,
                incognito: true
            }, (newWindow) => {
                setTimeout(() => {
                    chrome.scripting.executeScript({
                        target: { tabId: newWindow.tabs[0].id },
                        files: ["notify.js"]
                    });
                }, ntimeout - 5000);
                setTimeout(() => {
                    chrome.windows.remove(newWindow.id);
                }, ntimeout);
            });
        } else {
            alert("Error fetching videos: " + response.error);
        }
    });
}

document.getElementById("useOnceBtn").addEventListener("click", () => {
    const prompt = document.getElementById("prompt").value;
    const timeout = parseInt(document.getElementById("timeout").value, 10);
    const unit = document.getElementById("timeoutUnit").value;
    if (!prompt || isNaN(timeout) || timeout <= 0) {
        alert("Please enter a valid prompt and timeout value.");
        return;
    }

    fetchVideos(prompt, timeout, unit);
});

document.getElementById("saveForLaterBtn").addEventListener("click", () => {
    const prompt = document.getElementById("prompt").value;
    if (!prompt) {
        alert("Please enter a prompt to save.");
        return;
    }

    chrome.storage.local.get({ savedPrompts: [] }, (data) => {
        let savedPrompts = data.savedPrompts;
        if (!savedPrompts.includes(prompt)) {
            savedPrompts.push(prompt);
            chrome.storage.local.set({ savedPrompts }, () => {
                alert("Prompt saved successfully!");
                loadSavedPrompts();
            });
        } else {
            alert("This prompt is already saved.");
        }
    });
});


function loadSavedPrompts() {
    chrome.storage.local.get({ savedPrompts: [] }, (data) => {
        const savedPrompts = data.savedPrompts;
        const dropdown = document.getElementById("savedPrompts");

        dropdown.innerHTML = '<option value="">Select a saved prompt</option>';
        savedPrompts.forEach((prompt) => {
            const option = document.createElement("option");
            option.value = prompt;
            option.textContent = prompt;
            dropdown.appendChild(option);
        });
    });
}


document.getElementById("useSavedBtn").addEventListener("click", () => {
    const selectedPrompt = document.getElementById("savedPrompts").value;
    const timeout = parseInt(document.getElementById("timeout").value, 10);
    const unit = document.getElementById("timeoutUnit").value;

    if (!selectedPrompt || isNaN(timeout) || timeout <= 0) {
        alert("Please select a valid saved prompt and enter a timeout.");
        return;
    }

    fetchVideos(selectedPrompt, timeout, unit);
});


document.getElementById("deleteSavedBtn").addEventListener("click", () => {
    const selectedPrompt = document.getElementById("savedPrompts").value;

    if (!selectedPrompt) {
        alert("Please select a prompt to delete.");
        return;
    }

    chrome.storage.local.get({ savedPrompts: [] }, (data) => {
        let savedPrompts = data.savedPrompts.filter((prompt) => prompt !== selectedPrompt);
        chrome.storage.local.set({ savedPrompts }, () => {
            alert("Prompt deleted successfully.");
            loadSavedPrompts();
        });
    });
});


document.addEventListener("DOMContentLoaded", loadSavedPrompts);
