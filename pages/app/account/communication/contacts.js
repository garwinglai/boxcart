import React from "react";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import AppLayout from "@/components/layouts/AppLayout";

function Contacts() {
	return <div>Contacts</div>;
}

export default Contacts;

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
