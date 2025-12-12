import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export function AdminShellSkeleton() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Topbar Skeleton */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          zIndex: 1200,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Skeleton variant="text" width={200} height={32} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </Box>

      {/* Sidebar Skeleton - Desktop only */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: 260,
          borderRight: 1,
          borderColor: "divider",
          pt: 8,
        }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 1.5 }} />
          ))}
        </Box>
      </Box>

      {/* Content Skeleton */}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, lg: 4 },
          pt: { xs: 10, lg: 11 },
        }}
      >
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    </Box>
  );
}
