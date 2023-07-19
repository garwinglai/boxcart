import React, { useState, useEffect } from "react";
import DesktopNavBar from "./DesktopNavBar";
import PageHeader from "./PageHeader";
import ShopNavBottom from "./storefront/ShopNavBottom";
import { getLocalStorage } from "@/utils/clientStorage";
import Alert from "@mui/material/Alert";
import ButtonThird from "../global/buttons/ButtonThird";
import { useRouter } from "next/router";

function AppLayout({
  children,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute,
}) {
  const [checklistAlertOpen, setChecklistAlertOpen] = useState(false);

  const { push } = useRouter();

  useEffect(() => {
    const isChecklistComplete = getLocalStorage("isChecklistComplete");
    const isChecklistCompleteJson = JSON.parse(isChecklistComplete);
    if (!isChecklistCompleteJson) {
      setChecklistAlertOpen(true);
    }
  }, []);

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
        {checklistAlertOpen && (
          <Alert
            severity="error"
            color="warning"
            action={
              <ButtonThird
                name="Go"
                handleClick={handleGoChecklist}
                type="button"
              />
            }
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              padding: "0.5rem 1rem",
            }}
          >
            <p className="font-light">
              Complete checklist to launch your store.
            </p>
          </Alert>
        )}
        <main className="scroll">{children}</main>
      </div>
      <ShopNavBottom mobilePageRoute={mobilePageRoute} pageTitle={pageTitle} />
    </div>
  );
}

export default AppLayout;
