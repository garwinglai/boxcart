import React, { useState, useEffect } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useRouter } from "next/router";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useCartStore, useShopperStore } from "@/lib/store";
import "react-phone-input-2/lib/style.css";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { getLocalStorage } from "@/utils/clientStorage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutFormStripe from "@/components/storefront/checkout/CheckoutFormStripe";
import prisma from "@/lib/prisma";
import ShopLayout from "@/components/layouts/storefront/ShopLayout";
import BoxLoader from "@/components/global/loaders/BoxLoader";

const publishable_key =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(publishable_key);

function Checkout({ siteData }) {
  const {
    id: accountId,
    acceptedPayments,
    fulfillmentMethods,
    subdomain,
    usedCodes,
  } = siteData;

  const shopper = useShopperStore((state) => state.shopperAccount);

  const cartStore = useCartStore((state) => {
    return state.store.find((store) => store.storeName === subdomain);
  });
  const { cart, cartDetails } = cartStore || {};
  const setCartDetails = useCartStore((state) => state.setCartDetails);

  const [snackbarValues, setSnackbarValues] = useState({
    isOpenSnackbar: false,
    snackbarMessage: "",
  });

  const [clientSecret, setClientSecret] = useState("");
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [customerStripeId, setCustomerStripeId] = useState("");
  const [availablePayments, setAvailablePayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState({});
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [applicationFeePenny, setApplicationFeePenny] = useState(0);
  const [paymentIntentId, setPaymentIntentId] = useState("");

  const { isOpenSnackbar, snackbarMessage } = snackbarValues;

  const hasDigitalProducts = cart?.some((product) => product.productType === 1);

  const router = useRouter();
  const {
    push,
    query: { site },
  } = router;

  useEffect(() => {
    if (!cart) return;

    const cartLength = cart.length;

    if (cartLength === 0) {
      router.push(`/${site}`);
    }
  }, [cartDetails?.subtotalPenny, cart]);

  useEffect(() => {
    if (!cart) return;
    const cartLength = cart.length;

    if (cartLength === 0) return;
    const stripeAccountId = getLocalStorage("stripeAccountId");
    const filterForEnabledPayments = acceptedPayments.filter(
      (payment) => payment.isEnabled
    );

    const builtPaymentArray = [];

    for (let i = 0; i < filterForEnabledPayments.length; i++) {
      const currPayment = filterForEnabledPayments[i];
      const { paymentMethod } = currPayment;

      if (paymentMethod === "stripe") {
        builtPaymentArray.unshift(currPayment);
      } else {
        builtPaymentArray.push(currPayment);
      }
    }

    const firstPaymentMethodInArray = builtPaymentArray[0].paymentMethod;
    const paymentSelected =
      firstPaymentMethodInArray === "stripe"
        ? "card"
        : firstPaymentMethodInArray;

    setAvailablePayments(builtPaymentArray);
    setSelectedPayment(paymentSelected);
    setSelectedPaymentDetails(builtPaymentArray[0]);
    setStripeAccountId(stripeAccountId);
    setCartDetails(subdomain, {
      paymentMethod: paymentSelected,
      paymentMethodValues: builtPaymentArray,
    });
    setIsLoadingPayments(false);
  }, []);

  useEffect(() => {
    if (!cart) return;
    const cartLength = cart.length;
    if (cartLength === 0) return;
    // if (selectedPayment !== "card") return;
    if (stripeAccountId === "") return;

    const {
      totalPenny: amountPenny,
      subtotalPenny,
      deliveryFeePenny,
    } = cartDetails;

    const hasFreeAccess = usedCodes.some(
      (code) => code.codeType === "FREESELLERACCESS"
    );

    const applicationFeeAmount = subtotalPenny + deliveryFeePenny;
    const applicationFee = hasFreeAccess
      ? 0
      : calculateApplicationFee(applicationFeeAmount);

    fetch("/api/public/payment/customer/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ amountPenny, stripeAccountId, applicationFee }],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { clientSecret, paymentIntentId } = data;

        setPaymentIntentId(paymentIntentId);
        setClientSecret(clientSecret);
        setApplicationFeePenny(applicationFee);
      })
      .catch((err) => console.log("Err", err));
  }, [stripeAccountId]);

  const calculateApplicationFee = (amountPenny) => {
    // We take 12%, caluclate the fee from amountPenny
    const feePercent = 0.12;
    const fee = Math.round(amountPenny * feePercent);

    return fee;
  };

  useEffect(() => {
    // if (!cartDetails) return;

    const { subtotalPenny, taxAndFeesPenny, deliveryFeePenny } =
      cartDetails || {};

    const totalPenny = subtotalPenny + taxAndFeesPenny + deliveryFeePenny;
    const totalDisplay = `$${(totalPenny / 100).toFixed(2)}`;

    setCartDetails(subdomain, {
      totalPenny,
      totalDisplay,
    });
  }, [cartDetails?.deliveryFeePenny]);

  useEffect(() => {
    if (!cartDetails) return;

    updateDeliveryFee(
      cartDetails.deliveryDistanceMi,
      cartDetails.deliveryDistanceKm
    );
  }, []);

  const updateDeliveryFee = (distanceInMi, distanceInKm) => {
    if (cartDetails.fulfillmentType == 1) {
      setCartDetails(subdomain, {
        deliveryFeeType: 0,
        deliveryFeeTypeDisplay: "free",
        deliveryFeePenny: 0,
        deliveryFeeDisplay: "$0.00",
      });
      return;
    }

    const deliveryMethod = fulfillmentMethods.find(
      (method) => method.methodInt === 0
    );

    const {
      deliveryFeeType,
      deliveryFeePriceStr,
      deliveryFeePriceIntPenny,
      deliveryFeeByDistanceStr,
      deliveryFeeByDistanceIntPenny,
      deliveryFeeDistanceMetric,
      deliveryFeeByPercentStr,
      deliveryFeeByPercent,
    } = deliveryMethod;

    const deliveryFeeTypeInt =
      deliveryFeeType === "free"
        ? 0
        : deliveryFeeType === "flat"
        ? 1
        : deliveryFeeType === "percentage"
        ? 2
        : 3;

    let deliveryFeeByDistancePenny = deliveryFeeByDistanceIntPenny;
    let deliveryFeeByDistanceDisplay = deliveryFeeByDistanceStr;
    let deliveryFeeByPercentNum = deliveryFeeByPercent;
    let deliveryFeeByPercentDisplay = deliveryFeeByPercentStr;

    if (deliveryFeeTypeInt === 2) {
      const { subtotalPenny } = cartDetails;

      deliveryFeeByPercentNum = Math.round(
        subtotalPenny * (deliveryFeeByPercent / 100)
      );
      deliveryFeeByPercentDisplay = `$${(deliveryFeeByPercentNum / 100).toFixed(
        2
      )}`;
    }

    if (deliveryFeeTypeInt === 3) {
      deliveryFeeByDistancePenny =
        deliveryFeeDistanceMetric === "mi"
          ? deliveryFeeByDistanceIntPenny * distanceInMi
          : deliveryFeeByDistanceIntPenny * distanceInKm;

      deliveryFeeByDistanceDisplay = `$${(
        deliveryFeeByDistancePenny / 100
      ).toFixed(2)}`;
    }

    const deliveryFeePenny =
      deliveryFeeTypeInt === 0
        ? 0
        : deliveryFeeTypeInt === 1
        ? deliveryFeePriceIntPenny
        : deliveryFeeTypeInt === 2
        ? deliveryFeeByPercentNum
        : deliveryFeeByDistancePenny;

    const deliveryFeeDisplay =
      deliveryFeeTypeInt === 0
        ? "$0.00"
        : deliveryFeeTypeInt === 1
        ? deliveryFeePriceStr
        : deliveryFeeTypeInt === 2
        ? deliveryFeeByPercentDisplay
        : deliveryFeeByDistanceDisplay;

    setCartDetails(subdomain, {
      deliveryFeeType: deliveryFeeTypeInt,
      deliveryFeeTypeDisplay: deliveryFeeType,
      deliveryFeePenny,
      deliveryFeeDisplay,
    });
  };

  const handleBack = (e) => {
    push(`/${site}`);
  };

  const handleOpenSnackbar = (message) => {
    setSnackbarValues({ isOpenSnackbar: true, snackbarMessage: message });
  };

  const handleCloseSnackbar = () => {
    setSnackbarValues({ isOpenSnackbar: false, snackbarMessage: "" });
  };

  const handleSelectPaymentMethod = (payment) => (e) => {
    setIsLoadingPayments(true);
    const { paymentMethod } = payment;
    const method = paymentMethod === "stripe" ? "card" : paymentMethod;
    if (method !== "card") setClientSecret("");

    setSelectedPaymentDetails(payment);
    setSelectedPayment(method);
    setCartDetails(subdomain, {
      paymentMethod: method,
      paymentMethodValues: payment,
    });
  };

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

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#eeaa88",
    },
  };
  const options = {
    appearance,
    clientSecret,
  };

  // if (!clientSecret) return <div>Error loading. Refresh...</div>;
  if (isLoadingPayments) {
    return (
      <div className="flex flex-col items-center mt-36">
        <BoxLoader />
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="">
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />
      <div className="flex justify-between sticky top-0 p-2 lg:px-28  bg-white items-center border-b z-10">
        <IconButton onClick={handleBack}>
          <ChevronLeftIcon color="black" />
        </IconButton>
        <div className="flex gap-2 items-center">
          <h3 className="text-[color:var(--black-design-extralight)]">
            Checkout Information
          </h3>
          <ShoppingCartCheckoutIcon
            sx={{ color: "var(--black-design-extralight)" }}
          />
        </div>
      </div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutFormStripe
            paymentIntentId={paymentIntentId}
            handleOpenSnackbar={handleOpenSnackbar}
            accountId={accountId}
            availablePayments={availablePayments}
            hasDigitalProducts={hasDigitalProducts}
            handleSelectPaymentMethod={handleSelectPaymentMethod}
            selectedPayment={selectedPayment}
            siteData={siteData}
            shopper={shopper}
            applicationFeePenny={applicationFeePenny}
          />
        </Elements>
      )}
      {/* {!hasDigitalProducts && selectedPayment !== "card" && (
        <CheckoutForm
          handleOpenSnackbar={handleOpenSnackbar}
          accountId={accountId}
          availablePayments={availablePayments}
          handleSelectPaymentMethod={handleSelectPaymentMethod}
          selectedPayment={selectedPayment}
          selectedPaymentDetails={selectedPaymentDetails}
          siteData={siteData}
          shopper={shopper}
          applicationFeePenny={applicationFeePenny}
        />
      )} */}
    </div>
  );
}

export default Checkout;

export async function getServerSideProps(context) {
  const { site } = context.query;

  const siteData = await prisma.account.findUnique({
    where: {
      subdomain: site,
    },
    include: {
      acceptedPayments: true,
      fulfillmentMethods: true,
      usedCodes: true,
    },
  });

  if (!siteData) {
    return {
      redirect: {
        destination: "https://www.home.boxcart.shop",
        permanent: false,
      },
    };
  }

  const serializedData = JSON.parse(JSON.stringify(siteData));

  return {
    props: {
      siteData: serializedData,
    },
  };
}

// Checkout.getLayout = function getLayout(page) {
//   return <ShopLayout>{page}</ShopLayout>;
// };
