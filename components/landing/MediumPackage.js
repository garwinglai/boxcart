import React from "react";
import crowd_funding_icon from "@/public/images/icons/crowd_funding_icon.png";
import Image from "next/image";
import ButtonPrimary from "../common/buttons/ButtonPrimary";
import check_icon from "@/public/images/icons/check_icon.png";

function MediumPackage() {
	return (
		<div className="rounded bg-white w-full shadow p-4">
			<div className="border-b pb-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<Image
							src={crowd_funding_icon}
							alt="business icon"
							className="w-8 h-8"
						/>
						<h4>Entrepreneur</h4>
					</div>
					<p className="font-medium text-sm">$18 / month</p>
				</div>
				<div className="flex justify-between items-center gap-4 mt-4">
					<p className="text-left text-xs font-light">
						Perfect for businesses looking for more customers.
					</p>
					<div>
						<ButtonPrimary name="select" />
					</div>
				</div>
			</div>

			<ul className="p-4 flex flex-col gap-2">
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">
						<u>
							Everything in <b>Startup Plan</b>
						</u>
					</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Chat</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Customer contacts</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Integration with square</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Connect IG & Whatsapp</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Automated invoices</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Automated email marketing</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Automated abandon cart emails</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Connect custom domain</li>
				</span>
			</ul>
		</div>
	);
}

export default MediumPackage;
