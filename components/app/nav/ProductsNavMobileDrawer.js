import React from "react";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import DrawerHeader from "../../global/drawers/DrawerHeader";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

function ProductsNavMobileDrawer({ state, toggleDrawer }) {
	return (
		<Drawer
			anchor={"bottom"}
			open={state["bottom"]}
			onClose={toggleDrawer("bottom", false)}
			sx={{ borderRadius: "1rem" }}
		>
			<DrawerHeader
				title="Inventory Menu"
				toggleDrawer={toggleDrawer}
				icon={<Inventory2OutlinedIcon />}
			/>

			<div className="flex flex-col p-4 gap-2">
				<Link
					href="/app/account/inventory/products"
					onClick={toggleDrawer("bottom", false)}
					className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light)] active:bg-[color:var(--third-light)]"
				>
					<span className="flex items-center gap-4 justify-start">
						<AddBoxIcon fontSize="small" />
						Products
					</span>
				</Link>
				<Link
					href="/app/account/inventory/category"
					onClick={toggleDrawer("bottom", false)}
					className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light)] active:bg-[color:var(--third-light)]"
				>
					<span className="flex items-center gap-4 justify-start">
						<CategoryIcon fontSize="small" />
						Category
					</span>
				</Link>
			</div>
		</Drawer>
	);
}

export default ProductsNavMobileDrawer;
