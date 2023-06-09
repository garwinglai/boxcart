import React, { useState } from "react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Badge from "@mui/material/Badge";
import { IconButton } from "@mui/material";
import Link from "next/link";
import ProductsNavMobileDrawer from "@/components/storefront/nav/ProductsNavMobileDrawer";
import OrdersNavMobileDrawer from "@/components/storefront/nav/OrdersNavMobileDrawer";
import StoreNavMobileDrawer from "@/components/storefront/nav/StoreNavMobileDrawer";

function ShopNavBottom() {
	const [inventoryDrawer, setInventoryDrawer] = useState({ bottom: false });
	const [ordersDrawer, setOrdersDrawer] = useState({ bottom: false });
	const [storeDrawer, setStoreDrawer] = useState({ bottom: false });

	const toggleDrawerInventory = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setInventoryDrawer({ ...inventoryDrawer, [anchor]: open });
	};

	const toggleDrawerOrders = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setOrdersDrawer({ ...ordersDrawer, [anchor]: open });
	};

	const toggleDrawerStore = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setStoreDrawer({ ...storeDrawer, [anchor]: open });
	};

	return (
		<nav className="px-4 pb-1 flex w-full justify-between fixed bottom-0 bg-[color:var(--white)] border-t border-[color:var(--gray-light)] md:hidden">
			<Link href="/account/chat">
				<div className="flex flex-col items-center">
					<IconButton>
						<Badge color="secondary" variant="dot" overlap="circular">
							<ChatBubbleOutlineOutlinedIcon
								sx={{ color: "var(--black-design-extralight)" }}
							/>
						</Badge>
					</IconButton>
					<p className="text-xs font-extralight -mt-2 ">Chat</p>
				</div>
			</Link>
			<div className="flex flex-col items-center">
				<IconButton onClick={toggleDrawerInventory("bottom", true)}>
					<Badge
						color="secondary"
						variant="dot"
						overlap="circular"
						invisible={true}
					>
						<AddBoxOutlinedIcon
							sx={{ color: "var(--black-design-extralight)" }}
						/>
					</Badge>
				</IconButton>
				<p className="text-xs font-extralight -mt-2">Inventory</p>
				<ProductsNavMobileDrawer
					state={inventoryDrawer}
					toggleDrawer={toggleDrawerInventory}
				/>
			</div>
			<div className="flex flex-col items-center">
				<IconButton onClick={toggleDrawerOrders("bottom", true)}>
					<Badge
						color="secondary"
						variant="dot"
						overlap="circular"
						invisible={true}
					>
						<LocalOfferOutlinedIcon
							sx={{ color: "var(--black-design-extralight)" }}
						/>
					</Badge>
				</IconButton>
				<p className="text-xs font-extralight -mt-2">orders</p>
				<OrdersNavMobileDrawer
					state={ordersDrawer}
					toggleDrawer={toggleDrawerOrders}
				/>
			</div>
			<div className="flex flex-col items-center">
				<IconButton onClick={toggleDrawerStore("bottom", true)}>
					<Badge
						color="secondary"
						variant="dot"
						overlap="circular"
						invisible={true}
					>
						<StorefrontOutlinedIcon
							sx={{ color: "var(--black-design-extralight)" }}
						/>
					</Badge>
				</IconButton>
				<p className="text-xs font-extralight -mt-2">store</p>
				<StoreNavMobileDrawer
					state={storeDrawer}
					toggleDrawer={toggleDrawerStore}
				/>
			</div>
		</nav>
	);
}

export default ShopNavBottom;
