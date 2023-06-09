import React from "react";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AppLayout from "@/components/layouts/AppLayout";

function MemberShip() {
	return <div>MemberShip</div>;
}

export default MemberShip;

MemberShip.getLayout = function getLayout(
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

MemberShip.pageTitle = "MemberShip";
MemberShip.pageIcon = <CardMembershipIcon />;
MemberShip.pageRoute = "membership";
MemberShip.mobilePageRoute = "membership";
