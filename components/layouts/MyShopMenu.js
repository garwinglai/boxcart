import React, { useState } from "react";
import styles from "@/styles/components/layouts/my-shop-menu.module.css";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Link from "next/link";

function MyShopMenu({ pageTitle }) {
	console.log(pageTitle);

	return (
		<MenuList
			className={`${styles.mui_menu_list_group} ${styles.flex} fixed top-0 z-50 md:shadow-md md:border-t md:border-[color:var(--gray-light)]`}
		>
			<Link href="/account/my-shop/profile">
				<MenuItem selected={pageTitle === "My Shop / Profile" ? true : false}>
					Profile
				</MenuItem>
			</Link>
			<Link href="/account/my-shop/products">
				<MenuItem selected={pageTitle === "My Shop / Products" ? true : false}>
					Products
				</MenuItem>
			</Link>
			<Link href="/account/my-shop/availability">
				<MenuItem
					selected={pageTitle === "My Shop / Availability" ? true : false}
				>
					Availability
				</MenuItem>
			</Link>
			<Link href="/account/my-shop/fulfillment">
				<MenuItem
					selected={pageTitle === "My Shop / Fulfillment" ? true : false}
				>
					Fulfillment
				</MenuItem>
			</Link>
			<Link href="/account/my-shop/payments">
				<MenuItem selected={pageTitle === "My Shop / Payments" ? true : false}>
					Payments
				</MenuItem>
			</Link>
		</MenuList>
	);
}

export default MyShopMenu;
