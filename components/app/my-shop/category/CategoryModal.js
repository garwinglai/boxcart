import React from "react";
import { Box } from "@mui/system";
import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Close } from "@mui/icons-material";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import CategoryIcon from "@mui/icons-material/Category";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  maxHeight: "80%",
  overflow: "scroll",
  bgcolor: "var(--white)",
  borderRadius: "4px",
  boxShadow: "var(--modal-shadow)",
  p: 2,
};

function CategoryModal({
  isViewProductsModalOpen,
  handleOpenViewProductModal,
  categoryProducts,
  categoryDigitalProducts,
  categoryName,
  handleEditCategoryClick,
  category,
}) {
  const handleEdit = (e) => {
    handleOpenViewProductModal();
    handleEditCategoryClick(category)(e);
  };

  return (
    <Modal
      open={isViewProductsModalOpen}
      onClose={handleOpenViewProductModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="">
          <div className="flex items-center justify-between gap-2 border-b pb-4">
            <div className="flex gap-2">
              <CategoryIcon fontSize="small" />
              <h4 className="font-light">Category:</h4>
            </div>
            <p className="font-medium">{categoryName}</p>
          </div>

          <h4 className="text-sm mt-4 underline">Added:</h4>
          {categoryProducts &&
          categoryProducts.length === 0 &&
          categoryDigitalProducts &&
          categoryDigitalProducts.length === 0 ? (
            <p className="font-extralight text-xs text-center my-8">
              No products
            </p>
          ) : (
            <div className="mb-4 mt-4">
              {categoryDigitalProducts &&
                categoryDigitalProducts.length > 0 && (
                  <div>
                    <h3 className="text-sm">Digital products</h3>
                    <ul className="px-8 pb-6">
                      {categoryDigitalProducts.map((product) => {
                        const { productName, id } = product;
                        return (
                          <li
                            key={id}
                            className="font-light text-sm list-disc break-words"
                          >
                            {productName}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              {categoryProducts && categoryProducts.length > 0 && (
                <div>
                  <h3 className="text-sm">Products</h3>
                  <ul className="px-8 pb-6">
                    {categoryProducts.map((product) => {
                      const { productName, id } = product;
                      return (
                        <li
                          key={id}
                          className="font-light text-sm list-disc break-words"
                        >
                          {productName}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <ButtonFilter
              name="Close"
              handleClick={handleOpenViewProductModal}
            />
            <ButtonSecondary name="Edit" handleClick={handleEdit} />
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default CategoryModal;
