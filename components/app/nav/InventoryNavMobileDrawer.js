import React from "react";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DrawerHeader from "../../global/drawers/DrawerHeader";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import EventIcon from "@mui/icons-material/Event";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import PaymentIcon from "@mui/icons-material/Payment";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryIcon from "@mui/icons-material/Category";
import SdStorageIcon from "@mui/icons-material/SdStorage";
import StyleIcon from "@mui/icons-material/Style";
import ClassIcon from "@mui/icons-material/Class";

function InventoryNavMobileDrawer({ state, toggleDrawer, mobilePageRoute }) {
  return (
    <Drawer
      anchor={"bottom"}
      open={state["bottom"]}
      onClose={toggleDrawer("bottom", false)}
    >
      <DrawerHeader
        title={"Inventory Menu"}
        icon={<Inventory2OutlinedIcon />}
        toggleDrawer={toggleDrawer}
      />
      <div className="flex flex-col p-4 gap-2">
        <Link
          href="/app/account/inventory/products"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "products" && "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <CategoryIcon fontSize="small" />
            Products
          </span>
        </Link>
        <Link
          href="/app/account/inventory/digital-products"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "digital-products" &&
            "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <SdStorageIcon fontSize="small" />
            Digital products
          </span>
        </Link>
        <Link
          href="/app/account/inventory/categories"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "categories" &&
            "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <StyleIcon fontSize="small" />
            Categories
          </span>
        </Link>
        <Link
          href="/app/account/inventory/tags"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "tags" && "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <ClassIcon fontSize="small" />
            Tags
          </span>
        </Link>
      </div>
    </Drawer>
  );
}

export default InventoryNavMobileDrawer;
