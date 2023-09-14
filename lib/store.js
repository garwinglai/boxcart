import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAccountStore = create(
  persist(
    (set, get) => ({
      account: {
        accountId: null,
        logoImg: null,
        bannerImg: null,
        businessName: null,
        businessBio: null,
        city: null,
        firstName: null,
        lastName: null,
        subdomain: null,
      },
      setAccount: (newValue) => set({ ...get().account, account: newValue }),
      removeAccount: () => set({ account: {} }),
    }),
    { name: "account-storage" }
  )
);

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      cartDetails: {
        customerFName: "",
        customerLName: "",
        customerEmail: "",
        customerPhone: "",
        requireOrderTime: false,
        requireOrderDate: false,
        orderForDateDisplay: "Select date",
        orderForTimeDisplay: "time",
        fulfillmentType: null,
        fulfillmentDisplay: null,
        deliveryAddress: "",
        subtotalPenny: 0,
        subtotalDisplay: "$0.00",
        taxRate: 0,
        taxRateDisplay: "$0.00",
        cardFeePenny: 0,
        cardFeeDisplay: "$0.00",
        taxAndFeesPenny: 0,
        taxAndFeesDisplay: "$0.00",
        deliveryFeePenny: 0,
        deliveryFeeDisplay: "$0.00",
        deliveryFeeType: 0, // 0 = free, 1 = flat, 2 = percentage , 3 = distance
        deliveryFeeTypeDisplay: "free",
        deliveryDistanceMi: 0,
        deliveryDistanceMiDisplay: "0 mi",
        deliveryDistanceKm: 0,
        deliveryDistanceKmDisplay: "0 km",
        tipsEnabled: false,
        selectedTipIndex: null,
        tipType: 0, // 0 = dollar, 1 = percentage
        tipTypeDisplay: "dollar",
        tipValues: [
          {
            tip: 0,
            tipDisplay: "$0.00",
          },
          {
            tip: 0,
            tipDisplay: "$0.00",
          },
          {
            tip: 0,
            tipDisplay: "$0.00",
          },
        ],
        tipPenny: 0,
        tipDisplay: "$0.00",
        totalPenny: 0,
        totalDisplay: "$0.00",
      },
      setCart: (newValue) =>
        set((state) => ({
          cart: [...state.cart, newValue],
          ...state.cartDetails,
        })),
      addCartItemPrice: (addToCartTempItemId, newPricePenny) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.addToCartTempItemId === addToCartTempItemId) {
              const pricePenny = parseInt(item.pricePenny) + newPricePenny;
              const priceDisplay = `$${(pricePenny / 100).toFixed(2)}`;
              return { ...item, pricePenny, priceDisplay };
            }
            return item;
          }),
          ...state.cartDetails,
        })),
      subtractCartItemPrice: (addToCartTempItemId, newPricePenny) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.addToCartTempItemId === addToCartTempItemId) {
              const pricePenny = parseInt(item.pricePenny) - newPricePenny;
              const priceDisplay = `$${(pricePenny / 100).toFixed(2)}`;
              return { ...item, pricePenny, priceDisplay };
            }
            return item;
          }),
          ...state.cartDetails,
        })),
      addQuantityToCartItem: (addToCartTempItemId) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.addToCartTempItemId === addToCartTempItemId) {
              return { ...item, quantity: parseInt(item.quantity) + 1 };
            }
            return item;
          }),
          ...state.cartDetails,
        })),
      subtractQuantityFromCartItem: (addToCartTempItemId) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.addToCartTempItemId === addToCartTempItemId) {
              return { ...item, quantity: parseInt(item.quantity) - 1 };
            }
            return item;
          }),
          ...state.cartDetails,
        })),
      removeItemFromCart: (addToCartTempItemId) =>
        set((state) => ({
          cart: get().cart.filter(
            (item) => item.addToCartTempItemId !== addToCartTempItemId
          ),
          ...state.cartDetails,
        })),
      removeCart: () => set((state) => ({ cart: [], ...state.cartDetails })),
      removeCartDetails: () => set({ cartDetails: {} }),
      setCartDetails: (newValue) =>
        set((state) => ({
          cart: [...state.cart],
          cartDetails: { ...state.cartDetails, ...newValue },
        })),
      addSubtotal: (newSubtotalPenny) =>
        set((state) => {
          const newSubtotalInPenny =
            parseInt(state.cartDetails.subtotalPenny) +
            parseInt(newSubtotalPenny);
          const newSubtotalDisplay = `$${(newSubtotalInPenny / 100).toFixed(
            2
          )}`;

          return {
            cart: [...state.cart],
            cartDetails: {
              ...state.cartDetails,
              subtotalPenny: newSubtotalInPenny,
              subtotalDisplay: newSubtotalDisplay,
            },
          };
        }),
      subtractSubtotal: (newSubtotalPenny) =>
        set((state) => {
          const newSubtotalInPenny =
            parseInt(state.cartDetails.subtotalPenny) -
            parseInt(newSubtotalPenny);
          const newSubtotalDisplay = `$${(newSubtotalInPenny / 100).toFixed(
            2
          )}`;

          return {
            cart: [...state.cart],
            cartDetails: {
              ...state.cartDetails,
              subtotalPenny: newSubtotalInPenny,
              subtotalDisplay: newSubtotalDisplay,
            },
          };
        }),
    }),
    { name: "cart-storage" }
  )
);
