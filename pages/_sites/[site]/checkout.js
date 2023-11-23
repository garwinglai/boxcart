import React, { useState, useEffect } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useRouter } from "next/router";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useCartStore } from "@/lib/store";
import "react-phone-input-2/lib/style.css";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { getLocalStorage } from "@/utils/clientStorage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import CheckoutFormStripe from "@/components/storefront/checkout/CheckoutFormStripe";
import CheckoutForm from "@/components/storefront/checkout/CheckoutForm";
import prisma from "@/lib/prisma";

const publishable_key =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY;

function Checkout({ siteData }) {
  const { id: accountId, acceptedPayments } = siteData;

  const setCartDetails = useCartStore((state) => state.setCartDetails);
  const cartDetails = useCartStore((state) => state.cartDetails);
  const cart = useCartStore((state) => state.cart);

  const [snackbarValues, setSnackbarValues] = useState({
    isOpenSnackbar: false,
    snackbarMessage: "",
  });
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [customerStripeId, setCustomerStripeId] = useState("");
  const [availablePayments, setAvailablePayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState({});
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  const { isOpenSnackbar, snackbarMessage } = snackbarValues;

  const router = useRouter();
  const { push } = router;

  useEffect(() => {
    const cartLength = cart.length;
    if (cartLength === 0) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
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
      console.log("paymentMethod", paymentMethod);
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
    setCartDetails({
      paymentMethod: paymentSelected,
      paymentMethodValues: builtPaymentArray,
    });
  }, []);

  useEffect(() => {
    const cartLength = cart.length;
    setIsLoadingPayments(false);
    if (cartLength === 0) return;
    if (selectedPayment !== "card") return;
    if (stripeAccountId === "") return;

    const stripePromise = loadStripe(publishable_key, {
      stripeAccount: stripeAccountId,
    });

    setStripePromise(stripePromise);

    const { totalPenny: amountPenny } = cartDetails;

    fetch("/api/public/payment/customer/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ amountPenny, stripeAccountId }],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { clientSecret } = data;

        setClientSecret(clientSecret);
      })
      .catch((err) => console.log("Err", err));
  }, [selectedPayment]);

  const handleBack = (e) => {
    push("/");
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
    setCartDetails({ paymentMethod: method, paymentMethodValues: payment });
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
    clientSecret,
    appearance,
  };

  // if (!clientSecret) return <div>Error loading. Refresh...</div>;
  if (isLoadingPayments)
    return (
      <div className="flex flex-col items-center mt-36">
        <CircularProgress />
        Loading payments...
      </div>
    );

  return (
    <div className="">
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
      />
      <div className="flex justify-between sticky top-0 p-2 bg-white items-center border-b z-10">
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
      {selectedPayment === "card" && clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutFormStripe
            handleOpenSnackbar={handleOpenSnackbar}
            accountId={accountId}
            availablePayments={availablePayments}
            handleSelectPaymentMethod={handleSelectPaymentMethod}
            selectedPayment={selectedPayment}
            siteData={siteData}
          />
        </Elements>
      )}
      {selectedPayment !== "card" && (
        <CheckoutForm
          handleOpenSnackbar={handleOpenSnackbar}
          accountId={accountId}
          availablePayments={availablePayments}
          handleSelectPaymentMethod={handleSelectPaymentMethod}
          selectedPayment={selectedPayment}
          selectedPaymentDetails={selectedPaymentDetails}
          siteData={siteData}
        />
      )}
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
    },
  });

  if (!siteData) {
    return {
      redirect: {
        destination: "https://www.boxcart.site",
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
