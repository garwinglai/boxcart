import React from "react";
import NotificationCard from "./NotificationCard";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Divider } from "@mui/material";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import { db } from "@/firebase/fireConfig";
import { doc, deleteDoc } from "firebase/firestore";
import sleepingGif from "@/public/videos/sleeping.gif";
import Image from "next/image";

function NotificationBox({
  notifications,
  toggleNotifDrawer,
  toggleNotifPopup,
  isMobileView,
  pageTitle,
}) {
  const notifCount = notifications.length;

  const handleClearAllNotif = async () => {
    for (let i = 0; i < notifications.length; i++) {
      const currNotif = notifications[i];
      const { id } = currNotif;

      const notifDocRef = doc(db, "notifications", id);
      await deleteDoc(notifDocRef);
    }
  };

  const handleCloseNotif = () => {
    if (isMobileView) {
      toggleNotifDrawer("top", false)();
    } else {
      toggleNotifPopup();
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center px-4 py-2 border-b sticky top-0 bg-white">
        <h2>Notifications {notifCount > 0 ? `( ${notifCount} )` : ""} </h2>
        <IconButton onClick={handleCloseNotif}>
          <Close fontSize="small" />
        </IconButton>
      </div>
      {notifCount < 1 ? (
        <div className="h-52 flex flex-col mt-28 items-center gap-4">
          <h4>Nothing to see here...</h4>
          <div>
            <Image src={sleepingGif} alt="sleeping gif" />
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div className=" max-h-96 overflow-y-auto">
            {notifications.map((notif) => {
              const { id } = notif;
              return (
                <div key={id}>
                  <NotificationCard
                    notif={notif}
                    pageTitle={pageTitle}
                    toggleNotifDrawer={toggleNotifDrawer}
                    toggleNotifPopup={toggleNotifPopup}
                    isMobileView={isMobileView}
                  />
                  <Divider />
                </div>
              );
            })}
          </div>
          <div className="px-4 py-2 w-full text-right sticky bottom-0 bg-white border-t">
            <div className="w-fit ml-auto">
              <ButtonThird handleClick={handleClearAllNotif} name="Clear all" />
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default NotificationBox;
