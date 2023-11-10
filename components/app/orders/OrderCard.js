import React, { useRef, useState } from "react";
import styles from "@/styles/components/orders/order-card.module.css";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import { IconButton } from "@mui/material";
import CartItem from "../../storefront/cart/CartItem";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import OrderSubtotal from "../../storefront/cart/OrderSubtotal";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import HomeIcon from "@mui/icons-material/Home";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OrderReview from "@/components/storefront/cart/OrderReview";

function OrderCard({
  status,
  payStatus,
  isDesktop,
  isBusiness,
  order,
  isHistory,
  getOrders,
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
    orderItems,
    orderForDateDisplay,
    orderForTimeDisplay,
    orderId,
    createdAt,
    id,
    customer,
    stripeErrorMessage,
    stripeErrorType,
  } = order;

  const { name, email, phoneNum } = customer;
  const orderedOn = new Date(createdAt).toLocaleDateString("en-US");

  const [expanded, setExpanded] = useState(false);
  const [orderStatus, setOrderStatus] = useState(status);
  const [paymentStatus, setPaymentStatus] = useState(payStatus);

  const cardRef = useRef(null);

  const handleChange = (e, panel) => {
    setExpanded((prev) => !prev);
  };

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
      if (isHistory) {
        await getAllHistoryOrders();
        if (orderStatus === "pending") {
          handleOpenSnackbar("Moved to live.");
        }
      } else {
        await getOrders();
        handleOpenSnackbar("Moved to history.");
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
      await getOrders();
    } else {
      // TODO: Error updating order status - revert to previous for UI
    }
  };

  const handleFooterCloseCard = (e, panel) => {
    setExpanded((prev) => !prev);
    const cardPositionY = cardRef.current.offsetTop;

    window.scroll(0, cardPositionY - 180);
    // cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={cardRef} className={`${styles.card_box}`}>
      <div className={`${styles.card_summary_group}`}>
        <div className={`${styles.summary_header_group}`}>
          <div
            className={`flex items-center justify-between px-4 border-b mb-2 py-2`}
          >
            <span className="flex gap-2 items-center">
              <h4 className="">ID:</h4>
              <p className="font-extralight text-xs">{orderId}</p>
            </span>
            {!isDesktop && (
              <div className={`${styles.group_three}`}>
                <IconButton
                  id="panel1"
                  name="panel1"
                  onClick={(e) => handleChange(e, "panel1")}
                >
                  {expanded ? (
                    <p className="text-sm font-light text-red-600">close</p>
                  ) : (
                    <p className="text-sm font-light text-blue-600">View</p>
                  )}
                </IconButton>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
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
                <div
                  className={`${styles.status_text} ${styles.accepted_text}`}
                >
                  <p>paid</p>
                </div>
              </MenuItem>
              <MenuItem value="unpaid">
                <div className={`${styles.status_text} ${styles.pending_text}`}>
                  <p>unpaid</p>
                </div>
              </MenuItem>
              <MenuItem value="processing">
                <div
                  className={`${styles.status_text} ${styles.processing_text}`}
                >
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
                <div
                  className={`${styles.status_text} ${styles.canceled_text}`}
                >
                  <p>refunded</p>
                </div>
              </MenuItem>
              <MenuItem value="canceled">
                <div
                  className={`${styles.status_text} ${styles.canceled_text}`}
                >
                  <p>canceled</p>
                </div>
              </MenuItem>
            </Select>
            {stripeErrorMessage && (
              <p className="text-xs font-light text-[color:var(--error)]">
                ::{stripeErrorType} - {stripeErrorMessage}::
              </p>
            )}
          </div>
          <div className={`${styles.flex} ${styles.header_box}`}>
            <div className={`${styles.group_two}`}>
              {/* <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <Grid3x3Icon fontSize="small" color="disabled" />
                <p>
                  Id: <span className="break-all">{orderId}</span>
                </p>
              </div> */}
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <TodayOutlinedIcon fontSize="small" color="disabled" />
                <p>Order date: {orderedOn}</p>
              </div>
              {requireOrderDate && (
                <div className={`${styles.flex} ${styles.info_icon_group}`}>
                  <EventAvailableIcon fontSize="small" color="disabled" />
                  <p className="break-normal">
                    Order for: {requireOrderDate && orderForDateDisplay}
                    {requireOrderTime && ` @ ` + orderForTimeDisplay}
                  </p>
                </div>
              )}
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <SellOutlinedIcon fontSize="small" color="disabled" />
                <p>{totalItemsOrdered} items</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <PaidOutlinedIcon fontSize="small" color="disabled" />
                <p>{totalDisplay}</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <DeliveryDiningIcon fontSize="small" color="disabled" />
                <p>{fulfillmentDisplay}</p>
              </div>
            </div>
            <div className={`${styles.group_one}`}>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <ContactMailOutlinedIcon fontSize="small" color="disabled" />
                <p className="break-words">{name}</p>
              </div>
              <div className={`${styles.flex} ${styles.info_icon_group}`}>
                <EmailOutlinedIcon fontSize="small" color="disabled" />
                <p className="break-all">{email}</p>
              </div>
              {phoneNum && (
                <div className={`${styles.flex} ${styles.info_icon_group}`}>
                  <LocalPhoneOutlinedIcon fontSize="small" color="disabled" />
                  <p className="break-all">{phoneNum}</p>
                </div>
              )}

              {fulfillmentType === 0 && (
                <div className={`${styles.flex} ${styles.info_icon_group}`}>
                  <HomeIcon fontSize="small" color="disabled" />
                  <p className="break-words">{deliveryAddress}</p>
                </div>
              )}
            </div>
          </div>

          <React.Fragment>
            <div className="flex justify-between items-center px-4 py-2 border-b">
              {/* <button className="border border-[color:var(--gray-light-med)] px-2 py-1 rounded font-light text-sm">
                <div className="flex items-center gap-2">
                  <EmailOutlinedIcon fontSize="small" color="disabled" />
                  Contact
                </div>
              </button> */}
              <div className="flex justify-end items-center  ml-auto">
                <label
                  htmlFor="select-order-status"
                  className="text-xs font-light"
                >
                  Status:
                </label>

                <Select
                  size="small"
                  autoWidth
                  id="select-order-status"
                  // variant="outline"
                  sx={{
                    boxShadow: "none",
                    ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  }}
                  value={orderStatus}
                  onChange={handleChangeOrderStatus}
                >
                  <MenuItem value="pending">
                    <div
                      className={`${styles.status_text} ${styles.pending_text}`}
                    >
                      <p>pending</p>
                    </div>
                  </MenuItem>
                  <MenuItem value="completed">
                    <div
                      className={`${styles.status_text} ${styles.accepted_text}`}
                    >
                      <p>completed</p>
                    </div>
                  </MenuItem>
                  <MenuItem value="canceled">
                    <div
                      className={`${styles.status_text} ${styles.canceled_text}`}
                    >
                      <p>canceled</p>
                    </div>
                  </MenuItem>
                </Select>
              </div>
            </div>
          </React.Fragment>
        </div>
        <div
          className={`${styles.card_details_group} ${
            (expanded || isDesktop) && styles.card_details_expanded
          }`}
        >
          <h3>Items:</h3>
          {orderItems.map((item, idx) => {
            const { id } = item;
            return (
              <CartItem
                key={id}
                cartItem={item}
                isDesktop={isDesktop}
                isBusiness={isBusiness}
              />
            );
          })}
          {/* <CartItem isDesktop={isDesktop} isBusiness={isBusiness} /> */}
          <OrderReview isBusiness={true} order={order} />
          <OrderSubtotal isBusiness={true} order={order} />
          {!isDesktop && (
            <div className="text-right pr-4 pb-2">
              <IconButton
                id="panel1"
                name="panel1"
                onClick={(e) => handleChange(e, "panel1")}
              >
                {expanded ? (
                  <p className="text-sm font-light text-red-600">close</p>
                ) : (
                  <p className="text-sm font-light text-blue-600">View</p>
                )}
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderCard;

// * Accept Decline Buttons on Mobile
// {!isOrderHistory && (
//   <div className={`${styles.action_btn_group_expanded} ${styles.flex}`}>
//     {expanded && (
//       <div className={`${styles.group_three}`}>
//         <IconButton onClick={(e) => handleFooterCloseCard(e, "panel1")}>
//           <ExpandLessOutlinedIcon />
//         </IconButton>
//       </div>
//     )}
//     <div className={`${styles.action_btn_group} ${styles.flex}`}>
//       {status === "pending" && <ButtonSecondary name="Decline" />}
//       {status === "pending" && <ButtonPrimary name="Accept" />}
//       {/* Split */}
//       {status === "accepted" && <ButtonFourth name="Cancel" />}
//       {status === "accepted" && <ButtonThird name="Complete" />}
//     </div>
//   </div>
// )}
