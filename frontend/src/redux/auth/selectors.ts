import { RootState } from "@/redux/store";

export const selectToken = (s: RootState) => s.auth.token;
export const selectIsAuth = (s: RootState) => Boolean(s.auth.token);
export const selectUser = (s: RootState) => s.auth.user;
export const selectRole = (s: RootState) => s.auth.user?.role;
export const selectBootstrapped = (s: RootState) => s.auth.bootstrapped;
