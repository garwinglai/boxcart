import React from "react";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AppLayout from "@/components/layouts/AppLayout";
import MembershipPackages from "@/components/landing/MembershipPackages";
import { isAuth } from "@/helper/client/auth/isAuth";
import prisma from "@/lib/prisma";

function MemberShip() {
  return (
    <div className="flex flex-col justify-center items-center mt-16">
      <h1>MemberShip</h1>
      <p>Packages coming soon...</p>

      {/* <MembershipPackages /> */}
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
