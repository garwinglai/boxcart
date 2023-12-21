import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import SaveCancelButtons from "../../design/SaveCancelButtons";
import CategoryDrawerComponent from "./CategoryDrawerComponent";

function CategoryDrawer({
  state,
  toggleDrawer,
  isCreateCategory,
  products,
  digitalProducts,
  categories,
  accountId,
  addToCategoryList,
  handleOpenSnackbar,
  editCategory,
  isEditCategory,
  updateCategoryList,
}) {
  return (
    <Drawer
      anchor={"right"}
      open={state["right"]}
      onClose={toggleDrawer("right", false)}
    >
      <CategoryDrawerComponent
        toggleDrawer={toggleDrawer}
        isCreateCategory={isCreateCategory}
        isEditCategory={isEditCategory}
        editCategory={editCategory}
        products={products}
        digitalProducts={digitalProducts}
        categories={categories}
        accountId={accountId}
        addToCategoryList={addToCategoryList}
        handleOpenSnackbar={handleOpenSnackbar}
        updateCategoryList={updateCategoryList}
      />
    </Drawer>
  );
}

export default CategoryDrawer;
