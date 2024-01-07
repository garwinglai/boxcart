// content.js
(() => {
  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      console.log("Received message", request);
      const { type, provider, query } = request;
      if (type === "NEW_SEARCH") {
        const products = await fetchProducts(query);
      }
    }
  );
})();

const fetchProducts = async (query) => {
  console.log("query", query);
  const url = "https://boxcart.shop/api/public/extension/get-products";
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("response", response);
};
