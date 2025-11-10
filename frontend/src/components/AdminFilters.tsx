"use client";
import { Stack, TextField, Select, MenuItem } from "@mui/material";

type Props = {
  query: string;
  roleFilter: "ALL" | "USER" | "ADMIN";
  onQueryChange: (value: string) => void;
  onRoleChange: (value: "ALL" | "USER" | "ADMIN") => void;
};

export default function AdminFilters({
  query,
  roleFilter,
  onQueryChange,
  onRoleChange,
}: Props) {
  return (
    <Stack direction="row" gap={2}>
      <TextField
        label="Search by email"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <Select
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value as any)}
      >
        <MenuItem value="ALL">ALL</MenuItem>
        <MenuItem value="USER">USER</MenuItem>
        <MenuItem value="ADMIN">ADMIN</MenuItem>
      </Select>
    </Stack>
  );
}
