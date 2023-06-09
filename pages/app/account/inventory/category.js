import React, { useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import AppLayout from "@/components/layouts/AppLayout";
import SaveCancelButtons from "@/components/app/SaveCancelButtons";
import ButtonPrimary from "@/components/designs/ButtonPrimary";
import ButtonFilter from "@/components/designs/ButtonFilter";
import { useRouter } from "next/router";
import CategoryCard from "@/components/app/my-shop/category/CategoryCard";
import CategoryDrawer from "@/components/app/my-shop/category/CategoryDrawer";
import CategoryDrawerComponent from "@/components/app/my-shop/category/CategoryDrawerComponent";
import category_icon from "@/public/images/icons/category_icon.png";
import edit_category_icon from "@/public/images/icons/edit_category_icon.png";
import Image from "next/image";

function Category() {
	const [showCreateCategory, setShowCreateCategory] = useState(false);
	const [showEditCategory, setShowEditCategory] = useState(false);
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

	const handleCreateCategoryClick = () => {
		setShowCreateCategory((prev) => !prev);
		setShowEditCategory(false);
	};

	const handleEidtCategoryClick = () => {
		setShowEditCategory((prev) => !prev);
		setShowCreateCategory(false);
	};

	const handleCancelClick = () => {
		setShowEditCategory(false);
		setShowCreateCategory(false);
	};

	return (
		<div className="">
			<div className="flex gap-4 p-4">
				<ButtonFilter name="Products" handleClick={handleProductRoute} />
				<ButtonFilter name="Category" handleClick={handleCategoryRoute} />
			</div>
			<div className="md:flex md:w-full md:items-start">
				<div className="px-4 flex flex-col gap-4 md:flex-grow md:pr-2 md:w-1/2">
					<CategoryCard handleEidtCategoryClick={handleEidtCategoryClick} />
				</div>
				{showCreateCategory ? (
					<div className="hidden md:block md:w-1/2">
						<span className="flex gap-4 items-center pb-4 px-4">
							<Image
								src={category_icon}
								alt="category icon"
								className="w-10 h-10"
							/>
							<h3>Create Category:</h3>
						</span>
						<CategoryDrawerComponent isDesktopView={true} />
					</div>
				) : (
					!showEditCategory && (
						<div className="hidden md:visible md:w-1/2 md:flex md:flex-col md:items-center md:justify-center md:gap-4 md:border-y md-border-[color:var(--gray)] md:py-8 ">
							<span className="flex gap-4 items-center">
								<Image
									src={category_icon}
									alt="category icon"
									className="w-10 h-10"
								/>
								<h3>Create Category:</h3>
							</span>
							<div className="w-fit h-9">
								<ButtonPrimary
									handleClick={handleCreateCategoryClick}
									name="Create Category"
								/>
							</div>
						</div>
					)
				)}
				{showEditCategory && (
					<div className="hidden md:block md:w-1/2">
						<span className="flex gap-4 items-center pb-4 px-4">
							<Image
								src={edit_category_icon}
								alt="edit category icon"
								className="w-10 h-10"
							/>
							<h3>Edit Category:</h3>
						</span>
						<CategoryDrawerComponent isDesktopView={true} />
					</div>
				)}
				{(showEditCategory || showCreateCategory) && (
					<SaveCancelButtons handleCancel={handleCancelClick} />
				)}
			</div>
			<div className=" fixed bottom-8 right-4 shadow-md shadow-gray-600 rounded-full lg:h-12 lg:bottom-12 lg:right-12 md:hidden">
				<ButtonPrimary
					name="Create Category"
					handleClick={toggleDrawer("right", true)}
				/>
				<CategoryDrawer state={state} toggleDrawer={toggleDrawer} />
			</div>
		</div>
	);
}

export default Category;

Category.getLayout = function getLayout(
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

Category.pageTitle = "My Shop / Category";
Category.pageIcon = <CategoryIcon />;
Category.pageRoute = "category";
Category.mobilePageRoute = "category";
