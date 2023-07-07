import React, { useState } from "react";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { IconButton } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Image from "next/image";
import category_icon from "@/public/images/icons/category_icon.png";
import SaveCancelButtons from "../../design/SaveCancelButtons";
import {
  createCategoryClient,
  updateCategoryClient,
} from "@/helper/client/api/inventory/category-schema";
import edit_category_icon from "@/public/images/icons/edit_category_icon.png";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "0.25rem",
};

function CategoryDrawerComponent({
  toggleDrawer,
  isCreateCategory,
  isEditCategory,
  editCategory,
  products,
  categories,
  accountId,
  addToCategoryList,
  updateCategoryList,

  handleOpenSnackbar,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [addedProducts, setAddedProducts] = useState(
    isEditCategory ? editCategory.products : []
  );
  const [removedProducts, setRemovedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    productName: "",
    productId: "",
  });
  const [categoryName, setCategoryName] = useState(
    isEditCategory ? editCategory.categoryName : ""
  );

  const handleCategoryNameChange = (e) => {
    const { value } = e.target;
    // Capitalize first letter of value
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setCategoryName(capitalizedValue);
  };

  const handleChangeSelectedProduct = (e) => {
    const { value } = e.target;

    if (value === "n/a") {
      setSelectedProduct("");
      return;
    }
    const productObject = JSON.parse(value);
    const { productName, id } = productObject;

    const newProductObject = { productName, productId: id };

    setSelectedProduct(newProductObject);
  };

  const handleAddProductsClick = (selectedProduct) => (e) => {
    const { productName, productId } = selectedProduct;

    if (!productId || productId === "") {
      setSelectedProduct("");
      return;
    }

    const productAlreadyAdded = addedProducts.find(
      (item) => item.productId === productId || item.id === productId
    );

    if (productAlreadyAdded) {
      setSelectedProduct("");
      return;
    }

    setAddedProducts((prev) => [...prev, selectedProduct]);
  };

  const deleteAddedProduct = (product) => (e) => {
    setAddedProducts((prev) => prev.filter((item) => item !== product));

    if (isEditCategory) {
      const { products } = editCategory;

      const removeItem = products.find(
        (item) => item.id === product.id || item.id === product.productId
      );
      setRemovedProducts((prev) => [...prev, removeItem]);
    }
  };

  const handleCancelCategoryCreate = (e) => {
    setCategoryName("");
    setAddedProducts([]);
    setSelectedProduct("");

    toggleDrawer("right", false)(e);

    // desktopCancelClick();
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let completeMessage = "";

    if (isCreateCategory) {
      const { value, message } = await saveNewCategory();

      if (message) {
        handleOpenSnackbar(message);
        setIsLoading(false);
        // setCategoryName("");
        return;
      }
      addToCategoryList(value);
      completeMessage = "Category created.";
    }

    if (isEditCategory) {
      const { id: categoryId } = editCategory;
      const { value, message } = await saveEditedCategory(categoryId);

      if (message) {
        handleOpenSnackbar(message);
        setIsLoading(false);
        return;
      }
      completeMessage = "Category updated.";
      updateCategoryList(categoryId, value);
    }

    setCategoryName("");
    setAddedProducts([]);
    // setSelectedProduct("");
    handleOpenSnackbar(completeMessage);
    setIsLoading(false);
    toggleDrawer("right", false)(e);
  };

  const saveNewCategory = async () => {
    const categoryObject = structureCategoryToSave();
    const res = await createCategoryClient(categoryObject);
    const { success, value } = res;

    let message = "Failed to create category.";

    // Prisma code for non-unique prisma error
    if (value == "P2002") {
      message = "Duplicate category.";
    }

    if (!success) return { message };

    return { value };
  };

  const structureCategoryToSave = () => {
    const categoryObject = {
      categoryName,
      products: addedProducts,
      accountId,
    };

    return categoryObject;
  };

  const saveEditedCategory = async (categoryId) => {
    const categoryObject = structureEditedCategory(categoryId);

    const res = await updateCategoryClient(categoryObject);
    const { success, value } = res;
    let message = "Failed to create category.";

    // Prisma code for non-unique prisma error
    if (value == "P2002") {
      message = "Duplicate category.";
    }

    if (!success) return { message };

    return { value };
  };

  const structureEditedCategory = (categoryId) => {
    const updateKeysAddedProducts = addedProducts.map((product) => {
      const { id } = product;
      if (id) product.productId = id;
      return product;
    });

    const categoryObject = {
      categoryName,
      products: updateKeysAddedProducts,
      accountId,
      categoryId,
      removedProducts,
    };

    return categoryObject;
  };

  return (
    <form
      onSubmit={handleSaveCategory}
      className="w-screen bg-[color:var(--gray-light)] min-h-screen p-4 flex flex-col gap-4 overflow-y-scroll pb-28 md:w-[60vw] lg:w-[45vw] xl:w-[35vw]"
    >
      <div className="flex justify-between items-center">
        {isCreateCategory ? (
          <span className="flex gap-4 items-center">
            <Image
              src={category_icon}
              alt="category icon"
              className="w-12 h-12"
            />
            <h3>Create Category:</h3>
          </span>
        ) : (
          <span className="flex gap-4 items-center">
            <Image
              src={edit_category_icon}
              alt="edit category icon"
              className="w-10 h-10"
            />
            <h3>Edit Category:</h3>
          </span>
        )}
        <button
          className="flex text-[color:var(--secondary)] "
          onClick={handleCancelCategoryCreate}
        >
          <ChevronLeftIcon />
          <p>close</p>
        </button>
      </div>
      <div className="rounded p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white relative">
        <span className="flex flex-col gap-2">
          <label
            htmlFor="categoryName"
            className="text-black font-semibold text-sm "
          >
            Category name:
          </label>
          <input
            type="text"
            required
            id="categoryName"
            name="categoryName"
            value={categoryName}
            onChange={handleCategoryNameChange}
            className={`transition-colors duration-300 border border-[color:var(--primary)] rounded w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)] indent-4 font-light text-xs`}
          />
        </span>
        <span className="flex flex-col gap-2 mt-4 relative">
          <label
            htmlFor="product"
            className="flex gap-2 text-black font-semibold text-sm"
          >
            Add products:
            <p className="font-light">(optional)</p>
          </label>
          <select
            name="product"
            id="product"
            onChange={handleChangeSelectedProduct}
            // value={selectedProduct}
            className={`transition-colors duration-300 border border-[color:var(--primary)] rounded w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-light-med)]  font-light text-xs overflow-hidden`}
          >
            {products && products.length !== 0 ? (
              <React.Fragment>
                <option value="n/a">n/a</option>
                {products.map((product) => (
                  <option key={product.id} value={JSON.stringify(product)}>
                    {product.productName}
                  </option>
                ))}
              </React.Fragment>
            ) : (
              <option value="">no products added ...</option>
            )}
          </select>
        </span>
        <div className="mt-4 w-fit ml-auto">
          <ButtonPrimary
            name="Add product"
            type="button"
            handleClick={handleAddProductsClick(selectedProduct)}
          />
        </div>
      </div>
      <div className="rounded p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white relative">
        <h4>Added Products:</h4>
        <ul className="pt-2">
          {addedProducts.length === 0 ? (
            <li className="font-light text-sm text-center py-2">
              No added products.
            </li>
          ) : (
            addedProducts.map((product, idx) => {
              const { productName, productId, id } = product;

              return (
                <div
                  key={productId ? productId : id ? id : idx}
                  className="flex justify-between items-center w-full mb-2"
                >
                  <li key={idx} className="text-sm font-light">
                    {productName}
                  </li>
                  <IconButton
                    onClick={deleteAddedProduct(product)}
                    sx={{ backgroundColor: "var(--gray-light)" }}
                  >
                    <DeleteOutlineOutlinedIcon
                      fontSize="small"
                      // sx={{ color: "var(--black)" }}
                    />
                  </IconButton>
                </div>
              );
            })
          )}
        </ul>
      </div>

      <div className="absolute left-0 bottom-0 w-full bg-white p-4 shadow-inner md:w-[60vw] lg:w-[45vw] xl:w-[35vw]">
        <SaveCancelButtons
          isLoading={isLoading}
          saveButtonType="submit"
          cancelButtonType="button"
          handleCancel={handleCancelCategoryCreate}
        />
      </div>
    </form>
  );
}

export default CategoryDrawerComponent;
