import React, { useState, useEffect } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import AppLayout from "@/components/layouts/AppLayout";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import { useRouter } from "next/router";
import ProductCard from "@/components/app/my-shop/products/ProductCard";
import ProductDrawer from "@/components/app/my-shop/products/ProductDrawer";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import { isAuth } from "@/helper/client/auth/isAuth";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import Image from "next/image";
import boxes_icon from "@/public/images/icons/boxes_icon.png";
import prisma from "@/lib/prisma";
import { getProductsClient } from "@/helper/client/api/inventory/product-schema";

function Products({ userAccount }) {
  // Props
  const { products, categories, logoImgStr, id: accountId } = userAccount || {};

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [currProducts, setCurrProducts] = useState(products ? products : []);
  const [state, setState] = useState({
    right: false,
  });
  const [openSnackbarGlobal, setOpenSnackbarGlobal] = useState({
    snackbarOpenGlobal: false,
    snackbarMessageGlobal: "",
  });

  // DOB States
  const { snackbarOpenGlobal, snackbarMessageGlobal } = openSnackbarGlobal;
  const { isSnackbarOpen, snackbarMessage } = snackbar;

  // Instances to instantiate
  const { push, pathname } = useRouter();

  // Functions

  const getAllProducts = async (accountId) => {
    const { success, value } = await getProductsClient(accountId);

    if (success) {
      const { products } = value;
      console.log("products:", products);
      setCurrProducts(products);
      return;
    }

    return;
  };

  const handleOpenSnackbarGlobal = (message) => {
    setOpenSnackbarGlobal({
      snackbarOpenGlobal: true,
      snackbarMessageGlobal: message,
    });
  };

  const handleCloseSnackbarGlobal = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbarGlobal({
      snackbarOpenGlobal: false,
      snackbarMessageGlobal: "",
    });
  };

  const handleProductRoute = () => {
    if (pathname !== "/app/account/inventory/products")
      push("/account/inventory/products");

    return;
  };

  const handleCategoryRoute = () => {
    if (pathname !== "/app/account/inventory/categories")
      push("/account/inventory/categories");

    return;
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleOpenSnackbar = (message) => {
    setSnackbar({
      isSnackbarOpen: true,
      snackbarMessage: message,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      isSnackbarOpen: false,
      snackbarMessage: "",
    });
  };

  const filterDeletedProducts = (productId) => {
    setCurrProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center mt-[50%] gap-8 md:mt-[25%]">
        <BoxLoader />
        <p>One sec, getting your products ...</p>
      </div>
    );
  }

  // Displays
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbarGlobal}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="py-4 px-4 pb-24 ">
      <div className="pb-4 flex justify-between items-center">
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          // action={action}
        />
        <Snackbar
          open={snackbarOpenGlobal}
          autoHideDuration={6000}
          onClose={handleCloseSnackbarGlobal}
          message={snackbarMessageGlobal}
          action={action}
        />
        <div className="flex gap-2">
          <ButtonFilter handleClick={handleProductRoute} name="Products" />
          <ButtonFourth handleClick={handleCategoryRoute} name="Categories" />
        </div>
        <div>
          <ButtonPrimary
            name="+ Product"
            handleClick={toggleDrawer("right", true)}
          />
          <ProductDrawer
            state={state}
            toggleDrawer={toggleDrawer}
            categories={categories}
            isCreateProduct={true}
            accountId={accountId}
            handleOpenSnackbarGlobal={handleOpenSnackbarGlobal}
            getAllProducts={getAllProducts}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {currProducts.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-4 mt-16 lg:col-span-2 xl:col-span-3">
            <Image
              src={boxes_icon}
              alt="boxes icon"
              className="w-24 h-24 opacity-50"
            />
            <p className="text-center font-extralight">
              You have no products yet.
            </p>
          </div>
        ) : (
          currProducts.map((product) => {
            const { id, category, accountId } = product;
            return (
              <ProductCard
                key={id}
                product={product}
                userAccount={userAccount}
                accountId={accountId}
                categories={categories}
                handleOpenSnackbar={handleOpenSnackbar}
                filterDeletedProducts={filterDeletedProducts}
                updateProductList={updateProductList}
                handleOpenSnackbarGlobal={handleOpenSnackbarGlobal}
                getAllProducts={getAllProducts}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Products;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;
    let serializedAccount;

    try {
      const userAccount = await prisma.account.findUnique({
        where: {
          email,
        },
        include: {
          categories: true,
          products: {
            include: {
              optionGroups: {
                include: {
                  options: true,
                },
              },
              questions: true,
              relatedCategories: true,
              images: true,
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

Products.getLayout = function getLayout(
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
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </AppLayout>
  );
};

Products.pageTitle = "Products";
Products.pageIcon = <CategoryIcon />;
Products.pageRoute = "products";
Products.mobilePageRoute = "products";
