import React from "react";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";

function OrdersNavMobileDrawer({ state, toggleDrawer }) {
	return (
		<Drawer
			anchor={"bottom"}
			open={state["bottom"]}
			onClose={toggleDrawer("bottom", false)}
		>
			<button onClick={toggleDrawer("bottom", false)}>
				<Link href="/account/orders/live">Live</Link>
			</button>
			<button onClick={toggleDrawer("bottom", false)}>
				<Link href="/account/orders/history">History</Link>
			</button>
		</Drawer>
	);
}

export default OrdersNavMobileDrawer;
