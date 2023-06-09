import React from "react";
import candle_banner_temp from "@/public/images/temp/candle_banner.jpeg";
import candle_logo_temp from "@/public/images/temp/candle_logo_temp.jpeg";
import Image from "next/image";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ShareIcon from '@mui/icons-material/Share';

function ShopHeader({ isOwner }) {
	const handlePrimaryButtonClick = () => {
		//  do iff isOwner
	};

	const handleSecondaryButtonClick = () => {
		// iff isOwner
	};
	return (
		<React.Fragment>
			<Image
				src={candle_banner_temp}
				alt="business banner image"
				className="w-full object-contain"
			/>
			<div className="relative">
				<Image
					src={candle_logo_temp}
					alt="business logo"
					className="border border-[color:var(--gray)] rounded-full w-24 h-24 absolute -top-12 left-4 md:w-32 md:h-32 md:-top-16 md:left-8 "
				/>
				<div className="flex h-10 gap-2 absolute right-4 -top-5 md:-top-20 md:right-8">
					<button
						onClick={handlePrimaryButtonClick}
						className=" px-6 bg-[color:var(--black-design-extralight)] text-xs font-extralight text-white md:text-sm md:px-10 "
					>
						{isOwner ? "Edit Profile" : "Subscribe"}
					</button>
					<button
						onClick={handleSecondaryButtonClick}
						className="px-3 border border-[color:var(--black-design-extralight)] bg-white md:hidden "
					>
						{isOwner ? (
							<ShareIcon
								fontSize="small"
								sx={{ color: "var(--gray)" }}
							/>
						) : (
							<ChatBubbleOutlineOutlinedIcon
								fontSize="small"
								sx={{ color: "var(--gray-light-med)" }}
							/>
						)}
					</button>
					<button
						onClick={handleSecondaryButtonClick}
						className="hidden text-xs font-extralight px-6 border border-[color:var(--black-design-extralight)] bg-white md:block md:text-sm md:px-10"
					>
						{isOwner ? "Share Store" : "Message"}
					</button>
				</div>
			</div>
		</React.Fragment>
	);
}

export default ShopHeader;
