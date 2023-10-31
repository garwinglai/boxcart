import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CartItem from "./CartItem";
import OrderReview from "./OrderReview";
import OrderSubtotal from "./OrderSubtotal";
import Image from "next/image";
import product_tag_icon from "@/public/images/icons/product_tag_icon.png";
import { useRouter } from "next/router";
import {
  useCartStore,
  useProductQuantityStore,
  useOptionsQuantityStore,
} from "@/lib/store";
import Snackbar from "@mui/material/Snackbar";
import Link from "next/link";

function CartComponent({ toggleDrawer, isDesktop }) {
  const setProductsStore = useProductQuantityStore(
    (state) => state.setProducts
  );
  const productsStore = useProductQuantityStore((state) => state.products);
  const removeProduct = useProductQuantityStore((state) => state.removeProduct);
  const cart = useCartStore((state) => state.cart);
  const cartDetails = useCartStore((state) => state.cartDetails);
  const updateInitialOptionQuantity = useOptionsQuantityStore(
    (state) => state.updateInitialOptionQuantity
  );

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
  const [notEnoughStockItems, setNotEnoughStockItems] = useState([]); // [addToCartTempItemId]
  const [notEnoughStockOptionItems, setNotEnoughStockOptionItems] = useState(
    []
  ); // [addToCartTempItemId]

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

  const handleCheckout = async (e) => {
    if (isLoading) return;
    setIsLoading(true);
    if (fulfillmentType === 0 && !deliveryAddress) {
      handleOpenSnackBar("Missing delivery address");
      setIsLoading(false);
      return;
    }

    if (
      requireOrderDate &&
      (orderForDateDisplay === "Select date" || orderForDateDisplay === "")
    ) {
      handleOpenSnackBar("Please select a date for your order.");
      setIsLoading(false);
      return;
    }

    if (
      requireOrderTime &&
      (orderForTimeDisplay === "time" || orderForTimeDisplay === "")
    ) {
      handleOpenSnackBar("Please select a time for your order.");
      setIsLoading(false);
      return;
    }

    // * if there are any cart items that are not added to productStore, check cart quantities against db

    const isThereEnoughStock = await checkIfEnoughStockPerProductInCart(cart);
    const isThereEnoughStockOptions = await checkIfEnoughStockPerOptionsInCart(
      cart
    );
    console.log("isThereEnoughStock", isThereEnoughStockOptions);

    if (!isThereEnoughStock || !isThereEnoughStockOptions) {
      setIsLoading(false);
      return;
    } else {
      push("/checkout");
    }
  };

  const checkIfEnoughStockPerOptionsInCart = async (cart) => {
    let cartQuantitiesProductOptions = [];

    // Loop through cart and find all the similar products. Add the quantities cartQuantitiesProduct array to find maximum quantity ordered for each item.
    for (let i = 0; i < cart.length; i++) {
      const currCart = cart[i];
      const {
        hasUnlimitedQuantity,
        setQuantityByProduct,
        productId,
        quantity,
        orderOptionGroups,
        addToCartTempItemId,
      } = currCart;

      // Quantity set to options
      if (!hasUnlimitedQuantity && !setQuantityByProduct) {
        for (let j = 0; j < orderOptionGroups.length; j++) {
          const currGroup = orderOptionGroups[j];
          const { options, groupId } = currGroup;

          //group 1
          //option 1
          //group 2
          //option 1
          //option 2

          for (let k = 0; k < options.length; k++) {
            const currOption = options[k];
            const { optionId } = currOption;

            const data = {
              productId,
              quantity,
              groupId,
              optionId,
              addToCartTempItemId,
            };

            const cartQuantitiesProductOptionsLength =
              cartQuantitiesProductOptions.length;

            if (cartQuantitiesProductOptionsLength < 1) {
              cartQuantitiesProductOptions.push(data);
              continue;
            }

            const alreadyAddedToCartOptionQuantities =
              cartQuantitiesProductOptions.find(
                (item) => item.optionId == optionId
              );

            if (!alreadyAddedToCartOptionQuantities) {
              cartQuantitiesProductOptions.push(data);
            } else {
              const index = cartQuantitiesProductOptions.findIndex(
                (item) => item.optionId == optionId
              );
              cartQuantitiesProductOptions[index].quantity += quantity;
            }
          }
        }
      }
    }

    let notEnoughStockItems = [];

    // Check if option quantities are enough in db
    for (let k = 0; k < cartQuantitiesProductOptions.length; k++) {
      const currCart = cartQuantitiesProductOptions[k];
      const {
        productId,
        quantity: quantityInCart,
        optionId,
        addToCartTempItemId,
      } = currCart;

      // optionId will be undefined if the option selected is "none"
      if (!optionId) continue;

      const checkStockAPI = `/api/public/orders/check-option-stock?optionId=${optionId}`;
      const checkProductStock = await fetch(checkStockAPI);
      const checkProductStockJSON = await checkProductStock.json();
      console.log("checkProductStockJSON", checkProductStockJSON);
      const {
        quantity: quantityFromDb,
        id: optionIdFromDb,
        optionGroupId,
      } = checkProductStockJSON.option;

      if (quantityInCart > quantityFromDb) {
        notEnoughStockItems.push({
          id: productId,
          quantity: quantityFromDb,
          optionId: optionIdFromDb,
          groupId: optionGroupId,
          addToCartTempItemId,
        });
      }
    }

    const notEnoughStockCount = notEnoughStockItems.length;

    if (notEnoughStockCount > 0) {
      //loop through notEnoughStockItems and make an array of ids
      const notEnoughStockItemsIds = notEnoughStockItems.map(
        (item) => item.addToCartTempItemId
      );

      for (let l = 0; l < notEnoughStockItems.length; l++) {
        const currItem = notEnoughStockItems[l];
        const { id, quantity, optionId, groupId } = currItem;

        updateInitialOptionQuantity(id, groupId, optionId, quantity);
      }

      setNotEnoughStockOptionItems([...notEnoughStockItemsIds]);
      return false;
    }

    return true;
  };

  const checkIfEnoughStockPerProductInCart = async (cart) => {
    let cartQuantitiesProduct = [];

    // Loop through cart and find all the similar products. Add the quantities cartQuantitiesProduct array to find maximum quantity ordered for each item.
    for (let i = 0; i < cart.length; i++) {
      const currCart = cart[i];
      const {
        hasUnlimitedQuantity,
        setQuantityByProduct,
        productId,
        quantity,
        orderOptionGroups,
        addToCartTempItemId,
      } = currCart;

      // Quantity set to product
      if (!hasUnlimitedQuantity && setQuantityByProduct) {
        const alreadyAddedToCartQuantities = cartQuantitiesProduct.some(
          (item) => item.productId == productId
        );

        const data = {
          productId,
          quantity,
          addToCartTempItemId,
        };

        if (!alreadyAddedToCartQuantities) {
          cartQuantitiesProduct.push(data);
        } else {
          const index = cartQuantitiesProduct.findIndex(
            (item) => item.productId == productId
          );
          cartQuantitiesProduct[index].quantity += quantity;
        }
      }
    }

    let notEnoughStockItems = [];

    //Loop through cartQuantitiesProduct and check if there is enough stock for each product.
    for (let j = 0; j < cartQuantitiesProduct.length; j++) {
      const currInCart = cartQuantitiesProduct[j];
      const {
        productId,
        quantity: cartQuantity,
        addToCartTempItemId,
      } = currInCart;

      const checkStockAPI = `/api/public/orders/check-product-stock?productId=${productId}`;
      const checkProductStock = await fetch(checkStockAPI);
      const checkProductStockJSON = await checkProductStock.json();
      const { quantity, id } = checkProductStockJSON.product;

      if (cartQuantity > quantity) {
        notEnoughStockItems.push({ id, quantity, addToCartTempItemId });
      }
    }

    const notEnoughStockCount = notEnoughStockItems.length;
    if (notEnoughStockCount > 0) {
      //loop through notEnoughStockItems and make an array of ids
      const notEnoughStockItemsIds = notEnoughStockItems.map(
        (item) => item.addToCartTempItemId
      );

      //loop through notEnoughSotkcItems, and setProductsStore
      for (let k = 0; k < notEnoughStockItems.length; k++) {
        const currItem = notEnoughStockItems[k];
        const { id, quantity } = currItem;
        const data = {
          id,
          quantity: 0,
          initialQuantity: quantity,
        };

        //check if product is already in productStore, if it is, replace it with current data
        const productInStore = productsStore.some(
          (product) => product.id == id
        );

        if (productInStore) {
          removeProduct(id);
        }

        setProductsStore(data);
      }

      setNotEnoughStockItems([...notEnoughStockItemsIds]);
      return false;
    }

    return true;
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
                  handleOpenSnackBar={handleOpenSnackBar}
                  notEnoughStockItems={notEnoughStockItems}
                  notEnoughStockOptionItems={notEnoughStockOptionItems}
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
          className="rounded text-white font-extralight py-2 w-full  bg-[color:var(--black-design-extralight)] active:bg-black"
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
