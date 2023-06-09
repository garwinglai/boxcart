import React, { useState } from "react";
import { ShopSwitch } from "../designs/ShopSwitch";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import TakeoutDiningOutlinedIcon from "@mui/icons-material/TakeoutDiningOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Accordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
// import AccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function ShopFulfillment({ isOwner }) {
	const [fulfillmentType, setFulfillmentType] = useState("pickup");
	const [expanded, setExpanded] = useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const handleSwitch = () => {
		if (fulfillmentType === "delivery") {
			setFulfillmentType("pickup");
			return;
		}

		handleChange("panel1");
		setFulfillmentType("delivery");
		return;
	};

	return (
		<div className="p-4 ">
			<Accordion
				onChange={handleSwitch}
				aria-controls="panel1bh-content"
				id="panel1bh-header"
				sx={{
					backgroundColor: "var(--brown-bg)",
					boxShadow: "none",
					width: "100%",
					borderRadius: "8px",
				}}
			>
				<AccordionSummary
					expandIcon={
						<ShopSwitch
							checked={fulfillmentType === "delivery"}
							onClick={handleSwitch}
						/>
					}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					{/* <div className=""> */}
					{fulfillmentType === "delivery" ? (
						<span className="flex gap-1 items-center">
							<DeliveryDiningOutlinedIcon
								fontSize="small"
								sx={{ color: "var(--brown-text)" }}
							/>
							<p className="text-sm text-[color:var(--brown-text)]  ">
								delivery
							</p>
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
					{/* </div> */}
				</AccordionSummary>
				<AccordionDetails>
					<div className="relative flex-grow">
						<label
							htmlFor="address"
							className="absolute flex items-center gap-2 top-[12px] left-4 text-[color:var(--brown-text)] font-light text-sm"
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
				</AccordionDetails>
			</Accordion>
			{/* {fulfillmentType === "delivery" ? (
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
				<ShopSwitch onClick={handleSwitch} /> */}

			{/* {fulfillmentType === "delivery" && (
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
			)} */}
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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: `1px solid ${theme.palette.divider}`,
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
	({ theme }) => ({
		"& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
			transform: "rotate(0deg)",
		},
		"& .MuiAccordionSummary-content": {
			marginLeft: theme.spacing(1),
		},
	})
);
