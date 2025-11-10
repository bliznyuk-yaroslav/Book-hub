import { Card, CardContent, Typography, Stack, Button } from "@mui/material";
import Link from "next/link";

type Book = {
  id: number;
  name: string;
  author: string;
  photoUrl?: string | null;
  owner?: { id: number; email: string; name?: string | null };
};

type Props = {
  book: Book | null;
  list?: boolean; // when true, render compact row with link
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function BookCard({
  book,
  list = false,
  isAdmin,
  onEdit,
  onDelete,
}: Props) {
  if (!book) return null;

  if (list) {
    return (
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ py: 1.5, px: 2 }}>
          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack
              component={Link}
              href={`/books/${book.id}`}
              sx={{
                flex: 1,
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {book.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {book.author}
              </Typography>
              {book.owner?.email && (
                <Typography variant="caption" color="text.secondary">
                  Owner: {book.owner.email}
                </Typography>
              )}
            </Stack>
            {isAdmin && (
              <Stack direction="row" gap={1}>
                {onEdit && (
                  <Button variant="outlined" size="small" onClick={onEdit}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={1} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {book.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {book.author}
        </Typography>
        {book.owner?.email && (
          <Typography variant="body2" sx={{ mt: 0.5 }} color="text.secondary">
            Owner: {book.owner.email}
          </Typography>
        )}
        {book.photoUrl && (
          <img
            src={book.photoUrl}
            alt={book.name}
            style={{
              maxWidth: 320,
              marginTop: 12,
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
