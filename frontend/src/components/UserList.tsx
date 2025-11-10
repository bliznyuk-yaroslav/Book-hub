"use client";
import { Stack } from "@mui/material";
import UserCard from "@/components/UserCard";

type Props = {
  users: Array<{
    id: number;
    email: string;
    role: "USER" | "ADMIN";
    booksCount?: number;
  }>;
  onToggleRole: (id: number, role: "USER" | "ADMIN") => void;
  onDelete: (id: number) => void;
};

export default function UserList({ users, onToggleRole, onDelete }: Props) {
  if (!users?.length) return null;

  return (
    <Stack gap={2}>
      {users.map((u) => (
        <UserCard
          key={u.id}
          user={u}
          onToggleRole={onToggleRole}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
}
