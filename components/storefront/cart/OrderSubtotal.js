import React from "react";
import styles from "../../../styles/components/storefront/cart/subtotal.module.css";

function OrderSubtotal() {
	return (
		<div className={`${styles.order_subtotal_box}`}>
			<h2>Subtotal:</h2>
			<div className={`${styles.subtotal_box} ${styles.flex}`}>
				<div className={`${styles.flexCol} ${styles.subtotal_keys}`}>
					<p>
						<b>Subtotal:</b>
					</p>
					<p>
						<b>Tax & fees:</b>
					</p>
					<p>
						<b>Delivery:</b>
					</p>
					<p>
						<b>Total:</b>
					</p>
				</div>
				<div className={`${styles.flexCol} ${styles.subtotal_values}`}>
					<p>$5.89</p>
					<p>~</p>
					<p>~</p>
					<p>~</p>
				</div>
			</div>
		</div>
	);
}

export default OrderSubtotal;
