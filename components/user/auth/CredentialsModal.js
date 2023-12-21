import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import UserCredentials from "./UserCredentials";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { signIn, useSession } from "next-auth/react";
import { checkIfUserEmailInUse } from "@/helper/client/api/user";
import Snackbar from "@mui/material/Snackbar";
import { useEffect } from "react";
import { useShopperStore, useCartStore } from "@/lib/store";
import { sendShopperVerificationEmail } from "@/helper/client/api/sendgrid/email";

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

export default function CredentialsModal({
  isModalOpen,
  handleClose,
  handleOpenAccountModal,
  atCheckout,
  applyFivePercentDiscount,
  cartDetails,
}) {
  const { data: session, status } = useSession();
  const setShopperAccount = useShopperStore((state) => state.setShopperAccount);
  const setCartDetails = useCartStore((state) => state.setCartDetails);

  const [isLoading, setIsLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(
    atCheckout && applyFivePercentDiscount ? false : true
  );
  const [isSignUp, setIsSignUp] = useState(
    atCheckout && applyFivePercentDiscount ? true : false
  );
  const [formValues, setFormValues] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    name: "",
  });
  const [snackbar, setSnackbar] = useState({
    openSnackbar: false,
    snackMessage: "",
  });
  const [hasBizAccont, setHasBizAccont] = useState(false);

  const { firstName, lastName, email, password } = formValues;
  const { openSnackbar, snackMessage } = snackbar;

  useEffect(() => {
    if (!cartDetails) return;

    setFormValues((prev) => ({
      ...prev,
      firstName: cartDetails.customerFName ? cartDetails.customerFName : "",
      lastName: cartDetails.customerLName ? cartDetails.customerLName : "",
      email: cartDetails.customerEmail ? cartDetails.customerEmail : "",
    }));
  }, [cartDetails]);

  useEffect(() => {
    if (cartDetails) return;
    if (session) {
      setFormValues((prev) => ({
        ...prev,
        email: session.user.email,
        name: session.user.name,
        id: session.user.id,
      }));
      setHasBizAccont(true);
    } else {
      setFormValues((prev) => ({
        ...prev,
        email: "",
        name: "",
        id: "",
      }));
      setHasBizAccont(false);
    }
  }, [session]);

  const handleChangeAuth = () => {
    setIsSignIn((prev) => !prev);
    setIsSignUp((prev) => !prev);

    if (isSignIn) {
      setHasBizAccont(false);

      if (atCheckout) return;

      setFormValues((prev) => ({
        ...prev,
        email: "",
        name: "",
        id: "",
        firstName: "",
        lastName: "",
      }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmitConnectAccounts = async (e) => {
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

    const signInResult = await userSignIn(email, password);

    if (!signInResult) {
      setIsLoading(false);
      return;
    }

    const shopperData = buildShopperConnectData(formValues);

    const connectedShopperAccount = await connectAccounts(shopperData);
    if (!connectedShopperAccount.success || connectedShopperAccount.error) {
      handleOpenSnackbar("Error connecting account. Please try again.");
      setIsLoading(false);
      return;
    }

    const { user } = connectedShopperAccount;
    setShopperAccount({
      userId: user.id,
      shopperId: user.shopperAccount.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      name: user.name,
    });

    if (!atCheckout) {
      handleOpenAccountModal();
    }

    if (atCheckout && applyFivePercentDiscount) {
      setCartDetails({
        applyFivePercentDiscount: true,
        customerEmail: user.email,
      });
    }

    handleClose();

    // TODO: display signed in user - jacyk's design
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

  const buildShopperConnectData = (formValues) => {
    const { name, email, id } = formValues;

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

  const handleSubmitAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isEmailInUse = await checkIfUserEmailInUse(email);

    if (isSignIn) {
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

      const { user } = isEmailInUse;
      const { account, shopperAccount } = user;

      if (!shopperAccount) {
        setFormValues((prev) => ({
          ...prev,
          password: "",
          email: user.email,
          name: user.name,
          id: user.id,
        }));

        // Prompt to connect account
        setHasBizAccont(true);
        setIsLoading(false);

        return;
      } else {
        const signInResult = await userSignIn(email, password);
        if (!signInResult) {
          setIsLoading(false);
          return;
        }

        // If signing in not during checkout
        if (!atCheckout) {
          handleOpenAccountModal();
        } else {
          setCartDetails({
            customerEmail: user.email,
          });
        }

        setShopperAccount({
          userId: user.id,
          shopperId: shopperAccount.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          name: user.name,
        });
        // setHasBizAccont(true);
        handleClose();
        setIsLoading(false);
        return;
      }
    }

    if (isSignUp) {
      if (password.length < 8) {
        handleOpenSnackbar("Password must be at least 8 characters long.");
        setIsLoading(false);
        return;
      }

      const isEmailValid = checkEmailRegex(email);

      if (!isEmailValid) {
        handleOpenSnackbar("Invalid email format.");
        setIsLoading(false);
        return;
      }

      // 1. check if email is in use
      if (!isEmailInUse.success || isEmailInUse.error) {
        handleOpenSnackbar("Error checking email. Please try again.");
        setIsLoading(false);
        return;
      }

      if (isEmailInUse.success && isEmailInUse.user) {
        const { user } = isEmailInUse;
        const { shopperAccount } = user;

        if (shopperAccount) {
          // Account exits please sign in
          handleOpenSnackbar("Email exists. Please sign in.");
        } else {
          // biz account exits, please connect
          setFormValues((prev) => ({
            ...prev,
            password: "",
            email: user.email,
            name: user.name,
            id: user.id,
          }));

          // Prompt to connect account
          setHasBizAccont(true);
          handleChangeAuth();
        }
        setIsLoading(false);
        return;
      }

      // 4. if !email - sign up (create new shopper) -> close modal, save store, open account modal
      const newUserData = await buildNewShopperData(formValues);
      const newUser = await createShopper(newUserData);

      if (!newUser.success || newUser.error) {
        handleOpenSnackbar("Sign up error. Please try again.");
        setIsLoading(false);
        return;
      }

      const resSignUp = await userSignIn(email, password);
      if (!resSignUp) {
        setIsLoading(false);
        return;
      }

      const { user } = newUser;
      const { id: userId, shopperAccount, email: userEmail } = user;
      const { id: shopperAccountId } = shopperAccount;

      setShopperAccount({
        userId: user.id,
        shopperId: shopperAccountId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        name: user.name,
      });

      if (!atCheckout) {
        handleOpenAccountModal();
      }

      if (atCheckout && applyFivePercentDiscount) {
        setCartDetails({
          applyFivePercentDiscount: true,
          customerEmail: user.email,
        });
      }

      // setHasBizAccont(true);
      handleClose();
      setIsLoading(false);
      sendShopperVerificationEmail(userId, shopperAccountId, userEmail);

      return;
    }
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

  const buildNewShopperData = async (formValues) => {
    const { firstName, lastName, email, password } = formValues;
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
        onClose={handleClose}
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
          {hasBizAccont ? (
            <form onSubmit={handleSubmitConnectAccounts}>
              <p className="text-xs font-medium mx-4 mb-4 p-2 rounded bg-red-100">
                We detected that you have a business account with this email.
                Log in to create and connect a shopper account. To sign in with
                another account, click{" "}
                <button
                  onClick={() => {
                    setIsSignIn(true);
                    setIsSignUp(false);
                    setHasBizAccont(false);
                  }}
                  className="text-blue-500 underline"
                >
                  Sign in
                </button>
                . To sign up with another account, click{" "}
                <button
                  onClick={() => {
                    setHasBizAccont(false);
                    setIsSignIn(false);
                    setIsSignUp(true);
                  }}
                  className="text-blue-500 underline"
                >
                  Sign up
                </button>
                .
              </p>
              <UserCredentials
                formValues={formValues}
                handleChange={handleFormChange}
                isLoading={isLoading}
                isSignIn={true}
                isSignUp={isSignUp}
                hasBizAccont={hasBizAccont}
              />
            </form>
          ) : (
            <form onSubmit={handleSubmitAuth}>
              <UserCredentials
                formValues={formValues}
                handleChange={handleFormChange}
                isLoading={isLoading}
                isSignIn={isSignIn}
                isSignUp={isSignUp}
              />
            </form>
          )}
          <div className="mb-8">
            {isSignIn ? (
              <span className="flex items-center justify-center gap-2">
                <p>Need an account?</p>
                <button
                  onClick={handleChangeAuth}
                  className="text-blue-500 text-sm"
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <p>Already have an account?</p>
                <button
                  onClick={handleChangeAuth}
                  className="text-blue-500 text-sm"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
