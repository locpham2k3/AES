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
  { label: "Report", path: "/referee/report", icon: faHome },

  //   {
  //     label: "Class",
  //     icon: faChalkboardTeacher,
  //     subItems: [
  //       { label: "Workbook", path: "/teacher/manage-workbook", icon: faBook },
  //       { label: "Essay", path: "/teacher/manage-essay", icon: faFileAlt },
  //       { label: "Manage", path: "/teacher/class/manage", icon: faCog },
  //     ],
  //   },

  //   {
  //     label: "Settings",
  //     icon: faCog,
  //     subItems: [
  //       { label: "General Settings", path: "/settings/general", icon: faCog },
  //       { label: "Account Settings", path: "/settings/account", icon: faUserCog },
  //     ],
  //   },
];
function RefereeLayout({ className = "container-fluid row", title }) {
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
export default RefereeLayout;
