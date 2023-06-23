import React from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { IconButton } from "@mui/material";

function ShopBio({isOwner}) {
	return (
		<div className="mt-16 px-4 md:mt-20 md:px-8 md:mb-4">
			<p className="text-xs font-light">
				<span className=" text-base font-medium">12.2k </span>
				Subscribed
			</p>
			<p className="font-light text-sm my-2 text-[color:var(--black-design-extralight)] ">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae
				debitis facere sequi sunt tenetur voluptate voluptas, nihil inventore
				tempora eveniet ut in iusto?
			</p>
			<div className="flex justify-between flex-wrap items-center mt-2">
				<div className="flex gap-3">
					<div className="bg-[color:var(--gray-light)] rounded-full">
						<IconButton>
							<FacebookIcon sx={{ color: "var(--gray-light-med)" }} />
						</IconButton>
					</div>
					<div className="bg-[color:var(--gray-light)] rounded-full">
						<IconButton>
							<InstagramIcon sx={{ color: "var(--gray-light-med)" }} />
						</IconButton>
					</div>
					<div className="bg-[color:var(--gray-light)] rounded-full">
						<IconButton>
							<YouTubeIcon sx={{ color: "var(--gray-light-med)" }} />
						</IconButton>
					</div>
				</div>
				<div className="flex items-center gap-1">
					<LocationOnOutlinedIcon
						fontSize="small"
						sx={{ color: "var(--gray-text)" }}
					/>
					<p className="font-light text-sm text-[color:var(--black-design-extralight)] ">
						los angeles
					</p>
				</div>
			</div>
		</div>
	);
}

export default ShopBio;
