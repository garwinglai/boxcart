import React, { useState, useEffect } from "react";
import { IOSSwitch } from "../global/switches/IOSSwitch";
import SubscriptionPackage from "./SubscriptionPackage";
import { membershipPackages } from "@/helper/temp/tempData";
import { useHasHydrated } from "@/utils/useHasHydrated";

function MembershipPage({
  userAccount,
  stripePrices,
  stripeProducts,
  isPublic,
  hasSubScription,
}) {
  const hydrated = useHasHydrated();
  const [isPaymentByAnnual, setIsPaymentByAnnual] = useState(true);

  const handlePaymentPeriodChange = () => {
    setIsPaymentByAnnual((prev) => !prev);
  };

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex flex-col items-center my-4">
        <h1>BoxCart Premium Plans</h1>
        <div className="flex items-center justify-center gap-2 my-4">
          <p
            className={` ${
              isPaymentByAnnual
                ? "font-medium text-sm text-black"
                : "font-medium text-sm text-[color:var(--primary)]"
            }`}
          >
            Pay Monthly
          </p>
          <IOSSwitch
            checked={isPaymentByAnnual}
            onClick={handlePaymentPeriodChange}
          />
          <p
            className={` ${
              !isPaymentByAnnual
                ? "font-medium text-sm text-black"
                : "font-medium text-sm text-[color:var(--primary)]"
            }`}
          >
            Pay Yearly (26.5% off)
          </p>
        </div>
      </div>
      {isPublic && (
        <div className=" flex flex-col items-center justify-center mb-8">
          <h2 className="w-[16rem] mb-2 text-center text-base">
            For the next 100 users, we&apos;ll create your shop for you, FREE.
          </h2>
          <p className="text-sm font-extralight">Offer ends on 11/24.</p>
        </div>
      )}
      <div className="mx-auto">
        {stripeProducts.map((product) => {
          const { id, default_price } = product;

          const prices = stripePrices.filter((price) => {
            const { product: productId } = price;
            if (productId === id) {
              return price;
            }
          });

          const defaultPrice = prices.find(
            (price) => price.id === default_price
          );

          const otherPrice = prices.find((price) => price.id !== default_price);

          return (
            <SubscriptionPackage
              key={id}
              product={product}
              otherPrice={otherPrice}
              defaultPrice={defaultPrice}
              isPaymentByAnnual={isPaymentByAnnual}
              userAccount={userAccount}
              isPublic={isPublic}
              hasSubScription={hasSubScription}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MembershipPage;
