import UserAccountLayout from "@/components/layouts/user/UserAccountLayout";
import React from "react";
import settings_icon from "@/public/images/icons/user/settings_icon.png";
import Image from "next/image";
import { isAuthUserAccount } from "@/helper/server/auth/isAuth";

function Settings() {
  return <div>Settings</div>;
}

export default Settings;

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

Settings.getLayout = function getLayout(
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

Settings.pageTitle = "Settings";
Settings.pageIcon = (
  <div className="relative w-10 h-10">
    <Image
      src={settings_icon}
      alt="subcribed icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Settings.pageRoute = "settings";
Settings.mobilePageRoute = "settings";
