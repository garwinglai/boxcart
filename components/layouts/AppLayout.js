import React, { useState, useEffect } from "react";
import DesktopNavBar from "./DesktopNavBar";
import PageHeader from "./PageHeader";
import ShopNavBottom from "./storefront/ShopNavBottom";
import { getLocalStorage } from "@/utils/clientStorage";
import Alert from "@mui/material/Alert";
import ButtonThird from "../global/buttons/ButtonThird";
import { useRouter } from "next/router";
import { useChecklistStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";

function AppLayout({
  children,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute,
}) {
  const hydrate = useHasHydrated();
  const checklistStore = useChecklistStore((state) => state.checklist);

  const { isChecklistComplete, isNonMandatoryChecklistComplete } =
    checklistStore;

  const isChecklistAlertOpen =
    !isChecklistComplete || !isNonMandatoryChecklistComplete;

  const { push } = useRouter();

  const handleGoChecklist = () => {
    push("/account/checklist");
  };

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
