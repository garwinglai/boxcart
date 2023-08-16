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
