import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import checkout_basket_icon from "@/public/images/icons/checkout_basket_icon.png";
import Image from "next/image";
import CredentialsModal from "../CredentialsModal";
import coin_icon from "@/public/images/icons/coin_icon.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
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

function SignupPrompt({
  isModalOpen,
  handleClose,
  handleGuestCheckoutTrue,
  handleGuestCheckoutFalse,
  isGuestCheckout,
  cartDetails,
}) {
  const [snackbar, setSnackbar] = useState({
    openSnackbar: false,
    snackMessage: "",
  });
  const [showSignupOrSignin, setShowSignupOrSignin] = useState(false);
  const [applyFivePercentDiscount, setApplyFivePercentDiscount] =
    useState(false);

  const { openSnackbar, snackMessage } = snackbar;

  const handleOpenSignupOrSigninModal = () => setShowSignupOrSignin(true);
  const handleCloseSignupOrSigninModal = () => {
    handleClose();
    setShowSignupOrSignin(false);
    setApplyFivePercentDiscount(false);
  };

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

  const handleSigninOrSignup = () => {
    handleOpenSignupOrSigninModal(true);
    handleGuestCheckoutFalse();
  };

  const handleSigninOrSignupMoneyBack = () => {
    handleOpenSignupOrSigninModal(true);
    setApplyFivePercentDiscount(true);
    handleGuestCheckoutFalse();
  };

  const handleContinueAsGuest = () => {
    handleClose();
    handleGuestCheckoutTrue();
  };

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" onClick={handleCloseSnackbar}>
        <CloseIcon fontSize="small" sx={{ color: "white" }} />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Modal
        open={isModalOpen}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackMessage}
            action={action}
          />
          <div className="text-right">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          {!showSignupOrSignin ? (
            isGuestCheckout ? (
              <div className="px-4 pb-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 relative">
                    <Image
                      src={coin_icon}
                      alt="discount coint icon"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <span className="text-center">
                    <h4>Create an account and earn 5% back</h4>
                    <p className="text-sm">
                      Limited time - <u>new</u> signups only.
                    </p>
                  </span>
                </div>
                <div className="flex flex-col gap-2 my-4">
                  <button
                    type="button"
                    className="border border-[color:var(--black-design-extralight)] rounded-full w-full py-2"
                    onClick={handleContinueAsGuest}
                  >
                    Continue as guest
                  </button>
                  <button
                    type="button"
                    className="border rounded-full w-full py-2 text-white bg-[color:var(--secondary)]"
                    onClick={handleSigninOrSignupMoneyBack}
                  >
                    Signup
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 pb-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 relative">
                    <Image
                      src={checkout_basket_icon}
                      alt="checkout icon"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h4>Select a checkout method:</h4>
                </div>
                <div className="flex flex-col gap-2 my-8">
                  <button
                    className="border border-[color:var(--black-design-extralight)] rounded-full w-full py-2"
                    onClick={handleGuestCheckoutTrue}
                  >
                    Guest checkout
                  </button>
                  <button
                    className="border rounded-full w-full py-2 text-white bg-[color:var(--secondary)]"
                    onClick={handleSigninOrSignup}
                  >
                    Signin / Signup
                  </button>
                </div>
              </div>
            )
          ) : (
            <CredentialsModal
              isModalOpen={showSignupOrSignin}
              handleClose={handleCloseSignupOrSigninModal}
              applyFivePercentDiscount={applyFivePercentDiscount}
              atCheckout={true}
              cartDetails={cartDetails}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default SignupPrompt;
