import React from "react";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AppLayout from "@/components/layouts/AppLayout";
import MembershipPage from "@/components/landing/MembershipPage";
import { isAuth } from "@/helper/client/auth/isAuth";
import prisma from "@/lib/prisma";

function MemberShip() {
  return (
    <div className="">
      <MembershipPage />
    </div>
  );
}

export default MemberShip;

export async function getServerSideProps(context) {
  return isAuth(context, (userSession) => {
    return {
      props: {
        userSession,
      },
    };
  });
}

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
