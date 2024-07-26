(() => {
    let keywords = []; 

    const observer = new MutationObserver(() => {
        processVideoElements();
      
    });

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.type === "NEW") {
            newPageLoaded();
        } else if (obj.type === "UPDATE_KEYWORDS") {
            keywords = obj.keywords;
            processVideoElements();
        }
    });
    

    function newPageLoaded() {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        processVideoElements();
    
    }




    function processVideoElements() {
        const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');
        const highlightColor = "#757d09";
        videoElements.forEach((element) => {

            const titleElement = element.querySelector('#video-title');
            if (!titleElement) return;

            const title = titleElement.textContent.toLowerCase();
            const thumbnail = element.querySelector('#thumbnail');
            
            if (keywords.some(keyword => title.includes(keyword.toLowerCase()))) {
                // Highlight matching videos
                titleElement.style.backgroundColor = highlightColor;
                if (thumbnail) thumbnail.style.filter = 'none';
                element.style.pointerEvents = 'auto';
            } else {
                // Blur non-matching videos
                titleElement.style.backgroundColor = 'transparent';
                if (thumbnail) thumbnail.style.filter = 'blur(8px)';
                element.style.pointerEvents = 'none';
            }
        });
    }

    
    newPageLoaded();
})();