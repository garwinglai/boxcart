import React, { useState } from "react";
import ShopNavTop from "./ShopNavTop";

function ShopLayout({ children }) {
  return (
    <div>
      <ShopNavTop />
      <main>{children}</main>
    </div>
  );
}

export default ShopLayout;
