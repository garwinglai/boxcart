import React, { useState } from "react";
import styles from "@/styles/components/orders/order-grid-row-history.module.css";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import OrderCard from "./OrderCard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import order_icon from "@/public/images/icons/order_icon.png";
import Image from "next/image";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function OrderGridRowHistory({
  status,
  order,
  payStatus,
  getAllHistoryOrders,
  handleOpenSnackbar,
}) {
  const {
    fulfillmentDisplay,
    deliveryAddress,
    totalItemsOrdered,
    totalDisplay,
    fulfillmentType,
    requireOrderDate,
    requireOrderTime,
    orderForDateDisplay,
    orderForTimeDisplay,
    orderId,
    createdAt,
    id,
    customer,
    stripeOrderId,
    paymentMethod,
    accountId,
    totalPenny,
    totalAfterAllFeesDisplay,
  } = order;

  const { name, email, phoneNum } = customer;

  const [orderStatus, setOrderStatus] = useState(status);
  const [paymentStatus, setPaymentStatus] = useState(payStatus);

  const orderedOn = new Date(createdAt).toLocaleDateString("en-US");

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const handleChangeOrderStatus = (event) => {
    const { value } = event.target;
    setOrderStatus(value);

    updateOrderStatus(value);
  };

  const handleChangePayStatus = (event) => {
    const { value } = event.target;
    setPaymentStatus(value);

    updatePayStatus(value);
  };

  const updateOrderStatus = async (value) => {
    const updatedOrderStatus = value;
    const orderData = {
      id,
      orderStatus: updatedOrderStatus,
    };

    const udpateStatusAPI = await fetch(
      "/api/private/orders/updateOrderStatus",
      {
        method: "POST",
        body: JSON.stringify(orderData),
      }
    );

    const res = await udpateStatusAPI.json();
    const responseStatus = udpateStatusAPI.status;

    if (responseStatus === 200) {
      await getAllHistoryOrders();
      if (updatedOrderStatus === "pending") {
        handleOpenSnackbar("Moved to pending.");
      }

      if (updatedOrderStatus !== "completed" && paymentStatus === "paid") {
        decrementRevenue(totalPenny, accountId, paymentMethod);
      }

      if (updatedOrderStatus === "completed" && paymentStatus === "paid") {
        createOrUpdateRevenue(totalPenny, accountId, paymentMethod);
      }
    } else {
      // TODO: Error updating order status - revert to previous for UI
    }
  };

  const updatePayStatus = async (value) => {
    const paymentStatus = value;
    const orderData = {
      id,
      paymentStatus,
    };

    const udpateStatusAPI = await fetch(
      "/api/private/orders/update-payment-status",
      {
        method: "POST",
        body: JSON.stringify(orderData),
      }
    );

    const res = await udpateStatusAPI.json();
    const responseStatus = udpateStatusAPI.status;

    if (responseStatus === 200) {
      if (paymentStatus === "paid" && orderStatus === "completed") {
        createOrUpdateRevenue(totalPenny, accountId, paymentMethod);
      }

      if (paymentStatus !== "paid" && orderStatus === "completed") {
        decrementRevenue(totalPenny, accountId, paymentMethod);
      }

      // TODO: show snackbar of success?
    } else {
      // TODO: Error updating order status - revert to previous for UI
    }
  };

  const createOrUpdateRevenue = async (
    totalPenny,
    accountId,
    paymentMethod
  ) => {
    const revenueData = {
      accountId,
      totalPenny,
      paymentMethod,
    };

    const createOrUpdateApi = "/api/private/revenue/create-or-increment";
    const res = await fetch(createOrUpdateApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(revenueData),
    });
    const data = res.json();
    // TODO: log error to db
  };

  const decrementRevenue = async (totalPenny, accountId, paymentMethod) => {
    const revenueData = {
      accountId,
      totalPenny,
      paymentMethod,
    };

    const createOrUpdateApi = "/api/private/revenue/decrement";
    const res = await fetch(createOrUpdateApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(revenueData),
    });
    const data = res.json();
    // TODO: log error to db
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <tr className={`${styles.table_row}`}>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs text-ellipsis w-2/3 whitespace-nowrap overflow-hidden">
          {orderId}
        </p>
      </td>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">{orderedOn}</p>
      </td>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        {requireOrderDate ? (
          <p className="text-xs">
            {orderForDateDisplay ? orderForDateDisplay : "-"}
          </p>
        ) : (
          <p className="text-xs">-</p>
        )}
      </td>
      <td
        className={`${styles.table_data} ${styles.black_text}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">{name}</p>
      </td>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">{totalItemsOrdered} Items</p>
      </td>
      <td
        className={`${styles.table_data} ${styles.black_text}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">{totalAfterAllFeesDisplay}</p>
      </td>

      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">Delivery</p>
      </td>
      <td className={`${styles.table_data} ${styles.action}`}>
        <Select
          size="small"
          autoWidth
          id="select-order-status"
          // variant="outline"
          sx={{
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
          }}
          value={paymentStatus}
          onChange={handleChangePayStatus}
        >
          <MenuItem value="paid">
            <div className={`${styles.status_text} ${styles.accepted_text}`}>
              <p>paid</p>
            </div>
          </MenuItem>
          <MenuItem value="unpaid">
            <div className={`${styles.status_text} ${styles.pending_text}`}>
              <p>unpaid</p>
            </div>
          </MenuItem>
          <MenuItem value="processing">
            <div className={`${styles.status_text} ${styles.processing_text}`}>
              <p>processing</p>
            </div>
          </MenuItem>
          <MenuItem value="failed">
            <div className={`${styles.status_text} ${styles.error_text}`}>
              <p>failed</p>
            </div>
          </MenuItem>
          <MenuItem value="error">
            <div className={`${styles.status_text} ${styles.error_text}`}>
              <p>error</p>
            </div>
          </MenuItem>
          <MenuItem value="refunded">
            <div className={`${styles.status_text} ${styles.canceled_text}`}>
              <p>refunded</p>
            </div>
          </MenuItem>
          <MenuItem value="canceled">
            <div className={`${styles.status_text} ${styles.canceled_text}`}>
              <p>canceled</p>
            </div>
          </MenuItem>
        </Select>
      </td>
      <td className={`${styles.table_data}`}>
        <Select
          size="small"
          autoWidth
          id="select-order-status"
          // variant="standard"
          sx={{
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
          }}
          value={orderStatus}
          onChange={handleChangeOrderStatus}
        >
          <MenuItem value="pending">
            <div className={` ${styles.status_text} ${styles.pending_text}`}>
              <p>pending</p>
            </div>
          </MenuItem>
          <MenuItem value="completed">
            <div className={` ${styles.status_text} ${styles.completed_text}`}>
              <p>completed</p>
            </div>
          </MenuItem>
          <MenuItem value="canceled">
            <div className={` ${styles.status_text} ${styles.canceled_text}`}>
              <p>canceled</p>
            </div>
          </MenuItem>
        </Select>
      </td>

      <td className={`${styles.table_data} ${styles.view_more_btn}`}>
        <IconButton onClick={toggleDrawer("right", true)}>
          <OpenInFullIcon fontSize="small" color="disabled" />
        </IconButton>
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          <div className="pb-4 overflow-scroll h-full w-screen md:w-[60vw] lg:w-[45vw] xl:w-[35vw] bg-gray-50 ">
            <div className={`${styles.flex} ${styles.order_drawer_title_box}`}>
              <div
                className={`${styles.flex} ${styles.order_drawer_title_group}`}
              >
                <Image
                  src={order_icon}
                  alt="order detail icon"
                  className={`${styles.order_icon_image}`}
                />
                <h2>Order details:</h2>
              </div>
              <button
                className={`${styles.flex} ${styles.close_btn_group}`}
                onClick={toggleDrawer("right", false)}
              >
                <ChevronLeftIcon />
                <p>close</p>
              </button>
            </div>
            <OrderCard
              status={orderStatus}
              payStatus={payStatus}
              isDesktop={true}
              isHistory={true}
              isBusiness={true}
              isOrderHistory={true}
              order={order}
              getAllHistoryOrders={getAllHistoryOrders}
              handleOpenSnackbar={handleOpenSnackbar}
            />
          </div>
        </Drawer>
      </td>
    </tr>
  );
}

export default OrderGridRowHistory;
