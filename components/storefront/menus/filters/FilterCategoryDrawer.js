import React from "react";
import Drawer from "@mui/material/Drawer";
import DrawerHeader from "@/components/global/drawers/DrawerHeader";
import CategoryIcon from "@mui/icons-material/Category";
import Divider from "@mui/material/Divider";

function FilterCategoryDrawer({ toggleDrawer, anchor, state }) {
	return (
		<Drawer
			anchor={anchor}
			open={state[anchor]}
			onClose={toggleDrawer(anchor, false)}
		>
			<DrawerHeader
				title="Category"
				icon={<CategoryIcon />}
				toggleDrawer={toggleDrawer}
			/>
			<div className="flex flex-col p-4 gap-2">
				<button
					// href="/account/orders/live"
					// onClick={toggleDrawer("bottom", false)}
					className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light)] active:bg-[color:var(--third-light)]"
				>
					<span className="flex items-center gap-4 justify-start">
						All products
					</span>
				</button>
				{/* <Divider /> */}
				<button
					// href="/account/orders/history"
					// onClick={toggleDrawer("bottom", false)}
					className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light)] active:bg-[color:var(--third-light)]"
				>
					<span className="flex items-center gap-4 justify-start">
						Sweaters
					</span>
				</button>
			</div>
		</Drawer>
	);
}

export default FilterCategoryDrawer;
