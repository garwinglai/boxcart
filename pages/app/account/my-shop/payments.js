import React, { useState, useEffect } from "react";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import AppLayout from "@/components/layouts/AppLayout";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import Link from "next/link";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { isAuth } from "@/helper/client/auth/isAuth";
import CurrencyInput from "react-currency-input-field";
import SaveCancelButtons from "@/components/app/design/SaveCancelButtons";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { updatePaymentClient } from "@/helper/client/api/payments/payment-crud";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import {
  updateIsChecklistComplete,
  updatePaymentChecklistClient,
} from "@/helper/client/api/checklist";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useChecklistStore } from "@/lib/store";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import venmo from "@/public/images/icons/venmo.png";
import paypal from "@/public/images/icons/paypal.png";
import zelle from "@/public/images/icons/zelle.png";
import cash from "@/public/images/icons/cash.png";
import credit_card from "@/public/images/icons/credit-card.png";
import Image from "next/image";

const styleMobile = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

function Payments({ userAccount }) {
  const checklistStore = useChecklistStore((state) => state.checklist);
  const setChecklistStore = useChecklistStore((state) => state.setChecklist);

  const placeholderCardMessage =
    "Please include your order ID in payment notes. Payment must be completed in 15 minutes.";
  const placeholderCashMessage =
    "Please provide cash upon receiving order in person.";
  const [account, setAccount] = useState(userAccount);

  const {
    deposit,
    requireDeposit,
    tax,
    acceptedPayments,
    id: accountId,
  } = account || {};

  const [stripeInitialState, setStripeInitialState] = useState(false);
  const [cashInitialState, setCashInitialState] = useState(false);
  const [venmoInitialState, setVenmoInitialState] = useState(false);
  const [zelleInitialState, setZelleInitialState] = useState(false);
  const [paypalInitialState, setPaypalInitialState] = useState(false);
  const [initialCashInstructions, setInitialCashInstructions] = useState("");
  const [initialZelleValues, setInitialZelleValues] = useState({
    initialZellPayInstructions: "",
    initialZelleAccount: "",
  });
  const [initialVenmoValues, setInitialVenmoValues] = useState({
    initialVenmoPayInstructions: "",
    initialVenmoAccount: "",
  });
  const [initialPaypalValues, setInitialPaypalValues] = useState({
    initialPaypalInstructions: "",
    initialPaypalAccount: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSaveCancelButtons, setShowSaveCancelButtons] = useState(false);
  const [isLoadingStripeConnect, setIsLoadingStripeConnect] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [hasDeposit, setHasDeposit] = useState(requireDeposit);
  const [depositFeeType, setDepositFeeType] = useState(
    hasDeposit
      ? deposit
        ? deposit.feeTypeStr !== ""
          ? deposit.feeTypeStr
          : "dollar"
        : "dollar"
      : ""
  );
  const [depositDollarFee, setDepositDollarFee] = useState(
    deposit
      ? deposit.feeTypeSymbol === "$"
        ? deposit.feeIntPenny / 100
        : ""
      : ""
  );
  const [depositPercentageFee, setDepositPercentageFee] = useState(
    deposit ? (deposit.feeTypeSymbol === "%" ? deposit.feeIntPercent : "") : ""
  );
  const [enableTaxes, setEnableTaxes] = useState(
    tax ? tax.isTaxRateEnabled : false
  );
  const [taxAmt, setTaxAmt] = useState(
    tax ? (tax.taxRate ? tax.taxRate : "") : ""
  );
  const [useStripe, setUseStripe] = useState(false);
  const [stripeValues, setStripeValues] = useState({
    stripeAccountId: "",
    details_submitted: false,
    charges_enabled: false,
  });
  const [useCash, setUseCash] = useState(false);
  const [cashPayInstructions, setCashPayInstructions] = useState(
    placeholderCashMessage
  );
  const [useZelle, setUseZelle] = useState(false);
  const [zelleValues, setZelleValues] = useState({
    zellePayInstructions: placeholderCardMessage,
    zelleAccount: "",
  });
  // const [useCashApp, setUseCashApp] = useState(false);
  // const [cashAppPayInstructions, setCashAppPayInstructions] = useState(
  //   "Please include your order ID in payment notes. Payment must be completed in 15 minutes."
  // );
  const [useVenmo, setUseVenmo] = useState(false);
  const [venmoValues, setVenmoValues] = useState({
    venmoPayInstructions: placeholderCardMessage,
    venmoAccount: "",
  });
  const [usePayPal, setUsePayPal] = useState(false);
  const [paypalValues, setPaypalValues] = useState({
    paypalInstructions: placeholderCardMessage,
    paypalAccount: "",
  });
  const [removedPayments, setRemovedPayments] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
  });

  const { snackbarOpen, snackbarMessage } = openSnackbar;
  const { stripeAccountId, details_submitted, charges_enabled } = stripeValues;
  const { zellePayInstructions, zelleAccount } = zelleValues;
  const { paypalInstructions, paypalAccount } = paypalValues;
  const { venmoPayInstructions, venmoAccount } = venmoValues;

  const { push } = useRouter();

  // * retrieves stripe account to check if details_submitted, charged_enabled.
  // * If all true, then stripe setup is complete, update schema & hide stripe setup button.
  // * If any is false false, then stripe setup is not complete, show stripe setup button.
  // * If stripeAccountId is null, then there is no stripe acc, show stripe setup button.
  useEffect(() => {
    if (details_submitted && charges_enabled) return;
    if (!stripeAccountId) return;

    const fetchStripeAccount = async () => {
      const retrieveStripeAccountAPI = `/api/private/stripe/retrieve-stripe-account/${stripeAccountId}`;
      const retrieveStripeAccountRes = await fetch(retrieveStripeAccountAPI, {
        method: "GET",
      });
      const retrieveStripeAccountJSON = await retrieveStripeAccountRes.json();
      const { success, account, error } = retrieveStripeAccountJSON;

      if (!success || error) {
        handleOpenSnackbar("Could not get credit account.");
        return;
      }

      const {
        details_submitted: stripe_details,
        charges_enabled: stripe_charges,
      } = account;

      // * first param is from db, second param is from stripe API
      // * db defaulted to false,
      // * when stripe param returns true, update db.
      if (
        (!details_submitted && stripe_details) ||
        (!charges_enabled && stripe_charges)
      ) {
        const paymentId = acceptedPayments.find(
          (payment) => payment.paymentMethod === "stripe"
        ).id;

        const updateStripeSetupCompleteAPI =
          "/api/private/payments/complete-stripe-setup";

        const updateStripeSetupCompleteRes = fetch(
          updateStripeSetupCompleteAPI,
          {
            method: "POST",
            body: JSON.stringify({
              paymentId,
              stripe_details,
              stripe_charges,
            }),
          }
        );

        setStripeValues((prev) => ({
          ...prev,
          details_submitted: stripe_details ? stripe_details : false,
          charges_enabled: stripe_charges ? stripe_charges : false,
        }));
      }
    };

    fetchStripeAccount();
  }, [stripeAccountId, details_submitted, charges_enabled]);

  // * Update payment UI based on acceptedPayments
  useEffect(() => {
    setInitialStates(acceptedPayments, tax, placeholderCardMessage);
  }, [acceptedPayments, tax]);

  const setInitialStates = (acceptedPayments, tax, placeholderCardMessage) => {
    setUseStripe(false);
    setUseCash(false);
    setUseVenmo(false);
    setUseZelle(false);
    setUsePayPal(false);
    setEnableTaxes(tax.isTaxRateEnabled);
    setTaxAmt(tax.taxRate);

    setStripeInitialState(false);
    setCashInitialState(false);
    setVenmoInitialState(false);
    setZelleInitialState(false);
    setPaypalInitialState(false);

    setCashPayInstructions(placeholderCashMessage);
    setZelleValues({
      zellePayInstructions: placeholderCardMessage,
      zelleAccount: "",
    });
    setVenmoValues({
      venmoPayInstructions: placeholderCardMessage,
      venmoAccount: "",
    });
    setPaypalValues({
      paypalInstructions: placeholderCardMessage,
      paypalAccount: "",
    });

    for (let i = 0; i < acceptedPayments.length; i++) {
      const payment = acceptedPayments[i];
      const {
        paymentMethod,
        paymentAccount,
        paymentInstructions,
        isEnabled,
        stripeAccountId,
        details_submitted,
        charged_enabled,
      } = payment;

      if (paymentMethod === "stripe") {
        setStripeInitialState(isEnabled);
        setUseStripe(isEnabled);
        setStripeValues((prev) => ({
          ...prev,
          stripeAccountId,
          details_submitted: details_submitted ? details_submitted : false,
          charges_enabled: charged_enabled ? charged_enabled : false,
        }));
      }

      if (paymentMethod === "cash") {
        setCashInitialState(isEnabled);
        setUseCash(isEnabled);
        setInitialCashInstructions(
          paymentInstructions ? paymentInstructions : placeholderCashMessage
        );
        setCashPayInstructions(
          paymentInstructions ? paymentInstructions : placeholderCashMessage
        );
      }

      if (paymentMethod === "venmo") {
        setVenmoInitialState(isEnabled);
        setUseVenmo(isEnabled);
        setInitialVenmoValues({
          initialVenmoPayInstructions: paymentInstructions
            ? paymentInstructions
            : placeholderCardMessage,
          initialVenmoAccount: paymentAccount,
        });
        setVenmoValues((prev) => ({
          ...prev,
          venmoPayInstructions: paymentInstructions
            ? paymentInstructions
            : placeholderCardMessage,
          venmoAccount: paymentAccount,
        }));
      }

      if (paymentMethod === "zelle") {
        setZelleInitialState(isEnabled);
        setUseZelle(isEnabled);
        setInitialZelleValues({
          initialZellPayInstructions: paymentInstructions
            ? paymentInstructions
            : placeholderCardMessage,
          initialZelleAccount: paymentAccount,
        });
        setZelleValues((prev) => ({
          ...prev,
          zellePayInstructions: paymentInstructions
            ? paymentInstructions
            : placeholderCardMessage,
          zelleAccount: paymentAccount,
        }));
      }

      if (paymentMethod === "paypal") {
        setPaypalInitialState(isEnabled);
        setUsePayPal(isEnabled);
        setInitialPaypalValues({
          initialPaypalInstructions: paymentInstructions
            ? paymentInstructions
            : placeholderCardMessage,
          initialPaypalAccount: paymentAccount,
        });
        setPaypalValues((prev) => ({
          ...prev,
          paypalInstructions: paymentInstructions
            ? paymentInstructions
            : placeholderCardMessage,
          paypalAccount: paymentAccount,
        }));
      }
    }
  };

  useEffect(() => {
    // check if state values are different than prop values. If it is, then show save/cancel buttons

    if (
      enableTaxes !== tax.isTaxRateEnabled ||
      useStripe !== stripeInitialState ||
      useCash !== cashInitialState ||
      useVenmo !== venmoInitialState ||
      useZelle !== zelleInitialState ||
      usePayPal !== paypalInitialState
    ) {
      setShowSaveCancelButtons(true);
      return;
    } else {
      setShowSaveCancelButtons(false);
    }

    if (tax.isTaxRateEnabled) {
      if (taxAmt !== tax.taxRate) {
        setShowSaveCancelButtons(true);
        return;
      } else {
        setShowSaveCancelButtons(false);
      }
    }

    if (useCash) {
      if (cashPayInstructions !== initialCashInstructions) {
        setShowSaveCancelButtons(true);
        return;
      } else {
        setShowSaveCancelButtons(false);
      }
    }

    if (useVenmo) {
      if (
        venmoPayInstructions !==
          initialVenmoValues.initialVenmoPayInstructions ||
        venmoAccount !== initialVenmoValues.initialVenmoAccount
      ) {
        setShowSaveCancelButtons(true);
        return;
      } else {
        setShowSaveCancelButtons(false);
      }
    }

    if (useZelle) {
      if (
        zellePayInstructions !==
          initialZelleValues.initialZellPayInstructions ||
        zelleAccount !== initialZelleValues.initialZelleAccount
      ) {
        setShowSaveCancelButtons(true);
        return;
      } else {
        setShowSaveCancelButtons(false);
      }
    }

    if (usePayPal) {
      if (
        paypalInstructions !== initialPaypalValues.initialPaypalInstructions ||
        paypalAccount !== initialPaypalValues.initialPaypalAccount
      ) {
        setShowSaveCancelButtons(true);
        return;
      } else {
        setShowSaveCancelButtons(false);
      }
    }
  }, [
    enableTaxes,
    useStripe,
    useCash,
    useVenmo,
    useZelle,
    usePayPal,
    taxAmt,
    cashPayInstructions,
    venmoPayInstructions,
    venmoAccount,
    zellePayInstructions,
    zelleAccount,
    paypalInstructions,
    paypalAccount,
    account,
  ]);

  const handleOpenSnackbar = (message) => {
    setOpenSnackbar({
      snackbarOpen: true,
      snackbarMessage: message,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleEnabletaxes = (e) => {
    setEnableTaxes((prev) => !prev);
  };

  const handleChangeTaxAmt = (value) => {
    setTaxAmt(value);
  };

  const handleViewTaxRatesClick = () => {
    const taxRateUrl =
      "https://taxfoundation.org/data/all/state/2023-sales-tax-rates-midyear/";
    window.open(taxRateUrl, "_blank", "noreferrer");
  };

  const handleChangeInPayment = (e) => {
    const { value } = e.target;

    if (value === "deposit") {
      if (hasDeposit) {
        setDepositFeeType("");
        setDepositDollarFee("");
        setDepositPercentageFee("");
      }

      if (!hasDeposit) {
        setDepositFeeType("dollar");
      }
      setHasDeposit((prev) => !prev);
    }

    if (value === "stripe") {
      // let stripeData = null;

      if (!details_submitted) {
        handleOpenSnackbar("Complete Stripe account before enabling this.");
        return;
      }

      setUseStripe((prev) => !prev);
    }

    if (value === "cash") {
      if (useCash) {
        // Check is paymentMethod == "cash" in acceptedPayments array, if it is, add to removedPayments

        // return cashPayment or undefined
        const cashPayment = acceptedPayments.find(
          (payment) => payment.paymentMethod === "cash"
        );

        if (cashPayment) {
          setRemovedPayments((prev) => [...prev, cashPayment]);
        }
      } else {
        // filter out cashPayment from removedPayments
        const filteredRemovedPayments = removedPayments.filter(
          (payment) => payment.paymentMethod !== "cash"
        );
        setRemovedPayments(filteredRemovedPayments);
      }
      setUseCash((prev) => !prev);
    }

    if (value === "zelle") {
      if (useZelle) {
        // Check is paymentMethod == "zelle" in acceptedPayments array, if it is, add to removedPayments

        // return zellePayment or undefined
        const zellePayment = acceptedPayments.find(
          (payment) => payment.paymentMethod === "zelle"
        );

        if (zellePayment) {
          setRemovedPayments((prev) => [...prev, zellePayment]);
        }
      } else {
        // filter out zellePayment from removedPayments
        const filteredRemovedPayments = removedPayments.filter(
          (payment) => payment.paymentMethod !== "zelle"
        );
        setRemovedPayments(filteredRemovedPayments);
      }

      setUseZelle((prev) => !prev);
    }

    // if (value === "cash-app") {
    //   setUseCashApp((prev) => !prev);
    // }

    if (value === "venmo") {
      if (useVenmo) {
        // Check is paymentMethod == "venmo" in acceptedPayments array, if it is, add to removedPayments

        // return venmoPayment or undefined
        const venmoPayment = acceptedPayments.find(
          (payment) => payment.paymentMethod === "venmo"
        );

        if (venmoPayment) {
          setRemovedPayments((prev) => [...prev, venmoPayment]);
        }
      } else {
        // filter out venmoPayment from removedPayments
        const filteredRemovedPayments = removedPayments.filter(
          (payment) => payment.paymentMethod !== "venmo"
        );
        setRemovedPayments(filteredRemovedPayments);
      }
      setUseVenmo((prev) => !prev);
    }

    if (value === "paypal") {
      if (usePayPal) {
        // Check is paymentMethod == "paypal" in acceptedPayments array, if it is, add to removedPayments

        // return paypalPayment or undefined
        const paypalPayment = acceptedPayments.find(
          (payment) => payment.paymentMethod === "paypal"
        );

        if (paypalPayment) {
          setRemovedPayments((prev) => [...prev, paypalPayment]);
        }
      } else {
        // filter out paypalPayment from removedPayments
        const filteredRemovedPayments = removedPayments.filter(
          (payment) => payment.paymentMethod !== "paypal"
        );
        setRemovedPayments(filteredRemovedPayments);
      }
      setUsePayPal((prev) => !prev);
    }
  };

  const handleSetupStripeClick = async (e) => {
    setIsLoadingStripeConnect(true);

    let stripeId = stripeAccountId;

    // * If no stripeId saved to db, create stripe account
    if (!stripeId) {
      const stripeAPI = "/api/private/stripe/create-stripe-account";
      const stripeRes = await fetch(stripeAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userAccount }),
      });
      const stripeJSON = await stripeRes.json();

      const { stripeAccountId: stripeAccIdRenamed } = stripeJSON;
      stripeId = stripeAccIdRenamed;
    }

    // * If stripe Id has already been created, use stripeId from DB and open stripeAccountLink
    const stripeAccountLinkAPI = "/api/private/stripe/stripe-account-link";
    const stripeAccountLinkRes = await fetch(stripeAccountLinkAPI, {
      method: "POST",
      body: JSON.stringify({ stripeId }),
    });
    const stripeAccountLinkJSON = await stripeAccountLinkRes.json();
    const { url } = stripeAccountLinkJSON;

    // * Save stripe acc id to db
    if (!stripeAccountId && url) {
      const addStripeIdAPI = "/api/private/payments/add-stripe-id";
      await fetch(addStripeIdAPI, {
        method: "POST",
        body: JSON.stringify({ stripeId, accountId }),
      });
      // const addStripeIdJSON = await addStripeIdRes.json();
      // const { id } = addStripeIdJSO
    }

    push(url);
  };

  const handleDepositFeeTypeChange = (e) => {
    const { value } = e.target;

    if (value === "dollar") {
      setDepositPercentageFee("");
    }

    if (value === "percentage") {
      setDepositDollarFee("");
    }

    setDepositFeeType(value);
  };

  const handleDepositFeeChange = (value, name) => {
    if (name === "dollar") {
      setDepositDollarFee(value);
    }

    if (name === "percentage") {
      setDepositPercentageFee(value);
    }
  };

  const handleZelleChange = (e) => {
    const { name, value } = e.target;
    setZelleValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaypalChange = (e) => {
    const { name, value } = e.target;

    setPaypalValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleVenmoChange = (e) => {
    const { name, value } = e.target;
    setVenmoValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCashChange = (e) => {
    const { value } = e.target;
    setCashPayInstructions(value);
  };

  const handleCancel = (e) => {
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleCancelAllUpdates = () => {
    // TODO: here reset all to oroginal values
    setIsLoading(false);
    setIsCancelModalOpen(false);
    // reset all state values to original values from props

    // setHasDeposit(requireDeposit);
    // setDepositFeeType(
    //   deposit
    //     ? deposit.feeTypeStr !== ""
    //       ? deposit.feeTypeStr
    //       : "dollar"
    //     : "dollar"
    // );
    // setDepositDollarFee(
    //   deposit ? (deposit.feeTypeSymbol === "$" ? deposit.feeIntPenny : "") : ""
    // );
    // setDepositPercentageFee(
    //   deposit ? (deposit.feeTypeSymbol === "%" ? deposit.feeIntPenny : "") : ""
    // );

    setInitialStates(acceptedPayments, tax, placeholderCardMessage);
  };

  const structureTaxData = () => {
    let taxData = {};

    if (!enableTaxes) {
      taxData = {
        isTaxRateEnabled: enableTaxes,
      };
    } else {
      let taxRateDisplay;

      if (taxAmt.toString().includes(".")) {
        const [numBeforeDecimal, numAfterDecimal] = taxAmt
          .toString()
          .split(".");

        if (numAfterDecimal === "00") {
          taxRateDisplay = numBeforeDecimal + "%";
        } else {
          taxRateDisplay = parseFloat(taxAmt).toFixed(2).toString() + "%";
        }
      } else {
        taxRateDisplay = taxAmt + "%";
      }

      taxData = {
        taxRate: parseFloat(taxAmt),
        taxRateDisplay,
        isTaxRateEnabled: enableTaxes,
      };
    }

    return taxData;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (!useStripe && !useCash && !useZelle && !useVenmo && !usePayPal) {
      handleOpenSnackbar("Please enable at least one payment method.");
      setIsLoading(false);
      return;
    }

    // const accountData = structureAccountData();
    // const depositData = structureDepositData();
    const paymentData = structurePaymentData();
    const taxData = structureTaxData();

    const data = {
      // accountData,
      // depositData,
      paymentData,
      accountId,
      removedPayments,
      taxData,
    };

    try {
      const { success, value } = await updatePaymentClient(data);

      if (success) {
        const { acceptedPayments, tax } = value;
        setAccount(value);
        setInitialStates(acceptedPayments, tax, placeholderCardMessage);
        updateChecklist();
        handleOpenSnackbar("Successfully saved.");
        setShowSaveCancelButtons(false);
        setIsLoading(false);
        return;
      }

      handleOpenSnackbar("Error saving.");
    } catch (error) {
      console.log("error", error);
      handleOpenSnackbar("Error updating payments.");
    }

    setIsLoading(false);
  };

  const updateChecklist = async () => {
    const {
      id,
      accountId,
      isProductsUploaded,
      isEmailVerified,
      isDeliverySet,
      isPaymentsSet,
      hasLogo,
      hasBanner,
      requireAvailability,
      isAvailabilitySet,
      isChecklistComplete,
    } = checklistStore;

    if (isChecklistComplete || isPaymentsSet) return;

    setChecklistStore({ isPaymentsSet: true });

    const { success, value, error } = await updatePaymentChecklistClient(
      accountId
    );

    if (!success) {
      console.log("error updating checklist for product:", error);
      //TODO: handle error for not being able to update checklist.
    }

    if (
      isEmailVerified &&
      isProductsUploaded &&
      isDeliverySet &&
      ((requireAvailability && isAvailabilitySet) || !requireAvailability)
    ) {
      const checklistCompleted = true;
      updateIsChecklistComplete(accountId, checklistCompleted);
      setChecklistStore({ isChecklistComplete: checklistCompleted });
    }
  };

  const structureAccountData = () => {
    const accountData = {
      requireDeposit: hasDeposit,
    };
    return accountData;
  };

  const structureDepositData = () => {
    if (!hasDeposit) return {};

    let depositFeeStr;

    if (depositFeeType === "percentage") {
      if (depositPercentageFee.toString().includes(".")) {
        const [numBeforeDecimal, numAfterDecimal] = depositPercentageFee
          .toString()
          .split(".");

        if (numAfterDecimal === "00") {
          depositFeeStr = numBeforeDecimal + "%";
        } else {
          depositFeeStr =
            parseFloat(depositPercentageFee).toFixed(2).toString() + "%";
        }
      } else {
        depositFeeStr = depositPercentageFee + "%";
      }
    }

    if (depositFeeType === "dollar") {
      if (!depositDollarFee.toString().includes(".")) {
        depositFeeStr = "$" + depositDollarFee + ".00";
      } else {
        depositFeeStr =
          "$" + parseFloat(depositDollarFee).toFixed(2).toString();
      }
    }

    const depositData = {
      feeTypeStr: depositFeeType,
      feeTypeSymbol: depositFeeType === "dollar" ? "$" : "%",
      feeIntPenny:
        depositFeeType === "dollar"
          ? parseInt((parseFloat(depositDollarFee) * 100).toFixed(2))
          : null,
      feeIntPercent:
        depositFeeType === "percentage"
          ? parseFloat(depositPercentageFee)
          : null,
      feeStr: depositFeeStr,
    };

    return depositData;
  };

  const structurePaymentData = () => {
    const paymentsData = [];

    let stripeExists = null;

    for (let i = 0; i < acceptedPayments.length; i++) {
      const currPayment = acceptedPayments[i];

      if (currPayment.paymentMethod === "stripe") {
        stripeExists = currPayment;
        break;
      }
    }

    if (stripeExists) {
      const stripeData = {
        paymentMethod: "stripe",
        isEnabled: useStripe,
      };
      paymentsData.push(stripeData);
    }

    if (useCash) {
      const cashData = {
        paymentMethod: "cash",
        paymentInstructions: cashPayInstructions,
        paymentAccount: null,
        isEnabled: true,
      };
      paymentsData.push(cashData);
    }

    if (useVenmo) {
      const venmoData = {
        paymentMethod: "venmo",
        paymentInstructions: venmoPayInstructions,
        paymentAccount: venmoAccount,
        isEnabled: true,
      };
      paymentsData.push(venmoData);
    }

    if (usePayPal) {
      // check if value is a paypal.me/ in the beginning of the string, if it doesn't have it, add it
      let paypalAccountAddPrefix = paypalAccount;

      if (!paypalAccount.includes("paypal.me/")) {
        paypalAccountAddPrefix = `paypal.me/${paypalAccount}`;
      }

      const paypalData = {
        paymentMethod: "paypal",
        paymentInstructions: paypalInstructions,
        paymentAccount: paypalAccountAddPrefix,
        isEnabled: true,
      };
      paymentsData.push(paypalData);
    }

    if (useZelle) {
      const zelleData = {
        paymentMethod: "zelle",
        paymentInstructions: zellePayInstructions,
        paymentAccount: zelleAccount,
        isEnabled: true,
      };
      paymentsData.push(zelleData);
    }

    return paymentsData;
  };

  // Displays
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <form
      onSubmit={handleSave}
      className="pb-32 pt-4 lg:grid lg:grid-cols-2 lg:auto-rows-min lg:gap-4 lg:px-4 lg:pt-4  "
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />
      <div className="lg:flex lg:flex-col lg:gap-4">
        {/* // * Deposit UI */}
        {/* <div className="p-4 mx-4 mb-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] h-fit rounded bg-white lg:mx-0 lg:mb-0 ">
          <div>
            <div className="flex justify-between pr-4">
              <h3>Deposits</h3>
              <IOSSwitch
                checked={hasDeposit}
                onChange={handleChangeInPayment}
                value="deposit"
              />
            </div>
            <p className="text-gray-800 font-light text-xs mt-2">
              Deposits will be charged immediately. The rest of the payment can
              be charged in orders-live page.
            </p>
            <div
              className={`transition-opactiy ${
                hasDeposit
                  ? "visible opacity-100 px-4 mt-4"
                  : "invisible h-0 opacity-0"
              } `}
            >
              <FormControl className="w-full ">
                <RadioGroup
                  // aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="dollar"
                  value={depositFeeType}
                  onChange={handleDepositFeeTypeChange}
                  name="deposit-fee-type-radio-group-buttons"
                  className="flex flex-col gap-2 "
                >
                  <div className="flex justify-between w-full">
                    <FormControlLabel
                      value="dollar"
                      control={<Radio />}
                      label={
                        <p className="text-black text-xs font-light">
                          Dollar fee
                        </p>
                      }
                    />
                    <div className="w-1/6 flex gap-2 items-center">
                      <CurrencyInput
                        name="dollar"
                        required
                        placeholder="$"
                        disabled={depositFeeType == "dollar" ? false : true}
                        value={depositDollarFee}
                        onValueChange={handleDepositFeeChange}
                        decimalsLimit={2}
                        decimalScale={2}
                        prefix="$"
                        className={`w-full transition-colors duration-300  rounded-md p-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] font-light text-xs ${
                          depositFeeType == "dollar"
                            ? "border border-[color:var(--primary-light-med)]"
                            : "border-none"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between w-full">
                    <FormControlLabel
                      value="percentage"
                      control={<Radio />}
                      label={
                        <p className="text-black text-xs font-light">
                          Percentage fee
                        </p>
                      }
                    />
                    <div className="w-1/6 flex gap-2 items-center">
                      <CurrencyInput
                        name="percentage"
                        required
                        placeholder="%"
                        disabled={depositFeeType == "percentage" ? false : true}
                        value={depositPercentageFee}
                        onValueChange={handleDepositFeeChange}
                        decimalsLimit={2}
                        decimalScale={2}
                        suffix="%"
                        className={`w-full transition-colors duration-300  rounded-md p-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] font-light text-xs ${
                          depositFeeType == "percentage"
                            ? "border border-[color:var(--primary-light-med)]"
                            : "border-none"
                        }`}
                      />
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div> */}
        <div className="p-4 mx-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded h-fit bg-white lg:mx-0">
          <div className="flex justify-between pr-4">
            <h3>Taxes</h3>
            <IOSSwitch
              checked={enableTaxes}
              onChange={handleEnabletaxes}
              value="taxes"
            />
          </div>
          <p className="text-gray-800 font-light text-xs mt-2">
            Apply sales tax.
          </p>
          <div
            className={`transition-opactiy ${
              enableTaxes
                ? "visible opacity-100 px-4 mt-4"
                : "invisible h-0 opacity-0"
            } `}
          >
            <div className="flex flex-end w-full items-center">
              <button
                type="button"
                role="link"
                onClick={handleViewTaxRatesClick}
                className="underline text-blue-500 text-sm font-light"
              >
                View tax rates
              </button>
              <div className="w-1/6 flex gap-2 items-center ml-auto">
                <CurrencyInput
                  name="percentage"
                  required
                  placeholder="%"
                  disabled={enableTaxes ? false : true}
                  value={taxAmt}
                  onValueChange={handleChangeTaxAmt}
                  decimalsLimit={2}
                  decimalScale={2}
                  suffix="%"
                  className={`w-full transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md p-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] font-light text-xs`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pt-4 m-4 h-fit  shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded bg-white lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:m-0">
        <h3>Payments</h3>
        <p className="text-gray-800 font-light text-xs mt-2 mb-4">
          Allow your customers the flexibility to pay in any way.
        </p>
        <div className="p-4">
          <div className="border-b border-[color:var(--gray-light)] pb-2">
            <div className="flex justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 aspect-square relative ">
                    <Image
                      src={credit_card}
                      alt="credit card"
                      className="w-full h-full"
                      fill
                      priority
                    />
                  </div>
                  <p className="text-black">Credit/Debit Card</p>
                </div>
                <p className="text-xs  text-gray-500">
                  Increase your sales by allowing your customers to pay with
                  credit card.
                </p>
                <p className="text-xs mt-2 list-item  text-gray-500">
                  CC fees: 2.9% + 30¢ per transaction
                </p>
                <p className="text-xs mt-2 list-item  text-gray-500">
                  +1% if outside of US
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
                value="stripe"
                checked={useStripe}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="w-fit mt-4 mb-4">
                {isLoadingStripeConnect ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress
                      color="secondary"
                      sx={{ width: "1rem", height: "1rem" }}
                      // fontSize="small"
                    />
                    {!stripeAccountId ? (
                      <p className="text-sm font-light">Setting up...</p>
                    ) : (
                      <p className="text-sm font-light">Gathering...</p>
                    )}
                  </div>
                ) : (
                  <ButtonPrimary
                    type="button"
                    handleClick={handleSetupStripeClick}
                    name={
                      !stripeAccountId
                        ? "Create a Stripe Account"
                        : !details_submitted
                        ? "Finish setup"
                        : "Edit account"
                    }
                  />
                )}
              </div>
              {stripeAccountId && details_submitted && !charges_enabled && (
                <div className="flex items-center gap-1">
                  <AutorenewIcon fontSize="small" color="success" />
                  <p className="text-sm font-extralight text-gray-600">
                    pending - few minutes
                  </p>
                </div>
              )}
              {stripeAccountId && details_submitted && charges_enabled && (
                <div className="flex items-center gap-1">
                  <VerifiedIcon fontSize="small" color="success" />
                  <p className="text-sm font-extralight text-gray-600">
                    verified
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="border-b border-[color:var(--gray-light)] py-4">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 aspect-square relative ">
                    <Image
                      src={cash}
                      alt="cash"
                      className="w-full h-full"
                      fill
                      priority
                    />
                  </div>
                  <p className="text-black">Cash</p>
                </div>
                <p className="text-xs text-gray-500">
                  Cash payments are made in person.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
                value="cash"
                checked={useCash}
              />
            </div>
            <div
              className={`${
                useCash
                  ? " transition-opacity duration-300 h-auto opacity-100"
                  : " h-0 opacity-0"
              }`}
            >
              <div className="my-2">
                <label htmlFor="cash-instructions-input" className="text-xs">
                  Instructions:
                </label>
                <textarea
                  value={cashPayInstructions}
                  onChange={handleCashChange}
                  type="text"
                  id="cash-instructions-input"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-xs overflow-hidden`}
                />
              </div>
            </div>
          </div>
          <div className="border-b border-[color:var(--gray-light)] py-4">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 aspect-square relative ">
                    <Image
                      src={venmo}
                      alt="venmo"
                      className="w-full h-full"
                      fill
                      priority
                    />
                  </div>
                  <p className="text-black">Venmo</p>
                </div>
                <p className="text-xs text-gray-500">
                  Allow payments via Venmo.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
                value="venmo"
                checked={useVenmo}
              />
            </div>
            <div
              className={`${
                useVenmo
                  ? " transition-opacity duration-300 h-auto opacity-100"
                  : " h-0 opacity-0"
              }`}
            >
              <div className="my-2">
                <label htmlFor="venmo-account" className="text-xs">
                  Venmo Account:
                </label>
                <input
                  type="text"
                  id="venmo-account"
                  name="venmoAccount"
                  value={venmoAccount}
                  onChange={handleVenmoChange}
                  required
                  disabled={useVenmo ? false : true}
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                />
              </div>
              <div className="my-2">
                <label htmlFor="venmo-instructions-input" className="text-xs">
                  Instructions:
                </label>
                <textarea
                  value={venmoPayInstructions}
                  name="venmoPayInstructions"
                  onChange={handleVenmoChange}
                  disabled={useVenmo ? false : true}
                  type="text"
                  id="venmo-instructions-input"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-xs overflow-hidden`}
                />
              </div>
            </div>
          </div>
          <div className="border-b border-[color:var(--gray-light)] py-4">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 aspect-square relative ">
                    <Image
                      src={zelle}
                      alt="zelle"
                      className="w-full h-full"
                      fill
                      priority
                    />
                  </div>
                  <p className="text-black">Zelle</p>
                </div>
                <p className="text-xs text-gray-500">
                  Allow payments via Zelle.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
                value="zelle"
                checked={useZelle}
              />
            </div>
            <div
              className={`${
                useZelle
                  ? "transition-opacity duration-300 h-auto opacity-100"
                  : "h-0 opacity-0"
              }`}
            >
              <div className="my-2">
                <div className="py-4">
                  <p className="text-xs font-light text-[color:var(--gray-text)]">
                    Offer your customers your Zelle info for simple payment.
                  </p>
                </div>
                <label htmlFor="zelle-account" className="text-xs">
                  Zelle Account:
                </label>
                <input
                  type="text"
                  placeholder="Email or phone number"
                  id="zelle-account"
                  value={zelleAccount}
                  disabled={useZelle ? false : true}
                  required
                  name="zelleAccount"
                  onChange={handleZelleChange}
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                />
              </div>
              <div className="my-2">
                <label htmlFor="zelle-instructions-input" className="text-xs">
                  Instructions for customer:
                </label>
                <textarea
                  onChange={handleZelleChange}
                  value={zellePayInstructions}
                  name="zellePayInstructions"
                  disabled={useZelle ? false : true}
                  type="text"
                  id="zelle-instructions-input"
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-xs overflow-hidden`}
                />
              </div>
            </div>
          </div>
          <div className="border-b border-[color:var(--gray-light)] py-4">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 aspect-square relative ">
                    <Image
                      src={paypal}
                      alt="paypal"
                      className="w-full h-full"
                      fill
                      priority
                    />
                  </div>
                  <p className="text-black">Paypal</p>
                </div>
                <p className="text-xs text-gray-500">
                  Allow payments via Paypal.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
                value="paypal"
                checked={usePayPal}
              />
            </div>
            <div className="my-2">
              <div
                className={`${
                  usePayPal
                    ? " transition-opacity duration-300 h-auto opacity-100"
                    : " h-0 opacity-0"
                }`}
              >
                <div className="py-4">
                  <p className="text-xs font-light text-[color:var(--gray-text)]">
                    Offer your customers your Paypal link for simple payment.
                  </p>
                  <Link
                    target="_blank"
                    href="https://www.paypal.com/paypalme/"
                    className="text-xs font-light text-[color:var(--secondary-dark-med)] underline"
                  >
                    Claim your paypal.me link.
                  </Link>
                </div>
                <label htmlFor="paypal-account" className="text-xs">
                  Paypal Account: paypal.me/
                </label>
                <input
                  type="text"
                  id="paypal-account"
                  name="paypalAccount"
                  value={paypalAccount}
                  onChange={handlePaypalChange}
                  required
                  disabled={usePayPal ? false : true}
                  className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                />
                <div className="my-2">
                  <label
                    htmlFor="paypal-instructions-input"
                    className="text-xs"
                  >
                    Instructions:
                  </label>
                  <textarea
                    value={paypalInstructions}
                    onChange={handlePaypalChange}
                    disabled={usePayPal ? false : true}
                    name="paypalInstructions"
                    type="text"
                    id="paypal-instructions-input"
                    className={`transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md w-full py-2 px-4 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)]  font-light text-xs overflow-hidden`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSaveCancelButtons && (
        <div className="fixed bottom-[3.3rem] z-10 border-b w-full bg-white border-t p-4 md:w-[calc(100%-225px)] md:bottom-0 lg:left-0 lg:ml-[225px]">
          <div className="lg:w-2/5 lg:ml-auto">
            <SaveCancelButtons
              handleCancel={handleCancel}
              cancelButtonType="button"
              isLoading={isLoading}
              saveButtonType="submit"
            />
          </div>
          <Modal
            open={isCancelModalOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleMobile}>
              {/* <h4>Cancel</h4> */}
              <p>Cancel all updates?</p>
              <div className="flex justify-end mt-6 gap-4">
                <ButtonFourth
                  type="button"
                  name="No"
                  handleClick={closeCancelModal}
                />

                <ButtonThird
                  name="Yes, cancel"
                  type="button"
                  handleClick={handleCancelAllUpdates}
                />
              </div>
            </Box>
          </Modal>
        </div>
      )}
    </form>
  );
}

export default Payments;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;
    let serializedAccount = {};

    try {
      const userAccount = await prisma.account.findUnique({
        where: {
          email,
        },
        include: {
          tax: true,
          deposit: true,
          acceptedPayments: true,
        },
      });

      serializedAccount = JSON.parse(JSON.stringify(userAccount));
    } catch (error) {
      console.log("serversideprops checklist error:", error);
    }

    return {
      props: {
        userSession,
        userAccount: serializedAccount,
      },
    };
  });
}

Payments.getLayout = function getLayout(
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

Payments.pageTitle = "Payments";
Payments.pageIcon = <AddCardRoundedIcon />;
Payments.pageRoute = "payments";
Payments.mobilePageRoute = "payments";
