import React from "react";

import Image from "next/image";
import ButtonPrimary from "../global/buttons/ButtonPrimary";
import check_icon from "@/public/images/icons/check_icon.png";

function PackageComponent({ item, isPaymentByAnnual }) {
  const {
    id,
    planName,
    description,
    icon,
    priceMonth,
    priceYear,
    pricePerMonthDisplay,
    pricePerYearDisplay,
    features,
  } = item;

  return (
    <div className="rounded bg-white w-full shadow p-4">
      <div className="border-b pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src={icon} alt="startup icon" className="w-8 h-8" />
            <h4>{planName}</h4>
          </div>
          <div className="flex flex-col items-end">
            <p className="font-medium text-sm">
              {isPaymentByAnnual ? pricePerYearDisplay : pricePerMonthDisplay}
            </p>
            <p className="font-light text-xs">
              {isPaymentByAnnual
                ? `$${(priceYear * 12) / 100} / year`
                : `$${(priceMonth * 12) / 100} / year`}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 mt-4">
          <p className="text-left text-xs font-light">{description}</p>

          <div>
            <ButtonPrimary name="coming soon" disabled={id === 2 || id === 1} />
          </div>
        </div>
      </div>

      <ul className="p-4 flex flex-col gap-2">
        {features.map((feature, index) => {
          return (
            <span className="flex items-center gap-2" key={index}>
              <Image src={check_icon} alt="check icon" className="w-4 h-4" />
              <li className="text-sm">{feature}</li>
            </span>
          );
        })}
      </ul>
    </div>
  );
}

export default PackageComponent;
