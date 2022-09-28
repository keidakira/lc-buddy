const extensionIconClickListener = () => {
    chrome.tabs.create({ url: 'info.html' });
};

chrome.action.onClicked.addListener(extensionIconClickListener);