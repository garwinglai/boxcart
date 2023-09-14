import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CartItem from "./CartItem";
import OrderReview from "./OrderReview";
import OrderSubtotal from "./OrderSubtotal";
import Image from "next/image";
import product_tag_icon from "@/public/images/icons/product_tag_icon.png";
import { useRouter } from "next/router";
import { useCartStore } from "@/lib/store";
import Snackbar from "@mui/material/Snackbar";

function CartComponent({ toggleDrawer, isDesktop }) {
  const cart = useCartStore((state) => state.cart);
  const cartDetails = useCartStore((state) => state.cartDetails);

  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    vertical: "top",
    horizontal: "right",
  });

  const { isOpen, message, vertical, horizontal } = snackbar;
  const {
    requireOrderTime,
    requireOrderDate,
    orderForDateDisplay,
    orderForTimeDisplay,
    fulfillmentDisplay,
    deliveryAddress,
    fulfillmentType,
  } = cartDetails;

  const [isLoading, setIsLoading] = useState(false);
  const [cartLength, setCartLength] = useState(0);

  const { push, back } = useRouter();

  useEffect(() => {
    setCartLength(cart.length);
  }, [cart]);

  const handleOpenSnackBar = (message) => {
    setSnackbar((prev) => ({
      ...prev,
      isOpen: true,
      message,
    }));
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar((prev) => ({
      ...prev,
      isOpen: false,
      message: "",
    }));
  };

  const handleCheckout = (e) => {
    if (isLoading) return;
    if (fulfillmentType === 0 && !deliveryAddress) {
      handleOpenSnackBar("Missing delivery address");
      return;
    }

    if (
      requireOrderDate &&
      (orderForDateDisplay === "Select date" || orderForDateDisplay === "")
    ) {
      handleOpenSnackBar("Please select a date for your order.");
      return;
    }

    if (
      requireOrderTime &&
      (orderForTimeDisplay === "time" || orderForTimeDisplay === "")
    ) {
      handleOpenSnackBar("Please select a time for your order.");
      return;
    }

    setIsLoading(true);
    push("/checkout");
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="flex flex-col w-screen pb-16 lg:w-full lg:border-l lg:border-[color:var(--gray-light-med)] lg:h-full ">
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isOpen}
        onClose={handleCloseSnackBar}
        message={message}
        key={vertical + horizontal}
        action={action}
      />
      <div className="flex justify-between items-center py-2 px-4 sticky top-0 bg-white border-b border-[color:var(--gray-light-med)] z-10 lg:w-[20rem] xl:w-[25rem]">
        <h2 className="text-[color:var(--black-design-extralight)]  font-medium">
          My Cart
        </h2>

        <div className="lg:hidden">
          <IconButton onClick={toggleDrawer}>
            <CloseIcon color="black" />
          </IconButton>
        </div>
      </div>
      <div className="pb-8 overflow-y-scroll">
        {cartLength === 0 ? (
          <div className="mt-28 flex flex-col items-center gap-2 justify-center lg:w-full">
            <Image
              src={product_tag_icon}
              alt="product tag icon"
              className="w-12 h-12 object-contain"
            />
            <h4>No items added ...</h4>
          </div>
        ) : (
          <React.Fragment>
            <h3 className="font-medium pt-4 px-4">Items:</h3>
            {cart.map((item, idx) => {
              const { addToCartTempItemId } = item;
              return (
                <CartItem
                  key={addToCartTempItemId}
                  cartItem={item}
                  isDesktop={isDesktop}
                  toggleDrawer={toggleDrawer}
                />
              );
            })}
            <OrderReview closeDrawer={toggleDrawer} isMobile={true} />
            <OrderSubtotal isInCart={true} />
          </React.Fragment>
        )}
      </div>

      <div
        className={`fixed bottom-0 w-full p-4 bg-white border-y border-[color:var(--gray-light-med)] ${
          isDesktop ? "lg:w-[20rem] xl:w-[25rem]" : "lg:w-full"
        } ${isDesktop && cartLength === 0 ? "hidden" : "block"}`}
      >
        <button
          onClick={cartLength === 0 ? toggleDrawer : handleCheckout}
          className="text-white font-extralight py-2 w-full  bg-[color:var(--black-design-extralight)] active:bg-black"
          // disabled={isLoading ? true : false}
        >
          {cartLength === 0
            ? "Continue shopping ..."
            : isLoading
            ? `Checking out ...`
            : "Checkout"}
        </button>
      </div>
    </div>
  );
}

export default CartComponent;
