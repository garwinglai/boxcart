import React, { useState, useRef, useEffect } from "react";
import LinearProgressWithLabel from "@/components/global/loaders/LinearProgressWithLabel";
import styles from "../../../styles/app/auth/signup.module.css";
import NextBackButtons from "@/components/auth/signup/NextBackButtons";
import BusinessTypeCheckbox from "@/components/auth/signup/BusinessTypeCheckbox";
import instagram_icon from "../../../public/images/icons/socials/instagram_icon.png";
import facebook_icon from "../../../public/images/icons/socials/facebook_icon.png";
import tiktok_icon from "../../../public/images/icons/socials/tiktok_icon.png";
import youtube_icon from "../../../public/images/icons/socials/youtube_icon.png";
import { Avatar } from "@mui/material";
import Image from "next/image";
import FulfillmentRadioGroup from "@/components/auth/signup/SignupFormRadioGroup";
import pickup_pin_point_icon from "../../../public/images/icons/fulfillment/pickup_pin_point_icon.png";
import skooter_icon from "../../../public/images/icons/fulfillment/skooter_icon.png";
import package_icon from "../../../public/images/icons/fulfillment/package_icon.png";
import delivery_icon from "../../../public/images/icons/fulfillment/delivery_truck_icon.png";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { businessTypesArr } from "@/helper/temp/tempData";
import SignupFormAddress from "@/components/auth/signup/SignupFormAddress";
import SignupFormDistance from "@/components/auth/signup/SignupFormDistance";
import CredentialsForm from "@/components/auth/CredentialsForm";
import { checkSubdomainTakenAccount } from "@/helper/client/api/account/subdomain";
import { newUserSignup } from "@/helper/client/api/auth/registration";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { sendBusinessVerificationEmail } from "@/helper/client/api/sendgrid/email";
import Link from "next/link";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAccountStore, useConnectAccountStore } from "@/lib/store";
import { storage, createGeoHash } from "@/firebase/fireConfig";
import Geocode from "react-geocode";
import { checkAccessCode } from "@/helper/client/api/codes/index";
import { checkAccessCodeUsed } from "@/helper/client/api/account/early-bird-code";
import logo from "@/public/images/logos/boxcart_logo_full.png";
import { checkIfUserEmailInUse } from "@/helper/client/api/user";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import CloseIcon from "@mui/icons-material/Close";

// steps:
// 0: accessCode
// 1: business name
// 2: subdomain
// 3: business type
// 4: logo image
// 5: business bio
// 6: socials
// 7: fulfillment type - 0: delivery, 1: pickup, 2: both
// 8: a. if (delivery) = delivery type - 0: outsource, 1: in house    		b. if (pickup) = custom note		c. if(both) = same as a
// 9: a. if (outsource) = address, 			if(in house) = distance     			b. if(custom note) = address		c.1 if(outsource) = custom note  						c.2 if(in-house) = distance
// 10: a.1 if (address) = enable tips   a.2 if(distance) = address    		b. (follow rest of a.1.)				c. if(custom note) = follow reset of b			c.2 if(distance) = custom note, follow rest of c.1
// 11: a.1 if(enable tips) = set tips else (creds)  a.2 if (address) = enable tips
// 12: a.1 if (set tips) =  creds		a.2 if (enable tips) = set tips else (creds)
// 13:																	a.2 if (set tips) = creds

Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_GEO_API_KEY);
Geocode.setLanguage("en");

function Signup() {
  const setAccount = useAccountStore((state) => state.setAccount);
  const connectAccount = useConnectAccountStore(
    (state) => state.connectAccount
  );
  const removeConnectAccount = useConnectAccountStore(
    (state) => state.removeConnectAccount
  );

  const [hasShopperAccount, setHasShopperAccount] = useState(
    connectAccount.id ? true : false
  );
  const [waitlistId, setWaitlistId] = useState("");
  const [waitListEmail, setWaitListEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(11);
  const [isLastStep, setIsLastStep] = useState(false);
  const [canSkip, setCanSkip] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openError, setOpenError] = useState(false);
  const [displayLogo, setDisplayLogo] = useState("");
  const [logoFile, setLogoFile] = useState("");
  const [signupValues, setSignupValues] = useState({
    firstName: connectAccount ? connectAccount.firstName : "",
    lastName: connectAccount ? connectAccount.lastName : "",
    email: connectAccount ? connectAccount.email : "",
    password: "",
    accessCode: "",
    businessName: "",
    subdomain: "",
    businessTypes: [],
    otherBusinessTypes: [],
    otherBusinessType: "",
    logoImageFileName: "",
    businessBio: "",
    socialLinks: {
      facebookUrl: "",
      instagramUrl: "",
      tiktokUrl: "",
      youtubeUrl: "",
    },
    fulfillmentMethodInt: null,
    fulfillmentMethods: [],
    deliveryTypeInt: null,
    deliveryTypeStr: "",
    localDeliveryDistanceStr: "",
    localDeliveryDistanceMi: null,
    localDeliveryDistanceKm: null,
    pickupNote: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    zip: "",
    fullAddress: "",
    enableTips: false,
    typeOfTip: "percentage",
    tipValues: {
      tip1: {
        tipStr: "",
        tipInt: "",
      },
      tip2: {
        tipStr: "",
        tipInt: "",
      },
      tip3: {
        tipStr: "",
        tipInt: "",
      },
    },
    // email: "",
    // password: "",
  });

  const {
    firstName,
    lastName,
    email,
    password,
    accessCode,
    businessName,
    subdomain,
    businessTypes,
    otherBusinessTypes,
    otherBusinessType,
    logoImageFileName,
    businessBio,
    socialLinks,
    fulfillmentMethodInt,
    fulfillmentMethods,
    deliveryTypeInt,
    deliveryTypeStr,
    localDeliveryDistanceStr,
    localDeliveryDistanceMi,
    localDeliveryDistanceKm,
    pickupNote,
    address_1,
    address_2,
    city,
    state,
    zip,
    fullAddress,
    enableTips,
    typeOfTip,
    tipValues,
  } = signupValues;

  const { facebookUrl, instagramUrl, tiktokUrl, youtubeUrl } = socialLinks;
  const { tip1, tip2, tip3 } = tipValues;

  const subdomainInputRef = useRef(null);
  const { push } = useRouter();

  useEffect(() => {
    setIsLoading(false);
    setIsLastStep(false);
    isStepSkipped(step);

    //* Next, Skip, Back buttons.
    function isStepSkipped(step) {
      let skipSteps = [0, 4, 5, 6];

      // Upload logo step
      if (step == 4) {
        if (logoImageFileName !== "") {
          setCanSkip(false);
        } else {
          setCanSkip(true);
        }
        return;
      }

      // Bio step
      if (step == 5) {
        if (businessBio !== "") {
          setCanSkip(false);
        } else {
          setCanSkip(true);
        }
        return;
      }

      // Socials step
      if (step == 6) {
        let hasLinks = false;
        for (const [key, value] of Object.entries(socialLinks)) {
          if (value !== "") {
            hasLinks = true;
            continue;
          }
        }

        if (hasLinks) {
          setCanSkip(false);
        } else {
          setCanSkip(true);
        }
        return;
      }

      // pickup note
      if (
        (step == 8 && fulfillmentMethodInt == 1) ||
        (step == 9 && fulfillmentMethodInt == 2 && deliveryTypeInt == 0) ||
        (step == 11 && fulfillmentMethodInt == 2 && deliveryTypeInt == 1)
      ) {
        if (pickupNote !== "") {
          setCanSkip(false);
        } else {
          setCanSkip(true);
        }
        return;
      }

      // Fulfillment - 0: delivery, 1: pickup, 2: both.
      if (fulfillmentMethodInt == 1) {
        skipSteps.push(8);
      }

      if (fulfillmentMethodInt == 2) {
        // DeliveryInt - 0: outsource, 1: in-house

        if (deliveryTypeInt == 0) {
          skipSteps.push(9);
        }

        if (deliveryTypeInt == 1) {
          skipSteps.push(11);
        }
      }

      if (skipSteps.includes(step)) {
        setCanSkip(true);
      } else {
        setCanSkip(false);
      }
    }

    // fulfillmentMethod: 0: delivery, 1: pickup, 2: both.
    // deliverymethod: 0. outsource, 1: in-house
    if (fulfillmentMethodInt == 0) {
      if (deliveryTypeInt == 0) {
        if (enableTips) {
          setMaxSteps(11);
          if (step == 12) {
            setIsLastStep(true);
          }
        } else {
          setMaxSteps(10);
          if (step == 10) {
            setIsLastStep(true);
          }
        }
      }
      if (deliveryTypeInt == 1) {
        if (enableTips) {
          setMaxSteps(12);
          if (step == 13) {
            setIsLastStep(true);
          }
        } else {
          setMaxSteps(11);
          if (step == 11) {
            setIsLastStep(true);
          }
        }
      }
    }

    if (fulfillmentMethodInt == 1) {
      if (enableTips) {
        setMaxSteps(11);
        if (step == 12) {
          setIsLastStep(true);
        }
      } else {
        setMaxSteps(10);
        if (step == 10) {
          setIsLastStep(true);
        }
      }
    }

    if (fulfillmentMethodInt == 2) {
      if (deliveryTypeInt == 0) {
        if (enableTips) {
          setMaxSteps(12);
          if (step == 13) {
            setIsLastStep(true);
          }
        } else {
          setMaxSteps(11);
          if (step == 11) {
            setIsLastStep(true);
          }
        }
      }

      if (deliveryTypeInt == 1) {
        if (enableTips) {
          setMaxSteps(13);
          if (step == 14) {
            setIsLastStep(true);
          }
        } else {
          setMaxSteps(12);
          if (step == 12) {
            setIsLastStep(true);
          }
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step,
    accessCode,
    logoImageFileName,
    businessBio,
    facebookUrl,
    instagramUrl,
    youtubeUrl,
    tiktokUrl,
    pickupNote,
    fulfillmentMethodInt,
    deliveryTypeInt,
    enableTips,
  ]);

  function handleBackStep() {
    setStep((prev) => prev - 1);
  }

  async function handleNextStep(e) {
    const checkRes = checkIfInputIsEmpty();
    const { isEmpty, errorMsg } = checkRes;

    if (isEmpty) {
      setOpenError(true);
      setErrorMessage(errorMsg);
      setIsLoading(false);
      return;
    }

    //* If access code entered, check if it exists.
    if (step == 0) {
      if (accessCode !== "") {
        setIsLoading(true);

        const resVerifyCode = await checkAccessCode(accessCode);

        if (!resVerifyCode.success) {
          setOpenError(true);
          setErrorMessage(
            "Unknown error. Please contact hello@boxcart.shop with your access code."
          );
          setIsLoading(false);
          return;
        }

        // value == user

        if (!resVerifyCode.value) {
          setOpenError(true);
          setErrorMessage(
            "Access code not found. If you have a code, reach out to: hello@boxcart.shop"
          );
          setIsLoading(false);
          return;
        }

        const { value } = resVerifyCode;
        const { maxUse, useCount } = value;

        if (useCount >= maxUse) {
          setOpenError(true);
          setErrorMessage("Access code has already been used.");
          setIsLoading(false);
          return;
        }
      }
    }

    //* Test regex for subdomain.
    if (step == 2) {
      // Subdomain is valid && not taken.
      if (subdomain !== "") {
        const isValid = checkSubdomainValidEntry(subdomain);
        if (!isValid) return;

        setIsLoading(true);

        // * Currently only allowing all users with access code to join. Don't need to check if avail in waitlist b/c subdomain will be pulled from waitlist user.
        // const { success, value, error } = await checkSubdomainAvail(
        //   fullSubdomain
        // );

        const { success, value } = await checkSubdomainTakenAccount(subdomain);

        if (!success) {
          setOpenError(true);
          setErrorMessage(
            "Unknown error. Please contact hello@boxcart.shop with the subdomain of interest."
          );
          setIsLoading(false);
          return;
        }

        if (value) {
          setOpenError(true);
          setErrorMessage("This domain has already been claimed.");
          setIsLoading(false);
          return;
        }
      }
    }

    //* Test regex for social Urls.
    if (step == 6) {
      const isValid = checkSocialMediaUrlValidEntry();
      if (!isValid) return;
    }

    //* Advanced to next step.
    setStep((prev) => prev + 1);
  }

  //* Disable next button if input is null for required info.
  function checkIfInputIsEmpty() {
    // if (step == 0) {
    //   if (!accessCode)
    //     return { isEmpty: true, errorMsg: "Access code required to join." };
    // }

    if (step == 1) {
      if (businessName == "")
        return { isEmpty: true, errorMsg: "Missing business name." };
    }

    if (step == 2) {
      if (subdomain == "")
        return { isEmpty: true, errorMsg: "Missing domain name." };
    }

    if (step == 3) {
      if (businessTypes.length === 0 && otherBusinessTypes.length == 0)
        return { isEmpty: true, errorMsg: "Select a business type." };
    }

    if (step == 4) {
      if (logoImageFileName == "")
        return { isEmpty: false, errorMsg: "Upload logo or skip." };
    }

    if (step == 5) {
      if (businessBio == "") return { isEmpty: false };
    }

    if (step == 6) {
      let hasSocialLinks = false;
      for (const [key, value] of Object.entries(socialLinks)) {
        if (value !== "") {
          hasSocialLinks = true;
        }
      }
      if (!hasSocialLinks) return { isEmpty: false };
    }

    if (step == 7) {
      if (fulfillmentMethodInt == null)
        return { isEmpty: true, errorMsg: "Select your fulfillment." };
    }

    if (step == 8) {
      if (fulfillmentMethodInt == 0 || fulfillmentMethodInt == 2) {
        if (deliveryTypeInt == null)
          return { isEmpty: true, errorMsg: "Select your delivery method." };
      }

      if (fulfillmentMethodInt == 1) {
        if (pickupNote == "")
          return { isEmpty: false, errorMsg: "Missing business name." };
      }
    }

    if (step == 9) {
      if (fulfillmentMethodInt == 2 && deliveryTypeInt == 0) {
        if (pickupNote == "")
          return { isEmpty: false, errorMsg: "Missing business name." };
      }

      if (
        deliveryTypeInt == 1 ||
        (fulfillmentMethodInt == 2 && deliveryTypeInt == 1)
      ) {
        if (localDeliveryDistanceStr == "") {
          return { isEmpty: true, errorMsg: "Select your delivery range." };
        }
      }

      // if address.
      if (
        (fulfillmentMethodInt == 0 && deliveryTypeInt == 0) ||
        fulfillmentMethodInt == 1
      ) {
        if (address_1 === "" || city === "" || state === "" || zip === "") {
          return {
            isEmpty: true,
            errorMsg: "Complete your address information.",
          };
        }
      }
    }

    if (step == 10) {
      if (address_1 === "" || city === "" || state === "" || zip === "") {
        return {
          isEmpty: true,
          errorMsg: "Complete your address information.",
        };
      }
    }

    if (step == 11) {
      // Tip settings: % || $.
      if (
        ((fulfillmentMethodInt == 0 && deliveryTypeInt == 0) ||
          fulfillmentMethodInt == 1) &&
        enableTips
      ) {
        if (tip1.tipStr == "" || tip2.tipStr == "" || tip3.tipStr == "")
          return { isEmpty: true, errorMsg: "Set your tips." };
      }

      if (fulfillmentMethodInt == 2 && deliveryTypeInt == 1) {
        if (pickupNote == "")
          return { isEmpty: false, errorMsg: "Set your tips." };
      }
    }

    if (step == 12) {
      if (fulfillmentMethodInt == 0 && deliveryTypeInt == 1 && enableTips) {
        if (tip1.tipStr == "" || tip2.tipStr == "" || tip3.tipStr == "")
          return { isEmpty: true, errorMsg: "Set your tips." };
      }

      if (fulfillmentMethodInt == 2 && deliveryTypeInt == 0 && enableTips) {
        if (tip1.tipStr == "" || tip2.tipStr == "" || tip3.tipStr == "")
          return { isEmpty: true, errorMsg: "Set your tips." };
      }
    }

    if (step == 13) {
      if (fulfillmentMethodInt == 2 && deliveryTypeInt == 1 && enableTips) {
        if (tip1.tipStr == "" || tip2.tipStr == "" || tip3.tipStr == "")
          return { isEmpty: true, errorMsg: "Set your tips." };
      }
    }

    return false;
  }

  // * Form management

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    // Step 3 is for business checkbox
    if (step == 3) {
      if (type === "checkbox") {
        handleBusinessType(checked, name);
        return;
      }
    }

    // Business bio
    if (step == 5) {
      if (value.length > 150) {
        setErrorMessage("You have reached your character limit.");
        setOpenError(true);
        return;
      }
    }

    // Social links array
    if (step == 6) {
      handleSocialLinks(name, value);
      return;
    }

    // Fulfillment
    if (step == 7) {
      handleFulfillment(name);
      return;
    }
    // Delivery type
    if (step == 8) {
      if (fulfillmentMethodInt !== 1) {
        // Delivery
        handleDeliveryTypeChange(name);
        return;
      } else {
        // Pickup
        if (value.length > 150) {
          setErrorMessage("You have reached your character limit.");
          setOpenError(true);
          return;
        }
      }
    }

    // distance for in-house delivery.
    if (step == 9) {
      if (
        fulfillmentMethodInt !== 2 ||
        (fulfillmentMethodInt == 2 && deliveryTypeInt == 1)
      ) {
        handleDistance(name);
        return;
      }

      // pickup note
      if (fulfillmentMethodInt == 2 && deliveryTypeInt == 0) {
        if (value.length > 150) {
          setErrorMessage("You have reached your character limit.");
          setOpenError(true);
          return;
        }
      }
    }

    if (step == 11) {
      // Set tip values for outsource delivery.
      // if (
      //   (fulfillmentMethodInt == 0 && deliveryTypeInt == 0 && enableTips) ||
      //   (fulfillmentMethodInt == 1 && enableTips)
      // ) {
      //   setCorrectTipValues(name, value);
      //   return;
      // }

      // pickup note
      if (fulfillmentMethodInt == 2 && deliveryTypeInt == 1) {
        if (value.length > 150) {
          setErrorMessage("You have reached your character limit.");
          setOpenError(true);
          return;
        }
      }
    }

    if (step == 12) {
      // Set tip values for in-house delivery.
      // if (
      //   (fulfillmentMethodInt == 0 && deliveryTypeInt == 1 && enableTips) ||
      //   (fulfillmentMethodInt == 2 && enableTips)
      // ) {
      //   setCorrectTipValues(name, value);
      //   return;
      // }
    }

    if (step == 13) {
      // if (fulfillmentMethodInt == 2 && deliveryTypeInt == 1 && enableTips) {
      //   setCorrectTipValues(name, value);
      //   return;
      // }
    }

    // Set state values for step 0,1,2,3-(input for other business type)

    setSignupValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleAddressChange(e) {
    const { name, value } = e.target;
    setSignupValues((prev) => ({ ...prev, [name]: value }));
  }

  function isBusinessTypeChecked(name) {
    if (businessTypes.length !== 0) {
      const isChecked = businessTypes.includes(name);

      if (isChecked) {
        return true;
      }
      return false;
    }
    return false;
  }

  function isFulfillmentTypeChecked(name) {
    if (name === "delivery" || name === "pickup") {
      if (fulfillmentMethods.length > 1) {
        return false;
      }

      if (fulfillmentMethods.includes(name)) return true;
    }

    if (fulfillmentMethods.length > 1) return true;
    return false;
  }

  function isDeliveryTypeChecked(name) {
    if (name == "inHouse") {
      if (deliveryTypeInt == 1) return true;
    }

    if (name == "outsource") {
      if (deliveryTypeInt == 0) return true;
    }

    return false;
  }

  function isLocalDistanceChecked(name) {
    if (localDeliveryDistanceStr === name) return true;
    return false;
  }

  const handleRemoveLogoImage = () => {
    setDisplayLogo("");
    setSignupValues((prev) => ({ ...prev, logoImageFileName: "" }));
  };

  const handleImageUpload = async (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) return;
    const fileName = selectedImage.name;
    const imgUrl = URL.createObjectURL(selectedImage);

    setLogoFile(selectedImage);
    setDisplayLogo(imgUrl);
    setSignupValues((prev) => ({ ...prev, logoImageFileName: fileName }));
  };

  async function handleSignup(e) {
    e.preventDefault();
    setIsLoading(true);

    if (email == "" || firstName == "" || lastName == "" || password == "") {
      setOpenError(true);
      setErrorMessage("Missing information.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setOpenError(true);
      setErrorMessage("Password must be at least 8 characters long.");
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
      setOpenError(true);
      setErrorMessage(
        "Error checking if email is available. Please contact hello@boxcart.shop"
      );
      setIsLoading(false);
      return;
    }

    const { accounts: existingAccounts, shopperAccount } = isEmailInUse.user
      ? isEmailInUse.user
      : {};

    if (existingAccounts && existingAccounts.length > 0) {
      setOpenError(true);
      setErrorMessage(
        "Email already exists. Please use a different email or sign in."
      );
      setIsLoading(false);
      return;
    }

    const { url: logoImg, error: logoErr } = await storeLogoImageFirebase(
      logoFile,
      subdomain
    );

    if (logoErr) {
      console.log("Error saving logo image", error);
    }

    const newUserData = await structureUserData(logoImg);
    let accounts = [];
    let user;

    if (shopperAccount) {
      const { id } = isEmailInUse.user;

      const connectedAccount = await handleSubmitConnectAccounts(
        newUserData,
        email,
        password,
        id
      );

      if (!connectedAccount) {
        setHasShopperAccount(true);
        setIsLoading(false);
        return;
      }

      accounts = connectedAccount.user.accounts;
      user = connectedAccount.user;
    } else {
      setHasShopperAccount(false);
      const signupResponse = await newUserSignup(newUserData);

      const { success, user: createdUser, error } = signupResponse;
      if (!success || error || (success && !createdUser)) {
        setOpenError(true);
        setErrorMessage(
          "Failed to create account. Reach out to hello@boxcart.shop for more assistance."
        );
        return;
      }

      const signInResult = await userSignIn(email, password);

      if (!signInResult) {
        setIsLoading(false);
        return;
      }

      accounts = createdUser.accounts;
      user = createdUser;
    }

    const userId = user.id;
    const accountId = accounts[0].id;
    const accountOne = accounts[0];

    sendBusinessVerificationEmail(userId, accountId, email);
    setAccountStore(accountOne, logoImg);
    removeConnectAccount();

    const signedInRoute =
      process.env.NODE_ENV && process.env.NODE_ENV === "production"
        ? "https://boxcart.shop/app/account/checklist"
        : "http://localhost:3000/app/account/checklist";

    push(signedInRoute);
  }

  const handleSubmitConnectAccounts = async (
    newUserData,
    email,
    password,
    id
  ) => {
    const signInResult = await userSignIn(email, password);

    if (!signInResult) {
      return null;
    }

    const connectedBizAccount = await connectAccounts(newUserData, id);
    if (!connectedBizAccount.success || connectedBizAccount.error) {
      setOpenError(true);
      setErrorMessage("Error connecting account. Please try again.");
      return null;
    }

    return connectedBizAccount;
  };

  const connectAccounts = async (newUserData, id) => {
    const apiRoute = "/api/auth/connect-business-to-user";

    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUserData, id }),
    });
    return await response.json();
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

      return false;
    } catch (error) {
      setOpenError(true);
      setErrorMessage("Unknown error. Please contact hello@boxcart.shop.");
      return false;
    }
  };

  const setAccountStore = async (accountOne, logoImg) => {
    const {
      id: accountId,
      businessName,
      businessBio,
      city,
      firstName,
      lastName,
      subdomain,
      fullDomain,
      lat,
      lng,
      geohash,
    } = accountOne;

    const storedAccount = {
      accountId,
      logoImg,
      businessName,
      businessBio,
      city,
      firstName,
      lastName,
      subdomain,
      fullDomain,
      lat,
      lng,
      geohash,
    };

    setAccount(storedAccount);
  };

  const storeLogoImageFirebase = async (logoFile, subdomain) => {
    const logoRef = ref(
      storage,
      `account/${subdomain}/profile/logo/${logoFile.name}`
    );

    try {
      await uploadBytes(logoRef, logoFile);
    } catch (error) {
      return { error };
    }

    try {
      const url = await getDownloadURL(logoRef);
      return { url };
    } catch (error) {
      return { error };
    }
  };

  // * Helpers

  const getLatLngFromAddress = (address) => {
    return Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;

        return { lat, lng };
      },
      (error) => {
        console.error(error);
        // return { error };
      }
    );
  };

  const structureUserData = async (logoImg) => {
    const name = firstName + " " + lastName;
    let fullAddress = address_2
      ? address_1 + " " + address_2 + " " + city + " " + state + " " + zip
      : address_1 + " " + city + " " + state + " " + zip;
    let geohash = null;
    let lat = null;
    let lng = null;

    if (address_1 !== "" && city !== "" && state !== "" && zip !== "") {
      try {
        const { lat: latitude, lng: longitude } = await getLatLngFromAddress(
          fullAddress
        );
        lat = latitude;
        lng = longitude;
      } catch (error) {
        console.log("getAddylatlng", error);
      }
    }

    // create geoHash with lat lng
    if (lat !== "" && lng !== "") {
      try {
        const geoHash = await createGeoHash(lat, lng);
        geohash = geoHash;
      } catch (error) {
        console.log("geohash error", error);
        // todo: handle geohash error
      }
    }

    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const endToday = date.setHours(23, 59, 59, 999);
    const freePeriodDate = new Date(endToday);
    const freePeriodEndDateStr = freePeriodDate.toLocaleDateString();
    const freePeriodEndDateEpoch = Date.parse(freePeriodDate);
    const fullDomain = "boxcart.shop/" + subdomain;

    const userData = {
      firstName,
      lastName,
      name,
      email,
      password,
    };

    const accountData = {
      waitlistId,
      freePeriodEndDateStr,
      freePeriodEndDateEpoch,
      email,
      password,
      name,
      firstName,
      lat,
      lng,
      geohash,
      lastName,
      accessCode,
      businessName,
      subdomain,
      fullDomain,
      logoImageFileName,
      logoImage: logoImg,
      businessBio,
      fulfillmentMethodInt,
      address_1,
      address_2,
      city,
      state,
      zip,
      fullAddress,
      enableTips,
      typeOfTip,
    };

    const businessTypeData = [...businessTypes, ...otherBusinessTypes];

    const fulfillmentData = fulfillmentMethods.map((method) => {
      if (method === "delivery") {
        return {
          method,
          methodInt: 0,
          deliveryTypeInt,
          deliveryTypeStr,
          localDeliveryDistanceStr,
          localDeliveryDistanceMi,
          localDeliveryDistanceKm,
          pickupNote: null,
          deliveryFeeType: null,
          deliveryFeePriceStr: null,
          deliveryFeePriceIntPenny: null,
          deliveryFeeByDistanceStr: null,
          deliveryFeeByDistanceIntPenny: null,
          deliveryFeeDistanceMetric: "mi",
        };
      }
      if (method === "pickup") {
        return {
          method,
          methodInt: 1,
          deliveryTypeInt: null,
          deliveryTypeStr: null,
          localDeliveryDistanceStr: null,
          localDeliveryDistanceMi: null,
          localDeliveryDistanceKm: null,
          pickupNote,
          deliveryFeeType: null,
          deliveryFeePriceStr: null,
          deliveryFeePriceIntPenny: null,
          deliveryFeeByDistanceStr: null,
          deliveryFeeByDistanceIntPenny: null,
          deliveryFeeDistanceMetric: "mi",
        };
      }
    });
    // check social links object to see if any of the keys have values. If so, push data to a new array.
    const socialsData = [];
    for (const [key, value] of Object.entries(socialLinks)) {
      if (value !== "") {
        let platform;

        switch (key) {
          case "instagramUrl":
            platform = "instagram";
            break;
          case "facebookUrl":
            platform = "facebook";
            break;
          case "tiktokUrl":
            platform = "tiktok";
            break;
          case "youtubeUrl":
            platform = "youtube";
            break;
          default:
            break;
        }

        socialsData.push({ platform, socialLink: value });
      }
    }

    const newUserData = {
      userData,
      accountData,
      businessTypeData,
      socialsData,
      fulfillmentData,
    };

    return newUserData;
  };

  function checkEmailRegex(email) {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailMatchRegex = emailRegex.test(email);
    if (!emailMatchRegex) {
      setErrorMessage("Please enter a valid email address.");
      setOpenError(true);
      return false;
    }
    return true;
  }

  function checkSubdomainValidEntry(subdomain) {
    const subdomainRegex = /^[A-Za-z0-9]+([-][A-Za-z0-9]+)*$/;
    const subdomainMatchRegex = subdomainRegex.test(subdomain);
    if (!subdomainMatchRegex) {
      setErrorMessage("Please enter a proper subdomain.");
      setOpenError(true);
      return false;
    }
    return true;
  }

  function checkSocialMediaUrlValidEntry() {
    // Create the regex for each without the https.
    const instagramRegexNoHttp = /^www\.instagram\.com\/.+/;
    const instagramRegexWithHttp = /^(https?:\/\/)?(www\.)?instagram\.com\/.+/;

    const facebookRegexNoHttp = /^www\.facebook\.com\/.+/;
    const facebookRegexWithHttp = /^(https?:\/\/)?(www\.)?facebook\.com\/.+/;

    const tiktokRegexNoHttp = /^www\.tiktok\.com\/.+/;
    const tiktokRegexWithHttp = /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/;

    const youtubeRegexNoHttp = /^www\.youtube\.com\/.+/;
    const youtubeRegexWithHttp = /^(https?:\/\/)?(www\.)?youtube\.com\/.+/;

    let allSocialUrlsMatchedRegex = [];
    if (instagramUrl !== "") {
      const matched = checkSocialMediaRegex(
        instagramRegexWithHttp,
        instagramUrl
      );
      allSocialUrlsMatchedRegex.push(matched);
    }

    if (facebookUrl !== "") {
      const matched = checkSocialMediaRegex(facebookRegexWithHttp, facebookUrl);
      allSocialUrlsMatchedRegex.push(matched);
    }

    if (tiktokUrl !== "") {
      const matched = checkSocialMediaRegex(tiktokRegexWithHttp, tiktokUrl);
      allSocialUrlsMatchedRegex.push(matched);
    }

    if (youtubeUrl !== "") {
      const matched = checkSocialMediaRegex(youtubeRegexWithHttp, youtubeUrl);
      allSocialUrlsMatchedRegex.push(matched);
    }

    for (let i = 0; i < allSocialUrlsMatchedRegex.length; i++) {
      const currMatch = allSocialUrlsMatchedRegex[i];
      if (!currMatch) return false;
    }

    return true;
  }

  function checkSocialMediaRegex(socialMediaRegex, url) {
    const socialMediaMatchRegex = socialMediaRegex.test(url);
    if (!socialMediaMatchRegex) {
      setErrorMessage(
        `Please enter a valid url or leave empty: https://www.{host}.com/{your-handle}`
      );
      setOpenError(true);
      return false;
    }
    return true;
  }

  function handleInputFocus() {
    subdomainInputRef.current.focus();
  }

  // function handleInvalidSubDomain(e) {
  // 	e.target.setCustomValidity("Subdomain name must be one word only.");
  // }

  function handleCloseSnackbar() {
    setOpenError(false);
    setErrorMessage("");
  }

  function handleBusinessType(checked, name) {
    if (checked) {
      setSignupValues((prev) => ({
        ...prev,
        businessTypes: [...prev.businessTypes, name],
      }));
    } else {
      const removedBusinessType = businessTypes.filter((type) => type !== name);
      setSignupValues((prev) => ({
        ...prev,
        businessTypes: removedBusinessType,
      }));
    }
  }

  function handleSocialLinks(name, value) {
    setSignupValues((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  }

  function handleFulfillment(name) {
    let value = [name];

    if (name === "delivery") {
      setSignupValues((prev) => ({ ...prev, fulfillmentMethodInt: 0 }));
    }

    if (name === "pickup") {
      setSignupValues((prev) => ({ ...prev, fulfillmentMethodInt: 1 }));
    }

    if (name === "both") {
      value = ["delivery", "pickup"];
      setSignupValues((prev) => ({ ...prev, fulfillmentMethodInt: 2 }));
    }

    setSignupValues((prev) => ({
      ...prev,
      fulfillmentMethods: [...value],
    }));
  }

  function handleDeliveryTypeChange(deliveryType) {
    if (deliveryType == "outsource") {
      setSignupValues((prev) => ({
        ...prev,
        deliveryTypeInt: 0,
        deliveryTypeStr: deliveryType,
      }));
    }

    if (deliveryType == "inHouse") {
      setSignupValues((prev) => ({
        ...prev,
        deliveryTypeInt: 1,
        deliveryTypeStr: "in house",
      }));
    }
  }

  function handleDistance(name) {
    let miles;
    let kilometers;

    switch (name) {
      case "5mi/8km":
        miles = 5;
        kilometers = 8;
        break;
      case "10mi/16km":
        miles = 10;
        kilometers = 16;
        break;
      case "30mi/48km":
        miles = 30;
        kilometers = 48;
        break;
      case "50mi/80km":
        miles = 50;
        kilometers = 80;
        break;

      default:
        break;
    }

    setSignupValues((prev) => ({
      ...prev,
      localDeliveryDistanceStr: name,
      localDeliveryDistanceMi: miles,
      localDeliveryDistanceKm: kilometers,
    }));
  }

  return (
    <div className={`${styles.signup} min-h-screen`}>
      <Snackbar open={openError} onClose={handleCloseSnackbar}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <div className="lg:px-52">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => push("https://www.home.boxcart.shop")}>
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
              href="/app/auth/signin"
              className="text-sm underlin text-blue-500"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="-mt-4">
          <LinearProgressWithLabel value={(step / maxSteps) * 100} />
        </div>
      </div>
      <div className={`${step !== 3 ? `md:mt-4 md:px-32 xl:px-80` : ``} `}>
        <form onSubmit={handleSignup} className={`${styles.form_box}`}>
          {/* Access code */}
          {step == 0 && (
            <div
              className={`${styles.access_code_group} ${styles.form_section_group}`}
            >
              <label
                htmlFor="access_input"
                className="font-medium mb-2 text-xl text-black"
              >
                Invite code:
              </label>
              <input
                id="accessCode"
                name="accessCode"
                value={accessCode}
                type="text"
                placeholder="Enter"
                className={`${styles.signup_input}`}
                onChange={handleChange}
              />
              <p className="text-sm font-light text-black mt-4">
                If you have an invite code, please enter it here before
                proceeding.
              </p>
            </div>
          )}

          {/* Business name */}
          {step == 1 && (
            <div
              className={`${styles.biz_name_group} ${styles.form_section_group}`}
            >
              <label
                htmlFor="biz_name_input"
                className="text-black font-medium"
              >
                What&apos;s your business name? *
              </label>
              <input
                // autoFocus
                onKeyDown={(e) => {
                  const keyDown = e.key;
                  if (keyDown === "Enter") {
                    e.preventDefault();
                    handleNextStep();
                  }
                }}
                id="biz_name_input"
                required
                name="businessName"
                value={businessName}
                type="text"
                placeholder="Enter"
                className={`${styles.signup_input}`}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Subdomain */}
          {step == 2 && (
            <div
              className={`${styles.domain_group} ${styles.form_section_group}`}
            >
              <label
                htmlFor="subdomain"
                className="font-medium text-black mb-4"
              >
                Enter your business domain. *
              </label>
              <div className="flex items-center gap-2">
                <div onClick={handleInputFocus}>
                  <p>boxcart.shop/</p>
                </div>
                <div className={`${styles.input_pair} flex-grow`}>
                  <input
                    // autoFocus
                    onKeyDown={(e) => {
                      const keyDown = e.key;
                      if (keyDown === "Enter") {
                        e.preventDefault();
                        handleNextStep();
                      }
                    }}
                    className={`${styles.input_editable} w-full flex-grow`}
                    type="text"
                    id="subdomain"
                    name="subdomain"
                    value={subdomain}
                    ref={subdomainInputRef}
                    minLength="1"
                    maxLength="63"
                    // onInvalid={handleInvalidSubDomain}
                    placeholder="{shop-name}"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Business type */}
          {step == 3 && (
            <div
              className={`${styles.form_section_group} ${styles.business_type}`}
            >
              <label
                htmlFor="select business type"
                className="text-black font-medium"
              >
                What&apos;s your business category? Select all that apply.
              </label>

              <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {businessTypesArr.map((type) => {
                  const { id, name, label, imgSrc, imgAlt } = type;
                  return (
                    <BusinessTypeCheckbox
                      key={id}
                      id={id}
                      name={name}
                      onChange={handleChange}
                      checked={isBusinessTypeChecked}
                      label={label}
                      imgSrc={imgSrc}
                      imgAlt={imgAlt}
                      // autoFocus
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-8 mt-4">
                <div className={`${styles.business_type_other}`}>
                  <input
                    id="other"
                    type="text"
                    placeholder="Other:"
                    name="otherBusinessType"
                    value={otherBusinessType}
                    onChange={handleChange}
                    className="text-sm placeholder:text-sm py-1 font-light text-black "
                  />
                </div>
                <div className="">
                  <ButtonThird
                    type="button"
                    name="Add"
                    handleClick={() => {
                      if (otherBusinessType === "") {
                        setOpenError(true);
                        setErrorMessage("No business type was added in Other.");
                        return;
                      }

                      setSignupValues((prev) => ({
                        ...prev,
                        otherBusinessType: "",
                        otherBusinessTypes: [
                          ...prev.otherBusinessTypes,
                          otherBusinessType,
                        ],
                      }));
                    }}
                  />
                </div>
              </div>
              {otherBusinessTypes.length > 0 && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {otherBusinessTypes.map((type, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full text-sm"
                      >
                        <p>{type}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setSignupValues((prev) => ({
                              ...prev,
                              otherBusinessTypes:
                                prev.otherBusinessTypes.filter(
                                  (item, i) => i !== index
                                ),
                            }));
                          }}
                        >
                          <CloseIcon
                            className="text-gray-500"
                            fontSize="small"
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Logo */}
          {step == 4 && (
            <div className={`${styles.form_section_group}`}>
              <h4 className="">Upload your logo.</h4>

              {logoImageFileName === "" ? (
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  variant="rounded"
                  className={`${styles.logo_placeholder_image}`}
                >
                  Logo
                </Avatar>
              ) : (
                <Image
                  src={displayLogo}
                  alt="uploaded business logo"
                  width={50}
                  height={50}
                  className="w-28 h-28 object-cover mx-auto rounded-full mt-4 border"
                />
              )}
              <label
                htmlFor="logo_file"
                className={`${styles.upload_logo_button}`}
              >
                Upload file:
              </label>
              <input
                id="logo_file"
                type="file"
                accept="image/"
                value=""
                className={`${styles.upload_logo_input}`}
                onChange={handleImageUpload}
                // onClick={handleImageUpload}
              />
              {displayLogo !== "" && (
                <button
                  type="button"
                  className="underline mt-4 text-sm w-fit mx-auto"
                  onClick={handleRemoveLogoImage}
                >
                  remove
                </button>
              )}
            </div>
          )}

          {/* Business bio */}
          {step == 5 && (
            <div className={`${styles.form_section_group} ${styles.bio_group}`}>
              <label
                htmlFor="business-bio"
                className="text-black font-medium mb-4"
              >
                Enter a short bio about your business.
              </label>
              <textarea
                // autoFocus
                type="text"
                id="business-bio"
                name="businessBio"
                value={businessBio}
                placeholder="Enter..."
                rows="10"
                onChange={handleChange}
              />
              <p className="font-extralight text-sm">
                {businessBio.length} / 150
              </p>
              <p></p>
            </div>
          )}

          {/* Socials */}
          {step == 6 && (
            <div className={`${styles.form_section_group}`}>
              <h4 className="font-medium text-black mb-4">
                Link your socials.
              </h4>

              <div className={`${styles.socials_group}`}>
                <Image
                  src={instagram_icon}
                  alt="instagram logo"
                  className="w-12 h-12"
                />
                <input
                  type="text"
                  name="instagramUrl"
                  value={instagramUrl}
                  onChange={handleChange}
                  className={`${styles.signup_input}`}
                  placeholder="url:"
                />
              </div>
              <div className={`${styles.socials_group}`}>
                <Image
                  src={facebook_icon}
                  alt="facebook logo"
                  className="w-12 h-12"
                />
                <input
                  type="text"
                  name="facebookUrl"
                  value={facebookUrl}
                  onChange={handleChange}
                  className={`${styles.signup_input}`}
                  placeholder="url:"
                />
              </div>
              <div className={`${styles.socials_group}`}>
                <Image
                  src={tiktok_icon}
                  alt="tiktok logo"
                  className="w-12 h-12"
                />
                <input
                  type="text"
                  name="tiktokUrl"
                  value={tiktokUrl}
                  onChange={handleChange}
                  className={`${styles.signup_input}`}
                  placeholder="url:"
                />
              </div>
              <div className={`${styles.socials_group}`}>
                <Image
                  src={youtube_icon}
                  alt="youtube logo"
                  className="w-12 h-12"
                />
                <input
                  type="text"
                  name="youtubeUrl"
                  value={youtubeUrl}
                  onChange={handleChange}
                  className={`${styles.signup_input}`}
                  placeholder="url:"
                />
              </div>
              <p className="text-sm font-light">
                Edit &amp; add more in account later.
              </p>
            </div>
          )}

          {/* Fulfill orders */}
          {step == 7 && (
            <div
              className={`${styles.form_section_group} ${styles.fulfillment}`}
            >
              <h4 className="text-black mb-4 font-medium">
                How do you fulfill your orders?
              </h4>
              <FulfillmentRadioGroup
                id="delivery"
                name="delivery"
                label="Delivery"
                hasImage={true}
                imgSrc={delivery_icon}
                imgAlt="delivery icon"
                isChecked={isFulfillmentTypeChecked}
                onChange={handleChange}
              />
              <FulfillmentRadioGroup
                id="pickup"
                name="pickup"
                label="Pickup"
                hasImage={true}
                imgSrc={pickup_pin_point_icon}
                imgAlt="pickup icon"
                isChecked={isFulfillmentTypeChecked}
                onChange={handleChange}
              />
              <FulfillmentRadioGroup
                id="both"
                name="both"
                label="Both"
                hasImage={false}
                isChecked={isFulfillmentTypeChecked}
                onChange={handleChange}
              />
            </div>
          )}

          {step == 8 && fulfillmentMethodInt != 1 && (
            <div
              className={`${styles.form_section_group} ${styles.fulfillment}`}
            >
              <h4 className="font-medium text-black mb-4">
                How do you deliver?
              </h4>
              <FulfillmentRadioGroup
                id="outsource"
                name="outsource"
                label="Use a carrier"
                hasImage={true}
                imgSrc={package_icon}
                imgAlt="package icon"
                isChecked={isDeliveryTypeChecked}
                onChange={handleChange}
              />
              <FulfillmentRadioGroup
                id="in-house"
                name="inHouse"
                label="Ship it yourself"
                hasImage={true}
                imgSrc={skooter_icon}
                imgAlt="skooter icon"
                isChecked={isDeliveryTypeChecked}
                onChange={handleChange}
              />
            </div>
          )}

          {((step == 9 && fulfillmentMethodInt == 0 && deliveryTypeInt == 1) ||
            (step == 9 &&
              fulfillmentMethodInt == 2 &&
              deliveryTypeInt == 1)) && (
            <div
              className={`${styles.form_section_group} ${styles.fulfillment}`}
            >
              <SignupFormDistance
                handleChange={handleChange}
                isLocalDistanceChecked={isLocalDistanceChecked}
              />
            </div>
          )}

          {((step == 9 && fulfillmentMethodInt == 0 && deliveryTypeInt == 0) ||
            (step == 9 && fulfillmentMethodInt == 1) ||
            (step == 10 && fulfillmentMethodInt == 2) ||
            (step == 10 &&
              fulfillmentMethodInt == 0 &&
              deliveryTypeInt == 1)) && (
            <div className={`${styles.form_section_group}`}>
              <SignupFormAddress
                handleChange={handleAddressChange}
                signupValues={signupValues}
              />
            </div>
          )}

          {((step == 8 && fulfillmentMethodInt == 1) ||
            (step == 9 && fulfillmentMethodInt == 2 && deliveryTypeInt == 0) ||
            (step == 11 &&
              fulfillmentMethodInt == 2 &&
              deliveryTypeInt == 1)) && (
            <div
              className={`${styles.form_section_group} ${styles.pickup_note_group}`}
            >
              <label
                htmlFor="pickup_note"
                className="font-medium text-black mb-4"
              >
                Leave a note for pickup orders.
              </label>
              <textarea
                type="text"
                // autoFocus
                id="pickup_note"
                name="pickupNote"
                value={pickupNote}
                placeholder="e.g. Please give us a call/text 10 minutes before arrival. "
                rows="10"
                onChange={handleChange}
              />
              <p className="text-sm font-light">{pickupNote.length} / 150</p>
            </div>
          )}

          {/* {((step == 10 && fulfillmentMethodInt == 0 && deliveryTypeInt == 0) ||
            (step == 10 && fulfillmentMethodInt == 1) ||
            (step == 11 && fulfillmentMethodInt == 0 && deliveryTypeInt == 1) ||
            (step == 11 && fulfillmentMethodInt == 2 && deliveryTypeInt == 0) ||
            (step == 12 &&
              fulfillmentMethodInt == 2 &&
              deliveryTypeInt == 1)) && (
            <div className={`${styles.form_section_group}`}>
              <SignupFormEnableTips
                isChecked={isTipsChecked}
                onChange={handleEnableTipsChange}
              />
            </div>
          )}

          {((step == 11 &&
            fulfillmentMethodInt == 0 &&
            deliveryTypeInt == 0 &&
            enableTips) ||
            (step == 11 && fulfillmentMethodInt == 1 && enableTips) ||
            (step == 12 &&
              fulfillmentMethodInt == 0 &&
              deliveryTypeInt == 1 &&
              enableTips) ||
            (step == 12 &&
              fulfillmentMethodInt == 2 &&
              deliveryTypeInt == 0 &&
              enableTips) ||
            (step == 13 &&
              fulfillmentMethodInt == 2 &&
              deliveryTypeInt == 1 &&
              enableTips)) && (
            <div className={`${styles.form_section_group}`}>
              <SignupFormSetTip
                signupValues={signupValues}
                onChangeTipType={handleChangeSetTips}
                isChecked={isTipTypeChecked}
                onChangeTipValues={onChangeTipValues}
              />
            </div>
          )} */}

          {((step == 10 && fulfillmentMethodInt == 0 && deliveryTypeInt == 0) ||
            (step == 11 && fulfillmentMethodInt == 0 && deliveryTypeInt == 1) ||
            (step == 10 && fulfillmentMethodInt == 1) ||
            (step == 11 && fulfillmentMethodInt == 2 && deliveryTypeInt == 0) ||
            (step == 12 &&
              fulfillmentMethodInt == 2 &&
              deliveryTypeInt == 1)) && (
            <div className={`${styles.form_section_group}`}>
              <CredentialsForm
                signupValues={signupValues}
                handleChange={handleChange}
                hasShopperAccount={hasShopperAccount}
              />
            </div>
          )}

          <NextBackButtons
            step={step}
            nextStep={handleNextStep}
            backStep={handleBackStep}
            signup={handleSignup}
            canSkip={canSkip}
            isLastStep={isLastStep}
            isLoading={isLoading}
          />
        </form>
        {/* <div className="hidden md:block w-[50%] bg-white rounded-xl shadow-lg">
					<div className=" ">
						<ShopHeader isOwner={false} />
						<div className="">
							<div className="">
								<ShopBio isOwner={false} />
							</div>
							<div className="">
								<ShopFulfillment isOwner={false} />
							</div>
						</div>
					</div>
				</div> */}
      </div>
    </div>
  );
}

export default Signup;
