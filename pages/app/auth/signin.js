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
import { useAccountStore, useConnectAccountStore } from "@/lib/store";
import { ChevronLeft } from "@mui/icons-material";
import { checkIfUserEmailInUse } from "@/helper/client/api/user";

function Signin() {
  const setAccount = useAccountStore((state) => state.setAccount);
  const setConnectAccount = useConnectAccountStore(
    (state) => state.setConnectAccount
  );
  const connectAccount = useConnectAccountStore(
    (state) => state.connectAccount
  );

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasShopperAccount, setHasShopperAccount] = useState(false);

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

    const isEmailInUse = await checkIfUserEmailInUse(email);

    if (!isEmailInUse.success || isEmailInUse.error) {
      setOpenError(true);
      setErrorMessage("Error checking email. Please try again.");
      setIsLoading(false);
      return;
    }

    if (isEmailInUse.success && !isEmailInUse.user) {
      setOpenError(true);
      setErrorMessage("Email not found.");
      setIsLoading(false);
      return;
    }

    const { user } = isEmailInUse;
    const { accounts, shopperAccount } = user;

    if (!accounts || accounts.length < 1) {
      setConnectAccount({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
        name: user.name,
      });
      setHasShopperAccount(true);
      setIsLoading(false);
      setPassword("");
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
              ? "https://boxcart.shop/app/account/my-shop"
              : "https://boxcart.shop/app/account/checklist"
            : isChecklistComplete
            ? "http://localhost:3000/app/account/my-shop"
            : "http://localhost:3000/app/account/checklist";
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
    <div className={`${styles.signin} md:bg-[color:var(--purple-bg)] h-screen`}>
      <Snackbar open={openError} onClose={handleCloseSnackbar}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <Link
        href="https://www.home.boxcart.shop"
        className="p-8 ml-24 absolute hover:underline md:flex items-center gap-2 hidden"
      >
        <ChevronLeft />
        Home
      </Link>
      <div className={`${styles.outerContainer} pt-12 px-2 md:shadow md:p-12`}>
        <div className="relative">
          {/* <button className="ml-8" onClick={() => push("https://www.home.boxcart.shop")}>
            <Image
              src={logo}
              alt="boxcart logo"
              className=" aspect-video w-40 h-40 object-cover absolute -top-24 -left-8 "
            />
          </button> */}
          {hasShopperAccount && (
            <p className="text-xs font-medium mb-4 p-2 rounded bg-red-100">
              We detected that you have a shopper account with this email. To
              create and connect a business account,{" "}
              <Link href="/app/auth/signup" className="text-blue-500 underline">
                sign up
              </Link>{" "}
              with the same email.
            </p>
          )}
          <div className="mx-auto text-center pb-4">
            <div className="w-16 h-16 aspect-square relative mx-auto">
              <Image
                src={login_icon}
                fill
                alt="login icon"
                className="mx-auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h2 className="">Business Sign In</h2>
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
            <Link
              href="/auth/forgot-password"
              className="text-right text-xs text-blue-500"
            >
              Forgot password
            </Link>
            {isLoading ? (
              <div className="text-center">
                <CircularProgress color="secondary" size="2rem" />
              </div>
            ) : (
              <button type="submit" className={`${styles.btn}`}>
                Log In
              </button>
            )}
          </form>

          <div className="flex justify-between items-center gap-x-4 flex-wrap my-8">
            <p className="text-sm">Need an account?</p>
            <Link href="/app/auth/signup" className="text-sm text-blue-500">
              Sign up
            </Link>
          </div>
        </div>
        <footer>
          <div className={`${styles.termsContainer} ${styles.flexRow}`}>
            <Link
              href="https://www.home.boxcart.shop/privacy-policy"
              className={`${styles.link} mt-4 underline font-light text-sm`}
            >
              Privacy
            </Link>
            <Link
              href="https://www.home.boxcart.shop/terms-conditions"
              className={`${styles.link} mt-4 underline font-light text-sm`}
            >
              Terms
            </Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">Are you a shopper?</p>
            <Link
              href="https://boxcart.shop/user/auth/signin"
              className="text-sm underlin text-blue-500"
            >
              Shopper sign in
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Signin;
