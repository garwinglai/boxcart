import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useRouter } from "next/router";
import ShopHeader from "@/components/storefront/ShopHeader";
import ShopBio from "@/components/storefront/ShopBio";
import ShopFulfillment from "@/components/storefront/ShopFulfillment";
import { Divider } from "@mui/material";
import ShopSearchBar from "@/components/storefront/ShopSearchBar";
import ShopMenu from "@/components/storefront/menus/shop/ShopMenu";
import { isAuth } from "@/helper/client/auth/isAuth";

function MyShop() {
	const { push } = useRouter();

	return (
		<div className="bg-white pb-20">
			<ShopHeader isOwner={true} />
			<ShopBio isOwner={true} />
			<div className="px-4 pt-4 pb-2">
				<Divider light />
			</div>
			<ShopFulfillment />
			<div className="px-4 py-2">
				<Divider light />
			</div>
			<ShopSearchBar isOwner={true} />
			{/* <ShopMenu isOwner={true} /> */}
		</div>
	);
}

export default MyShop;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

MyShop.getLayout = function getLayout(
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
			mobilePageRoute={mobilePageRoute}
		>
			{page}
		</AppLayout>
	);
};

MyShop.pageTitle = "My Shop";
MyShop.pageIcon = (
	<StorefrontIcon sx={{ color: "var(--black-design-extralight)" }} />
);
MyShop.pageRoute = "my-shop";
MyShop.mobilePageRoute = "my-shop";
