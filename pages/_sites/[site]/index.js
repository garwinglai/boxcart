import React, { useState, useEffect } from "react";
import ShopMenu from "@/components/storefront/menus/shop/ShopMenu";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";
import ShopHeader from "@/components/storefront/ShopHeader";
import ShopLayout from "@/components/layouts/storefront/ShopLayout";
import ShopBio from "@/components/storefront/ShopBio";
import ShopFulfillment from "@/components/storefront/ShopFulfillment";
import Divider from "@mui/material/Divider";
import ShopSearchBar from "@/components/storefront/ShopSearchBar";
import CartComponent from "@/components/storefront/cart/CartComponent";
import CategoryShopList from "@/components/storefront/menus/shop/CategoryShopList";

function Sites({ site, test }) {
	const [exampleCartItems, setExampleCartItems] = useState([1, 2]);
	console.log("test", test);

	return (
		<div className="pb-8 lg:flex lg:h-[calc(100vh-54px)] lg:pb-0 lg:overflow-hidden ">
			<div className="flex-grow lg:overflow-y-auto ">
				<ShopHeader isOwner={false} />
				<div className="md:flex md:justify-between">
					<div className="md:w-3/5 lg:w-2/5">
						<ShopBio isOwner={false} />
					</div>
					<div className=" md:mt-16 md:w-2/5">
						<ShopFulfillment isOwner={false} />
					</div>
				</div>
				<div className="px-4">
					<Divider light />
				</div>
				<ShopSearchBar isOwner={false} />
				<div className="flex w-full xl:mt-4">
					<CategoryShopList />
					<ShopMenu isOwner={false} />
				</div>
			</div>
			<div className="hidden lg:block  lg:w-[20rem] ">
				<CartComponent cartItems={exampleCartItems} isDesktop={true} />
			</div>
		</div>
	);
}
export default Sites;

Sites.getLayout = function getLayout(page) {
	return <ShopLayout>{page}</ShopLayout>;
};

export async function getServerSideProps(context) {
	const { site } = context.query;

	return {
		props: {
			site,
		},
	};
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	"& .MuiToggleButtonGroup-grouped": {
		border: 0,
		borderBottom: "1px solid var(--gray-light)",

		"&.Mui-selected": {
			borderBottom: "1px solid var(--secondary)",
		},
		"&:not(:first-of-type)": {
			borderRadius: theme.shape.borderRadius,
		},
		"&:first-of-type": {
			borderRadius: theme.shape.borderRadius,
		},
	},
}));
