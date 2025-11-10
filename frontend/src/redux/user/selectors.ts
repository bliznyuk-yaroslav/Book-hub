import { RootState } from "@/redux/store";

export const selectUsers = (s: RootState) => s.users.items;
export const selectUsersLoading = (s: RootState) => s.users.loading;
export const selectUsersError = (s: RootState) => s.users.error;
