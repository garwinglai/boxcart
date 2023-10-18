import React from "react";
import styles from "@/styles/components/layouts/page-header.module.css";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MobileNavBar from "./MobileNavBar";
import ButtonPrimary from "../global/buttons/ButtonPrimary";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Badge from "@mui/material/Badge";
import { useChecklistStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";
import { getLocalStorage } from "@/utils/clientStorage";
import Alert from "@mui/material/Alert";
import ButtonThird from "../global/buttons/ButtonThird";
import { useRouter } from "next/router";

function PageHeader({ pageTitle, pageIcon, mobilePageRoute }) {
  const hydrate = useHasHydrated();
  const checklistStore = useChecklistStore((state) => state.checklist);

  const { isChecklistComplete, isNonMandatoryChecklistComplete } =
    checklistStore;

  const isChecklistAlertOpen =
    !isChecklistComplete || !isNonMandatoryChecklistComplete;

  const { push } = useRouter();

  const handleGoChecklist = () => {
    push("/account/checklist");
  };

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div className="sticky top-0  z-20">
      <div className="flex justify-between bg-[color:var(--white)] items-center py-2 px-4 border-b border-[color:var(--gray-light)] shadow-md">
        <div className="flex gap-2 items-center">
          {pageIcon}
          <h3 className="text-[color:var(--black-design)] ">{pageTitle}</h3>
        </div>
        <div className="flex gap-4 items-center">
          <IconButton>
            <Badge color="warning" variant="dot" overlap="circular">
              <NotificationsOutlinedIcon
                sx={{ color: "var(--black-design-extralight)" }}
              />
            </Badge>
          </IconButton>
          <div className="md:hidden">
            <IconButton onClick={toggleDrawer("right", true)}>
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
          open={state.right}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
        >
          <MobileNavBar
            toggleDrawer={toggleDrawer}
            mobilePageRoute={mobilePageRoute}
          />
        </SwipeableDrawer>
      </div>
      {hydrate && isChecklistAlertOpen && (
        <Alert
          severity="error"
          color="success"
          variant="filled"
          action={
            <ButtonThird
              name="Go"
              handleClick={handleGoChecklist}
              type="button"
            />
          }
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
          }}
        >
          <p className="font-light">Complete checklist to launch your store.</p>
        </Alert>
      )}
    </div>
  );
}

export default PageHeader;
