import React from "react";
import { styled, Box } from "@mui/system";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { IconButton } from "@mui/material";
import { IOSSwitch } from "@/components/common/switches/IOSSwitch";
import ButtonFilter from "@/components/common/buttons/ButtonFilter";
import ProductDrawer from "./ProductDrawer";
import CloseIcon from "@mui/icons-material/Close";
import candle_4 from "@/public/images/temp/candle_4.jpeg";
import candle_2 from "@/public/images/temp/candle_2.jpeg";
import custom_mug from "@/public/images/temp/custom_mug.jpg";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 500,
	maxHeight: "80%",
	overflow: "scroll",
	bgcolor: "var(--white)",
	border: "1px solid var(--black-design-extralight)",
	borderRadius: "8px",
	boxShadow: "var(--modal-shadow)",
	p: 2,
};

function ProductModal({
	isCardModalOpen,
	handleClickListenerExpand,
	isItemVisible,
	toggleDrawer,
	state,
	handleSwitchChange,
}) {
	const handleEditClick = () => {
		toggleDrawer();
		// handleClickListenerExpand();
	};

	return (
		<Modal
			open={isCardModalOpen}
			onClose={handleClickListenerExpand}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style}>
				<div className="flex items-center justify-between border-b mb-2">
					<h3>Product Details</h3>
					<IconButton onClick={handleClickListenerExpand}>
						<CloseIcon fontSize="small" />
					</IconButton>
				</div>
				<div className="w-full relative px-4">
					<h4 className="text-black font-semibold text-sm lg:text-base ">
						Photos:
					</h4>
					<div className="flex overflow-x-scroll w-full gap-2 my-1">
						<div className={`relative h-[8rem] min-w-[8rem] inline-block $`}>
							<Image
								src={candle_4}
								alt="candle image"
								fill
								className="object-cover rounded inline-block"
							/>
						</div>
						<div className={`relative h-[8rem] min-w-[8rem] inline-block $`}>
							<Image
								src={candle_2}
								alt="product image"
								fill
								className="object-cover rounded inline-block"
							/>
						</div>
						<div className={`relative h-[8rem] min-w-[8rem] inline-block $`}>
							<Image
								src={custom_mug}
								alt="product image"
								fill
								className="object-cover rounded inline-block"
							/>
						</div>
					</div>
					<p className="text-xs text-right text-[color:var(--gray)] font-light mt-4">
						3 images uploaded.
					</p>
				</div>
				<div className="flex justify-between items-start relative w-full">
					<div className="flex flex-col gap-2 py-2 px-4">
						<h4 className="font-medium lg:text-base">Candle Set</h4>
						<p className="text-xs font-light lg:text-sm lg:font-medium">
							<b className=" font-medium ">Price: </b>
							$12.99
						</p>
						<p className="text-xs font-light lg:text-sm">
							<b className=" font-medium">Description: </b>
							Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui
							temporibus at ab nostrum adipisci, velit, numquam expedita
							molestias, necessitatibus libero architecto quas consequatur!
						</p>
						<p className="text-xs font-light lg:text-sm">
							<b className=" font-medium">Qty: </b>5
						</p>
						<p className="text-xs font-light lg:text-sm">
							<b className=" font-medium">Category: </b>n/a
						</p>
					</div>
				</div>
				<div className="flex items-center justify-end gap-1 mt-4 border-y py-2 mx-4">
					<p
						className={`text-xs  ${
							isItemVisible
								? "text-[color:var(--primary-dark-med)] "
								: "text-[color:var(--gray-text)] "
						}`}
					>
						Visible in store
					</p>
					<IOSSwitch checked={isItemVisible} onChange={handleSwitchChange} />
				</div>
				<div className="border-t border-[color:var(--gray-light)]">
					<div className="p-4 border-b border-[color:var(--gray-light)] ">
						<h4>Product options</h4>
						<div className="px-8 pt-2">
							<h5 className="text-xs lg:text-sm">Size:</h5>

							<span className="flex justify-between px-4 font-light text-xs lg:text-sm ">
								<span className="flex gap-1">
									<p>Small -</p>
									<p className="font-extralight">(ct. 5)</p>
								</span>
								<p>$0.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs lg:text-sm ">
								<span className="flex gap-1">
									<p>Medium -</p>
									<p className="font-extralight">(ct. 5)</p>
								</span>
								<p>$0.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs lg:text-sm ">
								<span className="flex gap-1">
									<p>Large -</p>
									<p className="font-extralight">(ct. 5)</p>
								</span>
								<p>$0.00</p>
							</span>
						</div>
						<div className="px-8 pt-2">
							<h5 className="text-xs lg:text-sm">Flavor:</h5>
							<span className="flex justify-between px-4 font-light text-xs">
								<span className="flex gap-1">
									<p>Vanilla -</p>
									<p className="font-extralight">(ct. 5)</p>
								</span>
								<p>$0.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs lg:text-sm ">
								<span className="flex gap-1">
									<p>Chocloate -</p>
									<p className="font-extralight">(ct. 5)</p>
								</span>
								<p>$0.50</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs lg:text-sm ">
								<span className="flex gap-1">
									<p>Napolean -</p>
									<p className="font-extralight">(ct. 5)</p>
								</span>
								<p>$1.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs lg:text-sm ">
								<span className="flex gap-1">
									<p>Fudge -</p>
									<p className="font-extralight">(ct. 5)</p>
								</span>
								<p>$1.00</p>
							</span>
							<span className="flex justify-between px-4 font-light text-xs lg:text-sm">
								<span className="flex gap-1">
									<p>Strawberry -</p>
									<p className="font-extralight">(ct. 5)</p>
								</span>
								<p>$1.00</p>
							</span>
						</div>
					</div>
					<div className="p-4">
						<h4>Questions for customers</h4>
						<div className="px-8 pt-2">
							<p className="font-light text-xs lg:text-sm">Do you have any allergies?</p>
							<p className="font-light text-xs lg:text-sm">
								Any specific you want us to know?
							</p>
						</div>
					</div>
				</div>
			</Box>
		</Modal>
	);
}

export default ProductModal;
