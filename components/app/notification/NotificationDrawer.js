import React from "react";
import NotificationBox from "./NotificationBox";

function NotificationDrawer({
  notifications,
  toggleNotifDrawer,
  isMobileView,
}) {
  return (
    <div className="">
      <NotificationBox
        notifications={notifications}
        toggleNotifDrawer={toggleNotifDrawer}
        isMobileView={isMobileView}
      />
    </div>
  );
}

export default NotificationDrawer;
