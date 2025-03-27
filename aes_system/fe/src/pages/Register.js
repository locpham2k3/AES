// src/pages/Register.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, register } from "../redux/authSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Link,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify"; // Import toast và CSS
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, pendingEmail } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      valid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else {
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
        valid = false;
      }
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters, including one uppercase letter and one lowercase letter";
      valid = false;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const resultAction = await dispatch(
          register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          })
        );

        // Kiểm tra nếu registration thành công
        if (register.fulfilled.match(resultAction)) {
          const { message } = resultAction.payload;
          toast.success(message || "Registration successful!");
          navigate("/otp-confirm?flow=register"); // Điều hướng đến OTPConfirm với flow 'register'
        } else {
          // Nếu registration thất bại, hiển thị thông báo lỗi
          const errorMessage =
            resultAction.payload?.message ||
            "Registration failed. Please try again.";
          toast.error("Registration failed: " + errorMessage);
        }
      } catch (err) {
        console.error("Registration failed:", err);
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 8,
        padding: 3,
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <Box display="flex" mb={2} gap={2}>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName}
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Password"
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
            label="Confirm Password"
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
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link href="/login" variant="body2">
            Already have an account? LOGIN
          </Link>
        </Box>
      </form>
    </Container>
  );
};

export default Register;
