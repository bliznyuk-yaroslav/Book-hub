"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  listBooks,
  adminUpdateBook,
  adminDeleteBook,
} from "@/redux/books/operations";
import { selectBooksList, selectBooksLoading } from "@/redux/books/selectors";
import { selectIsAuth, selectUser } from "@/redux/auth/selectors";
import { useRouter } from "next/navigation";
import {
  Stack,
  Typography,
  Pagination,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";

import BooksFilters from "@/components/BooksFilters";
import BookCard from "@/components/BookCard";
import EditBookDialog from "@/components/EditBookDialog";

export default function BooksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"name" | "author" | "">("");
  const [page, setPage] = useState(1);

  const data = useSelector(selectBooksList);
  const loading = useSelector(selectBooksLoading);
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector(selectUser);
  const isAdmin = user?.role === "ADMIN";

  const [editBook, setEditBook] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!isAuth && !token) {
      router.push("/login");
      return;
    }
    dispatch(
      listBooks({
        q: q || undefined,
        sort: sort || undefined,
        page,
        limit: 5,
      }),
    );
  }, [q, sort, page, isAuth, dispatch, router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цю книгу?")) return;
    await dispatch(adminDeleteBook(id));
    dispatch(listBooks({ q: q || undefined, sort: sort || undefined, page, limit: 5 }));
  };

  const handleSaveEdit = async (payload: any) => {
    await dispatch(adminUpdateBook(payload));
    setEditBook(null);
    dispatch(listBooks({ q: q || undefined, sort: sort || undefined, page, limit: 5 }));
  };

  return (
    <Stack gap={2} sx={{ p: 3 }}>
      <BooksFilters q={q} sort={sort} setQ={setQ} setSort={setSort} />
      {isAuth && (
        <Button variant="contained" component={Link} href="/me/books">
          My Books
        </Button>
      )}

      <Stack gap={2}>
        {loading && <Typography>Loading...</Typography>}
        {!loading && !data?.items?.length && (
          <Card>
            <CardContent>
              <Typography>No books found.</Typography>
            </CardContent>
          </Card>
        )}

        {data?.items?.map((item) => (
          <BookCard
            key={item.id}
            book={item as any}
            list
            isAdmin={isAdmin}
            onEdit={() => setEditBook(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </Stack>

      <Pagination
        count={data?.pages ?? 1}
        page={page}
        onChange={(_, v) => setPage(v)}
      />

      {editBook && (
        <EditBookDialog
          open={!!editBook}
          book={editBook}
          onClose={() => setEditBook(null)}
          onSave={handleSaveEdit}
        />
      )}
    </Stack>
  );
}
