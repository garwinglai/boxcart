console.log("bcakground");

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("script");
  if (tab.url && tab.url.includes("google.com/search")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const query = urlParameters.get("q");
    if (changeInfo.status === "complete") {
      const products = await fetchProducts(query);
      chrome.tabs.sendMessage(tabId, {
        type: "NEW_SEARCH",
        provider: "google",
        query,
      });
      console.log("Message sent");
    }
  }
});

const fetchProducts = async (query) => {
  console.log("query", query);
  const url = "https://boxcart.shop/api/public/extension/get-products";
  const localUrl = "http://localhost:3000/api/public/extension/get-products";
  const response = await fetch(localUrl, {
    method: "GET",
  });

  console.log("response", response);
};
