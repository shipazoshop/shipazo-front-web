import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { AlertTriangle } from "lucide-react";
import Box from "@mui/material/Box";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export function ConfirmationModal({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {danger && (
          <Box
            sx={{
              color: "error.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <AlertTriangle size={24} />
          </Box>
        )}
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading} color="inherit">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={danger ? "error" : "primary"}
          disabled={loading}
          autoFocus
        >
          {loading ? "Procesando..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
