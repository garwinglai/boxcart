import React from "react";
import { products } from "@/helper/temp/tempData";
import ShopCard from "./ShopCard";
import styles from "@/styles/components/storefront/menus/shop-menu.module.css";

// TODO: Pull Products for Shop Menu

function ShopMenu({ isOwner }) {
	return (
		<div className="px-4 flex-grow pb-8">
			<h3 className="mb-4 font-light">All Products</h3>
			<div className=" grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3 xl:grid-cols-4">
				{products.map((item, idx) => (
					<ShopCard key={idx} product={item} isOwner={isOwner} />
				))}
			</div>
		</div>
	);
}

export default ShopMenu;
