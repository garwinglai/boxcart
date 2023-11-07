import React from "react";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";

function Pricing() {
  return (
    <div className="px-4 py-4 pb-24 bg-[color:var(--brown-bg)] min-h-screen md:px-8 lg:px-32">
      <div className="flex flex-col items-center my-4">
        <h1>BoxCart Premium Plans</h1>
        <h4 className="font-light mt-2">
          Get <b>6 weeks free</b>. No credit card needed.
        </h4>
        <div className="flex items-center justify-center gap-2 my-6">
          <p className="font-light text-xs">Pay Monthly</p>
          <IOSSwitch />
          <p className="font-light text-xs">Pay Yearly (Up to 18% off)</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"></div>
    </div>
  );
}

export default Pricing;
