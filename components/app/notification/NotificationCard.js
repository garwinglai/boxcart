import React from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useRouter } from "next/router";
import { db } from "@/firebase/fireConfig";
import { doc, deleteDoc } from "firebase/firestore";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

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
    orderStatus,
  } = notif;

  const { push, reload } = useRouter();

  const handleViewNotif = () => {
    handleCloseNotif();

    if (notificationType == 0) {
      //orders
      handleClearNotif();

      if (orderStatus && orderStatus === "pending") {
        if (pageTitle == "Live Orders") {
          reload();
          return;
        }
        push("/app/account/orders/live");
      }

      if (orderStatus && orderStatus === "completed") {
        if (pageTitle == "Order History") {
          reload();
          return;
        }
        push("/app/account/orders/history");
      }
    }

    if (notificationType == 1) {
      // reviews
      handleClearNotif();

      if (pageTitle == "Products") {
        reload();
        return;
      }
      push("/app/account/inventory/products");
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
        {notificationType == 1 && (
          <RateReviewOutlinedIcon sx={{ marginTop: "1rem", color: "gold" }} />
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
