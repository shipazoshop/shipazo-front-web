import { memo } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Settings, LogOut } from "lucide-react";

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export const UserMenu = memo(function UserMenu({
  anchorEl,
  onClose,
}: UserMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{ sx: { mt: 1, minWidth: 200 } }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2">Mi Cuenta</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={onClose}>
        <Settings size={18} style={{ marginRight: 8 }} />
        Configuración
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose} sx={{ color: "error.main" }}>
        <LogOut size={18} style={{ marginRight: 8 }} />
        Cerrar sesión
      </MenuItem>
    </Menu>
  );
});
