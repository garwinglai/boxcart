import React, { useState } from "react";
import styles from "../../../../styles/components/storefront/menus/shop-card.module.css";
import Image from "next/image";
import Link from "next/link";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProductDrawer from "@/components/app/my-shop/products/ProductDrawer";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
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

function ShopCard({
  subdomain,
  product,
  isOwner,
  categories,
  accountId,
  updateProductList,
  handleOpenSnackbar,
  getAllProducts,
}) {
  const {
    id,
    isSampleProduct,
    isEnabled,
    productName,
    description,
    priceIntPenny,
    priceStr,
    defaultImgStr,
    images,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    quantity,
    optionGroups,
    questions,
    relatedCategories,
  } = product;

  const [state, setState] = useState({
    right: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  function handleClickProduct(e) {}

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
  };

  const handleDeleteProduct = (productId) => async (e) => {
    setIsLoading(true);

    const deleteProduct = await deleteProductClient(productId);
    const { success, value, error } = deleteProduct;
    setIsLoading(false);
    handleClose();

    if (!success) {
      handleCloseDeleteModal();
      handleOpenSnackbar("Could not delete product.");
      return;
    }

    handleCloseDeleteModal();
    getAllProducts(accountId);
    handleOpenSnackbar("Product deleted.");
  };

  const handleDuplicateProduct = async () => {
    handleClose();
    handleOpenSnackbar("Duplicating product...");

    const productSchema = structureProductSchema(product);
    const imageSchema = structureImageSchema();
    const questionSchema = structureQuestionSchema(product);
    const structuredOptions = structureOptionGroupSchema(product);

    const { optionGroupSchema, optionSchema } = structuredOptions;

    const productObject = {
      productSchema,
      imageSchema,
      optionGroupSchema,
      optionSchema,
      questionSchema,
    };

    const resProductCreate = await createProductClient(productObject);
    const { success, value } = resProductCreate;
    const { createdProduct } = value;

    if (!success) {
      handleOpenSnackbar("Error duplicating product.");
      return;
    }

    handleOpenSnackbar("Duplicated.");
    getAllProducts(accountId);
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
      const {
        optionName,
        priceIntPenny,
        priceStr,
        quantityInt,
        quantityStr,
        optionGroupName,
      } = option;

      const data = {
        optionName,
        optionGroupName,
        priceStr,
        priceIntPenny,
        quantityInt,
        quantityStr,
      };

      return data;
    });

    return { optionGroupSchema, optionSchema };
  };

  return (
    <div className={`${styles.card_box}`}>
      {isOwner ? (
        <div className={`${styles.card_button_box_link} ${styles.flexCol}  `}>
          <div className="">
            <Image
              src={candle_2}
              alt="default product image"
              className="object-cover aspect-square w-full"
            />
            {/* <Image
            src={imgDefaultStr}
            alt={imgDefaultAlt}
            className="block w-full h-[calc(50vw-28px)] object-cover md:h-[calc(33vw-28px)] lg:h-[calc(22vw-28px)] xl:h-[calc(14vw-28px)]"
          /> */}
          </div>
          <div className="flex items-start justify-between h-full pt-1 pr-1">
            <div className="flex flex-col">
              <h4>{productName}</h4>

              <p className={`${styles.price}`}>{priceStr}</p>
              {quantity == 0 && (
                <p className={`${styles.sold_out_text}`}>Sold out</p>
              )}
            </div>
            <div className="rounded-full bg-[color:var(--brown-bg)] self-end">
              <React.Fragment>
                <IconButton onClick={handleOpenMenu}>
                  <MoreVertIcon
                    fontSize="small"
                    sx={{ color: "var(--brown-text)" }}
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
                  <MenuItem onClick={handleMenuClick} sx={{ fontSize: "12px" }}>
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
                                handleClick={handleDeleteProduct(id)}
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
                  handleOpenSnackbarGlobal={handleOpenSnackbar}
                  getAllProducts={getAllProducts}
                />
              </React.Fragment>
            </div>
          </div>
        </div>
      ) : (
        <Link
          href={`/product/${id}`}
          className={`${styles.card_button_box_link} ${styles.flexCol}  `}
        >
          <div className="">
            <Image
              src={candle_2}
              alt="default product image"
              className="object-cover aspect-square w-full"
            />
            {/* <Image
            src={imgDefaultStr}
            alt={imgDefaultAlt}
            className="block w-full h-[calc(50vw-28px)] object-cover md:h-[calc(33vw-28px)] lg:h-[calc(22vw-28px)] xl:h-[calc(14vw-28px)]"
          /> */}
          </div>
          <div className={`${styles.card_context_box} ${styles.flexCol}`}>
            <h4>{productName}</h4>

            <p className={`${styles.price}`}>{priceStr}</p>
            {quantity == 0 && (
              <p className={`${styles.sold_out_text}`}>Sold out</p>
            )}
          </div>
        </Link>
      )}
      <div className={`${styles.add_to_cart_btn}`}>
        {!isOwner && (
          <IconButton>
            <AddShoppingCartIcon
              fontSize="small"
              sx={{ color: "var(--brown-text)" }}
            />
          </IconButton>
        )}
      </div>
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
