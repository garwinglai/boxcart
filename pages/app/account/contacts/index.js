import React from "react";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import AppLayout from "@/components/layouts/AppLayout";
import { isAuth } from "@/helper/client/auth/isAuth";

function Contacts() {
	return <div>Contacts</div>;
}

export default Contacts;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

Contacts.getLayout = function getLayout(
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

Contacts.pageTitle = "Contacts";
Contacts.pageIcon = <ContactEmergencyIcon />;
Contacts.pageRoute = "contacts";
Contacts.mobilePageRoute = "contacts";
