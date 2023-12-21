import React, { useEffect } from "react";
import DesktopNavBar from "./DesktopNavBar";
import PageHeader from "./PageHeader";
import ShopNavBottom from "./storefront/ShopNavBottom";
import { useRouter } from "next/router";
import { useAccountStore } from "@/lib/store";
import { signOut } from "next-auth/react";

function AppLayout({
  children,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute,
}) {
  const accountStore = useAccountStore((state) => state.account);
  const { push } = useRouter();

  useEffect(() => {
    if (!accountStore) {
      const logout = async () => {
        await signOut({
          redirect: false,
        });
      };

      logout();
      push("/app/auth/signin");
    }
  }, [accountStore]);

  return (
    <div className="flex overflow-hidden h-screen relative">
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
