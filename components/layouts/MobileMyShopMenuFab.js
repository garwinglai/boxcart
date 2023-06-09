import React, { useState } from "react";
import styles from "@/styles/components/layouts/mobile-my-shop-menu.module.css";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";
import Link from "next/link";
import MenuList from "@mui/material/MenuList";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";

function MobileMyShopMenuFab({ pageTitle }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<div className="fixed bottom-14 right-4 z-50 md:hidden">
			<Popper
				open={open}
				anchorEl={anchorEl}
				placement="top-end"
				sx={{ paddingBottom: "20px" }}
			>
				<Paper>
					<ClickAwayListener onClickAway={handleClose}>
						<MenuList
							autoFocusItem={open}
							id="composition-menu"
							aria-labelledby="composition-button"
							className={`${styles.menu_list}`}
						>
							<Link href="/account/my-shop" className={`${styles.link_group}`}>
								<MenuItem
									selected={pageTitle === "My Shop"}
									onClick={handleClose}
								>
									<ListItemIcon>
										<StorefrontIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText>My Shop</ListItemText>
								</MenuItem>
							</Link>
							<Link
								href="/account/my-shop/profile"
								className={`${styles.link_group}`}
							>
								<MenuItem
									selected={pageTitle === "My Shop / Profile"}
									onClick={handleClose}
								>
									<ListItemIcon>
										<EditRoundedIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText>Profile</ListItemText>
								</MenuItem>
							</Link>
							<Link
								href="/account/my-shop/products"
								className={`${styles.link_group}`}
							>
								<MenuItem
									selected={pageTitle === "My Shop / Products"}
									onClick={handleClose}
								>
									<ListItemIcon>
										<CategoryIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText>Products</ListItemText>
								</MenuItem>
							</Link>
							<Link
								href="/account/my-shop/availability"
								className={`${styles.link_group}`}
							>
								<MenuItem
									selected={pageTitle === "My Shop / Availability"}
									onClick={handleClose}
								>
									<ListItemIcon>
										<EditCalendarRoundedIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText>Availability</ListItemText>
								</MenuItem>
							</Link>
							<Link
								href="/account/my-shop/fulfillment"
								className={`${styles.link_group}`}
							>
								<MenuItem
									selected={pageTitle === "My Shop / Fulfillment"}
									onClick={handleClose}
								>
									<ListItemIcon>
										<DeliveryDiningRoundedIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText>Fulfillment</ListItemText>
								</MenuItem>
							</Link>
							<Link
								href="/account/my-shop/payments"
								className={`${styles.link_group}`}
							>
								<MenuItem
									selected={pageTitle === "My Shop / Payments"}
									onClick={handleClose}
								>
									<ListItemIcon>
										<AddCardRoundedIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText>Payments</ListItemText>
								</MenuItem>
							</Link>
						</MenuList>
					</ClickAwayListener>
				</Paper>
			</Popper>
			<div className={`${styles.fab}`}>
				<Fab
					sx={{ color: "var(--white)", backgroundColor: "var(--secondary)" }}
					aria-label="add"
					onClick={handleClick}
				>
					<EditIcon />
				</Fab>
			</div>
		</div>
	);
}

export default MobileMyShopMenuFab;
