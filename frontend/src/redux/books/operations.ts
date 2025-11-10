import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});
api.interceptors.request.use((config: any) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token)
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
  }
  return config;
});

export type Book = {
  id: number;
  name: string;
  author: string;
  photoUrl?: string | null;
  ownerId: number;
};

export const listBooks = createAsyncThunk(
  "books/list",
  async (params: {
    q?: string;
    sort?: "name" | "author";
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get<{
      items: Book[];
      page: number;
      limit: number;
      total: number;
      pages: number;
    }>("/books", { params });
    return data;
  },
);

export const bookDetails = createAsyncThunk(
  "books/details",
  async (id: number) => {
    const { data } = await api.get<{
      book: Book & {
        owner: { id: number; email: string; name?: string | null };
      };
    }>(`/books/${id}`);
    return data.book;
  },
);

export const myBooks = createAsyncThunk("books/my", async () => {
  const { data } = await api.get<{ items: Book[] }>("/me/books");
  return data.items;
});

export const addMyBook = createAsyncThunk(
  "books/addMy",
  async (payload: {
    name: string;
    author: string;
    photoFile?: File;
    photoUrl?: string;
  }) => {
    if (payload.photoFile) {
      const form = new FormData();
      form.append("name", payload.name);
      form.append("author", payload.author);
      form.append("photo", payload.photoFile);
      const { data } = await api.post<{ book: Book }>("/me/books", form);
      return data.book;
    } else {
      const { data } = await api.post<{ book: Book }>("/me/books", {
        name: payload.name,
        author: payload.author,
        photoUrl: payload.photoUrl,
      });
      return data.book;
    }
  },
);

export const deleteMyBook = createAsyncThunk(
  "books/deleteMy",
  async (id: number) => {
    await api.delete(`/me/books/${id}`);
    return id;
  },
);

export const requestExchange = createAsyncThunk(
  "books/requestExchange",
  async (id: number) => {
    await api.post(`/books/${id}/exchange`);
    return id;
  },
);

export const adminUpdateBook = createAsyncThunk(
  "books/adminUpdate",
  async (payload: {
    id: number;
    name?: string;
    author?: string;
    photoUrl?: string | null;
    photoFile?: File;
  }) => {
    const { id, name, author, photoUrl, photoFile } = payload;
    if (photoFile) {
      const form = new FormData();
      if (typeof name === "string") form.append("name", name);
      if (typeof author === "string") form.append("author", author);
      form.append("photo", photoFile);
      const { data } = await api.patch<{ book: Book }>(
        `/admin/books/${id}`,
        form,
      );
      return data.book;
    }
    const body: any = {};
    if (typeof name === "string") body.name = name;
    if (typeof author === "string") body.author = author;
    if (typeof photoUrl !== "undefined") body.photoUrl = photoUrl;
    const { data } = await api.patch<{ book: Book }>(
      `/admin/books/${id}`,
      body,
    );
    return data.book;
  },
);

export const adminDeleteBook = createAsyncThunk(
  "books/adminDelete",
  async (id: number) => {
    await api.delete(`/admin/books/${id}`);
    return id;
  },
);
