import React from "react";
import { products } from "@/helper/temp/tempData";
import ShopCard from "./ShopCard";
import styles from "@/styles/components/storefront/menus/shop-menu.module.css";

// TODO: Pull Products for Shop Menu

function ShopMenu() {
	return (
		<div className={`${styles.shop_menu_box} ${styles.flex}`}>
			{products.map((item, idx) => (
				<ShopCard key={idx} product={item} />
			))}
		</div>
	);
}

export default ShopMenu;
