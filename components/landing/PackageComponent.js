import React from "react";
import Image from "next/image";
import ButtonPrimary from "../global/buttons/ButtonPrimary";
import check_icon from "@/public/images/icons/check_icon.png";
import { useRouter } from "next/router";

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

  const { push } = useRouter();

  const handleSelectPackage = (item, isPaymentByAnnual) => () => {
    push({
      pathname: "/account/premium/checkout",
      query: {
        planId: item.id,
        isPaymentByAnnual: isPaymentByAnnual,
      },
    });
  };

  return (
    <div className="rounded bg-white w-fit shadow-lg p-4 mx-auto">
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
          <p className="text-left text-sm font-light w-[60%]">{description}</p>
          {id !== 1 && (
            <div>
              <ButtonPrimary
                handleClick={handleSelectPackage(item, isPaymentByAnnual)}
                name="coming soon"
                disabled={id === 2}
              />
            </div>
          )}
        </div>
      </div>

      <ul className="p-4 flex flex-col gap-4">
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
