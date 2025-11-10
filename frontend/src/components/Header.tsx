"use client";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/auth/slice";
import { selectUser, selectIsAuth } from "@/redux/auth/selectors";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const tokenExists =
    mounted && typeof window !== "undefined" && !!localStorage.getItem("token");
  const authed = isAuth || tokenExists;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Book Hub
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {!mounted ? null : authed ? (
          <>
            <Button color="inherit" component={Link} href="/books">
              Books
            </Button>
            <Button color="inherit" component={Link} href="/me/books">
              My books
            </Button>
            {user?.role === "ADMIN" && (
              <Button color="inherit" component={Link} href="/admin">
                Admin
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} href="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
