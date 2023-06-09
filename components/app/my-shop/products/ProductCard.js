import React, { useState } from "react";
import Image from "next/image";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import { IconButton } from "@mui/material";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ButtonSecondary from "@/components/designs/ButtonSecondary";
import ButtonFilter from "@/components/designs/ButtonFilter";
import { IOSSwitch } from "@/components/designs/IOSSwitch";
import ProductDrawer from "./ProductDrawer";

function ProductCard() {
	const [isCardOpen, setIsCardOpen] = useState(false);
	const [isItemVisible, setIsItemVisible] = useState(false);
	const [state, setState] = useState({
		right: false,
	});

	const handleExpand = () => {
		setIsCardOpen((prev) => !prev);
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

	return (
		<div className="rounded-3xl w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white">
			<div className="flex justify-between items-center border-b border-[color:var(--gray-light-med)] h-[8rem]">
				<div className="flex gap-3 h-full">
					<div className="relative w-2/5 h-full">
						<Image
							src={candle_2}
							alt="image"
							className="h-full object-cover rounded-ss-3xl aspect-square "
						/>
						<button
							className="bg-black bg-opacity-50 border border-white rounded text-white ab
           absolute bottom-1 right-1 px-2 py-1 text-xs "
						>
							5 Photos
						</button>
					</div>

					<div className="py-2">
						<h4>Candle Set</h4>
						<p className="text-xs font-light mt-1">
							<b className=" font-medium">Price: </b>
							$12.99
						</p>
						<p className="text-xs font-light mt-1">
							<b className=" font-medium">Qty: </b>5
						</p>
						<p className="text-xs font-light  mt-1">
							<b className=" font-medium">Category: </b>n/a
						</p>
						<p className="text-xs font-light mt-1">
							<b className=" font-medium">ID: </b>2
						</p>
					</div>
				</div>
				<div>
					<IconButton onClick={handleExpand}>
						<ExpandMoreOutlinedIcon />
					</IconButton>
				</div>
			</div>
			<div className="flex justify-between items-center p-4">
				<span className="flex gap-4 items-center">
					<p
						className={`text-sm ${
							isItemVisible
								? "text-[color:var(--primary-dark-med)] "
								: "text-[color:var(--gray-text)] "
						}`}
					>
						Visible in store
					</p>
					<IOSSwitch checked={isItemVisible} onChange={handleSwitchChange} />
				</span>
				<ButtonFilter name="Edit" handleClick={toggleDrawer("right", true)} />
				<ProductDrawer state={state} toggleDrawer={toggleDrawer} />
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
