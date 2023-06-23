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
		<div className="flex overflow-hidden h-screen bg-[color:var(--brown-bg)] ">
			<DesktopNavBar pageRoute={pageRoute} />
			<div className=" overflow-y-scroll w-full">
				<PageHeader
					pageTitle={pageTitle}
					pageIcon={pageIcon}
					mobilePageRoute={mobilePageRoute}
				/>
				<main className="scroll  ">{children}</main>
			</div>
			<ShopNavBottom mobilePageRoute={mobilePageRoute} pageTitle={pageTitle} />
		</div>
	);
}

export default AppLayout;
