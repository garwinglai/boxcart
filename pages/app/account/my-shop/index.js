import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useRouter } from "next/router";
import ShopHeader from "@/components/storefront/ShopHeader";
import ShopBio from "@/components/storefront/ShopBio";
import ShopFulfillment from "@/components/storefront/ShopFulfillment";
import { Divider } from "@mui/material";
import ShopSearchBar from "@/components/storefront/ShopSearchBar";
import ShopMenu from "@/components/storefront/menus/shop/ShopMenu";
import { isAuth } from "@/helper/client/auth/isAuth";
import CategoryShopList from "@/components/storefront/menus/shop/CategoryShopList";
import {
  getCategoriesClient,
  getProductsByCategoryIdClient,
} from "@/helper/client/api/inventory/category-schema";
import Snackbar from "@mui/material/Snackbar";
import { getProductsClient } from "@/helper/client/api/inventory/product-schema";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import prisma from "@/lib/prisma";

function MyShop({ userAccount }) {
  const {
    businessName,
    businessBio,
    city,
    socials,
    products,
    fulfillmentMethodInt,
    hasCustomAvailability,
    categories,
    id: accountId,
  } = userAccount || {};

  const businessData = {
    businessName,
    businessBio,
    city,
    socials,
  };

  const [currCategory, setCurrCategory] = useState("All Products");
  const [currCategories, setCurrCategories] = useState(
    categories ? categories : []
  );
  const [openSnackbar, setOpenSnackbar] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
  });
  const [currProducts, setCurrProducts] = useState(products ? products : []);
  const [isLoading, setIsLoading] = useState(false);

  const { snackbarMessage, snackbarOpen } = openSnackbar;

  const { push } = useRouter();

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

  const updateProductList = (updatedProduct) => {
    setCurrProducts((prev) =>
      prev.map((product) => {
        if (product.id === updatedProduct.id) {
          return updatedProduct;
        }
        return product;
      })
    );
  };

  const getProductsByCategory = async (categoryId, categoryName) => {
    setIsLoading(true);
    const category = await getProductsByCategoryIdClient(categoryId);
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
    const { success, value } = await getProductsClient(accountId);
    const categories = await getCategoriesClient(accountId);

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

  return (
    <div className="bg-white pb-20">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        // action={action}
      />
      <ShopHeader isOwner={true} />
      <div className="lg:flex lg:justify-between">
        <div className="lg:w-2/5">
          <ShopBio isOwner={true} businessData={businessData} />
        </div>
        <div className=" lg:mt-16 lg:w-2/5">
          <ShopFulfillment
            isOwner={true}
            fulfillmentMethodInt={fulfillmentMethodInt}
            hasCustomAvailability={hasCustomAvailability}
          />
        </div>
      </div>
      <div className="px-4 py-2">
        <Divider light />
      </div>
      <ShopSearchBar
        isOwner={true}
        categories={currCategories}
        getProductsByCategory={getProductsByCategory}
        getAllProducts={getAllProducts}
      />

      <div className="flex w-full xl:mt-4">
        <div className="hidden lg:block lg:w-1/5 xl:w-2/12">
          <CategoryShopList
            isOwner={true}
            categories={currCategories}
            allProducts={products}
            getProductsByCategory={getProductsByCategory}
            getAllProducts={getAllProducts}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center mt-28 h-screen lg:w-4/5 xl:w-10/12">
            <BoxLoader />
          </div>
        ) : (
          <div className="lg:w-4/5 xl:w-10/12 h-screen">
            <ShopMenu
              isOwner={true}
              products={currProducts}
              categories={currCategories}
              accountId={accountId}
              updateProductList={updateProductList}
              handleOpenSnackbar={handleOpenSnackbar}
              getAllProducts={getAllProducts}
              currCategory={currCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MyShop;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user } = userSession;
    const { name, email, id } = user;
    let serializedAccount;

    try {
      const userAccount = await prisma.account.findUnique({
        where: {
          email,
        },
        include: {
          socials: true,
          categories: {
            include: {
              products: true,
            },
          },
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
        },
      });

      serializedAccount = JSON.parse(JSON.stringify(userAccount));
    } catch (error) {
      console.log("serversideprops checklist error:", error);
      serializedAccount = null;
    }

    return {
      props: {
        userSession,
        userAccount: serializedAccount,
      },
    };
  });
}

MyShop.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <AppLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </AppLayout>
  );
};

MyShop.pageTitle = "My Shop";
MyShop.pageIcon = (
  <StorefrontIcon sx={{ color: "var(--black-design-extralight)" }} />
);
MyShop.pageRoute = "my-shop";
MyShop.mobilePageRoute = "my-shop";
