import React from "react";
import DesktopNavBar from "./DesktopNavBar";
import PageHeader from "./PageHeader";
import ShopNavTop from "./storefront/ShopNavTop";
import ShopNavBottom from "./storefront/ShopNavBottom";

function AppLayout({
	children,
	pageTitle,
	pageIcon,
	pageRoute,
	mobilePageRoute,
}) {
	return (
		<div className="flex overflow-hidden h-screen">
			<DesktopNavBar pageRoute={pageRoute} />
			<div className=" overflow-y-scroll w-full">
				<PageHeader
					pageTitle={pageTitle}
					pageIcon={pageIcon}
					mobilePageRoute={mobilePageRoute}
				/>
				<main className="scroll h-[calc(100vh-450px)] bg-[color:var(--primary-light-soft)] md:h-[calc(100vh-57px)] ">
					{children}
				</main>
			</div>
			<ShopNavBottom />
		</div>
	);
}

export default AppLayout;
