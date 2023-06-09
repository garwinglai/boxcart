import React, { useState } from "react";
import styles from "@/styles/components/layouts/desktop-navbar.module.css";
import Image from "next/image";
import candle_logo from "@/public/images/temp/candle_logo_temp.jpeg";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Link from "next/link";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import LaunchIcon from "@mui/icons-material/Launch";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import launch_icon from "@/public/images/icons/launch_icon.png";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";

function DesktopNavBar({ pageRoute }) {
	const [openStoreList, setOpenStoreList] = useState(
		pageRoute === "profile" ||
			pageRoute === "products" ||
			pageRoute === "category" ||
			pageRoute === "availability" ||
			pageRoute === "fulfillment" ||
			pageRoute === "payments"
			? true
			: false
	);
	const [openOrderList, setOpenOrderList] = useState(
		pageRoute === "history" || pageRoute === "live" ? true : false
	);
	const [openCommList, setOpenCommList] = useState(
		pageRoute === "contacts" ||
			pageRoute === "chat" ||
			pageRoute === "comm-settings"
			? true
			: false
	);
	const [openPremiumList, setOpenPremiumList] = useState(
		pageRoute === "membership" || pageRoute === "add-ons" ? true : false
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
		<div className={`${styles.navbar_box} ${styles.flexCol}`}>
			<div className={`${styles.navbar_header_group} ${styles.flexCol}`}>
				<Image
					alt="business logo"
					src={candle_logo}
					className={`${styles.avatar_image}`}
				/>
				<h4>BoxCart</h4>
				<div className={`${styles.flex} ${styles.greetings_group}`}>
					<Image
						src={launch_icon}
						alt="launch icon"
						className={`${styles.launch_image}`}
					/>
					<p>Hi, Sean</p>
				</div>
			</div>
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				className={`${styles.menu_list_group}`}
				sx={{ padding: "1rem" }}
			>
				<Link href="/account/checklist" className={`${styles.menu_link_group}`}>
					<MenuItem
						sx={{
							backgroundColor: `${
								pageRoute === "checklist" && "var(--primary-light-med)"
							}`,
							border: `${
								pageRoute === "checklist"
									? "1px solid var(--primary)"
									: "1px solid var(--white)"
							}`,
							borderRadius: `${pageRoute === "checklist" && "45px"}`,
						}}
					>
						<ListItemIcon>
							<ChecklistIcon
								sx={{
									color: `${
										pageRoute === "checklist" ? "var(--primary-dark)" : "gray"
									}  `,
								}}
							/>
						</ListItemIcon>
						<ListItemText
							primary="Checklist"
							sx={{
								color: `${
									pageRoute === "checklist" ? "var(--primary-dark)" : "gray"
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
									pageRoute === "profile" ||
									pageRoute === "products" ||
									pageRoute === "category" ||
									pageRoute === "availability" ||
									pageRoute === "fulfillment" ||
									pageRoute === "payments"
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
								pageRoute === "profile" ||
								pageRoute === "products" ||
								pageRoute === "category" ||
								pageRoute === "availability" ||
								pageRoute === "fulfillment" ||
								pageRoute === "payments"
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
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "profile" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "profile"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "profile" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<AccountBoxOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "profile" ? "var(--primary-dark)" : "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Profile</p>}
									sx={{
										color: `${
											pageRoute === "profile" ? "var(--primary-dark)" : "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/my-shop/products"
							className={`${styles.menu_link_group}`}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										(pageRoute === "products" || pageRoute === "category") &&
										"var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "products" || pageRoute === "category"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${
										(pageRoute === "products" || pageRoute === "category") &&
										"45px"
									}`,
								}}
							>
								<ListItemIcon>
									<CategoryOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "products" || pageRoute === "category"
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
											pageRoute === "products" || pageRoute === "category"
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
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "availability" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "availability"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "availability" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<CalendarTodayOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "availability"
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
											pageRoute === "availability"
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
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "fulfillment" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "fulfillment"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "fulfillment" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<DeliveryDiningOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "fulfillment"
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
											pageRoute === "fulfillment"
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
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "payments" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "payments"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "payments" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<AddCardRoundedIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "payments"
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
											pageRoute === "payments" ? "var(--primary-dark)" : "gray"
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
									pageRoute === "live" || pageRoute === "history"
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
								pageRoute === "live" || pageRoute === "history"
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
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "live" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "live"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "live" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<ShoppingCartCheckoutIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "live" ? "var(--primary-dark)" : "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Live</p>}
									sx={{
										color: `${
											pageRoute === "live" ? "var(--primary-dark)" : "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/orders/history"
							className={`${styles.menu_link_group}`}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "history" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "history"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "history" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<FormatListBulletedIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "history" ? "var(--primary-dark)" : "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">History</p>}
									sx={{
										color: `${
											pageRoute === "history" ? "var(--primary-dark)" : "gray"
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
									pageRoute === "contacts" ||
									pageRoute === "chat" ||
									pageRoute === "comm-settings"
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
								pageRoute === "contacts" ||
								pageRoute === "chat" ||
								pageRoute === "comm-settings"
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
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "contacts" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "contacts"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "contacts" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<RecentActorsOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "contacts"
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
											pageRoute === "contacts" ? "var(--primary-dark)" : "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/communication/chat"
							className={`${styles.menu_link_group}`}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "chat" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "chat"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "chat" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<ChatOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "chat" ? "var(--primary-dark)" : "gray"
											}  `,
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Chat</p>}
									sx={{
										color: `${
											pageRoute === "chat" ? "var(--primary-dark)" : "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
						<Link
							href="/account/communication/settings"
							className={`${styles.menu_link_group}`}
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "comm-settings" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "comm-settings"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "comm-settings" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<ModeEditOutlineOutlinedIcon
										fontSize="small"
										sx={{
											color: `${
												pageRoute === "comm-settings"
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
											pageRoute === "comm-settings"
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
									pageRoute === "membership" || pageRoute === "add-ons"
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
								pageRoute === "membership" || pageRoute === "add-ons"
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
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "membership" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "membership"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "membership" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<CardMembershipIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Membership</p>}
									sx={{
										color: `${
											pageRoute === "membership"
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
						>
							<MenuItem
								sx={{
									backgroundColor: `${
										pageRoute === "add-ons" && "var(--primary-light-med)"
									}`,
									border: `${
										pageRoute === "add-ons"
											? "1px solid var(--primary)"
											: "1px solid var(--white)"
									}`,
									borderRadius: `${pageRoute === "add-ons" && "45px"}`,
								}}
							>
								<ListItemIcon>
									<AddIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText
									primary={<p className="text-sm font-light">Add ons</p>}
									sx={{
										color: `${
											pageRoute === "add-ons" ? "var(--primary-dark)" : "gray"
										}  `,
									}}
								/>
							</MenuItem>
						</Link>
					</List>
				</Collapse>

				<Link href="/account/settings" className={`${styles.menu_link_group}`}>
					<MenuItem
						sx={{
							backgroundColor: `${
								pageRoute === "account-settings" && "var(--primary-light-med)"
							}`,
							border: `${
								pageRoute === "account-settings"
									? "1px solid var(--primary)"
									: "1px solid var(--white)"
							}`,
							borderRadius: `${pageRoute === "account-settings" && "45px"}`,
						}}
					>
						<ListItemIcon>
							<SettingsOutlinedIcon
								sx={{
									color: `${
										pageRoute === "account-settings"
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
									pageRoute === "account-settings"
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

export default DesktopNavBar;
