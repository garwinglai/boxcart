import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import NotificationBox from "./NotificationBox";
import Fade from "@mui/material/Fade";

const style = {
  position: "absolute",
  top: "15.75rem",
  right: "-2%",
  transform: "translate(-50%, -50%)",
  width: "25rem",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  // p: 4,
};

function NotificationPopup({
  isNotifDesktopOpen,
  notifications,
  toggleNotifPopup,
  isMobileView,
}) {
  return (
    <div className="relative">
      <Modal
        open={isNotifDesktopOpen}
        onClose={toggleNotifPopup}
        closeAfterTransition
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={isNotifDesktopOpen}>
          <Box sx={style}>
            <NotificationBox
              toggleNotifPopup={toggleNotifPopup}
              notifications={notifications}
              isMobileView={isMobileView}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default NotificationPopup;
