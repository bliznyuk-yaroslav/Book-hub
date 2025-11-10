"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
} from "@mui/material";

type Props = {
  open: boolean;
  book: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
};

export default function EditBookDialog({ open, book, onClose, onSave }: Props) {
  const [name, setName] = useState(book.name);
  const [author, setAuthor] = useState(book.author);
  const [photoUrl, setPhotoUrl] = useState(book.photoUrl || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave({ id: book.id, name, author, photoUrl: photoUrl || null });
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Редагувати книгу (Admin)</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <TextField
            label="Назва"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Автор"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <TextField
            label="Фото URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Скасувати
        </Button>
        <Button
          variant="contained"
          disabled={loading || !name || !author}
          onClick={handleSave}
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
