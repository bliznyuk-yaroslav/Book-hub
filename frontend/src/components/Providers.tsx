"use client";
import { ReactNode, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, type AppDispatch } from "@/redux/store";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { selectUser } from "@/redux/auth/selectors";
import { fetchMe } from "@/redux/auth/operations";
import { setToken, setBootstrapped } from '@/redux/auth/slice';

const theme = createTheme({ palette: { mode: "dark" } });

function Bootstrap({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      dispatch(setToken(token));
      if (!user) dispatch(fetchMe());
    } else {
      dispatch(setBootstrapped(true));
    }
  }, [dispatch, user]);
  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Bootstrap>{children}</Bootstrap>
      </ThemeProvider>
    </Provider>
  );
}
