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
import PaymentOption from "./PaymentOption";
import PaymentNotes from "./PaymentNotes";
import { Timestamp } from "firebase/firestore";
import { createNotification } from "@/helper/client/api/notifications";
import {
  sendOrderInvoiceToCustomer,
  sendOrderToBusinessEmail,
} from "@/helper/client/api/sendgrid/email";
import CredentialsModal from "@/components/user/auth/CredentialsModal";
import SignupPrompt from "@/components/user/auth/checkout/SignupPrompt";
import { checkIfUserEmailInUse } from "@/helper/client/api/user";

// * This form is only for all physical products.
// * Digital products are handled by CheckoutFormStripe.

function CheckoutForm({
  handleOpenSnackbar,
  accountId,
  availablePayments,
  handleSelectPaymentMethod,
  selectedPayment,
  selectedPaymentDetails,
  siteData,
  shopper,
}) {
  const { businessName, fullDomain, email, logoImage } = siteData;

  const setCartDetails = useCartStore((state) => state.setCartDetails);
  const cartDetails = useCartStore((state) => state.cartDetails);
  const cart = useCartStore((state) => state.cart);
  const shopperAccount = useShopperStore((state) => state.shopperAccount);
  const hydrated = useHasHydrated();

  const {
    id,
    customerFName,
    customerLName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    paymentMethod,
    applyFivePercentDiscount,
    totalPenny,
  } = cartDetails;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);

  const router = useRouter();
  const { query, push } = router;
  const { site } = query;
  const subdomain = site + ".boxcart.shop";

  useEffect(() => {
    if (!shopperAccount) return;

    setCartDetails({
      customerFName: shopperAccount.firstName,
      customerLName: shopperAccount.lastName,
      customerEmail: shopperAccount.email,
    });
  }, [shopperAccount]);

  useEffect(() => {
    if (shopperAccount) return;
    // Initialize cart details in store
    if (!customerFName) {
      setCartDetails({ customerFName: "" });
    }

    if (!customerLName) {
      setCartDetails({ customerLName: "" });
    }

    if (!customerEmail) {
      setCartDetails({ customerEmail: "" });
    }

    if (!customerPhone) {
      setCartDetails({ customerPhone: "" });
    }
  }, []);

  const handleGuestCheckoutTrue = () => {
    setIsGuestCheckout(true);
  };

  const handleGuestCheckoutFalse = () => {
    setIsGuestCheckout(false);
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCartDetails({ [name]: value });
  };

  const handleCustomerPhoneChange = (value, country, event, formattedValue) => {
    setCartDetails({ customerPhone: formattedValue });
  };

  const handleOpenSignupModal = () => setIsModalOpen(true);
  const handleCloseSignupModal = () => setIsModalOpen(false);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    if (!shopper && !isGuestCheckout) {
      handleOpenSignupModal();
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

    createOrderNotification(orderData);
    sendEmailToBusiness(orderData, id);
    createAndSendInvoiceToCustomer(orderData);
    setCartDetails({ id });
    push(`/${site}/order-submitted/${id}`);
  };

  const calculateFirstTimeShopperCredit = (totalPenny) => {
    // Convert dollars to pennies and calculate 5%
    var fivePercentInPennies = Math.round(totalPenny * 0.05);

    // Return the result in pennies
    return fivePercentInPennies;
  };

  const sendEmailToBusiness = async (orderData) => {
    const orderLink = `boxcart.shop/app/account/orders/live`;

    const emailData = {
      ...orderData,
      email,
      businessName,
      customerEmail,
      orderLink,
    };

    sendOrderToBusinessEmail(emailData);
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
      notificationTypeDisplay: "Order",
      notificationType: 0,
      notificationTitle: "New Order",
      notificationMessage: `${totalDisplay} - order from ${customerFName}.`,
      createdAt: Timestamp.fromDate(new Date()),
      dateTimeString,
      orderStatus,
    };

    return notifData;
  };

  const getAllProductIds = () => {
    const allProductIds = [];
    cart.forEach((product) => {
      const id = parseInt(product.productId);

      if (!allProductIds.includes(id)) {
        allProductIds.push({ id });
      }
    });
    return allProductIds;
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
    const allProductIds = getAllProductIds();
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
      email: customerEmail,
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
    const {
      deliveryAddress,
      pickupAddress,
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
      pickupNote,
      applyFivePercentDiscount,
    } = cartDetails;

    // const orderStatus = "pending";
    const orderForDate = requireOrderDate
      ? new Date(orderForDateDisplay).getTime().toString()
      : null;
    const orderTime = `${orderForDateDisplay} ${orderForTimeDisplay}`;
    const orderForTime = requireOrderTime
      ? new Date(orderTime).getTime().toString()
      : null;
    const paymentStatus = "unpaid";
    const paymentAccount = selectedPaymentDetails.paymentAccount;
    const paymentInstructions = selectedPaymentDetails.paymentInstructions;

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
      paymentStatus,
      paymentMethod,
      paymentAccount,
      paymentInstructions,
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

  if (!hydrated) return null;

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
                  id="customerEmail"
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
                const { charged_enabled, paymentMethod } = payment;

                if (paymentMethod === "stripe" && !charged_enabled) return null;

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
              <PaymentNotes selectedPaymentDetails={selectedPaymentDetails} />
            </div>
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
              disabled={isLoading}
              className="text-white font-extralight py-2 w-full  bg-[color:var(--black-design-extralight)] active:bg-black"
            >
              {isLoading ? (
                <div className="flex justify-center gap-4 items-center">
                  <CircularProgress sx={{ color: "white" }} size="1rem" />
                  Submitting order...
                </div>
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

export default CheckoutForm;
