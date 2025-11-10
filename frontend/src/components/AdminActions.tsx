import { Stack, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { adminDeleteBook } from "@/redux/books/operations";

export default function AdminActions({
  book,
  bookId,
  onEdit,
  setOkOpen,
  setErrOpen,
}: any) {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
    if (!confirm("Видалити цю книгу?")) return;
    try {
      (await dispatch(adminDeleteBook(bookId)).unwrap?.()) ??
        dispatch(adminDeleteBook(bookId));
      setOkOpen(true);
      history.back();
    } catch (e: any) {
      setErrOpen(e?.message || "Не вдалося видалити книгу");
    }
  };

  return (
    <Stack direction="row" gap={1}>
      <Button variant="outlined" onClick={onEdit}>
        Edit (Admin)
      </Button>
      <Button color="error" variant="outlined" onClick={handleDelete}>
        Delete (Admin)
      </Button>
    </Stack>
  );
}
