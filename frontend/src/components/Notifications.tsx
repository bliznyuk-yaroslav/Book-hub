import { Snackbar, Alert } from "@mui/material";

type Props = {
  okOpen: boolean;
  setOkOpen: (v: boolean) => void;
  errOpen: string | null;
  setErrOpen: (v: string | null) => void;
  successMessage?: string;
};

export default function Notifications({
  okOpen,
  setOkOpen,
  errOpen,
  setErrOpen,
  successMessage,
}: Props) {
  return (
    <>
      <Snackbar
        open={okOpen}
        autoHideDuration={2500}
        onClose={() => setOkOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setOkOpen(false)}
          sx={{ width: "100%" }}
        >
          {successMessage || "Success"}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errOpen}
        autoHideDuration={3000}
        onClose={() => setErrOpen(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setErrOpen(null)}
          sx={{ width: "100%" }}
        >
          {errOpen}
        </Alert>
      </Snackbar>
    </>
  );
}
