import React, { useState } from "react";
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
import PaymentOption from "./PaymentOption";
import PaymentNotes from "./PaymentNotes";
import { Timestamp } from "firebase/firestore";
import { createNotification } from "@/helper/client/api/notifications";
import { sendOrderDetailsEmail } from "@/helper/client/api/sendgrid/email";

function CheckoutForm({
  handleOpenSnackbar,
  accountId,
  availablePayments,
  handleSelectPaymentMethod,
  selectedPayment,
  selectedPaymentDetails,
  siteData,
}) {
  const { businessName } = siteData;

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
    paymentMethod,
  } = cartDetails;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { query, push } = router;
  const subdomain = query.site + ".boxcart.shop";

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

    const createdOrder = await createOrder();
    const { value: orderData, error } = createdOrder;
    const { id } = orderData;

    if (error) {
      handleOpenSnackbar("Error submitting order. Please try again.");
      setIsLoading(false);
      return;
    }

    createOrderNotification(orderData);
    createAndSendOrderEmail(orderData);
    setCartDetails({ id });
    push(`/order-submitted/${id}`);
  };

  const createAndSendOrderEmail = async (orderData) => {
    const data = {
      ...orderData,
      customerName: customerFName,
      shopName: businessName,
      email: customerEmail
    };

    sendOrderDetailsEmail(data);
  };

  const createOrderNotification = async (orderData) => {
    const notifData = buildNotifdata(orderData);
    createNotification(notifData);
  };

  const buildNotifdata = (orderData) => {
    const { id, totalDisplay } = orderData;
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
    };

    return notifData;
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
  );
}

export default CheckoutForm;
