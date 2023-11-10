import React, { useState } from "react";
import styles from "@/styles/components/orders/order-grid-row.module.css";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import OrderCard from "./OrderCard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import order_icon from "@/public/images/icons/order_icon.png";
import Image from "next/image";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function OrderGridRow({
  status,
  order,
  getOrders,
  payStatus,
  handleOpenSnackbar,
}) {
  const {
    customerEmail,
    customerPhone,
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
  } = order;

  const { name } = customer;

  const orderedOn = new Date(createdAt).toLocaleDateString("en-US");

  const [orderStatus, setOrderStatus] = useState(status);
  const [paymentStatus, setPaymentStatus] = useState(payStatus);
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
    const orderStatus = value;
    const orderData = {
      id,
      orderStatus,
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
      await getOrders();
      handleOpenSnackbar("Moved to history.");
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
      await getOrders();
    } else {
      // TODO: Error updating order status - revert to previous for UI
    }
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

  const handleRowClick = () => {
    toggleDrawer("right", true);
  };

  const handleAction = () => {};

  return (
    <tr className={`${styles.table_row}`}>
      <td
        className={`${styles.table_data}`}
        onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">{id}</p>
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
        <p className="text-xs">5.23.2023</p>
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
        <p className="text-xs">{totalDisplay}</p>
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
      <td className={`${styles.table_data} ${styles.action}`}>
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
            <div className={`${styles.status_text} ${styles.pending_text}`}>
              <p>pending</p>
            </div>
          </MenuItem>
          <MenuItem value="completed">
            <div className={`${styles.status_text} ${styles.completed_text}`}>
              <p>completed</p>
            </div>
          </MenuItem>
          <MenuItem value="canceled">
            <div className={`${styles.status_text} ${styles.canceled_text}`}>
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
          <div className={`${styles.drawer_box}`}>
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
              status={status}
              payStatus={payStatus}
              isDesktop={true}
              isBusiness={true}
              isHistory={false}
              order={order}
              getOrders={getOrders}
              handleOpenSnackbar={handleOpenSnackbar}
            />
          </div>
        </Drawer>
      </td>
    </tr>
  );
}

export default OrderGridRow;

// * status buttons
// {status === "pending" && (
//   <div className="w-1/2">
//     <ButtonSecondary name="Decline" />
//   </div>
// )}
// {status === "pending" && (
//   <div className="w-1/2">
//     <ButtonPrimary name="Accept" />
//   </div>
// )}
// {/* Split */}
// {status === "accepted" && (
//   <div className="w-1/2">
//     <ButtonFourth name="Cancel" />
//   </div>
// )}
// {status === "accepted" && (
//   <div className="w-1/2">
//     <ButtonThird name="Complete" />
//   </div>
// )}
