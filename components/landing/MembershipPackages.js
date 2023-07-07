import React from "react";
import BasicPackage from "./BasicPackage";
import MediumPackage from "./MediumPackage";
import { IOSSwitch } from "../global/switches/IOSSwitch";
import TopPackage from "./TopPackage";

function MembershipPackages() {
	return (
		<div className="px-4 py-4 pb-24">
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
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				<BasicPackage />
				<MediumPackage />
				<TopPackage />
			</div>
		</div>
	);
}

export default MembershipPackages;
