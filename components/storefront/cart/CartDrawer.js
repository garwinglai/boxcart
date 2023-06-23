import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";

import CartComponent from "./CartComponent";

function CartDrawer({ toggleDrawer, anchor, isCartOpenRight }) {
	const [exampleCartItems, setExampleCartItems] = useState([1,2]);

	return (
		<Drawer anchor={anchor} open={isCartOpenRight} onClose={toggleDrawer}>
			<CartComponent toggleDrawer={toggleDrawer} cartItems={exampleCartItems} />
		</Drawer>
	);
}

export default CartDrawer;
