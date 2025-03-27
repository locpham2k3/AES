import React from "react";
import {
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, logoutUser } from "../../redux/authSlice";
import { toast } from "react-toastify";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const profile = useSelector((state) => state.auth.user);
  const user = profile?.profile;
  const fullName = user?.FirstName + " " + user?.LastName;
  // URL ảnh đại diện mặc định nếu ProfileImage là null
  const defaultProfileImage = "/path-to-default-avatar.jpg"; // Thay đường dẫn với ảnh mặc định của bạn
  // console.log("user", user);
  // Xây dựng chuỗi base64 cho ảnh profile nếu có
  const profileImageSrc = user?.ProfileImage
    ? user.ProfileImage.startsWith("data:image/")
      ? user.ProfileImage // Nếu đã có tiền tố thì không thêm
      : `data:image/jpeg;base64,${user.ProfileImage}` // Thêm tiền tố nếu thiếu
    : defaultProfileImage; // Dùng ảnh mặc định nếu không có base64

  // Check base64 string in the console (optional for debugging)
  // console.log("Base64 Profile Image:", profileImageSrc);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const savedTokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    try {
      await dispatch(logout(savedTokens)).unwrap();

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("persist:auth");
      toast.success("Logout successfully!");
      navigate("/login");
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("persist:auth");
      dispatch(logoutUser());

      // toast.error("Your session has expired. Please log in again.");
      // window.location.reload();
      navigate("/");
    }
  };

  const handleMenuItemClick = (path) => {
    navigate(path); // Navigate to another page
    handleClose(); // Close menu after click
  };

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? "basic-menu-Profile" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt={fullName}
            src={profileImageSrc} // Display base64 image or default
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-Profile"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button-Profile",
        }}
      >
        {user?.role === "teacher" || user?.role === "student" ? (
          <MenuItem onClick={() => handleMenuItemClick("/profile")}>
            <Avatar sx={{ width: 28, height: 28, mr: 2 }} />
            Profile
          </MenuItem>
        ) : null}

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Profile;
// <MenuItem onClick={() => handleMenuItemClick("/my-account")}>
//   <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> My account
// </MenuItem>
// <Divider />
// <MenuItem onClick={() => handleMenuItemClick("/add-account")}>
//   <ListItemIcon>
//     <PersonAdd fontSize="small" />
//   </ListItemIcon>
//   Add another account
// </MenuItem>
// <MenuItem onClick={() => handleMenuItemClick("/settings")}>
//   <ListItemIcon>
//     <Settings fontSize="small" />
//   </ListItemIcon>
//   Settings
// </MenuItem>
