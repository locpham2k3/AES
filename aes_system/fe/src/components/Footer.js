import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        color: "gray",
        width: "100%",
        textAlign: "center",
        bgcolor: "background.paper",
        position: "relative",
        mt: "auto", // Đảm bảo footer luôn ở dưới cùng
      }}
    >
      <Typography variant="body1">
        © {new Date().getFullYear()} AES Team. All rights reserved.
      </Typography>
      <Typography variant="body2">
        <Link href="/" color="inherit" sx={{ mx: 1 }}>
          Privacy Policy
        </Link>
        <Link href="/" color="inherit" sx={{ mx: 1 }}>
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
}
