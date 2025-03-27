// src/components/ChangePassword.js
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, resetPassword } from "../redux/authSlice";
import { persistor } from "../store";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    passwordChangeLoading,
    passwordChangeError,
    passwordChangeSuccess,
    pendingEmail,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: pendingEmail,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      password: "",
      confirmPassword: "",
    };

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters, including one uppercase letter and one lowercase letter";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(resetPassword(formData)).unwrap();
        // Sau khi đổi mật khẩu thành công, dispatch logout
        // await dispatch(logout()).unwrap();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("persist:auth");

        // Purge persisted state
        // await persistor.purge();
        toast.success("Password changed successfully");
        navigate("/login");
      } catch (err) {
        toast.error(err || "Failed to change password");
      }
    } else {
      toast.error("Please fix the errors before submitting");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        marginTop: "50px",
        padding: 3,
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          padding: "30px 20px",
          borderRadius: "10px",
          boxShadow: 3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: "10px" }}
        >
          Change Password
        </Typography>
        {passwordChangeError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {passwordChangeError}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              variant="outlined"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              required
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <Link
              href="/login"
              variant="body2"
              sx={{
                textDecoration: "none",
                color: "#1976d2",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              &laquo; Back to Login
            </Link>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              disabled={passwordChangeLoading}
              sx={{
                borderRadius: "20px",
                border: "2px solid #1976d2",
                color: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
              }}
            >
              {passwordChangeLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePassword;
