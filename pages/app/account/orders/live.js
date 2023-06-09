import React, { useState, useEffect, useRef } from "react";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/orders/live-orders.module.css";
import Calendar from "@/components/designs/Calendar";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SearchBar from "@/components/designs/SearchBar";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import { IconButton } from "@mui/material";
import OrderCard from "@/components/app/orders/OrderCard";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import OrderGrid from "@/components/app/orders/OrderGrid";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ButtonThird from "@/components/designs/ButtonThird";
import ButtonFourth from "@/components/designs/ButtonFourth";
import ButtonFilter from "@/components/designs/ButtonFilter";
import ButtonSecondary from "@/components/designs/ButtonSecondary";

function LiveOrders() {
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

	const mobileView = () => {
		return (
			<div className={`${styles.live_orders_box_mobile}`}>
				<SwipeableDrawer
					anchor={"bottom"}
					open={state["bottom"]}
					onClose={toggleDrawer("bottom", false)}
					onOpen={toggleDrawer("bottom", true)}
				>
					<div className={`${styles.calendar_box}`}>
						<div className={`${styles.flex} ${styles.calendar_header_group}`}>
							<h2>Calendar</h2>
							<p>🌚 = Orders</p>
						</div>
						<Calendar />
					</div>
				</SwipeableDrawer>

				<div className={`${styles.search_group}`}>
					<SearchBar />
					<div className={`${styles.filter_box} ${styles.flex}`}>
						<div className="bg-[color:var(--primary-dark-med)] rounded-full">
							<ButtonFilter
								name="Sort by"
								icon={<SortIcon fontSize="small" />}
							/>
						</div>
						<div className="bg-[color:var(--primary-dark-med)] rounded-full">
							<ButtonFilter
								name="Select Date"
								icon={<TodayOutlinedIcon fontSize="small" />}
							/>
						</div>
					</div>
				</div>
				<div className={`${styles.incoming_orders_box}`}>
					<div className={`${styles.pending_box}`}>
						<h3>Pending . . .</h3>
						<OrderCard status="pending" isDesktop={false} isBusiness={true} />
						<OrderCard status="pending" isDesktop={false} isBusiness={true} />
					</div>
					<div className={`${styles.accepted_box}`}>
						<h3>Accepted . . .</h3>
						<OrderCard status="accepted" isDesktop={false} isBusiness={true} />
						<OrderCard status="accepted" isDesktop={false} isBusiness={true} />
					</div>
				</div>
			</div>
		);
	};

	const desktopView = () => {
		return (
			<div className={`${styles.live_orders_box_desktop}`}>
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
				<div className={`${styles.search_group} ${styles.flex} `}>
					<SearchBar />
					<div className={`${styles.filter_box} ${styles.flex} `}>
					<div className="bg-[color:var(--primary-dark-med)] rounded-full">
							<ButtonFilter
								name="Sort by"
								icon={<SortIcon fontSize="small" />}
							/>
						</div>
				<div className="bg-[color:var(--primary-dark-med)] rounded-full">
							<ButtonFilter
								name="Select Date"
								icon={<TodayOutlinedIcon fontSize="small" />}
							/>
						</div>
					</div>
				</div>
				<div className={`${styles.order_grid_box}`}>
					{/* <div style={{ textAlign: "right", marginRight: "2rem" }}>
						<SwapHorizIcon color="disabled" />
					</div> */}
					<OrderGrid />
				</div>
			</div>
		);
	};

	return (
		<React.Fragment>
			{mobileView()}
			{desktopView()}
		</React.Fragment>
	);
}

export default LiveOrders;

LiveOrders.getLayout = function getLayout(
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
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				{page}
			</LocalizationProvider>
		</AppLayout>
	);
};

LiveOrders.pageTitle = "Live Orders";
LiveOrders.pageIcon = <ShoppingCartCheckoutIcon />;
LiveOrders.pageRoute = "live";
LiveOrders.mobilePageRoute = "live";
