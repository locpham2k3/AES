import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Profile from "./AppBar/Profile";
// import SidebarMenu from "./SlideBarMenu/SlideBarMenu";
import LoginIcon from "@mui/icons-material/Login";
import Logo from "../assets/Logo.ico";

export default function Header() {
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // Accessing the state directly from Redux store
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = Boolean(user); // Check if user is logged in

  // const menuItems = [
  //   { label: "Home", path: "/" },
  //   { label: "About", path: "/about" },
  //   { label: "Contact", path: "/contact" },
  // ];

  // const toggleDrawer = () => {
  //   setDrawerOpen((prevOpen) => !prevOpen);
  // };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ boxShadow: "none" }}>
        <Toolbar sx={{ padding: 0 }}>
          <Box sx={{ flexGrow: 1 }}>
            <img
              src={Logo}
              alt="AES Team Logo"
              style={{ height: "65px", cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {isLoggedIn ? (
              <Profile user={user} />
            ) : (
              <Button
                color="inherit"
                variant="text"
                onClick={handleLoginClick}
                startIcon={<LoginIcon />}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* <SidebarMenu
        items={menuItems}
        setDrawerOpen={setDrawerOpen}
        drawerOpen={drawerOpen}
      /> */}
      <Box sx={{ mt: "64px" }}>{/* Main content */}</Box>
    </>
  );
}
