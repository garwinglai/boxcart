import React, { use, useEffect } from "react";
import styles from "../../../styles/components/storefront/cart/subtotal.module.css";
import { useCartStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";
import Link from "next/link";

function OrderSubtotal({ isInCart, orderSubmitted, order, isBusiness }) {
  const cartDetails = useCartStore((state) => state.cartDetails);
  const setCartDetails = useCartStore((state) => state.setCartDetails);

  const hydrated = useHasHydrated();

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

  useEffect(() => {
    const taxAndFeesPenny = Math.round(
      (subtotalPenny * (taxRate / 100)).toFixed(2)
    );

    const taxAndFeesDisplay = `$${(taxAndFeesPenny / 100).toFixed(2)}`;

    const totalPenny = subtotalPenny + taxAndFeesPenny + deliveryFeePenny;
    const totalDisplay = `$${(totalPenny / 100).toFixed(2)}`;

    setCartDetails({
      taxAndFeesPenny,
      taxAndFeesDisplay,
      totalPenny,
      totalDisplay,
    });
  }, []);

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
          <div className={`${styles.flexCol} ${styles.subtotal_values}`}>
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
          <Link href="/user/account/dashboard" target="_blank">
            <u>account</u>
          </Link>{" "}
          after purchase.
        </p>
      )}
    </div>
  );
}

export default OrderSubtotal;
