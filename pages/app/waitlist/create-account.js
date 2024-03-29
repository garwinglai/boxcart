import React, { useState, useEffect } from "react";
import styles from "../../../styles/home/waitlist/create-account.module.css";
import { useRouter } from "next/router";
import Router from "next/router";
import Image from "next/image";
import ButtonLoader from "@/components/global/loaders/ButtonLoader";
import PageLoader from "@/components/global/loaders/PageLoader";
import firstCharCapitlize from "@/utils/string-manipulate";
import { createEarlyBirdCode, createPersonalCode } from "@/utils/codes";
import {
  sendWaitlistConfirmedEmail,
  sendEmailReferUsed,
} from "@/helper/client/api/sendgrid/email";
import {
  checkEmailAvailableAccount,
  checkEmailAvailableWaitlist,
} from "@/helper/client/api/account/email";
import {
  checkReferralCode,
  logReferUsed,
} from "@/helper/client/api/promos/promo-codes";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

function CreateAccount() {
  // * State variables
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [storedSubdomainSession, setStoredSubdomainSession] =
    useState("{your-shop-name}");
  const [isEmailInUse, setIsEmailInUse] = useState(false);
  const [formValues, setFormValues] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    codeUsed: "",
  });
  const [errorResponse, setErrorResponse] = useState({
    hasError: false,
    errorMessage: "",
  });

  // * Dob state variables
  const { fName, lName, email, codeUsed } = formValues;
  const { hasError, errorMessage } = errorResponse;

  // * Hooks setup
  const router = useRouter();

  useEffect(() => {
    // * Check session for subdomain storage
    if (typeof window !== "undefined") {
      const storedSessionDomain = sessionStorage.getItem("subdomain");
      const isShopConfirmed = sessionStorage.getItem("isShopConfirmed");

      if (!storedSessionDomain) {
        Router.push("/waitlist/reserve-shop");
      } else {
        if (isShopConfirmed) {
          sessionStorage.clear();
          Router.push("/waitlist/reserve-shop");
        }
        setStoredSubdomainSession(storedSessionDomain);
        setIsPageLoading(false);
      }
    }
  }, []);

  // * Handlers
  function handleBack() {
    router.back();
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreateAccount(e) {
    e.preventDefault();
    setIsButtonLoading(true);

    const fNameUpperFirst = firstCharCapitlize(fName);
    const lNameUpperFirst = firstCharCapitlize(lName);
    const name = fNameUpperFirst + " " + lNameUpperFirst;
    const subdomain = storedSubdomainSession;
    const fullDomain = subdomain + ".boxcart.shop";

    const emailInUseWaitlist = await checkEmailAvailableWaitlist(email);
    const emailInUseAccount = await checkEmailAvailableAccount(email);

    if (emailInUseWaitlist.error || emailInUseAccount.error) {
      setErrorResponse({
        hasError: true,
        errorMessage: "Unknown error: contact us. hello@boxcart.shop",
      });
      setIsButtonLoading(false);
    } else {
      setErrorResponse({
        hasError: false,
        errorMessage: "",
      });
    }
    // Return "Email in use." error if email is used.
    if (emailInUseWaitlist.value || emailInUseAccount.value) {
      setIsButtonLoading(false);
      return setIsEmailInUse(true);
    }

    // If email not in use, create user in waitlist db.
    // Create earlyBird code to access benefits upon register.
    const accessCode = await createEarlyBirdCode(lName);
    // const referralCode = createPersonalCode(fName, lName, waitlistCount);

    const finalValues = {
      name,
      fName: fNameUpperFirst,
      lName: lNameUpperFirst,
      email: email.toLocaleLowerCase(),
      subdomain,
      fullDomain,
      accessCode,
    };

    const createWaitlistResponse = await createNewWaitlistUser(
      subdomain,
      finalValues
    );
    const { success, error2 } = createWaitlistResponse;
    if (error2) {
      setErrorResponse({
        hasError: true,
        errorMessage: "Unknown error: contact us.",
      });
      setIsButtonLoading(false);
    } else {
      sendWaitlistConfirmedEmail(finalValues);

      // Create session key of confirmed to prevent user from accessing page when nav -> back();
      sessionStorage.setItem("isShopConfirmed", true);
      router.push("/waitlist/reserve-confirmed");
    }
  }

  // * API
  async function createNewWaitlistUser(subdomain, finalValues) {
    const postURL = `/api/public/waitlist/${subdomain}`;
    const waitlistResponse = await fetch(postURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalValues),
    });
    const waitlistResopnseJSON = await waitlistResponse.json();
    const { success, error } = waitlistResopnseJSON;
    return { success, error2: error };
  }

  // * Return page loader
  if (isPageLoading)
    return (
      <div className={`${styles.outmost_container}`}>
        <div className={`${styles.container} ${styles.flex} ${styles.flexCol}`}>
          <div className={`${styles.page_loader}`}>
            <PageLoader />
            <h1>BoxCart</h1>
          </div>
        </div>
      </div>
    );

  // * Return page content
  return (
    <div className={`${styles.outmost_container} ${styles.flex}`}>
      <div className={`${styles.container} ${styles.flex} ${styles.flexCol}`}>
        <div
          className={`${styles.create_account} ${styles.flex} ${styles.flexCol}`}
        >
          <div className={`${styles.header_form_group}`}>
            <h3>BoxCart</h3>
            <button onClick={handleBack} className={`${styles.back_button}`}>
              <KeyboardBackspaceIcon />
            </button>
          </div>
          <div className={`${styles.header}`}>
            <p className="text-sm font-light">Storefront domain:</p>
            <p className="text-[color:var(--primary)] font-medium">
              <b>{storedSubdomainSession}</b>
            </p>
            {/* <p style={{ color: "var(--gray)", marginTop: "1rem" }}>
							{`{Referral code = 1, if you do not have one}`}
						</p> */}
          </div>
          <form
            onSubmit={handleCreateAccount}
            className={`${styles.form_group} ${styles.flex} ${styles.flexCol}`}
          >
            <h2>Lock it in!</h2>
            <div className={`${styles.flex} ${styles.form_group_name}`}>
              <div className={`${styles.input_group}`}>
                <input
                  required
                  id="firstName"
                  name="fName"
                  value={fName}
                  type="text"
                  onChange={handleInput}
                />
                <label htmlFor="firstName">First name:</label>
              </div>
              <div className={`${styles.input_group}`}>
                <input
                  required
                  id="lastName"
                  name="lName"
                  value={lName}
                  type="text"
                  onChange={handleInput}
                />
                <label htmlFor="lastName">Last name:</label>
              </div>
            </div>
            <div className={`${styles.input_group}`}>
              <input
                required
                id="email"
                name="email"
                value={email}
                type="email"
                onChange={handleInput}
              />
              <label htmlFor="email">Email:</label>
            </div>
            {/* <div className={`${styles.input_group}`}>
							<input
								required
								id="codeUsed"
								name="codeUsed"
								value={codeUsed}
								type="codeUsed"
								onChange={handleInput}
							/>
							<label htmlFor="email">Refferal code:</label>
						</div> */}
            {isButtonLoading ? (
              <div className={`${styles.button_container}`}>
                <ButtonLoader />
              </div>
            ) : (
              <div className={`${styles.button_container}`}>
                <button type="submit">Lock in</button>
              </div>
            )}
          </form>
        </div>
        <p>{hasError ? errorMessage : isEmailInUse ? "Email in use." : ""}</p>
      </div>
    </div>
  );
}

export default CreateAccount;
