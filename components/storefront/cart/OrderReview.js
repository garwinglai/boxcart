import React from "react";
import styles from "../../../styles/components/storefront/cart/review.module.css";
import { useCartStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";
import { useRouter } from "next/router";

function OrderReview({ closeDrawer, isMobile, orderSubmitted, order }) {
  const cartDetails = useCartStore((state) => state.cartDetails);
  const hydrated = useHasHydrated();

  const {
    orderForDateDisplay,
    orderForTimeDisplay,
    fulfillmentDisplay,
    deliveryAddress,
    fulfillmentType,
    requireOrderTime,
    requireOrderDate,
  } = cartDetails;

  const { push } = useRouter();

  const handleAddDateTime = () => {
    push("/");
    closeDrawer();
  };

  if (orderSubmitted) {
    const {
      orderForDateDisplay,
      orderForTimeDisplay,
      fulfillmentDisplay,
      deliveryAddress,
      fulfillmentType,
      requireOrderTime,
      requireOrderDate,
    } = order;

    return (
      <div className="py-6 mx-4 border-b">
        <h3 className="font-medium mb-2">Order Details:</h3>
        <div className="flex flex-col gap-2 px-2">
          <div className={`${styles.flex} ${styles.review_context}`}>
            <p>
              <b>For date:</b>
            </p>
            <p className="text-xs font-light">
              {requireOrderDate && orderForDateDisplay}
              {requireOrderTime && ` @ ` + orderForTimeDisplay}
            </p>
          </div>
          <div className={`${styles.flex} ${styles.review_context}`}>
            <p>
              <b>Fulfillment:</b>
            </p>
            <p className={`${styles.review_context_value}`}>
              {fulfillmentDisplay}
            </p>
          </div>
          {fulfillmentType === 0 && (
            <div className={`${styles.flex} ${styles.review_context}`}>
              <p>
                <b>Delivery address:</b>
              </p>
              <p className={`${styles.review_context_value}`}>
                {deliveryAddress}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 mx-4 border-b">
      <h3 className="font-medium mb-2">Order Details:</h3>
      <div className="flex flex-col gap-2 px-2">
        {hydrated && (requireOrderDate || requireOrderTime) && (
          <div className={`${styles.flex} ${styles.review_context}`}>
            <p>
              <b>For date:</b>
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-light">
                {requireOrderDate && orderForDateDisplay}
                {requireOrderTime && ` @ ` + orderForTimeDisplay}
              </p>
              {((requireOrderDate && orderForDateDisplay === "Select date") ||
                (requireOrderTime && orderForTimeDisplay === "time")) && (
                <button
                  onClick={handleAddDateTime}
                  className="text-blue-600 text-sm font-light"
                >
                  add
                </button>
              )}
            </div>
          </div>
        )}
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
            {hydrated && deliveryAddress ? (
              <p className={`${styles.review_context_value}`}>
                {deliveryAddress}
              </p>
            ) : (
              isMobile && (
                <button
                  onClick={closeDrawer}
                  className="text-blue-600 text-sm font-light"
                >
                  add
                </button>
              )
            )}
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
