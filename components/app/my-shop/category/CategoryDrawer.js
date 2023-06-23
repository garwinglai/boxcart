import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import SaveCancelButtons from "../../design/SaveCancelButtons";
import CategoryDrawerComponent from "./CategoryDrawerComponent";

function CategoryDrawer({ state, toggleDrawer }) {
	return (
		<Drawer
			anchor={"right"}
			open={state["right"]}
			onClose={toggleDrawer("right", false)}
		>
			<div className="w-screen bg-[color:var(--gray-light)] min-h-screen flex flex-col gap-4 overflow-y-scroll pb-28 md:w-[60vw] lg:w-[40vw] xl:w-[30vw]">
				<CategoryDrawerComponent
					toggleDrawer={toggleDrawer}
					isDesktopView={false}
				/>
				{/* <SaveCancelButtons /> */}
			</div>
		</Drawer>
	);
}

export default CategoryDrawer;
