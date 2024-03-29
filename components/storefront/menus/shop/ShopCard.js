import React, { useState, useEffect } from "react";
import styles from "../../../../styles/components/storefront/menus/shop-card.module.css";
import Image from "next/image";
import Link from "next/link";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { IconButton, Rating } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProductDrawer from "@/components/app/my-shop/products/ProductDrawer";
import MenuItem from "@mui/material/MenuItem";
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
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { useAccountStore } from "@/lib/store";
import { storage } from "@/firebase/fireConfig";
import { nanoid } from "@/utils/generateId";
import Badge from "@mui/material/Badge";
import { useRouter } from "next/router";

function ShopCard({
  product,
  isOwner,
  categories,
  accountId,
  updateProductList,
  handleOpenSnackbar,
  getAllProducts,
  userAccount,
  setIsDuplicatingProduct,
  numProductInCart,
  getProductsByCategory,
  currCategoryId,
  currCategory,
  handleRemoveProductFromInitialProduct,
  handleAddProductToInitialProduct,
}) {
  const { account } = useAccountStore((state) => state.account);

  const {
    id,
    productName,
    priceStr,
    salePriceStr,
    defaultImage,
    images,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    quantity,
    optionGroups,
  } = product;

  const [state, setState] = useState({
    right: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const open = Boolean(anchorEl);

  const {
    query: { site },
  } = useRouter();

  useEffect(() => {
    if (product) {
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
        }
      }
    }
  }, []);

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

      handleClose();
      handleCloseDeleteModal();
      handleOpenSnackbar("Could not delete product.");
      setIsLoading(false);
      return;
    }

    handleClose();
    handleCloseDeleteModal();
    if (currCategory == "All Products") {
      getAllProducts();
    } else {
      getProductsByCategory(currCategoryId, currCategory);
      handleRemoveProductFromInitialProduct(productId);
    }
    handleOpenSnackbar("Product deleted.");
    setIsLoading(false);
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

    setIsDuplicatingProduct(true);
    handleOpenSnackbar("Duplicating, one second...");

    const productSchema = structureProductSchema(product);
    const questionSchema = structureQuestionSchema(product);
    const structuredOptions = structureOptionGroupSchema(product);
    const { optionGroupSchema, optionSchema } = structuredOptions;

    const { images } = product;
    const { subdomain } = userAccount;
    const fireStorageId = nanoid();

    const { productImageUrls, uploadProductImageError } = await copyImageFile(
      images,
      subdomain,
      fireStorageId
    );

    if (uploadProductImageError) {
      handleOpenSnackbar("Error uploading images.");
      // TODO: remove all the uploaded images before error at break.
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

    setIsDuplicatingProduct(false);
    handleOpenSnackbar("Duplicated.");
    if (currCategory == "All Products") {
      getAllProducts();
    } else {
      getProductsByCategory(currCategoryId, currCategory);
      handleAddProductToInitialProduct(createdProduct);
    }
  };

  const copyImageFile = async (images, subdomain, fireStorageId) => {
    const api = "/api/private/inventory/images/copy";
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
      const {
        imgFileName: fileName,
        image: imageFile,
        isDefault,
        fireStorageId: oldStorageId,
      } = currPhoto;

      const photoData = {
        imgFileName: fileName,
        isDefault,
        image: imageFile,
        fireStorageId,
      };

      productImageUrls.push(photoData);
    }

    return { productImageUrls, uploadProductImageError: false };
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
      salePriceStr,
      salePricePenny,
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
      salePriceStr,
      salePricePenny,
      quantity,
      hasUnlimitedQuantity,
      setQuantityByProduct,
      relatedCategories,
    };

    return productSchema;
  };

  const structureImageSchema = () => {
    // TODO: no image schema yet
    // TODO: Save to AWD
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
      const { optionGroupName, productName, options } = group;
      optionsArr.push(...options);
      const data = {
        optionGroupName,
        productName,
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
    <div className={`${styles.card_box} rounded`}>
      {isOwner ? (
        <div className="w-full">
          {defaultImage ? (
            <div className="relative w-full aspect-square">
              <Image
                priority={true}
                src={defaultImage}
                alt="default product image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                className="object-cover rounded-t"
              />
            </div>
          ) : (
            <div className="relative w-full aspect-square">
              <Image
                priority={true}
                src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
                alt="default product image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                className="object-cover rounded-t"
              />
            </div>
          )}
          <div className="flex flex-col pt-1 pl-2">
            <div className="">
              <h4 className="text-sm font-medium">{productName}</h4>
              <div className="flex items-center gap-2 mb-1">
                <Rating
                  name="read-only"
                  value={parseInt(product.rating)}
                  readOnly
                  sx={{ fontSize: "0.75rem" }}
                />
                <p className="text-[color:var(--gray-text)] font-extralight text-xs">
                  ({product.reviewCount})
                </p>
              </div>

              {isSoldOut ? (
                <p className="text-[color:var(--sale-text)] absolute top-1 right-2 rounded-full text-xs px-4 py-1 mt-1">
                  Sold out
                </p>
              ) : (
                salePriceStr &&
                salePriceStr !== "" && (
                  <p className="bg-[color:var(--sale-bg)] text-[color:var(--sale-text)] absolute top-1 right-2 rounded-full text-xs px-4 py-1 mt-1">
                    Sale
                  </p>
                )
              )}
            </div>
            <div className="flex justify-between items-center w-full">
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
              <div className="rounded-full hover:bg-[color:var(--primary-light-soft)] self-end">
                <React.Fragment>
                  <IconButton onClick={handleOpenMenu}>
                    <MoreVertIcon
                      fontSize="small"
                      // sx={{ color: "var(--brown-text)" }}
                    />
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
                    <MenuItem
                      onClick={handleMenuClick}
                      sx={{ fontSize: "12px" }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={handleOpenRemoveModal}
                      sx={{ fontSize: "12px" }}
                    >
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

                    {/* <MenuItem
                      onClick={handleDuplicateProduct}
                      sx={{ fontSize: "12px" }}
                    >
                      Duplicate
                    </MenuItem> */}
                  </StyledMenu>
                  <ProductDrawer
                    state={state}
                    toggleDrawer={toggleDrawer}
                    product={product}
                    categories={categories}
                    isEditProduct={true}
                    accountId={accountId}
                    userAccount={userAccount}
                    updateProductList={updateProductList}
                    handleOpenSnackbarGlobal={handleOpenSnackbar}
                    getAllProducts={getAllProducts}
                    getProductsByCategory={getProductsByCategory}
                    currCategory={currCategory}
                    currCategoryId={currCategoryId}
                  />
                </React.Fragment>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="">
          <Link href={`/${site}/product/${id}`} className="w-full">
            {defaultImage ? (
              <div className="relative w-full aspect-square">
                <Image
                  src={defaultImage}
                  alt="default product image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="object-cover rounded-t"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-square">
                <Image
                  priority={true}
                  src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
                  alt="default product image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="object-cover rounded-t"
                />
              </div>
            )}
            <div className="flex flex-col pt-1">
              <div className="">
                <h4 className="text-sm font-medium">{productName}</h4>
                <div className="flex items-center gap-2 mb-1">
                  <Rating
                    name="read-only"
                    value={parseInt(product.rating)}
                    readOnly
                    sx={{ fontSize: "0.75rem" }}
                  />
                  <p className="text-[color:var(--gray-text)] font-extralight text-xs">
                    ({product.reviewCount})
                  </p>
                </div>

                {isSoldOut ? (
                  <p className="text-[color:var(--sale-text)] absolute top-1 right-2 rounded-full text-xs px-4 py-1 mt-1">
                    Sold out
                  </p>
                ) : (
                  salePriceStr &&
                  salePriceStr !== "" && (
                    <p className="bg-[color:var(--sale-bg)] text-[color:var(--sale-text)] absolute top-1 right-2 rounded-full text-xs px-4 py-1 mt-1">
                      Sale
                    </p>
                  )
                )}
              </div>
              <div className="flex justify-between items-center w-full">
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
                <div className="rounded-full hover:bg-[color:var(--purple-bg)] self-end">
                  <div className="bg-[color:var(--white-design)] rounded-full">
                    <IconButton>
                      <StyledBadge
                        badgeContent={numProductInCart}
                        color="warning"
                        fontSize="small"
                      >
                        <AddShoppingCartIcon
                          sx={{ color: "var(--black-design-extralight)" }}
                          fontSize="small"
                        />
                      </StyledBadge>
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ShopCard;

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

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: -2,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
