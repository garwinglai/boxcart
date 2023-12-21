import React, { useState } from "react";
import Image from "next/image";
import logo from "@/public/images/logos/boxcart_logo_full.png";
import Link from "next/link";
import UserCredentials from "@/components/user/auth/UserCredentials";
import { useRouter } from "next/router";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { checkIfUserEmailInUse } from "@/helper/client/api/user";
import { signIn } from "next-auth/react";

// TODO: detect biz session
// TODO: prompt to connect account during signup instead

function SignIn() {
  const [signInValues, setSignInValues] = useState({
    email: "",
    password: "",
    id: "",
    name: "",
    firstName: "",
    lastName: "",
  });
  const [snackbar, setSnackbar] = useState({
    openSnackbar: false,
    snackMessage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasBizAccont, setHasBizAccont] = useState(false);

  const { email, password } = signInValues;
  const { openSnackbar, snackMessage } = snackbar;

  const { push } = useRouter();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isEmailInUse = await checkIfUserEmailInUse(email);

    if (!isEmailInUse.success || isEmailInUse.error) {
      handleOpenSnackbar("Error checking email. Please try again.");
      setIsLoading(false);
      return;
    }

    if (isEmailInUse.success && !isEmailInUse.user) {
      handleOpenSnackbar("Email not found.");
      setIsLoading(false);
      return;
    }

    if (hasBizAccont) {
      const connectedAccount = await handleSubmitConnectAccounts();
      if (!connectedAccount) {
        setIsLoading(false);
        return;
      }
    } else {
      const { user } = isEmailInUse;
      const { account, shopperAccount } = user;

      if (!shopperAccount) {
        setSignInValues((prev) => ({
          ...prev,
          password: "",
          email: user.email,
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
        }));

        // Prompt to connect account
        setHasBizAccont(true);
        setIsLoading(false);

        return;
      }

      const signInResult = await userSignIn(email, password);

      if (!signInResult) {
        setIsLoading(false);
        return;
      }
    }

    const signedInRoute =
      process.env.NODE_ENV && process.env.NODE_ENV === "production"
        ? "https://boxcart.shop/user/account/dashboard"
        : "http://localhost:3000/user/account/dashboard";
    push(signedInRoute);
    return;
  };

  const handleSubmitConnectAccounts = async () => {
    const signInResult = await userSignIn(email, password);

    if (!signInResult) {
      return null;
    }

    const shopperData = buildShopperConnectData(signInValues);

    const connectedShopperAccount = await connectAccounts(shopperData);
    if (!connectedShopperAccount.success || connectedShopperAccount.error) {
      handleOpenSnackbar("Error connecting account. Please try again.");
      return null;
    }

    return true;
  };

  const connectAccounts = async (shopperData) => {
    const apiRoute = "/api/auth/user/connect-user-to-business";

    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shopperData }),
    });
    return await response.json();
  };

  const buildShopperConnectData = (signInValues) => {
    const { name, email, id } = signInValues;

    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];

    const userData = {
      id,
      shopperAccount: {
        name,
        firstName,
        lastName,
        email,
      },
    };

    return userData;
  };

  const userSignIn = async (email, password) => {
    try {
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      const { status, error, ok, url } = signInResult;

      if (status == 200 && ok) {
        return true;
      }

      if (status == 401) {
        handleOpenSnackbar("Incorrect password.");
      }

      if (status == 403) {
        handleOpenSnackbar("Access denied.");
      }

      if (status == 500) {
        handleOpenSnackbar("Network error.");
      }

      return false;
    } catch (error) {
      handleOpenSnackbar("Unknown error. Please contact hello@boxcart.shop.");
      return false;
    }
  };

  const handleNavigateHome = () => {
    push("/");
  };

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" onClick={handleCloseSnackbar}>
        <CloseIcon fontSize="small" sx={{ color: "white" }} />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="p-4 md:bg-[color:var(--purple-bg)] md:h-screen">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackMessage}
        action={action}
      />
      <div className=" md:w-[450px]  md:mx-auto  ">
        <form onSubmit={handleSignIn}>
          <div className="flex items-center justify-between">
            <button type="button" onClick={handleNavigateHome}>
              <div className=" w-40 h-28 relative -mt-8 -mb-4 -ml-8">
                <Image
                  src={logo}
                  alt="boxcart logo"
                  fill
                  priority
                  className=" object-cover rounded"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </button>
            <div className="flex flex-col md:flex-row md:gap-2 items-end mb-4">
              <p className="text-sm">Don&apos;t have an account?</p>
              <Link
                href="/user/auth/signup"
                className="text-sm underlin text-blue-500"
              >
                Sign up
              </Link>
            </div>
          </div>

          <div className="px-2 py-8 md:bg-white md:shadow md:rounded-lg md:mx-auto md:mt-[20%]">
            {hasBizAccont && (
              <p className="text-xs font-medium mx-4 mb-4 p-2 rounded bg-red-100">
                We detected that you have a business account with this email.
                Log in to create and connect a shopper account.
              </p>
            )}
            <UserCredentials
              handleChange={handleChange}
              formValues={signInValues}
              isSignIn={true}
              isSignUp={false}
              isLoading={isLoading}
              hasBizAccont={hasBizAccont}
            />
            <div className="text-right px-8">
              <p className="text-sm">Are you a business?</p>
              <Link
                href="https://boxcart.shop/app/auth/signin"
                className="text-sm underlin text-blue-500"
              >
                Business sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
