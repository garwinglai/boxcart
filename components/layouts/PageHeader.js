import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MobileNavBar from "./MobileNavBar";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Badge from "@mui/material/Badge";
import { useChecklistStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";
import Alert from "@mui/material/Alert";
import ButtonThird from "../global/buttons/ButtonThird";
import { useRouter } from "next/router";
import { onSnapshot, query, where, collection } from "firebase/firestore";
import { useAccountStore } from "@/lib/store";
import { db } from "@/firebase/fireConfig";
import NotificationDrawer from "../app/notification/NotificationDrawer";
import NotificationPopup from "../app/notification/NotificationPopup";
import Link from "next/link";

function PageHeader({ pageTitle, pageIcon, mobilePageRoute }) {
  const hydrate = useHasHydrated();
  const checklistStore = useChecklistStore((state) => state.checklist);
  const accountStore = useAccountStore((state) => state.account);

  const { isChecklistComplete, isNonMandatoryChecklistComplete } =
    checklistStore;

  const isChecklistAlertOpen =
    !isChecklistComplete || !isNonMandatoryChecklistComplete;

  const [notifications, setNotifications] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [isNotifMobileOpen, setIsNotifMobileOpen] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [isNotifDesktopOpen, setIsNotifDesktopOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const { push } = useRouter();

  useEffect(() => {
    const { accountId, subdomain } = accountStore;

    const notifCollectionRef = collection(db, "notifications");
    const notifQuery = query(
      notifCollectionRef,
      where("accountId", "==", accountId)
    );
    const unsubNotif = onSnapshot(notifQuery, (querySnapshot) => {
      const notifs = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        data.id = id;

        notifs.push(data);
      });

      setNotifications(notifs);
    });

    return () => {
      unsubNotif();
    };
  }, []);

  const toggleMenuDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsMenuOpen((prev) => ({ ...prev, [anchor]: open }));
  };

  const toggleNotifDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsNotifMobileOpen((prev) => ({ ...prev, [anchor]: open }));
  };

  const toggleNotifPopup = () => {
    setIsNotifDesktopOpen((prev) => !prev);
  };

  const handleGoChecklist = () => {
    push("/account/checklist");
  };

  const handleOpenNotificationMenu = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      toggleNotifDrawer("top", true)();
      setIsMobileView(true);
      return;
    }

    setIsMobileView(false);
    toggleNotifPopup();
  };

  const notificationsLabel = (count) => {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  };

  return (
    <div className="sticky top-0  z-20">
      <div className="flex justify-between bg-[color:var(--white)] items-center py-2 px-4 border-b border-[color:var(--gray-light)] shadow-md">
        <div className="flex gap-2 items-center">
          {pageIcon}
          <h3 className="text-[color:var(--black-design)] ">{pageTitle}</h3>
        </div>

        <div className="flex items-center">
          <IconButton
            onClick={handleOpenNotificationMenu}
            aria-label={notificationsLabel(notifications.length)}
          >
            <Badge
              badgeContent={notifications.length}
              color="secondary"
              max={99}
              sx={{
                "& .MuiBadge-badge": { fontSize: 11 },
              }}
            >
              <NotificationsOutlinedIcon
                sx={{ color: "var(--black-design-extralight)" }}
              />
            </Badge>
          </IconButton>
          <React.Fragment>
            <SwipeableDrawer
              anchor="top"
              open={isNotifMobileOpen.top}
              onClose={toggleNotifDrawer("top", false)}
              onOpen={toggleNotifDrawer("top", true)}
            >
              <NotificationDrawer
                toggleNotifDrawer={toggleNotifDrawer}
                pageTitle={pageTitle}
                notifications={notifications}
                isMobileView={isMobileView}
              />
            </SwipeableDrawer>
            <NotificationPopup
              pageTitle={pageTitle}
              isNotifDesktopOpen={isNotifDesktopOpen}
              toggleNotifPopup={toggleNotifPopup}
              notifications={notifications}
              isMobileView={isMobileView}
            />
          </React.Fragment>
          <div className="md:hidden">
            <IconButton onClick={toggleMenuDrawer("right", true)}>
              <MenuIcon
                sx={{ color: "var(--black-design-extralight)" }}
                fontSize="small"
              />
            </IconButton>
          </div>
          <p className="hidden md:block md:text-[color:var(--gray-text)] md:text-sm md:font-extralight ">
            Powered by BoxCart
          </p>
        </div>
        <SwipeableDrawer
          anchor="right"
          open={isMenuOpen.right}
          onClose={toggleMenuDrawer("right", false)}
          onOpen={toggleMenuDrawer("right", true)}
        >
          <MobileNavBar
            toggleDrawer={toggleMenuDrawer}
            mobilePageRoute={mobilePageRoute}
          />
        </SwipeableDrawer>
      </div>
      {hydrate && isChecklistAlertOpen && (
        <Link href="/account/checklist">
          <Alert
            // severity="error"
            // color="success"
            variant="filled"
            action={
              <ButtonThird
                name="Checklist"
                handleClick={handleGoChecklist}
                type="button"
              />
            }
            sx={{
              backgroundColor: "var(--primary-light-med)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              padding: "0.5rem 1rem",
            }}
          >
            <p className=" font-normal text-[color:var(--black-design-extralight)]">
              Complete <u>checklist</u> to launch your store.
            </p>
          </Alert>
        </Link>
      )}
    </div>
  );
}

export default PageHeader;
