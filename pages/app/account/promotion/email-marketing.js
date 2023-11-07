import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { isAuth } from "@/helper/client/auth/isAuth";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";

function EmailMarketing() {
  return (
    <div className="flex flex-col justify-center items-center mt-16">
      <h3>Email marketing coming soon...</h3>
    </div>
  );
}

export default EmailMarketing;

export async function getServerSideProps(context) {
  return isAuth(context, (userSession) => {
    return {
      props: {
        userSession,
      },
    };
  });
}

EmailMarketing.getLayout = function getLayout(
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

EmailMarketing.pageTitle = "Email marketing";
EmailMarketing.pageIcon = <ForwardToInboxIcon />;
EmailMarketing.pageRoute = "email-marketing";
EmailMarketing.mobilePageRoute = "email-marketing";
