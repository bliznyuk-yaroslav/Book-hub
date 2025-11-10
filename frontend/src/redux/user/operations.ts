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

export type Role = "USER" | "ADMIN";
export type User = {
  id: number;
  email: string;
  name?: string | null;
  role: Role;
  createdAt: string;
  booksCount?: number;
};

export const listUsers = createAsyncThunk("users/list", async () => {
  const { data } = await api.get<{ items: User[] }>("/admin/users");
  return data.items;
});

export const createUser = createAsyncThunk(
  "users/create",
  async (payload: {
    email: string;
    password: string;
    name?: string;
    role?: Role;
  }) => {
    const { data } = await api.post<{ user: User }>("/admin/users", payload);
    return data.user;
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (payload: {
    id: number;
    email?: string;
    password?: string;
    name?: string;
    role?: Role;
  }) => {
    const { id, ...body } = payload;
    const { data } = await api.patch<{ user: User }>(
      `/admin/users/${id}`,
      body,
    );
    return data.user;
  },
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: number) => {
    await api.delete(`/admin/users/${id}`);
    return id;
  },
);
