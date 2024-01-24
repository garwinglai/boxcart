// content.js
(async () => {
  let mainContainer;
  let isLoadingProducts = false;
  let lastProductIdFromSearch, lastProductIdFromNearbyFetch;
  let distance = 5;
  let userQuery = "";
  let currentProvider = "";
  let hasMoreProducts = true; // Flag to track if there are more products to fetch

  const productUtilsFile = chrome.runtime.getURL("./utils/products.js");
  const utilsFile = chrome.runtime.getURL("./utils/index.js");

  const { fetchSearchedProducts, fetchAllProductsNearby } = await import(
    productUtilsFile
  );
  const { getUserCurrentLocation } = await import(utilsFile);

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

  const injectProducts = (
    products,
    boxcartBottomContainerElement,
    boxcartProductInsertHTML
  ) => {
    const noImageSrc = "https://fl-1.cdn.flockler.com/embed/no-image.svg";

    for (let i = 0; i < products.length; i++) {
      const currProduct = products[i];
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
      } = currProduct;

      const domain = fullDomain ? fullDomain : account.fullDomain;
      const identities = businessIdentities
        ? businessIdentities
        : account.businessIdentities;

      const httpsDomain = "https://" + domain + "/product/" + id;
      const businessIdentitiesArray = identities.split(", ");

      // Create a unique class for each product card
      const productCardClass = `boxcart-product-card-${productId}`;

      const productCardElement = document.createElement("div");
      // const businessIdentityElement = document.createElement("img");
      productCardElement.classList.add(
        "boxcart-product-card",
        "boxcart-flex",
        productCardClass
      );
      productCardElement.innerHTML = boxcartProductInsertHTML;
      boxcartBottomContainerElement.appendChild(productCardElement);

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
      productImageElement.src = defaultImage ? defaultImage : noImageSrc;
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
      productBusinessNameElement.textContent = businessName;
      productNameElement.textContent = productName;
      productDistanceElement.textContent = "0.5 miles away";

      if (currentProvider === "AMAZON") {
        productPriceElement.style.fontSize = "14px";
      } else if (currentProvider === "ETSY") {
        productPriceElement.style.fontSize = "14px";
      }

      shopButtonElement.addEventListener("click", () => {
        window.open(httpsDomain, "_blank");
      });
    }
  };

  const injectBoxCartHTML = async (searchResults) => {
    let boxcartBottomContainerElement;
    let boxcartTopContainerElement;
    let userIconElement;
    let closeIconElement;
    let filterIconElement;
    let fetchedProducts = searchResults.fetchedProducts;
    let showFilter = false;

    console.log("searchResults", searchResults);

    const userIconUrl = chrome.runtime.getURL(
      "icons/user_icon_black_filled.png"
    );
    const closeIconUrl = chrome.runtime.getURL(
      "icons/close_icon_black_filled.png"
    );
    const filterIconUrl = chrome.runtime.getURL(
      "icons/filter_icon_black_filled.png"
    );

    const boxcartOverlayElement = document.createElement("div");
    boxcartOverlayElement.className = "boxcart-container";
    boxcartOverlayElement.id = "boxcart-container";

    try {
      const htmlFilePaths = [
        chrome.runtime.getURL("inject/boxcart-insert.html"),
        chrome.runtime.getURL("inject/boxcart-product-card-insert.html"),
      ];

      const responses = await Promise.all(
        htmlFilePaths.map((path) => fetch(path))
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error(
          `Failed to fetch one or more HTML files: ${htmlFilePaths.join(", ")}`
        );
      }

      const [boxcartInsertHTML, boxcartProductInsertHTML] = await Promise.all(
        responses.map((response) => response.text())
      );

      boxcartOverlayElement.innerHTML = boxcartInsertHTML;
      mainContainer.appendChild(boxcartOverlayElement);

      const boxcartIdentityContainerElement = document.getElementById(
        "boxcart-footer-container"
      );

      // loop businessIdentityArr and add icons to boxcartIdentityContainerElement
      for (let i = 0; i < businessIdentityArr.length; i++) {
        const boxcartIdentityPillElement = document.createElement("div");
        const boxcartIdentityIconElement = document.createElement("img");
        const boxcartIdentityNameElement = document.createElement("p");

        boxcartIdentityPillElement.classList.add(
          "boxcart-identity-pill-container",
          "boxcart-flex"
        );
        boxcartIdentityIconElement.classList.add("boxcart-identity-image-pill");
        boxcartIdentityNameElement.classList.add("boxcart-identity-name");

        const { name, imgSrc, imgAlt } = businessIdentityArr[i];
        boxcartIdentityIconElement.src = imgSrc;
        boxcartIdentityIconElement.alt = imgAlt;
        boxcartIdentityNameElement.textContent = name;

        boxcartIdentityPillElement.appendChild(boxcartIdentityIconElement);
        boxcartIdentityPillElement.appendChild(boxcartIdentityNameElement);
        boxcartIdentityContainerElement.appendChild(boxcartIdentityPillElement);

        if (
          currentProvider === "TARGET" ||
          currentProvider === "WALMART" ||
          currentProvider === "AMAZON"
        ) {
        }
      }

      const boxcartCloseButton = document.getElementById(
        "boxcart-close-button"
      );
      const boxcartUserButton = document.getElementById("boxcart-user-button");
      const boxcartFilterButton = document.getElementById(
        "boxcart-filter-button"
      );
      const boxcartFilterModal = document.getElementById(
        "boxcart-filter-modal"
      );
      const searchInput = document.querySelector(".boxcart-search");
      const searchForm = document.getElementById("boxcart-search-form");
      // const distanceParagraphElement =
      //   document.getElementById("boxcart-distance-p");
      // const priceParagraphElement = document.getElementById("boxcart-price-p");

      searchInput.addEventListener("input", function (event) {
        userQuery = searchInput.value;
      });

      searchForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the default form submission

        removeCurrentProductList(boxcartBottomContainerElement);
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
        handleSearchResults(
          searchResults,
          boxcartBottomContainerElement,
          boxcartProductInsertHTML
        );
      });

      boxcartUserButton.addEventListener("click", () => {
        const route = "https://boxcart.shop/user/account/orders";
        window.open(route, "_blank");
      });

      boxcartCloseButton.addEventListener("click", () => {
        closeBoxCartHTML();
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

      userIconElement = document.getElementById("boxcart-user-icon");
      closeIconElement = document.getElementById("boxcart-close-icon");
      filterIconElement = document.getElementById("boxcart-filter-icon");
      boxcartBottomContainerElement = document.getElementById(
        "boxcart-bottom-container"
      );
      boxcartTopContainerElement = document.getElementById(
        "boxcart-top-container"
      );

      if (currentProvider !== "GOOGLE") {
        resizeBoxCartIcons(userIconElement);
        resizeBoxCartIcons(closeIconElement);
        resizeBoxCartIcons(filterIconElement);
      }

      if (currentProvider === "AMAZON") {
        boxcartBottomContainerElement.style.height = "calc(100% - 6.05rem)";
      } else if (currentProvider === "ETSY") {
        boxcartTopContainerElement.style.padding = "1rem 1rem 1.15rem 1.15rem";
        boxcartBottomContainerElement.style.height = "calc(100% - 8.6rem)";
        boxcartBottomContainerElement.style.paddingBottom = "5rem";
        boxcartOverlayElement.style.top = "10.5rem";
      } else if (currentProvider === "WALMART") {
        boxcartBottomContainerElement.style.height = "calc(100% - 6.9rem)";
        boxcartOverlayElement.style.top = "8.5rem";
      } else if (currentProvider === "TARGET") {
        boxcartBottomContainerElement.style.height = "calc(100% - 5.85rem)";
        boxcartOverlayElement.style.top = "8.5rem";
      } else if (currentProvider === "EBAY") {
        boxcartBottomContainerElement.style.height = "calc(100% - 6.13rem)";
        boxcartOverlayElement.style.top = "8.5rem";
      }

      if (currentProvider !== "GOOGLE" && currentProvider !== "ETSY") {
        boxcartBottomContainerElement.style.paddingBottom = "4rem";
      }

      userIconElement.src = userIconUrl;
      closeIconElement.src = closeIconUrl;
      filterIconElement.src = filterIconUrl;

      if (!fetchedProducts) {
        // todo: handle error
      }

      if (fetchedProducts.length < 1) {
        const noProductsElement = document.createElement("div");
        noProductsElement.innerHTML = "No products found.";
        noProductsElement.style.textAlign = "center";
        noProductsElement.style.margin = "1rem";
        boxcartBottomContainerElement.style.display = "block";
        boxcartBottomContainerElement.appendChild(noProductsElement);
        return;
      }

      addInfiniteScrollToProductContainer(
        boxcartBottomContainerElement,
        fetchAllProductsNearby,
        fetchSearchedProducts,
        boxcartProductInsertHTML
      );

      handleSearchResults(
        searchResults,
        boxcartBottomContainerElement,
        boxcartProductInsertHTML
      );
    } catch (error) {
      console.log("Fetch html error:", error);
    }
  };

  function handleSearchResults(
    searchResults,
    boxcartBottomContainerElement,
    boxcartProductInsertHTML
  ) {
    const { fetchType, fetchedProducts } = searchResults;
    if (fetchType === "nearby" && lastProductIdFromSearch !== "undefined") {
      removeCurrentProductList(boxcartBottomContainerElement);
    }

    if (fetchedProducts.length < 1) {
      const noProductsElement = document.createElement("div");

      noProductsElement.style.textAlign = "center";
      noProductsElement.style.padding = "1rem";
      noProductsElement.textContent = "No products found.";

      boxcartBottomContainerElement.style.display = "flex";
      boxcartBottomContainerElement.appendChild(noProductsElement);
      return;
    }

    injectProducts(
      fetchedProducts,
      boxcartBottomContainerElement,
      boxcartProductInsertHTML
    );
  }

  function addInfiniteScrollToProductContainer(
    boxcartBottomContainerElement,
    fetchAllProductsNearby,
    fetchSearchedProducts,
    boxcartProductInsertHTML
  ) {
    boxcartBottomContainerElement.addEventListener("scroll", async () => {
      const scrollPosition = boxcartBottomContainerElement.scrollTop;
      const containerHeight = boxcartBottomContainerElement.clientHeight;
      const contentHeight = boxcartBottomContainerElement.scrollHeight;

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

          boxcartBottomContainerElement.appendChild(searchLoadingElement);
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
            boxcartBottomContainerElement.removeChild(searchLoadingElement);
          }
        }

        // Check if there are more products in the response
        if (searchResults.fetchedProducts.length === 0) {
          hasMoreProducts = false;
        }
        handleSearchResults(
          searchResults,
          boxcartBottomContainerElement,
          boxcartProductInsertHTML
        );
      }
    });
  }

  async function performSearch(userQuery, fetchProducts, distance) {
    isLoadingProducts = true;
    hasMoreProducts = true;

    return new Promise((resolve, reject) => {
      getUserCurrentLocation(async (position) => {
        const userLat = position.userLat;
        const userLng = position.userLng;
        const fetchType = userQuery ? "search" : "nearby";
        let fetchedProducts = [];

        if (fetchType === "search") {
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

        isLoadingProducts = false;
        resolve({ fetchType, fetchedProducts });
      });
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

  function removeCurrentProductList(boxcartBottomContainerElement) {
    boxcartBottomContainerElement.innerHTML = "";
  }

  const resizeBoxCartIcons = (iconElement) => {
    const imageSizeAmazon = "35px";
    const imageSizeEtsy = "30px";
    const imageSizeWalmart = "35px";
    if (currentProvider === "AMAZON") {
      iconElement.style.width = imageSizeAmazon;
      iconElement.style.height = imageSizeAmazon;
    } else if (currentProvider === "ETSY") {
      iconElement.style.width = imageSizeEtsy;
      iconElement.style.height = imageSizeEtsy;
    } else if (
      currentProvider === "WALMART" ||
      currentProvider === "TARGET" ||
      currentProvider === "EBAY"
    ) {
      iconElement.style.width = imageSizeWalmart;
      iconElement.style.height = imageSizeWalmart;
    }
  };

  const closeBoxCartHTML = () => {
    const boxcartOverlayElement = document.getElementById("boxcart-container");
    showBoxCartToggle();

    mainContainer.removeChild(boxcartOverlayElement);
  };

  const showBoxCartToggle = async () => {
    const boxcartToggleElement = document.createElement("button");

    boxcartToggleElement.className = "boxcart-toggle";
    boxcartToggleElement.innerText = "Box";
    boxcartToggleElement.id = "boxcart-toggle";

    if (currentProvider === "ETSY") {
      boxcartToggleElement.style.width = "75px";
      boxcartToggleElement.style.height = "65px";
      boxcartToggleElement.style.top = "10.5rem";
    } else if (
      currentProvider === "WALMART" ||
      currentProvider === "TARGET" ||
      currentProvider === "EBAY"
    ) {
      boxcartToggleElement.style.top = "8.5rem";
    }

    mainContainer.appendChild(boxcartToggleElement);

    const searchResults = await performSearch(
      userQuery,
      fetchSearchedProducts,
      distance
    );

    // console.log("first search", products);
    // Add a click event listener to handle opening injectBoxCartHTML
    boxcartToggleElement.addEventListener("click", () => {
      mainContainer.removeChild(boxcartToggleElement);
      injectBoxCartHTML(searchResults);
    });
  };

  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      const { type, provider, query } = request;

      userQuery = query;
      currentProvider = provider;

      console.log("Received message", request);
      console.log("currentProvider", currentProvider);
      console.log("query", query);

      if (type === "NEW_SEARCH") {
        if (currentProvider === "GOOGLE") {
          mainContainer = document.getElementById("main");
        } else if (currentProvider === "AMAZON") {
          mainContainer = document.getElementById("a-page");
        } else if (currentProvider === "ETSY") {
          mainContainer = document.getElementById("content");
        } else if (
          currentProvider === "WALMART" ||
          currentProvider === "TARGET"
        ) {
          mainContainer = document.getElementById("__next");
        } else if (currentProvider === "EBAY") {
          mainContainer = document.getElementsByClassName("srp-main")[0];
        } else {
          throw new Error("Unknown currentProvider");
        }

        showBoxCartToggle();
      }
    }
  );
})();
