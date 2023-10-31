import React from "react";
import DesktopNavBar from "./DesktopNavBar";
import PageHeader from "./PageHeader";
import ShopNavBottom from "./storefront/ShopNavBottom";
import { useRouter } from "next/router";

function AppLayout({
  children,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute,
}) {
  const { push } = useRouter();

  return (
    <div className="flex overflow-hidden h-screen bg-[color:var(--brown-bg)] relative">
      <DesktopNavBar pageRoute={pageRoute} />
      <div className="overflow-y-scroll w-full">
        <PageHeader
          pageTitle={pageTitle}
          pageIcon={pageIcon}
          mobilePageRoute={mobilePageRoute}
        />

        <main className="scroll">{children}</main>
      </div>
      <ShopNavBottom mobilePageRoute={mobilePageRoute} pageTitle={pageTitle} />
    </div>
  );
}

export default AppLayout;
