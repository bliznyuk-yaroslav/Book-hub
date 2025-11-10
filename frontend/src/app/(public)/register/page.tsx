"use client";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { registerDirect } from "@/redux/auth/operations";
import { useRouter } from "next/navigation";
import { selectIsAuth } from "@/redux/auth/selectors";
import AuthForm, { AuthFormValues } from "@/components/AuthForm";
import Notifications from "@/components/Notifications";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAuth = useSelector(selectIsAuth);
  const [submitting, setSubmitting] = useState(false);
  const [okOpen, setOkOpen] = useState(false);
  const [errOpen, setErrOpen] = useState<string | null>(null);

  useEffect(() => {
    const tokenExists =
      typeof window !== "undefined" && !!localStorage.getItem("token");
    if (isAuth || tokenExists) router.replace("/books");
  }, [isAuth, router]);

  const onSubmit = async (values: AuthFormValues) => {
    try {
      setSubmitting(true);
      await registerDirect(dispatch, values);
      setOkOpen(true);
      router.push("/books");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Registration failed";
      setErrOpen(Array.isArray(msg) ? msg[0] : String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack alignItems="center" sx={{ p: 3 }}>
      <AuthForm
        title="Register"
        buttonText="Register"
        loading={submitting}
        onSubmit={onSubmit}
      />
      <Notifications
        okOpen={okOpen}
        setOkOpen={setOkOpen}
        errOpen={errOpen}
        setErrOpen={setErrOpen}
        successMessage="Registered successfully"
      />
    </Stack>
  );
}
