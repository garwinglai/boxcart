import React, { useState, useEffect } from "react";
import DesktopNavBar from "./DesktopNavBar";
import PageHeader from "./PageHeader";
import ShopNavTop from "./storefront/ShopNavTop";
import ShopNavBottom from "./storefront/ShopNavBottom";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import Link from "next/link";
import { getLocalStorage } from "@/utils/clientStorage";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AppLayout({
  children,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute,
}) {
  const [snackbarPosition, setSnackbarPosition] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = snackbarPosition;

  useEffect(() => {
    const isChecklistComplete = getLocalStorage("isChecklistComplete");
    const isChecklistCompleteJson = JSON.parse(isChecklistComplete);
    if (!isChecklistCompleteJson) {
      setSnackbarPosition({
        open: true,
        vertical: "bottom",
        horizontal: "center",
      });
    }
  }, []);

  return (
    <div className="flex overflow-hidden h-screen bg-[color:var(--brown-bg)] relative">
      <DesktopNavBar pageRoute={pageRoute} />
      <div className=" overflow-y-scroll w-full">
        <div className="absolute mx-auto mt-10 flex justify-center">
          <Snackbar
            open={open}
            key={vertical + horizontal}
            anchorOrigin={{ vertical, horizontal }}
            sx={{
              width: "fit-content",
              marginBottom: "4rem",
            }}
            message={
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-light md:text-sm">
                  Complete checklist to launch your store.
                </p>
                <Link
                  href="/account/checklist"
                  className="text-xs py-1 border border-white rounded px-2 active md:text-sm active:bg-white active:text-black"
                >
                  Go
                </Link>
              </div>
            }
          />
        </div>
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
