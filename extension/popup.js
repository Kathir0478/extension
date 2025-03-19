// document.getElementById("filterBtn").addEventListener("click", () => {
//     const prompt = document.getElementById("prompt").value;
//     const timeout = parseInt(document.getElementById("timeout").value, 10) * 60000; // Convert to milliseconds

//     if (!prompt || isNaN(timeout) || timeout <= 0) {
//         alert("Please enter a valid prompt and timeout value.");
//         return;
//     }

//     chrome.runtime.sendMessage({ action: "fetchVideos", prompt }, (response) => {
//         if (response.success) {
//             chrome.windows.create({
//                 url: response.playlist,
//                 incognito: true
//             }, (newWindow) => {
//                 setTimeout(() => {
//                     chrome.windows.remove(newWindow.id, () => {
//                         if (chrome.runtime.lastError) {
//                             console.error("Error closing window:", chrome.runtime.lastError);
//                         } else {
//                             console.log(`Closed incognito window ID: ${newWindow.id}`);
//                         }
//                     });
//                 }, timeout);
//                 console.log(timeout)
//             });
//         } else {
//             alert("Error fetching videos: " + response.error);
//         }
//     });
// });


function fetchVideos(prompt, timeout) {
    chrome.runtime.sendMessage({ action: "fetchVideos", prompt }, (response) => {
        if (response.success) {
            chrome.windows.create({
                url: response.playlist,
                incognito: true
            }, (newWindow) => {
                setTimeout(() => {
                    chrome.windows.remove(newWindow.id, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error closing window:", chrome.runtime.lastError);
                        } else {
                            console.log(`Closed incognito window ID: ${newWindow.id}`);
                        }
                    });
                }, timeout * 60000);
            });
        } else {
            alert("Error fetching videos: " + response.error);
        }
    });
}

document.getElementById("useOnceBtn").addEventListener("click", () => {
    const prompt = document.getElementById("prompt").value;
    const timeout = parseInt(document.getElementById("timeout").value, 10);

    if (!prompt || isNaN(timeout) || timeout <= 0) {
        alert("Please enter a valid prompt and timeout value.");
        return;
    }

    fetchVideos(prompt, timeout);
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

    if (!selectedPrompt || isNaN(timeout) || timeout <= 0) {
        alert("Please select a valid saved prompt and enter a timeout.");
        return;
    }

    fetchVideos(selectedPrompt, timeout);
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
