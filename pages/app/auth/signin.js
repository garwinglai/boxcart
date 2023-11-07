import React, { useState } from "react";
import styles from "@/styles/app/auth/signin.module.css";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import login_icon from "@/public/images/icons/login_icon.png";
import Image from "next/image";
import logo from "@/public/images/logos/boxcart_logo_full.png";
import { checkIsChecklistCompleteClient } from "@/helper/client/api/account/account-schema";
import { checkEmailAvailableAccount } from "@/helper/client/api/account/email";
import { useAccountStore, useChecklistStore } from "@/lib/store";
import { ChevronLeft } from "@mui/icons-material";

const adminLoginTemp = {
  // email: "garwingl@usc.edu",
  // password: "asdfghjkl",
};

const Signin = () => {
  const setAccount = useAccountStore((state) => state.setAccount);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { push } = useRouter();

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

    const emailInUse = await checkEmailAvailableAccount(email);
    const { value, error } = emailInUse;

    if (error) {
      setOpenError(true);
      setErrorMessage("Something went wrong. Please try again.");
      setIsLoading(false);
      return;
    }

    if (!value) {
      setOpenError(true);
      setErrorMessage("Email not found.");
      setIsLoading(false);
      return;
    }

    try {
      const signinResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      const { status, error, ok, url } = signinResult;

      if (status == 200 && ok) {
        const resChecklistComplete = await checkIsChecklistCompleteClient(
          email
        );
        const { success, account } = resChecklistComplete;
        // let checklistComplete = false;
        const { isChecklistComplete } = account;

        if (!success) {
          console.log("error checking if checklist is complete");
        }

        if (account) {
          setAccountStore(account);
        }

        const signedInRoute =
          process.env.NODE_ENV && process.env.NODE_ENV === "production"
            ? isChecklistComplete
              ? "https://app.boxcart.shop/account/my-shop"
              : "https://app.boxcart.shop/account/checklist"
            : isChecklistComplete
            ? "http://app.localhost:3000/account/my-shop"
            : "http://app.localhost:3000/account/checklist";
        push(signedInRoute);
        return;
      }

      if (status == 401) {
        setOpenError(true);
        setErrorMessage("Incorrect password.");
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

  const setAccountStore = async (account) => {
    const {
      id: accountId,
      logoImageFileName,
      bannerImageFileName,
      businessName,
      businessBio,
      city,
      firstName,
      lastName,
      subdomain,
      fullDomain,
      bannerImage,
      logoImage,
    } = account;

    const storedAccount = {
      accountId,
      logoImg: logoImage,
      bannerImg: bannerImage,
      businessName,
      businessBio,
      city,
      firstName,
      lastName,
      subdomain,
      fullDomain,
    };

    setAccount(storedAccount);
  };

  return (
    <div className={`${styles.signin} md:bg-[color:var(--brown-bg)] h-screen`}>
      <Snackbar open={openError} onClose={handleCloseSnackbar}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <Link
        href="https://www.boxcart.site"
        className="p-8 ml-24 absolute hover:underline flex items-center gap-2"
      >
        <ChevronLeft />
        Home
      </Link>
      <div className={`${styles.outerContainer} md:shadow p-12`}>
        <div className="relative">
          <button onClick={() => push("https://www.boxcart.site")}>
            <Image
              src={logo}
              alt="boxcart logo"
              className=" aspect-video w-40 h-40 object-cover absolute -top-24 -left-14 "
            />
          </button>
          <div className="mx-auto text-center pb-4">
            <Image src={login_icon} alt="login icon" className="mx-auto" />
            <h2 className="">Sign in</h2>
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

          <div className="flex flex-col gap-x-4 flex-wrap my-8 md:flex-row md:items-end md:justify-between">
            <p className="text-sm">New to BoxCart?</p>
            <Link
              href="/auth/signup"
              className={`${styles.link} underline text-xs`}
            >
              Get started for free
            </Link>
          </div>
        </div>
        <footer className={`${styles.termsContainer} ${styles.flexRow}`}>
          <Link
            href="/"
            className={`${styles.link} mt-4 underline font-light text-sm`}
          >
            Privacy
          </Link>
          <Link
            href="/"
            className={`${styles.link} mt-4 underline font-light text-sm`}
          >
            Terms
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Signin;
