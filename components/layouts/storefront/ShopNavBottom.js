import React, { useState } from "react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Badge from "@mui/material/Badge";
import { IconButton } from "@mui/material";
import Link from "next/link";
import OrdersNavMobileDrawer from "@/components/app/nav/OrdersNavMobileDrawer";
import StoreNavMobileDrawer from "@/components/app/nav/StoreNavMobileDrawer";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import InventoryNavMobileDrawer from "@/components/app/nav/InventoryNavMobileDrawer";

function ShopNavBottom({ mobilePageRoute }) {
  const [inventoryDrawer, setInventoryDrawer] = useState({ bottom: false });
  const [ordersDrawer, setOrdersDrawer] = useState({ bottom: false });
  const [storeDrawer, setStoreDrawer] = useState({ bottom: false });

  const toggleDrawerInventory = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setInventoryDrawer({ ...inventoryDrawer, [anchor]: open });
  };

  const toggleDrawerOrders = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOrdersDrawer({ ...ordersDrawer, [anchor]: open });
  };

  const toggleDrawerStore = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setStoreDrawer({ ...storeDrawer, [anchor]: open });
  };

  return (
    <nav className="px-4 pb-1 flex w-full justify-between fixed bottom-0 bg-[color:var(--white)] border-t border-[color:var(--gray-light)] md:hidden z-10">
      <Link href="/app/account/chat">
        <div className="flex flex-col items-center">
          <IconButton>
            <Badge
              color="secondary"
              variant="dot"
              overlap="circular"
              invisible={mobilePageRoute !== "chat"}
            >
              <ChatBubbleOutlineOutlinedIcon
                sx={{
                  color:
                    mobilePageRoute === "chat"
                      ? "var(--black-design-extralight)}"
                      : "var(--gray)",
                }}
              />
            </Badge>
          </IconButton>
          <p
            className={`${
              mobilePageRoute === "chat"
                ? "text-[color:var(--black-design-extralight)] font-normal"
                : "text-[color:var(--gray)] font-extralight"
            } text-xs  -mt-2`}
          >
            Chat
          </p>
        </div>
      </Link>

      <div className="flex flex-col items-center">
        <IconButton onClick={toggleDrawerInventory("bottom", true)}>
          <Badge
            color="secondary"
            variant="dot"
            overlap="circular"
            invisible={
              mobilePageRoute === "products" ||
              mobilePageRoute === "categories" ||
              mobilePageRoute === "digital-products" ||
              mobilePageRoute === "tags"
                ? false
                : true
            }
          >
            <Inventory2OutlinedIcon
              sx={{
                color:
                  mobilePageRoute === "products" ||
                  mobilePageRoute === "categories" ||
                  mobilePageRoute === "digital-products" ||
                  mobilePageRoute === "tags"
                    ? "var(--black-design-extralight)}"
                    : "var(--gray)",
              }}
            />
          </Badge>
        </IconButton>
        <p
          className={`${
            mobilePageRoute === "products" ||
            mobilePageRoute === "categories" ||
            mobilePageRoute === "digital-products" ||
            mobilePageRoute === "tags"
              ? "text-[color:var(--black-design-extralight)] font-normal"
              : "text-[color:var(--gray)] font-extralight"
          } text-xs  -mt-2`}
        >
          Inventory
        </p>
        <InventoryNavMobileDrawer
          state={inventoryDrawer}
          toggleDrawer={toggleDrawerInventory}
          mobilePageRoute={mobilePageRoute}
        />
      </div>

      <div className="flex flex-col items-center">
        <IconButton onClick={toggleDrawerOrders("bottom", true)}>
          <Badge
            color="secondary"
            variant="dot"
            overlap="circular"
            invisible={
              mobilePageRoute === "live"
                ? false
                : mobilePageRoute === "history"
                ? false
                : true
            }
          >
            <LocalOfferOutlinedIcon
              sx={{
                color:
                  mobilePageRoute === "live" || mobilePageRoute === "history"
                    ? "var(--black-design-extralight)}"
                    : "var(--gray)",
              }}
            />
          </Badge>
        </IconButton>
        <p
          className={`${
            mobilePageRoute === "live" || mobilePageRoute === "history"
              ? "text-[color:var(--black-design-extralight)] font-normal"
              : "text-[color:var(--gray)] font-extralight"
          } text-xs -mt-2`}
        >
          orders
        </p>
        <OrdersNavMobileDrawer
          state={ordersDrawer}
          toggleDrawer={toggleDrawerOrders}
          mobilePageRoute={mobilePageRoute}
        />
      </div>
      <div className="flex flex-col items-center">
        <IconButton onClick={toggleDrawerStore("bottom", true)}>
          <Badge
            color="secondary"
            variant="dot"
            overlap="circular"
            invisible={
              mobilePageRoute === "my-shop"
                ? false
                : mobilePageRoute === "availability"
                ? false
                : mobilePageRoute === "fulfillment"
                ? false
                : mobilePageRoute === "payments"
                ? false
                : true
            }
          >
            <SettingsOutlinedIcon
              sx={{
                color:
                  mobilePageRoute === "my-shop" ||
                  mobilePageRoute === "availability" ||
                  mobilePageRoute === "fulfillment" ||
                  mobilePageRoute === "payments"
                    ? "var(--black-design-extralight)}"
                    : "var(--gray)",
              }}
            />
          </Badge>
        </IconButton>
        <p
          className={`${
            mobilePageRoute === "my-shop" ||
            mobilePageRoute === "availability" ||
            mobilePageRoute === "fulfillment" ||
            mobilePageRoute === "payments"
              ? "text-[color:var(--black-design-extralight)] font-normal"
              : "text-[color:var(--gray)] font-extralight"
          } text-xs  -mt-2`}
        >
          store
        </p>
        <StoreNavMobileDrawer
          state={storeDrawer}
          toggleDrawer={toggleDrawerStore}
          mobilePageRoute={mobilePageRoute}
        />
      </div>
    </nav>
  );
}

export default ShopNavBottom;
