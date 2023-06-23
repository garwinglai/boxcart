import React from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function DrawerHeader({ title, toggleDrawer, icon }) {
	return (
		<div className="flex justify-between px-4 py-2 border-b border-[color:var(--gray-light-med)] ">
			<span className="flex gap-2 items-center">
				{icon}
				<h4>{title}</h4>
			</span>
			<IconButton onClick={toggleDrawer("bottom", false)}>
				<CloseIcon />
			</IconButton>
		</div>
	);
}

export default DrawerHeader;
