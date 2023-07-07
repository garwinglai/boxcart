import Gallery from "@/components/storefront/menus/Gallery";
import ShopMenu from "@/components/storefront/menus/shop/ShopMenu";
import React, { useState } from "react";
import candle_banner_temp from "@/public/images/temp/candle_banner.jpeg";
import candle_logo_temp from "@/public/images/temp/candle_logo_temp.jpeg";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import GridOnIcon from "@mui/icons-material/GridOn";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import StoreIcon from "@mui/icons-material/Store";
import VerifiedIcon from "@mui/icons-material/Verified";
import YouTubeIcon from "@mui/icons-material/YouTube";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import styles from "@/styles/site/site.module.css";

function ShopPreview({ route, businessName, bio, email }) {
	const [alignment, setAlignment] = useState("");
	const [menuSelected, setmenuSelected] = useState("shop");

	const handleAlignment = (event, newAlignment) => {
		setAlignment(newAlignment);
	};

	function setMenu(e, value) {
		// const { value, name } = e.target;
		setmenuSelected(value);
	}

	function showMenuLayout(menuSelected) {
		if (menuSelected === "shop") {
			return <ShopMenu />;
		}

		if (menuSelected === "gallery") {
			return <Gallery />;
		}
	}

	return (
		<div className="bg-white m-4 relative flex flex-col shadow-lg  rounded md:ml-0 md:shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
			<div className="absolute">
				<Image
					src={candle_banner_temp}
					alt="business banner image"
					className=" block object-cover w-screen h-[9rem]  rounded-t-3xl"
				/>
			</div>
			{/* <div className="absolute right-2 top-36 mt-2">
				<IconButton>
					<MenuOutlinedIcon fontSize="medium" />
				</IconButton>
			</div> */}
			<div className="pt-[5.5rem] mb-4 flex flex-col items-center gap-2 w-full">
				<Image
					src={candle_logo_temp}
					alt={`logo`}
					priority={true}
					className="w-28 h-28 object-contain rounded-full border border-gray-300 shadow-md z-10"
				/>
				<div className="flex gap-1 items-center">
					<h3>
						{/* Temp business name */}
						{businessName}
					</h3>
					<VerifiedIcon color="primary" fontSize="small" />
				</div>
				<div className="flex flex-col items-center gap-2">
					<div className="flex flex-col  items-center">
						<p className=" text-lg text-black">10.3k</p>
						<p className="text-xs text-gray-400">Subscribers</p>
					</div>
					<div className="flex gap-4">
						<IconButton>
							<FacebookIcon fontSize="large" color="disabled" />
						</IconButton>
						<IconButton>
							<InstagramIcon fontSize="large" color="disabled" />
						</IconButton>
						<IconButton>
							<YouTubeIcon fontSize="large" color="disabled" />
						</IconButton>
					</div>
					<p className=" font-light text-sm text-gray-500 text-center px-4 ">
						{/* The best bakery you&apos;re find in town. Contact us for customer
						orders, or select your favorite baked goods. */}
						{bio}
					</p>
				</div>
			</div>
			{route !== "profile" && (
				<React.Fragment>
					<div className="flex gap-4 p-4 items-center border-t border-b border-gray-300">
						<button
							className="py-2 border border-gray-300 text-gray-300   rounded w-1/2 text-sm"
							disabled={true}
						>
							Subscribe
						</button>
						<button
							className=" py-2 bg-gray-300 text-white rounded w-1/2 text-sm"
							disabled
						>
							<EmailOutlinedIcon fontSize="small" />
						</button>
					</div>

					<div className={`flex flex-col ${styles.fulfillment_box}`}>
						<div className="flex gap-1 items-center">
							<LocationOnIcon
								fontSize="medium"
								sx={{ color: "var(--secondary-light-med)" }}
							/>
							<p className=" underline text-gray-500 text-sm">
								Los Angeles, CA
							</p>
						</div>
						<div className="flex gap-4 items-center">
							<p className="text-gray-500 text-sm">Feb 23, 2023 @ 2:45 pm</p>
							<button className="underline text-gray-400 text-sm">
								Change date
							</button>
						</div>
						<div className={`${styles.tabs}`}>
							<input
								className=" z-10 hidden active:bg-transparent"
								type="radio"
								id="radio-1"
								name="tabs"
							/>
							<label
								className=" z-10 text-sm text-gray-500 flex items-center justify-center w-8/12 font-light cursor-pointer transition-colors ease-in duration-150 h-10 focus:outline-none checked:text-white active:bg-transparent focus:bg-transparent"
								htmlFor="radio-1"
							>
								Delivery
							</label>
							<input
								className=" z-10 hidden"
								type="radio"
								id="radio-2"
								name="tabs"
							/>
							<label
								className=" z-10 text-sm text-gray-500 flex items-center justify-center w-8/12 font-light cursor-pointer transition-colors ease-in duration-150 h-10 focus:outline-none checked:text-white"
								htmlFor="radio-2"
							>
								Pickup
							</label>
							<span className={`${styles.glider} `}></span>
						</div>
					</div>

					<StyledToggleButtonGroup
						value={alignment}
						color="primary"
						exclusive
						onChange={handleAlignment}
						aria-label="text alignment"
						className="flex justify-start"
					>
						<ToggleButton
							value="shop"
							aria-label="shop icon"
							onClick={setMenu}
							selected={menuSelected === "shop" ? true : false}
							className="flex-grow "
						>
							<StoreIcon color="disabled" />
						</ToggleButton>
						<ToggleButton
							value="gallery"
							aria-label="gallery icon"
							onClick={setMenu}
							selected={menuSelected === "gallery" ? true : false}
							className="flex-grow"
						>
							<GridOnIcon color="disabled" />
						</ToggleButton>
					</StyledToggleButtonGroup>
					{showMenuLayout(menuSelected)}
				</React.Fragment>
			)}
		</div>
	);
}

export default ShopPreview;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	"& .MuiToggleButtonGroup-grouped": {
		border: 0,
		borderBottom: "1px solid var(--gray-light)",

		"&.Mui-selected": {
			borderBottom: "1px solid var(--gray-light)",
		},
		"&:not(:first-of-type)": {
			borderRadius: theme.shape.borderRadius,
		},
		"&:first-of-type": {
			borderRadius: theme.shape.borderRadius,
		},
	},
}));
