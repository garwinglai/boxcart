import UserAccountLayout from "@/components/layouts/user/UserAccountLayout";
import React from "react";
import dashboard_icon from "@/public/images/icons/user/dashboard_icon.png";
import Image from "next/image";
import { isAuthUserAccount } from "@/helper/server/auth/isAuth";

function Dashboard() {
  return <div>Dashboard</div>;
}

export default Dashboard;

export async function getServerSideProps(context) {
  return isAuthUserAccount(context, async (userSession) => {
    const { user } = userSession;
    const { name, email, id } = user;
    let serializedAccount;

    return {
      props: {},
    };
  });
}

Dashboard.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <UserAccountLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </UserAccountLayout>
  );
};

Dashboard.pageTitle = "Dashboard";
Dashboard.pageIcon = (
  <div className="relative w-10 h-10">
    <Image
      src={dashboard_icon}
      alt="dashboard icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Dashboard.pageRoute = "dashboard";
Dashboard.mobilePageRoute = "dashboard";
