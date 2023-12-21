import React, { useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import AppLayout from "@/components/layouts/AppLayout";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import { useRouter } from "next/router";
import ProductCard from "@/components/app/my-shop/products/ProductCard";
import ProductDrawer from "@/components/app/my-shop/products/ProductDrawer";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import { isAuth } from "@/helper/server/auth/isAuth";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import Image from "next/image";
import boxes_icon from "@/public/images/icons/boxes_icon.png";
import prisma from "@/lib/prisma";
import {
  getDigitalProductsClient,
  getProductsClient,
} from "@/helper/client/api/inventory/product-schema";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DigitalProductDrawer from "@/components/app/my-shop/products/DigitalProductDrawer";
import DigitalProductCard from "@/components/app/my-shop/products/DigitalProductCard";

function Products({ userAccount }) {
  // Props
  const {
    products,
    digitalProducts,
    categories,
    logoImgStr,
    id: accountId,
  } = userAccount || {};

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
  const [currProducts, setCurrProducts] = useState(products ? products : []);
  const [state, setState] = useState({
    right: false,
  });
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
  const getAllProducts = async (accountId) => {
    const { success, value } = await getProductsClient(accountId);

    if (success) {
      const { products } = value;
      setCurrProducts(products);
      return;
    }

    return;
  };

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

  const handleProductRoute = () => {
    if (pathname !== "/app/account/inventory/products")
      push("/app/account/inventory/products");

    return;
  };

  const handleCategoryRoute = () => {
    if (pathname !== "/app/account/inventory/categories")
      push("/app/account/inventory/categories");

    return;
  };

  const toggleDrawerProductCreate = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
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

  const filterDeletedProducts = (productId) => {
    setCurrProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const filterDeletedDigitalProducts = (productId) => {
    setCurrDigitalProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const updateProductList = (updatedProduct) => {
    const { productType } = updatedProduct;

    if (productType === 0) {
      setCurrProducts((prev) =>
        prev.map((product) => {
          if (product.id === updatedProduct.id) {
            return updatedProduct;
          }
          return product;
        })
      );
    }

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

  const handleCreateProduct = (e) => {
    toggleDrawerProductCreate("right", true)(e);
    handleCloseProductCreate();
  };

  const handleCreateBatchProduct = (e) => {
    push("/app/account/inventory/batch-products");
    handleCloseProductCreate();
  };

  const handleCreateDigitalProduct = (e) => {
    toggleDrawerDigitalProductCreate("right", true)(e);
    handleCloseProductCreate();
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
        <div className="flex gap-2">
          <ButtonFilter handleClick={handleProductRoute} name="Products" />
          <ButtonFourth handleClick={handleCategoryRoute} name="Categories" />
        </div>
        <div className="flex flex-col gap-2 justify-end items-end sm:flex-row">
          <ButtonPrimary
            handleClick={handleOpenProductCreate}
            name="+ Create"
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={isCreateProductMenuOpen}
            onClose={handleCloseProductCreate}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleCreateProduct}>Product</MenuItem>
            <MenuItem onClick={handleCreateBatchProduct}>
              Batch product
            </MenuItem>
            <MenuItem onClick={handleCreateDigitalProduct}>
              Digital product
            </MenuItem>
          </Menu>

          <ProductDrawer
            state={state}
            toggleDrawer={toggleDrawerProductCreate}
            categories={categories}
            isCreateProduct={true}
            accountId={accountId}
            handleOpenSnackbarGlobal={handleOpenSnackbarGlobal}
            getAllProducts={getAllProducts}
          />
          <DigitalProductDrawer
            state={digialProductDrawerOpen}
            toggleDrawer={toggleDrawerDigitalProductCreate}
            categories={categories}
            isCreateProduct={true}
            accountId={accountId}
            handleOpenSnackbarGlobal={handleOpenSnackbarGlobal}
            getAllDigitalProducts={getAllDigitalProducts}
          />
        </div>
      </div>

      {currDigitalProducts.length === 0 && currProducts.length === 0 ? (
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
          {currProducts.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-2">Products</h3>
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3">
                {currProducts.map((product) => {
                  const { id, category, accountId } = product;
                  return (
                    <ProductCard
                      key={id}
                      product={product}
                      userAccount={userAccount}
                      accountId={accountId}
                      categories={categories}
                      setIsDuplicatingProduct={setIsDuplicatingProduct}
                      handleOpenSnackbar={handleOpenSnackbar}
                      filterDeletedProducts={filterDeletedProducts}
                      updateProductList={updateProductList}
                      handleOpenSnackbarGlobal={handleOpenSnackbarGlobal}
                      getAllProducts={getAllProducts}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {currDigitalProducts.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-2">Digital products</h3>
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 mb-4">
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
          products: {
            include: {
              reviews: {
                orderBy: {
                  createdAt: "desc",
                },
              },
              optionGroups: {
                include: {
                  options: true,
                },
              },
              questions: true,
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
