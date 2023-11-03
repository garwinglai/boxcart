import React, { useEffect, useState } from "react";
import styles from "../../../styles/components/storefront/cart/cartitem.module.css";
import Image from "next/image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import AddIcon from "@mui/icons-material/Add";
import candle_4 from "@/public/images/temp/candle_4.jpeg";
import { IconButton } from "@mui/material";
import {
  useCartStore,
  useProductQuantityStore,
  useOptionsQuantityStore,
} from "@/lib/store";
import RemoveIcon from "@mui/icons-material/Remove";
import Link from "next/link";
import { useRouter } from "next/router";

function CartItem({
  isDesktop,
  isBusiness,
  cartItem,
  toggleDrawer,
  orderSubmitted,
  handleOpenSnackBar,
  notEnoughStockItems,
  notEnoughStockOptionItems,
}) {
  const productsStore = useProductQuantityStore((state) => state.products);
  const addProductQuantity = useProductQuantityStore(
    (state) => state.addProductQuantity
  );
  const reduceProductQuantity = useProductQuantityStore(
    (state) => state.reduceProductQuantity
  );
  const cart = useCartStore((state) => state.cart);
  const removeItemFromCart = useCartStore((state) => state.removeItemFromCart);
  const addQuantityToCartItem = useCartStore(
    (state) => state.addQuantityToCartItem
  );
  const subtractQuantityFromCartItem = useCartStore(
    (state) => state.subtractQuantityFromCartItem
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

  const addSubtotal = useCartStore((state) => state.addSubtotal);
  const subtractSubtotal = useCartStore((state) => state.subtractSubtotal);
  const addCartItemPrice = useCartStore((state) => state.addCartItemPrice);
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

  const { push } = useRouter();

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
    addSubtotal(priceToAddPenny);
    addQuantityToCartItem(addToCartTempItemId);
    addCartItemPrice(addToCartTempItemId, priceToAddPenny);
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
        addSubtotal(priceToAddPenny);
        addQuantityToCartItem(addToCartTempItemId);
        addCartItemPrice(addToCartTempItemId, priceToAddPenny);
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

    subtractQuantityFromCartItem(addToCartTempItemId);
    subtractSubtotal(priceToSubtractPenny);
    subtractCartItemPrice(addToCartTempItemId, priceToSubtractPenny);
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

    removeItemFromCart(addToCartTempItemId);
    subtractSubtotal(pricePenny);
    subtractCartItemPrice(addToCartTempItemId, pricePenny);
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
    push(`/product/${productId}/edit/${addToCartTempItemId}`);
    if (!isDesktop) {
      toggleDrawer();
    }
  };
  return (
    <div className="bg-white px-6 py-4 flex flex-col gap-2 border-b">
      <div className={`${styles.flex} ${styles.cart_item_top_box}`}>
        {productImage && defaultImage ? (
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
        <div className={`${styles.flexCol} ${styles.item_info_box}`}>
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
          <h4 className="font-medium">{productName}</h4>

          {orderOptionGroups.length > 0 &&
            orderOptionGroups.map((optionGroup, idx) => {
              const { optionGroupName, options, optionsDisplay } = optionGroup;
              if (!optionGroupName) return;
              return (
                <div key={idx} className="flex gap-2">
                  <p className="font-medium text-sm">{optionGroupName}:</p>
                  <p className="font-light text-sm">{optionsDisplay}</p>
                </div>
              );
            })}
          {orderQuestionsAnswers.length > 0 &&
            orderQuestionsAnswers.map((questionItem, idx) => {
              const { question, answer } = questionItem;

              return (
                <div key={idx} className="gap-2">
                  <p className="font-medium text-sm">{question}</p>
                  <p className="font-light text-sm">{answer}</p>
                </div>
              );
            })}
          {customNote && (
            <div className="flex gap-2">
              <p className="font-medium text-sm">Note:</p>
              <p className="font-light text-sm">{customNote}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            {isBusiness || orderSubmitted ? (
              <div className="flex gap-2 items-center  ">
                <div className="">
                  <p className="text-sm font-bold">Qty: {quantity}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center  ">
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

                <div className="w-fit border border-[color:var(--gray-light-med)] px-3 py-1">
                  <p>{quantity}</p>
                </div>
                <IconButton
                  onClick={handleAddItemQuantity(addToCartTempItemId)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </div>
            )}
            <h5 className="font-medium">{priceDisplay}</h5>
          </div>
        </div>
      </div>
      <div className={`${styles.flexCol} ${styles.cart_item_uploads_box}`}>
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
          {orderExampleImages.length < 0 ? (
            orderExampleImages.map((imageData, idx) => {
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
            })
          ) : (
            <p className="font-extralight text-xs">* No images uploaded</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartItem;
