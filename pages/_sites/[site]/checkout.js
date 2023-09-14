import React, { useState, useEffect } from "react";
import { Divider, IconButton } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import OrderReview from "@/components/storefront/cart/OrderReview";
import OrderSubtotal from "@/components/storefront/cart/OrderSubtotal";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ButtonPrimaryStorefront from "@/components/global/buttons/ButtonPrimaryStorefront";
import TipComponent from "@/components/storefront/cart/TipComponent";
import { useCartStore } from "@/lib/store";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useHasHydrated } from "@/utils/useHasHydrated";
import PaymentComponent from "@/components/storefront/cart/PaymentComponent";
import BillingAddress from "@/components/global/designs/BillingAddress";
import { nanoid } from "nanoid";
import { storage } from "@/firebase/fireConfig";
import {
  deleteObject,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { getLocalStorage } from "@/utils/clientStorage";

function Checkout() {
  const setCartDetails = useCartStore((state) => state.setCartDetails);
  const cartDetails = useCartStore((state) => state.cartDetails);
  const cart = useCartStore((state) => state.cart);
  const removeCart = useCartStore((state) => state.removeCart);
  const removeCartDetails = useCartStore((state) => state.removeCartDetails);
  const hydrated = useHasHydrated();

  const {
    tipsEnabled,
    customerFName,
    customerLName,
    customerEmail,
    customerPhone,
  } = cartDetails;

  const [paymentValues, setPaymentValues] = useState({
    nameOnCard: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
    zip: "",
  });
  const [billingAddressValues, setBillingAddressValues] = useState({
    fullAddress: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarValues, setSnackbarValues] = useState({
    isOpenSnackbar: false,
    snackbarMessage: "",
  });
  const [accountId, setAccountId] = useState("");

  const { isOpenSnackbar, snackbarMessage } = snackbarValues;
  const router = useRouter();
  const { pathname, query, push } = router;
  const subdomain = query.site + ".boxcart.shop";

  useEffect(() => {
    const cartLength = cart.length;

    if (cartLength === 0) {
      router.push("/");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const accountId = getLocalStorage("accountId");
    if (!accountId) push("/");

    setAccountId(accountId);
  }, []);

  const handleBack = (e) => {
    push("/");
  };

  const handleOpenSnackbar = (message) => {
    setSnackbarValues({ isOpenSnackbar: true, snackbarMessage: message });
  };

  const handleCloseSnackbar = () => {
    setSnackbarValues({ isOpenSnackbar: false, snackbarMessage: "" });
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCartDetails({ [name]: value });
  };

  const handleCustomerPhoneChange = (value, country, event, formattedValue) => {
    setCartDetails({ customerPhone: formattedValue });
  };

  const handleCustomerPaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerBillingAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddressValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    if (isLoading) return;

    e.preventDefault();
    setIsLoading(true);
    const orderDetailsData = structureOrderDetailsData();

    const { orderId } = orderDetailsData;
    const structuredOrderData = await structureOrderItems(orderId); //returns array of items
    const { orderItems, totalItems } = structuredOrderData;
    orderDetailsData.totalItems = totalItems;

    if (!structuredOrderData) {
      handleOpenSnackbar("Error uploading images.");
      return;
    }

    const order = {
      ...orderDetailsData,
      orderItems: { create: orderItems.map((item) => item) },
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
      body: JSON.stringify({ order }),
    });

    if (!orderResponse.ok) {
      handleOpenSnackbar("Error submitting order.");
      return;
    }

    const orderResponseData = await orderResponse.json();
    const { value: orderData, error } = orderResponseData;
    const { orderId: submittedOrderId } = orderData;

    removeCart();
    removeCartDetails();

    router.push(`/order-submitted/${submittedOrderId}`);
    setIsLoading(false);
  };

  const structureOrderDetailsData = () => {
    const {
      customerFName,
      customerLName,
      customerEmail,
      customerPhone,
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
      cardFeePenny,
      cardFeeDisplay,
      taxAndFeesPenny,
      taxAndFeesDisplay,
      deliveryFeePenny,
      deliveryFeeDisplay,
      tipPenny,
      tipDisplay,
      totalPenny,
      totalDisplay,
    } = cartDetails;

    const customerName = `${customerFName} ${customerLName}`;
    const orderStatus = "pending";
    const orderForDate = requireOrderDate
      ? new Date(orderForDateDisplay).getTime().toString()
      : null;
    const orderTime = `${orderForDateDisplay} ${orderForTimeDisplay}`;
    const orderForTime = requireOrderTime
      ? new Date(orderTime).getTime().toString()
      : null;

    const orderDetailsData = {
      orderId: nanoid(),
      customerName,
      customerFName,
      customerLName,
      customerEmail,
      customerPhone,
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
      orderStatus,
      cardFeePenny,
      cardFeeDisplay,
      taxAndFeesPenny,
      taxAndFeesDisplay,
      deliveryFeePenny,
      deliveryFeeDisplay,
      tipPenny,
      tipDisplay,
      totalPenny,
      totalDisplay,
    };

    return orderDetailsData;
  };

  const structureOrderItems = async (orderId) => {
    let totalItems = 0;
    let orderItems = [];

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
      } = cartItem;

      totalItems += quantity;

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

    return { orderItems, totalItems };
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
      <form
        onSubmit={handleSubmitOrder}
        className="flex flex-col gap-1 pb-28 lg:flex-row lg:mt-8 lg:mx-16 lg:gap-4"
      >
        {hydrated && (
          <div className="lg:w-2/3">
            <div className="px-4 py-6 gap-2 flex flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0 lg:mt-0">
              <h3 className="font-medium">Your information:</h3>
              <div className="lg:px-12">
                <div className="flex w-full gap-2">
                  <TextField
                    id="outlined-basic"
                    label="First name"
                    variant="standard"
                    fullWidth
                    required
                    color="warning"
                    value={customerFName}
                    name="customerFName"
                    onChange={handleCustomerInfoChange}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Last name"
                    variant="standard"
                    required
                    fullWidth
                    color="warning"
                    value={customerLName}
                    name="customerLName"
                    onChange={handleCustomerInfoChange}
                  />
                </div>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="standard"
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
                  country={"us"}
                  value={customerPhone}
                  name="customerPhone"
                  onChange={handleCustomerPhoneChange}
                  className="mt-6 w-full focus:ring-1"
                  inputClass="p-6"
                  inputStyle={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="px-4 py-6 gap-2 flex border-t-2 flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0  lg:mt-0">
              <PaymentComponent
                paymentValues={paymentValues}
                handleCustomerPaymentChange={handleCustomerPaymentChange}
              />
            </div>
            <div className="px-4 py-6 gap-2 border-t-2 flex flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0  lg:mt-0">
              <BillingAddress
                billingAddressValues={billingAddressValues}
                handleCustomerBillingAddressChange={
                  handleCustomerBillingAddressChange
                }
              />
            </div>
          </div>
        )}

        <div className="relative lg:flex-grow">
          <div className="bg-white border-t-2 md:border md:round md:mx-16 lg:mx-0">
            <OrderReview />
          </div>

          {hydrated && tipsEnabled && (
            <div className="bg-white border-t-2 md:border md:round md:my-4 md:mx-16 lg:mx-0">
              <TipComponent />
            </div>
          )}
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
                  <CircularProgress sx={{ color: "white" }} />
                  Submitting order...
                </div>
              ) : (
                "Submit Order"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
