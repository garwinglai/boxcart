import React, { useState } from "react";
import Image from "next/image";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import { IconButton } from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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
  addToProductsList,
  updateProductList,
}) {
  //Props
  const {
    id,
    isEnabled,
    productName,
    priceIntPenny,
    priceStr,
    defaultImgStr,
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
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isItemEnabled, setIsItemEnabled] = useState(isEnabled);
  const [state, setState] = useState({
    right: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isExpanded = expandedCardId === id;

  const handleExpand = () => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(id);
    }

    setIsCardOpen((prev) => !prev);
  };

  const handleClickListenerExpand = () => {
    setIsCardModalOpen((prev) => !prev);
  };

  const handleSwitchChange = () => {
    setIsItemEnabled((prev) => !prev);
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
  };

  const handleDeleteProduct = (productId) => async (e) => {
    setIsLoading(true);

    const deleteProduct = await deleteProductClient(productId);
    const { success, value, error } = deleteProduct;
    setIsLoading(false);

    if (!success) {
      handleCloseDeleteModal();
      handleOpenSnackbar("Could not delete product.");
      return;
    }

    handleCloseDeleteModal();
    filterDeletedProducts(productId);
    handleOpenSnackbar("Product deleted.");
  };

  const handleDuplicateProduct = async () => {
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
    addToProductsList(createdProduct);
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
    <div
      className={`rounded w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white md:row-auto ${
        isExpanded ? "md:grid-row-end-auto" : "md:h-fit"
      }`}
    >
      <div className="flex gap-3 justify-between items-center border-b border-[color:var(--gray-light-med)]">
        <div className="self-start w-[30%] relative sm:w-[20%] lg:w-[30%]">
          <Image
            src={candle_2}
            alt="image"
            priority={true}
            className="rounded-ss object-cover w-full h-full"
          />
          <button className="bg-black bg-opacity-50 border border-white rounded text-white absolute bottom-1 right-1 px-2 py-1 text-xs font-extralight ">
            5 Photos
          </button>
        </div>
        <div className="flex-grow flex flex-col gap-1 py-2">
          <h2 className="text-base font-medium">{productName}</h2>
          <p className="text-xs font-light md:text-sm">
            <b className="">Price: </b>
            {priceStr}
          </p>
          <p className="text-xs font-light md:text-sm">
            <b className="">Qty: </b>
            {hasUnlimitedQuantity
              ? "Unlimited"
              : setQuantityByProduct
              ? quantity == 0
                ? "Out of stock"
                : quantity
              : "Set for product options"}
          </p>
          <p className="text-xs font-light md:text-sm">
            <b className="">Category: </b>
            {relatedCategories && relatedCategories.length > 0
              ? relatedCategories.map((category, idx) => {
                  const { categoryName } = category;
                  const relatedCategoriesLength = relatedCategories.length;
                  if (idx === relatedCategoriesLength - 1)
                    return <span key={categoryName}>{categoryName}</span>;

                  return <span key={categoryName}>{categoryName}, </span>;
                })
              : "n/a"}
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
          />
        </div>
      </div>
      <div className="flex justify-between items-center p-2">
        <span className="flex gap-4 items-center">
          <p
            className={`text-xs ${
              isItemEnabled
                ? "text-[color:var(--primary-dark-med)] "
                : "text-[color:var(--gray-text)] "
            }`}
          >
            Visible in store
          </p>
          <IOSSwitch checked={isItemEnabled} onChange={handleSwitchChange} />
        </span>

        <div className="hidden lg:block">
          <IconButton
            onClick={handleClickListenerExpand}
            sx={{ marginRight: "8px" }}
          >
            <AspectRatioOutlinedIcon fontSize="small" />
          </IconButton>
          <ProductModal
            isItemEnabled={isItemEnabled}
            toggleDrawer={toggleDrawer}
            state={state}
            handleSwitchChange={handleSwitchChange}
            isCardModalOpen={isCardModalOpen}
            handleClickListenerExpand={handleClickListenerExpand}
            product={product}
          />
        </div>
        <div className="lg:hidden">
          <IconButton onClick={handleExpand}>
            {isCardOpen ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </div>
      </div>
      {isCardOpen && (
        <div className="border-t border-[color:var(--gray-light-med)]">
          <div className="p-4 border-b border-[color:var(--gray-light)] ">
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm px-8 font-extralight mt-2">{description}</p>
          </div>
          <div className="p-4 border-b border-[color:var(--gray-light)] ">
            <h4 className="text-sm font-medium">Product options</h4>
            {optionGroups.length === 0 ? (
              <p className="text-sm font-extralight text-[color:var(--gray-text)] text-center mt-4">
                No options available
              </p>
            ) : (
              optionGroups.map((group) => {
                const { optionGroupName, options, id: groupId } = group;

                return (
                  <div className="px-8 pt-2" key={groupId}>
                    <h5 className="text-sm mb-2">{optionGroupName}:</h5>
                    {options.map((option) => {
                      const {
                        id: optionId,
                        optionName,
                        priceStr,
                        imgStr,
                        optionGroupId,
                        quantityStr,
                        quantityInt,
                      } = option;

                      if (optionGroupId == groupId) {
                        return (
                          <div
                            key={optionId}
                            className="flex justify-between items-center pl-2 font-light text-sm mb-1 md:text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {imgStr && (
                                <Image
                                  src={candle_2}
                                  alt="image"
                                  className="rounded object-cover w-10 h-10"
                                />
                              )}
                              <p className="font-extralight">{optionName}</p>
                              {quantityStr && (
                                <p className="font-extralight">
                                  ({quantityStr} left)
                                </p>
                              )}
                            </div>
                            <p className="font-extralight">{priceStr}</p>
                          </div>
                        );
                      }
                    })}
                  </div>
                );
              })
            )}
          </div>
          <div className="p-4">
            <h4 className="text-sm font-medium">Questions for customers</h4>
            <div className="px-8 pt-2">
              {questions.length === 0 ? (
                <p className="text-sm font-extralight text-[color:var(--gray-text)] text-center mt-4 md:text-sm">
                  No questions
                </p>
              ) : (
                questions.map((item) => {
                  const { question, id, isRequired } = item;

                  return (
                    <div key={id} className="flex justify-between items-center">
                      <p className="font-extralight text-sm">{question}</p>
                      <p className="font-extralight text-sm">
                        {isRequired ? "(required)" : "(optional)"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
