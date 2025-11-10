"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { listUsers, updateUser, deleteUser, createUser } from '@/redux/user/operations';
import { selectUsers, selectUsersLoading } from "@/redux/user/selectors";
import { selectUser, selectIsAuth } from "@/redux/auth/selectors";
import { useRouter } from "next/navigation";
import { Stack, Typography, Button } from '@mui/material';
import AdminFilters from "@/components/AdminFilters";
import UserList from "@/components/UserList";
import CreateUserDialog from '@/components/CreateUserDialog';

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const currentUser = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const tokenExists =
      typeof window !== "undefined" && !!localStorage.getItem("token");
    if (!isAuth && !tokenExists) {
      router.push("/login");
      return;
    }
    if (currentUser) {
      if (currentUser.role !== "ADMIN") {
        router.push("/books");
        return;
      }
      dispatch(listUsers());
    }
  }, [isAuth, currentUser, dispatch, router]);

  const handleToggleRole = (id: number, currentRole: string) => {
    dispatch(
      updateUser({ id, role: currentRole === "ADMIN" ? "USER" : "ADMIN" }),
    );
  };

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  const filteredUsers = users?.filter((u) => {
    const matchEmail = query ? u.email.toLowerCase().includes(query.toLowerCase()) : true;
    const matchRole = roleFilter === 'ALL' ? true : u.role === roleFilter;
    return matchEmail && matchRole;
  });

  return (
    <Stack gap={2} sx={{ p: 3 }}>
      <Typography variant="h5">Admin: Users</Typography>

      <AdminFilters
        query={query}
        roleFilter={roleFilter}
        onQueryChange={setQuery}
        onRoleChange={setRoleFilter}
      />

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={() => setCreateOpen(true)}>Create User</Button>
      </Stack>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <UserList
          users={filteredUsers}
          onToggleRole={handleToggleRole}
          onDelete={handleDelete}
        />
      )}

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => dispatch(listUsers())}
      />
    </Stack>
  );
}
