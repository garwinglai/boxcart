import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import StorefrontIcon from "@mui/icons-material/Storefront";
import styles from "@/styles/app/account/my-shop/my-shop.module.css";
import { useRouter } from "next/router";
import PageLoader from "@/components/loaders/PageLoader";
import MobileMyShopMenuFab from "@/components/layouts/MobileMyShopMenuFab";
import Alert from "@mui/material/Alert";
import ShopPreview from "@/components/app/my-shop/ShopPreview";
import ShopHeader from "@/components/storefront/ShopHeader";
import ShopBio from "@/components/storefront/ShopBio";
import ShopFulfillment from "@/components/storefront/ShopFulfillment";
import { Divider } from "@mui/material";
import ShopSearchBar from "@/components/layouts/storefront/ShopSearchBar";
import ShopMenu from "@/components/storefront/menus/ShopMenu";

// * This page is Mobile only.

function MyShop() {
	// * State for open/close drawer menu - mobile

	const [isPageLoading, setIsPageLoading] = useState(false);
	const [deviceWidth, setDeviceWidth] = useState();

	const { push } = useRouter();

	// useEffect(() => {
	// 	if (window) {
	// 		setIsPageLoading(true);
	// 		const width = window.innerWidth;
	// 		if (width > 768) {
	// 			push("/account/my-shop/profile");
	// 		} else {
	// 			setIsPageLoading(false);
	// 		}

	// 		// setDeviceWidth(width);
	// 		window.addEventListener("resize", updateDimension);
	// 	}

	// 	return () => {
	// 		window.removeEventListener("resize", updateDimension);
	// 	};
	// }, [deviceWidth]);

	const updateDimension = () => {
		const width = window.innerWidth;
		if (width > 768) {
			push("/account/my-shop/profile");
		} else {
			setIsPageLoading(false);
		}
		setDeviceWidth(width);
		return;
	};

	if (isPageLoading)
		return (
			<div className={`${styles.desktop_page_loader}`}>
				<PageLoader />
				<p>Fetching profile...</p>
			</div>
		);

	return (
		<div className="bg-white pb-20">
			<ShopHeader isOwner={true} />
			<ShopBio isOwner={true} />
			<ShopFulfillment />
			<div className="px-4">
				<Divider light />
			</div>
			<ShopSearchBar isOwner={true} />
			<ShopMenu isOwner={true} />
		</div>
	);
}

export default MyShop;

MyShop.getLayout = function getLayout(page, pageTitle, pageIcon) {
	return (
		<AppLayout pageTitle={pageTitle} pageIcon={pageIcon}>
			{/* <MobileMyShopMenuFab pageTitle={pageTitle} /> */}
			{page}
		</AppLayout>
	);
};

MyShop.pageTitle = "My Shop";
MyShop.pageIcon = (
	<StorefrontIcon sx={{ color: "var(--black-design-extralight)" }} />
);
