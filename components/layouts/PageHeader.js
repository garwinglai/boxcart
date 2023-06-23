import React from "react";
import styles from "@/styles/components/layouts/page-header.module.css";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MobileNavBar from "./MobileNavBar";
import ButtonPrimary from "../common/buttons/ButtonPrimary";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Badge from "@mui/material/Badge";

function PageHeader({ pageTitle, pageIcon, mobilePageRoute }) {
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
		<div className=" flex justify-between py-2 px-4 items-center sticky top-0 bg-[color:var(--white)] border-b border-[color:var(--gray-light)] z-10 shadow-md">
			<div className="flex gap-2 items-center">
				{pageIcon}
				<h3 className="text-[color:var(--black-design)] ">{pageTitle}</h3>
			</div>
			<div className="flex gap-4 items-center">
				<IconButton>
					<Badge color="warning" variant="dot" overlap="circular">
						<NotificationsOutlinedIcon
							sx={{ color: "var(--black-design-extralight)" }}
						/>
					</Badge>
				</IconButton>
				<div className="md:hidden">
					<IconButton onClick={toggleDrawer("right", true)}>
						<MenuIcon
							sx={{ color: "var(--black-design-extralight)" }}
							fontSize="small"
						/>
					</IconButton>
				</div>
				<p className="hidden md:block md:text-[color:var(--gray-text)] md:text-sm md:font-extralight ">
					Powered by BoxCart
				</p>
			</div>
			<SwipeableDrawer
				anchor="right"
				open={state.right}
				onClose={toggleDrawer("right", false)}
				onOpen={toggleDrawer("right", true)}
			>
				<MobileNavBar
					toggleDrawer={toggleDrawer}
					mobilePageRoute={mobilePageRoute}
				/>
			</SwipeableDrawer>
		</div>
	);
}

export default PageHeader;
