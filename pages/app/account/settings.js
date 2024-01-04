import React, { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/account-settings.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TextField from "@mui/material/TextField";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { isAuth } from "@/helper/server/auth/isAuth";
import prisma from "@/lib/prisma";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import { checkEmailAvailableAccount } from "@/helper/client/api/account/email";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";

function AccountSettings({ userAccount }) {
  const {
    SavedPaymentMethod,
    firstName,
    lastName,
    email,
    id,
    isEmailVerified,
  } = userAccount;

  const [initialUserValues, setInitialUserValues] = useState(userAccount);
  const [userValues, setUserValues] = useState({
    fName: firstName,
    lName: lastName,
    bizEmail: email,
  });
  const [isUserInputDisabled, setIsUserInputDisabled] = useState(true);
  const [alert, setAlert] = useState({
    showAlert: false,
    alertMsg: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { fName, lName, bizEmail } = userValues;
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
        bizEmail: initialUserValues.email,
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

  const handleSaveUserValues = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const emailChanged = initialUserValues.email !== bizEmail;

    if (emailChanged) {
      const isEmailValid = checkEmailRegex(bizEmail);
      if (!isEmailValid) return;

      const emailAvailable = await checkEmailAvailableAccount(bizEmail);

      if (!emailAvailable.success) {
        handleOpenAlert("Unknown error.");
        setIsLoading(false);
        return;
      }

      if (!emailAvailable.value) {
        handleOpenAlert("Email already exists.");
        setIsLoading(false);
        return;
      }
    }

    const accountId = initialUserValues.id;
    const userData = buildUserData();
    const data = {
      accountId,
      userData,
    };

    const updateUserAPI = "/api/private/settings/update-user-info";

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
      email: bizEmail,
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
    <div className={`${styles.account_settings_box} ${styles.flexCol}`}>
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={closeAlert}
        message={alertMsg}
        action={action}
      />

      <form
        onSubmit={handleSaveUserValues}
        className={`${styles.section_box} ${styles.user_info_box} ${styles.flexCol}`}
      >
        <div className={`${styles.section_header_box} ${styles.flex}`}>
          <h3>User Info</h3>
          <div className="flex items-center gap-2">
            <div className="w-fit">
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
        <div className={`${styles.flex} ${styles.info_name_box}`}>
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
          color="warning"
          value={bizEmail}
          disabled={isUserInputDisabled}
          type={"email"}
          name="bizEmail"
          onChange={handleChangeUserValues}
          required
        />
        <div className={`${styles.section_footer_group} ${styles.flex}`}>
          <div className={`${styles.email_verified_group} ${styles.flex}`}>
            <CheckCircleIcon
              fontSize="small"
              color={isEmailVerified ? "success" : "disabled"}
            />
            {isEmailVerified ? (
              <p>Email verified</p>
            ) : (
              <p>Email not verified, view checklist</p>
            )}
          </div>
          {/* <button type="button" className={`${styles.change_password_btn}`}>
            Change password
          </button> */}
        </div>
      </form>
      <div className={`${styles.section_left} ${styles.flex}`}>
        <form
          className={`${styles.section_box} ${styles.membership_info_box} ${styles.flexCol}`}
        >
          <div className={`${styles.section_header_box} ${styles.flex}`}>
            <h3>Membership</h3>
            <div>
              <ButtonPrimary name="Change Plan" type="button" />
            </div>
          </div>
          <p className="text-sm font-light">Coming soon ... </p>
          {/* <div className={`${styles.membership_context_box} ${styles.flexCol}`}>
            <div className={`${styles.flex} ${styles.member_context_group}`}>
              <h5>Free period:</h5>
              <p>In process</p>
            </div>
            <div className={`${styles.flex} ${styles.member_context_group}`}>
              <h5>Free period end:</h5>
              <p>June 3rd, 2023</p>
            </div>
            <div className={`${styles.flex} ${styles.member_context_group}`}>
              <h5>Current plan:</h5>
              <p>-</p>
            </div>
            <div className={`${styles.flex} ${styles.member_context_group}`}>
              <h5>Plan cost:</h5>
              <p>-</p>
            </div>
            <div className={`${styles.flex} ${styles.member_context_group}`}>
              <h5>Next payment date:</h5>
              <p>-</p>
            </div>
            <div className={`${styles.flex} ${styles.member_context_group}`}>
              <h5>Plan renews:</h5>
              <p>-</p>
            </div>
            <div className={`${styles.flex} ${styles.member_context_group}`}>
              <h5>Payment:</h5>
              <p>-</p>
            </div>
          </div>
          <div className={`${styles.section_footer_group} ${styles.flex}`}>
            <div className={`${styles.email_verified_group} ${styles.flex}`}>
              <CheckCircleIcon fontSize="small" color="disabled" />
              <p>Auto renew: Off</p>
            </div>
            <button type="button" className={`${styles.change_password_btn}`}>
              Auto Renew
            </button>
          </div> */}
        </form>
        <form
          className={`${styles.section_box} ${styles.payment_info_box} ${styles.flexCol}`}
        >
          <div className={`${styles.section_header_box} ${styles.flex}`}>
            <h3>Payment Methods</h3>
            {/* <button className={`${styles.update_btn}`}>Add Payment</button> */}
            <div>
              <ButtonPrimary name="Add Payment" type="button" />
            </div>
          </div>
          <p className="text-sm font-light">Coming soon ... </p>
          {/* <div className={`${styles.payment_context_box} ${styles.flexCol}`}>
            <div className={`${styles.flex} ${styles.payment_context_group}`}>
              <h5>Default card:</h5>
              <p></p>
            </div>
            <div className={`${styles.payment_option_box} ${styles.flexCol}`}>
              <div className={`${styles.flex} ${styles.payment_context_group}`}>
                <h5>Card:</h5>
                <p>Visa 1234</p>
              </div>
              <div className={`${styles.flex} ${styles.payment_context_group}`}>
                <h5>Cardholder name:</h5>
                <p>Garwing Lai</p>
              </div>
              <div className={`${styles.flex} ${styles.payment_context_group}`}>
                <h5>Exp:</h5>
                <p>Jun 2028</p>
              </div>
              <div className={`${styles.flex} ${styles.payment_context_group}`}>
                <h5>Payment type:</h5>
                <p>Apple Pay</p>
              </div>
            </div>
          </div> */}
        </form>
      </div>
      {/* <SaveCancelButtons /> */}
    </div>
  );
}

export default AccountSettings;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user } = userSession;
    const { name, email, id } = user;
    let serializedAccount;

    try {
      const userAccount = await prisma.account.findUnique({
        where: {
          email,
        },
        include: {
          savedPaymentMethods: true,
        },
      });

      if (!userAccount) {
        return {
          redirect: {
            destination:
              process.env.NODE_ENV && process.env.NODE_ENV === "production"
                ? "/app/auth/signin"
                : "http://localhost:3000/app/auth/signin",
            permanent: false,
          },
        };
      }

      serializedAccount = JSON.parse(JSON.stringify(userAccount));
    } catch (error) {
      console.log("serversideprops checklist error:", error);
      serializedAccount = null;
    }

    return {
      props: {
        userSession,
        userAccount: serializedAccount,
      },
    };
  });
}

AccountSettings.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <AppLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </AppLayout>
  );
};

AccountSettings.pageTitle = "Account Settings";
AccountSettings.pageIcon = <SettingsIcon />;
AccountSettings.pageRoute = "account-settings";
AccountSettings.mobilePageRoute = "account-settings";
