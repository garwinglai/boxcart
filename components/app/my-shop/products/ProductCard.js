import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IconButton, Rating } from "@mui/material";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import ProductModal from "./ProductModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";
import ProductDrawer from "./ProductDrawer";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import delete_folder_icon from "@/public/images/icons/delete_folder.png";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import {
  createProductClient,
  deleteProductClient,
} from "@/helper/client/api/inventory/product-schema";
import { nanoid } from "@/utils/generateId";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/fireConfig";

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

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 66,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function ProductCard({
  product,
  categories,
  accountId,
  handleOpenSnackbar,
  filterDeletedProducts,
  updateProductList,
  handleOpenSnackbarGlobal,
  getAllProducts,
  userAccount,
}) {
  //Props
  const {
    id,
    isEnabled,
    productName,
    rating,
    reviewCount,
    reviews,
    priceIntPenny,
    priceStr,
    salePriceStr,
    defaultImage,
    images,
    imgArrJson,
    description,
    quantity,
    setQuantityByProduct,
    hasUnlimitedQuantity,
    questions,
    optionGroups,
    relatedCategories,
  } = product;

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isItemEnabled, setIsItemEnabled] = useState(isEnabled);
  const [state, setState] = useState({
    right: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isExpanded = expandedCardId === id;

  useEffect(() => {
    if (!hasUnlimitedQuantity && setQuantityByProduct && quantity == 0) {
      setIsSoldOut(true);
    }

    if (!hasUnlimitedQuantity && !setQuantityByProduct) {
      let numOptionsLeft = 0;
      for (let i = 0; i < optionGroups.length; i++) {
        const currGroup = optionGroups[i];
        const { options } = currGroup;
        for (let j = 0; j < options.length; j++) {
          const currOption = options[j];
          const { quantity } = currOption;
          if (quantity > 0) {
            numOptionsLeft += quantity;
          }
        }
      }

      if (numOptionsLeft < 1) {
        setIsSoldOut(true);
      } else {
        setIsSoldOut(false);
      }
    }
  }, [product, quantity]);

  const handleClickListenerExpand = () => {
    setIsCardModalOpen((prev) => !prev);
  };

  const handleSwitchChange = (id) => async (e) => {
    setIsItemEnabled((prev) => !prev);
    const toggleVisiblityAPI =
      "/api/private/inventory/product/toggle-visibility";
    const body = {
      id,
      visibility: !isItemEnabled,
    };

    const res = await fetch(toggleVisiblityAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const { success, message } = await res.json();
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

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (e) => {
    const drawerToggling = toggleDrawer("right", true);
    handleClose();
    drawerToggling(e);
  };

  const handleOpenRemoveModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    handleClose();
  };

  const handleDeleteProduct = (productId, images) => async (e) => {
    setIsLoading(true);

    // Delete firestore product images
    const { subdomain } = userAccount;
    let deleteProductFromStorageSuccess = true;

    for (let i = 0; i < images.length; i++) {
      const currImage = images[i];
      const { imgFileName: fileName, fireStorageId } = currImage;

      if (!fireStorageId) continue;

      const { success } = await deleteProductImagesFromFirebase(
        fileName,
        subdomain,
        fireStorageId
      );

      if (!success) {
        deleteProductFromStorageSuccess = false;
      }
    }

    if (!deleteProductFromStorageSuccess) {
      handleCloseDeleteModal();
      handleOpenSnackbar("Could not delete product.");
      handleClose();
      setIsLoading(false);
      return;
    }

    const deleteProduct = await deleteProductClient(productId);
    const { success, value, error } = deleteProduct;

    if (!success) {
      // Resave images
      for (let i = 0; i < images.length; i++) {
        const currImage = images[i];
        const {
          imgFileName: fileName,
          image: imageFile,
          fireStorageId,
        } = currImage;

        const { success, error } = await saveProductImagesToFirebase(
          fileName,
          imageFile,
          subdomain,
          fireStorageId
        );

        if (!success) {
          // TODO: save errorLogs
          // console.log("error saving product image:", error);
        }
      }

      handleCloseDeleteModal();
      handleOpenSnackbar("Could not delete product.");
      handleClose();
      setIsLoading(false);
      return;
    }

    handleClose();
    handleCloseDeleteModal();
    filterDeletedProducts(productId);
    handleOpenSnackbar("Product deleted.");
    setIsLoading(false);
  };

  const saveProductImagesToFirebase = async (
    fileName,
    imageFile,
    subdomain,
    fireStorageId
  ) => {
    const photoRef = ref(
      storage,
      `account/${subdomain}/products/${fireStorageId}/productImages/${fileName}`
    );

    try {
      await uploadBytes(photoRef, imageFile);
      return { success: true };
    } catch (error) {
      console.log("error uploading product image:", error);
      return { success: false, error };
    }
  };

  const handleDuplicateProduct = async () => {
    handleClose();
    handleOpenSnackbar("Duplicating product...");

    const productSchema = structureProductSchema(product);
    const questionSchema = structureQuestionSchema(product);
    const structuredOptions = structureOptionGroupSchema(product);
    const { optionGroupSchema, optionSchema } = structuredOptions;

    let uploadProductImageError = false;
    const productImageUrls = [];
    const { images } = product;
    const { subdomain } = userAccount;
    const fireStorageId = nanoid();

    for (let i = 0; i < images.length; i++) {
      const currPhoto = images[i];
      const {
        imgFileName: fileName,
        image: imageFile,
        isDefault,
        fireStorageId: oldStorageId,
      } = currPhoto;

      const { success, error } = await copyImageFile(
        fileName,
        imageFile,
        subdomain,
        fireStorageId,
        oldStorageId
      );

      if (error) {
        uploadProductImageError = true;
      }

      const photoData = {
        imgFileName: fileName,
        isDefault,
        image: imageFile,
        fireStorageId,
      };

      productImageUrls.push(photoData);
    }

    if (uploadProductImageError) {
      handleOpenSnackbarGlobal("Error uploading images.");
      // TODO: remove the copied files
      return;
    }

    const productObject = {
      productSchema,
      optionGroupSchema,
      optionSchema,
      questionSchema,
    };

    productObject.imageSchema = productImageUrls;
    productObject.productSchema.defaultImage = productImageUrls[0].image;
    productObject.productSchema.defaultImageFileName =
      productImageUrls[0].imgFileName;
    productObject.productSchema.fireStorageId = fireStorageId;

    const resProductCreate = await createProductClient(productObject);
    const { success, value } = resProductCreate;
    const { createdProduct } = value;

    if (!success) {
      for (let i = 0; i < images.length; i++) {
        const currPhoto = images[i];
        const { imgFileName: fileName, fireStorageId } = currPhoto;

        await deleteProductImagesFromFirebase(
          fileName,
          subdomain,
          fireStorageId
        );
      }
      handleOpenSnackbar("Error duplicating product.");
      return;
    }

    handleOpenSnackbar("Duplicated.");
    getAllProducts(accountId);
  };

  const deleteProductImagesFromFirebase = async (
    fileName,
    subdomain,
    fireStorageId
  ) => {
    const photoRef = ref(
      storage,
      `account/${subdomain}/products/${fireStorageId}/productImages/${fileName}`
    );

    try {
      await deleteObject(photoRef);
      return { success: true };
    } catch (error) {
      console.log("error deleting images from firebase:", error);
      return { success: false };
    }
  };

  const copyImageFile = async (
    fileName,
    imageFile,
    subdomain,
    fireStorageId,
    oldStorageId
  ) => {
    const api = "/api/private/inventory/images/copy";
    const { success, message } = fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName,
        imageFile,
        subdomain,
        fireStorageId,
        oldStorageId,
      }),
    });

    return { success, message };
  };

  const structureProductSchema = (product) => {
    const {
      id,
      accountId,
      categoryId,
      isSampleProduct,
      productName,
      description,
      priceIntPenny,
      priceStr,
      quantity,
      hasUnlimitedQuantity,
      setQuantityByProduct,
      relatedCategories,
    } = product;

    const productSchema = {
      id,
      accountId,
      isSampleProduct: false,
      productName,
      description,
      priceIntPenny,
      priceStr,
      quantity,
      hasUnlimitedQuantity,
      setQuantityByProduct,
      relatedCategories,
    };

    return productSchema;
  };

  const structureQuestionSchema = (product) => {
    const { questions } = product;
    const questionSchema = questions.map((item) => {
      const { question, isRequired, productName } = item;

      const data = {
        question,
        isRequired,
        productName,
      };

      return data;
    });

    return questionSchema;
  };

  const structureOptionGroupSchema = (product) => {
    const { optionGroups } = product;
    let optionsArr = [];
    const optionGroupSchema = optionGroups.map((group) => {
      const {
        optionGroupName,
        productName,
        options,
        selectionType,
        selectionDisplay,
        isRequired,
        isRequiredDisplay,
      } = group;
      optionsArr.push(...options);
      const data = {
        optionGroupName,
        productName,
        selectionType,
        selectionDisplay,
        isRequired,
        isRequiredDisplay,
      };

      return data;
    });

    const optionSchema = optionsArr.map((option) => {
      const { optionName, priceIntPenny, priceStr, quantity, optionGroupName } =
        option;

      const data = {
        optionName,
        optionGroupName,
        priceStr,
        priceIntPenny,
        quantity,
      };

      return data;
    });

    return { optionGroupSchema, optionSchema };
  };

  return (
    <div
      className={`rounded-lg w-full shadow-md border bg-white md:row-auto ${
        isExpanded ? "md:grid-row-end-auto" : "md:h-fit"
      }`}
    >
      <div className="flex justify-between items-start border-b border-[color:var(--gray-light-med)]">
        {defaultImage ? (
          <div className="self-start min-w-[30%] relative sm:w-[20%] lg:w-[30%]">
            <div className="w-full h-full  relative aspect-square">
              <Image
                src={defaultImage}
                alt="default product image"
                fill
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-ss object-cover w-full h-full"
              />
            </div>
            <button className="bg-black bg-opacity-50 border border-white rounded text-white absolute bottom-1 right-1 px-2 py-1 text-xs font-extralight ">
              {images && images.length} Photos
            </button>
            {salePriceStr && salePriceStr !== "" && (
              <p className="bg-[color:var(--sale-bg)] text-[color:var(--sale-text)] absolute top-1 right-1 rounded-full text-xs px-4 py-1 mt-1">
                Sale
              </p>
            )}
          </div>
        ) : (
          <div className="self-start min-w-[30%] relative sm:w-[20%] lg:w-[30%]">
            <div className="w-full h-full relative aspect-square">
              <Image
                src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
                alt="default product image"
                fill
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-ss object-cover w-full h-full"
              />
            </div>
          </div>
        )}
        <div className="flex-grow flex flex-col p-2">
          <h2 className="text-sm font-medium sm:text-base md:text-lg ">
            {productName}
          </h2>
          <div className="flex items-center gap-1">
            <Rating
              name="read-only"
              value={parseInt(rating)}
              readOnly
              sx={{ fontSize: "0.75rem" }}
            />
            <p className="text-[color:var(--gray-text)] font-extralight text-xs md:text-sm">
              ({reviewCount})
            </p>
          </div>
          <p className="text-xs font-light md:text-sm">
            <b className="text-xs md:text-sm">Price: </b>
            {salePriceStr && salePriceStr !== "" ? (
              <span>
                <span>{salePriceStr}</span>
                <span className=" line-through text-xs font-extralight ml-2 text-gray-500">
                  {priceStr}
                </span>
              </span>
            ) : (
              <span>{priceStr}</span>
            )}
          </p>
          {setQuantityByProduct ? (
            <p className="text-xs font-light md:text-sm">
              <b className="text-xs md:text-sm">Qty: </b>
              {hasUnlimitedQuantity ? (
                "Unlimited"
              ) : isSoldOut ? (
                <span className="text-[color:var(--sale-text)] text-xs">
                  Sold out
                </span>
              ) : (
                quantity
              )}
            </p>
          ) : (
            !hasUnlimitedQuantity && (
              <p className="text-xs font-light md:text-sm">
                {isSoldOut ? "Out of stock" : ""}
              </p>
            )
          )}
        </div>
        <div className="mr-2">
          <IconButton onClick={handleOpenMenu}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <StyledMenu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={handleMenuClick} sx={{ fontSize: "12px" }}>
              Edit
            </MenuItem>
            <MenuItem onClick={handleOpenRemoveModal} sx={{ fontSize: "12px" }}>
              Delete
            </MenuItem>
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
                  <p>You&apos;re about to delete this product:</p>
                  <h2 className="mb-2">{productName}</h2>
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
                          handleClick={handleDeleteProduct(id, images)}
                          isLoading={isLoading}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Box>
            </Modal>

            <MenuItem
              onClick={handleDuplicateProduct}
              sx={{ fontSize: "12px" }}
            >
              Duplicate
            </MenuItem>
          </StyledMenu>
          <ProductDrawer
            state={state}
            toggleDrawer={toggleDrawer}
            product={product}
            categories={categories}
            isEditProduct={true}
            accountId={accountId}
            updateProductList={updateProductList}
            handleOpenSnackbarGlobal={handleOpenSnackbarGlobal}
            getAllProducts={getAllProducts}
          />
        </div>
      </div>
      <div className="flex justify-between items-center p-2">
        <span className="flex gap-4 items-center">
          <p
            className={`text-xs ${
              isItemEnabled
                ? "text-[color:var(--secondary-dark-med)] "
                : "text-[color:var(--gray-text)] "
            }`}
          >
            Enable
          </p>
          <IOSSwitch
            checked={isItemEnabled}
            onChange={handleSwitchChange(id)}
          />
        </span>

        <div className="">
          <IconButton
            onClick={handleClickListenerExpand}
            sx={{ marginRight: "8px" }}
          >
            <AspectRatioOutlinedIcon fontSize="small" />
          </IconButton>
          <ProductModal
            account={userAccount}
            toggleDrawer={toggleDrawer}
            isCardModalOpen={isCardModalOpen}
            handleClickListenerExpand={handleClickListenerExpand}
            handleOpenSnackbar={handleOpenSnackbar}
            product={product}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
