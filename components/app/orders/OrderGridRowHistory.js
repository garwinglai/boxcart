import React from "react";
import styles from "@/styles/components/orders/order-grid-row-history.module.css";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import OrderCard from "./OrderCard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import order_icon from "@/public/images/icons/order_icon.png";
import Image from "next/image";

function OrderGridRowHistory({ status }) {
	const [state, setState] = React.useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	});

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
		console.log("row");
		toggleDrawer("right", true);
	};

	const handleAction = () => {
		console.log("action");
	};
	return (
		<tr className={`${styles.table_row}`}>
			<td
				className={`${styles.table_data}`}
				onClick={toggleDrawer("right", true)}
			>
				<p>2</p>
			</td>
			<td
				className={`${styles.table_data}`}
				onClick={toggleDrawer("right", true)}
			>
				<p>4.23.2023</p>
			</td>
			<td
				className={`${styles.table_data}`}
				onClick={toggleDrawer("right", true)}
			>
				<p>5.23.2023</p>
			</td>
			<td
				className={`${styles.table_data} ${styles.black_text}`}
				onClick={toggleDrawer("right", true)}
			>
				<p>Jessica Joe</p>
			</td>
			<td
				className={`${styles.table_data} ${styles.contact}`}
				onClick={toggleDrawer("right", true)}
			>
				<p>jessica@gmail.com</p>
				<p>123 456 7890</p>
			</td>
			<td
				className={`${styles.table_data}`}
				onClick={toggleDrawer("right", true)}
			>
				<p
					className={`${
						status === "declined"
							? styles.declined
							: status === "refunded"
							? styles.refunded
							: status === "paid"
							? styles.paid
							: styles.canceled
					}`}
				>
					{status}
				</p>
			</td>

			<td
				className={`${styles.table_data}`}
				onClick={toggleDrawer("right", true)}
			>
				<p>Delivery</p>
			</td>
			<td
				className={`${styles.table_data} ${styles.black_text}`}
				onClick={toggleDrawer("right", true)}
			>
				<p>$123.23</p>
			</td>
			<td
				className={`${styles.table_data}`}
				onClick={toggleDrawer("right", true)}
			>
				<p>4 Items</p>
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
							status="accepted"
							isDesktop={true}
							isBusiness={true}
							isOrderHistory={true}
						/>
					</div>
				</Drawer>
			</td>
		</tr>
	);
}

export default OrderGridRowHistory;
