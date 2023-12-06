import React from "react";
import styles from "../../../styles/components/storefront/cart/review.module.css";
import { useCartStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";
import { useRouter } from "next/router";

function OrderReview({
  closeDrawer,
  isMobile,
  orderSubmitted,
  order,
  isBusiness,
}) {
  const cartDetails = useCartStore((state) => state.cartDetails);
  const hydrated = useHasHydrated();

  const {
    orderForDateDisplay,
    orderForTimeDisplay,
    fulfillmentDisplay,
    deliveryAddress,
    pickupAddress,
    fulfillmentType,
    requireOrderTime,
    requireOrderDate,
    pickupNote,
  } = cartDetails;

  const { push } = useRouter();

  const handleAddDateTime = () => {
    push("/");
    closeDrawer();
  };

  if (orderSubmitted || isBusiness) {
    const {
      orderForDateDisplay,
      orderForTimeDisplay,
      fulfillmentDisplay,
      deliveryAddress,
      pickupAddress,
      pickupNote,
      fulfillmentType,
      requireOrderTime,
      requireOrderDate,
    } = order;

    return (
      <div className="pb-4 mx-4 border-b">
        <h3 className="font-medium mt-4 mb-2">Order Details:</h3>
        <div className="flex flex-col gap-2 px-2">
          {requireOrderDate && (
            <div className={`${styles.flex} ${styles.review_context}`}>
              <p>
                <b>For date:</b>
              </p>
              <p className="text-sm font-light">
                {requireOrderDate && orderForDateDisplay}
                {requireOrderTime && ` @ ` + orderForTimeDisplay}
              </p>
            </div>
          )}
          <div className={`${styles.flex} ${styles.review_context}`}>
            <p>
              <b>Fulfillment:</b>
            </p>
            <p className="text-sm font-light">{fulfillmentDisplay}</p>
          </div>
          {fulfillmentType === 0 && (
            <div className={`${styles.flex} ${styles.review_context}`}>
              <p>
                <b>Delivery address:</b>
              </p>
              <p className="text-sm font-light">{deliveryAddress}</p>
            </div>
          )}

          {fulfillmentType === 1 && (
            <div className={`${styles.flex} ${styles.review_context}`}>
              <p className="pr-4">
                <b>Pickup address:</b>
              </p>
              <p className="text-sm font-light text-right">{pickupAddress}</p>
            </div>
          )}
          {fulfillmentType === 1 && pickupNote && (
            <div>
              <div className={`${styles.flex} ${styles.review_context}`}>
                <p className="pr-4">
                  <b>Note:</b>
                </p>
                <p className="text-sm font-light text-right">{pickupNote}</p>
              </div>
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
        {hydrated && requireOrderDate && (
          <div className={`${styles.flex} ${styles.review_context}`}>
            <p className="text-sm">For date:</p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-light">
                {requireOrderDate && orderForDateDisplay && orderForDateDisplay}
                {requireOrderTime &&
                  orderForTimeDisplay &&
                  ` @ ` + orderForTimeDisplay}
              </p>
              {requireOrderDate && orderForDateDisplay === "" && (
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
          <p className="text-sm">Fulfillment:</p>
          <p className="text-xs font-light">{hydrated && fulfillmentDisplay}</p>
        </div>
        {fulfillmentType === 0 && (
          <div className={`${styles.flex} ${styles.review_context}`}>
            <p className="text-sm">Delivery address:</p>
            {hydrated && deliveryAddress ? (
              <p className="text-sm font-light text-right">{deliveryAddress}</p>
            ) : (
              isMobile && (
                <button
                  onClick={handleAddDateTime}
                  className="text-blue-600 text-sm font-light"
                >
                  add
                </button>
              )
            )}
          </div>
        )}
        {hydrated && fulfillmentType === 1 && (
          <div>
            <div className={`${styles.flex} ${styles.review_context}`}>
              <p className="text-sm">Pickup address:</p>
              <p className="text-xs font-light text-right">{pickupAddress}</p>
            </div>
          </div>
        )}
        {hydrated && fulfillmentType === 1 && pickupNote && (
          <div>
            <div className={`${styles.flex} ${styles.review_context}`}>
              <p className="text-sm">Note:</p>
              <p className="text-xs font-light text-right">{pickupNote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderReview;
