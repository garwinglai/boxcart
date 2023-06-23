import React from "react";
import AddIcon from "@mui/icons-material/Add";
import AppLayout from "@/components/layouts/AppLayout";
import { isAuth } from "@/helper/client/auth/isAuth";

function PremiumAddOns() {
	return <div>add ons</div>;
}

export default PremiumAddOns;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

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
