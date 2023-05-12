import React, { useState } from "react";
import styles from "../../../styles/site/checkout.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import OrderReview from "@/components/storefront/cart/OrderReview";
import OrderSubtotal from "@/components/storefront/cart/OrderSubtotal";

function Checkout() {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	function handleBack(e) {
		router.back();
	}

	function handleSubmitOrder(e) {
		e.preventDefault();
		setIsLoading(true);
		console.log("order submit clicked");
		router.push("/order-submitted/123");
	}

	return (
		<div className={`${styles.checkbout_box}`}>
			<div className={`${styles.header} ${styles.flex}`}>
				<IconButton onClick={handleBack}>
					<ArrowBackIosIcon color="primary" />
				</IconButton>
				<div className={`${styles.flex} ${styles.checkout_word_box}`}>
					<h2>Checkout</h2>
					<ShoppingCartCheckoutIcon color="primary" />
				</div>
			</div>
			<form
				onSubmit={handleSubmitOrder}
				className={`${styles.checkout_content_box} ${styles.flexCol}`}
			>
				<div
					className={`${styles.info_box} ${styles.customer_info_box} ${styles.flexCol}`}
				>
					<h2>Customer Info:</h2>
					<div className={`${styles.names_box} ${styles.flex}`}>
						<TextField
							id="outlined-basic"
							label="First name"
							variant="standard"
							required
						/>
						<TextField
							id="outlined-basic"
							label="Last name"
							variant="standard"
							required
						/>
					</div>
					<TextField
						id="outlined-basic"
						label="Email"
						variant="standard"
						required
						fullWidth
					/>
					<TextField
						id="outlined-basic"
						label="Phone (optional)"
						variant="standard"
						fullWidth
					/>
				</div>
				<div className={`${styles.info_box} ${styles.payment_info_box}`}>
					<h2>Payment:</h2>
					{/* //TODO: Depending on payment type, show different inputs */}
				</div>
				<div className={`${styles.info_box} ${styles.review_box}`}>
					<OrderReview />
				</div>
				<div className={`${styles.info_box} ${styles.total_box}`}>
					<OrderSubtotal />
				</div>
				<div className={`${styles.submit_button_box}`}>
					<button
						disabled={isLoading ? true : false}
						className={`${styles.submit_order_button}`}
						type="submit"
					>
						{isLoading ? "Submitting order..." : "Submit Order"}
					</button>
				</div>
			</form>
		</div>
	);
}

export default Checkout;
