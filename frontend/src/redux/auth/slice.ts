import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMe } from "./operations";

export type AuthState = {
  token: string | null;
  user?: {
    id: number;
    email: string;
    role: "USER" | "ADMIN";
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
  bootstrapped: boolean;
};

const initialState: AuthState = { token: null, user: null, bootstrapped: false };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) localStorage.setItem("token", action.payload);
        else localStorage.removeItem("token");
      }
    },
    hydrateFromStorage(state) {
      if (typeof window !== "undefined")
        state.token = localStorage.getItem("token");
    },
    logout(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") localStorage.removeItem("token");
    },
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.bootstrapped = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.user = action.payload;
      state.bootstrapped = true;
    });
    builder.addCase(fetchMe.rejected, (state) => {
      state.bootstrapped = true;
    });
  },
});

export const { setToken, hydrateFromStorage, logout, setBootstrapped } = slice.actions;
export default slice.reducer;
