import { createSlice } from "@reduxjs/toolkit";
import { listUsers, createUser, updateUser, deleteUser } from "./operations";

export type Role = "USER" | "ADMIN";
export type User = {
  id: number;
  email: string;
  name?: string | null;
  role: Role;
  createdAt: string;
  booksCount?: number;
};

export type UsersState = {
  items: User[];
  loading: boolean;
  error?: string | null;
};

const initialState: UsersState = { items: [], loading: false, error: null };

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(listUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(listUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || "Failed to load users";
      })
      .addCase(createUser.fulfilled, (s, a) => {
        s.items = [a.payload, ...s.items];
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        s.items = s.items.map((u) => (u.id === a.payload.id ? a.payload : u));
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.items = s.items.filter((u) => u.id !== a.payload);
      });
  },
});

export default slice.reducer;
