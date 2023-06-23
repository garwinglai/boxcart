import React from "react";
import launch_icon from "@/public/images/icons/launch_icon.png";
import Image from "next/image";
import ButtonPrimary from "../common/buttons/ButtonPrimary";
import check_icon from "@/public/images/icons/check_icon.png";

function BasicPackage() {
	return (
		<div className="rounded bg-white w-full shadow p-4">
			<div className="border-b pb-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<Image src={launch_icon} alt="startup icon" className="w-8 h-8" />
						<h4>Startup Plan</h4>
					</div>
					<p className="font-medium text-sm">$12 / month</p>
				</div>
				<div className="flex justify-between items-center gap-4 mt-4">
					<p className="text-left text-xs font-light">
						Perfect for new and small businesses looking to sell online.
					</p>
					<div>
						<ButtonPrimary name="select" />
					</div>
				</div>
			</div>

			<ul className="p-4 flex flex-col gap-2">
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Storefront</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Order management</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Scheduling</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Inventory management</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Customer contact</li>
				</span>
			</ul>
		</div>
	);
}

export default BasicPackage;
