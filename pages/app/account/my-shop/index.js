import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { useRouter } from "next/router";
import ShopHeader from "@/components/storefront/ShopHeader";
import ShopBio from "@/components/storefront/ShopBio";
import ShopFulfillment from "@/components/storefront/ShopFulfillment";
import { Divider } from "@mui/material";
import ShopSearchBar from "@/components/storefront/ShopSearchBar";
import ShopMenu from "@/components/storefront/menus/shop/ShopMenu";
import { isAuth } from "@/helper/server/auth/isAuth";
import CategoryShopList from "@/components/storefront/menus/shop/CategoryShopList";
import {
  getCategoriesClient,
  getProductsByCategoryIdClient,
} from "@/helper/client/api/inventory/category-schema";
import Snackbar from "@mui/material/Snackbar";
import {
  getDigitalProductsClient,
  getProductsClient,
} from "@/helper/client/api/inventory/product-schema";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import prisma from "@/lib/prisma";
import { useChecklistStore } from "@/lib/store";
import shop_icon from "@/public/images/icons/account/shop_icon.png";
import Image from "next/image";

function MyShop({ userAccount }) {
  const checklistStore = useChecklistStore((state) => state.checklist);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  const {
    products,
    digitalProducts,
    categories,
    checklist,
    isChecklistComplete,
    isNonMandatoryChecklistComplete,
    id: accountId,
  } = userAccount ? userAccount : {};

  const [searchInput, setSearchInput] = useState("");
  const [isDuplicatingProduct, setIsDuplicatingProduct] = useState(false);
  const [currCategoryId, setCurrCategoryId] = useState("");
  const [currCategory, setCurrCategory] = useState("All Products");
  const [currCategories, setCurrCategories] = useState(
    categories ? categories : []
  );
  const [allInitialProducts, setAllInitialProducts] = useState(
    products ? products : []
  );
  const [allInitialDigitalProducts, setAllInitialDigitalProducts] = useState(
    digitalProducts ? digitalProducts : []
  );
  const [openSnackbar, setOpenSnackbar] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
  });
  const [currProducts, setCurrProducts] = useState(products ? products : []);
  const [currDigitalProducts, setCurrDigitalProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortByMethod, setSortByMethod] = useState("Newest");

  const { snackbarMessage, snackbarOpen } = openSnackbar;

  const { push } = useRouter();

  // UseEffects
  useEffect(() => {
    setChecklistStore(checklist);
    setChecklistStore({ isChecklistComplete });
    setChecklistStore({ isNonMandatoryChecklistComplete });
  }, [checklist, isChecklistComplete, isNonMandatoryChecklistComplete]);

  const handleChangeSort = (event) => {
    const { value } = event.target;
    setSortByMethod(value);
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
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

  const handleRemoveProductFromInitialProduct = (productId) => {
    setAllInitialProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const handleAddProductToInitialProduct = (product) => {
    setAllInitialProducts((prev) => [...prev, product]);
  };

  const handleRemoveDigitalProductFromInitialProduct = (productId) => {
    setAllInitialDigitalProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const handleAddDigitalProductToInitialProduct = (product) => {
    setAllInitialDigitalProducts((prev) => [...prev, product]);
  };

  const getProductsByCategory = async (categoryId, categoryName) => {
    setIsLoading(true);
    const category = await getProductsByCategoryIdClient(categoryId);
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
      setCurrCategoryId(categoryId);
    } else {
      handleOpenSnackbar("Error getting products.");
    }

    setSortByMethod("Newest");
    setIsLoading(false);
  };

  const getAllProducts = async () => {
    setIsLoading(true);
    const { success, value } = await getProductsClient(accountId);
    // const categories = await getCategoriesClient(accountId);

    if (success) {
      const { products, digitalProducts, categories } = value;
      setCurrProducts(products);
      setCurrCategory("All Products");
      setCurrDigitalProducts([]);
      // setCurrCategories(categories);
      // setCurrDigitalProducts(digitalProducts);
      // setAllInitialProducts(products);
    } else {
      handleOpenSnackbar("Error getting products.");
    }

    setSortByMethod("Newest");
    setIsLoading(false);
  };

  const getAllDigitalProducts = async () => {
    setIsLoading(true);
    const { success, value } = await getDigitalProductsClient(accountId);

    if (success) {
      const { digitalProducts, products } = value;
      setCurrDigitalProducts(digitalProducts);
      // setCurrProducts(digitalProducts);
      setCurrCategory("All Digital");
      setCurrProducts([]);
    } else {
      handleOpenSnackbar("Error getting digital products.");
    }

    // if (categories.success) {
    //   setCurrCategories(categories.value);
    // }

    setSortByMethod("Newest");
    setIsLoading(false);
  };

  const handleSortSearchResults = (sortMethod) => {
    const products = [...currProducts];
    const digitalProducts = [...currDigitalProducts];

    switch (sortMethod) {
      case "Newest":
        const sortedNewest = products.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        const sortedNewestDigital = digitalProducts.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setCurrDigitalProducts(sortedNewestDigital);
        setCurrProducts(sortedNewest);
        break;
      case "Lowest Price":
        const sortedLowestPrice = products.sort((a, b) => {
          return a.priceIntPenny - b.priceIntPenny;
        });
        const sortedLowestPriceDigital = digitalProducts.sort((a, b) => {
          return a.priceIntPenny - b.priceIntPenny;
        });

        setCurrDigitalProducts(sortedLowestPriceDigital);
        setCurrProducts(sortedLowestPrice);
        break;

      case "Highest Price":
        const sortedHighestPrice = products.sort((a, b) => {
          return b.priceIntPenny - a.priceIntPenny;
        });
        const sortedHighestPriceDigital = digitalProducts.sort((a, b) => {
          return b.priceIntPenny - a.priceIntPenny;
        });
        setCurrDigitalProducts(sortedHighestPriceDigital);
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

  return (
    <div className="bg-white mb-28 lg:mb-0">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={isDuplicatingProduct ? null : 3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        // action={action}
      />
      <ShopHeader
        isOwner={true}
        userAccount={userAccount}
        isSignUpModalOpen={false}
      />
      <div className="lg:flex lg:justify-between lg:items-end">
        <div className="lg:w-1/2">
          <ShopBio isOwner={true} userAccount={userAccount} />
        </div>
        <div className="mt-4 lg:mt-12 lg:w-1/2">
          <ShopFulfillment isOwner={true} userAccount={userAccount} />
        </div>
      </div>
      <div className="px-4 py-2">
        <Divider light />
      </div>
      <ShopSearchBar
        searchInput={searchInput}
        handleSearchInput={handleSearchInput}
        handleSearchProduct={handleSearchProduct}
        isOwner={true}
        allProducts={products}
        categories={currCategories}
        getProductsByCategory={getProductsByCategory}
        getAllProducts={getAllProducts}
        allInitialProducts={allInitialProducts}
        allInitialDigitalProducts={allInitialDigitalProducts}
        getAllDigitalProducts={getAllDigitalProducts}
        handleSortSearchResults={handleSortSearchResults}
        sortByMethod={sortByMethod}
        handleChangeSort={handleChangeSort}
        currCategory={currCategory}
      />

      <div className="flex w-full xl:mt-4">
        <div className="hidden lg:block lg:w-1/5 xl:w-2/12">
          <CategoryShopList
            allInitialProducts={allInitialProducts}
            getAllProducts={getAllProducts}
            allInitialDigitalProducts={allInitialDigitalProducts}
            getAllDigitalProducts={getAllDigitalProducts}
            categories={currCategories}
            getProductsByCategory={getProductsByCategory}
            currCategory={currCategory}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center w-full mt-28 h-screen lg:w-4/5 xl:w-10/12">
            <BoxLoader />
          </div>
        ) : (
          <div className="w-full lg:w-4/5 xl:w-10/12 lg:pb-16">
            <ShopMenu
              isOwner={true}
              products={currProducts}
              digitalProducts={currDigitalProducts}
              categories={currCategories}
              accountId={accountId}
              setIsDuplicatingProduct={setIsDuplicatingProduct}
              updateProductList={updateProductList}
              handleOpenSnackbar={handleOpenSnackbar}
              getAllProducts={getAllProducts}
              getAllDigitalProducts={getAllDigitalProducts}
              userAccount={userAccount}
              getProductsByCategory={getProductsByCategory}
              currCategory={currCategory}
              currCategoryId={currCategoryId}
              handleRemoveProductFromInitialProduct={
                handleRemoveProductFromInitialProduct
              }
              handleAddProductToInitialProduct={
                handleAddProductToInitialProduct
              }
              handleRemoveDigitalProductFromInitialProduct={
                handleRemoveDigitalProductFromInitialProduct
              }
              handleAddDigitalProductToInitialProduct={
                handleAddDigitalProductToInitialProduct
              }
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
          checklist: true,
          socials: true,
          categories: {
            include: {
              products: true,
              digitalProducts: true,
            },
            orderBy: {
              categoryName: "asc",
            },
          },
          digitalProducts: {
            include: {
              images: true,
              reviews: true,
              digitalFiles: true,
              relatedCategories: true,
            },
            orderBy: {
              productName: "asc",
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
            orderBy: {
              productName: "asc",
            },
          },
          availability: {
            include: {
              datesAvailability: true,
              datesRangedAvailability: true,
              daysOfWeekAvailability: true,
            },
          },
          fulfillmentMethods: true,
        },
      });

      if (!userAccount) {
        return {
          redirect: {
            destination:
              process.env.NODE_ENV && process.env.NODE_ENV === "production"
                ? "/app/auth/signin"
                : "http://localhost:3000/app/auth/signin",
            permanent: false,
          },
        };
      }
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
  <div className="relative w-8 h-8">
    <Image
      src={shop_icon}
      alt="store icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
MyShop.pageRoute = "my-shop";
MyShop.mobilePageRoute = "my-shop";
