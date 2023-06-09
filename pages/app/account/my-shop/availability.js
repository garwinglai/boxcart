import React from "react";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import AppLayout from "@/components/layouts/AppLayout";
import MyShopMenu from "@/components/layouts/MyShopMenu";
import MobileMyShopMenuFab from "@/components/layouts/MobileMyShopMenuFab";

function Availability() {
	return <div>Availability</div>;
}

export default Availability;

Availability.getLayout = function getLayout(
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

Availability.pageTitle = "My Shop / Availability";
Availability.pageIcon = <EditCalendarRoundedIcon />;
Availability.pageRoute = "availability";
Availability.mobilePageRoute = "availability";
