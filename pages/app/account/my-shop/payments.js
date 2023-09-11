import React, { useState, useEffect } from "react";
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import AppLayout from "@/components/layouts/AppLayout";
import { IOSSwitch } from "@/components/global/switches/IOSSwitch";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import Link from "next/link";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
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
import { updatePaymentChecklistClient } from "@/helper/client/api/checklist";
import { getLocalStorage } from "@/utils/clientStorage";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";

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
  const {
    enableTips,
    tips,
    deposit,
    requireDeposit,
    tax,
    acceptedPayments,
    id: accountId,
  } = userAccount || {};

  const placeholderCardMessage =
    "Please include your order ID in payment notes. Payment must be completed in 15 minutes.";

  const placeholderCashMessage =
    "Please provide cash upon receiving order in person.";

  const [isLoading, setIsLoading] = useState(false);
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
  const [hasTips, setHasTips] = useState(enableTips ? enableTips : false);
  const [tipType, setTipType] = useState(
    enableTips ? (tips.type ? tips.type : "dollar") : "dollar"
  );
  const [enableTaxes, setEnableTaxes] = useState(
    tax ? tax.isTaxRateEnabled : false
  );
  const [taxAmt, setTaxAmt] = useState(
    tax ? (tax.taxRate ? tax.taxRate : "") : ""
  );
  const [tipValuesDollar, setTipValuesDollar] = useState({
    tipOneDollar: enableTips
      ? tips.type === "dollar"
        ? tips.tipOneIntPenny / 100
          ? tips.tipOneIntPenny / 100
          : ""
        : ""
      : "",
    tipTwoDollar: enableTips
      ? tips.type === "dollar"
        ? tips.tipTwoIntPenny / 100
          ? tips.tipTwoIntPenny / 100
          : ""
        : ""
      : "",
    tipThreeDollar: enableTips
      ? tips.type === "dollar"
        ? tips.tipThreeIntPenny / 100
          ? tips.tipThreeIntPenny / 100
          : ""
        : ""
      : "",
  });
  const [tipValuesPercentage, setTipValuesPercentage] = useState({
    tipOnePercentage: enableTips
      ? tips.type === "percentage"
        ? tips.tipOnePercent
          ? tips.tipOnePercent
          : ""
        : ""
      : "",
    tipTwoPercentage: enableTips
      ? tips.type === "percentage"
        ? tips.tipTwoPercent
          ? tips.tipTwoPercent
          : ""
        : ""
      : "",
    tipThreePercentage: enableTips
      ? tips.type === "percentage"
        ? tips.tipThreePercent
          ? tips.tipThreePercent
          : ""
        : ""
      : "",
  });
  const [useCard, setUseCard] = useState(false);
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
  const { tipOneDollar, tipTwoDollar, tipThreeDollar } = tipValuesDollar;
  const { tipOnePercentage, tipTwoPercentage, tipThreePercentage } =
    tipValuesPercentage;
  const { zellePayInstructions, zelleAccount } = zelleValues;
  const { paypalInstructions, paypalAccount } = paypalValues;
  const { venmoPayInstructions, venmoAccount } = venmoValues;

  const { push } = useRouter();

  useEffect(() => {
    for (let i = 0; i < acceptedPayments.length; i++) {
      const payment = acceptedPayments[i];
      const { paymentMethod, paymentAccount, paymentInstructions } = payment;

      if (paymentMethod === "cash") {
        setUseCash(true);
        setCashPayInstructions(
          paymentInstructions ? paymentInstructions : placeholderCashMessage
        );
      }

      if (paymentMethod === "venmo") {
        setUseVenmo(true);
        setVenmoValues((prev) => ({
          ...prev,
          venmoPayInstructions: paymentInstructions
            ? paymentInstructions
            : placeholderCardMessage,
          venmoAccount: paymentAccount,
        }));
      }

      if (paymentMethod === "paypal") {
        setUsePayPal(true);
        setPaypalValues((prev) => ({
          ...prev,
          paypalInstructions: paymentInstructions
            ? paymentInstructions
            : placeholderCardMessage,
          paypalAccount: paymentAccount,
        }));
      }

      if (paymentMethod === "zelle") {
        setUseZelle(true);
        setZelleValues((prev) => ({
          ...prev,
          zellePayInstructions: paymentInstructions
            ? paymentInstructions
            : placeholderCardMessage,
          zelleAccount: paymentAccount,
        }));
      }
    }
  }, [acceptedPayments]);

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
    const taxRateUrl = "https://www.cdtfa.ca.gov/taxes-and-fees/rates.aspx";
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

    if (value === "tips") {
      if (hasTips) {
        setTipType("");
        setTipValuesDollar({
          tipOneDollar: "",
          tipTwoDollar: "",
          tipThreeDollar: "",
        });
        setTipValuesPercentage({
          tipOnePercentage: "",
          tipTwoPercentage: "",
          tipThreePercentage: "",
        });
      }

      if (!hasTips) {
        setTipType("dollar");
      }

      setHasTips((prev) => !prev);
    }

    if (value === "card") {
      // TODO: when add stripe, check if I have to add to removedPayments
      setUseCard((prev) => !prev);
    }

    if (value === "cash") {
      if (useCash) {
        setCashPayInstructions(placeholderCashMessage);
        // Check is paymentMethod == "cash" in acceptedPayments array, if it is, add to removedPayments

        // return cashPayment or undefined
        const cashPayment = acceptedPayments.find(
          (payment) => payment.paymentMethod === "cash"
        );

        if (cashPayment) {
          setRemovedPayments((prev) => [...prev, cashPayment]);
        }
      }
      setUseCash((prev) => !prev);
    }

    if (value === "zelle") {
      if (useZelle) {
        setZelleValues({
          zellePayInstructions: placeholderCardMessage,
          zelleAccount: "",
        });

        // Check is paymentMethod == "zelle" in acceptedPayments array, if it is, add to removedPayments

        // return zellePayment or undefined
        const zellePayment = acceptedPayments.find(
          (payment) => payment.paymentMethod === "zelle"
        );

        if (zellePayment) {
          setRemovedPayments((prev) => [...prev, zellePayment]);
        }
      }

      setUseZelle((prev) => !prev);
    }

    // if (value === "cash-app") {
    //   setUseCashApp((prev) => !prev);
    // }

    if (value === "venmo") {
      if (useVenmo) {
        setVenmoValues({
          venmoPayInstructions: placeholderCardMessage,
          venmoAccount: "",
        });

        // Check is paymentMethod == "venmo" in acceptedPayments array, if it is, add to removedPayments

        // return venmoPayment or undefined
        const venmoPayment = acceptedPayments.find(
          (payment) => payment.paymentMethod === "venmo"
        );

        if (venmoPayment) {
          setRemovedPayments((prev) => [...prev, venmoPayment]);
        }
      }
      setUseVenmo((prev) => !prev);
    }

    if (value === "paypal") {
      if (usePayPal) {
        setPaypalValues({
          paypalInstructions: placeholderCardMessage,
          paypalAccount: "",
        });

        // Check is paymentMethod == "paypal" in acceptedPayments array, if it is, add to removedPayments

        // return paypalPayment or undefined
        const paypalPayment = acceptedPayments.find(
          (payment) => payment.paymentMethod === "paypal"
        );

        if (paypalPayment) {
          setRemovedPayments((prev) => [...prev, paypalPayment]);
        }
      }
      setUsePayPal((prev) => !prev);
    }
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

  const handleTipType = (e) => {
    const { value } = e.target;
    if (value === "dollar") {
      setTipValuesPercentage({
        tipOnePercentage: "",
        tipTwoPercentage: "",
        tipThreePercentage: "",
      });
    }

    if (value === "percentage") {
      setTipValuesDollar({
        tipOneDollar: "",
        tipTwoDollar: "",
        tipThreeDollar: "",
      });
    }

    setTipType(value);
  };

  const handleChangeTipValuesDollar = (value, name) => {
    setTipValuesDollar((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTipValuesPercentage = (value, name) => {
    setTipValuesPercentage((prev) => ({ ...prev, [name]: value }));
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
    setIsLoading(false);
    setIsCancelModalOpen(false);
    // reset all state values to original values from props

    setHasDeposit(requireDeposit);
    setDepositFeeType(
      deposit
        ? deposit.feeTypeStr !== ""
          ? deposit.feeTypeStr
          : "dollar"
        : "dollar"
    );
    setDepositDollarFee(
      deposit ? (deposit.feeTypeSymbol === "$" ? deposit.feeIntPenny : "") : ""
    );
    setDepositPercentageFee(
      deposit ? (deposit.feeTypeSymbol === "%" ? deposit.feeIntPenny : "") : ""
    );
    setHasTips(enableTips ? enableTips : false);
    setTipType(enableTips ? (tips.type ? tips.type : "dollar") : "dollar");
    setTipValuesDollar({
      tipOneDollar: enableTips
        ? tips.type === "dollar"
          ? tips.tipOneIntPenny
            ? tips.tipOneIntPenny
            : ""
          : ""
        : "",
      tipTwoDollar: enableTips
        ? tips.type === "dollar"
          ? tips.tipTwoIntPenny
            ? tips.tipTwoIntPenny
            : ""
          : ""
        : "",
      tipThreeDollar: enableTips
        ? tips.type === "dollar"
          ? tips.tipThreeIntPenny
            ? tips.tipThreeIntPenny
            : ""
          : ""
        : "",
    });
    setTipValuesPercentage({
      tipOnePercentage: enableTips
        ? tips.type === "percentage"
          ? tips.tipOneIntPenny
            ? tips.tipOneIntPenny
            : ""
          : ""
        : "",
      tipTwoPercentage: enableTips
        ? tips.type === "percentage"
          ? tips.tipTwoIntPenny
            ? tips.tipTwoIntPenny
            : ""
          : ""
        : "",
      tipThreePercentage: enableTips
        ? tips.type === "percentage"
          ? tips.tipThreeIntPenny
            ? tips.tipThreeIntPenny
            : ""
          : ""
        : "",
    });
    setUseCard(
      deposit ? (deposit.paymentMethod === "card" ? true : false) : false
    );
    setUseCash(
      deposit ? (deposit.paymentMethod === "cash" ? true : false) : false
    );
    setCashPayInstructions(
      deposit
        ? deposit.paymentMethod === "cash"
          ? deposit.paymentInstructions
            ? deposit.paymentInstructions
            : placeholderCashMessage
          : placeholderCashMessage
        : placeholderCashMessage
    );
    setUseZelle(
      deposit ? (deposit.paymentMethod === "zelle" ? true : false) : false
    );
    setZelleValues({
      zellePayInstructions: deposit
        ? deposit.paymentMethod === "zelle"
          ? deposit.paymentInstructions
            ? deposit.paymentInstructions
            : placeholderCardMessage
          : placeholderCardMessage
        : placeholderCardMessage,
      zelleAccount: deposit
        ? deposit.paymentMethod === "zelle"
          ? deposit.paymentAccount
          : ""
        : "",
    });
    setUseVenmo(
      deposit ? (deposit.paymentMethod === "venmo" ? true : false) : false
    );
    setVenmoValues({
      venmoPayInstructions: deposit
        ? deposit.paymentMethod === "venmo"
          ? deposit.paymentInstructions
            ? deposit.paymentInstructions
            : placeholderCardMessage
          : placeholderCardMessage
        : placeholderCardMessage,
      venmoAccount: deposit
        ? deposit.paymentMethod === "venmo"
          ? deposit.paymentAccount
          : ""
        : "",
    });
    setUsePayPal(
      deposit ? (deposit.paymentMethod === "paypal" ? true : false) : false
    );
    setPaypalValues({
      paypalInstructions: deposit
        ? deposit.paymentMethod === "paypal"
          ? deposit.paymentInstructions
            ? deposit.paymentInstructions
            : placeholderCardMessage
          : placeholderCardMessage
        : placeholderCardMessage,
      paypalAccount: deposit
        ? deposit.paymentMethod === "paypal"
          ? deposit.paymentAccount
          : ""
        : "",
    });
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

    // TODO: Stripe

    setIsLoading(true);

    const accountData = structureAccountData();
    const tipsData = structureTipsData();
    const depositData = structureDepositData();
    const paymentData = structurePaymentData();
    const taxData = structureTaxData();

    const data = {
      accountData,
      tipsData,
      depositData,
      paymentData,
      accountId,
      removedPayments,
      taxData,
    };

    console.log("data", data);
    try {
      const { success, value } = await updatePaymentClient(data);

      if (success) {
        const { acceptedPayments } = value;
        const acceptedPaymentsLen = acceptedPayments.length;

        if (acceptedPaymentsLen === 0) {
          handleOpenSnackbar("Please enter at least one payment method.");
          setIsLoading(false);
          return;
        }

        updateChecklist();
        handleOpenSnackbar("Successfully saved.");
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
    const checklistLocalStorage = getLocalStorage("checklist");
    const checklistJson = JSON.parse(checklistLocalStorage);
    const { isPaymentSet } = checklistJson;

    if (isPaymentSet) return;

    checklistJson.isPaymentSet = true;
    const checklistString = JSON.stringify(checklistJson);
    localStorage.setItem("checklist", checklistString);

    const { success, value, error } = await updatePaymentChecklistClient(
      accountId
    );

    if (!success) {
      console.log("error updating checklist for product:", error);
      handleOpenSnackbar("Error updating checklist.");
    }
  };

  const structureAccountData = () => {
    const accountData = {
      enableTips: hasTips,
      requireDeposit: hasDeposit,
    };
    return accountData;
  };

  const structureTipsData = () => {
    let tipOne;
    let tipTwo;
    let tipThree;

    if (tipType === "dollar") {
      if (!tipOneDollar.toString().includes(".")) {
        tipOne = "$" + tipOneDollar + ".00";
      } else {
        tipOne = "$" + parseFloat(tipOneDollar).toFixed(2).toString();
      }

      if (!tipTwoDollar.toString().includes(".")) {
        tipTwo = "$" + tipTwoDollar + ".00";
      } else {
        tipTwo = "$" + parseFloat(tipTwoDollar).toFixed(2).toString();
      }

      if (!tipThreeDollar.toString().includes(".")) {
        tipThree = "$" + tipThreeDollar + ".00";
      } else {
        tipThree = "$" + parseFloat(tipThreeDollar).toFixed(2).toString();
      }
    } else {
      // percentage
      if (tipOnePercentage.toString().includes(".")) {
        const [tipOneNumBeforeDecimal, tipOneNumAfterDecimal] = tipOnePercentage
          .toString()
          .split(".");
        if (tipOneNumAfterDecimal === "00") {
          tipOne = tipOneNumBeforeDecimal + "%";
        } else {
          tipOne = parseFloat(tipOnePercentage).toFixed(2).toString() + "%";
        }
      } else {
        tipOne = tipOnePercentage + "%";
      }

      if (tipTwoPercentage.toString().includes(".")) {
        const [tipTwoNumBeforeDecimal, tipTwoNumAfterDecimal] = tipTwoPercentage
          .toString()
          .split(".");

        if (tipTwoNumAfterDecimal === "00") {
          tipTwo = tipTwoNumBeforeDecimal + "%";
        } else {
          tipTwo = parseFloat(tipTwoPercentage).toFixed(2).toString() + "%";
        }
      } else {
        tipTwo = tipTwoPercentage + "%";
      }

      if (tipThreePercentage.toString().includes(".")) {
        const [tipThreeNumBeforeDecimal, tipThreeNumAfterDecimal] =
          tipThreePercentage.toString().split(".");

        if (tipThreeNumAfterDecimal === "00") {
          tipThree = tipThreeNumBeforeDecimal + "%";
        } else {
          tipThree = parseFloat(tipThreePercentage).toFixed(2).toString() + "%";
        }
      } else {
        tipThree = tipThreePercentage + "%";
      }
    }

    const tipOnePenny = parseInt((parseFloat(tipOneDollar) * 100).toFixed(2));
    const tipOneHundredth = parseFloat(tipOnePercentage);

    const tipTwoPenny = parseInt((parseFloat(tipTwoDollar) * 100).toFixed(2));
    const tipTwoHundredth = parseFloat(tipTwoPercentage);

    const tipThreePenny = parseInt(
      (parseFloat(tipThreeDollar) * 100).toFixed(2)
    );
    const tipThreeHundredth = parseFloat(tipThreePercentage);

    const tipsData = {
      tipOneStr: tipOne,
      tipOneIntPenny: tipOnePenny ? tipOnePenny : null,
      tipOnePercent: tipOneHundredth ? tipOneHundredth : null,
      tipTwoStr: tipTwo,
      tipTwoIntPenny: tipTwoPenny ? tipTwoPenny : null,
      tipTwoPercent: tipTwoHundredth ? tipTwoHundredth : null,
      tipThreeStr: tipThree,
      tipThreeIntPenny: tipThreePenny ? tipThreePenny : null,
      tipThreePercent: tipThreeHundredth ? tipThreeHundredth : null,
      type: tipType,
    };

    return tipsData;
  };

  const structureDepositData = () => {
    if (!hasDeposit) return {};

    let depositFeeStr;
    console.log(depositPercentageFee);

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
    if (!useCard && !useCash && !useZelle && !useVenmo && !usePayPal) return [];

    const acceptedPayments = [];

    if (useCash) {
      const cashData = {
        paymentMethod: "cash",
        paymentInstructions: cashPayInstructions,
        paymentAccount: null,
      };
      acceptedPayments.push(cashData);
    }

    if (useVenmo) {
      const venmoData = {
        paymentMethod: "venmo",
        paymentInstructions: venmoPayInstructions,
        paymentAccount: venmoAccount,
      };
      acceptedPayments.push(venmoData);
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
      };
      acceptedPayments.push(paypalData);
    }

    if (useZelle) {
      const zelleData = {
        paymentMethod: "zelle",
        paymentInstructions: zellePayInstructions,
        paymentAccount: zelleAccount,
      };
      acceptedPayments.push(zelleData);
    }

    return acceptedPayments;
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
        <div className="p-4 mx-4 mb-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] h-fit rounded bg-white lg:mx-0 lg:mb-0 ">
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
        </div>
        <div className="p-4 mx-4 mb-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] h-fit rounded bg-white lg:mb-0 lg:mx-0">
          <div className="flex justify-between pr-4">
            <h3>Tips</h3>
            <IOSSwitch
              checked={hasTips}
              onChange={handleChangeInPayment}
              value="tips"
            />
          </div>
          <p className="text-gray-800 font-light text-xs mt-2">
            Accept tips from customers.
          </p>
          <div
            className={`transition-opactiy ${
              hasTips
                ? "visible opacity-100 px-4 mt-4"
                : "invisible h-0 opacity-0"
            } `}
          >
            <FormControl className="w-full ">
              <RadioGroup
                // aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="free"
                name="radio-buttons-group"
                className="flex flex-col gap-2 "
                value={tipType}
                onChange={handleTipType}
              >
                <div>
                  <div className="flex justify-between w-full">
                    <FormControlLabel
                      value="dollar"
                      control={<Radio />}
                      label={
                        <div className="flex items-center">
                          <AttachMoneyOutlinedIcon
                            fontSize="small"
                            sx={{ color: "black" }}
                          />
                          <p className="text-black font-light text-xs">
                            Flat fee
                          </p>
                        </div>
                      }
                    />
                  </div>
                  <div
                    className={`${
                      tipType === "dollar"
                        ? " transition-opacity duration-300 h-auto opacity-100 flex gap-4"
                        : " h-0 opacity-0"
                    }`}
                  >
                    <CurrencyInput
                      name="tipOneDollar"
                      placeholder="$"
                      required
                      disabled={
                        hasTips ? (tipType == "dollar" ? false : true) : true
                      }
                      value={tipOneDollar}
                      onValueChange={handleChangeTipValuesDollar}
                      decimalsLimit={2}
                      decimalScale={2}
                      prefix="$"
                      className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                    />
                    <CurrencyInput
                      name="tipTwoDollar"
                      placeholder="$"
                      required
                      value={tipTwoDollar}
                      onValueChange={handleChangeTipValuesDollar}
                      disabled={
                        hasTips ? (tipType == "dollar" ? false : true) : true
                      }
                      decimalsLimit={2}
                      decimalScale={2}
                      prefix="$"
                      className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                    />
                    <CurrencyInput
                      name="tipThreeDollar"
                      placeholder="$"
                      required
                      value={tipThreeDollar}
                      onValueChange={handleChangeTipValuesDollar}
                      disabled={
                        hasTips ? (tipType == "dollar" ? false : true) : true
                      }
                      decimalsLimit={2}
                      decimalScale={2}
                      prefix="$"
                      className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between w-full">
                    <FormControlLabel
                      value="percentage"
                      control={<Radio />}
                      label={
                        <div className="flex items-center">
                          <PercentOutlinedIcon
                            fontSize="small"
                            sx={{ color: "black" }}
                          />
                          <p className="text-black font-light text-xs">
                            Percentage fee
                          </p>
                        </div>
                      }
                    />
                  </div>
                  <div
                    className={`${
                      tipType === "percentage"
                        ? " transition-opacity duration-300 h-auto opacity-100 flex gap-4"
                        : " h-0 opacity-0"
                    }`}
                  >
                    <CurrencyInput
                      name="tipOnePercentage"
                      required
                      placeholder="%"
                      value={tipOnePercentage}
                      onValueChange={handleChangeTipValuesPercentage}
                      disabled={
                        hasTips
                          ? tipType == "percentage"
                            ? false
                            : true
                          : true
                      }
                      decimalsLimit={2}
                      decimalScale={2}
                      suffix="%"
                      className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                    />
                    <CurrencyInput
                      name="tipTwoPercentage"
                      required
                      placeholder="%"
                      value={tipTwoPercentage}
                      onValueChange={handleChangeTipValuesPercentage}
                      disabled={
                        hasTips
                          ? tipType == "percentage"
                            ? false
                            : true
                          : true
                      }
                      decimalsLimit={2}
                      decimalScale={2}
                      suffix="%"
                      className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                    />
                    <CurrencyInput
                      name="tipThreePercentage"
                      required
                      placeholder="%"
                      value={tipThreePercentage}
                      onValueChange={handleChangeTipValuesPercentage}
                      disabled={
                        hasTips
                          ? tipType == "percentage"
                            ? false
                            : true
                          : true
                      }
                      decimalsLimit={2}
                      decimalScale={2}
                      suffix="%"
                      className={`w-1/3 transition-colors duration-300 border border-[color:var(--primary-light-med)] rounded-md py-2 focus:outline-none focus:border focus:border-[color:var(--primary-dark-med)] indent-4 font-light text-xs`}
                    />
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="p-4 mx-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] rounded h-fit bg-white lg:mx-0">
          <div className="flex justify-between pr-4">
            <h3>Taxes</h3>
            <IOSSwitch
              checked={enableTaxes}
              onChange={handleEnabletaxes}
              value="tips"
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
                <div className="flex gap-1">
                  <CreditCardOutlinedIcon sx={{ color: "black" }} />
                  <p className="text-black">Credit/Debit Card</p>
                </div>
                <p className="text-xs  text-gray-500">
                  Increase your sales by allowing your customers to pay with
                  credit card.
                </p>
              </div>
              <IOSSwitch
                onChange={handleChangeInPayment}
                value="card"
                checked={useCard}
              />
            </div>
            <div
              className={`transition-opactiy duration-300 ${
                useCard ? "visible opacity-100" : "invisible h-0 opacity-0"
              } `}
            >
              <div className="w-fit mt-4 mb-4">
                <ButtonPrimary name="Setup Credit/Debit Card" />
              </div>
            </div>
          </div>
          <div className="border-b border-[color:var(--gray-light)] py-4">
            <div className="flex justify-between">
              <div>
                <div className="flex gap-1">
                  <AttachMoneyOutlinedIcon sx={{ color: "black" }} />
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
                <div className="flex gap-1">
                  <AttachMoneyOutlinedIcon sx={{ color: "black" }} />
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
                <div className="flex gap-1">
                  <AccountBalanceOutlinedIcon sx={{ color: "black" }} />
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
                <div className="flex gap-1">
                  <AccountBalanceOutlinedIcon sx={{ color: "black" }} />
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
          tips: true,
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
