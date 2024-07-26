

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['keywords'], (result) => {
        if (!result.keywords) {
            chrome.storage.sync.set({keywords: []});
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("youtube.com")) {
        chrome.storage.sync.get(['keywords'], (result) => {
            chrome.tabs.sendMessage(tabId, {
                type: "UPDATE_KEYWORDS",
                keywords: result.keywords || []
            });
        });
    }
});

