import React from "react";
import { products } from "@/helper/temp/tempData";
import ShopCard from "./ShopCard";
import styles from "@/styles/components/storefront/menus/shop-menu.module.css";

// TODO: Pull Products for Shop Menu

function ShopMenu({ isOwner }) {
	return (
		<div className="px-4">
			<h3 className="mb-4 font-light">All Products</h3>
			<div className={`${styles.shop_menu_box} ${styles.grid}`}>
				{products.map((item, idx) => (
					<ShopCard key={idx} product={item} isOwner={isOwner} />
				))}
			</div>
		</div>
	);
}

export default ShopMenu;
