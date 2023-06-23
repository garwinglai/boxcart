import React from "react";
import ShopNavTop from "./ShopNavTop";

function ShopLayout({ children }) {
	const test = "stusff";
	return (
		<div>
			<ShopNavTop />
			<main test={test}>{children}</main>
		</div>
	);
}

export default ShopLayout;
