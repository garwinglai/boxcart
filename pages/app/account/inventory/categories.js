import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { useRouter } from "next/router";
import CategoryCard from "@/components/app/my-shop/category/CategoryCard";
import CategoryDrawer from "@/components/app/my-shop/category/CategoryDrawer";
import Image from "next/image";
import { isAuth } from "@/helper/server/auth/isAuth";
import prisma from "@/lib/prisma";
import Snackbar from "@mui/material/Snackbar";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import open_folder from "@/public/images/icons/open_folder.png";
import category_icon from "@/public/images/icons/account/category_icon_8.png";

function Categories({ userAccount }) {
  // Props
  const {
    products,
    digitalProducts,
    categories,
    id: accountId,
  } = userAccount || {};

  // States

  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [state, setState] = useState({
    right: false,
  });
  const [fetchedCategories, setFetchedCategories] = useState(
    categories ? categories : []
  );

  // DOB States
  const { isSnackbarOpen, snackbarMessage } = snackbar;

  // Instances to instantiate
  const { push, pathname, asPath } = useRouter();

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

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const filterDeletedCategories = (id) => {
    const filteredCategories = fetchedCategories.filter(
      (category) => category.id !== id
    );

    setFetchedCategories(filteredCategories);
  };

  const addToCategoryList = (category) => {
    const newCategoryList = [...fetchedCategories, category];
    setFetchedCategories(newCategoryList);
  };

  const updateCategoryList = (categoryId, category) => {
    const updatedCategoryList = fetchedCategories.map((fetchedCategory) => {
      if (fetchedCategory.id === category.id) {
        fetchedCategory.products = category.products;
        fetchedCategory.categoryName = category.categoryName;
        fetchedCategory.digitalProducts = category.digitalProducts;
      }
      return fetchedCategory;
    });

    setFetchedCategories(updatedCategoryList);
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

  // Display
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

  return (
    <div className="py-4 px-4 pb-24 ">
      <div className="pb-4 flex justify-between items-center">
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          action={action}
        />

        <div className="ml-auto">
          <div className="h-12 w-12 rounded-full shadow-lg  fixed bottom-20 right-4 z-10 md:h-10 md:w-fit md:bottom-10 md:right-8">
            <ButtonPrimary
              handleClick={toggleDrawer("right", true)}
              name={
                <div className="flex items-center gap-2">
                  <p className="text-lg md:text-sm">+</p>
                  <p className="hidden md:block md:text-sm">Create</p>
                </div>
              }
            />
          </div>

          <CategoryDrawer
            isDesktopView={false}
            state={state}
            toggleDrawer={toggleDrawer}
            isCreateCategory={true}
            products={products}
            digitalProducts={digitalProducts}
            categories={categories}
            accountId={accountId}
            addToCategoryList={addToCategoryList}
            handleOpenSnackbar={handleOpenSnackbar}
          />
        </div>
      </div>
      {fetchedCategories && fetchedCategories.length !== 0 ? (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3">
          {fetchedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              handleOpenSnackbar={handleOpenSnackbar}
              filterDeletedCategories={filterDeletedCategories}
              accountId={accountId}
              products={products}
              digitalProducts={digitalProducts}
              updateCategoryList={updateCategoryList}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center mt-32 lg:mt-6">
          <Image
            src={open_folder}
            alt="open folder icon"
            className="w-12 h-12 opacity-50"
          />
          <p className="font-light opacity-50">No categories ...</p>
        </div>
      )}
    </div>
  );
}

export default Categories;

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
          categories: {
            include: {
              products: {
                orderBy: {
                  productName: "asc",
                },
              },
              digitalProducts: {
                orderBy: {
                  productName: "asc",
                },
              },
            },
            orderBy: {
              categoryName: "asc",
            },
          },
          products: true,
          digitalProducts: true,
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

Categories.getLayout = function getLayout(
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

Categories.pageTitle = "Categories";
Categories.pageIcon = (
  <div className="relative w-8 h-8">
    <Image
      src={category_icon}
      alt="category icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Categories.pageRoute = "categories";
Categories.mobilePageRoute = "categories";
