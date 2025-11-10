import { RootState } from "@/redux/store";

export const selectBooksList = (s: RootState) => s.books.list;
export const selectBooksLoading = (s: RootState) => s.books.loading;
export const selectBooksError = (s: RootState) => s.books.error;
export const selectBookCurrent = (s: RootState) => s.books.current;
export const selectMyBooks = (s: RootState) => s.books.my;
