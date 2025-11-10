import { createSlice } from "@reduxjs/toolkit";
import {
  listBooks,
  bookDetails,
  myBooks,
  addMyBook,
  deleteMyBook,
} from "./operations";

export type Book = {
  id: number;
  name: string;
  author: string;
  photoUrl?: string | null;
  ownerId: number;
};

export type BooksState = {
  list: {
    items: Book[];
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  current:
    | (Book & { owner?: { id: number; email: string; name?: string | null } })
    | null;
  my: Book[];
  loading: boolean;
  error?: string | null;
};

const initialState: BooksState = {
  list: null,
  current: null,
  my: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listBooks.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(listBooks.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(listBooks.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || "Failed to load books";
      })
      .addCase(bookDetails.fulfilled, (s, a) => {
        s.current = a.payload as any;
      })
      .addCase(myBooks.fulfilled, (s, a) => {
        s.my = a.payload;
      })
      .addCase(addMyBook.fulfilled, (s, a) => {
        s.my = [a.payload, ...s.my];
      })
      .addCase(deleteMyBook.fulfilled, (s, a) => {
        s.my = s.my.filter((b) => b.id !== a.payload);
      });
  },
});

export default slice.reducer;
