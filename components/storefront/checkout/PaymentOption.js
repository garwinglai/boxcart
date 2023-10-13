import React from "react";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";

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
      <CreditCardOutlinedIcon
        fontSize="small"
        sx={{
          color:
            paymentSelected === paymentMethod
              ? "var(--black-design-extralight"
              : "gray",
        }}
      />
    ) : paymentMethod === "cash" ? (
      <AttachMoneyOutlinedIcon
        fontSize="small"
        sx={{
          color:
            paymentSelected === paymentMethod
              ? "var(--black-design-extralight"
              : "gray",
        }}
      />
    ) : (
      <AccountBalanceOutlinedIcon
        fontSize="small"
        sx={{
          color:
            paymentSelected === paymentMethod
              ? "var(--black-design-extralight"
              : "gray",
        }}
      />
    );

  return (
    <button
      type="button"
      onClick={handleSelectPaymentMethod(payment)}
      className={`p-2 border rounded w-1/4 md:w-1/5 ${
        paymentSelected === paymentMethod
          ? "border-[color:var(--black-design-extralight)] text-[color:var(--black-design-extralight)] bg-[color:var(--brown-bg-soft)]"
          : "text-gray-400"
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
