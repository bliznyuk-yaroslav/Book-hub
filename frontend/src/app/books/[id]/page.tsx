"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { bookDetails } from "@/redux/books/operations";
import { selectBookCurrent } from "@/redux/books/selectors";
import { selectUser, selectBootstrapped } from '@/redux/auth/selectors';
import { Stack, Button, Typography } from "@mui/material";
import BookCard from "@/components/BookCard";
import ExchangeButton from "@/components/ExchangeButton";
import AdminActions from "@/components/AdminActions";
import AdminEditDialog from "@/components/AdminEditDialog";
import Notifications from "@/components/Notifications";

export default function BookDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const router = useRouter();
  const book = useSelector(selectBookCurrent);
  const user = useSelector(selectUser);
  const bootstrapped = useSelector(selectBootstrapped);
  const [okOpen, setOkOpen] = useState(false);
  const [errOpen, setErrOpen] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const numericId = Number(id);
  const isAuth = !!user;
  const isOwn = user && book && (book as any).owner?.id === user.id;
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!numericId) return;
    if (!bootstrapped) return; // wait until auth bootstrap completes
    if (!isAuth) { router.push('/login'); return; }
    dispatch(bookDetails(numericId));
  }, [numericId, dispatch, isAuth, bootstrapped, router]);

  if (!numericId) return <Typography sx={{ p: 3 }}>Invalid book id</Typography>;

  return (
    <Stack gap={2} sx={{ p: 3 }}>
      <Button variant="text" onClick={() => history.back()}>
        &larr; Back
      </Button>

      <BookCard book={book} />

      {isAdmin && (
        <AdminActions
          book={book}
          bookId={numericId}
          onEdit={() => setEditOpen(true)}
          setOkOpen={setOkOpen}
          setErrOpen={setErrOpen}
        />
      )}

      <ExchangeButton
        bookId={numericId}
        isOwn={!!isOwn}
        isAuth={isAuth}
        setOkOpen={setOkOpen}
        setErrOpen={setErrOpen}
      />

      <AdminEditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        book={book}
        bookId={numericId}
        setOkOpen={setOkOpen}
        setErrOpen={setErrOpen}
      />

      <Notifications
        okOpen={okOpen}
        setOkOpen={setOkOpen}
        errOpen={errOpen}
        setErrOpen={setErrOpen}
        successMessage="Exchange request sent"
      />
    </Stack>
  );
}
