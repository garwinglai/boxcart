console.log("bcakground");

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("script");
  if (tab.url && tab.url.includes("google.com/search")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    if (changeInfo.status === "complete") {
      chrome.tabs.sendMessage(tabId, {
        type: "NEW_SEARCH",
        provider: "google",
        query: urlParameters.get("q"),
      });
      console.log("Message sent");
    }
  }
});
