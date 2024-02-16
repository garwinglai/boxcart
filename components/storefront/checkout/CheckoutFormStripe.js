import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import OrderReview from "@/components/storefront/cart/OrderReview";
import OrderSubtotal from "@/components/storefront/cart/OrderSubtotal";
import { useCartStore, useShopperStore } from "@/lib/store";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useHasHydrated } from "@/utils/useHasHydrated";
import { nanoid } from "nanoid";
import { storage } from "@/firebase/fireConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CircularProgress from "@mui/material/CircularProgress";
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import calculateAmountMinusStripeFee from "@/utils/stripe-fees";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import PaymentOption from "./PaymentOption";
import { Timestamp } from "firebase/firestore";
import { createNotification } from "@/helper/client/api/notifications";
import {
  sendDigitalProductLinkToCustomer,
  sendOrderInvoiceToCustomer,
  sendOrderToBusinessEmail,
} from "@/helper/client/api/sendgrid/email";
import SignupPrompt from "@/components/user/auth/checkout/SignupPrompt";
import { checkIfUserEmailInUse } from "@/helper/client/api/user";

// * This form is for credit card payments.
// * If there are Digital Products in cart, only credit card payment is allowed.
// * Therefore, all digital products will be passed through this checkout form.

function CheckoutFormStripe({
  handleOpenSnackbar,
  accountId,
  availablePayments,
  hasDigitalProducts,
  handleSelectPaymentMethod,
  selectedPayment,
  siteData,
  shopper,
  applicationFeePenny,
  paymentIntentId,
}) {
  const { businessName, fullDomain, email, logoImage } = siteData;

  const stripe = useStripe();
  const elements = useElements();

  const shopperAccount = useShopperStore((state) => state.shopperAccount);
  const hydrated = useHasHydrated();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [paymentInfoEntered, setPaymentInfoEntered] = useState(false);
  const [billingAddressEntered, setBillingAddressEntered] = useState(false);

  const handlePaymentInfoComplete = (e) => {
    setPaymentInfoEntered(true);
  };

  const handlePaymentInfoIncomplete = (e) => {
    setPaymentInfoEntered(false);
  };

  const handleBillingInfoComplete = (e) => {
    setBillingAddressEntered(true);
  };

  const handleBillingAddressIncomplete = (e) => {
    setBillingAddressEntered(false);
  };

  const router = useRouter();
  const { query, push } = router;
  const { site } = query;
  const subdomain = site + ".boxcart.shop";

  const cartStore = useCartStore((state) => {
    return state.store.find((store) => store.storeName === site);
  });
  const { cart, cartDetails } = cartStore || {};
  const setCartDetails = useCartStore((state) => state.setCartDetails);

  const {
    id,
    customerFName,
    customerLName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    applyFivePercentDiscount,
    totalPenny,
    deliveryFeePenny,
    subtotalPenny,
    taxAndFeesDisplay,
    taxAndFeesPenny,
    taxRate,
    taxRateDisplay,
    taxRateCalculated,
    taxCalculationId,
  } = cartDetails || {};

  const createPaymentIntentTaxTransaction = async (
    paymentIntentId,
    taxCalculationId
  ) => {
    const apiRoute = "/api/public/payment/customer/create-tax-transaction";
    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentIntentId, taxCalculationId }),
    });

    const data = await response.json();

    return data;
  };

  const updatePaymentIntentTaxTransaction = async (
    paymentIntentId,
    taxTransactionObject
  ) => {
    const apiRoute =
      "/api/public/payment/customer/update-payment-intent-tax-transaction";
    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentIntentId, taxTransactionObject }),
    });

    const data = await response.json();

    return data;
  };

  // useEffect(() => {
  //   if (!stripe) {
  //     return;
  //   }

  //   const clientSecret = new URLSearchParams(window.location.search).get(
  //     "payment_intent_client_secret"
  //   );

  //   if (!clientSecret) {
  //     return;
  //   }
  //   setIsPaymentProcessing(true);

  //   stripe
  //     .retrievePaymentIntent(clientSecret)
  //     .then(async ({ paymentIntent }) => {
  //       const {
  //         status,
  //         id: stripeOrderId,
  //         metadata: { tax_calculation },
  //       } = paymentIntent;

  //       const orderData = {
  //         id,
  //         paymentStatus: "paid",
  //         stripeOrderId,
  //       };

  //       switch (status) {
  //         case "succeeded":
  //           await updateOrderPaymentStatus(orderData);

  //           const taxTransactionResponse =
  //             await createPaymentIntentTaxTransaction(
  //               stripeOrderId,
  //               tax_calculation
  //             );

  //           const { error, taxTransactionObject } = taxTransactionResponse;

  //           if (error || !taxTransactionObject) {
  //             handleOpenSnackbar("Error updating tax transaction.");
  //             push(`${window.location.origin}/order-submitted/${id}`);
  //             return;
  //           }

  //           const updatePITaxTransaction =
  //             await updatePaymentIntentTaxTransaction(
  //               paymentIntentId,
  //               taxTransactionObject
  //             );

  //           const { error2, paymentIntentId: stripePaymentIntentId } =
  //             updatePITaxTransaction;

  //           if (error2 || !stripePaymentIntentId) {
  //             handleOpenSnackbar("Error updating tax calculation.");
  //             push(`${window.location.origin}/order-submitted/${id}`);
  //             return;
  //           }

  //           push(`${window.location.origin}/order-submitted/${id}`);

  //           break;
  //         case "processing":
  //           // handleOpenSnackbar("Your payment is processing.");
  //           break;
  //         case "requires_payment_method":
  //           orderData.paymentStatus = "failed";
  //           await updateOrderPaymentStatus(orderData);

  //           handleOpenSnackbar(
  //             "Your payment was not successful, please try again."
  //           );

  //           break;
  //         default:
  //           orderData.paymentStatus = "error";
  //           await updateOrderPaymentStatus(orderData);

  //           handleOpenSnackbar("Something went wrong.");
  //           break;
  //       }
  //       // setIsPaymentProcessing(false);
  //     })
  //     .catch((error) => console.log("error", error));
  // }, [stripe]);

  useEffect(() => {
    if (!shopperAccount) return;

    setCartDetails(site, {
      customerFName: shopperAccount.firstName,
      customerLName: shopperAccount.lastName,
      customerEmail: shopperAccount.email,
    });
  }, [shopperAccount]);

  useEffect(() => {
    if (shopperAccount) return;
    // Initialize cart details in store
    if (!customerFName) {
      setCartDetails(site, { customerFName: "" });
    }

    if (!customerLName) {
      setCartDetails(site, { customerLName: "" });
    }

    if (!customerEmail) {
      setCartDetails(site, { customerEmail: "" });
    }

    if (!customerPhone) {
      setCartDetails(site, { customerPhone: "" });
    }
  }, []);

  const updateOrderPaymentStatus = async (orderData) => {
    const updateOrderAPI = "/api/public/orders/update-payment-status";
    const response = await fetch(updateOrderAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    const { value, error } = data;
    // TODO: if there's an error here, it means that the order was paid for, but paymentStatus could not update. Get interns to code out errorLogs in order to handle this failed update.
  };

  const handleGuestCheckoutTrue = () => {
    setIsGuestCheckout(true);
  };

  const handleGuestCheckoutFalse = () => {
    setIsGuestCheckout(false);
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCartDetails(site, { [name]: value });
  };

  const handleCustomerPhoneChange = (value, country, event, formattedValue) => {
    setCartDetails(site, { customerPhone: formattedValue });
  };

  const handleOpenSignupModal = () => setIsModalOpen(true);
  const handleCloseSignupModal = () => setIsModalOpen(false);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    // if (!shopper && !isGuestCheckout) {
    //   handleOpenSignupModal();
    //   setIsLoading(false);
    //   return;
    // }

    const { allProductIds, allDigitalProductIds } = getAllProductIds();
    const createdOrder = await createOrder();
    const { value: orderData, error } = createdOrder;

    const { id } = orderData;

    if (error) {
      handleOpenSnackbar("Error submitting order. Please try again.");
      setIsLoading(false);
      return;
    }

    chargeCustomer(id);
    createOrderNotification(orderData);
    sendEmailToBusiness(orderData, id);
    createAndSendInvoiceToCustomer(orderData);

    if (allDigitalProductIds && allDigitalProductIds.length > 0) {
      createAndSendDigitalProduct(orderData);
    }
    setCartDetails(site, { id });
  };

  const sendEmailToBusiness = async (orderData) => {
    const orderLink = `boxcart.shop/app/account/orders/live`;

    const emailData = {
      createdAt: orderData.createdAt,
      email,
      businessName,
      customerEmail,
      orderId: orderData.orderId,
      totalDisplay: orderData.totalDisplay,
      totalItemsOrdered: orderData.totalItemsOrdered,
      orderForDateDisplay: orderData.orderForDateDisplay,
      paymentMethod: orderData.paymentMethod,
      customNote: orderData.customNote,
      orderLink,
    };

    sendOrderToBusinessEmail(emailData);
  };

  const createAndSendDigitalProduct = async (orderData) => {
    const data = {
      customerName: customerFName,
      businessName,
      businessEmail: email,
      email: customerEmail,
      shopperEmail: shopper
        ? shopper.email
          ? shopper.email
          : customerEmail
        : customerEmail,
      businessLogo: logoImage,
    };

    sendDigitalProductLinkToCustomer(data);
  };

  const createAndSendInvoiceToCustomer = async (orderData) => {
    const data = {
      ...orderData,
      customerName: customerFName,
      businessName,
      businessEmail: email,
      email: customerEmail,
      businessLogo: logoImage,
    };

    sendOrderInvoiceToCustomer(data);
  };

  const createOrderNotification = async (orderData) => {
    const notifData = buildNotifdata(orderData);
    createNotification(notifData);
  };

  const buildNotifdata = (orderData) => {
    const { id, totalDisplay, orderStatus } = orderData;
    const subdomain = query.site;
    const now = new Date();

    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const dateString = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const dateTimeString = `${dateString} ${timeString}`;

    const notifData = {
      accountId: parseInt(accountId),
      subdomain,
      relatedPostId: id,
      globalNotification: false,
      notificationTypeDisplay: "Order", //true if sent from boxcart
      notificationType: 0, //0: order, 1:review
      notificationTitle: "New Order",
      notificationMessage: `${totalDisplay} - order from ${customerFName}.`,
      createdAt: Timestamp.fromDate(new Date()),
      dateTimeString,
      orderStatus,
    };

    return notifData;
  };

  const chargeCustomer = async (id) => {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
        receipt_email: customerEmail,
      },
      redirect: "if_required",
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      const { type, message } = error;
      const errorData = {
        id,
        type,
        message,
        paymentStatus: "failed",
      };

      if (error.type === "validation_error") {
        await updateOrderPaymentError(errorData);

        handleOpenSnackbar(error.message);
        setIsLoading(false);
        return;
      } else if (error.type === "card_error") {
        const { id: stripeOrderId } = error.payment_intent
          ? error.payment_intent
          : "";

        await updateOrderPaymentError(errorData);
        await updateOrderPaymentStatus({
          id,
          paymentStatus: "failed",
          stripeOrderId,
        });

        handleOpenSnackbar(error.message);
        setIsLoading(false);
        return;
      } else {
        const errorMessage = "An unexpected error occurred.";
        errorData.type = "unknown_error";
        errorData.message = errorMessage;
        await updateOrderPaymentError(errorData);

        handleOpenSnackbar(errorMessage);
        setIsLoading(false);
        return;
      }
    } else if (paymentIntent) {
      const {
        status,
        id: stripeOrderId,
        // metadata: { tax_calculation },
      } = paymentIntent;

      const orderData = {
        id,
        paymentStatus: "paid",
        stripeOrderId,
      };

      const errorData = {
        id,
        type: "",
        message: "",
        paymentStatus: "failed",
      };
      let errorMessage = "";

      switch (status) {
        case "succeeded":
          await updateOrderPaymentStatus(orderData);
          const taxTransactionResponse =
            await createPaymentIntentTaxTransaction(
              stripeOrderId,
              taxCalculationId
            );

          const { error, taxTransactionObject } = taxTransactionResponse;

          if (error || !taxTransactionObject) {
            handleOpenSnackbar("Error updating tax transaction.");
            push(`${window.location.origin}/order-submitted/${id}`);
            return;
          }

          const updatePITaxTransaction =
            await updatePaymentIntentTaxTransaction(
              paymentIntentId,
              taxTransactionObject
            );

          const { error2, paymentIntentId: stripePaymentIntentId } =
            updatePITaxTransaction;

          if (error2 || !stripePaymentIntentId) {
            handleOpenSnackbar("Error updating tax calculation.");
            push(`${window.location.origin}/order-submitted/${id}`);
            return;
          }

          push(`${window.location.origin}/${site}/order-submitted/${id}`);

          break;
        case "processing":
          break;
        case "requires_payment_method":
          orderData.paymentStatus = "failed";
          errorMessage = "Your payment was not successful, please try again.";
          errorData.message = errorMessage;

          await updateOrderPaymentStatus(orderData);
          await updateOrderPaymentError(errorData);

          handleOpenSnackbar(errorMessage);
          setIsLoading(false);
          break;
        default:
          orderData.paymentStatus = "error";
          errorMessage = "Something went wrong. Try again later.";
          errorData.message = errorMessage;

          await updateOrderPaymentStatus(orderData);
          await updateOrderPaymentError(errorData);

          handleOpenSnackbar(errorMessage);
          setIsLoading(false);
          break;
      }

      return;
    } else {
      const errorMessage = "An unexpected error occurred.";
      const errorData = {
        id,
        type: "unknown_error",
        message: errorMessage,
        paymentStatus: "failed",
      };
      await updateOrderPaymentError(errorData);

      handleOpenSnackbar(errorMessage);
      setIsLoading(false);
      return;
    }
  };

  const updateOrderPaymentError = async (errorData) => {
    const updateOrderPaymentErrorAPI =
      "/api/public/payment/customer/validation-error";

    const response = await fetch(updateOrderPaymentErrorAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorData),
    });

    const data = await response.json();
    const { value, error } = data;
    // TODO: Get interns to code errorLog
  };

  const getAllProductIds = () => {
    const allProductIds = [];
    const allDigitalProductIds = [];
    cart.forEach((product) => {
      const { productId, productType } = product;
      const id = parseInt(productId);

      if (productType === 0 && !allProductIds.includes(id)) {
        allProductIds.push({ id });
      }

      if (productType === 1 && !allDigitalProductIds.includes(id)) {
        allDigitalProductIds.push({ id });
      }
    });
    return { allProductIds, allDigitalProductIds };
  };

  const calculateFirstTimeShopperCredit = (totalPenny) => {
    // Convert dollars to pennies and calculate 5%
    var fivePercentInPennies = Math.round(totalPenny * 0.05);

    // Return the result in pennies
    return fivePercentInPennies;
  };

  const updateShopperAccountCredit = async (
    shopperCreditData,
    customerEmail
  ) => {
    const apiRoute = "/api/public/user/shopper/update-credit";
    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shopperCreditData, email: customerEmail }),
    });

    if (!response.ok) {
      // todo: error log
      return;
    }

    return await response.json();
  };

  const createOrder = async () => {
    const orderDetailsData = buildOrderData();
    const { allProductIds, allDigitalProductIds } = getAllProductIds();
    const { orderId } = orderDetailsData;
    const structuredOrderData = await buildOrderItems(orderId); //returns array of items
    const emailToUse = shopper
      ? shopper.email
        ? shopper.email
        : customerEmail
      : customerEmail;

    const { user, success, error } = await checkIfUserEmailInUse(emailToUse);
    let shopperAccountId;

    if (!success || error) {
      // todo: log error - guest checkout and error locating user email
    }

    if (user && user.shopperAccount) {
      const { shopperAccount } = user;

      const { id, email: shopperAccountEmail } = shopperAccount;
      shopperAccountId = parseInt(id);

      if (applyFivePercentDiscount) {
        const creditInPennies = calculateFirstTimeShopperCredit(totalPenny);
        const shopperCreditData = {
          credit: {
            increment: creditInPennies,
          },
          totalSaved: {
            increment: creditInPennies,
          },
        };

        const updateShopperCredit = await updateShopperAccountCredit(
          shopperCreditData,
          shopperAccountEmail
        );
      }
    }

    const customerData = buildCustomerData(shopperAccountId, emailToUse);

    const {
      orderItems,
      totalItemsOrdered,
      productQuantitiesToUpdate,
      optionQuantitiesToUpdate,
    } = structuredOrderData;
    orderDetailsData.totalItemsOrdered = totalItemsOrdered;

    if (!structuredOrderData) {
      handleOpenSnackbar("Error uploading images.");
      return;
    }

    const order = {
      ...orderDetailsData,
      orderItems: { create: orderItems.map((item) => item) },
      customer: {
        connectOrCreate: {
          where: { email: customerEmail },
          create: customerData,
        },
      },
      account: {
        connect: {
          id: parseInt(accountId),
        },
      },
      products: {
        connect: allProductIds,
      },
      digitalProduct: {
        connect: allDigitalProductIds,
      },
      shopperAccount: shopperAccountId && {
        connect: {
          id: shopperAccountId,
        },
      },
    };

    const orderResponse = await fetch("/api/public/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order,
        productQuantitiesToUpdate,
        optionQuantitiesToUpdate,
      }),
    });

    if (!orderResponse.ok) {
      handleOpenSnackbar("Error submitting order.");
      return;
    }

    const orderResponseData = await orderResponse.json();

    return orderResponseData;
  };

  const buildCustomerData = (shopperAccountId, emailToUse) => {
    const customerName = `${customerFName} ${customerLName}`;

    const customerData = {
      name: customerName,
      fName: customerFName,
      lName: customerLName,
      email: emailToUse,
      phoneNum: customerPhone,
      deliveryAddress,
      account: {
        connect: {
          id: parseInt(accountId),
        },
      },
      shopperAccount: shopperAccountId && {
        connect: {
          id: shopperAccountId,
        },
      },
    };

    return customerData;
  };

  const buildOrderData = () => {
    const isDigitalProduct = (product) => product.productType === 1;
    const allDigitalProducts = cart.every(isDigitalProduct);

    const {
      deliveryAddress,
      pickupAddress,
      orderForDateDisplay,
      orderForTimeDisplay,
      requireOrderTime,
      requireOrderDate,
      fulfillmentType,
      fulfillmentDisplay,
      salesTaxDisplay,
      salesTaxPenny,
      stripeTaxFeePenny,
      stripeTaxFeeDisplay,
      subtotalPenny,
      subtotalDisplay,
      taxAndFeesPenny,
      taxAndFeesDisplay,
      deliveryFeePenny,
      deliveryFeeDisplay,
      totalPenny,
      totalDisplay,
      pickupNote,
    } = cartDetails;

    // const orderStatus = "pending";
    const orderForDate = requireOrderDate
      ? new Date(orderForDateDisplay).getTime().toString()
      : null;
    const orderTime = `${orderForDateDisplay} ${orderForTimeDisplay}`;
    const orderForTime = requireOrderTime
      ? new Date(orderTime).getTime().toString()
      : null;
    const paymentMethod = "card";
    const paymentStatus = "processing";
    const stripeFeesPenny = calculateAmountMinusStripeFee(totalPenny);
    const stripeFeesDisplay = `$${(stripeFeesPenny / 100).toFixed(2)}`;
    const totalAfterStripeFeesPenny = totalPenny - stripeFeesPenny;
    const totalAfterStripeFeesDisplay = `$${(
      totalAfterStripeFeesPenny / 100
    ).toFixed(2)}`;
    const applicationFee =
      applicationFeePenny + stripeFeesPenny + taxAndFeesPenny;
    const applicationFeeDisplay = `$${(applicationFee / 100).toFixed(2)}`;
    const totalAfterAllFeesPenny = totalPenny - applicationFee;
    const totalAfterAllFeesDisplay = `$${(totalAfterAllFeesPenny / 100).toFixed(
      2
    )}`;

    const orderDetailsData = {
      orderId: nanoid(),
      deliveryAddress,
      pickupAddress,
      orderForDate, // epoch time of date
      orderForDateDisplay,
      orderForTime, // epoch time of exact order for time
      orderForTimeDisplay,
      requireOrderTime,
      requireOrderDate,
      fulfillmentType: allDigitalProducts ? 2 : fulfillmentType,
      fulfillmentDisplay: allDigitalProducts ? "download" : fulfillmentDisplay,
      salesTaxDisplay,
      salesTaxPenny,
      stripeTaxFeePenny,
      stripeTaxFeeDisplay,
      subtotalPenny,
      subtotalDisplay,
      cardFeePenny: stripeFeesPenny,
      cardFeeDisplay: stripeFeesDisplay,
      applicationFeePenny: applicationFee,
      applicationFeeDisplay,
      taxAndFeesPenny,
      taxAndFeesDisplay,
      deliveryFeePenny,
      deliveryFeeDisplay,
      totalPenny,
      totalDisplay,
      totalAfterStripeFeesPenny,
      totalAfterStripeFeesDisplay,
      totalAfterAllFeesPenny,
      totalAfterAllFeesDisplay,
      paymentMethod,
      orderStatus: allDigitalProducts ? "completed" : "pending",
      paymentStatus,
      pickupNote,
    };

    return orderDetailsData;
  };

  const buildOrderItems = async (orderId) => {
    let totalItemsOrdered = 0;
    let orderItems = [];
    let productQuantitiesToUpdate = [];
    let optionQuantitiesToUpdate = [];

    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i];
      const {
        quantity,
        customNote,
        pricePenny,
        priceDisplay,
        productName,
        productId,
        orderExampleImages,
        orderOptionGroups,
        orderQuestionsAnswers,
        defaultImage,
        hasUnlimitedQuantity,
        setQuantityByProduct,
        productType,
      } = cartItem;

      totalItemsOrdered += quantity;

      if (productType === 0) {
        if (!hasUnlimitedQuantity && setQuantityByProduct) {
          const data = {
            quantity,
            productId,
          };

          productQuantitiesToUpdate.push(data);
        }

        if (!hasUnlimitedQuantity && !setQuantityByProduct) {
          for (let j = 0; j < orderOptionGroups.length; j++) {
            const currOptionGroup = orderOptionGroups[j];
            const { options } = currOptionGroup;

            for (let k = 0; k < options.length; k++) {
              const currOption = options[k];
              const { optionId } = currOption;
              if (!optionId) continue;

              const parseIntOptionId = parseInt(optionId);
              const data = {
                quantity,
                optionId: parseIntOptionId,
              };

              optionQuantitiesToUpdate.push(data);
            }
          }
        }

        const exampleImages = [];
        const fireStorageId = nanoid();
        let errorUploadingImages = false;

        for (let j = 0; j < orderExampleImages.length; j++) {
          const imageObj = orderExampleImages[j];
          const { imgUrl, imageFile, fileName } = imageObj;
          let image = null;

          const photoStorageRef = ref(
            storage,
            `account/${subdomain}/orders/${orderId}/orderItems/exampleImages/${fireStorageId}/${fileName}`
          );

          try {
            await uploadBytes(photoStorageRef, imageFile);
          } catch (error) {
            console.log("error", error);
            errorUploadingImages = true;
            return;
          }

          try {
            image = await getDownloadURL(photoStorageRef);
          } catch (error) {
            console.log("error", error);
            errorUploadingImages = true;
            return;
          }

          if (!image) return;

          const data = {
            image,
            fireStorageId,
            fileName,
          };

          exampleImages.push(data);
        }

        if (errorUploadingImages) {
          return null;
        }

        const cartData = {
          customNote,
          pricePenny,
          priceDisplay,
          productName,
          quantity,
          productImage: defaultImage,
          hasUnlimitedQuantity,
          setQuantityByProduct,
          product: {
            connect: {
              id: productId,
            },
          },
          orderExampleImages: {
            create: exampleImages.map((item) => item),
          },
          orderOptionGroups: {
            create: orderOptionGroups.map((item) => {
              const { optionsDisplay, options, optionGroupName } = item;

              const optionGroupData = {
                optionsDisplay,
                optionGroupName,
                orderOptions: {
                  create: options.map((optionItem) => {
                    const { optionName, optionQuantity, price, pricePenny } =
                      optionItem;

                    const quantity = optionQuantity
                      ? parseInt(optionQuantity)
                      : null;

                    const optionData = {
                      optionName,
                      optionPrice: pricePenny,
                      optionPriceDisplay: price,
                      optionQuantity: quantity,
                    };

                    return optionData;
                  }),
                },
              };

              return optionGroupData;
            }),
          },
          orderQuestionsAnswers: {
            create: orderQuestionsAnswers.map((item) => {
              const { question, answer } = item;
              const data = {
                question,
                answer,
              };

              return data;
            }),
          },
        };

        orderItems.push(cartData);
      }

      if (productType === 1) {
        //digital products
        const data = {
          pricePenny,
          priceDisplay,
          productName,
          quantity,
          productType,
          productImage: defaultImage,
          hasUnlimitedQuantity: true,
          digitalProduct: {
            connect: {
              id: productId,
            },
          },
        };

        orderItems.push(data);
      }
    }

    return {
      orderItems,
      totalItemsOrdered,
      productQuantitiesToUpdate,
      optionQuantitiesToUpdate,
    };
  };

  const handlePaymentChange = (event) => {
    if (event.complete) {
      if (!paymentInfoEntered) {
        handlePaymentInfoComplete();
      }
      return;
    }

    if (paymentInfoEntered) {
      handlePaymentInfoIncomplete();
    }
  };

  const handleAddressChange = async (event) => {
    if (event.complete) {
      if (!billingAddressEntered) {
        handleBillingInfoComplete();
      }

      const { address: billingAddress } = event.value;

      if (!taxRateCalculated) {
        const { error, salesTaxObject } = await calculateSalesTax(
          billingAddress,
          cart,
          deliveryFeePenny
        );

        if (error || !salesTaxObject) {
          handleOpenSnackbar(
            "Error calculating sales tax. Refresh and try again."
          );
          return;
        }

        const { total, taxAndFees } = updateCartDetailsStore(salesTaxObject);

        const {
          paymentIntentId: updatedPaymentIntentId,
          clientSecret,
          error: updatePaymentIntentError,
        } = await updatePaymentIntentTaxCalculation(
          paymentIntentId,
          salesTaxObject,
          total,
          taxAndFees,
          applicationFeePenny
        );

        if (updatePaymentIntentError) {
          handleOpenSnackbar(
            "Error calculating sales tax. Refresh and try again."
          );
          return;
        }
      }

      return;
    }

    if (billingAddressEntered) {
      handleBillingAddressIncomplete();
    }
  };

  const updatePaymentIntentTaxCalculation = async (
    paymentIntentId,
    salesTaxObject,
    total,
    taxAndFees,
    applicationFeePenny
  ) => {
    const { id } = salesTaxObject;
    const apiRoute =
      "/api/public/payment/customer/update-payment-intent-tax-calculation";

    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentIntentId,
        taxCalcId: id,
        total,
        taxAndFees,
        applicationFeePenny,
      }),
    });
    const data = await response.json();
    return data;
  };

  const updateCartDetailsStore = (salesTaxObject) => {
    const salesTaxPenny =
      salesTaxObject.tax_amount_exclusive + salesTaxObject.tax_amount_inclusive;
    const salesTaxDisplay = `$${(salesTaxPenny / 100).toFixed(2)}`;
    const stripeTaxFeePenny = 60;
    const stripeTaxFeeDisplay = `$${(stripeTaxFeePenny / 100).toFixed(2)}`;

    const taxAndFeesPenny = salesTaxPenny + stripeTaxFeePenny;
    const taxAndFeesDisplay = `$${(taxAndFeesPenny / 100).toFixed(2)}`;

    const total = subtotalPenny + taxAndFeesPenny + deliveryFeePenny;
    const totalDisplay = `$${(total / 100).toFixed(2)}`;

    setCartDetails(site, {
      taxCalculationId: salesTaxObject.id,
      taxRateCalculated: true,
      salesTaxPenny,
      salesTaxDisplay,
      stripeTaxFeePenny,
      stripeTaxFeeDisplay,
      taxAndFeesPenny,
      taxAndFeesDisplay,
      totalPenny: total,
      totalDisplay,
    });

    return { total, taxAndFees: taxAndFeesPenny };
  };

  const calculateSalesTax = async (billingAddress, cart, deliveryFeePenny) => {
    // billing address is an object, help me pass it to the backend via the apiRoute as params
    const apiRoute = "/api/public/payment/customer/calculate-sales-tax";
    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ billingAddress, cart, deliveryFeePenny }),
    });
    const data = await response.json();

    return data;
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  if (isPaymentProcessing)
    return (
      <div className="flex flex-col justify-center items-center mt-40 gap-6">
        <BoxLoader />
        <p>Payment processing...</p>
      </div>
    );

  return (
    <React.Fragment>
      <SignupPrompt
        isModalOpen={isModalOpen}
        handleClose={handleCloseSignupModal}
        handleGuestCheckoutTrue={handleGuestCheckoutTrue}
        handleGuestCheckoutFalse={handleGuestCheckoutFalse}
        isGuestCheckout={isGuestCheckout}
        cartDetails={cartDetails}
      />
      <form
        onSubmit={handleSubmitOrder}
        className="flex flex-col gap-1 pb-28 lg:flex-row lg:mt-8 lg:mx-[7rem] lg:gap-4 xl:mx-[14rem]"
      >
        {hydrated && (
          <div className="lg:w-2/3">
            <div className="px-4 py-6 gap-2 flex flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0 lg:mt-0">
              <h3 className="font-medium">Your information:</h3>
              <div className="lg:px-12">
                <div className="flex w-full gap-2">
                  <TextField
                    id="first-name"
                    label="First name"
                    size="small"
                    fullWidth
                    required
                    color="warning"
                    value={customerFName}
                    name="customerFName"
                    onChange={handleCustomerInfoChange}
                  />
                  <TextField
                    id="last-name"
                    label="Last name"
                    size="small"
                    required
                    fullWidth
                    color="warning"
                    value={customerLName}
                    name="customerLName"
                    onChange={handleCustomerInfoChange}
                  />
                </div>
                <TextField
                  id="email"
                  label="Email"
                  size="small"
                  required
                  type="email"
                  fullWidth
                  value={customerEmail}
                  name="customerEmail"
                  color="warning"
                  sx={{ marginTop: "1rem" }}
                  onChange={handleCustomerInfoChange}
                />
                <PhoneInput
                  id="phone-input"
                  country={"us"}
                  value={customerPhone}
                  name="customerPhone"
                  onChange={handleCustomerPhoneChange}
                  className="mt-4 w-full focus:ring-1"
                  inputClass="p-5"
                  inputStyle={{ width: "100%" }}
                />
                <label htmlFor="phone-input" className="text-xs">
                  Recommended | Optional
                </label>
              </div>
            </div>
            <div className="flex gap-4 mb-4 px-4 flex-wrap md:px-16 lg:p-0">
              {availablePayments.map((payment) => {
                if (!hasDigitalProducts)
                  return (
                    <PaymentOption
                      payment={payment}
                      key={payment.id}
                      handleSelectPaymentMethod={handleSelectPaymentMethod}
                      selectedPayment={selectedPayment}
                    />
                  );

                if (payment.id === "card")
                  return (
                    <PaymentOption
                      payment={payment}
                      key={payment.id}
                      handleSelectPaymentMethod={handleSelectPaymentMethod}
                      selectedPayment={selectedPayment}
                    />
                  );
              })}
            </div>

            <div className="px-4 py-6 gap-2 flex border-t-2 flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0  lg:mt-0">
              <h3 className="font-medium">Payment:</h3>
              <div className="lg:px-12">
                <PaymentElement
                  onChange={handlePaymentChange}
                  id="payment-element"
                  options={paymentElementOptions}
                />
              </div>
            </div>
            <div className="px-4 py-6 gap-2 flex border-t-2 flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0  lg:mt-0">
              <h3 className="font-medium">Billing information:</h3>
              <div className="lg:px-12">
                <AddressElement
                  onChange={handleAddressChange}
                  id="address-element"
                  options={{ mode: "billing" }}
                />
              </div>
            </div>
            {/* <div className="px-4 py-6 gap-2 border-t-2 flex flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0  lg:mt-0">
            <BillingAddress
              billingAddressValues={billingAddressValues}
              handleCustomerBillingAddressChange={
                handleCustomerBillingAddressChange
              }
            />
          </div> */}
          </div>
        )}

        <div className="relative lg:flex-grow">
          <div className="bg-white border-t-2 px-4 md:border md:round md:mx-16 lg:mx-0">
            <OrderReview />
          </div>

          <div className="bg-white border-t-2 px-4 md:border md:round md:my-4 md:mx-16 lg:mx-0">
            <OrderSubtotal isInCart={false} />
          </div>
          <div className="fixed bottom-0 w-full p-4 bg-white border-t border-[color:var(--gray-light-med)] lg:relative lg:border">
            <button
              type="submit"
              disabled={
                isLoading ||
                !stripe ||
                !elements ||
                !customerFName ||
                !customerLName ||
                !customerEmail ||
                !paymentInfoEntered ||
                !billingAddressEntered
              }
              className={`text-white font-extralight py-2 w-full   active:bg-black ${
                isLoading ||
                !stripe ||
                !elements ||
                !customerFName ||
                !customerLName ||
                !customerEmail ||
                !paymentInfoEntered ||
                !billingAddressEntered
                  ? "bg-gray-300 hover:text-gray-300"
                  : "bg-[color:var(--black-design-extralight)]"
              }`}
            >
              {isLoading ? (
                <div className="flex justify-center gap-4 items-center">
                  <CircularProgress sx={{ color: "white" }} size="1rem" />
                  Submitting order...
                </div>
              ) : !stripe || !elements ? (
                "Please wait..."
              ) : (
                "Submit Order"
              )}
            </button>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
}

export default CheckoutFormStripe;
