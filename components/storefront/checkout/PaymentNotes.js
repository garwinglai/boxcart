import React from "react";

function PaymentNotes({ selectedPaymentDetails, isOrderSubmittedPage }) {
  const { paymentInstructions, paymentMethod, paymentAccount } =
    selectedPaymentDetails;

  console.log("paymentNotes", selectedPaymentDetails);
  return (
    <div>
      {!isOrderSubmittedPage && <h3 className="font-medium">Payment:</h3>}
      <div className="p-2 pt-2 lg:px-12">
        <div className="flex justify-between gap-4 mb-2">
          <h4>Payment method:</h4>
          <p className=" text-sm font-light">{paymentMethod}</p>
        </div>
        {paymentAccount && (
          <div className="flex justify-between gap-4 mb-2">
            <h4>Account:</h4>
            <p className=" text-sm font-light">{paymentAccount}</p>
          </div>
        )}
        <div className="flex justify-between gap-16">
          <h4>Instructions:</h4>
          <p className="text-right text-sm font-light">{paymentInstructions}</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentNotes;
