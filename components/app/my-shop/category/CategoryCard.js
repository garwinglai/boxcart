import React, { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import CategoryDrawer from "./CategoryDrawer";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Image from "next/image";
import delete_folder_icon from "@/public/images/icons/delete_folder.png";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { deleteCategoryClient } from "@/helper/client/api/inventory/category-schema";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import CategoryModal from "./CategoryModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max-content",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

function CategoryCard({
  handleEditCategory,
  category,
  handleOpenSnackbar,
  filterDeletedCategories,
  accountId,
  products,
  updateCategoryList,
}) {
  // Props
  const { categoryName, products: categoryProducts, id } = category;
  const productsAddedLength = categoryProducts ? categoryProducts.length : 0;

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [isViewWholeCard, setIsViewWholeCard] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [state, setState] = useState({
    right: false,
  });
  const [isViewProductsModalOpen, setIsViewProductsModalOpen] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleViewCardClick = () => {
    setIsViewWholeCard((prev) => !prev);
  };

  const handleOpenRemoveModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCategory = (id) => async (e) => {
    setIsLoading(true);
    const categoryId = id;
    const deleteCategory = await deleteCategoryClient(categoryId);
    const { success, value } = deleteCategory;
    setIsLoading(false);

    if (!success) {
      setIsDeleteModalOpen(false);
      handleOpenSnackbar("Could not delete category.");
      return;
    }

    setIsDeleteModalOpen(false);
    filterDeletedCategories(categoryId);
    handleOpenSnackbar("Category deleted.");
  };

  const handleEditCategoryClick = (category) => (e) => {
    console.log("hello")
    toggleDrawer("right", true)(e);
    setEditCategory(category);
  };

  const handleOpenViewProductModal = () => {
    setIsViewProductsModalOpen((prev) => !prev);
  };

  return (
    <div className="p-4 rounded w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h4>{categoryName}</h4>
          {productsAddedLength === 0 ? (
            <p className="font-light text-sm">No products added</p>
          ) : (
            <p className="font-light text-sm">
              {productsAddedLength}{" "}
              {productsAddedLength === 1 ? "product" : "products"} added
            </p>
          )}
        </div>
        <button
          onClick={handleViewCardClick}
          className="flex items-center gap-1 active text-sm lg:hidden"
        >
          {isViewWholeCard ? (
            <KeyboardArrowUpOutlinedIcon fontSize="small" />
          ) : (
            <KeyboardArrowDownOutlinedIcon fontSize="small" />
          )}
          View Products
        </button>
        <div className="hidden lg:block">
          <button
            onClick={handleOpenViewProductModal}
            className="flex items-center gap-2 active text-sm"
          >
            <AspectRatioOutlinedIcon fontSize="small " />
            View Products
          </button>
          <CategoryModal
            isViewProductsModalOpen={isViewProductsModalOpen}
            handleOpenViewProductModal={handleOpenViewProductModal}
            categoryProducts={categoryProducts}
            categoryName={categoryName}
            handleEditCategoryClick={handleEditCategoryClick}
            category={category}
          />
        </div>
      </div>
      <div className="flex gap-4 justify-between mt-4 pt-2 border-t border-[color:var(--gray-light-med)]">
        <button
          onClick={handleOpenRemoveModal}
          className="flex items-center gap-1 text-sm text-red-400 "
        >
          <DeleteOutlineOutlinedIcon fontSize="small" />
          Remove
        </button>
        <Modal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="flex flex-col items-center gap-2">
              <Image
                src={delete_folder_icon}
                alt="delete folder icon"
                className="w-10 h-10"
              />
              <p>You&apos;re about to delete the category:</p>
              <h2 className="mb-2">"{categoryName}"</h2>
              <div className="flex  gap-4 items-center mt-2 w-full">
                <div className="w-1/2">
                  <ButtonSecondary
                    name="Cancel"
                    type="button"
                    handleClick={handleCloseDeleteModal}
                  />
                </div>
                {isLoading ? (
                  <div className="w-1/2 flex justify-center items-center">
                    <BoxLoader />
                  </div>
                ) : (
                  <div className="w-1/2">
                    <ButtonPrimary
                      name="Delete"
                      type="button"
                      handleClick={handleDeleteCategory(id)}
                    />
                  </div>
                )}
              </div>
            </div>
          </Box>
        </Modal>

        <div className="">
          <ButtonFilter
            name="Edit"
            handleClick={handleEditCategoryClick(category)}
          />
        </div>
        <CategoryDrawer
          state={state}
          toggleDrawer={toggleDrawer}
          isEditCategory={true}
          editCategory={editCategory}
          products={products}
          accountId={accountId}
          updateCategoryList={updateCategoryList}
          handleOpenSnackbar={handleOpenSnackbar}
        />
      </div>
      {isViewWholeCard && (
        <div className="border-t border-[color:var(--gray-light-med)] pt-4 mt-2">
          <h5 className="text-sm">Products added</h5>
          <ul className="px-8 pt-2">
            {categoryProducts && categoryProducts.length === 0 ? (
              <p className="font-extralight text-xs text-center">None</p>
            ) : (
              categoryProducts.map((product) => {
                const { productName, id } = product;
                return (
                  <li key={id} className="text-sm font-light list-disc">
                    {productName}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CategoryCard;
