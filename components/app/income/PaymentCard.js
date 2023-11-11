import React from "react";
import Image from "next/image";

function PaymentCard({ paymentData }) {
  const { payment, isEnabled, image } = paymentData;
  console.log("isEnabled", isEnabled)
  return (
    <div className="flex p-4 border shadow-md rounded-lg justify-between items-center flex-grow gap-8 lg:py-4 lg:px-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 aspect-square relative ">
          <Image
            src={image}
            alt={image}
            className="w-full h-full"
            fill
            // priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div>
          <h5>{payment}</h5>
          <p className="text-xs font-extralight">
            {isEnabled ? "enabled" : "disabled"}
          </p>
        </div>
      </div>
      <p className="text-[color:var(--money)]">+ 10,201 $</p>
    </div>
  );
}

export default PaymentCard;
