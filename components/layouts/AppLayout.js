import React, { useEffect, useState } from "react";
import DesktopNavBar from "./DesktopNavBar";
import PageHeader from "./PageHeader";
import ShopNavBottom from "./storefront/ShopNavBottom";
import { useRouter } from "next/router";
import { useAccountStore } from "@/lib/store";
import { signOut } from "next-auth/react";
import { sellerVersion } from "@/helper/temp/tempData";
import { getLocalStorage, setLocalStorage } from "@/utils/clientStorage";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ButtonPrimary from "../global/buttons/ButtonPrimary";
import BoxLoader from "../global/loaders/BoxLoader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 769px)": {
    width: "65%",
  },
  "@media (min-width: 1025px)": {
    width: "45%",
  },
  maxHeight: "80%",
  overflow: "scroll",
  bgcolor: "var(--white)",
  border: "1px solid var(--black-design-extralight)",
  borderRadius: "8px",
  boxShadow: "var(--modal-shadow)",
  p: 4,
};

function AppLayout({
  children,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute,
}) {
  const accountStore = useAccountStore((state) => state.account);

  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isUpdatingVersion, setIsUpdatingVersion] = useState(false);

  
  const { push } = useRouter();
  
  // useEffect(() => {
  //   const currentVersion = getLocalStorage("version seller");
    
  //   if (!currentVersion) {
  //     handleOpenVersionModal();
  //   } else {
  //     if (currentVersion !== sellerVersion.value) {
  //       handleOpenVersionModal();
  //     }
  //   }
  // }, []);
  
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

  const handleOpenVersionModal = () => setIsVersionModalOpen(true);

  const verifiedUpdateClick = () => {
    setIsUpdatingVersion(true);
    setLocalStorage("version seller", sellerVersion.value);
    window.location.reload();
    return;
  };

  return (
    <div className="flex overflow-hidden h-screen relative max-w-screen ">
      <Modal
        open={isVersionModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1>New version update</h1>
          <p className="text-sm">{sellerVersion.value}</p>
          <ol className="p-4">
            {sellerVersion.updates.map((update, index) => {
              return (
                <li key={index} className="text-sm list-disc">
                  {update}
                </li>
              );
            })}
          </ol>
          <div className="w-1/2 mx-auto mt-4 min-h-10">
            {isUpdatingVersion ? (
              <BoxLoader />
            ) : (
              <ButtonPrimary
                type="button"
                name="Update version"
                handleClick={verifiedUpdateClick}
              />
            )}
          </div>
        </Box>
      </Modal>
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
