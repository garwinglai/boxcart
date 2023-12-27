import React from "react";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UserMenu from "./UserMenu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

function UserPageHeader({ pageTitle, pageIcon, pageRoute }) {
  const [drawerState, setDrawerState] = React.useState({
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

    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const handleOpenMenu = (e) => {
    toggleDrawer("right", true)(e);
  };

  const handleCloseMenu = (e) => {
    toggleDrawer("right", false)(e);
  };

  return (
    <div className="sticky top-0 bg-white z-10 px-4 py-2 flex justify-between items-center w-full border-b">
      <div className="flex items-center gap-2">
        {pageIcon}
        <h1 className="text-base md:text-lg">{pageTitle}</h1>
      </div>
      <p className="hidden text-gray-400 text-sm md:block">Powered by BoxCart</p>
      <div className="lg:hidden">
        <IconButton onClick={handleOpenMenu}>
          <AccountCircleIcon />
        </IconButton>

        <SwipeableDrawer
          anchor={"right"}
          open={drawerState["right"]}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          sx={{ width: "500px" }}
        >
          <div className="w-screen h-screen md:w-[30vw]">
            <UserMenu
              pageRoute={pageRoute}
              isMobileView={true}
              handleCloseMenu={handleCloseMenu}
            />
          </div>
        </SwipeableDrawer>
      </div>
    </div>
  );
}

export default UserPageHeader;
