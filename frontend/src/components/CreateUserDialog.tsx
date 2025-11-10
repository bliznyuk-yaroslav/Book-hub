'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createUser, listUsers } from '@/redux/user/operations';
import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, Select, MenuItem, Button } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CreateUserDialog({ open, onClose, onCreated }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [loading, setLoading] = useState(false);

  const reset = () => { setEmail(''); setPassword(''); setName(''); setRole('USER'); };

  const handleCreate = async () => {
    try {
      setLoading(true);
      await dispatch(createUser({ email, password, name: name || undefined, role })).unwrap?.() ?? dispatch(createUser({ email, password, name: name || undefined, role }));
      await dispatch(listUsers());
      reset();
      onCreated?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <TextField label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth />
          <TextField label="Name" value={name} onChange={(e)=>setName(e.target.value)} fullWidth />
          <Select value={role} onChange={(e)=>setRole(e.target.value as any)}>
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" disabled={loading || !email || !password} onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
