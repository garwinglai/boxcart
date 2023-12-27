import React, { useState } from "react";
import { IconButton } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import OrderDetailDrawer from "./OrderDetailDrawer";

function OrderGridRowDesktop({ order, idx }) {
  const { paymentMethod, totalDisplay, fulfillmentDisplay } = order;
  const isEven = idx % 2 === 0;
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  const {
    account: { businessName },
  } = order;

  const [isDrawerOpen, setIsDrawerOpen] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsDrawerOpen({ ...isDrawerOpen, [anchor]: open });
  };
  return (
    <React.Fragment>
      <tr className="contents">
        <td
          onClick={toggleDrawer("right", true)}
          className={`flex items-center justify-center rounded-s-lg  hover:cursor-pointer  ${
            isEven ? "bg-blue-50" : "bg-white"
          }`}
        >
          <p className="text-xs text-ellipsis w-2/3 overflow-hidden whitespace-nowrap">
            {order.orderId}
          </p>
        </td>
        <td
          onClick={toggleDrawer("right", true)}
          className={`flex justify-center items-center  hover:cursor-pointer  ${
            isEven ? "bg-blue-50" : "bg-white"
          }`}
        >
          <p className="text-xs">{orderDate}</p>
        </td>
        <td
          onClick={toggleDrawer("right", true)}
          className={`flex justify-center items-center  hover:cursor-pointer  ${
            isEven ? "bg-blue-50" : "bg-white"
          }`}
        >
          <p className="text-xs">{businessName}</p>
        </td>
        <td
          onClick={toggleDrawer("right", true)}
          className={`flex justify-center items-center  hover:cursor-pointer  ${
            isEven ? "bg-blue-50" : "bg-white"
          }`}
        >
          <p className="text-xs">{paymentMethod}</p>
        </td>
        <td
          onClick={toggleDrawer("right", true)}
          className={`flex justify-center items-center hover:cursor-pointer   ${
            isEven ? "bg-blue-50" : "bg-white"
          }`}
        >
          <p className="text-xs">{fulfillmentDisplay}</p>
        </td>
        <td
          onClick={toggleDrawer("right", true)}
          className={`flex justify-center items-center hover:cursor-pointer   ${
            isEven ? "bg-blue-50" : "bg-white"
          }`}
        >
          <p className="text-xs">{orderDate}</p>
        </td>
        <td
          onClick={toggleDrawer("right", true)}
          className={`flex justify-center items-center hover:cursor-pointer   ${
            isEven ? "bg-blue-50" : "bg-white"
          }`}
        >
          <p className="text-xs">{totalDisplay}</p>
        </td>
        <td
          onClick={toggleDrawer("right", true)}
          className={`flex justify-center items-center hover:cursor-pointer   rounded-e-lg ${
            isEven ? "bg-blue-50" : "bg-white"
          }`}
        >
          <IconButton onClick={toggleDrawer("right", true)}>
            <OpenInFullIcon sx={{ width: "1rem" }} />
          </IconButton>
        </td>
      </tr>
      <OrderDetailDrawer
        toggleDrawer={toggleDrawer}
        isDrawerOpen={isDrawerOpen}
        order={order}
        isDesktop={true}
        isShopper={true}
      />
    </React.Fragment>
  );
}

export default OrderGridRowDesktop;
