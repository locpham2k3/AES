import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SlideBarMenu from "../components/SlideBarMenu/SlideBarMenu";
import {
  faHome,
  faBook,
  faPenAlt,
  faChalkboardTeacher,
  faCog,
  faFileAlt,
  faCheckCircle,
  faClipboardList,
  faHistory,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
// Danh sách menu cho SlideBar
const menuItems = [
  { label: "Dashboard", path: "/teacher/dashboard", icon: faHome },
  {
    label: "Grading",
    icon: faCheckCircle, // Suitable for grading or evaluation
    subItems: [
      {
        label: "Grade Assignments",
        path: "/teacher/feedback",
        icon: faClipboardList, // Represents task or list, fitting for grading assignments
        state: { isHistory: false }, // Set isHistory to false
      },
      {
        label: "Grading History",
        path: "/teacher/feedback",
        icon: faHistory, // Represents past actions, fitting for history
        state: { isHistory: true }, // Set isHistory to true
      },
    ],
  },

  // {
  //   label: "Class",
  //   icon: faChalkboardTeacher,
  //   subItems: [
  //     { label: "Essay", path: "/teacher/manage-essay", icon: faFileAlt },
  //     { label: "Manage", path: "/teacher/list-class", icon: faCog },
  //   ],
  // },

  {
    label: "Class",
    icon: faChalkboardTeacher,
    path: "/teacher/list-class",
  },

  {
    label: "Manage Essay",
    path: "/teacher/manage-essay",
    icon: faFileAlt,
  },
];
function TeacherLayout({ className = "container-fluid row", title }) {
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
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* SlideBarMenu */}
        <SlideBarMenu items={menuItems} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            padding: { xs: "10px", md: "20px" },
            marginLeft: { md: "200px" }, // Đẩy nội dung chính sang bên phải để tránh đè lên SlideBar
          }}
          className={className}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
export default TeacherLayout;
