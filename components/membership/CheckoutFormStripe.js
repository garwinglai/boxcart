import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import ButtonPrimary from "../global/buttons/ButtonPrimary";
import { Divider, Snackbar, TextField } from "@mui/material";
import { useAccountStore, useMembershipStore } from "@/lib/store";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

function CheckoutFormStripe({
  membership,
  price,
  premiumPlan,
  handleIsSubscribed,
}) {
  const { stripeCustomerId } = premiumPlan || {};

  // Stripe setup
  const paymentElementOptions = {
    layout: "tabs",
  };
  const stripe = useStripe();
  const elements = useElements();

  // Store Zustand
  const accountStore = useAccountStore((state) => state.account);
  const removeMembershipPriceStore = useMembershipStore(
    (state) => state.removeMembershipPrice
  );
  const removeMembershipProductStore = useMembershipStore(
    (state) => state.removeMembershipProduct
  );
  const { firstName, lastName } = accountStore;

  const { name, description, images } = membership;
  const { recurring } = price;
  const { interval } = recurring;

  const priceDisplay = `$${(price.unit_amount / 100).toFixed(2)}`;

  // States
  const [email, setEmail] = useState("");
  const [snackbar, setSnackbar] = useState({
    isSnackbarOpen: false,
    snackbarMessage: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { isSnackbarOpen, snackbarMessage } = snackbar;

  const handleCustomerInfoChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    //* Submit the form with card details - throws error if form is missing details, or card error
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // TODO: log error
      handleOpenSnackbar(submitError.message || "Error checking out.");
      setIsLoading(false);
      return;
    }

    let customer = null;

    // TOdo: check if customer already exists - get customerId into premium plan
    if (!stripeCustomerId) {
      const customerData = {
        email,
        name: firstName + " " + lastName,
      };

      const customerRes = await createCustomer(customerData);

      if (!customerRes.success || customerRes.error) {
        // TODO: log error
        handleOpenSnackbar(
          "Error checking out. Customer, Contact us for help: hello@boxcart.shop"
        );
        setIsLoading(false);
        return;
      }

      customer = customerRes.customer;
    }

    //* Create subscription
    const subscriptionData = {
      priceId: price.id,
      customerId: stripeCustomerId ? stripeCustomerId : customer.id,
    };

    const subscriptionRes = await createSubscipton(subscriptionData);

    if (!subscriptionRes.success || subscriptionRes.error) {
      // TODO: log error
      handleOpenSnackbar(
        "Error checking out. Sub, Contact us for help: hello@boxcart.shop"
      );
      setIsLoading(false);
      return;
    }

    const { type, clientSecret } = subscriptionRes;
    const confirmIntent =
      type === "setup" ? stripe.confirmSetup : stripe.confirmPayment;

    //* Confirm and charge subscription
    const { error } = await confirmIntent({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/account/premium/checkout`,
      },
      redirect: "if_required",
    });

    if (error) {
      // TODO: log error
      handleOpenSnackbar(
        "Error checking out. Confirm pay Contact us for help: hello@boxcart.shop"
      );
      setIsLoading(false);
      return;
    }

    // * Save premium plan to db only if new create
    if (!stripeCustomerId) {
      const premiumPlanData = {
        stripeCustomerId: stripeCustomerId ? stripeCustomerId : customer.id,
        stripeSubscriptionId: subscriptionRes.subscription.id,
        planName: name,
        price: price.unit_amount,
        priceDisplay,
        payPeriod: interval,
        periodStart: subscriptionRes.subscription.current_period_start,
        periodEnd: subscriptionRes.subscription.current_period_end,
      };
      const accountId = accountStore.accountId;

      const membershipRes = await createPremiumPlan(premiumPlanData, accountId);

      if (!membershipRes.success || membershipRes.error) {
        // TODO: log error
        // TODO: payment succeed, just failed to create member in prisma
      }
    }

    handleIsSubscribed();
    removeMembershipPriceStore();
    removeMembershipProductStore();
    setIsLoading(false);
  };

  const createCustomer = async (customerData) => {
    const createCustomerApi = "/api/private/stripe/create-customer";

    const res = await fetch(createCustomerApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    const data = await res.json();

    return data;
  };

  const createSubscipton = async (subscriptionData) => {
    const createSubscriptionApi = "/api/private/stripe/create-subscription";

    const res = await fetch(createSubscriptionApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });
    const data = await res.json();

    return data;
  };

  const createPremiumPlan = async (premiumPlanData, accountId) => {
    const createPlanApi = "/api/private/membership/create-membership";
    const res = await fetch(createPlanApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ premiumPlanData, accountId }),
    });
    const data = await res.json();

    return data;
  };

  const handleOpenSnackbar = (message) => {
    setSnackbar({
      isSnackbarOpen: true,
      snackbarMessage: message,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      isSnackbarOpen: false,
      snackbarMessage: "",
    });
  };

  // * Display
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
    <div className="pb-56 md:p-4 ">
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={action}
      />

      <div className="flex flex-col items-center gap-4 mb-8 lg:flex-row lg:flex-wrap lg:ml-4">
        <h4 className="mr-auto p-4 text-gray-700 lg:w-full">BoxCart LLC</h4>

        <div className="relative w-16 h-16">
          <Image
            src={images[0]}
            alt="startup icon"
            fill
            className="w-8 h-8"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="flex flex-col items-center gap-1 lg:items-start">
          <h4 className="text-gray-400">Subscribe to {name}</h4>
          <div className="flex gap-2 items-center">
            <h2 className="font-medium text-3xl">{priceDisplay}</h2>
            <span>
              <p className="text-xs font-base text-gray-500">per</p>
              <p className="text-xs font-base text-gray-500">{interval}</p>
            </span>
          </div>
        </div>
        <div className="lg:ml-auto lg:mr-4">
          <p className="text-sm border-t pt-2 lg:border-none">
            Total due today: {priceDisplay}
          </p>
        </div>
      </div>

      <Divider />
      <form onSubmit={handleCheckout} className="p-4 lg:flex lg:gap-16 lg:mt-4">
        <div className="flex-grow">
          <div className="mb-8">
            <label htmlFor="email" className="text-sm text-gray-600">
              Email
            </label>
            <TextField
              id="email"
              size="small"
              required
              type="email"
              fullWidth
              value={email}
              name="email"
              color="primary"
              onChange={handleCustomerInfoChange}
            />
          </div>
          <div className="mb-8 border-b pb-8 lg:border-none">
            <h3 className="text-gray-800 font-base mb-4">Payment method</h3>
            <PaymentElement
              mode="subscription"
              id="payment-element"
              options={paymentElementOptions}
            />
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="flex-grow">
          <div>
            <h3 className="text-gray-800 font-base mb-4">Billing address</h3>
            <AddressElement
              id="address-element"
              options={{ mode: "billing" }}
            />
          </div>
          {isLoading ? (
            <div className="h-10 mt-8 text-center">
              <CircularProgress size={30} />
            </div>
          ) : (
            <div className="h-10 mt-8">
              <ButtonPrimary
                type="submit"
                name="Checkout"
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default CheckoutFormStripe;
