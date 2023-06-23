import React, { useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import AppLayout from "@/components/layouts/AppLayout";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import ButtonFilter from "@/components/common/buttons/ButtonFilter";
import { useRouter } from "next/router";
import ProductCard from "@/components/app/my-shop/products/ProductCard";
import ProductDrawer from "@/components/app/my-shop/products/ProductDrawer";
import ButtonFourth from "@/components/common/buttons/ButtonFourth";
import { isAuth } from "@/helper/client/auth/isAuth";

function Products() {
	const [state, setState] = useState({
		right: false,
	});
	const id = [1, 2, 3, 4, 5];

	const { push, pathname, query, asPath } = useRouter();
	const router = useRouter();

	const handleProductRoute = () => {
		if (pathname !== "/app/account/inventory/products")
			push("/account/inventory/products");

		return;
	};

	const handleCategoryRoute = () => {
		console.log("hello world");
		if (pathname !== "/app/account/inventory/categories")
			push("/account/inventory/categories");

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
		<div className="py-4 px-4 pb-24 sm:px-8 md:px-16 md:pt-8">
			<div className="pb-4 flex justify-between items-center">
				<div className="flex gap-2">
					<ButtonFilter handleClick={handleProductRoute} name="Products" />
					<ButtonFourth handleClick={handleCategoryRoute} name="Categories" />
				</div>
				<div>
					<ButtonPrimary
						name="Create Product"
						handleClick={toggleDrawer("right", true)}
					/>
					<ProductDrawer state={state} toggleDrawer={toggleDrawer} />
				</div>
			</div>
			<div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
				{id.map((item, idx) => (
					<ProductCard key={idx} id={item} />
				))}
			</div>
		</div>
	);
}

export default Products;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

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
			{page}
		</AppLayout>
	);
};

Products.pageTitle = "Products";
Products.pageIcon = <CategoryIcon />;
Products.pageRoute = "products";
Products.mobilePageRoute = "products";
