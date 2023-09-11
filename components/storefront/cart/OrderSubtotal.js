import React, { use, useEffect } from "react";
import styles from "../../../styles/components/storefront/cart/subtotal.module.css";
import { useCartStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";

function OrderSubtotal({ isInCart }) {
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
    tipPennyDisplay,
    totalDisplay,
    totalPenny,
    tipPenny,
  } = cartDetails;

  useEffect(() => {
    const taxAndFeesPenny = Math.round(
      (subtotalPenny * (taxRate / 100)).toFixed(2)
    );

    const taxAndFeesDisplay = `$${(taxAndFeesPenny / 100).toFixed(2)}`;

    const totalPenny =
      subtotalPenny + taxAndFeesPenny + deliveryFeePenny + tipPenny;
    const totalDisplay = `$${(totalPenny / 100).toFixed(2)}`;

    setCartDetails({
      taxAndFeesPenny,
      taxAndFeesDisplay,
      totalPenny,
      totalDisplay,
    });
  }, []);

  return (
    <div className={`${styles.order_subtotal_box}`}>
      {!isInCart && <h3 className="font-medium">Subtotal:</h3>}
      <div className={`${styles.subtotal_box} ${styles.flex}`}>
        <div className={`${styles.flexCol} ${styles.subtotal_keys}`}>
          {!isInCart ? (
            <React.Fragment>
              <p>Subtotal:</p>
              <p>Tax & fees:</p>
              <p>Delivery:</p>
              <p>Tip:</p>
              <p className="font-bold border-t pt-2 mt-2">Total:</p>
            </React.Fragment>
          ) : (
            <h4>
              <b>Subtotal:</b>
            </h4>
          )}
        </div>
        {hydrated && (
          <div className={`${styles.flexCol} ${styles.subtotal_values}`}>
            {!isInCart ? (
              <React.Fragment>
                <p>{subtotalDisplay}</p>
                <p>{taxAndFeesDisplay}</p>
                <p>{deliveryFeeDisplay}</p>
                <p>{tipPennyDisplay}</p>
                <p className="font-bold border-t pt-2 mt-2">{totalDisplay}</p>
              </React.Fragment>
            ) : (
              <h4>{subtotalDisplay}</h4>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderSubtotal;
