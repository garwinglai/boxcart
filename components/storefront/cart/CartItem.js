import React, { useEffect, useState } from "react";
import styles from "../../../styles/components/storefront/cart/cartitem.module.css";
import Image from "next/image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import {
  useCartStore,
  useProductQuantityStore,
  useOptionsQuantityStore,
} from "@/lib/store";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/router";
import ButtonSecondaryStorefront from "@/components/global/buttons/ButtonSecondaryStorefront";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ButtonPrimaryStorefront from "@/components/global/buttons/ButtonPrimaryStorefront";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 426px)": {
    width: "50%",
  },
  "@media (min-width: 769px)": {
    width: "40%",
  },
  "@media (min-width: 1025px)": {
    width: "30%",
  },
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

function CartItem({
  isDesktop,
  isBusiness,
  cartItem,
  toggleDrawer,
  orderSubmitted,
  handleOpenSnackBar,
  notEnoughStockItems,
  notEnoughStockOptionItems,
  query,
  idx,
  isShopper,
}) {
  const productsStore = useProductQuantityStore((state) => state.products);
  const addProductQuantity = useProductQuantityStore(
    (state) => state.addProductQuantity
  );
  const reduceProductQuantity = useProductQuantityStore(
    (state) => state.reduceProductQuantity
  );
  const optionQuantityStore = useOptionsQuantityStore((state) => state.options);
  const setOptionsQuantityStore = useOptionsQuantityStore(
    (state) => state.setOptions
  );
  const reduceRemainingQuantity = useOptionsQuantityStore(
    (state) => state.reduceRemainingQuantity
  );
  const addRemainingQuantity = useOptionsQuantityStore(
    (state) => state.addRemainingQuantity
  );
  const updateRemainingMax = useOptionsQuantityStore(
    (state) => state.updateRemainingMax
  );
  const removeOption = useOptionsQuantityStore((state) => state.removeOption);
  const reduceOptionQuantity = useOptionsQuantityStore(
    (state) => state.reduceOptionQuantity
  );
  const addOptionQuantity = useOptionsQuantityStore(
    (state) => state.addOptionQuantity
  );

  const {
    push,
    query: { site },
  } = useRouter();

  const setCartDetails = useCartStore((state) => state.setCartDetails);
  const cartStore = useCartStore((state) => {
    return state.store.find((store) => store.storeName === site);
  });
  const { cart } = cartStore || {};

  const addSubtotal = useCartStore((state) => state.addSubtotal);
  const addCartItemPrice = useCartStore((state) => state.addCartItemPrice);
  const addQuantityToCartItem = useCartStore(
    (state) => state.addQuantityToCartItem
  );
  const subtractSubtotal = useCartStore((state) => state.subtractSubtotal);
  const removeItemFromCart = useCartStore((state) => state.removeItemFromCart);
  const subtractQuantityFromCartItem = useCartStore(
    (state) => state.subtractQuantityFromCartItem
  );
  const subtractCartItemPrice = useCartStore(
    (state) => state.subtractCartItemPrice
  );

  const [showNotEnoughStock, setShowNotEnoughStock] = useState(
    notEnoughStockItems &&
      notEnoughStockItems.some(
        (outOfStockProductId) =>
          outOfStockProductId == cartItem.addToCartTempItemId
      )
  );
  const [showNotEnoughOptionStock, setShowNotEnoughOptionStock] = useState(
    notEnoughStockOptionItems &&
      notEnoughStockOptionItems.some(
        (outOfStockOptionId) =>
          outOfStockOptionId == cartItem.addToCartTempItemId
      )
  );
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const handleOpenDownloadModal = () => setOpenDownloadModal(true);
  const handleCloseDownloadModal = () => setOpenDownloadModal(false);

  const {
    priceDisplay,
    customNote,
    orderExampleImages,
    orderOptionGroups,
    orderQuestionsAnswers,
    productName,
    quantity,
    defaultImage,
    productImage,
    productId,
    pricePenny,
    addToCartTempItemId,
    hasUnlimitedQuantity,
    setQuantityByProduct,
    productType,
  } = cartItem;

  useEffect(() => {
    if (!notEnoughStockItems) return;
    setShowNotEnoughStock(
      notEnoughStockItems.some(
        (outOfStockProductId) =>
          outOfStockProductId == cartItem.addToCartTempItemId
      )
    );
  }, [notEnoughStockItems]);

  useEffect(() => {
    if (!notEnoughStockOptionItems) return;
    setShowNotEnoughOptionStock(
      notEnoughStockOptionItems.some(
        (outOfStockOptionId) =>
          outOfStockOptionId == cartItem.addToCartTempItemId
      )
    );
  }, [notEnoughStockOptionItems]);

  // TODO: old store new store?

  const handleAddItemQuantity = (addToCartTempItemId) => (e) => {
    const { productInCartId } = query;
    if (productInCartId) {
      toggleDrawer();
      return;
    }
    const priceToAddPenny = pricePenny / quantity;
    const quantityToReduceFromProductStore = 1;

    if (!hasUnlimitedQuantity && setQuantityByProduct) {
      subtractQuantityFromProductStore(
        priceToAddPenny,
        quantityToReduceFromProductStore
      );
    }

    if (!hasUnlimitedQuantity && !setQuantityByProduct) {
      subtractQuantityFromOptionsStore(
        priceToAddPenny,
        quantityToReduceFromProductStore
      );
    }

    if (hasUnlimitedQuantity) {
      addQuantityToCartItem(site, addToCartTempItemId);
      addSubtotal(site, priceToAddPenny);
      addCartItemPrice(site, addToCartTempItemId, priceToAddPenny);
    }

    setCartDetails(site, { taxRateCalculated: false });
  };

  const subtractQuantityFromOptionsStore = (
    priceToAddPenny,
    quantityToReduceFromProductStore
  ) => {
    const optionsInCart = [];

    // 1. check if options are still avialable in store.
    for (let i = 0; i < orderOptionGroups.length; i++) {
      const currData = orderOptionGroups[i];
      const { groupId, options } = currData;
      for (let z = 0; z < options.length; z++) {
        const currOption = options[z];
        const { optionId } = currOption;
        const data = {
          productId,
          groupId,
          optionId,
          quantityToReduceFromProductStore,
        };
        optionsInCart.push(data);
        // addOptionQuantity(productId, groupId, optionId, quantityToReAdd);
      }
    }

    let remainingMaxQuantity = 0;

    // a. Loop through store. Check the optionsInCart, see if quantityLeft > 0, if so, subtract from store. If not, throw error "not enough stock"
    // look for maxQtyOfOptionInStore
    for (let m = 0; m < optionQuantityStore.length; m++) {
      const currStore = optionQuantityStore[m];
      const { optionGroups } = currStore;
      for (let n = 0; n < optionGroups.length; n++) {
        const currGroup = optionGroups[n];
        const { options, isRequired } = currGroup;

        for (let o = 0; o < options.length; o++) {
          const currOption = options[o];
          const { optionQuantityLeft, optionId: optionIdInStore } = currOption;

          const optionExistsInCart = optionsInCart.find(
            (item) => item.optionId == optionIdInStore
          );

          if (!optionExistsInCart) {
            if (!isRequired) continue;

            if (remainingMaxQuantity < optionQuantityLeft) {
              remainingMaxQuantity = optionQuantityLeft;
            }

            continue;
          }

          // Options exists in cart
          // check if quantity > 0, if so reduce option from store, and reduce remainingQuantity.
          const {
            groupId,
            optionId,
            productId,
            quantityToReduceFromProductStore,
          } = optionExistsInCart;

          if (optionQuantityLeft <= 0) {
            handleOpenSnackBar("Not enough stock.");
            return;
          }

          const newMax = optionQuantityLeft - quantityToReduceFromProductStore;
          if (remainingMaxQuantity < newMax) {
            remainingMaxQuantity = newMax;
          }

          reduceOptionQuantity(
            productId,
            groupId,
            optionId,
            quantityToReduceFromProductStore
          );
          reduceRemainingQuantity(productId, quantityToReduceFromProductStore);
        }
      }
    }
    // 3. if quantityLeft > 0, update remainingMax, subtract quantity from maxLeft, and find the max.
    updateRemainingMax(productId, remainingMaxQuantity);
    addSubtotal(site, priceToAddPenny);
    addQuantityToCartItem(site, addToCartTempItemId);
    addCartItemPrice(site, addToCartTempItemId, priceToAddPenny);
  };

  const subtractQuantityFromProductStore = (
    priceToAddPenny,
    quantityToReduceFromProductStore
  ) => {
    const productInStore = productsStore.find((item) => item.id === productId);
    const findAllRelatedCartItmes = cart.filter(
      (item) => item.productId === productId
    );

    const sumOfSelectedQuantitiesForCartItems = findAllRelatedCartItmes.reduce(
      (acc, curr) => acc + curr.quantity,
      1
    );

    if (productInStore) {
      const { initialQuantity } = productInStore;
      if (sumOfSelectedQuantitiesForCartItems <= initialQuantity) {
        reduceProductQuantity(productId, quantityToReduceFromProductStore);
        addSubtotal(site, priceToAddPenny);
        addQuantityToCartItem(site, addToCartTempItemId);
        addCartItemPrice(site, addToCartTempItemId, priceToAddPenny);
      } else {
        handleOpenSnackBar("Max quantity reached.");
      }
    } else {
      // TODO check this
      // If product is not in zustand store, it's because during checkout, the quantity of selected product > initialQuantity that the item has. So store was removed and we throw an max quantity reached error.
      handleOpenSnackBar("Max quantity reached.");
    }
  };

  const handleSubtractItemQuantity = (addToCartTempItemId) => (e) => {
    const { productInCartId } = query;
    if (productInCartId) {
      toggleDrawer();
      return;
    }
    const priceToSubtractPenny = pricePenny / quantity;
    const findAllRelatedCartItmes = cart.filter(
      (item) => item.productId === productId
    );

    if (!hasUnlimitedQuantity && setQuantityByProduct) {
      reAddProductQuantities(findAllRelatedCartItmes);
    }

    if (!hasUnlimitedQuantity && !setQuantityByProduct) {
      reAddProductOptionQuantities();
    }

    subtractQuantityFromCartItem(site, addToCartTempItemId);
    subtractSubtotal(site, priceToSubtractPenny);
    subtractCartItemPrice(site, addToCartTempItemId, priceToSubtractPenny);
    setCartDetails(site, { taxRateCalculated: false });
  };

  const handleRemoveItemFromCart = (addToCartTempItemId) => (e) => {
    const findAllRelatedCartItmes = cart.filter(
      (item) => item.productId === productId
    );

    if (!hasUnlimitedQuantity && setQuantityByProduct) {
      reAddProductQuantities(findAllRelatedCartItmes);
    }

    if (!hasUnlimitedQuantity && !setQuantityByProduct) {
      reAddProductOptionQuantities();
    }

    removeItemFromCart(site, addToCartTempItemId);
    subtractSubtotal(site, pricePenny);
    subtractCartItemPrice(site, addToCartTempItemId, pricePenny);
    setCartDetails(site, { taxRateCalculated: false });
  };

  const reAddProductOptionQuantities = () => {
    const quantityToReAdd = 1;
    let maxQuantity = 0;

    // Loop through options added to cart and add quantity back to store
    for (let l = 0; l < orderOptionGroups.length; l++) {
      const currData = orderOptionGroups[l];
      const { groupId, options } = currData;
      for (let z = 0; z < options.length; z++) {
        const currOption = options[z];
        const { optionId } = currOption;
        addOptionQuantity(productId, groupId, optionId, quantityToReAdd);
      }
    }

    // look for maxQtyOfOptionInStore
    for (let m = 0; m < optionQuantityStore.length; m++) {
      const currStore = optionQuantityStore[m];
      const { optionGroups } = currStore;
      for (let n = 0; n < optionGroups.length; n++) {
        const currGroup = optionGroups[n];
        const { options, isRequired } = currGroup;
        if (!isRequired) continue;

        for (let o = 0; o < options.length; o++) {
          const currOption = options[o];
          const { optionQuantityLeft, optionId } = currOption;

          for (let p = 0; p < orderOptionGroups.length; p++) {
            const currData = orderOptionGroups[p];
            const { groupId, options } = currData;
            for (let x = 0; x < options.length; x++) {
              const curr = options[x];
              const { optionId: optionIdToCheck } = curr;
              if (optionId == optionIdToCheck) {
                const newQuantity = optionQuantityLeft + quantityToReAdd;
                if (maxQuantity < newQuantity) {
                  maxQuantity = newQuantity;
                }
                continue;
              }
            }
            if (maxQuantity < optionQuantityLeft)
              maxQuantity = optionQuantityLeft;
          }
        }
      }
    }
    const reAddMaxQuantity = maxQuantity;
    updateRemainingMax(productId, reAddMaxQuantity);

    // add remainingOptions back to store
    addRemainingQuantity(productId, quantityToReAdd);
  };

  const reAddProductQuantities = (findAllRelatedCartItmes) => {
    const productInStore = productsStore.find((item) => item.id === productId);
    const quantityToIncreaseInProductStore = 1;

    const sumOfSelectedQuantitiesForCartItems = findAllRelatedCartItmes.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );

    if (productInStore) {
      const { initialQuantity } = productInStore;

      if (sumOfSelectedQuantitiesForCartItems <= initialQuantity) {
        addProductQuantity(productId, quantityToIncreaseInProductStore);
      }
    }
  };

  const handleEditCartItem = (e) => {
    if (productType === 0) {
      push(`/${site}/product/${productId}/edit/${addToCartTempItemId}`);
    } else {
      push(`/${site}/digital-product/${productId}/edit/${addToCartTempItemId}`);
    }
    if (!isDesktop) {
      toggleDrawer();
    }
  };

  const handleDownloadDigitalProduct = (e) => {
    const {
      digitalProduct: { digitalFiles },
    } = cartItem;
    const { uploadedFile } = digitalFiles[0];

    // Open the PDF URL in a new window
    window.open(uploadedFile, "_blank");
  };

  return (
    <div
      className={`bg-white py-4 flex flex-col gap-2 ${
        idx === 0 ? "" : "border-t"
      }`}
    >
      <div className={`flex gap-1`}>
        {productImage || defaultImage ? (
          <div className="min-w-[5rem] h-[5rem] relative">
            <Image
              src={
                isBusiness
                  ? productImage
                  : orderSubmitted
                  ? productImage
                  : defaultImage
              }
              alt="product image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="min-w-[5rem] h-[5rem] relative">
            <Image
              src={"https://fl-1.cdn.flockler.com/embed/no-image.svg"}
              alt="product image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex flex-col pl-1 flex-grow ">
          {showNotEnoughStock && (
            <p className="text-sm font-light text-[color:var(--error)] -mb-2">
              Not enough stock.
            </p>
          )}
          {showNotEnoughOptionStock && (
            <p className="text-sm font-light text-[color:var(--error)] -mb-2">
              Not enough stock.
            </p>
          )}
          <div className="flex justify-between items-center gap-4">
            <h4 className="text-base font-medium mb-1">{productName}</h4>
            {!isBusiness && !orderSubmitted && productType === 0 && (
              <button
                onClick={handleEditCartItem}
                className="text-blue-600 text-xs font-light"
              >
                edit
              </button>
            )}
          </div>
          <div className="flex justify-between items-center w-full">
            {isBusiness || orderSubmitted ? (
              <div className="flex gap-2 items-center  ">
                <p className="text-xs">Qty:</p>
                <p className="text-xs">{quantity}</p>
              </div>
            ) : (
              <div className="flex gap-1 items-center  ">
                {quantity > 1 ? (
                  <IconButton
                    onClick={handleSubtractItemQuantity(addToCartTempItemId)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={handleRemoveItemFromCart(addToCartTempItemId)}
                  >
                    <DeleteForeverIcon fontSize="small" />
                  </IconButton>
                )}

                <div className="w-fit border text-sm border-[color:var(--gray-light-med)] px-2">
                  <p>{quantity}</p>
                </div>
                <IconButton
                  onClick={handleAddItemQuantity(addToCartTempItemId)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </div>
            )}
            <h5 className="text-sm font-medium text-right">{priceDisplay}</h5>
          </div>
          {isShopper && isBusiness && productType === 1 && (
            <div className="mt-2 ml-auto w-[7rem]">
              <ButtonSecondaryStorefront
                handleClick={handleOpenDownloadModal}
                name="Download"
                type="button"
              />
              <Modal
                open={openDownloadModal}
                onClose={handleCloseDownloadModal}
                aria-labelledby="Download product"
                aria-describedby="Please ensure to download product."
              >
                <Box sx={style}>
                  <div>
                    <h3 className="text-base">Product download</h3>
                    <p className="text-sm my-4">
                      Please download the product and save to your computer. If
                      you do not download the product, you may no longer be able
                      to view it in the future if the business decides to remove
                      it from their store.
                    </p>
                    <div className="h-8">
                      <ButtonPrimaryStorefront
                        name="View download"
                        handleClick={handleDownloadDigitalProduct}
                      />
                    </div>
                  </div>
                </Box>
              </Modal>
            </div>
          )}
        </div>
      </div>
      <div>
        {(productType === 1 ||
          (orderOptionGroups && orderOptionGroups.length > 0) ||
          (orderQuestionsAnswers && orderQuestionsAnswers.length > 0) ||
          customNote) && <p className="text-sm font-medium">Options:</p>}

        {productType === 1 && (
          <div className="flex gap-2">
            <p className="text-xs">Type:</p>
            <p className="text-xs">download</p>
          </div>
        )}

        {orderOptionGroups &&
          orderOptionGroups.length > 0 &&
          orderOptionGroups.map((optionGroup, idx) => {
            const { optionGroupName, options, optionsDisplay } = optionGroup;
            if (!optionGroupName) return;
            return (
              <div key={idx} className="flex gap-2">
                <p className=" text-xs">{optionGroupName}:</p>
                <p className=" text-xs">{optionsDisplay}</p>
              </div>
            );
          })}
        {orderQuestionsAnswers &&
          orderQuestionsAnswers.length > 0 &&
          orderQuestionsAnswers.map((questionItem, idx) => {
            const { question, answer } = questionItem;

            return (
              <div key={idx} className="flex gap-2">
                <p className="text-xs">{question}</p>
                <p className="text-xs">{answer}</p>
              </div>
            );
          })}
        {customNote && (
          <div className="flex gap-2">
            <p className="text-xs">Note:</p>
            <p className="text-xs">{customNote}</p>
          </div>
        )}
      </div>
      {productType === 0 &&
        orderExampleImages &&
        orderExampleImages.length > 0 && (
          <div className={`flex flex-col gap-2 border-t`}>
            <div className="flex justify-between">
              {isBusiness ? (
                <h5 className="font-light text-sm">Customer Uploads:</h5>
              ) : (
                <h5 className="font-light text-sm">Sample uploads:</h5>
              )}
              {!isBusiness && !orderSubmitted && (
                <button
                  onClick={handleEditCartItem}
                  className="text-blue-600 text-sm font-light"
                >
                  edit
                </button>
              )}
            </div>

            <div className={`${styles.flex} ${styles.example_images_box}`}>
              {orderExampleImages.map((imageData, idx) => {
                const { imageFile, fileName, imgUrl, image } = imageData;

                return (
                  <div key={idx} className="w-[5rem] h-[5rem] relative">
                    <Image
                      src={isBusiness || orderSubmitted ? image : imgUrl}
                      fill
                      alt="customer uploaded images"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded object-cover w-full h-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}

export default CartItem;
