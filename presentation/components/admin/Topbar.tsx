import { memo, type MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { Menu as MenuIcon, Bell, Search } from "lucide-react";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material/styles";

interface TopbarProps {
  isDesktop: boolean;
  onDrawerToggle: () => void;
  onUserMenuOpen: (event: MouseEvent<HTMLElement>) => void;
}

export const Topbar = memo(function Topbar({
  isDesktop,
  onDrawerToggle,
  onUserMenuOpen,
}: TopbarProps) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
        backdropFilter: "blur(8px)",
        background: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, lg: 3 }, minHeight: { xs: 64, md: 70 } }}>
        {/* Left side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          {!isDesktop && (
            <IconButton
              edge="start"
              onClick={onDrawerToggle}
              sx={{
                color: "primary.main",
                "&:hover": {
                  bgcolor: alpha("#ff3d3d", 0.08),
                },
              }}
            >
              <MenuIcon size={22} />
            </IconButton>
          )}

          {/* Search bar - solo visible en desktop */}
          {isDesktop && (
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                backgroundColor: alpha("#f5f5f5", 0.8),
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                "&:focus-within": {
                  backgroundColor: "#fff",
                  boxShadow: `0 0 0 2px ${alpha("#ff3d3d", 0.2)}`,
                },
                marginLeft: 0,
                width: "100%",
                maxWidth: 400,
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Box
                sx={{
                  padding: (theme) => theme.spacing(0, 2),
                  height: "100%",
                  position: "absolute",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={18} color="#909090" />
              </Box>
              <InputBase
                placeholder="Buscar órdenes, productos..."
                sx={{
                  color: "inherit",
                  width: "100%",
                  "& .MuiInputBase-input": {
                    padding: (theme) => theme.spacing(1.25, 1.5, 1.25, 0),
                    paddingLeft: (theme) => `calc(1em + ${theme.spacing(4)})`,
                    transition: (theme) => theme.transitions.create("width"),
                    fontSize: "0.9rem",
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Notifications */}
          <IconButton
            sx={{
              color: "text.secondary",
              "&:hover": {
                bgcolor: alpha("#ff3d3d", 0.08),
                color: "primary.main",
              },
            }}
          >
            <Badge
              badgeContent={3}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.65rem",
                  height: 18,
                  minWidth: 18,
                  padding: "0 4px",
                  fontWeight: 700,
                },
              }}
            >
              <Bell size={20} />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <Box
            onClick={onUserMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              ml: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: 999,
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: alpha("#ff3d3d", 0.08),
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                background: "linear-gradient(135deg, #ff3d3d 0%, #ff6b6b 100%)",
                boxShadow: "0px 2px 8px rgba(255, 61, 61, 0.25)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                AD
              </Typography>
            </Avatar>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  lineHeight: 1.2,
                }}
              >
                Admin
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                Administrador
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});
