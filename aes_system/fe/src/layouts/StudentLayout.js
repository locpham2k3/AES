import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import {
  faHome,
  faMedal,
  faUserGraduate,
  faAward,
  faStar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import SlideBarMenu from "../components/SlideBarMenu/SlideBarMenu";

// Danh sách menu cho SlideBar
const menuItems = [
  { label: "Dashboard", path: "dashboard", icon: faHome },
  { label: "Beginner", path: "essay/Beginner", icon: faMedal },
  { label: "Intermediate", path: "essay/Intermediate", icon: faUserGraduate },
  { label: "Advanced", path: "essay/Advanced", icon: faAward },
  { label: "Class", path: "list-class", icon: faStar },
  { label: "Graded Essays", path: "essay-greade", icon: faCheckCircle }, // Mục mới để xem bài đã chấm
];

function StudentLayout({ className = "container-fluid row", title }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <SlideBarMenu
        items={menuItems}
        style={{
          position: "fixed", // Sidebar stays fixed
          width: "250px", // Fixed width
          height: "100vh", // Full height
          zIndex: 1000, // Ensure it's on top of other content
        }}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          marginLeft: "250px", // Avoid overlap by leaving space for sidebar
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px", // Add padding for better spacing
        }}
        className={className}
      >
        <Header />
        <Outlet />
        <Footer />
      </Box>
    </Box>
  );
}

export default StudentLayout;
