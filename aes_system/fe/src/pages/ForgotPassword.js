import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordRequest } from "../redux/authSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(forgotPasswordRequest({ email })).unwrap();
      toast.success("Password reset email sent.");
      navigate("/otp-confirm?flow=forgotPassword");
    } catch (err) {
      toast.error(err || "Failed to send password reset email.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: "50px" }}>
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
          Forgot Your Password?
        </Typography>
        {/* {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof error === "string" ? error : error?.message}
          </Alert>
        )} */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ backgroundColor: "white" }}
          />
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
              disabled={loading}
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
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
