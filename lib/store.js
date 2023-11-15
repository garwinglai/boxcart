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
        fullDomain: null,
      },
      setAccount: (newValue) =>
        set({ account: { ...get().account, ...newValue } }),
      removeAccount: () => set({ account: {} }),
    }),
    { name: "account-storage" }
  )
);

export const useChecklistStore = create(
  persist(
    (set, get) => ({
      checklist: {
        id: null,
        accountId: null,
        isEmailVerified: false,
        isProductsUploaded: false,
        isDeliverySet: false,
        isPaymentsSet: false,
        hasLogo: false,
        hasBanner: false,
        hasViewedShareStore: false,
        requireAvailability: false,
        isChecklistComplete: false,
        isNonMandatoryChecklistComplete: false,
      },
      setChecklist: (newValue) =>
        set((state) => ({
          checklist: { ...state.checklist, ...newValue },
        })),
    }),
    { name: "checklist-storage" }
  )
);

export const useMembershipStore = create(
  persist(
    (set, get) => ({
      membershipProduct: {},
      membershipPrice: {},
      setMembershipProduct: (newValue) =>
        set((state) => ({
          membershipProduct: { ...newValue },
        })),
      setMembershipPrice: (newValue) =>
        set((state) => ({
          membershipPrice: { ...newValue },
        })),
      removeMembershipProduct: () => set({ membershipProduct: {} }),
      removeMembershipPrice: () => set({ membershipPrice: {} }),
    }),
    { name: "membership-storage" }
  )
);

export const useOptionsQuantityStore = create(
  persist(
    (set, get) => ({
      options: [], // [{productId, remainingMaxQuantity, remainingOptions, totalOptionsAvailable, optionGroups: [{groupId, isRequired, options: [{optionId, optionQuantityLeft, initialOptionQuantity}]]}}]
      setOptions: (newValue) =>
        set((state) => ({
          options: [...state.options, newValue],
        })),
      removeOption: (id) =>
        set({ options: get().options.filter((p) => p.productId !== id) }),
      removeAllOptions: () => set({ options: [] }),
      updateRemainingMax: (productId, newRemainingMax) =>
        set((state) => ({
          options: state.options.map((optionSet) => {
            const { productId: productIdStore } = optionSet;
            if (productId == productIdStore) {
              const selectedSet = {
                ...optionSet,
                remainingMaxQuantity: newRemainingMax,
              };
              return selectedSet;
            }
            return optionSet;
          }),
        })),
      updateRemainingOptions: (productId, remainingOptions) =>
        set((state) => ({
          options: state.options.map((optionSet) => {
            const { productId: productIdStore } = optionSet;
            if (productId == productIdStore) {
              const selectedSet = {
                ...optionSet,
                remainingOptions: remainingOptions,
              };
              return selectedSet;
            }
            return optionSet;
          }),
        })),
      reduceRemainingQuantity: (productId, quantity) =>
        set((state) => ({
          options: state.options.map((optionSet) => {
            const {
              productId: productIdStore,
              remainingMaxQuantity,
              remainingOptions,
            } = optionSet;
            if (productIdStore === productId) {
              const selectedSet = {
                ...optionSet,
                remainingOptions: remainingOptions - quantity,
              };

              return selectedSet;
            }
            return optionSet;
          }),
        })),
      addRemainingQuantity: (productId, quantity) =>
        set((state) => ({
          options: state.options.map((optionSet) => {
            const {
              productId: productIdStore,
              remainingMaxQuantity,
              remainingOptions,
            } = optionSet;
            if (productIdStore === productId) {
              const selectedSet = {
                ...optionSet,
                remainingOptions: remainingOptions + quantity,
              };

              return selectedSet;
            }
            return optionSet;
          }),
        })),
      updateInitialOptionQuantity: (productId, groupId, optionId, quantity) =>
        set((state) => ({
          options: state.options.map((optionSet) => {
            if (productId == optionSet.productId) {
              const selectedSet = {
                ...optionSet,
                optionGroups: optionSet.optionGroups.map((group) => {
                  if (groupId == group.groupId) {
                    const selectedGroup = {
                      ...group,
                      options: group.options.map((option) => {
                        if (optionId == option.optionId) {
                          const selectedOption = {
                            ...option,
                            optionQuantityLeft: 0,
                            initialOptionQuantity: quantity,
                          };
                          return selectedOption;
                        }
                        return option;
                      }),
                    };
                    return selectedGroup;
                  }
                  return group;
                }),
              };
              return selectedSet;
            }
            return optionSet;
          }),
        })),
      updateOptionQuantity: (productId, groupId, optionId, quantity) =>
        set((state) => ({
          options: state.options.map((optionSet) => {
            if (productId == optionSet.productId) {
              const selectedSet = {
                ...optionSet,
                optionGroups: optionSet.optionGroups.map((group) => {
                  if (groupId == group.groupId) {
                    const selectedGroup = {
                      ...group,
                      options: group.options.map((option) => {
                        if (optionId == option.optionId) {
                          const selectedOption = {
                            ...option,
                            optionQuantityLeft: quantity,
                          };
                          return selectedOption;
                        }
                        return option;
                      }),
                    };
                    return selectedGroup;
                  }
                  return group;
                }),
              };
              return selectedSet;
            }
            return optionSet;
          }),
        })),
      reduceOptionQuantity: (productId, groupId, optionId, quantity) =>
        set((state) => ({
          options: state.options.map((optionSet) => {
            if (productId == optionSet.productId) {
              const selectedSet = {
                ...optionSet,
                optionGroups: optionSet.optionGroups.map((group) => {
                  if (groupId == group.groupId) {
                    const selectedGroup = {
                      ...group,
                      options: group.options.map((option) => {
                        if (optionId == option.optionId) {
                          const selectedOption = {
                            ...option,
                            optionQuantityLeft:
                              option.optionQuantityLeft - quantity,
                          };
                          return selectedOption;
                        }
                        return option;
                      }),
                    };
                    return selectedGroup;
                  }
                  return group;
                }),
              };
              return selectedSet;
            }
            return optionSet;
          }),
        })),
      addOptionQuantity: (productId, groupId, optionId, quantity) =>
        set((state) => ({
          options: state.options.map((optionSet) => {
            if (productId == optionSet.productId) {
              const selectedSet = {
                ...optionSet,
                optionGroups: optionSet.optionGroups.map((group) => {
                  if (groupId == group.groupId) {
                    const selectedGroup = {
                      ...group,
                      options: group.options.map((option) => {
                        if (optionId == option.optionId) {
                          const selectedOption = {
                            ...option,
                            optionQuantityLeft:
                              option.optionQuantityLeft + quantity,
                          };
                          return selectedOption;
                        }
                        return option;
                      }),
                    };
                    return selectedGroup;
                  }
                  return group;
                }),
              };
              return selectedSet;
            }
            return optionSet;
          }),
        })),
    }),
    { name: "options-quantity-storage" }
  )
);

export const useProductQuantityStore = create(
  persist(
    (set, get) => ({
      products: [], // [{id, quantity, initialQuantity}]
      setProducts: (newValue) =>
        set((state) => ({
          products: [...state.products, newValue],
        })),
      reduceProductQuantity: (id, quantity) =>
        set((state) => ({
          products: state.products.map((product) => {
            if (product.id === id) {
              product.quantity -= quantity;
            }
            return product;
          }),
        })),
      addProductQuantity: (id, quantity) =>
        set((state) => ({
          products: state.products.map((product) => {
            if (product.id === id) {
              product.quantity += quantity;
            }
            return product;
          }),
        })),
      removeProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),
      removeAllProducts: () => set({ products: [] }),
    }),
    { name: "product-quantity-storage" }
  )
);

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      cartDetails: {
        id: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        requireOrderTime: false,
        requireOrderDate: false,
        orderForDateDisplay: "Select date",
        orderForTimeDisplay: "time",
        fulfillmentType: null,
        fulfillmentDisplay: null,
        deliveryAddress: "",
        pickupAddress: "",
        pickupNote: "",
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
        paymentMethod: "",
        paymentMethodValues: {},
        // tipsEnabled: false,
        selectedTipIndex: null,
        // tipType: 0, // 0 = dollar, 1 = percentage
        // tipTypeDisplay: "dollar",
        // tipValues: [
        //   {
        //     tip: 0,
        //     tipDisplay: "$0.00",
        //   },
        //   {
        //     tip: 0,
        //     tipDisplay: "$0.00",
        //   },
        //   {
        //     tip: 0,
        //     tipDisplay: "$0.00",
        //   },
        // ],
        // tipPenny: 0,
        // tipDisplay: "$0.00",
        totalPenny: 0,
        totalDisplay: "$0.00",
      },
      setCart: (newValue) =>
        set((state) => ({
          cart: [...state.cart, newValue],
          cartDetails: {
            ...state.cartDetails,
          },
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
          cartDetails: {
            ...state.cartDetails,
          },
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
          cartDetails: {
            ...state.cartDetails,
          },
        })),
      addQuantityToCartItem: (addToCartTempItemId) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.addToCartTempItemId === addToCartTempItemId) {
              return { ...item, quantity: parseInt(item.quantity) + 1 };
            }
            return item;
          }),
          cartDetails: {
            ...state.cartDetails,
          },
        })),
      subtractQuantityFromCartItem: (addToCartTempItemId) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.addToCartTempItemId === addToCartTempItemId) {
              return { ...item, quantity: parseInt(item.quantity) - 1 };
            }
            return item;
          }),
          cartDetails: {
            ...state.cartDetails,
          },
        })),
      removeItemFromCart: (addToCartTempItemId) =>
        set((state) => ({
          cart: get().cart.filter(
            (item) => item.addToCartTempItemId !== addToCartTempItemId
          ),
          cartDetails: {
            ...state.cartDetails,
          },
        })),
      removeCart: () =>
        set((state) => ({ cart: [], cartDetails: { ...state.cartDetails } })),
      resetCartStore: (resetValues) =>
        set((state) => ({ cart: [], cartDetails: { ...resetValues } })),
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
