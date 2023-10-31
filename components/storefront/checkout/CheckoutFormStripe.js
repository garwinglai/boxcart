import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import OrderReview from "@/components/storefront/cart/OrderReview";
import OrderSubtotal from "@/components/storefront/cart/OrderSubtotal";
import { useCartStore } from "@/lib/store";
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

function CheckoutFormStripe({
  handleOpenSnackbar,
  accountId,
  availablePayments,
  handleSelectPaymentMethod,
  selectedPayment,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const setCartDetails = useCartStore((state) => state.setCartDetails);
  const cartDetails = useCartStore((state) => state.cartDetails);
  const cart = useCartStore((state) => state.cart);
  const hydrated = useHasHydrated();

  const {
    id,
    customerFName,
    customerLName,
    customerEmail,
    customerPhone,
    deliveryAddress,
  } = cartDetails;

  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const router = useRouter();
  const { query, push } = router;
  const subdomain = query.site + ".boxcart.shop";

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
    setIsPaymentProcessing(true);

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(async ({ paymentIntent }) => {
        const { status, id: stripeOrderId } = paymentIntent;

        const orderData = {
          id,
          paymentStatus: "paid",
          stripeOrderId,
        };

        switch (status) {
          case "succeeded":
            await updateOrderPaymentStatus(orderData);
            push(`${window.location.origin}/order-submitted/${id}`);

            break;
          case "processing":
            // handleOpenSnackbar("Your payment is processing.");
            break;
          case "requires_payment_method":
            orderData.paymentStatus = "failed";
            await updateOrderPaymentStatus(orderData);

            handleOpenSnackbar(
              "Your payment was not successful, please try again."
            );

            break;
          default:
            orderData.paymentStatus = "error";
            await updateOrderPaymentStatus(orderData);

            handleOpenSnackbar("Something went wrong.");
            break;
        }
        setIsPaymentProcessing(false);
      });
  }, [stripe]);

  const updateOrderPaymentStatus = async (orderData) => {
    const updateOrderAPI = "/api/public/orders/updatePaymentStatus";
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

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCartDetails({ [name]: value });
  };

  const handleCustomerPhoneChange = (value, country, event, formattedValue) => {
    setCartDetails({ customerPhone: formattedValue });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const createdOrder = await createOrder();
    const { value: orderData, error } = createdOrder;
    const { id } = orderData;

    if (error) {
      handleOpenSnackbar("Error submitting order. Please try again.");
      setIsLoading(false);
      return;
    }

    setCartDetails({ id });
    chargeCustomer(id);
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
      const { status, id: stripeOrderId } = paymentIntent;

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
          push(`${window.location.origin}/order-submitted/${id}`);

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

  const createOrder = async () => {
    const orderDetailsData = buildOrderData();
    const customerData = buildCustomerData();
    const { orderId } = orderDetailsData;
    const structuredOrderData = await buildOrderItems(orderId); //returns array of items
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

  const buildCustomerData = () => {
    const customerName = `${customerFName} ${customerLName}`;

    const customerData = {
      name: customerName,
      fName: customerFName,
      lName: customerLName,
      email: customerEmail,
      phoneNum: customerPhone,
      deliveryAddress,
      account: {
        connect: {
          id: parseInt(accountId),
        },
      },
    };

    return customerData;
  };

  const buildOrderData = () => {
    const {
      deliveryAddress,
      orderForDateDisplay,
      orderForTimeDisplay,
      requireOrderTime,
      requireOrderDate,
      fulfillmentType,
      fulfillmentDisplay,
      subtotalPenny,
      subtotalDisplay,
      taxRate,
      taxRateDisplay,
      taxAndFeesPenny,
      taxAndFeesDisplay,
      deliveryFeePenny,
      deliveryFeeDisplay,
      totalPenny,
      totalDisplay,
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

    const orderDetailsData = {
      orderId: nanoid(),
      deliveryAddress,
      orderForDate, // epoch time of date
      orderForDateDisplay,
      orderForTime, // epoch time of exact order for time
      orderForTimeDisplay,
      requireOrderTime,
      requireOrderDate,
      fulfillmentType,
      fulfillmentDisplay,
      subtotalPenny,
      subtotalDisplay,
      taxRate,
      taxRateDisplay,
      cardFeePenny: stripeFeesPenny,
      cardFeeDisplay: stripeFeesDisplay,
      taxAndFeesPenny,
      taxAndFeesDisplay,
      deliveryFeePenny,
      deliveryFeeDisplay,
      totalPenny,
      totalDisplay,
      totalAfterStripeFeesPenny,
      totalAfterStripeFeesDisplay,
      paymentMethod,
      paymentStatus,
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
      } = cartItem;

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

      totalItemsOrdered += quantity;

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
        productId,
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

    return {
      orderItems,
      totalItemsOrdered,
      productQuantitiesToUpdate,
      optionQuantitiesToUpdate,
    };
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
                id="payment-element"
                options={paymentElementOptions}
              />
            </div>
          </div>
          <div className="px-4 py-6 gap-2 flex border-t-2 flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0  lg:mt-0">
            <h3 className="font-medium">Billing Address:</h3>
            <div className="lg:px-12">
              <AddressElement
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
        <div className="bg-white border-t-2 md:border md:round md:mx-16 lg:mx-0">
          <OrderReview />
        </div>

        <div className="bg-white border-t-2 md:border md:round md:my-4 md:mx-16 lg:mx-0">
          <OrderSubtotal isInCart={false} />
        </div>
        <div className="fixed bottom-0 w-full p-4 bg-white border-t border-[color:var(--gray-light-med)] lg:relative lg:border">
          <button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="text-white font-extralight py-2 w-full  bg-[color:var(--black-design-extralight)] active:bg-black"
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
  );
}

export default CheckoutFormStripe;
