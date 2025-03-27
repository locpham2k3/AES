import React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import TotalUserAndClass from "./TotalUserAndClass";
import TotalTaskAndComplain from "./TotalTaskAndComplain";

// Chỉnh sửa Select style
const selectStyle = {
  "& .MuiSelect-root": {
    padding: "8px 12px", // Thêm padding để chọn dễ dàng hơn
  },
  "& .MuiInputBase-root": {
    borderRadius: "8px", // Bo góc của select
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#B2DFDB", // Màu viền nhẹ cho Select
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#00796B", // Màu viền khi hover
  },
  "& .MuiSelect-icon": {
    color: "#00796B", // Màu icon khi hover
  },
};

const DasboardAdmin = () => {
  const tokens = {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
  console.log(tokens);

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography
        variant="h4"
        color="primary"
        gutterBottom
        sx={{ mb: 4, fontWeight: 600 }}
      >
        Admin Dashboard
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          {/* Summary Cards */}
          <Grid item xs={12} md={12}>
            <TotalUserAndClass tokens={tokens} />
          </Grid>

          {/* Grading Effect */}
          <Grid item xs={12} md={12}>
            <TotalTaskAndComplain tokens={tokens} />
          </Grid>

          {/* Average Score with Class Selection */}
          <Grid item xs={12} md={12}></Grid>

          {/* Task Expiry List */}
          <Grid item xs={12}></Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DasboardAdmin;
