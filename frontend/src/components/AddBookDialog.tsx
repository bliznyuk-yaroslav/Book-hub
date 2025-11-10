"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addMyBook, myBooks } from "@/redux/books/operations";
import {
  Stack,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddBookDialog({ open, onClose, onSuccess }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setAuthor("");
    setPhotoUrl("");
    setFile(undefined);
    setPreviewUrl("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await dispatch(
      addMyBook({
        name,
        author,
        photoFile: file,
        photoUrl: file ? undefined : photoUrl || undefined,
      }),
    );
    await dispatch(myBooks());
    setSubmitting(false);
    resetForm();
    onSuccess();
    onClose();
  };

  const handleFileChange = (f?: File) => {
    setFile(f);
    if (f) setPreviewUrl(URL.createObjectURL(f));
  };

  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add a Book</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            fullWidth
          />
          <TextField
            label="Photo URL"
            value={photoUrl}
            onChange={(e) => {
              setPhotoUrl(e.target.value);
              setPreviewUrl(e.target.value);
            }}
            fullWidth
          />
          <Button variant="outlined" component="label">
            Upload file
            <input
              hidden
              type="file"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
          </Button>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              style={{ maxWidth: 240, borderRadius: 8 }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !name || !author}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
