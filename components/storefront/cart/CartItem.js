import React from "react";
import styles from "../../../styles/components/storefront/cart/cartitem.module.css";
import Image from "next/image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import AddIcon from "@mui/icons-material/Add";
import candle_4 from "@/public/images/temp/candle_4.jpeg";
import { IconButton } from "@mui/material";
import { useCartStore } from "@/lib/store";
import RemoveIcon from "@mui/icons-material/Remove";
import Link from "next/link";

function CartItem({ isDesktop, isBusiness, cartItem }) {
  const removeItemFromCart = useCartStore((state) => state.removeItemFromCart);
  const addQuantityToCartItem = useCartStore(
    (state) => state.addQuantityToCartItem
  );
  const subtractQuantityFromCartItem = useCartStore(
    (state) => state.subtractQuantityFromCartItem
  );
  const addSubtotal = useCartStore((state) => state.addSubtotal);
  const subtractSubtotal = useCartStore((state) => state.subtractSubtotal);
  const addCartItemPrice = useCartStore((state) => state.addCartItemPrice);
  const subtractCartItemPrice = useCartStore(
    (state) => state.subtractCartItemPrice
  );

  const {
    priceDisplay,
    customNote,
    orderExampleImages,
    orderOptionGroups,
    orderQuestionsAnswers,
    productName,
    quantity,
    defaultImage,
    productId,
    pricePenny,
    addToCartTempItemId,
  } = cartItem;

  const handleAddItemQuantity = (addToCartTempItemId) => (e) => {
    const priceToAddPenny = pricePenny / quantity;

    addSubtotal(priceToAddPenny);
    addQuantityToCartItem(addToCartTempItemId);
    addCartItemPrice(addToCartTempItemId, priceToAddPenny);
  };

  const handleSubtractItemQuantity = (addToCartTempItemId) => (e) => {
    const priceToSubtractPenny = pricePenny / quantity;

    subtractQuantityFromCartItem(addToCartTempItemId);
    subtractSubtotal(priceToSubtractPenny);
    subtractCartItemPrice(addToCartTempItemId, priceToSubtractPenny);
  };

  const handleRemoveItemFromCart = (addToCartTempItemId) => (e) => {
    removeItemFromCart(addToCartTempItemId);
    subtractSubtotal(pricePenny);
    subtractCartItemPrice(addToCartTempItemId, pricePenny);
  };

  return (
    <div className={`${styles.cart_item_box} ${styles.flexCol}`}>
      <div className={`${styles.flex} ${styles.cart_item_top_box}`}>
        <div className="min-w-[5rem] h-[5rem] relative">
          <Image
            src={defaultImage}
            alt="product image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded object-cover w-full h-full"
          />
        </div>
        <div className={`${styles.flexCol} ${styles.item_info_box}`}>
          <h4 className="font-medium">{productName}</h4>

          {orderOptionGroups.length > 0 &&
            orderOptionGroups.map((optionGroup, idx) => {
              const { optionGroupName, options, optionDisplay } = optionGroup;
              if (!optionGroupName) return;
              return (
                <div key={idx} className="flex gap-2">
                  <p className="font-medium">{optionGroupName}:</p>
                  <p className="font-light">{optionDisplay}</p>
                </div>
              );
            })}
          {orderQuestionsAnswers.length > 0 &&
            orderQuestionsAnswers.map((questionItem, idx) => {
              const { question, answer } = questionItem;

              return (
                <div key={idx} className="gap-2">
                  <p className="font-medium">{question}</p>
                  <p className="font-light">{answer}</p>
                </div>
              );
            })}
          {customNote && (
            <div className="flex gap-2">
              <p className="font-medium">Note:</p>
              <p className="font-light">{customNote}</p>
            </div>
          )}
          {!isBusiness && (
            <div className="flex justify-between items-center">
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
              <h5 className="font-medium">{priceDisplay}</h5>
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.flexCol} ${styles.cart_item_uploads_box}`}>
        <div className={`${styles.flex} ${styles.upload_title_group}`}>
          {isBusiness ? (
            <h5 className="font-light text-sm">Customer Uploads:</h5>
          ) : (
            <h5 className="font-light text-sm">Sample uploads:</h5>
          )}
          {!isBusiness && (
            <Link
              className=" text-blue-600 text-sm font-light"
              href={`/product/${productId}/edit/${addToCartTempItemId}`}
            >
              edit
            </Link>
          )}
        </div>

        <div className={`${styles.flex} ${styles.example_images_box}`}>
          {orderExampleImages.length > 0 ? (
            orderExampleImages.map((imageData, idx) => {
              const { imageFile, fileName, imgUrl } = imageData;
              return (
                <div key={idx} className="w-[5rem] h-[5rem] relative">
                  <Image
                    src={imgUrl}
                    fill
                    alt="customer uploaded images"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded object-cover w-full h-full"
                  />
                </div>
              );
            })
          ) : (
            <p className="font-extralight text-xs">(No images uploaded)</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartItem;
