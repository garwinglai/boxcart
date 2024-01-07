// content.js
(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message", request);
    const { type, provider, query } = request;
    if (type === "NEW_SEARCH") {
    }
  });
})();
