import candle_logo from "@/public/images/temp/candle_logo_temp.jpeg";
import styles from "@/styles/components/layouts/mobile-navbar.module.css";
import AddIcon from "@mui/icons-material/Add";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LaunchIcon from "@mui/icons-material/Launch";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import launch_icon from "@/public/images/icons/launch_icon.png";

function MobileNavBar({ toggleDrawer, mobilePageRoute }) {
	console.log(mobilePageRoute);
	const [openStoreList, setOpenStoreList] = useState(
		mobilePageRoute === "profile" ||
			mobilePageRoute === "products" ||
			mobilePageRoute === "category" ||
			mobilePageRoute === "availability" ||
			mobilePageRoute === "fulfillment" ||
			mobilePageRoute === "payments"
			? true
			: false
	);
	const [openOrderList, setOpenOrderList] = useState(
		mobilePageRoute === "history" || mobilePageRoute === "live" ? true : false
	);
	const [openCommList, setOpenCommList] = useState(
		mobilePageRoute === "contacts" ||
			mobilePageRoute === "chat" ||
			mobilePageRoute === "comm-settings"
			? true
			: false
	);
	const [openPremiumList, setOpenPremiumList] = useState(
		mobilePageRoute === "membership" || mobilePageRoute === "add-ons"
			? true
			: false
	);

	const handleNestedStoreList = () => {
		setOpenStoreList((prev) => !prev);
	};

	const handleNestedOrderList = () => {
		setOpenOrderList((prev) => !prev);
	};

	const handleNestedCommList = () => {
		setOpenCommList((prev) => !prev);
	};

	const handleNestedPremiumList = () => {
		setOpenPremiumList((prev) => !prev);
	};

	const handleShareShop = () => {
		window.alert("Share shop");
	};

	const handleLogOut = () => {
		window.alert("log out");
	};
	return (
		<div className={`${styles.mobile_nav_box} ${styles.flexCol}`}>
			<div className={`${styles.navbar_header_group} ${styles.flexCol}`}>
				<div className={`${styles.flex} ${styles.greetings_group}`}>
					<Image
						src={launch_icon}
						alt="launch icon"
						className={`${styles.launch_image}`}
					/>
					<p>Hi, Sean</p>
				</div>
				<Image
					alt="business logo"
					src={candle_logo}
					className={`${styles.avatar_image}`}
				/>
				<h3>BoxCart</h3>
			</div>
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				className={`${styles.menu_list_group}`}
				sx={{ padding: "1rem" }}
			>
				<Link
					href="/account/checklist"
					className={`${styles.menu_link_group}`}
					onClick={toggleDrawer("right", false)}
				>
					<MenuItem
						sx={{
							backgroundColor: `${
								mobilePageRoute === "checklist" && "var(--primary-light-med)"
							}`,
							border: `${
								mobilePageRoute === "checklist"
									? "1px solid var(--primary)"
									: "1px solid var(--white)"
							}`,
							borderRadius: `${mobilePageRoute === "checklist" && "45px"}`,
						}}
					>
						<ListItemIcon>
							<ChecklistIcon
								sx={{
									color: `${
										mobilePageRoute === "checklist"
											? "var(--primary-dark)"
											: "gray"
									}  `,
								}}
							/>
						</ListItemIcon>
						<ListItemText
							primary="Checklist"
							sx={{
								color: `${
									mobilePageRoute === "checklist"
										? "var(--primary-dark)"
										: "gray"
								}  `,
							}}
						/>
					</MenuItem>
				</Link>

				<MenuItem onClick={handleNestedStoreList}>
					<ListItemIcon>
						<StorefrontIcon
							sx={{
								color: `${
									mobilePageRoute === "profile" ||
									mobilePageRoute === "products" ||
									mobilePageRoute === "category" ||
									mobilePageRoute === "availability" ||
									mobilePageRoute === "fulfillment" ||
									mobilePageRoute === "payments"
										? "var(--primary-dark)"
										: "gray"
								}  `,
							}}
						/>
					</ListItemIcon>
					<ListItemText
						primary="My shop"
						sx={{
							color: `${
								mobilePageRoute === "profile" ||
								mobilePageRoute === "products" ||
								mobilePageRoute === "category" ||
								mobilePageRoute === "availability" ||
								mobilePageRoute === "fulfillment" ||
								mobilePageRoute === "payments"
									? "var(--primary-dark)"
									: "gray"
							}  `,
						}}
					/>

					{openStoreList ? (
						<ExpandLess
							sx={{
								color: "var(--primary)",
							}}
						/>
					) : (
						<ExpandMore
							sx={{
								color: "gray",
							}}
						/>
					)}
				</MenuItem>
				<Collapse in={openStoreList} timeout="auto" unmountOnExit>
					<List component="div" disablePadding sx={{ pl: "16px" }}>
						{/* <Link
							href="/account/my-shop"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem >
								<ListItemIcon>
									<VisibilityOutlinedIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Preview</p>}
								/>
							</MenuItem>
						</Link> */}
						<Link
							href="/account/my-shop/profile"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "profile" && "var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "profile"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${mobilePageRoute === "profile" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<AccountBoxOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "profile"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Profile</p>}
									sx={{
										color: `${
											mobilePageRoute === "profile"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/my-shop/products"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										(mobilePageRoute === "products" ||
											mobilePageRoute === "category") &&
										"var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "products" ||
										mobilePageRoute === "category"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${
										(mobilePageRoute === "products" ||
											mobilePageRoute === "category") &&
										"45px"
									}`,
								}}
							>
								<ListItemIcon>
									<CategoryOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "products" ||
												mobilePageRoute === "category"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Products</p>}
									sx={{
										color: `${
											mobilePageRoute === "products" ||
											mobilePageRoute === "category"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/my-shop/availability"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "availability" &&
										"var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "availability"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${
										mobilePageRoute === "availability" && "45px"
									}`,
								}}
							>
								<ListItemIcon>
									<CalendarTodayOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "availability"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Availability</p>}
									sx={{
										color: `${
											mobilePageRoute === "availability"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/my-shop/fulfillment"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "fulfillment" &&
										"var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "fulfillment"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${
										mobilePageRoute === "fulfillment" && "45px"
									}`,
								}}
							>
								<ListItemIcon>
									<DeliveryDiningOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "fulfillment"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Fulfillment</p>}
									sx={{
										color: `${
											mobilePageRoute === "fulfillment"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/my-shop/payments"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "payments" && "var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "payments"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${mobilePageRoute === "payments" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<AddCardRoundedIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "payments"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Payments</p>}
									sx={{
										color: `${
											mobilePageRoute === "payments"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
					</List>
				</Collapse>

				<MenuItem onClick={handleNestedOrderList}>
					<ListItemIcon>
						<ShoppingCartOutlinedIcon
							sx={{
								color: `${
									mobilePageRoute === "live" || mobilePageRoute === "history"
										? "var(--primary-dark)"
										: "gray"
								}  `,
							}}
						/>
					</ListItemIcon>
					<ListItemText
						primary="Orders"
						sx={{
							color: `${
								mobilePageRoute === "live" || mobilePageRoute === "history"
									? "var(--primary-dark)"
									: "gray"
							}  `,
						}}
					/>
					{openOrderList ? (
						<ExpandLess
							sx={{
								color: "var(--primary)",
							}}
						/>
					) : (
						<ExpandMore
							sx={{
								color: "gray",
							}}
						/>
					)}
				</MenuItem>
				<Collapse in={openOrderList} timeout="auto" unmountOnExit>
					<List component="div" disablePadding sx={{ pl: "16px" }}>
						<Link
							href="/account/orders/live"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "live" && "var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "live"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${mobilePageRoute === "live" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<ShoppingCartCheckoutIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "live"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Live</p>}
									sx={{
										color: `${
											mobilePageRoute === "live"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/orders/history"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "history" && "var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "history"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${mobilePageRoute === "history" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<FormatListBulletedIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "history"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">History</p>}
									sx={{
										color: `${
											mobilePageRoute === "history"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
					</List>
				</Collapse>

				<MenuItem onClick={handleNestedCommList}>
					<ListItemIcon>
						<MailOutlineOutlinedIcon
							sx={{
								color: `${
									mobilePageRoute === "contacts" ||
									mobilePageRoute === "chat" ||
									mobilePageRoute === "comm-settings"
										? "var(--primary-dark)"
										: "gray"
								}  `,
							}}
						/>
					</ListItemIcon>
					<ListItemText
						primary="Communication"
						sx={{
							pr: "8px",
							color: `${
								mobilePageRoute === "contacts" ||
								mobilePageRoute === "chat" ||
								mobilePageRoute === "comm-settings"
									? "var(--primary-dark)"
									: "gray"
							}  `,
						}}
					/>
					{openCommList ? (
						<ExpandLess
							sx={{
								color: "var(--primary)",
							}}
						/>
					) : (
						<ExpandMore
							sx={{
								color: "gray",
							}}
						/>
					)}
				</MenuItem>

				<Collapse in={openCommList} timeout="auto" unmountOnExit>
					<List component="div" disablePadding sx={{ pl: "16px" }}>
						<Link
							href="/account/communication/contacts"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "contacts" && "var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "contacts"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${mobilePageRoute === "contacts" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<RecentActorsOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "contacts"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Contacts</p>}
									sx={{
										color: `${
											mobilePageRoute === "contacts"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/communication/chat"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "chat" && "var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "chat"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${mobilePageRoute === "chat" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<ChatOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "chat"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Chat</p>}
									sx={{
										color: `${
											mobilePageRoute === "chat"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/communication/settings"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "comm-settings" &&
										"var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "comm-settings"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${
										mobilePageRoute === "comm-settings" && "45px"
									}`,
								}}
							>
								<ListItemIcon>
									<ModeEditOutlineOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												mobilePageRoute === "comm-settings"
													? "var(--primary-dark)"
													: "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Settings</p>}
									sx={{
										color: `${
											mobilePageRoute === "comm-settings"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
					</List>
				</Collapse>

				<MenuItem onClick={handleNestedPremiumList}>
					<ListItemIcon>
						<StarPurple500Icon
							sx={{
								color: `${
									mobilePageRoute === "membership" ||
									mobilePageRoute === "add-ons"
										? "var(--primary-dark)"
										: "gray"
								}  `,
							}}
						/>
					</ListItemIcon>
					<ListItemText
						primary="Premium"
						sx={{
							color: `${
								mobilePageRoute === "membership" ||
								mobilePageRoute === "add-ons"
									? "var(--primary-dark)"
									: "gray"
							}  `,
						}}
					/>
					{openPremiumList ? (
						<ExpandLess
							sx={{
								color: "var(--primary)",
							}}
						/>
					) : (
						<ExpandMore
							sx={{
								color: "gray",
							}}
						/>
					)}
				</MenuItem>

				<Collapse in={openPremiumList} timeout="auto" unmountOnExit>
					<List component="div" disablePadding sx={{ pl: "16px" }}>
						<Link
							href="/account/premium/membership"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "membership" &&
										"var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "membership"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${mobilePageRoute === "membership" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<CardMembershipIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Membership</p>}
									sx={{
										color: `${
											mobilePageRoute === "membership"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/premium/add-ons"
							className={`${styles.menu_link_group}`}
							onClick={toggleDrawer("right", false)}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										mobilePageRoute === "add-ons" && "var(--primary-light-med)"
									}`,
									border: `${
										mobilePageRoute === "add-ons"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${mobilePageRoute === "add-ons" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<AddIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Add ons</p>}
									sx={{
										color: `${
											mobilePageRoute === "add-ons"
												? "var(--primary-dark)"
												: "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
					</List>
				</Collapse>

				<Link
					href="/account/settings"
					className={`${styles.menu_link_group}`}
					onClick={toggleDrawer("right", false)}
				>
					<MenuItem
						sx={{
							backgroundColor: `${
								mobilePageRoute === "account-settings" &&
								"var(--primary-light-med)"
							}`,
							border: `${
								mobilePageRoute === "account-settings"
									? "1px solid var(--primary)"
									: "1px solid var(--white)"
							}`,
							borderRadius: `${
								mobilePageRoute === "account-settings" && "45px"
							}`,
						}}
					>
						<ListItemIcon>
							<SettingsOutlinedIcon
								sx={{
									color: `${
										mobilePageRoute === "account-settings"
											? "var(--primary-dark)"
											: "gray"
									}  `,
								}}
							/>
						</ListItemIcon>
						<ListItemText
							primary="Settings"
							sx={{
								color: `${
									mobilePageRoute === "account-settings"
										? "var(--primary-dark)"
										: "gray"
								}  `,
							}}
						/>
					</MenuItem>
				</Link>
			</List>
			<div className={`${styles.navbar_footer_group}`}>
				<MenuItem onClick={handleShareShop}>
					<ListItemIcon>
						<ShareOutlinedIcon />
					</ListItemIcon>
					<ListItemText primary="Share store" />
				</MenuItem>

				<MenuItem onClick={handleLogOut}>
					<ListItemIcon>
						<LogoutIcon />
					</ListItemIcon>
					<ListItemText primary="Log out" />
				</MenuItem>
			</div>
		</div>
	);
}

export default MobileNavBar;
