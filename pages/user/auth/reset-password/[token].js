import BoxLoader from "@/components/global/loaders/BoxLoader";
import { getCookie } from "@/utils/clientStorage";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { CircularProgress, IconButton, Snackbar } from "@mui/material";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import CloseIcon from "@mui/icons-material/Close";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";

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
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  const { query, push } = useRouter();
  const { token, email, site } = query;

  useEffect(() => {
    const resetPasswordToken = getCookie("resetPasswordToken");
    if (!resetPasswordToken) {
      setIsTokenExpired(true);
      setIsLoading(false);
      return;
    }

    const cookieToken = resetPasswordToken.split("=")[1];

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
      setIsUpdatingPassword(false);
      return;
    }

    if (password.length < 8) {
      handleOpenSnackbar("Password must be at least 8 characters.");
      setIsUpdatingPassword(false);
      return;
    }

    const { success, error, value } = await resetPassword(password, email);

    if (success) {
      setPasswordUpdated(true);
      setIsUpdatingPassword(false);
      handleOpenSnackbar("Password updated.");
      return;
    }

    if (error) {
      handleOpenSnackbar("Problem resetting password. Please try again.");
      setIsUpdatingPassword(false);
    }
  };

  const resetPassword = async (password, email) => {
    const api = "/api/public/auth/reset-password";

    const body = {
      password,
      email,
    };

    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  };

  const handleGoLogin = () => {
    push("/user/auth/signin");
  };

  const handleGoShopping = () => {
    push(`/${site}`);
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
  ) : passwordUpdated ? (
    <div className="flex flex-col items-center justify-center mt-36">
      <h5>Password updated</h5>
      <div className="mt-4">
        {site && site !== "undefined" && (
          <div className="mb-4">
            <ButtonSecondary
              name="Continue shopping"
              handleClick={handleGoShopping}
            />
          </div>
        )}
        <div>
          <ButtonPrimary name="Sign in" handleClick={handleGoLogin} />
        </div>
      </div>
    </div>
  ) : isTokenExpired ? (
    <div className="flex flex-col items-center justify-center mt-36">
      <p>
        This reset password page has expired, or you requested a password reset
        from a different device.
      </p>
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
