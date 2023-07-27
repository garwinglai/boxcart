import React, { useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import AppLayout from "@/components/layouts/AppLayout";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import { useRouter } from "next/router";
import CategoryCard from "@/components/app/my-shop/category/CategoryCard";
import CategoryDrawer from "@/components/app/my-shop/category/CategoryDrawer";
import Image from "next/image";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import { isAuth } from "@/helper/client/auth/isAuth";
import prisma from "@/lib/prisma";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import Snackbar from "@mui/material/Snackbar";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import open_folder from "@/public/images/icons/open_folder.png";

function Categories({ userAccount }) {
  // Props
  const { products, categories, id: accountId } = userAccount;

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editCategory, setEditCategory] = useState({});
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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center mt-[50%] gap-8 md:mt-[25%]">
        <BoxLoader />
        <p>One sec, getting your categories ...</p>
      </div>
    );
  }

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

        <div className="flex gap-2">
          <ButtonFourth handleClick={handleProductRoute} name="Products" />
          <ButtonFilter handleClick={handleCategoryRoute} name="Categories" />
        </div>
        <div>
          <ButtonPrimary
            name="+ Category"
            handleClick={toggleDrawer("right", true)}
          />
          <CategoryDrawer
            isDesktopView={false}
            state={state}
            toggleDrawer={toggleDrawer}
            isCreateCategory={true}
            products={products}
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
              products: true,
            },
          },
          products: true,
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

Categories.pageTitle = "Category";
Categories.pageIcon = <CategoryIcon />;
Categories.pageRoute = "category";
Categories.mobilePageRoute = "category";
