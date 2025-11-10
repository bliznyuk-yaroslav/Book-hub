"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { myBooks, deleteMyBook } from "@/redux/books/operations";
import { selectMyBooks } from "@/redux/books/selectors";
import { selectIsAuth } from "@/redux/auth/selectors";
import { useRouter } from "next/navigation";
import { Stack, Button, Card, CardContent, Typography } from "@mui/material";
import AddBookDialog from "@/components/AddBookDialog";
import BookCard from "@/components/BookCard";
import Notifications from "@/components/Notifications";

export default function MyBooksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectMyBooks);
  const isAuth = useSelector(selectIsAuth);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    const tokenExists =
      typeof window !== "undefined" && !!localStorage.getItem("token");
    if (!isAuth && !tokenExists) {
      router.push("/login");
      return;
    }
    if (isAuth || tokenExists) dispatch(myBooks());
  }, [isAuth, dispatch, router]);

  return (
    <Stack gap={2} sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add
        </Button>
      </Stack>

      <AddBookDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => setSnackOpen(true)}
      />

      {(!items || items.length === 0) ? (
        <Card>
          <CardContent>
            <Typography>You have no books yet.</Typography>
          </CardContent>
        </Card>
      ) : (
        items.map((b) => (
          <BookCard
            key={b.id}
            book={b as any}
            list
            onDelete={() => dispatch(deleteMyBook(b.id))}
          />
        ))
      )}

      <Notifications
        okOpen={snackOpen}
        setOkOpen={setSnackOpen}
        errOpen={null}
        setErrOpen={() => {}}
        successMessage="Книгу додано успішно"
      />
    </Stack>
  );
}
