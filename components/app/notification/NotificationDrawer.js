import React from "react";
import NotificationBox from "./NotificationBox";

function NotificationDrawer({
  notifications,
  toggleNotifDrawer,
  isMobileView,
  pageTitle,
}) {
  return (
    <div className="">
      <NotificationBox
        pageTitle={pageTitle}
        notifications={notifications}
        toggleNotifDrawer={toggleNotifDrawer}
        isMobileView={isMobileView}
      />
    </div>
  );
}

export default NotificationDrawer;
