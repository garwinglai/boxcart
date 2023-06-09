import React from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AppLayout from "@/components/layouts/AppLayout";

function CommSettings() {
	return <div>CommSettings</div>;
}

export default CommSettings;

CommSettings.getLayout = function getLayout(
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

CommSettings.pageTitle = "Communication Settings";
CommSettings.pageIcon = <EditRoundedIcon />;
CommSettings.pageRoute = "comm-settings";
CommSettings.mobilePageRoute = "comm-settings";
