"use client";
import { Card, CardContent, Stack, Typography, Button } from "@mui/material";

type Props = {
  user: {
    id: number;
    email: string;
    role: "USER" | "ADMIN";
    booksCount?: number;
  };
  onToggleRole: (id: number, role: "USER" | "ADMIN") => void;
  onDelete: (id: number) => void;
};

export default function UserCard({ user, onToggleRole, onDelete }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography sx={{ minWidth: 500 }}>{user.email}</Typography>
          <Typography sx={{ minWidth: 120 }}>{user.role}</Typography>
          <Typography sx={{ minWidth: 140 }}>
            Books: {user.booksCount ?? 0}
          </Typography>
          <Button size="small" onClick={() => onToggleRole(user.id, user.role)}>
            Toggle Role
          </Button>
          <Button color="error" size="small" onClick={() => onDelete(user.id)}>
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
