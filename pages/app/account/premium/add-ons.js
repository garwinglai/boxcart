import React from "react";
import AddIcon from "@mui/icons-material/Add";
import AppLayout from "@/components/layouts/AppLayout";

function PremiumAddOns() {
	return <div>add ons</div>;
}

export default PremiumAddOns;

PremiumAddOns.getLayout = function getLayout(
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

PremiumAddOns.pageTitle = "Premium Add Ons";
PremiumAddOns.pageIcon = <AddIcon />;
PremiumAddOns.pageRoute = "add-ons";
PremiumAddOns.mobilePageRoute = "add-ons";
