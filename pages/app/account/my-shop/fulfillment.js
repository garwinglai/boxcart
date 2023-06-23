import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { TextField } from "@mui/material";
import delivery_truck_icon from "@/public/images/icons/fulfillment/delivery_truck_icon.png";
import Image from "next/image";
import { IOSSwitch } from "@/components/common/switches/IOSSwitch";
import FormGroup from "@mui/material/FormGroup";
import SaveCancelButtons from "@/components/app/design/SaveCancelButtons";
import { isAuth } from "@/helper/client/auth/isAuth";

function Fulfillment() {
	const [fulfillmentType, setFulfillmentType] = useState("Delivery");
	const [deliveryChecked, setDeliveryChecked] = useState(false);
	const [pickupChecked, setPickupChecked] = useState(false);

	const handleChange = (e) => {
		const { value } = e.target;
		console.log(deliveryChecked);
		if (value === "Delivery") {
			setDeliveryChecked((prev) => !prev);
		}

		if (value === "Pickup") {
			setPickupChecked((prev) => !prev);
		}
	};

	return (
		<div className="flex flex-col pb-24 md:pb-32 lg:flex-row lg:p-4 lg:pb-32 ">
			<div className="lg:w-2/5 ">
				<div className="p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] m-4  rounded bg-white md:h-fit lg:mx-0 lg:mt-0">
					<h3>Fulfillment Type</h3>
					<div className="pt-2 mr-4">
						<FormGroup className="flex flex-col gap-2">
							<FormControlLabel
								value="Delivery"
								control={<IOSSwitch />}
								label={<p className="text-sm">Delivery</p>}
								onChange={handleChange}
								checked={deliveryChecked}
								labelPlacement="start"
								className="flex justify-between"
							/>
							<FormControlLabel
								value="Pickup"
								control={<IOSSwitch />}
								onChange={handleChange}
								checked={pickupChecked}
								label={<p className="text-sm">Pickup</p>}
								labelPlacement="start"
								className="flex justify-between"
							/>
						</FormGroup>
					</div>
				</div>
				<div className="hidden lg:block">
					<Image
						src={delivery_truck_icon}
						alt="delivery truck icon"
						className=" opacity-50 mx-auto mt-16"
					/>
					<p className="text-center text-gray-400">Where to next ...</p>
				</div>
			</div>
			<div className="lg:w-3/5 ">
				<div
					className={`p-4  ${
						deliveryChecked ? "visible" : " hidden"
					} shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded bg-white  mb-4 mx-4 lg:mr-0`}
				>
					<div className={`flex justify-between items-center`}>
						<h3>Delivery settings</h3>
						{deliveryChecked ? (
							<span className="border border-[color:var(--primary)] bg-[color:var(--primary-light)] text-[color:var(--primary-dark)] h-fit font-light text-xs rounded-full px-2 py-1">
								Enabled
							</span>
						) : (
							<span className="rounded-full px-2 py-1 text-xs font-light border border-[color:var(--gray-text)] text-[color:var(--gray-text)] bg-[color:var(--gray-light)]">
								Disabled
							</span>
						)}
					</div>
					<div className="py-4 ">
						<FormControl className="w-full">
							<FormLabel id="demo-radio-buttons-group-label" className="mb-2 ">
								<p className=" text-black ">Fee:</p>
							</FormLabel>
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								defaultValue="free"
								name="radio-buttons-group"
								className="flex flex-col gap-2 "
							>
								<FormControlLabel
									value="free"
									control={<Radio />}
									label={<p className="text-black text-sm font-light">Free</p>}
									disabled={deliveryChecked ? false : true}
								/>
								<div className="flex justify-between w-full">
									<FormControlLabel
										value="flat"
										control={<Radio />}
										label={
											<p className="text-black text-sm font-light">Flat fee</p>
										}
										disabled={deliveryChecked ? false : true}
									/>
									<TextField
										size="small"
										className="w-1/6"
										type="number"
										label="$"
										id="flat-fee-input"
										disabled={deliveryChecked ? false : true}
									/>
								</div>
								<div className="flex justify-between w-full">
									<FormControlLabel
										value="percetange"
										control={<Radio />}
										label={
											<p className="text-black text-sm font-light">
												Percentage fee
											</p>
										}
										disabled={deliveryChecked ? false : true}
									/>
									<TextField
										size="small"
										className="w-1/6"
										type="number"
										label="%"
										id="percentage-fee-input"
										disabled={deliveryChecked ? false : true}
									/>
								</div>
								<div className="flex justify-between w-full">
									<FormControlLabel
										value="distance"
										control={<Radio />}
										label={
											<p className="text-black text-sm font-light">
												By distance
											</p>
										}
										disabled={deliveryChecked ? false : true}
									/>
									<TextField
										size="small"
										className="w-1/6"
										type="number"
										label="$"
										id="distance-fee-input"
										disabled={deliveryChecked ? false : true}
									/>
								</div>
							</RadioGroup>
						</FormControl>
						<div className="flex mt-8 gap-2 items-center">
							<p className="text-gray-700 text-xs">
								Connect third party delivery.
							</p>
							<span className=" px-1 text-xs rounded-full bg-[color:var(--gray-light)] border border-[color:var(--gray-light-med)] text-[color:var(--gray-light-med)]">
								Coming soon
							</span>
						</div>
					</div>
				</div>
				<div
					className={`p-4   ${
						pickupChecked ? "visible" : "hidden"
					} shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded bg-white mx-4 lg:mr-0`}
				>
					<div className={`flex justify-between items-center`}>
						<h3>Pickup settings</h3>
						{pickupChecked ? (
							<span className="border border-[color:var(--primary)] bg-[color:var(--primary-light)] text-[color:var(--primary-dark)] h-fit font-light text-xs rounded-full px-2 py-1">
								Enabled
							</span>
						) : (
							<span className="rounded-full px-2 py-1 text-xs font-light border border-[color:var(--gray)] text-[color:var(--gray-text)]">
								Disabled
							</span>
						)}
					</div>
					<div className="w-full py-4">
						<h4 className="text-sm">Address:</h4>
						<p className="text-black font-light text-xs mt-1">
							123 W Adams Blvd, Los Angeles CA 91234
						</p>
						<div className="text-right">
							<button
								className="text-[color:var(--primary)] underline text-sm"
								disabled={pickupChecked ? false : true}
							>
								change
							</button>
						</div>
					</div>
					<TextField
						id="custom-note"
						name="custom-note"
						label="Note to customer ..."
						multiline
						fullWidth
						disabled={pickupChecked ? false : true}
						placeholder="i.e. Arrive 10 minutes ahead of time and send me a text before ringing the doorbell."
						rows={4}
					/>
				</div>
			</div>
			{/* <SaveCancelButtons /> */}
		</div>
	);
}

export default Fulfillment;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

Fulfillment.getLayout = function getLayout(
	page,
	pageTitle,
	pageIcon,
	pageRoute,
	mobilePageRoute
) {
	return (
		<AppLayout
			pageTitle={pageTitle}
			pageIcon={pageIcon}
			pageRoute={pageRoute}
			mobilePageRoute={mobilePageRoute}
		>
			{page}
		</AppLayout>
	);
};

Fulfillment.pageTitle = "Fulfillment";
Fulfillment.pageIcon = <DeliveryDiningRoundedIcon />;
Fulfillment.pageRoute = "fulfillment";
Fulfillment.mobilePageRoute = "fulfillment";
