let keywords = [];

function updateKeywordList() {
    const keywordList = document.getElementById('keywordList');
    keywordList.innerHTML = '';
    keywords.forEach((keyword, index) => {
        const keywordElement = document.createElement('span');
        keywordElement.className = 'keyword';
        keywordElement.textContent = keyword;
        const removeButton = document.createElement('span');
        removeButton.className = 'remove';
        removeButton.textContent = 'X';
        removeButton.onclick = () => removeKeyword(index);
        keywordElement.appendChild(removeButton);
        keywordList.appendChild(keywordElement);
    });
}

function addKeyword() {
    const input = document.getElementById('keywordInput');
    const keyword = input.value.trim();
    if (keyword && !keywords.includes(keyword)) {
        keywords.push(keyword);
        saveKeywords();
        input.value = '';
    }
}

function removeKeyword(index) {
    keywords.splice(index, 1);
    saveKeywords();
}

function saveKeywords() {
    chrome.storage.sync.set({keywords: keywords}, () => {
        updateKeywordList();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "UPDATE_KEYWORDS", keywords: keywords});
        });
    });
}

document.getElementById('addKeyword').addEventListener('click', addKeyword);

document.getElementById('keywordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addKeyword();
    }
});

// Load existing keywords when popup opens
chrome.storage.sync.get(['keywords'], (result) => {
    if (result.keywords) {
        keywords = result.keywords;
        updateKeywordList();
    }
});