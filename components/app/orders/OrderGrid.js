import React from "react";
import styles from "@/styles/components/orders/order-grid.module.css";
import OrderGridRow from "./OrderGridRow";
import Divider from "@mui/material/Divider";

function OrderGrid({ orders, getOrders, handleOpenSnackbar }) {
  return (
    <table className={`${styles.order_grid_box} ${styles.grid}`}>
      <thead className={`${styles.table_head}`}>
        <tr className={`${styles.table_row}`}>
          <th className={`${styles.table_title}`}>No.</th>
          <th className={`${styles.table_title}`}>Date</th>
          <th className={`${styles.table_title}`}>For</th>
          <th className={`${styles.table_title}`}>Customer</th>
          <th className={`${styles.table_title}`}>Items</th>
          <th className={`${styles.table_title}`}>Total</th>
          <th className={`${styles.table_title}`}>Fulfillment</th>
          <th className={`${styles.table_title}`}>Payment</th>
          <th className={`${styles.table_title}`}>Status</th>
          <th className={`${styles.table_title}`}>View</th>
        </tr>
      </thead>

      <tbody className={`${styles.table_body}`}>
        {orders.map((order, idx) => {
          const { id, orderStatus, paymentStatus } = order;
          return (
            <OrderGridRow
              key={id}
              status={orderStatus}
              payStatus={paymentStatus}
              isDesktop={false}
              isBusiness={true}
              order={order}
              getOrders={getOrders}
              handleOpenSnackbar={handleOpenSnackbar}
            />
          );
        })}

        {/* <OrderGridRow status="pending" />
				<OrderGridRow status="pending" />
				<OrderGridRow status="accepted" />
				<OrderGridRow status="accepted" />
				<OrderGridRow status="accepted" />
				<OrderGridRow status="accepted" />
				<OrderGridRow status="accepted" />
				<OrderGridRow status="accepted" />
				<OrderGridRow status="accepted" /> */}
      </tbody>
    </table>
  );
}

export default OrderGrid;
