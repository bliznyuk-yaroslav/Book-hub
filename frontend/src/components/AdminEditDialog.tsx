import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { adminUpdateBook, bookDetails } from "@/redux/books/operations";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
} from "@mui/material";

export default function AdminEditDialog({
  open,
  onClose,
  book,
  bookId,
  setOkOpen,
  setErrOpen,
}: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [editName, setEditName] = useState(book?.name || "");
  const [editAuthor, setEditAuthor] = useState(book?.author || "");
  const [editPhotoUrl, setEditPhotoUrl] = useState(book?.photoUrl || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    try {
      setSubmitting(true);
      (await dispatch(
        adminUpdateBook({
          id: bookId,
          name: editName,
          author: editAuthor,
          photoUrl: editPhotoUrl || null,
        }),
      ).unwrap?.()) ??
        dispatch(
          adminUpdateBook({
            id: bookId,
            name: editName,
            author: editAuthor,
            photoUrl: editPhotoUrl || null,
          }),
        );
      setOkOpen(true);
      dispatch(bookDetails(bookId));
      onClose();
    } catch (e: any) {
      setErrOpen(e?.message || "Failed to update book");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit book (Admin)</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Author"
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
            fullWidth
          />
          <TextField
            label="Photo URL"
            value={editPhotoUrl}
            onChange={(e) => setEditPhotoUrl(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={submitting || !editName || !editAuthor}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
