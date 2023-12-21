import React, { useState } from "react";
import Image from "next/image";
import { IconButton, Rating } from "@mui/material";
import pdf_download_icon from "@/public/images/icons/pdf_download_icon.png";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import delete_folder_icon from "@/public/images/icons/delete_folder.png";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import {
  createDigitalProductClient,
  deleteDigitalProductClient,
} from "@/helper/client/api/inventory/product-schema";
import { nanoid } from "@/utils/generateId";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/fireConfig";
import DigitalProductDrawer from "./DigitalProductDrawer";
import DigitalProductModal from "./DigitalProductModal";

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

function DigitalProductCard({
  product,
  categories,
  accountId,
  handleOpenSnackbar,
  filterDeletedProducts,
  updateProductList,
  handleOpenSnackbarGlobal,
  setIsDuplicatingProduct,
  getAllProducts,
  userAccount,
  getAllDigitalProducts,
}) {
  //Props
  const {
    id,
    digitalProductId,
    isEnabled,
    productName,
    rating,
    reviewCount,
    priceStr,
    salePriceStr,
    digitalFiles,
    defaultImage,
    images,
  } = product;

  // States
  const [isLoading, setIsLoading] = useState(false);
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

  const handleClickListenerExpand = () => {
    setIsCardModalOpen((prev) => !prev);
  };

  const handleSwitchChange = (id) => async (e) => {
    setIsItemEnabled((prev) => !prev);
    const toggleVisiblityAPI =
      "/api/private/inventory/digital-product/toggle-visibility";
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

  const handleDeleteProduct =
    (productId, digitalFiles, images) => async (e) => {
      setIsLoading(true);

      // Delete firestore product images
      const { subdomain } = userAccount;

      const promise = [];
      const promiseArr = deleteFilesFromFirebase(digitalFiles, subdomain);
      const deleteImagePromise = deleteCoverImageFromFirebase(
        images,
        subdomain
      );

      promise.push(promiseArr);
      promise.push(deleteImagePromise);

      try {
        const res = await Promise.all(promise);
      } catch (error) {
        console.log("error deleting product image:", error);

        handleCloseDeleteModal();
        handleOpenSnackbarGlobal("Could not delete product.");
        handleClose();
        setIsLoading(false);
        return;
      }

      const deleteProduct = await deleteDigitalProductClient(productId);
      const { success, value, error } = deleteProduct;

      if (!success) {
        // resave cover image
        const resImageSave = await savePhotoToFirebase(images, subdomain);

        if (!resImageSave.success) {
          // TODO: save errorLogs
        }

        // Resave file
        for (let i = 0; i < digitalFiles.length; i++) {
          const currFile = digitalFiles[i];
          const { name: fileName, digitalFile, fireStorageId } = currFile;

          const { success, error } = await saveFilesToFirebase(
            fileName,
            digitalFile,
            subdomain,
            fireStorageId
          );

          if (!success) {
            // TODO: save errorLogs
            // console.log("error saving product image:", error);
          }
        }

        handleCloseDeleteModal();
        handleOpenSnackbarGlobal("Could not delete product.");
        handleClose();
        setIsLoading(false);
        return;
      }

      handleClose();
      handleCloseDeleteModal();
      filterDeletedProducts(productId);
      handleOpenSnackbarGlobal("Product deleted.");
      setIsLoading(false);
    };

  const savePhotoToFirebase = async (images, subdomain) => {
    const imageData = images[0];
    const { imgFileName: fileName, imageFile, fireStorageId } = imageData;

    const photoRef = ref(
      storage,
      `account/${subdomain}/products/${fireStorageId}/productImages/${fileName}`
    );

    try {
      await uploadBytes(photoRef, imageFile);
    } catch (error) {
      console.log("error uploading product image:", error);
      return { success: false, error };
    }

    try {
      const photoUrl = await getDownloadURL(photoRef);

      const photoData = {
        imgFileName: fileName,
        image: photoUrl,
        fireStorageId,
      };

      return { success: true, photoUrl, photoData };
    } catch (error) {
      console.log("photo Url error", error);

      return { success: false, error };
    }
  };

  const saveFilesToFirebase = async (
    fileName,
    digitalFile,
    subdomain,
    fireStorageId
  ) => {
    const photoRef = ref(
      storage,
      `account/${subdomain}/products/${fireStorageId}/files/${fileName}`
    );

    try {
      await uploadBytes(photoRef, digitalFile);
      return { success: true };
    } catch (error) {
      console.log("error uploading product image:", error);
      return { success: false, error };
    }
  };

  const handleDuplicateProduct = async () => {
    handleClose();
    setIsDuplicatingProduct(true);
    handleOpenSnackbar("Duplicating, one second...");

    const productSchema = structureProductSchema(product);

    // const productImageUrls = [];
    const { digitalFiles, images } = product;
    const { subdomain } = userAccount;
    const fireStorageId = nanoid();

    const { fileUrls, uploadFileError } = await copyFirebaseFile(
      digitalFiles,
      subdomain,
      fireStorageId
    );

    // TODO: better error handling - can batch this.
    if (uploadFileError) {
      handleOpenSnackbarGlobal("Error uploading files.");
      // TODO: remove the copied files
      return;
    }

    const { productImageUrls, uploadProductImageError } = await copyImageFile(
      images,
      subdomain,
      fireStorageId
    );

    if (uploadProductImageError) {
      handleOpenSnackbarGlobal("Error uploading images.");
      // TODO: remove the copied files
      return;
    }

    const productObject = {
      productSchema,
    };

    productObject.imageSchema = productImageUrls[0];
    productObject.fileSchema = fileUrls;
    productObject.productSchema.fireStorageId = fireStorageId;
    productObject.productSchema.defaultImage = defaultImage;

    const resProductCreate = await createDigitalProductClient(productObject);
    const { success, value } = resProductCreate;
    const { createdProduct } = value;

    if (!success) {
      const promise = [];
      const promiseArr = deleteFilesFromFirebase(digitalFiles, subdomain);
      const deleteImagePromise = deleteCoverImageFromFirebase(
        images,
        subdomain
      );

      promise.push(promiseArr);
      promise.push(deleteImagePromise);
      // TODO: file did not delete

      try {
        const res = await Promise.all(promise);
      } catch (error) {
        console.log("error deleting product image:", error);
        handleOpenSnackbar("Error duplicating product.");
        setIsDuplicatingProduct(false);
        return;
      }
    }
    setIsDuplicatingProduct(false);
    handleOpenSnackbar("Duplicated.");
    getAllDigitalProducts(accountId);
  };

  const deleteCoverImageFromFirebase = async (images, subdomain) => {
    const image = images[0];
    const { imgFileName: fileName, fireStorageId } = image;

    const photoRef = ref(
      storage,
      `account/${subdomain}/digital-products/${fireStorageId}/productImages/${fileName}`
    );
    return deleteObject(photoRef);
  };

  const deleteFilesFromFirebase = async (digitalFiles, subdomain) => {
    const deletePromise = [];

    for (let i = 0; i < digitalFiles.length; i++) {
      const currFile = digitalFiles[i];
      const { name: fileName, fireStorageId } = currFile;

      if (!fireStorageId) continue;

      const fileRef = ref(
        storage,
        `account/${subdomain}/digital-products/${fireStorageId}/files/${fileName}`
      );

      const deletedFile = deleteObject(fileRef);
      deletePromise.push(deletedFile);
    }

    return deletePromise;
  };

  const copyImageFile = async (images, subdomain, fireStorageId) => {
    const api = "/api/private/inventory/digital-product/images/copy";
    console.log("image", images);
    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images,
        subdomain,
        fireStorageId,
      }),
    });
    const { success } = await res.json();

    if (!success)
      return { productImageUrls: null, uploadProductImageError: true };

    const productImageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const currPhoto = images[i];

      const photoData = {
        imgFileName: currPhoto.imgFileName,
        image: currPhoto.image,
        fireStorageId,
      };

      productImageUrls.push(photoData);
    }

    return { productImageUrls, uploadProductImageError: false };
  };

  const copyFirebaseFile = async (digitalFiles, subdomain, fireStorageId) => {
    const api = "/api/private/inventory/digital-product/files/copy";

    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        digitalFiles,
        subdomain,
        fireStorageId,
      }),
    });
    const { success } = await res.json();

    if (!success) return { fileUrls: null, uploadFileError: true };

    const fileUrls = [];

    for (let i = 0; i < digitalFiles.length; i++) {
      const currFile = digitalFiles[i];
      const { name, uploadedFile, fireStorageId: oldStorageId } = currFile;

      const fileData = {
        name,
        uploadedFile,
        fireStorageId,
      };

      fileUrls.push(fileData);
    }

    return { fileUrls, uploadFileError: false };
  };

  const structureProductSchema = (product) => {
    const {
      id,
      accountId,
      productName,
      description,
      priceIntPenny,
      salePricePenny,
      salePriceStr,
      priceStr,
      relatedCategories,
      images,
      defaultImage,
    } = product;

    const productSchema = {
      id,
      accountId,
      productName,
      description,
      priceIntPenny,
      priceStr,
      relatedCategories,
      salePricePenny,
      salePriceStr,
      images,
      defaultImage,
    };

    return productSchema;
  };

  return (
    <div
      className={`rounded-lg w-full shadow-md border bg-white md:row-auto ${
        isExpanded ? "md:grid-row-end-auto" : "md:h-fit"
      }`}
    >
      <div className="flex justify-between items-start border-b border-[color:var(--gray-light-med)]">
        <div className="self-start min-w-[30%] relative sm:w-[20%] lg:w-[30%]">
          <div className="w-full h-full relative aspect-square">
            <Image
              src={defaultImage}
              alt="pdf cover image"
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-ss object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="flex-grow flex flex-col py-2 pl-2">
          <div className="flex item-center justify-between gap-2">
            <h2 className="text-sm font-medium sm:text-base md:text-lg ">
              {productName}
            </h2>
          </div>
          <p className="text-xs font-light min-w-fit">
            id: {digitalProductId ? digitalProductId : id}
          </p>
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
                          handleClick={handleDeleteProduct(
                            id,
                            digitalFiles,
                            images
                          )}
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
          <DigitalProductDrawer
            state={state}
            toggleDrawer={toggleDrawer}
            product={product}
            categories={categories}
            isEditProduct={true}
            accountId={accountId}
            updateProductList={updateProductList}
            handleOpenSnackbarGlobal={handleOpenSnackbarGlobal}
            getAllDigitalProducts={getAllDigitalProducts}
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
          <DigitalProductModal
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

export default DigitalProductCard;
