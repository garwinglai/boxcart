import React from "react";
import ShopNavTop from "./ShopNavTop";
import ShopNavBottom from "./ShopNavBottom";

function ShopLayout({ children }) {
	return (
		<div>
			<ShopNavTop />
			<main className=" overflow-y-scroll">{children}</main>
		</div>
	);
}

export default ShopLayout;
