chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("background script running.");

  const originGoogle = tab.url.includes("google.com/search");
  const originAmazon = tab.url.includes("amazon.com/s");
  const originEtsy = tab.url.includes("etsy.com/search");
  const originWalmart = tab.url.includes("walmart.com/search");
  const originaTarget = tab.url.includes("target.com/"); //either query with s?searchTerm=band+aid (search on target site), or endpoint letter based on category (ie band-aid = target.com/b/band-aid if on google, get 2nd param)
  const originEbay = tab.url.includes("ebay.com/"); //search query on site = sch/i.html? | search from google = ebay.com/b/{param}

  const allowedOrigin =
    originGoogle ||
    originAmazon ||
    originEtsy ||
    originaTarget ||
    originWalmart ||
    originEbay;

  const provider = originGoogle
    ? "GOOGLE"
    : originAmazon
    ? "AMAZON"
    : originEtsy
    ? "ETSY"
    : originaTarget
    ? "TARGET"
    : originWalmart
    ? "WALMART"
    : originEbay
    ? "EBAY"
    : "OTHER";

  if (provider === "OTHER") return;

  if (changeInfo.status === "loading") {
    if (tab.url && allowedOrigin) {
      chrome.scripting.insertCSS({
        target: { tabId },
        files: ["inject/boxcart-insert.css"],
      });
    }
  }

  if (changeInfo.status === "complete") {
    if (tab.url && allowedOrigin) {
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const query = getQueryFromUrl(urlParameters, provider);

      chrome.tabs.sendMessage(tabId, {
        type: "NEW_SEARCH",
        provider,
        query,
      });
      console.log("Message sent");
    }
  }

  function getQueryFromUrl(urlParameters, provider) {
    let query = "";

    if (provider === "GOOGLE") {
      query = urlParameters.get("q");
    } else if (provider === "AMAZON") {
      query = urlParameters.get("k");
    } else if (provider === "ETSY") {
      query = urlParameters.get("q");
    } else if (provider === "TARGET") {
      query = urlParameters.get("searchTerm");
    } else if (provider === "WALMART") {
      query = urlParameters.get("q");
    } else if (provider === "EBAY") {
      query = urlParameters.get("_nkw");
    }

    return query;
  }
});
