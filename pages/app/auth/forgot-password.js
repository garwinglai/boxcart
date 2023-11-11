import React, { useState } from "react";
import { ChevronLeft } from "@mui/icons-material";
import Link from "next/link";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { CircularProgress, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { checkEmailAvailableAccount } from "@/helper/client/api/account/email";
import { setCookie } from "@/utils/clientStorage";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  const handleOpenSnackbar = (message) => {
    setSnackbar({
      isSnackbarOpen: true,
      snackbarMessage: message,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      isSnackbarOpen: false,
      snackbarMessage: "",
    });
  };

  const handleChangeEmail = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleSendPasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const emailInUse = await checkEmailAvailableAccount(email);
    const { value, error } = emailInUse;

    if (error) {
      handleOpenSnackbar("Something went wrong. Please try again.");
      setIsLoading(false);
      return;
    }

    if (!value) {
      handleOpenSnackbar("Email not found.");
      setIsLoading(false);
      return;
    }

    let fourDigitCode = Math.floor(1000 + Math.random() * 9000);
    let tenMinutes = 600; //seconds
    setCookie(fourDigitCode, tenMinutes);

    const res = await sendPasswordResetEmail(email, fourDigitCode);

    if (!res.success || res.error) {
      handleOpenSnackbar("Something went wrong. Please try again.");
      setIsLoading(false);
      return;
    }

    handleOpenSnackbar("Email sent.");
    setIsLoading(false);
  };

  const sendPasswordResetEmail = async (email, fourDigitCode) => {
    const api = "/api/public/auth/password-reset-email";

    const res = await fetch(api, {
      method: "POST",
      body: JSON.stringify({ email, fourDigitCode }),
    });
    const data = await res.json();

    return data;
  };

  // * Display
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="h-screen   bg-[color:var(--purple-bg)] flex justify-center">
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={action}
      />
      <Link
        href="https://www.boxcart.site"
        className="absolute left-0 flex item-center gap-2 m-4"
      >
        <ChevronLeft />
        Signin
      </Link>
      <form onSubmit={handleSendPasswordReset}>
        <div className="mt-32 w-fit bg-white p-4 rounded-lg shadow-md lg:p-8">
          <h2>Enter your account email</h2>
          <p className="mt-2 text-sm">
            We will send you a link to reset your password.
          </p>
          <div className="mt-4">
            <label htmlFor="email">Email</label>
            <input
              className="indent-4 py-1 rounded border border-gray-300 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              type="email"
              onChange={handleChangeEmail}
              autoFocus
              value={email}
              required
            />
          </div>
          <div className="mt-4 w-fit ml-auto">
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <ButtonPrimary name="Submit" type="submit" disabled={isLoading} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
