import React from "react";
import styles from "@/styles/app/revenue/payout-grid.module.css";
import PayoutRow from "./PayoutRow";

function PayoutGrid({ payouts }) {
  console.log("payouts", payouts);
  return (
    <table className={`${styles.order_grid_box} ${styles.grid}`}>
      <thead className={`${styles.table_head}`}>
        <tr className={`${styles.table_row}`}>
          <th className={`${styles.table_title}`}>Created</th>
          <th className={`${styles.table_title}`}>Status</th>
          <th className={`${styles.table_title}`}>Arrival</th>
          <th className={`${styles.table_title}`}>Amount</th>
          <th className={`${styles.table_title}`}>Action</th>
        </tr>
      </thead>
      <tbody className={`${styles.table_body}`}>
        {payouts.map((payout, idx) => {
          const { id } = payout;
          return <PayoutRow key={id} payout={payout} />;
        })}
      </tbody>
    </table>
  );
}

export default PayoutGrid;
