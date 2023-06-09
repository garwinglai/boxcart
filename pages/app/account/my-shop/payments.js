import React, { useState } from "react";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import AppLayout from "@/components/layouts/AppLayout";
import MyShopMenu from "@/components/layouts/MyShopMenu";
import { IOSSwitch } from "@/components/designs/IOSSwitch";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import Link from "next/link";
import FormGroup from "@mui/material/FormGroup";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { TextField } from "@mui/material";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import SaveCancelButtons from "@/components/app/SaveCancelButtons";
import cash_icon from "@/public/images/icons/cash_icon.png";
import Image from "next/image";
import ButtonSecondary from "@/components/designs/ButtonSecondary";

function Payments() {
	const [hasDeposit, setHasDeposit] = useState(false);
	const [hasTips, setHasTips] = useState(false);
	const [tipType, setTipType] = useState("");
	const [useCard, setUseCard] = useState(false);
	const [useCash, setUseCash] = useState(false);
	const [cashPayInstructions, setCashPayInstructions] = useState(
		"Please provide cash upon receiving order in person."
	);
	const [useZelle, setUseZelle] = useState(false);
	const [zellePayInstructions, setZellePayInstructions] = useState(
		"Please include your order ID in payment notes. Payment must be completed in 15 minutes."
	);
	const [useCashApp, setUseCashApp] = useState(false);
	const [cashAppPayInstructions, setCashAppPayInstructions] = useState(
		"Please include your order ID in payment notes. Payment must be completed in 15 minutes."
	);
	const [useVenmo, setUseVenmo] = useState(false);
	const [venmoPayInstructions, setVenmoPayInstructions] = useState(
		"Please include your order ID in payment notes. Payment must be completed in 15 minutes."
	);
	const [usePayPal, setUsePayPal] = useState(false);
	const [payPalPayInstructions, setPayPalPayInstructions] = useState(
		"Please include your order ID in payment notes. Payment must be completed in 15 minutes."
	);

	const handleChange = (e) => {
		const { value } = e.target;

		if (value === "deposit") {
			setHasDeposit((prev) => !prev);
		}

		if (value === "tips") {
			setHasTips((prev) => !prev);
		}

		if (value === "card") {
			setUseCard((prev) => !prev);
		}

		if (value === "cash") {
			setUseCash((prev) => !prev);
		}

		if (value === "zelle") {
			setUseZelle((prev) => !prev);
		}

		if (value === "cash-app") {
			setUseCashApp((prev) => !prev);
		}

		if (value === "venmo") {
			setUseVenmo((prev) => !prev);
		}

		if (value === "paypal") {
			setUsePayPal((prev) => !prev);
		}
	};

	const handleTipType = (e) => {
		const { value } = e.target;
		setTipType(value);
	};

	return (
		<div className="pb-32 pt-4 lg:grid lg:grid-cols-2 lg:auto-rows-min lg:gap-4 lg:px-4 lg:pt-4  ">
			<div className="p-4 mx-4 mb-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded-3xl bg-white lg:mx-0 lg:mb-0 ">
				<div>
					<div className="flex justify-between pr-4">
						<h2>Deposits</h2>
						<IOSSwitch
							checked={hasDeposit}
							onChange={handleChange}
							value="deposit"
						/>
					</div>
					<p className="text-gray-800 font-light text-sm">
						Deposits will be charged immediately. The rest of the payment can be
						charged on the live orders page.
					</p>
					<div
						className={`transition-opactiy ${
							hasDeposit
								? "visible opacity-100 px-4 mt-4"
								: "invisible h-0 opacity-0"
						} `}
					>
						<FormControl className="w-full ">
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								defaultValue="free"
								name="radio-buttons-group"
								className="flex flex-col gap-2 "
							>
								<div className="flex justify-between w-full">
									<FormControlLabel
										value="flat"
										control={<Radio />}
										label={<p className="text-black">Flat fee</p>}
									/>
									<div className="w-1/6 flex gap-2 items-center">
										<input
											type="number"
											name="flat-fee"
											id="flat-fee"
											className={`w-2/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-3 font-light text-sm`}
										/>
										<label htmlFor="flat-fee">$</label>
									</div>
								</div>
								<div className="flex justify-between w-full">
									<FormControlLabel
										value="percetange"
										control={<Radio />}
										label={<p className="text-black">Percentage fee</p>}
									/>
									<div className="w-1/6 flex gap-2 items-center">
										<input
											type="number"
											name="percentage-fee"
											id="percentage-fee"
											className={`w-2/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-3 font-light text-sm`}
										/>
										<label htmlFor="percentage-fee">%</label>
									</div>
								</div>
							</RadioGroup>
						</FormControl>
					</div>
				</div>
			</div>
			<div className="p-4 mx-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded-3xl bg-white lg:mx-0">
				<div className="flex justify-between pr-4">
					<h2>Tips</h2>
					<IOSSwitch checked={hasTips} onChange={handleChange} value="tips" />
				</div>
				<p className="text-gray-800 font-light text-sm">
					Accept tips from customers.
				</p>
				<div
					className={`transition-opactiy ${
						hasTips
							? "visible opacity-100 px-4 mt-4"
							: "invisible h-0 opacity-0"
					} `}
				>
					<FormControl className="w-full ">
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							defaultValue="free"
							name="radio-buttons-group"
							className="flex flex-col gap-2 "
							value={tipType}
							onChange={handleTipType}
						>
							<div>
								<div className="flex justify-between w-full">
									<FormControlLabel
										value="flat"
										control={<Radio />}
										label={
											<div className="flex items-center">
												<AttachMoneyOutlinedIcon
													fontSize="small"
													sx={{ color: "black" }}
												/>
												<p className="text-black">Flat fee</p>
											</div>
										}
									/>
								</div>
								<div
									className={`${
										tipType === "flat"
											? " transition-opacity duration-300 h-auto opacity-100 flex gap-4"
											: " h-0 opacity-0"
									}`}
								>
									<input
										type="number"
										name="flat-tip-1"
										id="flat-tip-1"
										placeholder="$"
										className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
									/>
									<input
										type="number"
										name="flat-tip-2"
										id="flat-tip-2"
										placeholder="$"
										className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
									/>
									<input
										type="number"
										name="flat-tip-3"
										id="flat-tip-3"
										placeholder="$"
										className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between w-full">
									<FormControlLabel
										value="percentage"
										control={<Radio />}
										label={
											<div className="flex items-center">
												<PercentOutlinedIcon
													fontSize="small"
													sx={{ color: "black" }}
												/>
												<p className="text-black">Percentage fee</p>
											</div>
										}
									/>
								</div>
								<div
									className={`${
										tipType === "percentage"
											? " transition-opacity duration-300 h-auto opacity-100 flex gap-4"
											: " h-0 opacity-0"
									}`}
								>
									<input
										type="number"
										name="percent-tip-1"
										id="percent-tip-1"
										placeholder="%"
										className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
									/>
									<input
										type="number"
										name="percent-tip-2"
										id="percent-tip-2"
										placeholder="%"
										className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
									/>
									<input
										type="number"
										name="percent-tip-3"
										id="percent-tip-3"
										placeholder="%"
										className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
									/>
								</div>
							</div>
						</RadioGroup>
					</FormControl>
				</div>
			</div>
			<div className="px-4 pt-4 m-4  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded-3xl bg-white lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:m-0">
				<h2>Payments</h2>
				<p className="text-gray-800 font-light text-sm">
					Allow your customers the flexibility to pay in any way.
				</p>
				<div className="p-4">
					<div className="border-b border-[color:var(--gray-light)] pb-2">
						<div className="flex justify-between mb-2">
							<div>
								<div className="flex gap-1">
									<CreditCardOutlinedIcon sx={{ color: "black" }} />
									<p className="text-black">Credit/Debit Card</p>
								</div>
								<p className="text-sm text-gray-500">
									Increase your sales by allowing your customers to pay with
									credit card.
								</p>
							</div>
							<IOSSwitch
								onChange={handleChange}
								value="card"
								checked={useCard}
							/>
						</div>
						<div
							className={`transition-opactiy duration-300 ${
								useCard ? "visible opacity-100" : "invisible h-0 opacity-0"
							} `}
						>
							<button
								className={` ${
									useCard
										? "visible opacity-100 bg-[color:var(--primary-light-med)] px-4 py-2 rounded-md text-sm font-normal border border-purple-800 "
										: "hidden h-0 opacity-0 aboslute"
								} `}
							>
								Setup Credit/Debit Card
							</button>
						</div>
					</div>
					<div className="border-b border-[color:var(--gray-light)] py-4">
						<div className="flex justify-between">
							<div>
								<div className="flex gap-1">
									<AttachMoneyOutlinedIcon sx={{ color: "black" }} />
									<p className="text-black">Cash</p>
								</div>
								<p className="text-sm text-gray-500">
									Cash payments are made in person.
								</p>
							</div>
							<IOSSwitch
								onChange={handleChange}
								value="cash"
								checked={useCash}
							/>
						</div>
						<div
							className={`${
								useCash
									? " transition-opacity duration-300 h-auto opacity-100"
									: " h-0 opacity-0"
							}`}
						>
							<div className="my-2">
								<label htmlFor="cash-instructions-input" className="text-sm">
									Instructions:
								</label>
								<textarea
									value={cashPayInstructions}
									type="text"
									id="cash-instructions-input"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-sm overflow-hidden`}
								/>
							</div>
						</div>
					</div>
					<div className="border-b border-[color:var(--gray-light)] py-4">
						<div className="flex justify-between">
							<div>
								<div className="flex gap-1">
									<AttachMoneyOutlinedIcon sx={{ color: "black" }} />
									<p className="text-black">Venmo</p>
								</div>
								<p className="text-sm text-gray-500">
									Allow payments via Venmo.
								</p>
							</div>
							<IOSSwitch
								onChange={handleChange}
								value="venmo"
								checked={useVenmo}
							/>
						</div>
						<div
							className={`${
								useVenmo
									? " transition-opacity duration-300 h-auto opacity-100"
									: " h-0 opacity-0"
							}`}
						>
							<div className="my-2">
								<label htmlFor="venmo-account" className="text-sm">
									Venmo Account:
								</label>
								<input
									type="text"
									id="venmo-account"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
								/>
							</div>
							<div className="my-2">
								<label htmlFor="venmo-instructions-input" className="text-sm">
									Instructions:
								</label>
								<textarea
									value={venmoPayInstructions}
									type="text"
									id="venmo-instructions-input"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-sm overflow-hidden`}
								/>
							</div>
						</div>
					</div>
					<div className="border-b border-[color:var(--gray-light)] py-4">
						<div className="flex justify-between">
							<div>
								<div className="flex gap-1">
									<AccountBalanceOutlinedIcon sx={{ color: "black" }} />
									<p className="text-black">Paypal</p>
								</div>
								<p className="text-sm text-gray-500">
									Allow payments via Paypal.
								</p>
							</div>
							<IOSSwitch
								onChange={handleChange}
								value="paypal"
								checked={usePayPal}
							/>
						</div>
						<div
							className={`${
								usePayPal
									? " transition-opacity duration-300 h-auto opacity-100"
									: " h-0 opacity-0"
							}`}
						>
							<div className="my-2">
								<label htmlFor="paypal-account" className="text-sm">
									Paypal Account: paypal.me/
								</label>
								<input
									type="text"
									id="paypal-account"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
								/>
							</div>
							<div className="pb-2">
								<p className="text-sm font-light text-[color:var(--gray-text)]">
									Offer your customers your Paypal link for simple payment.
								</p>
								<Link
									href="https://www.paypal.com/paypalme/"
									className="text-sm font-light text-[color:var(--secondary-dark-med)] underline"
								>
									Claim your paypal.me link.
								</Link>
							</div>
							<div className="my-2">
								<label htmlFor="paypal-instructions-input" className="text-sm">
									Instructions:
								</label>
								<textarea
									value={payPalPayInstructions}
									type="text"
									id="paypal-instructions-input"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-sm overflow-hidden`}
								/>
							</div>
						</div>
					</div>
					<div className="border-b border-[color:var(--gray-light)] py-4">
						<div className="flex justify-between">
							<div>
								<div className="flex gap-1">
									<AccountBalanceOutlinedIcon sx={{ color: "black" }} />
									<p className="text-black">Zelle</p>
								</div>
								<p className="text-sm text-gray-500">
									Allow payments via Zelle.
								</p>
							</div>
							<IOSSwitch
								onChange={handleChange}
								value="zelle"
								checked={useZelle}
							/>
						</div>
						<div
							className={`${
								useZelle
									? " transition-opacity duration-300 h-auto opacity-100"
									: " h-0 opacity-0"
							}`}
						>
							<div className="my-2">
								<label htmlFor="zelle-account" className="text-sm">
									Zelle Account:
								</label>
								<input
									type="text"
									id="zelle-account"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
								/>
							</div>
							<div className="my-2">
								<label htmlFor="zelle-instructions-input" className="text-sm">
									Instructions:
								</label>
								<textarea
									value={zellePayInstructions}
									type="text"
									id="zelle-instructions-input"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-sm overflow-hidden`}
								/>
							</div>
						</div>
					</div>
					<div className="border-b border-[color:var(--gray-light)] py-4">
						<div className="flex justify-between">
							<div>
								<div className="flex gap-1">
									<MonetizationOnOutlinedIcon sx={{ color: "black" }} />
									<p className="text-black">Cash App</p>
								</div>
								<p className="text-sm text-gray-500">
									Allow payments via Cash App.
								</p>
							</div>
							<IOSSwitch
								onChange={handleChange}
								value="cash-app"
								checked={useCashApp}
							/>
						</div>
						<div
							className={`${
								useCashApp
									? " transition-opacity duration-300 h-auto opacity-100"
									: " h-0 opacity-0"
							}`}
						>
							<div className="my-2">
								<label htmlFor="cash-app-account" className="text-sm">
									Cash App Account:
								</label>
								<input
									type="text"
									id="cash-app-account"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-sm`}
								/>
							</div>
							<div className="my-2">
								<label
									htmlFor="cash-app-instructions-input"
									className="text-sm"
								>
									Instructions:
								</label>
								<textarea
									value={cashAppPayInstructions}
									type="text"
									id="cash-app-instructions-input"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-sm overflow-hidden`}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<SaveCancelButtons />
		</div>
	);
}

export default Payments;

Payments.getLayout = function getLayout(
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
			{/* <div className="sticky top-0 z-50 bg-white">
				<MyShopMenu pageTitle={pageTitle} />
			</div> */}
			{/* <MobileMyShopMenuFab pageTitle={pageTitle} /> */}
			{page}
		</AppLayout>
	);
};

Payments.pageTitle = "My Shop / Payments";
Payments.pageIcon = <AddCardRoundedIcon />;
Payments.pageRoute = "payments";
Payments.mobilePageRoute = "payments";
