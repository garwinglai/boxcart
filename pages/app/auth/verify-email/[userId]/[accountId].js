import React, { useState } from "react";
import email_icon from "@/public/images/icons/email_icon.svg";
import Image from "next/image";
import styles from "@/styles/app/auth/verify-email.module.css";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { options } from "@/pages/api/auth/[...nextauth]";
import { signIn } from "next-auth/react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";

function VerifyEmail({ serializedSession }) {
  const [session, setSession] = useState(!serializedSession ? false : true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { reload, push } = useRouter();

  const handleChangeEmail = (e) => {
    const { value, name } = e.target;
    setEmail(value);
  };

  const handleChangePassword = (e) => {
    const { value, name } = e.target;
    setPassword(value);
  };

  function handleCloseSnackbar() {
    setOpenError(false);
    setErrorMessage("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const signinResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      const { status, error, ok, url } = signinResult;
      // console.log(status, error, ok, url);

      if (status == 200 && ok) {
        reload();
        return;
      }

      if (status == 401) {
        setOpenError(true);
        setErrorMessage("Incorrect email/password.");
      }

      if (status == 403) {
        setOpenError(true);
        setErrorMessage("Access denied.");
      }

      if (status == 500) {
        setOpenError(true);
        setErrorMessage("Network error.");
      }
    } catch (error) {
      console.log("error signing in", error);
      setOpenError(true);
      setErrorMessage("Unknown error. Please contact hello@boxcart.shop");
    }

    setIsLoading(false);
  }

  if (!session) {
    return (
      <div
        className={`${styles.signin} md:bg-[color:var(--brown-bg)] h-screen`}
      >
        <Snackbar open={openError} onClose={handleCloseSnackbar}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
        <div className={`${styles.outerContainer} md:shadow p-12`}>
          <div className="relative">
            <div className="mx-auto pb-4">
              <h2 className="">Please log in to verify your email.</h2>
            </div>
            <form onSubmit={handleLogin} className={`${styles.flexCol}`}>
              <input
                className={`${styles.inputStyle}`}
                type="email"
                onChange={handleChangeEmail}
                placeholder="Email"
                autoFocus
                value={email}
                required
              />
              <input
                className={`${styles.inputStyle}`}
                type="password"
                onChange={handleChangePassword}
                placeholder="Password"
                value={password}
                required
              />
              {isLoading ? (
                <CircularProgress color="inherit" />
              ) : (
                <button type="submit" className={`${styles.btn}`}>
                  Log In
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  function handleClick() {
    const signedInRoute =
      process.env.NODE_ENV && process.env.NODE_ENV === "production"
        ? "app.boxcart.shop/account/checklist"
        : "http://app.localhost:3000/account/checklist";

    push(signedInRoute);
  }

  return (
    <div className={`${styles.verify_email_box}`}>
      <h3>BoxCart</h3>
      <Image src={email_icon} alt="email icon" />
      <h2>Your email has been verified.</h2>
      <button onClick={handleClick}>Go to Account</button>
    </div>
  );
}

export default VerifyEmail;

import {
  updateEmailIsVerifiedUser,
  updateEmailIsVerifiedAccount,
  updateEmailIsVerifiedChecklist,
} from "@/helper/client/api/user";

export async function getServerSideProps(context) {
  const { userId, accountId } = context.query;
  const { req, res } = context;

  const session = await getServerSession(req, res, options);
  const serializedSession = JSON.parse(JSON.stringify(session));

  if (!session) {
    return {
      props: { serializedSession }, // will be passed to the page component as props
    };
  }

  updateEmailIsVerifiedUser(userId);
  updateEmailIsVerifiedAccount(accountId);
  updateEmailIsVerifiedChecklist(accountId);

  return {
    props: { serializedSession },
  };
}
