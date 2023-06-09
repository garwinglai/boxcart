import React from "react";
import styles from "@/styles/components/orders/order-grid.module.css";
import OrderGridRow from "./OrderGridRow";

function OrderGrid({ status }) {
	return (
		<table className={`${styles.order_grid_box} ${styles.grid}`}>
			<thead className={`${styles.table_head}`}>
				<tr className={`${styles.table_row}`}>
					<th className={`${styles.table_title}`}>ID</th>
					<th className={`${styles.table_title}`}>Customer</th>
					<th className={`${styles.table_title}`}>Contact</th>
					<th className={`${styles.table_title}`}>Status</th>
					<th className={`${styles.table_title}`}>Order Date</th>
					<th className={`${styles.table_title}`}>Order For</th>
					<th className={`${styles.table_title}`}>Fulfillment</th>
					<th className={`${styles.table_title}`}>Total</th>
					<th className={`${styles.table_title}`}>Order</th>
					<th className={`${styles.table_title}`}>Action</th>
					<th className={`${styles.table_title}`}>View</th>
				</tr>
			</thead>
			<tbody className={`${styles.table_body}`}>
				<OrderGridRow status="pending" />
				<OrderGridRow status="pending" />
				<OrderGridRow status="accepted" />
				<OrderGridRow status="accepted" />
				<OrderGridRow status="accepted" />
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
