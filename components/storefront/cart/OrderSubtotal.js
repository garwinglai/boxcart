import React, { use, useEffect } from "react";
import styles from "../../../styles/components/storefront/cart/subtotal.module.css";
import { useCartStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";
import Link from "next/link";
import { useRouter } from "next/router";

function OrderSubtotal({ isInCart, orderSubmitted, order, isBusiness }) {
  const {
    push,
    query: { site },
  } = useRouter();
  const hydrated = useHasHydrated();

  if (orderSubmitted || isBusiness) {
    const {
      subtotalPenny,
      subtotalDisplay,
      taxRate,
      taxRateDisplay,
      taxAndFeesPenny,
      taxAndFeesDisplay,
      deliveryFeeType,
      deliveryFeePenny,
      deliveryFeeDisplay,
      totalDisplay,
    } = order;

    return (
      <div className="">
        <h3 className="font-medium text-base">Subtotal:</h3>
        <div className={`${styles.subtotal_box} ${styles.flex}`}>
          <div className={`${styles.flexCol} ${styles.subtotal_keys}`}>
            <React.Fragment>
              <p>Subtotal:</p>
              <p>Tax & fees:</p>
              <p>Delivery:</p>
              {/* <p>Tip:</p> */}
              <p className="font-bold border-t pt-2 mt-2">Total:</p>
            </React.Fragment>
          </div>
          <div className={`${styles.flexCol} ${styles.subtotal_values}`}>
            <React.Fragment>
              <p>{subtotalDisplay}</p>
              <p>{taxAndFeesDisplay}</p>
              <p>{deliveryFeeDisplay}</p>
              {/* <p>{tipDisplay}</p> */}
              <p className="font-bold border-t pt-2 mt-2">{totalDisplay}</p>
            </React.Fragment>
          </div>
        </div>
      </div>
    );
  }

  const cartStore = useCartStore((state) => {
    return state.store.find((store) => store.storeName === site);
  });
  const { cartDetails } = cartStore || {};

  const {
    subtotalPenny,
    subtotalDisplay,
    taxRate,
    taxRateDisplay,
    taxAndFeesPenny,
    taxAndFeesDisplay,
    deliveryFeeType,
    deliveryFeePenny,
    deliveryFeeDisplay,
    totalDisplay,
    applyFivePercentDiscount,
  } = cartDetails;

  const cashBackAmt = applyFivePercentDiscount ? subtotalPenny * 0.05 : 0;

  return (
    <div className="pt-4">
      {!isInCart && <h3 className="font-medium text-base">Subtotal:</h3>}
      <div className={`${styles.subtotal_box} ${styles.flex}`}>
        <div className={`${styles.flexCol} ${styles.subtotal_keys}`}>
          {!isInCart ? (
            <React.Fragment>
              <p>Subtotal:</p>
              <p>Tax & fees:</p>
              <p>Delivery:</p>
              {/* <p>Tip:</p> */}
              <p className="font-bold border-t pt-2 mt-2">Total:</p>
            </React.Fragment>
          ) : (
            <h3>
              <b>Subtotal:</b>
            </h3>
          )}
        </div>
        {hydrated && (
          <div className={`${styles.flexCol} ${styles.subtotal_values} mb-4`}>
            {!isInCart ? (
              <React.Fragment>
                <p>{subtotalDisplay}</p>
                <p>{taxAndFeesDisplay}</p>
                <p>{deliveryFeeDisplay}</p>
                {/* <p>{tipDisplay}</p> */}
                <p className="font-bold border-t pt-2 mt-2">{totalDisplay}</p>
              </React.Fragment>
            ) : (
              <h3>{subtotalDisplay}</h3>
            )}
          </div>
        )}
      </div>
      {applyFivePercentDiscount && (
        <p className="text-xs mt-4 bg-red-100 rounded p-2 ">
          View 5% cash back in{" "}
          <Link href="/user/account/orders" target="_blank">
            <u>account</u>
          </Link>{" "}
          after purchase.
        </p>
      )}
    </div>
  );
}

export default OrderSubtotal;
