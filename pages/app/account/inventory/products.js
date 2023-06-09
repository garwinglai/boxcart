import React, { useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import AppLayout from "@/components/layouts/AppLayout";
import ButtonPrimary from "@/components/designs/ButtonPrimary";
import ButtonFilter from "@/components/designs/ButtonFilter";
import { useRouter } from "next/router";
import ProductCard from "@/components/app/my-shop/products/ProductCard";
import ProductDrawer from "@/components/app/my-shop/products/ProductDrawer";

function Products() {
	const [state, setState] = useState({
		right: false,
	});

	const { push, pathname } = useRouter();

	const handleProductRoute = () => {
		console.log(pathname);
		if (pathname !== "/app/account/my-shop/products")
			push("/account/my-shop/products");

		return;
	};

	const handleCategoryRoute = () => {
		console.log(pathname);
		if (pathname !== "/app/account/my-shop/category")
			push("/account/my-shop/category");

		return;
	};

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	return (
		<div className="pb-24">
			<div className="flex gap-4 p-4">
				<ButtonFilter name="Products" handleClick={handleProductRoute} />
				<ButtonFilter name="Category" handleClick={handleCategoryRoute} />
			</div>
			<div className="px-4 flex flex-col gap-4">
				<ProductCard />
				<ProductCard />
				<ProductCard />
			</div>
			<div className="fixed bottom-8 right-4 shadow-md shadow-gray-600 rounded-3xl">
				<ButtonPrimary
					name="Create Product"
					handleClick={toggleDrawer("right", true)}
				/>
				<ProductDrawer state={state} toggleDrawer={toggleDrawer} />
			</div>
		</div>
	);
}

export default Products;

Products.getLayout = function getLayout(
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

Products.pageTitle = "My Shop / Products";
Products.pageIcon = <CategoryIcon />;
Products.pageRoute = "products";
Products.mobilePageRoute = "products";
