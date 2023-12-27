import React from "react";
import UserPageHeader from "./UserPageHeader";
import UserMenu from "./UserMenu";

function UserAccountLayout({
  children,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute,
}) {
  return (
    <div className="flex overflow-hidden h-screen relative">
      <div className="hidden lg:block lg:w-[225px] lg:shadow-md lg:h-screen">
        <UserMenu pageRoute={pageRoute} />
      </div>
      <div className="flex-grow overflow-scroll">
        <UserPageHeader
          pageTitle={pageTitle}
          pageIcon={pageIcon}
          pageRoute={pageRoute}
        />
        <main className="">{children}</main>
      </div>
    </div>
  );
}

export default UserAccountLayout;