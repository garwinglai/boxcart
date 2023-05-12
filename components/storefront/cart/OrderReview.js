import React from "react";
import styles from "../../../styles/components/storefront/cart/review.module.css";

function OrderReview() {
	return (
		<div className={`${styles.review_box}`}>
			<h2>Order Details:</h2>
			<div className={`${styles.reivew_content_box} ${styles.flexCol}`}>
				<div className={`${styles.flex} ${styles.review_context}`}>
					<p>
						<b>For date:</b>
					</p>
					<p className={`${styles.review_context_value}`}>
						Feb 23, 2023 @ 2:45 pm
					</p>
				</div>
				<div className={`${styles.flex} ${styles.review_context}`}>
					<p>
						<b>Fulfillment:</b>
					</p>
					<p className={`${styles.review_context_value}`}>Delivery</p>
				</div>
				<div className={`${styles.flex} ${styles.review_context}`}>
					<p>
						<b>Delivery address:</b>
					</p>
					<p className={`${styles.review_context_value}`}>
						123 W camino real ave, arcadia CA 91004
					</p>
				</div>
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
