import React, { useState } from "react";
import styles from "@/styles/app/revenue/payout-row.module.css";

function PayoutRow({ payout, handleViewDetails }) {
  const { amount, arrival_date, created, status } = payout;

  const amountDisplay = (amount / 100).toFixed(2);
  const createdDate = new Date(created * 1000).toLocaleDateString();
  const arrivalDate = new Date(arrival_date * 1000).toLocaleDateString();

  return (
    <tr className={`${styles.table_row}`} onClick={handleViewDetails(payout)}>
      <td
        className={`${styles.table_data}`}
        // onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">{createdDate}</p>
      </td>
      <td
        className={`${styles.table_data}`}
        // onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">{status}</p>
      </td>
      <td
        className={`${styles.table_data}`}
        // onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">{arrivalDate}</p>
      </td>
      <td
        className={`${styles.table_data}`}
        // onClick={toggleDrawer("right", true)}
      >
        <p className="text-xs">${amountDisplay}</p>
      </td>
      <td
        className={`${styles.table_data} ${styles.black_text}`}
        // onClick={toggleDrawer("right", true)}
      >
        <button
          onClick={handleViewDetails(payout)}
          className="text-sm text-[color:var(--primary)] hover:cursor-pointer"
        >
          Details
        </button>
      </td>
    </tr>
  );
}

export default PayoutRow;
