import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";

import CartComponent from "./CartComponent";

function CartDrawer({ toggleDrawer, anchor, isCartOpenRight, query }) {
  return (
    <Drawer anchor={anchor} open={isCartOpenRight} onClose={toggleDrawer}>
      <CartComponent toggleDrawer={toggleDrawer} query={query} />
    </Drawer>
  );
}

export default CartDrawer;
