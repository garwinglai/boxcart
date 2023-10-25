import React, { useState, useEffect } from "react";
import ShopMenu from "@/components/storefront/menus/shop/ShopMenu";
import ShopHeader from "@/components/storefront/ShopHeader";
import ShopLayout from "@/components/layouts/storefront/ShopLayout";
import ShopBio from "@/components/storefront/ShopBio";
import ShopFulfillment from "@/components/storefront/ShopFulfillment";
import Divider from "@mui/material/Divider";
import ShopSearchBar from "@/components/storefront/ShopSearchBar";
import CartComponent from "@/components/storefront/cart/CartComponent";
import CategoryShopList from "@/components/storefront/menus/shop/CategoryShopList";
import prisma from "@/lib/prisma";
import {
  getCategoriesClientPublic,
  getProductsByCategoryIdClientPublic,
} from "@/helper/client/api/inventory/category-schema";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import { getProductsClientPublic } from "@/helper/client/api/inventory/product-schema";
import Snackbar from "@mui/material/Snackbar";
import { useCartStore } from "@/lib/store";
import { getLocalStorage, setLocalStorage } from "@/utils/clientStorage";
import { useRouter } from "next/router";

function Sites({ siteData }) {
  const cart = useCartStore((state) => state.cart);
  const cartDetails = useCartStore((state) => state.cartDetails);
  const setCartDetails = useCartStore((state) => state.setCartDetails);

  const {
    acceptedPayments,
    businessName,
    businessBio,
    city,
    socials,
    products,
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

  const { push, pathname, query, asPath } = useRouter();

  useEffect(() => {
    const businessNameFromLocalStorage = getLocalStorage("businessName");
    if (
      !businessNameFromLocalStorage ||
      businessNameFromLocalStorage !== businessName
    ) {
      setLocalStorage("businessName", businessName);
    }
    setLocalStorage("accountId", accountId);
    setLocalStorage("acceptedPayments", JSON.stringify(acceptedPayments));

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

    if (fulfillmentType) {
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

  const [currCategory, setCurrCategory] = useState("All Products");
  const [currCategories, setCurrCategories] = useState(
    categories ? categories : []
  );
  const [currProducts, setCurrProducts] = useState(products ? products : []);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
  });

  const { snackbarMessage, snackbarOpen } = openSnackbar;

  const getProductsByCategory = async (categoryId, categoryName) => {
    setIsLoading(true);

    const category = await getProductsByCategoryIdClientPublic(categoryId);
    // fetch categories to get category list and product count in each category.

    const { success, value, error } = category;
    const { products } = value;

    if (success) {
      setCurrProducts(products);
      setCurrCategory(categoryName);
    } else {
      handleOpenSnackbar("Error getting products.");
    }

    setIsLoading(false);
  };

  const getAllProducts = async () => {
    setIsLoading(true);
    const { success, value } = await getProductsClientPublic(accountId);
    const categories = await getCategoriesClientPublic(accountId);

    if (success) {
      const { products } = value;
      setCurrProducts(products);
      setCurrCategory("All Products");
    } else {
      handleOpenSnackbar("Error getting products.");
    }

    if (categories.success) {
      setCurrCategories(categories.value);
    }

    setIsLoading(false);
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
        // action={action}
      />
      <div className="flex-grow lg:overflow-y-auto ">
        <ShopHeader
          isOwner={false}
          handleOpenSnackbar={handleOpenSnackbar}
          userAccount={siteData}
        />

        <div className="md:flex md:justify-between">
          <div className="md:w-3/5 lg:w-2/5">
            <ShopBio isOwner={false} userAccount={siteData} />
          </div>
          <div className=" md:mt-16 md:w-1/2">
            <ShopFulfillment
              isOwner={false}
              userAccount={siteData}
              handleOpenSnackbar={handleOpenSnackbar}
            />
          </div>
        </div>
        <div className="px-4">
          <Divider light />
        </div>
        <ShopSearchBar
          isOwner={false}
          allProducts={products}
          categories={currCategories}
          getProductsByCategory={getProductsByCategory}
          getAllProducts={getAllProducts}
          handleSortSearchResults={handleSortSearchResults}
        />
        <div className="flex w-full xl:mt-4">
          <div className="hidden lg:block lg:w-1/5 xl:w-2/12">
            <CategoryShopList
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
            <div className="w-full lg:w-4/5 xl:w-10/12 h-full pb-16">
              <ShopMenu
                isOwner={false}
                categories={categories}
                products={currProducts}
                currCategory={currCategory}
                userAccount={siteData}
              />
            </div>
          )}
        </div>
      </div>
      <div className="hidden lg:block lg:w-[20rem] xl:w-[25rem] relative ">
        <CartComponent isDesktop={true} tax={tax} />
      </div>
    </div>
  );
}
export default Sites;

Sites.getLayout = function getLayout(page) {
  return <ShopLayout>{page}</ShopLayout>;
};

export async function getServerSideProps(context) {
  const { site } = context.query;

  const siteData = await prisma.account.findUnique({
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
      categories: {
        include: {
          products: true,
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

  if (!siteData) {
    return {
      redirect: {
        destination: "https://www.boxcart.site",
        permanent: false,
      },
    };
  }

  const serializedData = JSON.parse(JSON.stringify(siteData));

  return {
    props: {
      siteData: serializedData,
    },
  };
}
