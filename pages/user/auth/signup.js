import React, { useState } from "react";
import Image from "next/image";
import logo from "@/public/images/logos/boxcart_logo_full.png";
import Link from "next/link";
import UserCredentials from "@/components/user/auth/UserCredentials";
import { useRouter } from "next/router";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { signIn } from "next-auth/react";
import { sendShopperVerificationEmail } from "@/helper/client/api/sendgrid/email";
import { checkIfUserEmailInUse } from "@/helper/client/api/user";

function SignUp() {
  const [signUpValues, setSignUpValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    id: "",
    name: "",
  });
  const [snackbar, setSnackbar] = useState({
    openSnackbar: false,
    snackMessage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasBizAccont, setHasBizAccont] = useState(false);

  const { openSnackbar, snackMessage } = snackbar;
  const { firstName, lastName, email, password } = signUpValues;

  const { push } = useRouter();

  const handleNavigateHome = () => {
    push("/");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (password.length < 8) {
      handleOpenSnackbar("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    const isEmailValid = checkEmailRegex(email);

    if (!isEmailValid) {
      setOpenError(true);
      setErrorMessage("Invalid email format.");
      setIsLoading(false);
      return;
    }

    const isEmailInUse = await checkIfUserEmailInUse(email);

    if (!isEmailInUse.success || isEmailInUse.error) {
      handleOpenSnackbar("Error checking email. Please try again.");
      setIsLoading(false);
      return;
    }

    if (hasBizAccont) {
      if (isEmailInUse.success && !isEmailInUse.user) {
        handleOpenSnackbar("Email not found.");
        setIsLoading(false);
        return;
      }
      const connectedAccount = await handleSubmitConnectAccounts();
      if (!connectedAccount) {
        setIsLoading(false);
        return;
      }
    } else {
      if (isEmailInUse.success && isEmailInUse.user) {
        const { user } = isEmailInUse;
        const { shopperAccount, accounts } = user;
        if (shopperAccount) {
          handleOpenSnackbar("Email already in use.");
          setIsLoading(false);
          return;
        }

        if (accounts && accounts.length > 0) {
          setHasBizAccont(true);
          setIsLoading(false);
          setSignUpValues((prev) => ({
            ...prev,
            id: user.id,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "",
          }));
          return;
        }

        return;
      }

      // No user yet - sign up.
      const newUserData = await buildNewUserData(signUpValues);
      const newUser = await createShopper(newUserData);

      if (!newUser.success || newUser.error) {
        handleOpenSnackbar("Sign up error. Please try again.");
        setIsLoading(false);
        return;
      }

      const resSignUp = await signUpUser(signUpValues);
      if (!resSignUp) return;

      const { user } = newUser;
      const { id: userId, shopperAccount, email: userEmail } = user;
      const { id: shopperAccountId } = shopperAccount;

      sendShopperVerificationEmail(userId, shopperAccountId, userEmail);
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

    const shopperData = buildShopperConnectData(signUpValues);

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

  const buildShopperConnectData = (signUpValues) => {
    const { name, email, id } = signUpValues;

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

  const signUpUser = async (user) => {
    const { email, password } = user;
    try {
      const signedUp = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      const { status, error, ok } = signedUp;

      if (status == 200 && ok) {
        return true;
      }

      if (status == 401) {
        handleOpenSnackbar("Invalid password.");
      }

      if (status == 403) {
        handleOpenSnackbar("Access denied.");
      }

      if (status == 500) {
        handleOpenSnackbar("Network error.");
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      handleOpenSnackbar("Unknown error. Please contact hello@boxcart.shop.");
      setIsLoading(false);
      return false;
    }
  };

  const createShopper = async (newUserData) => {
    const apiRoute = "/api/auth/user/create-user";

    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userData: newUserData }),
    });
    return await response.json();
  };

  const buildNewUserData = async (signUpValues) => {
    const { firstName, lastName, email, password } = signUpValues;
    const name = firstName + " " + lastName;

    const userData = {
      name,
      firstName,
      lastName,
      email,
      password,
      shopperAccount: {
        create: {
          name,
          firstName,
          lastName,
          email,
        },
      },
    };

    return userData;
  };

  const checkEmailRegex = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailMatchRegex = emailRegex.test(email);
    if (!emailMatchRegex) {
      setErrorMessage("Please enter a valid email address.");
      setOpenError(true);
      return false;
    }
    return true;
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
      <div className="  md:mx-auto  md:w-[450px] ">
        <form onSubmit={handleSignUp}>
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
              <p className="text-sm">Have an account?</p>
              <Link
                href="/user/auth/signin"
                className="text-sm underlin text-blue-500"
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="px-2 py-8 md:bg-white md:shadow md:rounded-lg  md:mx-auto md:mt-[20%]">
            {hasBizAccont && (
              <p className="text-xs font-medium mx-4 mb-4 p-2 rounded bg-red-100">
                We detected that you have a business account with this email.
                Log in to create and connect a shopper account.
              </p>
            )}
            <UserCredentials
              handleChange={handleChange}
              formValues={signUpValues}
              isSignIn={false}
              isSignUp={true}
              isLoading={isLoading}
              hasBizAccont={hasBizAccont}
            />
            <div className="text-right px-8">
              <p className="text-sm">Are you a business?</p>
              <Link
                href="https://boxcart.shop/app/auth/signup"
                className="text-sm underlin text-blue-500"
              >
                Business sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
