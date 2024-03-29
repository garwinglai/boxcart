import React from "react";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DrawerHeader from "../../global/drawers/DrawerHeader";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import EventIcon from "@mui/icons-material/Event";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import PaymentIcon from "@mui/icons-material/Payment";

function StoreNavMobileDrawer({ state, toggleDrawer, mobilePageRoute }) {
  return (
    <Drawer
      anchor={"bottom"}
      open={state["bottom"]}
      onClose={toggleDrawer("bottom", false)}
    >
      <DrawerHeader
        title={"Store Menu"}
        icon={<StorefrontOutlinedIcon />}
        toggleDrawer={toggleDrawer}
      />
      <div className="flex flex-col p-4 gap-2">
        <Link
          href="/app/account/my-shop"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "my-shop" && "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <LocalMallIcon fontSize="small" />
            My shop
          </span>
        </Link>
        <Link
          href="/app/account/my-shop/availability"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "availability" &&
            "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <EventIcon fontSize="small" />
            Availability
          </span>
        </Link>
        <Link
          href="/app/account/my-shop/fulfillment"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "fulfillment" &&
            "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <DeliveryDiningIcon fontSize="small" />
            Fulfillment
          </span>
        </Link>
        <Link
          href="/app/account/my-shop/payments"
          onClick={toggleDrawer("bottom", false)}
          className={`text-sm py-2 px-4 rounded hover:bg-[color:var(--primary-light)] active:bg-[color:var(--primary-light)] ${
            mobilePageRoute === "payments" && "bg-[color:var(--primary-light)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-start">
            <PaymentIcon fontSize="small" />
            Payments
          </span>
        </Link>
      </div>
    </Drawer>
  );
}

export default StoreNavMobileDrawer;
