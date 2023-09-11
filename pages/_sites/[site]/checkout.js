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

function Checkout() {
  const setCartDetails = useCartStore((state) => state.setCartDetails);
  const cartDetails = useCartStore((state) => state.cartDetails);
  const cart = useCartStore((state) => state.cart);
  const hydrated = useHasHydrated();

  console.log(cartDetails);

  const {
    tipsEnabled,
    customerFName,
    customerLName,
    customerEmail,
    customerPhone,
  } = cartDetails;

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const cartLength = cart.length;

    if (cartLength === 0) {
      router.push("/");
    }

    setIsLoading(false);
  }, []);

  function handleBack(e) {
    router.back();
  }

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCartDetails({ [name]: value });
  };

  const handleCustomerPhoneChange = (value, country, event, formattedValue) => {
    setCartDetails({ customerPhone: formattedValue });
  };

  function handleSubmitOrder(e) {
    if (isLoading) return;

    e.preventDefault();
    setIsLoading(true);
    // TODO: All value is saved to cartDetails, just need to submit.
    return;
    router.push("/order-submitted/123");
  }

  return (
    <div className="">
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

            <PaymentComponent />
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
              className="text-white font-extralight py-2 w-full  bg-[color:var(--black-design-extralight)] active:bg-black"
            >
              {isLoading ? "Submitting order..." : "Submit Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
