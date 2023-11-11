import BoxLoader from "@/components/global/loaders/BoxLoader";
import { getCookie } from "@/utils/clientStorage";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { CircularProgress, IconButton, Snackbar } from "@mui/material";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import CloseIcon from "@mui/icons-material/Close";

function ResetPassword() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [isDifferentAccessPoint, setIsDifferentAccessPoint] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  const { query, push } = useRouter();
  const { token, email } = query;
  console.log("email", email);
  console.log("query", query);

  useEffect(() => {
    const resetPasswordToken = getCookie("resetPasswordToken");
    if (!resetPasswordToken) {
      setIsTokenExpired(true);

      setIsLoading(false);
      return;
    }

    const cookieToken = resetPasswordToken.split("=")[1];

    console.log("cookieToken", cookieToken);

    if (token != cookieToken) {
      setIsDifferentAccessPoint(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, []);

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

  const handleChangePassword = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const handleConfirmPassword = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    if (password !== confirmPassword) {
      handleOpenSnackbar("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      handleOpenSnackbar("Password must be at least 8 characters.");
      return;
    }

    // TODO: update password with hash
    // TODO: then push to login page
    const signinRoute = "app/auth/signin";
    push(signinRoute);

    setIsUpdatingPassword(false);
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

  return isLoading ? (
    <div>
      <BoxLoader />
    </div>
  ) : isTokenExpired ? (
    <div className="flex flex-col items-center justify-center mt-36">
      <p>Your rest password page has expired.</p>
      <Link href="/auth/forgot-password" className="text-blue-500 text-sm mt-4">
        Forgot password
      </Link>
    </div>
  ) : !isDifferentAccessPoint ? (
    <div className="flex flex-col items-center justify-center mt-36 px-4">
      <p className="text-center">
        It looks like you requested a password reset on a different device.
      </p>
      <br />
      <p className="text-center">
        To ensure your account safety, please resend the reset password link
        below.
      </p>
      <Link href="/auth/forgot-password" className="text-blue-500 text-sm mt-4">
        Forgot password
      </Link>
    </div>
  ) : (
    <div className="h-screen  bg-[color:var(--purple-bg)] flex justify-center">
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={action}
      />
      <form onSubmit={handleResetPassword}>
        <div className="mt-32 w-full bg-white p-4 rounded-lg shadow-md lg:p-8">
          <h2>Enter new password</h2>
          <div className="mt-4">
            <label htmlFor="password">Password</label>
            <input
              className="indent-4 py-1 rounded border border-gray-300 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              type="password"
              onChange={handleChangePassword}
              autoFocus
              value={password}
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password">Confirm password</label>
            <input
              className="indent-4 py-1 rounded border border-gray-300 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              type="password"
              onChange={handleConfirmPassword}
              autoFocus
              value={confirmPassword}
              required
            />
          </div>
          <div className="mt-4 w-fit ml-auto">
            {isUpdatingPassword ? (
              <CircularProgress size={20} />
            ) : (
              <ButtonPrimary
                name="Submit"
                type="submit"
                disabled={isUpdatingPassword}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
