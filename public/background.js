let isEnabled = false;
let whitelist = ["example-dapp.com"];

chrome.storage.sync.get(['isEnabled', 'whitelist'], function(result) {
  if (result.isEnabled !== undefined) {
    isEnabled = result.isEnabled;
  }
  if (result.whitelist) {
    whitelist = result.whitelist;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!isEnabled) return { cancel: false };
    const url = new URL(details.url);
    const hostname = url.hostname;
    if (whitelist.includes(hostname)) {
      return { cancel: false };
    } else {
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateSettings') {
    isEnabled = message.isEnabled;
    whitelist = message.whitelist;
    chrome.storage.sync.set({ isEnabled, whitelist });
    sendResponse({ status: 'success' });
  }
});
