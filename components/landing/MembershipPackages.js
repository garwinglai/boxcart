import React, { useState } from "react";
import { IOSSwitch } from "../global/switches/IOSSwitch";
import PackageComponent from "./PackageComponent";
import { membershipPackages } from "@/helper/temp/tempData";

function MembershipPackages() {
  const [isPaymentByAnnual, setIsPaymentByAnnual] = useState(true);

  const handlePaymentPeriodChange = () => {
    setIsPaymentByAnnual((prev) => !prev);
  };

  return (
    <div className="px-4 py-4 pb-24">
      <div className="flex flex-col items-center my-4">
        <h1>BoxCart Premium Plans</h1>
        <div className="flex items-center justify-center gap-2 my-4">
          <p className="font-light text-xs">Pay Monthly</p>
          <IOSSwitch
            checked={isPaymentByAnnual}
            onClick={handlePaymentPeriodChange}
          />
          <p className="font-light text-xs">Pay Yearly (25% off)</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

export default MembershipPackages;
