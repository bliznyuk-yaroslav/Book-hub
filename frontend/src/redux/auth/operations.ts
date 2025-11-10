import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setToken } from "./slice";

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

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: { email: string; password: string }, { dispatch }) => {
    const { data } = await api.post<{ access_token: string }>(
      "/auth/register",
      payload,
    );
    dispatch(setToken(data.access_token));
    await dispatch(fetchMe());
    return data.access_token;
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { dispatch }) => {
    const { data } = await api.post<{ access_token: string }>(
      "/auth/login",
      payload,
    );
    dispatch(setToken(data.access_token));
    await dispatch(fetchMe());
    return data.access_token;
  },
);

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const { data } = await api.get<{
    user: {
      id: number;
      email: string;
      role: "USER" | "ADMIN";
      name?: string | null;
      avatarUrl?: string | null;
    };
  }>("/auth/me");
  return data.user;
});
export async function loginDirect(
  dispatch: any,
  payload: { email: string; password: string },
) {
  const { data } = await api.post<{ access_token: string }>(
    "/auth/login",
    payload,
  );
  dispatch(setToken(data.access_token));
  await dispatch(fetchMe());
}

export async function registerDirect(
  dispatch: any,
  payload: { email: string; password: string },
) {
  const { data } = await api.post<{ access_token: string }>(
    "/auth/register",
    payload,
  );
  dispatch(setToken(data.access_token));
  await dispatch(fetchMe());
}
