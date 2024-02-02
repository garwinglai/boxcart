import React, { useEffect, useState } from "react";
import UserPageHeader from "./UserPageHeader";
import UserMenu from "./UserMenu";
import { shopperVersion } from "@/helper/temp/tempData";
import { getLocalStorage, setLocalStorage } from "@/utils/clientStorage";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import BoxLoader from "@/components/global/loaders/BoxLoader";

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

function UserAccountLayout({
  children,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute,
}) {
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isUpdatingVersion, setIsUpdatingVersion] = useState(false);

  // useEffect(() => {
  //   const currentVersion = getLocalStorage("version shopper");

  //   if (!currentVersion) {
  //     handleOpenVersionModal();
  //   } else {
  //     if (currentVersion !== shopperVersion.value) {
  //       handleOpenVersionModal();
  //     }
  //   }
  // }, []);

  const handleOpenVersionModal = () => setIsVersionModalOpen(true);

  const verifiedUpdateClick = () => {
    setIsUpdatingVersion(true);
    setLocalStorage("version shopper", shopperVersion.value);
    window.location.reload();
    return;
  };
  return (
    <div className="flex overflow-hidden h-screen relative">
      <Modal
        open={isVersionModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1>New version update</h1>
          <p className="text-sm">{shopperVersion.value}</p>
          <ol className="p-4">
            {shopperVersion.updates.map((update, index) => {
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
      <div className="hidden lg:block lg:min-w-[225px] lg:shadow-md lg:h-screen">
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
