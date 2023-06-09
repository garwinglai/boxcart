import React from "react";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";

function ProductsNavMobileDrawer({ state, toggleDrawer }) {
	return (
		<Drawer
			anchor={"bottom"}
			open={state["bottom"]}
			onClose={toggleDrawer("bottom", false)}
		>
			<button onClick={toggleDrawer("bottom", false)}>
				<Link href="/account/inventory/products">Products</Link>
			</button>
			<button onClick={toggleDrawer("bottom", false)}>
				<Link href="/account/inventory/category">Category</Link>
			</button>
		</Drawer>
	);
}

export default ProductsNavMobileDrawer;
