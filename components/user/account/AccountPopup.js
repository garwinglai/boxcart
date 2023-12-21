import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import { signOut } from "next-auth/react";
import { useCartStore, useShopperStore } from "@/lib/store";
import Popover from "@mui/material/Popover";

const style = {
  position: "relative",
  top: "5%",
  left: "61%",
  // transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 426px)": {
    width: "400px",
  },
  maxHeight: "80%",
  overflow: "scroll",
  bgcolor: "var(--white)",
  border: "1px solid var(--black-design-extralight)",
  borderRadius: "4px",
  boxShadow: "var(--modal-shadow)",
};

function AccountPopup({ isModalOpen, handleClose, anchorEl, anchorId }) {
  const removeShopperAccount = useShopperStore(
    (state) => state.removeShopperAccount
  );
  const setCartDetails = useCartStore((state) => state.setCartDetails);

  const [snackbar, setSnackbar] = useState({
    openSnackbar: false,
    snackMessage: "",
  });

  const { openSnackbar, snackMessage } = snackbar;

  const handleOpenSnackbar = (message) => {
    setSnackbar({
      openSnackbar: true,
      snackMessage: message,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({
      openSnackbar: false,
      snackMessage: "",
    });
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    removeShopperAccount();
    handleClose();

    if (setCartDetails) {
      setCartDetails({ applyFivePercentDiscount: false });
    }
  };

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" onClick={handleCloseSnackbar}>
        <CloseIcon fontSize="small" sx={{ color: "white" }} />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="">
      <Popover
        id={anchorId}
        open={isModalOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <button onClick={handleSignOut}>Signout</button>
      </Popover>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackMessage}
        action={action}
      />
    </div>
  );
}

export default AccountPopup;
