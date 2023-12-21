import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import ShareIcon from "@mui/icons-material/Share";
import prisma from "@/lib/prisma";
import QRCode from "react-qr-code";
import { isAuth } from "@/helper/server/auth/isAuth";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CircularProgress, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { useRouter } from "next/router";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import { useAccountStore, useChecklistStore } from "@/lib/store";
import {
  updateIsNonMandatoryChecklistComplete,
  updateViewStoreChecklistClient,
} from "@/helper/client/api/checklist";
import { useHasHydrated } from "@/utils/useHasHydrated";

function ShareShop({ userAccount }) {
  const hydrated = useHasHydrated();
  const checklistStore = useChecklistStore((state) => state.checklist);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  const { fullDomain } = userAccount;

  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isViewShopLoading, setIsViewShopLoading] = useState(false);

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  const { push } = useRouter();

  useEffect(() => {
    const {
      accountId,
      hasViewedShareStore,
      hasLogo,
      hasBanner,
      isNonMandatoryChecklistComplete,
    } = checklistStore;
    if (!hydrated) return;
    if (isNonMandatoryChecklistComplete) return;

    if (!hasViewedShareStore) {
      setChecklistStore({ hasViewedShareStore: true });
      const updateViewStoreChecklist = async (accountId) => {
        await updateViewStoreChecklistClient(accountId);
      };

      updateViewStoreChecklist(accountId);
      if (hasLogo && hasBanner) {
        const checklistComplete = true;
        setChecklistStore({
          isNonMandatoryChecklistComplete: checklistComplete,
        });

        const updateNonMandatoryChecklist = async (
          accountId,
          checklistComplete
        ) => {
          await updateIsNonMandatoryChecklistComplete(
            accountId,
            checklistComplete
          );
        };

        updateNonMandatoryChecklist(accountId, checklistComplete);
      }
    }
  }, [hydrated]);

  const handleCopyIdToClipboard = () => {
    navigator.clipboard.writeText(fullDomain);
    handleOpenSnackbar("copied.");
  };

  const handleOpenSnackbar = (message) => {
    setSnackbar({
      isSnackbarOpen: true,
      snackbarMessage: message,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      isSnackbarOpen: false,
      snackbarMessage: "",
    });
  };

  const handleEditURL = () => {
    setIsLoading(true);
    push("/app/account/my-shop/profile");
  };

  const handleViewShop = () => {
    setIsViewShopLoading(true);
    const newUrl = fullDomain.includes("https://")
      ? fullDomain
      : `https://${fullDomain}`;
    window.open(newUrl, "_blank");
    setIsViewShopLoading(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-16 mt-8 lg:flex-row-reverse lg:gap-32 lg:mt-32">
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={action}
      />
      <div className="flex flex-col items-end gap-4 lg:w-1/3">
        <div className="flex items-center justify-between gap-4 border rounded border-[color:var(--black-design-extralight)] py-1 px-2 w-full flex-wrap">
          <p className="">{fullDomain}</p>
          <IconButton onClick={handleCopyIdToClipboard}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </div>
        <div className="flex justify-between w-full">
          <div className="w-fit">
            <ButtonSecondary
              name="Edit URL"
              handleClick={handleEditURL}
              disabled={isLoading}
              icon={
                isLoading ? (
                  <CircularProgress sx={{ color: "white" }} size="1rem" />
                ) : null
              }
            />
          </div>
          <div className="w-fit">
            <ButtonPrimary
              name="View shop"
              handleClick={handleViewShop}
              disabled={isViewShopLoading}
              icon={
                isViewShopLoading ? (
                  <CircularProgress sx={{ color: "white" }} size="1rem" />
                ) : null
              }
            />
          </div>
        </div>
      </div>
      <QRCode value={fullDomain} size={188} />
    </div>
  );
}

export default ShareShop;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user } = userSession;
    const { name, email, id } = user;
    let serializedAccount;

    try {
      const userAccount = await prisma.account.findUnique({
        where: {
          email,
        },
      });

      if (!userAccount) {
        return {
          redirect: {
            destination:
              process.env.NODE_ENV && process.env.NODE_ENV === "production"
                ? "/app/auth/signin"
                : "http://localhost:3000/app/auth/signin",
            permanent: false,
          },
        };
      }

      serializedAccount = JSON.parse(JSON.stringify(userAccount));
    } catch (error) {
      console.log("serversideprops checklist error:", error);
      serializedAccount = null;
    }

    return {
      props: {
        userSession,
        userAccount: serializedAccount,
      },
    };
  });
}

ShareShop.getLayout = function getLayout(
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
      mobilePageRoute={mobilePageRoute}
      pageRoute={pageRoute}
    >
      {page}
    </AppLayout>
  );
};

ShareShop.pageTitle = "Share shop";
ShareShop.pageIcon = (
  <ShareIcon sx={{ color: "var(--black-design-extralight)" }} />
);
ShareShop.pageRoute = "share-shop";
ShareShop.mobilePageRoute = "share-shop";
