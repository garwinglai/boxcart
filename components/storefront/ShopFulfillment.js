import React, { useState } from "react";
import { ShopSwitch } from "../designs/ShopSwitch";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import TakeoutDiningOutlinedIcon from "@mui/icons-material/TakeoutDiningOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

function ShopFulfillment({ isOwner }) {
	const [fulfillmentType, setFulfillmentType] = useState("pickup");

	const handleSwitch = () => {
		if (fulfillmentType === "delivery") {
			setFulfillmentType("pickup");
			return;
		}

		setFulfillmentType("delivery");
		return;
	};

	return (
		<div className="p-4">
			<div className=" py-2 px-4 flex justify-between bg-[color:var(--brown-bg)] rounded-lg ">
				{fulfillmentType === "delivery" ? (
					<span className="flex gap-1 items-center">
						<DeliveryDiningOutlinedIcon
							fontSize="small"
							sx={{ color: "var(--brown-text)" }}
						/>
						<p className="text-sm text-[color:var(--brown-text)]">delivery</p>
					</span>
				) : (
					<span className="flex gap-1 items-center">
						<TakeoutDiningOutlinedIcon
							fontSize="small"
							sx={{ color: "var(--brown-text)" }}
						/>
						<p className="text-sm text-[color:var(--brown-text)]">pickup</p>
					</span>
				)}
				<ShopSwitch onClick={handleSwitch} />
			</div>
			{fulfillmentType === "delivery" && (
				<div className="relative flex-grow py-2">
					<label
						htmlFor="address"
						className="absolute flex items-center gap-2 top-[18px] left-4 text-[color:var(--brown-text)] font-light text-sm"
					>
						<LocationOnOutlinedIcon fontSize="small" />
					</label>
					<input
						type="text"
						name="address"
						id="address"
						placeholder="deliver to: address"
						className="border border-[color:var(--brown-bg)] rounded-lg w-full py-3 placeholder:text-[color:var(--brown-text)] placeholder:text-sm  font-light text-sm indent-10"
					/>
				</div>
			)}
			<div className="px-4 py-2 mt-2 flex justify-between items-center border border-[color:var(--gray-light-med)] rounded-lg ">
				<span className="flex flex-col">
					<p className="font-extralight text-[color:var(--gray-text)] ">
						Get it by
					</p>
					<p className="text-[color:var(--black-design-extralight)] text-sm font-light ">
						Feb 28, 2023 @ 1.24pm
					</p>
				</span>
				<span className="border border-[color:var(--gray-light-med)] h-4 "></span>
				<button className="text-sm underline text-[color:var(--black-design-extralight)] font-light ">
					change
				</button>
			</div>
		</div>
	);
}

export default ShopFulfillment;
