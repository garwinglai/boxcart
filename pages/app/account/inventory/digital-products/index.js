import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import download_icon from "@/public/images/icons/account/download_icon.png";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { useRouter } from "next/router";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { Divider, IconButton } from "@mui/material";
import Image from "next/image";
import boxes_icon from "@/public/images/icons/boxes_icon.png";
import { getDigitalProductsClient } from "@/helper/client/api/inventory/product-schema";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DigitalProductDrawer from "@/components/app/my-shop/products/DigitalProductDrawer";
import DigitalProductCard from "@/components/app/my-shop/products/DigitalProductCard";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import { isAuth } from "@/helper/server/auth/isAuth";
import prisma from "@/lib/prisma";
import SdCardOutlinedIcon from "@mui/icons-material/SdCardOutlined";

function DigitalProduct({ userAccount }) {
  // Props
  const { digitalProducts, categories, id: accountId } = userAccount || {};

  // States
  const [isDuplicatingProduct, setIsDuplicatingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [currDigitalProducts, setCurrDigitalProducts] = useState(
    digitalProducts ? digitalProducts : []
  );
  const [digialProductDrawerOpen, setDigialProductDrawerOpen] = useState({
    right: false,
  });
  const [openSnackbarGlobal, setOpenSnackbarGlobal] = useState({
    snackbarOpenGlobal: false,
    snackbarMessageGlobal: "",
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isCreateProductMenuOpen = Boolean(anchorEl);
  const handleOpenProductCreate = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProductCreate = () => {
    setAnchorEl(null);
  };

  // DOB States
  const { snackbarOpenGlobal, snackbarMessageGlobal } = openSnackbarGlobal;
  const { isSnackbarOpen, snackbarMessage } = snackbar;

  // Instances to instantiate
  const { push, pathname } = useRouter();

  // Functions

  const getAllDigitalProducts = async (accountId) => {
    const { success, value } = await getDigitalProductsClient(accountId);

    if (success) {
      const { digitalProducts } = value;
      setCurrDigitalProducts(digitalProducts);
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

  const toggleDrawerDigitalProductCreate = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDigialProductDrawerOpen({ ...digialProductDrawerOpen, [anchor]: open });
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

  const filterDeletedDigitalProducts = (productId) => {
    setCurrDigitalProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const updateProductList = (updatedProduct) => {
    const { productType } = updatedProduct;

    if (productType === 1) {
      setCurrDigitalProducts((prev) =>
        prev.map((product) => {
          if (product.id === updatedProduct.id) {
            return updatedProduct;
          }
          return product;
        })
      );
    }
  };

  const handleCreateBatchProduct = (e) => {
    push("/app/account/inventory/batch-products");
    handleCloseProductCreate();
  };

  const handleImportShopifyProducts = (e) => {
    push("/app/account/inventory/digital-products/import-shopify");
    handleCloseProductCreate();
  };

  const handleImportEtsyProducts = (e) => {
    push("/app/account/inventory/digital-products/import-etsy");
    handleCloseProductCreate();
  };

  const handleCreateDigitalProduct = (e) => {
    toggleDrawerDigitalProductCreate("right", true)(e);
    handleCloseProductCreate();
  };

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
    <div className="px-4 pb-28 md:pb-16">
      <div className="pb-4 flex justify-between items-start">
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={isDuplicatingProduct ? null : 6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          action={action}
        />
        <Snackbar
          open={snackbarOpenGlobal}
          autoHideDuration={6000}
          onClose={handleCloseSnackbarGlobal}
          message={snackbarMessageGlobal}
          action={action}
        />

        <div className="flex flex-col gap-2 justify-end items-end ml-auto sm:flex-row">
          <div className="h-12 w-12 rounded-full shadow-lg  fixed bottom-20 right-4 z-10 md:h-10 md:w-fit md:bottom-10 md:right-8">
            <ButtonPrimary
              handleClick={handleOpenProductCreate}
              name={
                <div className="flex items-center gap-2">
                  <p className="text-lg md:text-sm">+</p>
                  <p className="hidden md:block md:text-sm">Create</p>
                </div>
              }
            />
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={isCreateProductMenuOpen}
            onClose={handleCloseProductCreate}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            {/* <MenuItem onClick={handleCreateProduct}>
              <div className="flex gap-2">
                <CategoryOutlinedIcon fontSize="small" />
                <p className="text-sm md:text-base">Product</p>
              </div>
            </MenuItem> */}
            {/* <MenuItem onClick={handleCreateBatchProduct}>
            + Batch product
          </MenuItem> */}
            <MenuItem onClick={handleCreateDigitalProduct}>
              <div className="flex gap-2">
                <SdCardOutlinedIcon fontSize="small" />
                <p className="text-sm md:text-base">Digital product</p>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleImportShopifyProducts}>
              <div className="flex gap-2">
                <LocalGroceryStoreOutlinedIcon fontSize="small" />
                <p className="text-sm md:text-base">Import Shopify</p>
              </div>
            </MenuItem>
            <MenuItem onClick={handleImportEtsyProducts}>
              <div className="flex gap-2">
                <StorefrontOutlinedIcon fontSize="small" />
                <p className="text-sm md:text-base">Import Etsy</p>
              </div>
            </MenuItem>
          </Menu>

          <DigitalProductDrawer
            state={digialProductDrawerOpen}
            toggleDrawer={toggleDrawerDigitalProductCreate}
            categories={categories}
            isCreateProduct={true}
            userAccount={userAccount}
            accountId={accountId}
            handleOpenSnackbarGlobal={handleOpenSnackbarGlobal}
            getAllDigitalProducts={getAllDigitalProducts}
          />
        </div>
      </div>

      {currDigitalProducts.length === 0 ? (
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
        <React.Fragment>
          {currDigitalProducts.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-col gap-4 min-[640px]:grid min-[640px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {currDigitalProducts.map((product) => {
                  const { id, category, accountId } = product;
                  return (
                    <DigitalProductCard
                      key={id}
                      product={product}
                      userAccount={userAccount}
                      accountId={accountId}
                      categories={categories}
                      setIsDuplicatingProduct={setIsDuplicatingProduct}
                      handleOpenSnackbar={handleOpenSnackbar}
                      filterDeletedProducts={filterDeletedDigitalProducts}
                      updateProductList={updateProductList}
                      handleOpenSnackbarGlobal={handleOpenSnackbarGlobal}
                      getAllDigitalProducts={getAllDigitalProducts}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default DigitalProduct;

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
          digitalProducts: {
            include: {
              digitalFiles: true,
              reviews: true,
              relatedCategories: true,
              images: true,
            },
            orderBy: {
              productName: "asc",
            },
          },
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

DigitalProduct.getLayout = function getLayout(
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

DigitalProduct.pageTitle = "Digital Product";
DigitalProduct.pageIcon = (
  <div className="relative w-8 h-8">
    <Image
      src={download_icon}
      alt="download icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
DigitalProduct.pageRoute = "digital-products";
DigitalProduct.mobilePageRoute = "digital-products";
