import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { requestExchange } from "@/redux/books/operations";
import { Button, Tooltip } from "@mui/material";

export default function ExchangeButton({
  bookId,
  isOwn,
  isAuth,
  setOkOpen,
  setErrOpen,
}: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [pending, setPending] = useState(false);

  const disabled = pending || isOwn || !isAuth;
  const disabledReason = !isAuth
    ? "Log in to send a request"
    : isOwn
      ? "It's your own book — you can't request exchange for it"
      : "";

  const handleRequest = async () => {
    try {
      setPending(true);
      (await dispatch(requestExchange(bookId)).unwrap?.()) ??
        dispatch(requestExchange(bookId));
      setOkOpen(true);
    } catch (e: any) {
      setErrOpen(e?.message || "Failed to send request");
    } finally {
      setPending(false);
    }
  };

  return (
    <Tooltip
      title={disabled ? disabledReason : ""}
      disableHoverListener={!disabled}
      arrow
    >
      <span>
        <Button variant="contained" disabled={disabled} onClick={handleRequest}>
          Request exchange
        </Button>
      </span>
    </Tooltip>
  );
}
