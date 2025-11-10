"use client";
import { Stack, TextField, Select, MenuItem } from "@mui/material";

type Props = {
  q: string;
  sort: string;
  setQ: (val: string) => void;
  setSort: (val: "name" | "author" | "") => void;
};

export default function BooksFilters({ q, sort, setQ, setSort }: Props) {
  return (
    <Stack direction="row" gap={2}>
      <TextField label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      <Select
        value={sort}
        onChange={(e) => setSort(e.target.value as any)}
        displayEmpty
      >
        <MenuItem value="">No sort</MenuItem>
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="author">Author</MenuItem>
      </Select>
    </Stack>
  );
}
