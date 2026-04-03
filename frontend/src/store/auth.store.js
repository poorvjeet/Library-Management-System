import { create } from "zustand";

const LS_KEY = "library_token";
const LS_USER = "library_user";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem(LS_KEY) || "",
  user: JSON.parse(localStorage.getItem(LS_USER) || "null"),
  setAuth: ({ token, user }) => {
    localStorage.setItem(LS_KEY, token);
    localStorage.setItem(LS_USER, JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_USER);
    set({ token: "", user: null });
  }
}));

