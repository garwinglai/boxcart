import React, { useState, useEffect } from "react";
import ShopMenu from "@/components/storefront/menus/shop/ShopMenu";
import ShopHeader from "@/components/storefront/ShopHeader";
import ShopLayout from "@/components/layouts/storefront/ShopLayout";
import ShopBio from "@/components/storefront/ShopBio";
import ShopFulfillment from "@/components/storefront/ShopFulfillment";
import Divider from "@mui/material/Divider";
import ShopSearchBar from "@/components/storefront/ShopSearchBar";
import CategoryShopList from "@/components/storefront/menus/shop/CategoryShopList";
import prisma from "@/lib/prisma";
import { getProductsByCategoryIdClientPublic } from "@/helper/client/api/inventory/category-schema";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import { getProductsClientPublic } from "@/helper/client/api/inventory/product-schema";
import Snackbar from "@mui/material/Snackbar";
import { useCartStore, useShopperStore } from "@/lib/store";
import { getLocalStorage, setLocalStorage } from "@/utils/clientStorage";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";
import { isAuthUserShopping } from "@/helper/server/auth/isAuth";

function Sites({ siteData, shopper }) {
  const cart = useCartStore((state) => state.cart);
  const cartDetails = useCartStore((state) => state.cartDetails);
  const setCartDetails = useCartStore((state) => state.setCartDetails);
  const setShopperAccount = useShopperStore((state) => state.setShopperAccount);
  const removeShopperAccount = useShopperStore(
    (state) => state.removeShopperAccount
  );

  const { data: session, status } = useSession();

  const {
    acceptedPayments,
    businessName,
    businessBio,
    city,
    socials,
    products,
    digitalProducts,
    fulfillmentMethodInt,
    fulfillmentMethods,
    categories,
    availability,
    bannerImage,
    logoImage,
    tax,
    isChecklistComplete,
    fullAddress,
    id: accountId,
  } = siteData || {};

  const [searchInput, setSearchInput] = useState("");

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [allInitialProducts, setAllInitialProducts] = useState(
    products && digitalProducts ? [...products, ...digitalProducts] : []
  );
  const [sortByMethod, setSortByMethod] = useState("Newest");
  const [currCategory, setCurrCategory] = useState("All Products");
  const [currCategories, setCurrCategories] = useState(
    categories ? categories : []
  );
  const [currProducts, setCurrProducts] = useState(products ? products : []);
  const [currDigitalProducts, setCurrDigitalProducts] = useState(
    digitalProducts ? digitalProducts : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
  });

  const { snackbarMessage, snackbarOpen } = openSnackbar;

  const { push, pathname, query, asPath } = useRouter();

  useEffect(() => {
    if (!shopper) {
      removeShopperAccount();
      return;
    }
    setShopperAccount(shopper);
  }, []);

  useEffect(() => {
    const businessNameFromLocalStorage = getLocalStorage("businessName");
    if (
      !businessNameFromLocalStorage ||
      businessNameFromLocalStorage !== businessName
    ) {
      setLocalStorage("businessName", businessName);
    }

    const stripeAccount = acceptedPayments.find(
      (item) => item.paymentMethod === "stripe"
    );
    if (!stripeAccount) return;

    const { stripeAccountId } = stripeAccount;
    if (stripeAccountId) {
      setLocalStorage("stripeAccountId", stripeAccountId);
    }
  }, [siteData, pathname]);

  useEffect(() => {
    if (!availability) return;
    const { hasCustomAvailability, isTimeBlockEnabled } = availability;
    const { taxRate, taxRateDisplay, isTaxRateEnabled } = tax ? tax : {};
    let pickupNote = "";

    for (let i = 0; i < fulfillmentMethods.length; i++) {
      const currMethod = fulfillmentMethods[i];
      const { methodInt } = currMethod;
      if (methodInt == 1) {
        pickupNote = currMethod.pickupNote;
      }
    }

    const numberOfTipOptions = 3;

    const { fulfillmentType, fulfillmentDisplay } = cartDetails;
    let typeOfFulfillment;
    let displayFulfillmentType;

    if (fulfillmentType && fulfillmentType == fulfillmentMethodInt) {
      typeOfFulfillment = fulfillmentType;
      displayFulfillmentType = fulfillmentDisplay;
      pickupNote = cartDetails.pickupNote;
    } else {
      typeOfFulfillment = fulfillmentMethodInt == 0 ? 0 : 1;
      displayFulfillmentType =
        fulfillmentMethodInt == 0 ? "delivery" : "pickup";
      pickupNote = fulfillmentMethodInt == 0 ? "" : pickupNote;
    }

    setCartDetails({
      taxRate: isTaxRateEnabled ? taxRate : 0,
      taxRateDisplay: isTaxRateEnabled ? taxRateDisplay : "$0.00",
      requireOrderTime: isTimeBlockEnabled,
      requireOrderDate: hasCustomAvailability,
      fulfillmentType: typeOfFulfillment,
      fulfillmentDisplay: displayFulfillmentType,
      pickupAddress: fullAddress,
      pickupNote,
    });
  }, []);

  const handleOpenSignupModal = () => setIsSignUpModalOpen(true);
  const handleCloseSignupModal = () => setIsSignUpModalOpen(false);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const getProductsByCategory = async (categoryId, categoryName) => {
    setIsLoading(true);

    const category = await getProductsByCategoryIdClientPublic(categoryId);
    // fetch categories to get category list and product count in each category.

    const { success, value, error } = category;
    const { products, digitalProducts } = value;

    if (success) {
      if (products.length > 0) {
        setCurrProducts(products);
        // update currCategories with product count
      } else {
        setCurrProducts([]);
      }

      if (digitalProducts.length > 0) {
        setCurrDigitalProducts(digitalProducts);
        // update currCategories with product count
      } else {
        setCurrDigitalProducts([]);
      }

      if (products.length > 0 || digitalProducts.length > 0) {
        setCurrCategories((prev) =>
          prev.map((prevCategory) => {
            if (prevCategory.id === categoryId) {
              return value;
            }
            return prevCategory;
          })
        );
      }

      setCurrCategory(categoryName);
    } else {
      handleOpenSnackbar("Error getting products.");
    }

    setSortByMethod("Newest");
    setIsLoading(false);
  };

  const getAllProducts = async () => {
    setIsLoading(true);
    const { success, value } = await getProductsClientPublic(accountId);
    // const categories = await getCategoriesClientPublic(accountId);

    if (success) {
      const { products, digitalProducts, categories } = value;
      setCurrProducts(products);
      setCurrCategory("All Products");
      setCurrCategories(categories);
      setCurrDigitalProducts(digitalProducts);
      setAllInitialProducts([...products, ...digitalProducts]);
    } else {
      handleOpenSnackbar("Error getting products.");
    }

    if (categories.success) {
      setCurrCategories(categories.value);
    }

    setSortByMethod("Newest");
    setIsLoading(false);
  };

  const handleChangeSort = (event) => {
    const { value } = event.target;
    setSortByMethod(value);
  };

  const handleOpenSnackbar = (message) => {
    setOpenSnackbar({
      snackbarOpen: true,
      snackbarMessage: message,
    });
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleSortSearchResults = (sortMethod) => {
    const currProducts = [...products];

    switch (sortMethod) {
      case "Newest":
        const sortedNewest = currProducts.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setCurrProducts(sortedNewest);

        break;

      case "Lowest Price":
        const sortedLowestPrice = currProducts.sort((a, b) => {
          return a.priceIntPenny - b.priceIntPenny;
        });
        setCurrProducts(sortedLowestPrice);
        break;

      case "Highest Price":
        const sortedHighestPrice = currProducts.sort((a, b) => {
          return b.priceIntPenny - a.priceIntPenny;
        });
        setCurrProducts(sortedHighestPrice);
        break;

      default:
        break;
    }
  };

  const handleSearchProduct = async (e) => {
    e.preventDefault();

    if (!searchInput) {
      handleOpenSnackbar("Please enter a search term.");
      return;
    }

    const api = `/api/public/inventory/product/${searchInput}?accountId=${accountId}`;

    const res = await fetch(api, { method: "GET" });
    const { products, error } = await res.json();

    if (error) {
      handleOpenSnackbar("Whoops, an error occured.");
      return;
    }

    if (products.length < 1) {
      handleOpenSnackbar("No products found for your search.");
      return;
    }

    setCurrProducts(
      products.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    );
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  if (!isChecklistComplete)
    return (
      <div className="flex flex-col justify-center items-center w-full mt-32">
        <h2>{businessName}</h2>
        <p>is coming soon ...</p>
      </div>
    );

  return (
    <div className="pb-8 lg:flex lg:h-[calc(100vh-54px)] lg:pb-0 lg:overflow-hidden ">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />
      <div className="flex-grow lg:overflow-y-auto">
        <ShopHeader
          isOwner={false}
          handleOpenSnackbar={handleOpenSnackbar}
          userAccount={siteData}
          handleOpenSignupModal={handleOpenSignupModal}
          handleCloseSignupModal={handleCloseSignupModal}
          isSignUpModalOpen={isSignUpModalOpen}
        />

        <div className="md:flex md:justify-between md:items-end lg:px-16 xl:px-28">
          <div className="md:w-1/2">
            <ShopBio
              isOwner={false}
              userAccount={siteData}
              handleOpenSnackbar={handleOpenSnackbar}
            />
          </div>
          <div className="mt-2 md:mt-12 md:w-1/2">
            <ShopFulfillment
              isOwner={false}
              userAccount={siteData}
              handleOpenSnackbar={handleOpenSnackbar}
            />
          </div>
        </div>
        <div className="px-4 lg:px-16 xl:px-28 ">
          <Divider light />
        </div>
        <div className="mt-2 lg:px-16 xl:px-28 ">
          <ShopSearchBar
            searchInput={searchInput}
            handleSearchInput={handleSearchInput}
            handleSearchProduct={handleSearchProduct}
            allInitialProducts={allInitialProducts}
            isOwner={false}
            allProducts={products}
            categories={currCategories}
            getProductsByCategory={getProductsByCategory}
            getAllProducts={getAllProducts}
            handleSortSearchResults={handleSortSearchResults}
            sortByMethod={sortByMethod}
            handleChangeSort={handleChangeSort}
          />
        </div>
        <div className="flex w-full lg:px-16 xl:px-28  xl:mt-4">
          <div className="hidden lg:block min-w-fit">
            <CategoryShopList
              allInitialProducts={allInitialProducts}
              isOwner={false}
              categories={currCategories}
              allProducts={products}
              getProductsByCategory={getProductsByCategory}
              getAllProducts={getAllProducts}
            />
          </div>
          {isLoading ? (
            <div className="flex w-full justify-center mt-28 h-screen lg:w-4/5 xl:w-10/12">
              <BoxLoader />
            </div>
          ) : (
            <div className="w-full flex-1 h-full pb-16">
              <ShopMenu
                isOwner={false}
                categories={categories}
                products={currProducts}
                digitalProducts={currDigitalProducts}
                currCategory={currCategory}
                userAccount={siteData}
              />
            </div>
          )}
        </div>
      </div>
      {/* <div className="hidden lg:block lg:w-[20rem] xl:w-[25rem] relative ">
        <CartComponent isDesktop={true} tax={tax} />
      </div> */}
    </div>
  );
}
export default Sites;

Sites.getLayout = function getLayout(page) {
  return <ShopLayout>{page}</ShopLayout>;
};

export async function getServerSideProps(context) {
  return isAuthUserShopping(context, async (userSession) => {
    const promises = [];
    const { site } = context.query;

    if (userSession) {
      const { user } = userSession;
      const { name, email, id } = user;

      const shopUser = prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          shopperAccount: true,
        },
      });

      promises.push(shopUser);
    }

    const siteData = prisma.account.findUnique({
      where: {
        subdomain: site,
      },
      include: {
        products: {
          include: {
            images: true,
            optionGroups: {
              include: {
                options: true,
              },
            },
            questions: true,
            relatedCategories: true,
          },
        },
        digitalProducts: {
          include: {
            relatedCategories: true,
          },
        },
        categories: {
          include: {
            products: true,
            digitalProducts: true,
          },
          orderBy: {
            categoryName: "asc",
          },
        },
        tax: true,
        fulfillmentMethods: true,
        acceptedPayments: true,
        deposit: true,
        socials: true,
        availability: {
          include: {
            datesAvailability: true,
            datesRangedAvailability: true,
            daysOfWeekAvailability: true,
          },
        },
      },
    });

    promises.push(siteData);

    try {
      let shopper;
      let site;
      let serializedShopper;
      let serializedData;

      if (userSession) {
        const [shopUser, siteData] = await Promise.all(promises);
        const { shopperAccount } = shopUser;

        if (shopperAccount) {
          serializedShopper = JSON.parse(JSON.stringify(shopperAccount));
          shopper = shopperAccount;
        }

        site = siteData;
      } else {
        const [siteData] = await Promise.all(promises);
        site = siteData;
      }

      if (!site) {
        return {
          redirect: {
            destination: "https://www.home.boxcart.shop",
            permanent: false,
          },
        };
      }

      serializedData = JSON.parse(JSON.stringify(site));

      return {
        props: {
          siteData: serializedData,
          shopper: serializedShopper ? serializedShopper : null,
        },
      };
    } catch (error) {
      console.log("error", error);
      return {
        redirect: {
          destination: "https://www.home.boxcart.shop",
          permanent: false,
        },
      };
    }
  });
}
