import React from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AppLayout from "@/components/layouts/AppLayout";
import { isAuth } from "@/helper/client/auth/isAuth";

function CommSettings() {
	return <div>CommSettings</div>;
}

export default CommSettings;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

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
