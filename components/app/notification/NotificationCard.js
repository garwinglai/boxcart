import React, { useState } from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ChatIcon from "@mui/icons-material/Chat";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import ButtonFilter from "@/components/global/buttons/ButtonFilter";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useRouter } from "next/router";
import { db } from "@/firebase/fireConfig";
import { doc, deleteDoc } from "firebase/firestore";

function NotificationCard({
  notif,
  toggleNotifDrawer,
  toggleNotifPopup,
  isMobileView,
  pageTitle,
}) {
  const {
    id,
    dateTimeString,
    notificationMessage,
    notificationTitle,
    notificationType,
  } = notif;

  const { push, reload } = useRouter();

  const handleViewNotif = () => {
    handleCloseNotif();

    if (notificationType == 0) {
      handleClearNotif();

      if (pageTitle == "Live Orders") {
        reload();
        return;
      }
      push("/account/orders/live");
    }
  };

  const handleCloseNotif = () => {
    if (isMobileView) {
      toggleNotifDrawer("top", false)();
    } else {
      toggleNotifPopup();
    }
  };

  const handleClearNotif = async () => {
    const notifDocRef = doc(db, "notifications", id);
    await deleteDoc(notifDocRef);
  };

  return (
    <div className="pr-4 pl-2 py-3">
      <div className="flex items-start gap-2">
        {notificationType == 0 && (
          <AttachMoneyIcon color="success" sx={{ marginTop: "1rem" }} />
        )}
        <div className="w-full">
          <div className="flex justify-between items-center">
            <span>
              <h5 className="">{notificationTitle}</h5>
              <p className="text-sm">{notificationMessage}</p>
            </span>

            <button onClick={handleClearNotif} className="text-sm underline">
              clear
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <button
                onClick={handleViewNotif}
                className="border border-[color:var(--black-design-extralight)] rounded text-xs px-3 py-1"
              >
                View
              </button>
            </div>
            <p className="text-xs font-extralight">{dateTimeString}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
