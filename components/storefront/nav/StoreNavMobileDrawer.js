import React from "react";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";

function StoreNavMobileDrawer({ state, toggleDrawer }) {
	return (
		<Drawer
			anchor={"bottom"}
			open={state["bottom"]}
			onClose={toggleDrawer("bottom", false)}
		>
			<button onClick={toggleDrawer("bottom", false)}>
				<Link href="/account/my-shop">My shop</Link>
			</button>
			<button onClick={toggleDrawer("bottom", false)}>
				<Link href="/account/my-shop/availability">Availability</Link>
			</button>
			<button onClick={toggleDrawer("bottom", false)}>
				<Link href="/account/my-shop/fulfillment">Fulfillment</Link>
			</button>
			<button onClick={toggleDrawer("bottom", false)}>
				<Link href="/account/my-shop/payments">Payments</Link>
			</button>
		</Drawer>
	);
}

export default StoreNavMobileDrawer;
