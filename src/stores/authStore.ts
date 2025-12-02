import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreState {
  isAuthenticated: boolean;
  id: string | null;
  setAuth: (id: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      id: null,
      setAuth: (id) => set({ isAuthenticated: true, id }),
      clearAuth: () => set({ isAuthenticated: false, id: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
