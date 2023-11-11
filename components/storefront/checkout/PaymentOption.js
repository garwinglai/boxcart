import React from "react";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import venmo from "@/public/images/icons/venmo.png";
import paypal from "@/public/images/icons/paypal.png";
import zelle from "@/public/images/icons/zelle.png";
import cash from "@/public/images/icons/cash.png";
import credit_card from "@/public/images/icons/credit-card.png";
import Image from "next/image";

function PaymentOption({
  payment,
  handleSelectPaymentMethod,
  selectedPayment,
}) {
  const { paymentMethod } = payment;
  const paymentSelected =
    selectedPayment === "card" ? "stripe" : selectedPayment;

  const icon =
    paymentMethod === "stripe" ? (
      <div className="w-10 h-10 aspect-square relative ">
        <Image
          src={credit_card}
          alt="credit card"
          className="w-full h-full"
          fill
          priority
        />
      </div>
    ) : paymentMethod === "cash" ? (
      <div className="w-10 h-10 aspect-square relative ">
        <Image src={cash} alt="cash" className="w-full h-full" fill priority />
      </div>
    ) : paymentMethod === "paypal" ? (
      <div className="w-10 h-10 aspect-square relative ">
        <Image
          src={paypal}
          alt="paypal"
          className="w-full h-full"
          fill
          priority
        />
      </div>
    ) : paymentMethod === "venmo" ? (
      <div className="w-10 h-10 aspect-square relative ">
        <Image
          src={venmo}
          alt="venmo"
          className="w-full h-full"
          fill
          priority
        />
      </div>
    ) : (
      <div className="w-10 h-10 aspect-square relative ">
        <Image
          src={zelle}
          alt="zelle"
          className="w-full h-full"
          fill
          priority
        />
      </div>
    );

  return (
    <button
      type="button"
      onClick={handleSelectPaymentMethod(payment)}
      className={`p-2 border flex flex-col items-center rounded w-1/4 md:w-1/5 ${
        paymentSelected === paymentMethod
          ? "border-[color:var(--black-design-extralight)] opacity-100 text-[color:var(--black-design-extralight)] bg-[color:var(--purple-bg-soft)]"
          : "text-gray-400 opacity-65"
      } `}
      disabled={paymentSelected === paymentMethod}
    >
      {icon}
      <h3
        className={` text-sm ${
          paymentSelected === paymentMethod ? "font-base" : "font-extralight"
        }`}
      >
        {paymentMethod === "stripe" ? "card" : paymentMethod}
      </h3>
    </button>
  );
}

export default PaymentOption;
