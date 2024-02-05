import React from "react";
import OrderGridRowHistory from "./OrderGridRowHistory";
import styles from "@/styles/components/orders/order-grid-history.module.css";

function OrderGridHistory({ orders, getAllHistoryOrders, handleOpenSnackbar }) {
  return (
    <table className={`${styles.order_grid_box} ${styles.grid}`}>
      <thead className={`${styles.table_head}`}>
        <tr className={`${styles.table_row}`}>
          <th className={`${styles.table_title}`}>Id.</th>
          <th className={`${styles.table_title}`}>Date</th>
          <th className={`${styles.table_title}`}>For</th>
          <th className={`${styles.table_title}`}>Customer</th>
          <th className={`${styles.table_title}`}>Items</th>
          <th className={`${styles.table_title}`}>Net</th>
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
            <OrderGridRowHistory
              key={id}
              status={orderStatus}
              payStatus={paymentStatus}
              isDesktop={false}
              isBusiness={true}
              order={order}
              getAllHistoryOrders={getAllHistoryOrders}
              handleOpenSnackbar={handleOpenSnackbar}
            />
          );
        })}
      </tbody>
    </table>
  );
}

export default OrderGridHistory;
