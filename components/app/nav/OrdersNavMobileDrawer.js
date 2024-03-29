import React from "react";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";
import DrawerHeader from "../../global/drawers/DrawerHeader";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import HistoryIcon from "@mui/icons-material/History";
import SellIcon from "@mui/icons-material/Sell";

function OrdersNavMobileDrawer({ state, toggleDrawer, mobilePageRoute }) {
  return (
    <Drawer
      anchor={"bottom"}
      open={state["bottom"]}
      onClose={toggleDrawer("bottom", false)}
    >
      <DrawerHeader
        title={"Order Menu"}
        icon={<LocalOfferOutlinedIcon />}
        toggleDrawer={toggleDrawer}
      />
      <div className="flex flex-col p-4 gap-2">
        <Link
          href="/app/account/orders/live"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "live" && "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <SellIcon fontSize="small" />
            Live orders
          </span>
        </Link>
        <Link
          href="/app/account/orders/history"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "history" && "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <HistoryIcon fontSize="small" />
            Order history
          </span>
        </Link>
      </div>
    </Drawer>
  );
}

export default OrdersNavMobileDrawer;
