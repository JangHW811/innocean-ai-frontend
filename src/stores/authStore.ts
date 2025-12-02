import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreState {
  isAuthenticated: boolean;
  email: string | null;
  setAuth: (email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      setAuth: (email) => set({ isAuthenticated: true, email }),
      clearAuth: () => set({ isAuthenticated: false, email: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
