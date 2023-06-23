import React, { useState } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import AppLayout from "@/components/layouts/AppLayout";
import SaveCancelButtons from "@/components/app/design/SaveCancelButtons";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import ButtonFilter from "@/components/common/buttons/ButtonFilter";
import { useRouter } from "next/router";
import CategoryCard from "@/components/app/my-shop/category/CategoryCard";
import CategoryDrawer from "@/components/app/my-shop/category/CategoryDrawer";
import CategoryDrawerComponent from "@/components/app/my-shop/category/CategoryDrawerComponent";
import category_icon from "@/public/images/icons/category_icon.png";
import edit_category_icon from "@/public/images/icons/edit_category_icon.png";
import Image from "next/image";
import ButtonFourth from "@/components/common/buttons/ButtonFourth";
import { isAuth } from "@/helper/client/auth/isAuth";

function Categories() {
	const [showCreateCategory, setShowCreateCategory] = useState(false);
	const [showEditCategory, setShowEditCategory] = useState(false);
	const [state, setState] = useState({
		right: false,
	});

	const { push, pathname, asPath } = useRouter();

	const handleProductRoute = () => {
		if (pathname !== "/app/account/inventory/products")
			push("/account/inventory/products");

		return;
	};

	const handleCategoryRoute = () => {
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

	const handleCreateCategoryClick = () => {
		setShowCreateCategory((prev) => !prev);
		setShowEditCategory(false);
	};

	const handleEditCategory = () => {
		console.log("hi");
		setShowEditCategory((prev) => !prev);
		setShowCreateCategory(false);
	};

	const handleCancelClick = () => {
		setShowEditCategory(false);
		setShowCreateCategory(false);
	};

	return (
		<div className=" pb-16 py-4 lg:flex lg:w-full lg:justify-start lg:relative">
			<div className="flex flex-col lg:w-1/2">
				<div className="flex justify-between px-4 pb-4">
					<div className="flex gap-2">
						<ButtonFourth handleClick={handleProductRoute} name="Products" />
						<ButtonFilter handleClick={handleCategoryRoute} name="Categories" />
					</div>
					<div className="lg:hidden">
						<ButtonPrimary
							name="Create Category"
							handleClick={toggleDrawer("right", true)}
						/>
						<CategoryDrawer state={state} toggleDrawer={toggleDrawer} />
					</div>
				</div>
				<div className="px-4 flex flex-col gap-4 lg:flex-grow lg:pr-2">
					<CategoryCard handleEditCategory={handleEditCategory} />
				</div>
			</div>
			<div className=" hidden lg:block lg:w-1/2  lg:items-start">
				{showCreateCategory ? (
					<div className="hidden lg:block lg:w-full">
						<h3 className="pb-4 pt-2 px-4">Create Category:</h3>
						<CategoryDrawerComponent isDesktopView={true} />
					</div>
				) : (
					!showEditCategory && (
						<div className="hidden lg:visible lg:w-full lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-4  lg:mt-14">
							<span className="flex gap-4 items-center">
								<Image
									src={category_icon}
									alt="category icon"
									className="opacity-50 w-10 h-10"
								/>
								<h4>New Categories:</h4>
							</span>

							<div className="w-fit h-9">
								<ButtonPrimary
									handleClick={handleCreateCategoryClick}
									name="Create"
								/>
							</div>
						</div>
					)
				)}
				{showEditCategory && (
					<div className="hidden lg:block lg:w-full">
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
		</div>
	);
}

export default Categories;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

Categories.getLayout = function getLayout(
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

Categories.pageTitle = "Category";
Categories.pageIcon = <CategoryIcon />;
Categories.pageRoute = "category";
Categories.mobilePageRoute = "category";
