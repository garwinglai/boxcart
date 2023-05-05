import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import styles from "../../styles/components/storefront/cart.module.css";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Badge from "@mui/material/Badge";

function Cart() {
	const [isCartOpenBottom, setIsCartOpenBottom] = useState(false);
	const [isCartOpenRight, setIsCartOpenRight] = useState(false);
	const [anchor, setAnchor] = useState("bottom");

	function toggleDrawerBottom() {
		setIsCartOpenBottom((prev) => !prev);
		setAnchor("bottom");
	}

	function toggleDrawerRight() {
		setIsCartOpenRight((prev) => !prev);
		setAnchor("right");
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
