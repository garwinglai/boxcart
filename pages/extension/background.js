// pages/background/background.js
console.log("Background page loaded.");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});
