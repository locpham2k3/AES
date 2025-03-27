import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function DefaultLayout({ className = "container-fluid row", title }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          //   justifyContent: "center", // Đảm bảo nội dung được căn giữa theo chiều dọc
        }}
        className={className}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default DefaultLayout;
