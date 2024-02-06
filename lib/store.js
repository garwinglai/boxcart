import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminStore = create(
  persist(
    (set) => ({
      adminUser: {},
      setAdminUser: (newValue) => set({ account: { ...newValue } }),
      removeAccount: () => set({ account: {} }),
      removeAdminuser: () => set({ adminUser: {} }),
    }),
    { name: "account-storage" }
  )
);

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
        lat: null,
        lng: null,
        geohash: null,
      },
      setAccount: (newValue) =>
        set({ account: { ...get().account, ...newValue } }),
      removeAccount: () => set({ account: {} }),
    }),
    { name: "account-storage" }
  )
);

export const useConnectAccountStore = create(
  persist(
    (set, get) => ({
      connectAccount: {
        id: "",
        firstName: "",
        lastName: "",
        name: "",
        email: "",
      },
      setConnectAccount: (newValue) =>
        set({ connectAccount: { ...get().connectAccount, ...newValue } }),
      removeConnectAccount: () => set({ connectAccount: {} }),
    }),
    { name: "connect-account-storage" }
  )
);

export const useShopperStore = create(
  persist(
    (set, get) => ({
      shopperAccount: {
        userId: null,
        shopperId: null,
        profileImage: null,
        firstName: null,
        lastName: null,
        email: null,
        name: null,
      },
      setShopperAccount: (newValue) =>
        set({ shopperAccount: { ...get().shopperAccount, ...newValue } }),
      removeShopperAccount: () => set({ shopperAccount: null }),
    }),
    { name: "shopper-storage" }
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
      store: [
        // {
        //   storeName: "",
        //   cart: [],
        //   cartDetails: {
        //     id: "",
        //     applyFivePercentDiscount: false,
        //     requireOrderTime: false,
        //     requireOrderDate: false,
        //     customerName: "",
        //     customerEmail: "",
        //     customerPhone: "",
        //     orderForDateDisplay: "",
        //     orderForTimeDisplay: "",
        //     fulfillmentType: null,
        //     fulfillmentDisplay: null,
        //     deliveryAddress: "",
        //     pickupAddress: "",
        //     pickupNote: "",
        //     subtotalPenny: 0,
        //     subtotalDisplay: "$0.00",
        //     taxRate: 0,
        //     taxRateDisplay: "$0.00",
        //     cardFeePenny: 0,
        //     cardFeeDisplay: "$0.00",
        //     taxAndFeesPenny: 0,
        //     taxAndFeesDisplay: "$0.00",
        //     deliveryFeePenny: 0,
        //     deliveryFeeDisplay: "$0.00",
        //     deliveryFeeType: 0, // 0 = free, 1 = flat, 2 = percentage , 3 = distance
        //     deliveryFeeTypeDisplay: "free",
        //     deliveryDistanceMi: 0,
        //     deliveryDistanceMiDisplay: "0 mi",
        //     deliveryDistanceKm: 0,
        //     deliveryDistanceKmDisplay: "0 km",
        //     paymentMethod: "",
        //     paymentMethodValues: {},
        //     selectedTipIndex: null,
        //     totalPenny: 0,
        //     totalDisplay: "$0.00",
        //   },
        // },
      ],
      setCart: (storeName, newValue) =>
        set((prevState) => {
          const stateLen = prevState.store.length;

          if (stateLen === 0) {
            return {
              store: [
                ...prevState.store,
                {
                  storeName,
                  cart: [newValue],
                  cartDetails: {
                    ...prevState.store.cartDetails,
                  },
                },
              ],
            };
          }

          const existingStore = prevState.store.find(
            (store) => store.storeName === storeName
          );

          if (!existingStore) {
            return {
              store: [
                ...prevState.store,
                {
                  storeName,
                  cart: [newValue],
                  cartDetails: {
                    ...prevState.store.cartDetails,
                  },
                },
              ],
            };
          }

          // find store with storeName, and update newValue
          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              return {
                ...store,
                cart: [...store.cart, newValue],
                cartDetails: { ...store.cartDetails },
              };
            }
            return store;
          });

          return { store: newStore };
        }),
      setCartDetails: (storeName, cartValue) =>
        set((prevState) => {
          const stateLen = prevState.store.length;

          if (stateLen === 0) {
            return {
              store: [
                ...prevState.store,
                {
                  storeName,
                  cart: [],
                  cartDetails: {
                    ...prevState.store.cartDetails,
                    ...cartValue,
                  },
                },
              ],
            };
          }

          const existingStore = prevState.store.find(
            (store) => store.storeName === storeName
          );

          if (!existingStore) {
            return {
              store: [
                ...prevState.store,
                {
                  storeName,
                  cart: [],
                  cartDetails: {
                    ...prevState.store.cartDetails,
                    ...cartValue,
                  },
                },
              ],
            };
          }

          // find store with storeName, and update cartValue
          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              return {
                ...store,
                cart: [...store.cart],
                cartDetails: { ...store.cartDetails, ...cartValue },
              };
            }
            return store;
          });

          return { store: newStore };
        }),
      addCartItemPrice: (storeName, addToCartTempItemId, newPricePenny) =>
        set((prevState) => {
          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              return {
                ...store,
                cart: store.cart.map((item) => {
                  if (item.addToCartTempItemId === addToCartTempItemId) {
                    const pricePenny =
                      parseInt(item.pricePenny) + newPricePenny;
                    const priceDisplay = `$${(pricePenny / 100).toFixed(2)}`;
                    return { ...item, pricePenny, priceDisplay };
                  }
                  return item;
                }),
                cartDetails: {
                  ...store.cartDetails,
                },
              };
            }
            return store;
          });

          return { store: newStore };
        }),
      subtractCartItemPrice: (storeName, addToCartTempItemId, newPricePenny) =>
        set((prevState) => {
          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              return {
                ...store,
                cart: store.cart.map((item) => {
                  if (item.addToCartTempItemId === addToCartTempItemId) {
                    const pricePenny =
                      parseInt(item.pricePenny) - newPricePenny;
                    const priceDisplay = `$${(pricePenny / 100).toFixed(2)}`;
                    return { ...item, pricePenny, priceDisplay };
                  }
                  return item;
                }),
                cartDetails: {
                  ...store.cartDetails,
                },
              };
            }
            return store;
          });

          return { store: newStore };
        }),
      addQuantityToCartItem: (storeName, addToCartTempItemId) =>
        set((prevState) => {
          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              return {
                ...store,
                cart: store.cart.map((item) => {
                  if (item.addToCartTempItemId === addToCartTempItemId) {
                    return { ...item, quantity: parseInt(item.quantity) + 1 };
                  }
                  return item;
                }),
                cartDetails: {
                  ...store.cartDetails,
                },
              };
            }
            return store;
          });

          return { store: newStore };
        }),
      subtractQuantityFromCartItem: (storeName, addToCartTempItemId) =>
        set((prevState) => {
          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              return {
                ...store,
                cart: store.cart.map((item) => {
                  if (item.addToCartTempItemId === addToCartTempItemId) {
                    return { ...item, quantity: parseInt(item.quantity) - 1 };
                  }
                  return item;
                }),
                cartDetails: {
                  ...store.cartDetails,
                },
              };
            }
            return store;
          });

          return { store: newStore };
        }),
      removeItemFromCart: (storeName, addToCartTempItemId) =>
        set((prevState) => {
          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              return {
                ...store,
                cart: store.cart.filter(
                  (item) => item.addToCartTempItemId !== addToCartTempItemId
                ),
                cartDetails: {
                  ...store.cartDetails,
                },
              };
            }
            return store;
          });

          return { store: newStore };
        }),
      removeCart: (storeName) =>
        set((prevState) => {
          const stateLen = prevState.store.length;

          if (stateLen === 0) {
            return {
              store: [...prevState.store],
            };
          }

          const existingStore = prevState.store.find(
            (store) => store.storeName === storeName
          );

          if (!existingStore) {
            return {
              store: [...prevState.store],
            };
          }

          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              return {
                ...store,
                cart: [],
                cartDetails: {
                  ...store.cartDetails,
                },
              };
            }
            return store;
          });

          return { store: newStore };
        }),

      resetCartStore: (storeName, resetValues) =>
        set((prevState) => {
          const stateLen = prevState.store.length;

          if (stateLen === 0) {
            return {
              store: [...prevState.store],
            };
          }

          const existingStore = prevState.store.find(
            (store) => store.storeName === storeName
          );

          if (!existingStore) {
            return {
              store: [...prevState.store],
            };
          }
          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              return {
                ...store,
                cart: [],
                cartDetails: {
                  ...resetValues,
                },
              };
            }
            return store;
          });

          return { store: newStore };
        }),
      addSubtotal: (storeName, newSubtotalPenny) =>
        set((prevState) => {
          const stateLen = prevState.store.length;

          if (stateLen === 0) {
            return {
              store: [
                ...prevState.store,
                {
                  storeName,
                  cart: [],
                  cartDetails: {
                    ...prevState.store.cartDetails,
                    subtotalPenny: parseInt(newSubtotalPenny),
                    subtotalDisplay: `$${(
                      parseInt(newSubtotalPenny) / 100
                    ).toFixed(2)}`,
                  },
                },
              ],
            };
          }

          const existingStore = prevState.store.find(
            (store) => store.storeName === storeName
          );

          if (!existingStore) {
            return {
              store: [
                ...prevState.store,
                {
                  storeName,
                  cart: [],
                  cartDetails: {
                    ...prevState.store.cartDetails,
                    subtotalPenny: parseInt(newSubtotalPenny),
                    subtotalDisplay: `$${(
                      parseInt(newSubtotalPenny) / 100
                    ).toFixed(2)}`,
                  },
                },
              ],
            };
          }

          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              const currentSubtotalPenny = store.cartDetails?.subtotalPenny
                ? parseInt(store.cartDetails.subtotalPenny)
                : 0;

              const newSubtotalInPenny =
                currentSubtotalPenny + parseInt(newSubtotalPenny);

              const newSubtotalDisplay = `$${(newSubtotalInPenny / 100).toFixed(
                2
              )}`;

              return {
                ...store,
                cart: [...store.cart],
                cartDetails: {
                  ...store.cartDetails,
                  subtotalPenny: newSubtotalInPenny,
                  subtotalDisplay: newSubtotalDisplay,
                },
              };
            }
            return store;
          });

          return { store: newStore };
        }),

      subtractSubtotal: (storeName, newSubtotalPenny) =>
        set((prevState) => {
          const stateLen = prevState.store.length;

          if (stateLen === 0) {
            return {
              store: [...prevState.store],
            };
          }

          const existingStore = prevState.store.find(
            (store) => store.storeName === storeName
          );

          if (!existingStore) {
            return {
              store: [...prevState.store],
            };
          }

          const newStore = prevState.store.map((store) => {
            if (store.storeName === storeName) {
              const currentSubtotalPenny = store.cartDetails?.subtotalPenny
                ? parseInt(store.cartDetails.subtotalPenny)
                : 0;

              const newSubtotalInPenny =
                currentSubtotalPenny - parseInt(newSubtotalPenny);

              const newSubtotalDisplay = `$${(newSubtotalInPenny / 100).toFixed(
                2
              )}`;

              return {
                ...store,
                cart: [...store.cart],
                cartDetails: {
                  ...store.cartDetails,
                  subtotalPenny: newSubtotalInPenny,
                  subtotalDisplay: newSubtotalDisplay,
                },
              };
            }
            return store;
          });

          return { store: newStore };
        }),
    }),

    { name: "cart-storage" }
  )
);
