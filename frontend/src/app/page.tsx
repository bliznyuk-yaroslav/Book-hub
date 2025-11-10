"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUser, selectIsAuth } from "@/redux/auth/selectors";
import { Stack, Button, Typography, Paper } from "@mui/material";

export default function Home() {
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);
  return (
    <Stack alignItems="center" sx={{ p: 4 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 720 }}>
        <Typography variant="h4" gutterBottom>
          Book Hub
        </Typography>
        <Typography variant="body1" gutterBottom>
          A platform to add your books, browse others, and request exchanges.
        </Typography>
        <Stack direction="row" gap={2} sx={{ mt: 2 }}>
          {isAuth ? (
            <>
              <Button variant="contained" component={Link} href="/books">
                Go to Books
              </Button>
              <Button variant="outlined" component={Link} href="/me/books">
                My Books
              </Button>
              {user?.role === "ADMIN" && (
                <Button variant="outlined" component={Link} href="/admin">
                  Admin
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="contained" component={Link} href="/login">
                Log In
              </Button>
              <Button variant="outlined" component={Link} href="/register">
                Register
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
