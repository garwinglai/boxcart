import React, { useRef, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/my-shop/profile.module.css";
import MyShopMenu from "@/components/layouts/MyShopMenu";
import MobileMyShopMenuFab from "@/components/layouts/MobileMyShopMenuFab";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TextField from "@mui/material/TextField";
import candle_logo_temp from "@/public/images/temp/candle_logo_temp.jpeg";
import candle_banner_temp from "@/public/images/temp/candle_banner.jpeg";
import Image from "next/image";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import group_icon from "@/public/images/icons/group_icon.png";
import instagram_icon from "@/public/images/icons/socials/instagram_icon.png";
import ShopPreview from "@/components/app/my-shop/ShopPreview";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import SaveCancelButtons from "@/components/app/SaveCancelButtons";

// TODO: complete address

function Profile() {
	const [businessInfo, setBusinessInfo] = useState({
		businessName: "",
		email: "",
		bio: "",
	});
	const [alert, setAlert] = useState({
		showAlert: false,
		alertMsg: "",
	});
	const [isPickupDeliveryAddressSame, setIsPickupDeliveryAddressSame] =
		useState(true);

	const { businessName, email, bio } = businessInfo;
	const { showAlert, alertMsg } = alert;

	const uploadLogoRef = useRef(null);
	const uploadBannerRef = useRef(null);

	const handleAddressToggle = (event) => {
		setIsPickupDeliveryAddressSame(event.target.checked);
	};

	const handleEditLogoClick = (imageType) => () => {
		if (imageType === "banner") {
			uploadBannerRef.current.click();
		}

		if (imageType === "logo") {
			uploadLogoRef.current.click();
		}
	};

	const handleFileChange = (e) => {
		const [name, files] = e.target;
		const logoFile = files[0];

		if (name === "banner") {
		}

		if (name === "logo") {
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		setBusinessInfo((prev) => ({ ...prev, [name]: value }));
	};

	const closeAlert = () => {
		setAlert({ showAlert: false, alertMsg: "" });
	};

	const action = (
		<React.Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={closeAlert}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);

	return (
		<div className=" pb-32 lg:flex  lg:justify-center  ">
			<Snackbar open={showAlert} autoHideDuration={6000} onClose={closeAlert}>
				<Alert onClose={closeAlert} severity="error" sx={{ width: "100%" }}>
					{alertMsg}
				</Alert>
			</Snackbar>
			<div className="lg:w-1/2 p-4 flex flex-col gap-4 ">
				<div className="p-4 rounded-3xl flex flex-col gap-2 relative  bg-white   shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
					<h2>Business Info</h2>
					<div className="absolute mt-11 pr-4">
						<Image
							src={candle_banner_temp}
							alt="banner image"
							className="rounded-3xl w-screen h-32 block  object-cover"
						/>
						<button
							onClick={handleEditLogoClick("banner")}
							className="flex border border-gray-300 w-fit py-1 px-2 gap-1 rounded-full absolute -bottom-4 ml-auto right-3 bg-gray-100"
						>
							<CameraAltIcon fontSize="small" color="disabled" />
							<p className="text-gray-600 font-light text-sm">Edit</p>
						</button>
						<input
							type="file"
							id="banner"
							name="banner"
							ref={uploadBannerRef}
							onChange={handleFileChange}
							className="hidden"
						/>
					</div>
					<div className="flex flex-col items-center mt-16 pt-2 z-10">
						<Image
							src={candle_logo_temp}
							alt="logo icon"
							className="w-28 h-28 object-contain rounded-full border border-gray-300 shadow-md"
						/>
						<button
							onClick={handleEditLogoClick("logo")}
							className="flex border border-gray-300 w-fit py-1 px-2 gap-1 rounded-full relative bottom-3 bg-gray-100"
						>
							<CameraAltIcon fontSize="small" color="disabled" />
							<p className="text-gray-600 font-light text-sm">Edit</p>
						</button>
						<input
							type="file"
							id="logo"
							name="logo"
							ref={uploadLogoRef}
							onChange={handleFileChange}
							className="hidden"
						/>
					</div>
					<form className="flex flex-col gap-3">
						<div>
							<label htmlFor="business-name">Business name: *</label>
							<TextField
								fullWidth
								required
								id="business-name"
								variant="outlined"
								size="small"
								name="businessName"
								value={businessName}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="email">Email: *</label>
							<TextField
								fullWidth
								required
								id="email"
								variant="outlined"
								size="small"
								name="email"
								value={email}
								type={"email"}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="business-bio">Bio:</label>
							<TextField
								multiline
								rows={4}
								fullWidth
								id="business-bio"
								name="bio"
								variant="outlined"
								size="small"
								value={bio}
								onChange={handleChange}
							/>
							<p className="text-gray-500 text-sm font-light text-right">
								{bio.length}/300
							</p>
						</div>
					</form>
				</div>
				<div className="p-4 flex flex-col gap-2 bg-white rounded-3xl  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
					<h2>Address</h2>
					<form className="flex flex-col gap-3">
						<div>
							<label htmlFor="business-name">Address 1: *</label>
							<TextField
								fullWidth
								required
								id="address_1"
								variant="outlined"
								size="small"
								name="address_1"
								value={businessName}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="business-name">Address 2: *</label>
							<TextField
								fullWidth
								required
								id="address_2"
								variant="outlined"
								size="small"
								name="address_2"
								value={businessName}
								onChange={handleChange}
							/>
						</div>
						<div className="flex gap-4">
							<div className="flex flex-col">
								<label htmlFor="email">City: *</label>
								<TextField
									// fullWidth
									required
									id="city"
									variant="outlined"
									size="small"
									name="city"
									value={email}
									type={"email"}
									onChange={handleChange}
								/>
							</div>
							<div className="flex flex-col">
								<label htmlFor="email">State: *</label>
								<TextField
									// fullWidth
									required
									id="state"
									variant="outlined"
									size="small"
									name="state"
									value={email}
									type={"email"}
									onChange={handleChange}
								/>
							</div>
							<div className="flex flex-col">
								<label htmlFor="email">Zip: *</label>
								<TextField
									fullWidth
									required
									id="zip"
									variant="outlined"
									size="small"
									name="sip"
									value={email}
									type={"number"}
									onChange={handleChange}
								/>
							</div>
						</div>
					</form>
				</div>
				<div className="p-4 flex flex-col gap-4bg-white rounded-3xl bg-white  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
					<h2>Social links</h2>
					<TextField
						fullWidth
						id="socials"
						variant="outlined"
						size="small"
						label="Enter your social link..."
					/>
					<div className="flex flex-col items-center">
						<Image
							src={group_icon}
							alt="group icon"
							className="mt-4 opacity-50"
						/>
						<p className="text-gray-400 font-light">No socials connected.</p>
					</div>
					{/* <div className="flex flex-col gap-4">
					<div className="flex gap-1 items-center">
						<Image
							src={instagram_icon}
							alt="instagram icon"
							className="w-12 opacity-70"
						/>
						<p className="text-gray-400 font-light">
							www.instagram.com/garwinglai
						</p>
					</div>
					<div className="flex gap-1 items-center">
						<Image
							src={instagram_icon}
							alt="instagram icon"
							className="w-12 opacity-70"
						/>
						<p className="text-gray-400 font-light">
							www.instagram.com/garwinglai
						</p>
					</div>
				</div> */}
				</div>
			</div>
			<div className="hidden lg:block lg:w-1/2 lg:mt-4 ">
				<div className="sticky top-[2rem]">
					<h4>Shop Preview</h4>
					<ShopPreview
						route="profile"
						businessName={businessName}
						email={email}
						bio={bio}
					/>
				</div>
			</div>
			<SaveCancelButtons />
		</div>
	);
}

export default Profile;

Profile.getLayout = function getLayout(
	page,
	pageTitle,
	pageIcon,
	pageRoute,
	mobilePageRoute
) {
	return (
		<AppLayout
			pageTitle={pageTitle}
			pageIcon={pageIcon}
			pageRoute={pageRoute}
			mobilePageRoute={mobilePageRoute}
		>
			{/* <div className="sticky top-0 z-50 bg-white">
				<MyShopMenu pageTitle={pageTitle} />
			</div> */}
			{/* <MobileMyShopMenuFab pageTitle={pageTitle} /> */}
			{page}
		</AppLayout>
	);
};

Profile.pageTitle = "My Shop / Profile";
Profile.pageIcon = <EditRoundedIcon />;
Profile.pageRoute = "profile";
Profile.mobilePageRoute = "profile";
