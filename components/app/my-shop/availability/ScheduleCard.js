import { IOSSwitch } from "@/components/common/switches/IOSSwitch";
import React, { useState } from "react";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";

const StyledMenu = styled((props) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "right",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "right",
		}}
		{...props}
	/>
))(({ theme }) => ({
	"& .MuiPaper-root": {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 66,
		color:
			theme.palette.mode === "light"
				? "rgb(55, 65, 81)"
				: theme.palette.grey[300],
		boxShadow:
			"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
		"& .MuiMenu-list": {
			padding: "0",
		},
		"& .MuiMenuItem-root": {
			"& .MuiSvgIcon-root": {
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1),
			},
			"&:active": {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity
				),
			},
		},
	},
}));

function ScheduleCard({ scheduleType }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleOpenMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className="flex items-center gap-4 justify-between bg-white rounded px-4 py-1">
			<IOSSwitch />
			<div className="flex flex-col">
				<span>
					{scheduleType === "date" && <p className="text-xs">6/18</p>}
					{scheduleType === "range" && <p className="text-xs">6/18 - 6/13</p>}
					{scheduleType === "day" && <p className="text-xs">Monday</p>}
				</span>
				{scheduleType === "day" && (
					<p className="text-xs font-extralight">Does not repeat</p>
				)}
			</div>
			<span>
				<p className="text-xs">8am - 5pm</p>
			</span>

			<StyledMenu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
				anchorOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				<MenuItem onClick={handleClose} sx={{ fontSize: "12px" }}>
					Edit
				</MenuItem>
				<MenuItem onClick={handleClose} sx={{ fontSize: "12px" }}>
					Delete
				</MenuItem>
			</StyledMenu>

			<IconButton onClick={handleOpenMenu}>
				<MoreVertIcon fontSize="small" />
			</IconButton>
		</div>
	);
}

export default ScheduleCard;
