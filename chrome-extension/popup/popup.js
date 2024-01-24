// popup.js;
document.addEventListener("DOMContentLoaded", async function () {
  // Your popup logic goes here

  let isLoadingProducts = false;
  let originContainsBoxCartInject = false; // Is boxcart injecting in whitelisted origins?
  let lastProductIdFromSearch, lastProductIdFromNearbyFetch;
  let distance = 5;
  let userQuery = "";
  let hasMoreProducts = true; // Flag to track if there are more products to fetch

  const a_icon = chrome.runtime.getURL("icons/business_identity/a_icon.png");
  const american_flag_icon = chrome.runtime.getURL(
    "icons/business_identity/american_flag_icon.png"
  );
  const b_icon = chrome.runtime.getURL("icons/business_identity/b_icon.png");
  const bcorp_icon = chrome.runtime.getURL(
    "icons/business_identity/bcorp_icon.png"
  );
  const family_icon = chrome.runtime.getURL(
    "icons/business_identity/family_icon.png"
  );
  const i_icon = chrome.runtime.getURL("icons/business_identity/i_icon.png");
  const l_icon = chrome.runtime.getURL("icons/business_identity/l_icon.png");
  const lgbtqia_icon = chrome.runtime.getURL(
    "icons/business_identity/lgbtqia_icon.png"
  );
  const recycle_icon = chrome.runtime.getURL(
    "icons/business_identity/recycle_icon.png"
  );
  const vegan_icon = chrome.runtime.getURL(
    "icons/business_identity/vegan_icon.png"
  );
  const vegetarian_icon = chrome.runtime.getURL(
    "icons/business_identity/vegetarian_icon.png"
  );
  const veteran_icon = chrome.runtime.getURL(
    "icons/business_identity/veteran_icon.png"
  );
  const businessIdentityArr = [
    {
      id: "aapi",
      name: "AAPI",
      label: "AAPI",
      imgSrc: a_icon,
      imgAlt: "aapi icon",
    },
    {
      id: "b-corp-certified",
      name: "B-Corp",
      label: "B corp certified",
      imgSrc: bcorp_icon,
      imgAlt: "b corp icon",
    },
    {
      id: "black-owned",
      name: "Black owned",
      label: "Black owned",
      imgSrc: b_icon,
      imgAlt: "black avatar icon",
    },
    {
      id: "family-owned",
      name: "Family owned",
      label: "Family owned",
      imgSrc: family_icon,
      imgAlt: "family icon",
    },
    {
      id: "indigenous-owned",
      name: "Indigenous owned",
      label: "Indigenous owned",
      imgSrc: i_icon,
      imgAlt: "indigenous avatar icon",
    },
    {
      id: "latina-owned",
      name: "Latina owned",
      label: "Latina owned",
      imgSrc: l_icon,
      imgAlt: "latina avatar icon",
    },
    {
      id: "lgbtqia-owned",
      name: "LGBTQIA+ owned",
      label: "LGBTQIA+ owned",
      imgSrc: lgbtqia_icon,
      imgAlt: "lgbtqia icon",
    },
    {
      id: "made-in-america",
      name: "Made in america",
      label: "Made in america",
      imgSrc: american_flag_icon,
      imgAlt: "american flag icon",
    },
    {
      id: "sustainable",
      name: "Sustainable",
      label: "Sustainable",
      imgSrc: recycle_icon,
      imgAlt: "sustainability icon",
    },
    {
      id: "vegan",
      name: "Vegan",
      label: "Vegan",
      imgSrc: vegan_icon,
      imgAlt: "vegan icon",
    },
    {
      id: "vegetarian",
      name: "Vegetarian",
      label: "Vegetarian",
      imgSrc: vegetarian_icon,
      imgAlt: "vegetarian icon",
    },
    {
      id: "veteran-owned",
      name: "Veteran owned",
      label: "Veteran owned",
      imgSrc: veteran_icon,
      imgAlt: "veteran icon",
    },
  ];

  function checkValidOrigin(url) {
    const originGoogle = url.includes("google.com/search");
    const originAmazon = url.includes("amazon.com/s");
    const originEtsy = url.includes("etsy.com/search");
    const originWalmart = url.includes("walmart.com/search");
    const originaTarget = url.includes("target.com/"); //either query with s?searchTerm=band+aid (search on target site), or endpoint letter based on category (ie band-aid = target.com/b/band-aid if on google, get 2nd param)
    const originEbay = url.includes("ebay.com/"); //search query on site = sch/i.html? | search from google = ebay.com/b/{param}

    originContainsBoxCartInject =
      originGoogle ||
      originAmazon ||
      originEtsy ||
      originaTarget ||
      originWalmart ||
      originEbay;
  }

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);

    console.log("tab", tab);

    if (tab) {
      checkValidOrigin(tab.url);
    }
  }

  await getCurrentTab();

  if (originContainsBoxCartInject) {
    await loadAccountPopup();
    return;
  } else {
    await loadBoxCartPopup();
  }

  async function loadBoxCartPopup() {
    let showFilter = false;

    const productUtilsFile = chrome.runtime.getURL("./utils/products.js");
    const { fetchAllProductsNearby, fetchSearchedProducts } = await import(
      productUtilsFile
    );

    const boxcartPopupElement = document.getElementById(
      "boxcart-popup-content"
    );
    const boxcartHeaderContainerElement = document.getElementById(
      "boxcart-header-container"
    );
    const boxcartProductListContainer = document.getElementById(
      "boxcart-product-list-container"
    );

    // Fetch the content of components/header and components/search
    const popupHeaderRes = await fetch("./components/header.html");
    const popupSearchRes = await fetch("./components/search.html");
    const boxcartHeaderHtml = await popupHeaderRes.text();
    const boxcartSearchHtml = await popupSearchRes.text();

    // Set the content of boxcart-header-container
    boxcartHeaderContainerElement.innerHTML = boxcartHeaderHtml;
    boxcartHeaderContainerElement.innerHTML += boxcartSearchHtml;
    boxcartPopupElement.style.height = "600px";

    const boxcartUserButton = document.getElementById("boxcart-user-button");
    const boxcartFilterButton = document.getElementById(
      "boxcart-filter-button"
    );
    const boxcartFilterModal = document.getElementById("boxcart-filter-modal");
    const searchInput = document.querySelector(".boxcart-search");
    const searchForm = document.getElementById("boxcart-search-form");

    searchInput.addEventListener("input", function (event) {
      userQuery = searchInput.value;
    });

    searchForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the default form submission

      removeCurrentProductList(boxcartProductListContainer);
      showLoadingIndicator();

      const fetchProducts = userQuery
        ? fetchSearchedProducts
        : fetchAllProductsNearby;

      lastProductIdFromSearch = "undefined";
      lastProductIdFromNearbyFetch = "undefined";

      const searchResults = await performSearch(
        userQuery,
        fetchProducts,
        distance
      );

      hideLoadingIndicator();
      isLoadingProducts = false;
      handleSearchResults(searchResults, boxcartProductListContainer);
    });

    boxcartUserButton.addEventListener("click", () => {
      openBoxCartUserAccount();
    });

    boxcartFilterButton.addEventListener("click", () => {
      if (showFilter) {
        boxcartFilterModal.style.visibility = "hidden";
        showFilter = false;
      } else {
        boxcartFilterModal.style.visibility = "visible";
        showFilter = true;
      }
    });

    appendProductFooter();
    showLoadingIndicator();

    // Fetch the content of popup-product-card.html
    const searchResults = await performSearch(
      userQuery,
      fetchAllProductsNearby,
      distance
    );

    // Add infinite scroll listener on first load

    addInfiniteScrollToProductContainer(
      boxcartProductListContainer,
      fetchAllProductsNearby,
      fetchSearchedProducts
    );

    hideLoadingIndicator();
    isLoadingProducts = false;
    handleSearchResults(searchResults, boxcartProductListContainer);
  }

  async function loadAccountPopup() {
    const boxcartPopupElement = document.getElementById(
      "boxcart-popup-content"
    );
    const boxcartHeaderContainerElement = document.getElementById(
      "boxcart-header-container"
    );
    const boxcartAccountBodyContainerElement = document.getElementById(
      "boxcart-account-body-container"
    );

    // Fetch the content of components/header and components/search
    const popupHeaderRes = await fetch("./components/header.html");
    const accountBodyRes = await fetch("./account/body.html");
    const boxcartHeaderHtml = await popupHeaderRes.text();
    const accountBodyHtml = await accountBodyRes.text();

    // Set the content of boxcart-header-container
    boxcartHeaderContainerElement.innerHTML = boxcartHeaderHtml;
    boxcartAccountBodyContainerElement.innerHTML = accountBodyHtml;

    const boxcartUserButton = document.getElementById("boxcart-user-button");
    const boxcartAccountGreetingElement = document.getElementById(
      "boxcart-logo-account"
    );

    boxcartUserButton.addEventListener("click", () => {
      openBoxCartUserAccount();
    });

    boxcartPopupElement.style.height = "300px";
    boxcartAccountBodyContainerElement.style.display = "block";
    boxcartAccountGreetingElement.textContent = "👋 Hi, Garwing!";
    boxcartHeaderContainerElement.style.padding = "0.5rem 1rem";

    appendProductFooter();
  }

  function openBoxCartUserAccount() {
    const route = "https://boxcart.shop/user/account/orders";
    window.open(route, "_blank");
  }

  async function performSearch(userQuery, fetchProducts, distance) {
    isLoadingProducts = true;
    hasMoreProducts = true;
    const productUtilsFile = chrome.runtime.getURL("./utils/index.js");
    const { getUserCurrentLocation } = await import(productUtilsFile);

    return new Promise((resolve, reject) => {
      getUserCurrentLocation(async (position) => {
        const userLat = position.userLat;
        const userLng = position.userLng;
        const fetchType = userQuery ? "search" : "nearby";
        let fetchedProducts = [];

        if (fetchType === "search") {
          // Search queried products
          const response = await fetchProducts(
            userQuery,
            userLat,
            userLng,
            distance,
            lastProductIdFromSearch
          );

          if (!response) {
            // todo: handle error
          }

          const { products, newLastProductId } = response;

          fetchedProducts = products;
          lastProductIdFromSearch = newLastProductId;
          lastProductIdFromNearbyFetch = "undefined";
        } else {
          // seaerch products nearby
          const response = await fetchProducts(
            userLat,
            userLng,
            distance,
            lastProductIdFromNearbyFetch
          );

          if (!response) {
            // todo: handle error
          }

          const { products, newLastProductId } = response;

          fetchedProducts = products;
          lastProductIdFromNearbyFetch = newLastProductId;
          lastProductIdFromSearch = "undefined";
        }

        resolve({ fetchType, fetchedProducts });
      });
    });
  }

  function removeCurrentProductList(boxcartProductListContainer) {
    boxcartProductListContainer.innerHTML = "";
  }

  async function injectProducts(products, boxcartProductListContainer) {
    const popupProductCardRes = await fetch("./boxcart/product-card.html");
    const boxcartProductCardHtml = await popupProductCardRes.text();

    // Loop through products and create HTML elements
    products.forEach((product) => {
      const {
        id,
        productId,
        defaultImage,
        productName,
        salePriceStr,
        priceStr,
        defaultImageAlt,
        fullDomain,
        businessName,
        businessIdentities,
        account,
      } = product;

      const domain = fullDomain ? fullDomain : account.fullDomain;
      const identities = businessIdentities
        ? businessIdentities
        : account.businessIdentities;

      const httpsDomain = "https://" + domain + "/product/" + id;
      const businessIdentitiesArray = identities.split(", ");
      const productCardElement = document.createElement("div");

      productCardElement.innerHTML = boxcartProductCardHtml;
      productCardElement.classList.add("boxcart-product-card", "boxcart-flex");

      // Update the productCardElement with product details (adjust this part based on your product structure)
      const businessIdentityElement = productCardElement.querySelector(
        ".boxcart-identity-container"
      );

      for (let j = 0; j < businessIdentitiesArray.length; j++) {
        const identity = businessIdentitiesArray[j];
        const businessIdentityIconElement = document.createElement("img");

        businessIdentityIconElement.classList.add(
          "boxcart-identity-image",
          "boxcart-identity-image-container"
        );

        switch (identity) {
          case "AAPI":
            businessIdentityIconElement.src = a_icon;
            businessIdentityIconElement.alt = "Aapi icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "B-Corp":
            businessIdentityIconElement.src = bcorp_icon;
            businessIdentityIconElement.alt = "B-corp icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "Black owned":
            businessIdentityIconElement.src = b_icon;
            businessIdentityIconElement.alt = "Black owned icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "Family owned":
            businessIdentityIconElement.src = family_icon;
            businessIdentityIconElement.alt = "Family owned icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "Indigenous owned":
            businessIdentityIconElement.src = i_icon;
            businessIdentityIconElement.alt = "Indigenous owned icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "Latina owned":
            businessIdentityIconElement.src = l_icon;
            businessIdentityIconElement.alt = "Latina owned icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "LGBTQIA+ owned":
            businessIdentityIconElement.src = lgbtqia_icon;
            businessIdentityIconElement.alt = "Lgbtqia+ owned icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "Made in america":
            businessIdentityIconElement.src = american_flag_icon;
            businessIdentityIconElement.alt = "Made in america icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "Sustainable":
            businessIdentityIconElement.src = recycle_icon;
            businessIdentityIconElement.alt = "Sustainable icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "Vegan":
            businessIdentityIconElement.src = vegan_icon;
            businessIdentityIconElement.alt = "Vegan icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "Vegetarian":
            businessIdentityIconElement.src = vegetarian_icon;
            businessIdentityIconElement.alt = "Vegetarian icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;
          case "Veteran owned":
            businessIdentityIconElement.src = veteran_icon;
            businessIdentityIconElement.alt = "Veteran owned icon";
            businessIdentityElement.appendChild(businessIdentityIconElement);
            break;

          default:
            break;
        }
      }
      const productImageElement = productCardElement.querySelector(
        ".boxcart-product-image"
      );
      const productSaleElement = productCardElement.querySelector(
        ".boxcart-product-sale"
      );
      const productBusinessNameElement = productCardElement.querySelector(
        ".boxcart-product-business-name"
      );
      const productNameElement = productCardElement.querySelector(
        ".boxcart-product-name"
      );
      const productDistanceElement = productCardElement.querySelector(
        ".boxcart-product-distance"
      );

      const productPriceElement = productCardElement.querySelector(
        ".boxcart-product-price"
      );
      const productOrignalPriceElement = productCardElement.querySelector(
        ".boxcart-product-original-price"
      );

      const shopButtonElement = productCardElement.querySelector(
        ".boxcart-shop-button"
      );
      const numProductInCartElement = document.querySelector(
        "boxcart-product-num-in-cart"
      );

      // Product Image Group
      productImageElement.src = defaultImage;
      productImageElement.alt = defaultImageAlt
        ? defaultImageAlt
        : `Product image of ${productName}`;
      productSaleElement.style.visibility = salePriceStr ? "visible" : "hidden";

      // Product Price Group
      productOrignalPriceElement.style.visibility = salePriceStr
        ? "visible"
        : "hidden";
      productOrignalPriceElement.textContent = salePriceStr ? priceStr : "";
      productPriceElement.textContent = salePriceStr ? salePriceStr : priceStr;

      // Product Card General Details
      productBusinessNameElement.textContent = businessName
        ? businessName
        : account.businessName;
      productNameElement.textContent = productName;
      productDistanceElement.textContent = "0.5 miles away";

      shopButtonElement.addEventListener("click", () => {
        window.open(httpsDomain, "_blank");
      });

      // Append the productCardElement to the product list container
      boxcartProductListContainer.style.display = "flex";
      boxcartProductListContainer.appendChild(productCardElement);
    });
  }

  // Function to show loading spinner or any other loading indicator
  function showLoadingIndicator() {
    // Add your logic to show loading indicator, for example:
    const loadingIndicator = document.getElementById(
      "boxcart-loading-indicator"
    );
    loadingIndicator.style.display = "block";
  }

  // Function to hide loading spinner or any other loading indicator
  function hideLoadingIndicator() {
    // Add your logic to hide loading indicator, for example:
    const loadingIndicator = document.getElementById(
      "boxcart-loading-indicator"
    );
    loadingIndicator.style.display = "none";
  }

  function addInfiniteScrollToProductContainer(
    boxcartProductListContainer,
    fetchAllProductsNearby,
    fetchSearchedProducts
  ) {
    boxcartProductListContainer.addEventListener("scroll", async () => {
      const scrollPosition = boxcartProductListContainer.scrollTop;
      const containerHeight = boxcartProductListContainer.clientHeight;
      const contentHeight = boxcartProductListContainer.scrollHeight;

      if (
        scrollPosition + containerHeight >= contentHeight - 100 &&
        !isLoadingProducts &&
        hasMoreProducts
      ) {
        isLoadingProducts = true;
        const fetchProducts = userQuery
          ? fetchSearchedProducts
          : fetchAllProductsNearby;

        if (isLoadingProducts) {
          const searchLoadingElement = document.createElement("div");
          searchLoadingElement.classList.add("boxcart-search-loading");
          searchLoadingElement.innerHTML = `<div class="boxcart-search-loading-container">
              <p>Loading more products...</p>
              </div>`;
          searchLoadingElement.style.textAlign = "center";
          searchLoadingElement.style.padding = "1rem";

          boxcartProductListContainer.appendChild(searchLoadingElement);
        }

        const searchResults = await performSearch(
          userQuery,
          fetchProducts,
          distance
        );

        isLoadingProducts = false;

        if (!isLoadingProducts) {
          // Remove searchLoadingElement
          const searchLoadingElement = document.querySelector(
            ".boxcart-search-loading"
          );

          if (searchLoadingElement) {
            boxcartProductListContainer.removeChild(searchLoadingElement);
          }
        }

        // Check if there are more products in the response
        if (searchResults.fetchedProducts.length === 0) {
          hasMoreProducts = false;
        }
        handleSearchResults(searchResults, boxcartProductListContainer);
      }
    });
  }

  function handleSearchResults(searchResults, boxcartProductListContainer) {
    const { fetchType, fetchedProducts } = searchResults;
    if (fetchType === "nearby" && lastProductIdFromSearch !== "undefined") {
      removeCurrentProductList(boxcartProductListContainer);
    }

    if (fetchedProducts.length < 1) {
      const noProductsElement = document.createElement("div");

      noProductsElement.style.textAlign = "center";
      noProductsElement.style.padding = "1rem";
      noProductsElement.textContent = "No products found.";

      boxcartProductListContainer.style.display = "flex";
      boxcartProductListContainer.appendChild(noProductsElement);
      return;
    }

    injectProducts(fetchedProducts, boxcartProductListContainer);
  }

  function appendProductFooter() {
    // Set boxcart-footer
    const boxcartIdentityContainerElement = document.getElementById(
      "boxcart-footer-container"
    );

    // loop businessIdentityArr and add icons to boxcartIdentityContainerElement
    for (let i = 0; i < businessIdentityArr.length; i++) {
      const { name, imgSrc, imgAlt } = businessIdentityArr[i];
      const boxcartIdentityPillElement = document.createElement("div");
      const boxcartIdentityIconElement = document.createElement("img");
      const boxcartIdentityNameElement = document.createElement("p");

      boxcartIdentityPillElement.classList.add(
        "boxcart-identity-pill-container",
        "boxcart-flex"
      );
      boxcartIdentityIconElement.classList.add("boxcart-identity-image-pill");
      boxcartIdentityNameElement.classList.add("boxcart-identity-name");

      boxcartIdentityIconElement.src = imgSrc;
      boxcartIdentityIconElement.alt = imgAlt;
      boxcartIdentityNameElement.textContent = name;

      boxcartIdentityPillElement.appendChild(boxcartIdentityIconElement);
      boxcartIdentityPillElement.appendChild(boxcartIdentityNameElement);

      boxcartIdentityContainerElement.appendChild(boxcartIdentityPillElement);
      boxcartIdentityContainerElement.style.display = "flex";
    }
  }

  // const getAuthUser = async () => {
  //   console.log("clicked");
  //   const localUrl = "http://localhost:3000/api/public/extension/auth/user";

  //   const response = await fetch(localUrl, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   console.log("response", response);
  //   const data = await response.json();
  //   console.log("data", data);
  // };

  // const accountButton = document.getElementById("boxcart-account-button");
  // accountButton.addEventListener("click", getAuthUser);
});
