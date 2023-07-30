import React from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/orders/order-history.module.css";
import Calendar from "@/components/global/designs/Calendar";
import SearchBar from "@/components/global/designs/SearchBar";
import SortIcon from "@mui/icons-material/Sort";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import OrderGridHistory from "@/components/app/orders/OrderGridHistory";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import { isAuth } from "@/helper/client/auth/isAuth";
import prisma from "@/lib/prisma";

function AllOrders() {
	const [state, setState] = React.useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	});

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	return (
		<div className={`${styles.order_history_box}`}>
			<SwipeableDrawer
				anchor={"right"}
				open={state["right"]}
				onClose={toggleDrawer("right", false)}
				onOpen={toggleDrawer("right", true)}
			>
				<div className={`${styles.calendar_box}`}>
					<div className={`${styles.flex} ${styles.calendar_header_group}`}>
						<h2>Calendar</h2>
						<p>🌚 = Orders</p>
					</div>
					<Calendar />
				</div>
			</SwipeableDrawer>

			<div className={`${styles.search_group} ${styles.flex}`}>
				<SearchBar />
				<div className={`${styles.sort_box} ${styles.flex}`}>
					{/* <div className="bg-[color:var(--primary-dark-med)] rounded-full"> */}
					<ButtonFilter name="Sort by" icon={<SortIcon fontSize="small" />} />
					{/* </div> */}
					{/* <div className="bg-[color:var(--primary-dark-med)] rounded-full"> */}
					<ButtonFilter
						name="Select Date"
						icon={<TodayOutlinedIcon fontSize="small" />}
					/>
					{/* </div> */}
				</div>
				<div className={` ${styles.filter_box} ${styles.flex}`}>
					<ButtonFilter name="View all" />
					<ButtonFilter name="Paid" />
					<ButtonFilter name="Declined" />
					<ButtonFilter name="Refunded" />
					<ButtonFilter name="Canceled" />
				</div>
			</div>
			<div className={`${styles.order_grid_box}`}>
				<OrderGridHistory />
			</div>
		</div>
	);
}

export default AllOrders;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

AllOrders.getLayout = function getLayout(
	page,
	pageTitle,
	pageIcon,
	pageRoute,
	mobilePageRoute
) {
	return (
		<AppLayout
			pageTitle={pageTitle}
			pageIcon={pageIcon}
			pageRoute={pageRoute}
			mobilePageRoute={mobilePageRoute}
		>
			{page}
		</AppLayout>
	);
};

AllOrders.pageTitle = "Order History";
AllOrders.pageIcon = <FormatListBulletedIcon />;
AllOrders.pageRoute = "history";
AllOrders.mobilePageRoute = "history";
