import React, { useState } from "react";
import UserAccountLayout from "@/components/layouts/user/UserAccountLayout";
import settings_icon from "@/public/images/icons/user/settings_icon.png";
import Image from "next/image";
import { isAuthUserAccount } from "@/helper/server/auth/isAuth";
import prisma from "@/lib/prisma";
import SettingsIcon from "@mui/icons-material/Settings";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/account-settings.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TextField from "@mui/material/TextField";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import { checkEmailAvailableAccount } from "@/helper/client/api/account/email";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import { checkIfUserEmailInUse } from "@/helper/client/api/user";
import { sendShopperVerificationEmail } from "@/helper/client/api/sendgrid/email";

function Settings({ shopperAccount, userId }) {
  const { firstName, lastName, email, isEmailVerified, id } =
    shopperAccount || {};

  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [initialUserValues, setInitialUserValues] = useState(shopperAccount);
  const [userValues, setUserValues] = useState({
    fName: firstName,
    lName: lastName,
    userEmail: email,
  });
  const [isUserInputDisabled, setIsUserInputDisabled] = useState(true);
  const [alert, setAlert] = useState({
    showAlert: false,
    alertMsg: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { fName, lName, userEmail } = userValues;
  const { showAlert, alertMsg } = alert;

  const closeAlert = () => {
    setAlert({ showAlert: false, alertMsg: "" });
  };

  const handleOpenAlert = (msg) => {
    setAlert({ showAlert: true, alertMsg: msg });
  };

  const handleChangeUserValues = (e) => {
    const { name, value } = e.target;

    setUserValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditUserValues = () => {
    // * Cancel
    if (!isUserInputDisabled) {
      setUserValues({
        fName: initialUserValues.firstName,
        lName: initialUserValues.lastName,
        userEmail: initialUserValues.email,
      });
    }

    // * Edit
    setIsUserInputDisabled((prev) => !prev);
  };

  const checkEmailRegex = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailMatchRegex = emailRegex.test(email);
    if (!emailMatchRegex) {
      handleOpenAlert("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const sendEmailVerification = async () => {
    setSendingVerification(true);
    sendShopperVerificationEmail(userId, id, userEmail);
    handleOpenAlert("Email verification sent.");
    setEmailVerificationSent(true);
    setSendingVerification(false);
  };

  const handleSaveUserValues = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const emailChanged = initialUserValues.email !== userEmail;

    if (emailChanged) {
      const isEmailValid = checkEmailRegex(userEmail);
      if (!isEmailValid) return;

      const emailAvailable = await checkIfUserEmailInUse(userEmail);

      if (!emailAvailable.success || emailAvailable.error) {
        handleOpenAlert("Unknown error.");
        setIsLoading(false);
        return;
      }

      const { shopperAccount } = emailAvailable.user ? emailAvailable.user : {};

      if (shopperAccount) {
        handleOpenAlert("Email already exists.");
        setIsLoading(false);
        return;
      }
    }

    const shopperAccountId = id;
    const userData = buildUserData();
    const data = {
      shopperAccountId,
      userData,
    };

    const updateUserAPI = "/api/private/user/account/settings/update-user-info";

    const updateUserResponse = await fetch(updateUserAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const updateUserResponseData = await updateUserResponse.json();
    const { success, value } = updateUserResponseData;

    if (!success) {
      handleOpenAlert("Unknown error.");
      setIsLoading(false);
      return;
    }

    setInitialUserValues(value);
    setIsUserInputDisabled(true);
    setIsLoading(false);
    handleOpenAlert("Updated.");
    return;
  };

  const buildUserData = () => {
    const userData = {
      firstName: fName,
      lastName: lName,
      email: userEmail,
    };

    return userData;
  };

  // * Display
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeAlert}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="p-4 ">
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={closeAlert}
        message={alertMsg}
        action={action}
      />
      <form
        onSubmit={handleSaveUserValues}
        className="flex flex-col gap-4 lg:border lg:rounded-md lg:shadow-lg lg:p-6 lg:w-1/2"
      >
        <div className="flex justify-between items-center">
          <h2>User information</h2>
          <div className="flex items-center gap-2">
            <div className="w-fit h-8">
              <ButtonPrimary
                name={isUserInputDisabled ? "Edit" : "Cancel"}
                type="button"
                handleClick={handleEditUserValues}
              />
            </div>
            {!isUserInputDisabled && (
              <div className="w-fit">
                <ButtonFourth
                  name="Save"
                  type="submit"
                  disabled={isLoading}
                  icon={
                    isLoading ? (
                      <CircularProgress
                        size="1rem"
                        sx={{
                          color: "var(--black-design-extralight)",
                          marginRight: "0.25rem",
                        }}
                      />
                    ) : (
                      ""
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <TextField
            id="outlined-basic"
            label="First name"
            variant="standard"
            disabled={isUserInputDisabled}
            color="warning"
            fullWidth
            value={fName}
            name="fName"
            onChange={handleChangeUserValues}
            required
          />
          <TextField
            id="outlined-basic"
            label="Last name"
            variant="standard"
            fullWidth
            color="warning"
            value={lName}
            disabled={isUserInputDisabled}
            name="lName"
            onChange={handleChangeUserValues}
            required
          />
        </div>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="standard"
          fullWidth
          color="warning"
          value={userEmail}
          disabled={isUserInputDisabled}
          type={"email"}
          name="userEmail"
          onChange={handleChangeUserValues}
          required
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircleIcon
              fontSize="small"
              color={isEmailVerified ? "success" : "disabled"}
            />
            {isEmailVerified ? (
              <p>Email verified</p>
            ) : (
              <p>Email not verified.</p>
            )}
          </div>
          {!isEmailVerified && (
            <React.Fragment>
              {sendingVerification ? (
                <CircularProgress size="1rem" />
              ) : emailVerificationSent ? (
                <p className="text-sm">Sent</p>
              ) : (
                <div className="w-fit h-8">
                  <ButtonPrimary
                    type="button"
                    name="Resend"
                    handleClick={sendEmailVerification}
                  />
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </form>
    </div>
  );
}

export default Settings;

export async function getServerSideProps(context) {
  return isAuthUserAccount(context, async (userSession) => {
    const { user } = userSession;
    const { name, email, id } = user;
    console.log("id", id);
    let serializedAccount;

    try {
      const shopper = await prisma.shopperAccount.findUnique({
        where: {
          email,
        },
      });

      serializedAccount = JSON.parse(JSON.stringify(shopper));
    } catch (error) {
      console.log(error);
      serializedAccount = null;
    }

    return {
      props: { shopperAccount: serializedAccount, userId: id },
    };
  });
}

Settings.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <UserAccountLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </UserAccountLayout>
  );
};

Settings.pageTitle = "Settings";
Settings.pageIcon = (
  <div className="relative w-8 h-8  md:w-10 md:h-10">
    <Image
      src={settings_icon}
      alt="subcribed icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Settings.pageRoute = "settings";
Settings.mobilePageRoute = "settings";
