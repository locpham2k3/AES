// src/components/OTPConfirm.js
import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmOtp,
  forgotPasswordRequest,
  logout,
  resendOtp,
  verifyPasswordResetOTP,
} from "../redux/authSlice";
import { toast } from "react-toastify"; // Import toast and
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast
import { persistor } from "../store";

const OTPConfirm = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill("")); // OTP state
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Determine the flow based on query parameter
  const queryParams = new URLSearchParams(location.search);
  const flow = queryParams.get("flow") || "register"; // Default to 'register'

  // Retrieve necessary states from Redux store
  const {
    pendingEmail,
    otpLoading,
    otpError,
    resendLoading,
    resendError,
    isEmailVerified,
  } = useSelector((state) => state.auth);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow only digits

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Update OTP
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  // Handle OTP confirmation
  const handleConfirmOTP = async () => {
    if (otp.join("").length === 6) {
      try {
        if (flow === "register") {
          const otpData = { otp: otp.join(""), email: pendingEmail };
          const result = await dispatch(confirmOtp(otpData)).unwrap();
          if (result.code === 200) {
            toast.success("OTP confirmed. You are now registered.");

            // Purge persisted state
            // await persistor.purge();
            // Xóa persist:auth khỏi localStorage
            localStorage.removeItem("persist:auth");

            navigate("/login");
          } else {
            throw new Error(result.message || "OTP confirmation failed.");
          }
        } else if (flow === "forgotPassword") {
          const otpData = { otp: otp.join(""), email: pendingEmail };
          const result = await dispatch(
            verifyPasswordResetOTP(otpData)
          ).unwrap();
          if (result.code === 200) {
            toast.success("OTP confirmed. You can now reset your password.");
            navigate("/change-password");
          } else {
            throw new Error(result.message || "OTP confirmation failed.");
          }
        }
      } catch (error) {
        console.error("OTP confirmation failed:", error);
        toast.error(error || "OTP confirmation failed.");
      }
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    if (!pendingEmail) {
      toast.error(
        "Email not found. Please register or request password reset again."
      );
      if (flow === "register") {
        navigate("/register");
      } else if (flow === "forgotPassword") {
        navigate("/forgot-password");
      }
      return;
    }

    try {
      const resendData = { email: pendingEmail };
      let result;
      if (flow === "register") {
        result = await dispatch(resendOtp(resendData)).unwrap();
      } else if (flow === "forgotPassword") {
        result = await dispatch(forgotPasswordRequest(resendData)).unwrap();
      }

      if (result.code === 200) {
        toast.success("OTP has been resent to your email.");
        setTimer(60); // Reset timer
        setOtp(Array(6).fill("")); // Clear OTP inputs
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus(); // Focus first input
        }
      } else {
        throw new Error(result.message || "Resending OTP failed.");
      }
    } catch (error) {
      console.error("Resending OTP failed:", error);
      toast.error(error || "Resending OTP failed.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: "50px" }}>
      <Box
        sx={{
          textAlign: "center",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          {flow === "register"
            ? "OTP Confirmation"
            : "Password Reset Confirmation"}
        </Typography>
        <Typography variant="body2" gutterBottom>
          We have sent an OTP code to your email. Please enter it below.
        </Typography>

        {/* Display OTP Confirmation Errors */}
        {otpError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {otpError}
          </Alert>
        )}

        {/* Display Resend OTP Errors */}
        {resendError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {resendError}
          </Alert>
        )}

        <Typography
          variant="body2"
          sx={{ marginBottom: "15px", color: "gray" }}
        >
          Time remaining: {timer}s
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {[...Array(6)].map((_, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              value={otp[index]}
              inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
              variant="outlined"
              sx={{ width: "50px", backgroundColor: "#f0f0f0" }}
              required
            />
          ))}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleConfirmOTP}
          disabled={otp.join("").length !== 6 || otpLoading}
          sx={{
            borderRadius: "8px",
            backgroundColor: "#5a67d8",
            "&:hover": {
              backgroundColor: "#4c51bf",
            },
          }}
        >
          {otpLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Confirm OTP"
          )}
        </Button>

        <Typography variant="body2" sx={{ marginTop: "15px" }}>
          Didn’t receive the code?{" "}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (timer === 0) handleResendOTP();
            }}
            sx={{
              color: timer > 0 ? "gray" : "#5a67d8",
              pointerEvents: timer > 0 ? "none" : "auto",
              textDecoration: timer > 0 ? "none" : "underline",
              cursor: timer > 0 ? "default" : "pointer",
            }}
          >
            {resendLoading ? <CircularProgress size={14} /> : "Resend OTP"}
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default OTPConfirm;
