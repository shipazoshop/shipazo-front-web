import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";

export function OrdersTableSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Filters Skeleton */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flex: 1,
            maxWidth: 700,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Skeleton variant="rectangular" height={40} sx={{ flex: 1, borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={40} width={180} sx={{ borderRadius: 1 }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="rectangular" height={32} width={100} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>

      {/* Table Skeleton */}
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        {/* Table Header */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Skeleton variant="text" width="15%" />
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="15%" />
          <Skeleton variant="text" width="15%" />
          <Skeleton variant="text" width="15%" />
          <Skeleton variant="text" width="15%" />
        </Box>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ display: "flex", gap: 2, mb: 1.5 }}>
            <Skeleton variant="text" width="15%" />
            <Skeleton variant="text" width="25%" />
            <Skeleton variant="rectangular" width="15%" height={24} sx={{ borderRadius: 3 }} />
            <Skeleton variant="text" width="15%" />
            <Skeleton variant="text" width="15%" />
            <Skeleton variant="rectangular" width="15%" height={32} sx={{ borderRadius: 1 }} />
          </Box>
        ))}

        {/* Pagination Skeleton */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Skeleton variant="text" width={200} />
          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
        </Box>
      </Paper>
    </Box>
  );
}
