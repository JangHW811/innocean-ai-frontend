import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStoreState {
  isAuthenticated: boolean;
  id: string | null;
  hasHydrated: boolean;
  setAuth: (id: string) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      id: null,
      hasHydrated: false,
      setAuth: (id) => set({ isAuthenticated: true, id }),
      clearAuth: () => set({ isAuthenticated: false, id: null }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
