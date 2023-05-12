import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import styles from "../../../styles/components/storefront/cart/cart.module.css";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Badge from "@mui/material/Badge";
import CartItem from "./CartItem";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import OrderReview from "./OrderReview";
import OrderSubtotal from "./OrderSubtotal";

function Cart() {
	const [isCartOpenBottom, setIsCartOpenBottom] = useState(false);
	const [isCartOpenRight, setIsCartOpenRight] = useState(false);
	const [anchor, setAnchor] = useState("bottom");
	const [exampleCartItems, setExampleCartItems] = useState([1, 2]);
	const [isLoading, setIsLoading] = useState(false);

	const route = useRouter();

	function toggleDrawerBottom() {
		setIsCartOpenBottom((prev) => !prev);
		setAnchor("bottom");
	}

	function toggleDrawerRight() {
		setIsCartOpenRight((prev) => !prev);
		setAnchor("right");
	}

	function handleCheckout(e) {
		console.log("clicked");
		setIsLoading(true);
		route.push("/checkout");
	}

	function mobileCart() {
		return (
			<div className={`${styles.cart_button_box} ${styles.cart_button_mobile}`}>
				<button
					onClick={toggleDrawerBottom}
					className={`${styles.cart_button} ${styles.flex}`}
				>
					<Badge badgeContent={4} color="primary">
						<ShoppingCartOutlinedIcon sx={{ color: "var(--black)" }} />
					</Badge>
				</button>

				<Drawer
					anchor={anchor}
					open={isCartOpenBottom}
					onClose={toggleDrawerBottom}
				>
					<div className={`${styles.cart_header_box} ${styles.flex}`}>
						<h2>My Cart</h2>
						<IconButton onClick={toggleDrawerBottom}>
							<CloseIcon color="primary" />
						</IconButton>
					</div>
					<div className={`${styles.flexCol} ${styles.cart_review_box}`}>
						<h2>Items</h2>
						{exampleCartItems.map((item, idx) => (
							<CartItem key={idx} />
						))}
						<div className={`${styles.review_box}`}>
							<OrderReview />
						</div>
						<div className={`${styles.subtotal_box}`}>
							<OrderSubtotal />
						</div>

						<div className={`${styles.checkout_button_box}`}>
							<button
								onClick={handleCheckout}
								className={`${styles.checkout_btn}`}
								disabled={isLoading ? true : false}
							>
								{isLoading ? `Checking out ...` : "Checkout"}
							</button>
						</div>
					</div>
				</Drawer>
			</div>
		);
	}

	function desktopCart() {
		return (
			<div
				className={`${styles.cart_button_box} ${styles.cart_button_desktop}`}
			>
				<button
					onClick={toggleDrawerRight}
					className={`${styles.cart_button} ${styles.flex}`}
				>
					<RemoveShoppingCartOutlinedIcon />
					Cart item (0)
				</button>
				<Drawer
					anchor={anchor}
					open={isCartOpenRight}
					onClose={toggleDrawerRight}
				>
					<h1>Cart Item</h1>
					<h1>Cart Item</h1>
					<h1>Cart Item</h1>
					<h1>Cart Item</h1>
					<h1>Cart Item</h1>
					<h1>Cart Item</h1>
					<h1>Cart Item</h1>
				</Drawer>
			</div>
		);
	}

	return (
		<React.Fragment>
			{mobileCart()} {desktopCart()}
		</React.Fragment>
	);
}

export default Cart;
