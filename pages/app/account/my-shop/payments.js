import React, { useState } from "react";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import AppLayout from "@/components/layouts/AppLayout";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import Link from "next/link";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import SaveCancelButtons from "@/components/app/design/SaveCancelButtons";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { isAuth } from "@/helper/client/auth/isAuth";
import CurrencyInput from "react-currency-input-field";

function Payments({ userAccount }) {
  const { enableTips, tips, deposit, acceptedPayments } = userAccount || {};

  const [hasDeposit, setHasDeposit] = useState(false);
  const [hasTips, setHasTips] = useState(enableTips ? enableTips : false);
  const [tipType, setTipType] = useState(
    enableTips ? (tips.type ? tips.type : "dollar") : "dollar"
  );
  const [tipValuesDollar, setTipValuesDollar] = useState({
    tipOneDollar: enableTips
      ? tips.type === "dollar"
        ? tips.tipOneIntPenny
          ? tips.tipOneIntPenny
          : ""
        : ""
      : "",
    tipTwoDollar: enableTips
      ? tips.type === "dollar"
        ? tips.tipTwoIntPenny
          ? tips.tipTwoIntPenny
          : ""
        : ""
      : "",
    tipThreeDollar: enableTips
      ? tips.type === "dollar"
        ? tips.tipThreeIntPenny
          ? tips.tipThreeIntPenny
          : ""
        : ""
      : "",
  });
  const [tipValuesPercentage, setTipValuesPercentage] = useState({
    tipOnePercentage: enableTips
      ? tips.type === "percentage"
        ? tips.tipOneIntPenny
          ? tips.tipOneIntPenny
          : ""
        : ""
      : "",
    tipTwoPercentage: enableTips
      ? tips.type === "percentage"
        ? tips.tipTwoIntPenny
          ? tips.tipTwoIntPenny
          : ""
        : ""
      : "",
    tipThreePercentage: enableTips
      ? tips.type === "percentage"
        ? tips.tipThreeIntPenny
          ? tips.tipThreeIntPenny
          : ""
        : ""
      : "",
  });
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

  const { tipOneDollar, tipTwoDollar, tipThreeDollar } = tipValuesDollar;
  const { tipOnePercentage, tipTwoPercentage, tipThreePercentage } =
    tipValuesPercentage;

  const handleChangeInPayment = (e) => {
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

  const handleChangeTipValuesDollar = (value, name) => {
    console.log(value, name);
    setTipValuesDollar((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTipValuesPercentage = (value, name) => {
    console.log(value, name);
    setTipValuesPercentage((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pb-32 pt-4 lg:grid lg:grid-cols-2 lg:auto-rows-min lg:gap-4 lg:px-4 lg:pt-4  ">
      <div className="p-4 mx-4 mb-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded bg-white lg:mx-0 lg:mb-0 ">
        <div>
          <div className="flex justify-between pr-4">
            <h3>Deposits</h3>
            <IOSSwitch
              checked={hasDeposit}
              onChange={handleChangeInPayment}
              value="deposit"
            />
          </div>
          <p className="text-gray-800 font-light text-xs mt-2">
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
                    label={
                      <p className="text-black text-xs font-light">Flat fee</p>
                    }
                  />
                  <div className="w-1/6 flex gap-2 items-center">
                    <input
                      type="number"
                      name="flat-fee"
                      id="flat-fee"
                      className={`w-2/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-3 font-light text-xs`}
                    />
                    <label htmlFor="flat-fee">$</label>
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  <FormControlLabel
                    value="percetange"
                    control={<Radio />}
                    label={
                      <p className="text-black text-xs font-light">
                        Percentage fee
                      </p>
                    }
                  />
                  <div className="w-1/6 flex gap-2 items-center">
                    <input
                      type="number"
                      name="percentage-fee"
                      id="percentage-fee"
                      className={`w-2/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-3 font-light text-xs`}
                    />
                    <label htmlFor="percentage-fee">%</label>
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="p-4 mx-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded bg-white lg:mx-0">
        <div className="flex justify-between pr-4">
          <h3>Tips</h3>
          <IOSSwitch
            checked={hasTips}
            onChange={handleChangeInPayment}
            value="tips"
          />
        </div>
        <p className="text-gray-800 font-light text-xs mt-2">
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
                    value="dollar"
                    control={<Radio />}
                    label={
                      <div className="flex items-center">
                        <AttachMoneyOutlinedIcon
                          fontSize="small"
                          sx={{ color: "black" }}
                        />
                        <p className="text-black font-light text-xs">
                          Flat fee
                        </p>
                      </div>
                    }
                  />
                </div>
                <div
                  className={`${
                    tipType === "dollar"
                      ? " transition-opacity duration-300 h-auto opacity-100 flex gap-4"
                      : " h-0 opacity-0"
                  }`}
                >
                  <CurrencyInput
                    name="tipOneDollar"
                    required
                    placeholder="$"
                    disabled={tipType == "dollar" ? false : true}
                    value={tipOneDollar}
                    onValueChange={handleChangeTipValuesDollar}
                    decimalsLimit={2}
                    prefix="$"
                    className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                  />
                  <CurrencyInput
                    name="tipTwoDollar"
                    required
                    placeholder="$"
                    value={tipTwoDollar}
                    onValueChange={handleChangeTipValuesDollar}
                    disabled={tipType == "dollar" ? false : true}
                    decimalsLimit={2}
                    prefix="$"
                    className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                  />
                  <CurrencyInput
                    name="tipThreeDollar"
                    required
                    placeholder="$"
                    value={tipThreeDollar}
                    onValueChange={handleChangeTipValuesDollar}
                    disabled={tipType == "dollar" ? false : true}
                    decimalsLimit={2}
                    prefix="$"
                    className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
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
                        <p className="text-black font-light text-xs">
                          Percentage fee
                        </p>
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
                  <CurrencyInput
                    name="tipOnePercentage"
                    required
                    placeholder="%"
                    value={tipOnePercentage}
                    onValueChange={handleChangeTipValuesPercentage}
                    disabled={tipType == "percentage" ? false : true}
                    decimalsLimit={2}
                    suffix="%"
                    className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                  />
                  <CurrencyInput
                    name="tipTwoPercentage"
                    required
                    placeholder="%"
                    value={tipTwoPercentage}
                    onValueChange={handleChangeTipValuesPercentage}
                    disabled={tipType == "percentage" ? false : true}
                    decimalsLimit={2}
                    suffix="%"
                    className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                  />
                  <CurrencyInput
                    name="tipThreePercentage"
                    required
                    placeholder="%"
                    value={tipThreePercentage}
                    onValueChange={handleChangeTipValuesPercentage}
                    disabled={tipType == "percentage" ? false : true}
                    decimalsLimit={2}
                    suffix="%"
                    className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                  />
                </div>
              </div>
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="px-4 pt-4 m-4  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded bg-white lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:m-0">
        <h3>Payments</h3>
        <p className="text-gray-800 font-light text-xs mt-2 mb-4">
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
                <p className="text-xs  text-gray-500">
                  Increase your sales by allowing your customers to pay with
                  credit card.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
                value="card"
                checked={useCard}
              />
            </div>
            <div
              className={`transition-opactiy duration-300 ${
                useCard ? "visible opacity-100" : "invisible h-0 opacity-0"
              } `}
            >
              <div className="w-fit mt-4 mb-4">
                <ButtonPrimary name="Setup Credit/Debit Card" />
              </div>
            </div>
          </div>
          <div className="border-b border-[color:var(--gray-light)] py-4">
            <div className="flex justify-between">
              <div>
                <div className="flex gap-1">
                  <AttachMoneyOutlinedIcon sx={{ color: "black" }} />
                  <p className="text-black">Cash</p>
                </div>
                <p className="text-xs text-gray-500">
                  Cash payments are made in person.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
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
                <label htmlFor="cash-instructions-input" className="text-xs">
                  Instructions:
                </label>
                <textarea
                  // value={cashPayInstructions}

                  type="text"
                  id="cash-instructions-input"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-xs overflow-hidden`}
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
                <p className="text-xs text-gray-500">
                  Allow payments via Venmo.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
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
                <label htmlFor="venmo-account" className="text-xs">
                  Venmo Account:
                </label>
                <input
                  type="text"
                  id="venmo-account"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                />
              </div>
              <div className="my-2">
                <label htmlFor="venmo-instructions-input" className="text-xs">
                  Instructions:
                </label>
                <textarea
                  // value={venmoPayInstructions}
                  type="text"
                  id="venmo-instructions-input"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-xs overflow-hidden`}
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
                <p className="text-xs text-gray-500">
                  Allow payments via Paypal.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
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
                <label htmlFor="paypal-account" className="text-xs">
                  Paypal Account: paypal.me/
                </label>
                <input
                  type="text"
                  id="paypal-account"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                />
              </div>
              <div className="pb-2">
                <p className="text-xs font-light text-[color:var(--gray-text)]">
                  Offer your customers your Paypal link for simple payment.
                </p>
                <Link
                  href="https://www.paypal.com/paypalme/"
                  className="text-xs font-light text-[color:var(--secondary-dark-med)] underline"
                >
                  Claim your paypal.me link.
                </Link>
              </div>
              <div className="my-2">
                <label htmlFor="paypal-instructions-input" className="text-xs">
                  Instructions:
                </label>
                <textarea
                  // value={payPalPayInstructions}
                  type="text"
                  id="paypal-instructions-input"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-xs overflow-hidden`}
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
                <p className="text-xs text-gray-500">
                  Allow payments via Zelle.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
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
                <label htmlFor="zelle-account" className="text-xs">
                  Zelle Account:
                </label>
                <input
                  type="text"
                  id="zelle-account"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                />
              </div>
              <div className="my-2">
                <label htmlFor="zelle-instructions-input" className="text-xs">
                  Instructions:
                </label>
                <textarea
                  // value={zellePayInstructions}
                  type="text"
                  id="zelle-instructions-input"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-xs overflow-hidden`}
                />
              </div>
            </div>
          </div>
          {/* <div className="border-b border-[color:var(--gray-light)] py-4">
						<div className="flex justify-between">
							<div>
								<div className="flex gap-1">
									<MonetizationOnOutlinedIcon sx={{ color: "black" }} />
									<p className="text-black">Cash App</p>
								</div>
								<p className="text-xs text-gray-500">
									Allow payments via Cash App.
								</p>
							</div>
							<IOSSwitch
								onChange={handleChangeInPayment}
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
								<label htmlFor="cash-app-account" className="text-xs">
									Cash App Account:
								</label>
								<input
									type="text"
									id="cash-app-account"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
								/>
							</div>
							<div className="my-2">
								<label
									htmlFor="cash-app-instructions-input"
									className="text-xs"
								>
									Instructions:
								</label>
								<textarea
									value={cashAppPayInstructions}
									type="text"
									id="cash-app-instructions-input"
									className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-xs overflow-hidden`}
								/>
							</div>
						</div>
					</div> */}
        </div>
      </div>

      {/* <SaveCancelButtons /> */}
    </div>
  );
}

export default Payments;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;
    let serializedAccount = {};

    try {
      const userAccount = await prisma.account.findUnique({
        where: {
          email,
        },
        include: {
          tips: true,
          deposit: true,
          acceptedPayments: true,
        },
      });

      serializedAccount = JSON.parse(JSON.stringify(userAccount));
    } catch (error) {
      console.log("serversideprops checklist error:", error);
    }
    return {
      props: {
        userSession,
        userAccount: serializedAccount,
      },
    };
  });
}

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
      {page}
    </AppLayout>
  );
};

Payments.pageTitle = "Payments";
Payments.pageIcon = <AddCardRoundedIcon />;
Payments.pageRoute = "payments";
Payments.mobilePageRoute = "payments";
