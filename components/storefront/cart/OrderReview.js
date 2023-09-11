import React from "react";
import styles from "../../../styles/components/storefront/cart/review.module.css";
import { useCartStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";

function OrderReview() {
  const cartDetails = useCartStore((state) => state.cartDetails);
  const hydrated = useHasHydrated();

  const {
    orderForDateDisplay,
    orderForTimeDisplay,
    fulfillmentDisplay,
    deliveryAddress,
    fulfillmentType,
  } = cartDetails;

  return (
    <div className="py-6 mx-4 border-b">
      <h3 className="font-medium">Order Details:</h3>
      <div className={`${styles.reivew_content_box} ${styles.flexCol}`}>
        <div className={`${styles.flex} ${styles.review_context}`}>
          <p>
            <b>For date:</b>
          </p>
          {hydrated && (
            <p className={`${styles.review_context_value}`}>
              {orderForDateDisplay} @ {orderForTimeDisplay}
            </p>
          )}
        </div>
        <div className={`${styles.flex} ${styles.review_context}`}>
          <p>
            <b>Fulfillment:</b>
          </p>
          <p className={`${styles.review_context_value}`}>
            {hydrated && fulfillmentDisplay}
          </p>
        </div>
        {fulfillmentType === 0 && (
          <div className={`${styles.flex} ${styles.review_context}`}>
            <p>
              <b>Delivery address:</b>
            </p>
            <p className={`${styles.review_context_value}`}>
              {hydrated && deliveryAddress}
            </p>
          </div>
        )}
        {/* <div className={`${styles.flex} ${styles.review_context}`}>
        <p>
          <b>Pickup address:</b>
        </p>
        <p className={`${styles.review_context_value}`}>
          123 W camino real ave, arcadia CA 91004
        </p>
      </div> */}
      </div>
    </div>
  );
}

export default OrderReview;
