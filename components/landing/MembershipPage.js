import React, { useState } from "react";
import { IOSSwitch } from "../global/switches/IOSSwitch";
import PackageComponent from "./PackageComponent";
import { membershipPackages } from "@/helper/temp/tempData";
import { useHasHydrated } from "@/utils/useHasHydrated";

const publishable_key =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY;

function MembershipPage() {
  const hydrated = useHasHydrated();
  const [isPaymentByAnnual, setIsPaymentByAnnual] = useState(true);

  const handlePaymentPeriodChange = () => {
    setIsPaymentByAnnual((prev) => !prev);
  };

  return hydrated ? (
    <stripe-pricing-table
      pricing-table-id="prctbl_1OA17GJYT3F0eBGGEGl3yyZN"
      publishable-key={publishable_key}
    ></stripe-pricing-table>
  ) : (
    <p>test</p>
  );

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex flex-col items-center my-4">
        <h1>BoxCart Premium Plans</h1>
        <div className="flex items-center justify-center gap-2 my-4">
          <p
            className={` ${
              isPaymentByAnnual
                ? "font-light text-sm text-black"
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
                ? "font-light text-sm text-black"
                : "font-medium text-sm text-[color:var(--primary)]"
            }`}
          >
            Pay Yearly (25% off)
          </p>
        </div>
      </div>
      <div className="mx-auto mt-16">
        {membershipPackages.map((item) => {
          return (
            <PackageComponent
              key={item.id}
              item={item}
              isPaymentByAnnual={isPaymentByAnnual}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MembershipPage;
