import React from "react";
import ai_brain_icon from "@/public/images/icons/ai_brain_icon.png";
import Image from "next/image";
import ButtonPrimary from "../global/buttons/ButtonPrimary";
import check_icon from "@/public/images/icons/check_icon.png";

function TopPackage() {
	return (
		<div className="rounded bg-white w-full shadow p-4">
			<div className="border-b pb-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<Image
							src={ai_brain_icon}
							alt="business icon"
							className="w-8 h-8"
						/>
						<h4>Business</h4>
					</div>
					<p className="font-medium text-sm">$50 / month</p>
				</div>
				<div className="flex justify-between items-center gap-4 mt-4">
					<p className="text-left text-xs font-light">
						Perfect for businesses ready to save time with AI integration.
					</p>
					<div>
						<ButtonPrimary name="contact" />
					</div>
				</div>
			</div>
			<ul className="p-4 flex flex-col gap-2">
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Coming soon</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Contact to join early</li>
				</span>
				<span className="flex items-center gap-2">
					<Image src={check_icon} alt="check icon" className="w-4 h-4" />
					<li className="text-sm">Contact with questions</li>
				</span>
			</ul>
		</div>
	);
}

export default TopPackage;
