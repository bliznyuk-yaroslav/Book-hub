import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slice";
import booksReducer from "./books/slice";
import usersReducer from "./user/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
