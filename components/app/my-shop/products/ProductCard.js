import React, { useState } from "react";
import Image from "next/image";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import { IconButton } from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { IOSSwitch } from "@/components/common/switches/IOSSwitch";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import ProductModal from "./ProductModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";
import ProductDrawer from "./ProductDrawer";

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

function ProductCard({ id }) {
	const [expandedCardId, setExpandedCardId] = useState(null);
	const [isCardOpen, setIsCardOpen] = useState(false);
	const [isCardModalOpen, setIsCardModalOpen] = useState(false);
	const [isItemVisible, setIsItemVisible] = useState(false);
	const [state, setState] = useState({
		right: false,
	});
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const isExpanded = expandedCardId === id;

	const handleExpand = () => {
		if (expandedCardId === id) {
			setExpandedCardId(null);
		} else {
			setExpandedCardId(id);
		}

		setIsCardOpen((prev) => !prev);
	};

	const handleClickListenerExpand = () => {
		setIsCardModalOpen((prev) => !prev);
	};

	const handleSwitchChange = () => {
		setIsItemVisible((prev) => !prev);
	};

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	const handleOpenMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuClick = (e) => {
		const drawerToggling = toggleDrawer("right", true);
		handleClose();
		drawerToggling(e);
	};

	return (
		<div
			className={`rounded w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white md:row-auto ${
				isExpanded ? "md:grid-row-end-auto" : "md:h-fit"
			}`}
		>
			<div className="flex gap-3 justify-between items-center border-b border-[color:var(--gray-light-med)]">
				<div className="self-start w-[30%] relative sm:w-[20%] lg:w-[30%]">
					<Image
						src={candle_2}
						alt="image"
						className="rounded-ss object-cover w-full h-full"
					/>
					<button
						className="bg-black bg-opacity-50 border border-white rounded text-white ab
           absolute bottom-1 right-1 px-2 py-1 text-xs font-extralight "
					>
						5 Photos
					</button>
				</div>
				<div className="flex-grow flex flex-col gap-1 py-2">
					<h4 className="font-medium">Candle Set</h4>
					<p className="text-xs font-light">
						<b className=" font-medium">Price: </b>
						$12.99
					</p>
					<p className="text-xs font-light">
						<b className=" font-medium">Qty: </b>5
					</p>
					<p className="text-xs font-light">
						<b className=" font-medium">Category: </b>n/a
					</p>
				</div>
				<div className="mr-2">
					<IconButton onClick={handleOpenMenu}>
						<MoreVertIcon fontSize="small" />
					</IconButton>
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
						<MenuItem onClick={handleMenuClick} sx={{ fontSize: "12px" }}>
							Edit
						</MenuItem>
						<MenuItem onClick={handleClose} sx={{ fontSize: "12px" }}>
							Delete
						</MenuItem>
						<MenuItem onClick={handleClose} sx={{ fontSize: "12px" }}>
							Duplicate
						</MenuItem>
					</StyledMenu>
					<ProductDrawer state={state} toggleDrawer={toggleDrawer} />
				</div>
			</div>
			<div className="flex justify-between items-center p-2">
				<span className="flex gap-4 items-center">
					<p
						className={`text-xs ${
							isItemVisible
								? "text-[color:var(--primary-dark-med)] "
								: "text-[color:var(--gray-text)] "
						}`}
					>
						Visible in store
					</p>
					<IOSSwitch checked={isItemVisible} onChange={handleSwitchChange} />
				</span>

				<div className="hidden lg:block">
					<IconButton
						onClick={handleClickListenerExpand}
						sx={{ marginRight: "8px" }}
					>
						<AspectRatioOutlinedIcon fontSize="small" />
					</IconButton>
					<ProductModal
						isItemVisible={isItemVisible}
						toggleDrawer={toggleDrawer}
						state={state}
						handleSwitchChange={handleSwitchChange}
						isCardModalOpen={isCardModalOpen}
						handleClickListenerExpand={handleClickListenerExpand}
					/>
				</div>
				<div className="lg:hidden">
					<IconButton onClick={handleExpand}>
						{isCardOpen ? (
							<ExpandLessIcon fontSize="small" />
						) : (
							<ExpandMoreOutlinedIcon fontSize="small" />
						)}
					</IconButton>
				</div>
				{/* <div>
					<ButtonFilter name="Edit" handleClick={toggleDrawer("right", true)} />
					<ProductDrawer state={state} toggleDrawer={toggleDrawer} />
				</div> */}
			</div>
			{isCardOpen && (
				<div className="border-t border-[color:var(--gray-light-med)]">
					<div className="p-4 border-b border-[color:var(--gray-light)] ">
						<h4>Product options</h4>
						<div className="px-8 pt-2">
							<h5 className="text-xs">Size:</h5>

							<span className="flex justify-between px-4 font-light text-xs">
								<p>Small</p>
								<p>$0.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs">
								<p>Medium</p>
								<p>$0.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs">
								<p>Large</p>
								<p>$0.00</p>
							</span>
						</div>
						<div className="px-8 pt-2">
							<h5 className="text-xs">Flavor:</h5>
							<span className="flex justify-between px-4 font-light text-xs">
								<p>Vanilla</p>
								<p>$0.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs">
								<p>Chocolate</p>
								<p>$0.50</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs">
								<p>Fudge</p>
								<p>$1.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs">
								<p>Napolean</p>
								<p>$1.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs">
								<p>Strawberry</p>
								<p>$1.00</p>
							</span>
						</div>
					</div>
					<div className="p-4">
						<h4>Questions for customers</h4>
						<div className="px-8 pt-2">
							<p className="font-light text-xs">Do you have any allergies?</p>
							<p className="font-light text-xs">
								Any specific you want us to know?
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ProductCard;
