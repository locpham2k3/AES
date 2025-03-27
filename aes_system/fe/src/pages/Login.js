import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin, login, loginWithToken } from "../redux/authSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    // Nếu người dùng đã đăng nhập, chuyển hướng về trang chủ
    if (user) {
      navigate("/");
    }

    // // Kiểm tra và tải thông tin đăng nhập từ localStorage
    const savedTokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    if (savedTokens.accessToken && savedTokens.refreshToken) {
      // Tự động xác thực người dùng với token đã lưu
      dispatch(loginWithToken(savedTokens))
        .unwrap()
        .then((response) => {
          console.log(response);
          const { accessToken, refreshToken } = response.tokens; // Lấy tokens mới từ phản hồi
          // Cập nhật token mới vào localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        })
        .catch(() => {
          // Nếu token không hợp lệ, xóa nó
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        });
    }

    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedEmail && savedRememberMe) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        rememberMe: savedRememberMe,
      });
    }
  }, [user, navigate, dispatch]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      dispatch(login({ email: formData.email, password: formData.password }))
        .unwrap()
        .then((response) => {
          const { accessToken, refreshToken } = response.tokens; // Lấy tokens và role từ phản hồi
          console.log(response);
          const role = response.data.profile.role;
          // Nếu "Remember Me" được chọn, lưu thông tin đăng nhập vào localStorage
          if (formData.rememberMe) {
            localStorage.setItem("email", formData.email);
            localStorage.setItem("password", formData.password);
            localStorage.setItem("rememberMe", true);
          } else {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
            localStorage.removeItem("rememberMe");
          }
          // Lưu token vào localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          toast.success("Login successfully!");

          // Điều hướng dựa trên vai trò
          if (role === "student") {
            navigate("/student/dashboard"); // Trang cho sinh viên
          } else if (role === "teacher") {
            navigate("/teacher/dashboard"); // Trang cho giáo viên (hoặc trang tương ứng)
          } else if (role === "admin") {
            navigate("/admin/dashboard"); // Trang mặc định nếu không có vai trò phù hợp
          } else if (role === "referee") {
            navigate("/referee/report");
          } else {
            navigate("/"); // Trang mặc định nếu không có vai trò phù hợp
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(`${error}`);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rememberMe" ? checked : value,
    });
  };

  const handleGoogleSuccess = (response) => {
    const { credential } = response;
    dispatch(googleLogin({ credential }))
      .unwrap()
      .then((response) => {
        const { accessToken, refreshToken } = response.tokens; // Lấy tokens từ phản hồi
        const role = response.data.profile.role;
        console.log(role);
        localStorage.setItem("accessToken", accessToken); // Lưu token vào localStorage
        localStorage.setItem("refreshToken", refreshToken);
        toast.success("Login with Google successfully!");
        if (role === "student") {
          navigate("/student/dashboard"); // Trang cho sinh viên
        } else if (role === "teacher") {
          navigate("/teacher/dashboard"); // Trang cho giáo viên (hoặc trang tương ứng)
        } else if (role === "admin") {
          navigate("/admin/dashboard"); // Trang mặc định nếu không có vai trò phù hợp
        } else if (role === "referee") {
          navigate("/referee/dashboard");
        } else {
          navigate("/"); // Trang mặc định nếu không có vai trò phù hợp
        }
      })
      .catch((error) => {
        toast.error(`${error || "Login with Google failed."}`);
      });
  };

  const handleGoogleFailure = () => {
    toast.error("Login with Google failed.");
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
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
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
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.rememberMe}
              onChange={handleChange}
              name="rememberMe"
              color="primary"
            />
          }
          label="Remember Me"
          sx={{ mt: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Login..." : "Login"}
        </Button>

        {/* Google Login Button */}
        <Box mt={2}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            sx={{
              width: "100%",
              height: "48px",
              "&.MuiButton-root": {
                fontSize: "16px",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link href="/forgot-password" variant="body2">
            Forgot password?
          </Link>
          <Box mt={1}>
            <Link href="/register" variant="body2">
              Don't have an account? Register
            </Link>
          </Box>
        </Box>
      </form>
    </Container>
  );
};

export default Login;
