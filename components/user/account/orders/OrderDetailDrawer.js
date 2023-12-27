import React from "react";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import order_icon from "@/public/images/icons/order_icon.png";
import Image from "next/image";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import HomeIcon from "@mui/icons-material/Home";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import OrderReview from "@/components/storefront/cart/OrderReview";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import CartItem from "@/components/storefront/cart/CartItem";
import OrderSubtotal from "@/components/storefront/cart/OrderSubtotal";

function OrderDetailDrawer({
  isDrawerOpen,
  toggleDrawer,
  order,
  isDesktop,
  isShopper,
}) {
  const {
    paymentMethod,
    stripeOrderId,
    orderId,
    fulfillmentType,
    fulfillmentDisplay,
    deliveryAddress,
    createdAt,
    requireOrderDate,
    orderForDateDisplay,
    requireOrderTime,
    orderForTimeDisplay,
    totalDisplay,
    account,
    orderItems,
  } = order;

  const { businessName, email, fullDomain, logoImage } = account;
  const orderedOn = new Date(createdAt).toLocaleDateString("en-US");

  return (
    <Drawer
      anchor={"right"}
      open={isDrawerOpen["right"]}
      onClose={toggleDrawer("right", false)}
    >
      <div className="pb-4 overflow-scroll h-full w-screen md:w-[60vw] lg:w-[45vw] xl:w-[35vw] bg-gray-50 ">
        <div className="flex items-center justify-between w-full p-2">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image src={order_icon} alt="order icon" fill />
            </div>
            <h2>Order details:</h2>
          </div>
          <IconButton onClick={toggleDrawer("right", false)}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="m-2 bg-white rounded shadow">
          <div
            className={`flex items-center justify-between px-2 border-b mb-2 py-2 md:px-4`}
          >
            <span className="flex gap-2 items-center">
              <h4 className="">ID:</h4>
              <p className="font-extralight text-xs">
                {paymentMethod === "card" ? stripeOrderId : orderId}
              </p>
            </span>
          </div>
        </div>
        <div className="flex gap-2 m-2 p-2 bg-white rounded shadow md:p-4">
          <div className="flex flex-col gap-1 flex-grow">
            <div className="flex items-center gap-2">
              <StorefrontOutlinedIcon fontSize="small" color="disabled" />
              <p className="break-words text-xs">{businessName}</p>
            </div>
            <div className="flex items-center gap-2">
              <EmailOutlinedIcon fontSize="small" color="disabled" />
              <p className="break-words text-xs">{email}</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageOutlinedIcon fontSize="small" color="disabled" />
              <p className="break-words text-xs">{fullDomain}</p>
            </div>
            <div className="flex items-center gap-2">
              <TodayOutlinedIcon fontSize="small" color="disabled" />
              <p className="text-xs break-words">Order date: {orderedOn}</p>
            </div>
            {requireOrderDate && orderForDateDisplay && (
              <div className="flex items-center gap-2">
                <EventAvailableIcon fontSize="small" color="disabled" />
                <p className="break-words text-xs">
                  Order for: {requireOrderDate && orderForDateDisplay}
                  {requireOrderTime && ` @ ` + orderForTimeDisplay}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 flex-grow">
            <div className="flex items-center gap-2">
              <DeliveryDiningIcon fontSize="small" color="disabled" />
              <p className="text-xs break-words">{fulfillmentDisplay}</p>
            </div>
            {fulfillmentType === 0 && (
              <div className="flex items-center gap-2">
                <HomeIcon fontSize="small" color="disabled" />
                <p className="text-xs break-words">{deliveryAddress}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <AccountBalanceOutlinedIcon fontSize="small" color="disabled" />
              <p className="text-xs break-words">{paymentMethod} pay</p>
            </div>
            <div className="flex items-center gap-2">
              <PaidOutlinedIcon fontSize="small" color="disabled" />
              <p className="text-xs break-words">{totalDisplay}</p>
            </div>
          </div>
        </div>
        <div className="m-2 p-2 bg-white rounded shadow md:p-4">
          <h3 className="text-base">Items:</h3>
          {orderItems.map((item, idx) => {
            const { id } = item;

            return (
              <CartItem
                key={id}
                cartItem={item}
                isDesktop={isDesktop}
                isBusiness={true}
                idx={idx}
                isShopper={isShopper}
              />
            );
          })}
        </div>
        <div className="m-2 p-2 bg-white rounded shadow md:p-4">
          <OrderReview isBusiness={true} order={order} />
        </div>
        <div className=" m-2 p-2 bg-white rounded shadow md:p-4">
          <OrderSubtotal isBusiness={true} order={order} />
        </div>
      </div>
    </Drawer>
  );
}

export default OrderDetailDrawer;
