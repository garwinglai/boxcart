import React from "react";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import AppLayout from "@/components/layouts/AppLayout";
import { isAuth } from "@/helper/server/auth/isAuth";

function Contacts() {
  return (
    <div className="flex flex-col justify-center items-center mt-16">
      <h1>Contacts</h1>
      <p>Subscriber and customer informatoin.</p>
      <p>Coming soon ...</p>
    </div>
  );
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
