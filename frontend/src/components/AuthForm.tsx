"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Stack, Typography, Paper } from "@mui/material";

const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type AuthFormValues = z.infer<typeof schema>;

type Props = {
  title: string;
  buttonText: string;
  loading?: boolean;
  onSubmit: (values: AuthFormValues) => void;
};

export default function AuthForm({
  title,
  buttonText,
  loading = false,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <Stack alignItems="center" sx={{ p: 3 }}>
      <Paper sx={{ p: 3, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2}>
            <TextField
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Please wait..." : buttonText}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
