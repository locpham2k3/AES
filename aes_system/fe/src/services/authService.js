// src/service/authService.js
import axios from "axios";
const REACT_APP_API_URL = "https://gateway-service.aes-system.io.vn";
// const REACT_APP_API_URL = "http://localhost:3800";

// Đăng nhập thông thường
export const login = async (data) => {
  console.log(REACT_APP_API_URL);
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/login`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Đăng nhập Google thông qua server
export const googleLogin = async (token) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/google/idtoken`,
      {
        token,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

// Đăng ký
export const register = async (data) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/register`,
      data
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
export const confirmOtpService = async (data) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/confirm-otp`,
      data
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
export const resendOtpService = async (data) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/resend-confirm-otp`,
      data
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
export const forgotPasswordRequestService = async (data) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/forgot-password`,
      data
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
export const verifyPasswordResetOTPService = async (data) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/verify-reset-password-otp`,
      data
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const resetPasswordService = async (data) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/reset-password`,
      data
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const logout = async (tokens) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/logout`,
      { refreshToken: tokens.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const loginWithTokenService = async (tokens) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/auth/verifyToken`,
      { refreshToken: tokens.refreshToken }, // Gửi refreshToken trong body nếu cần
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về thông tin người dùng
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// get profile
export const getProfileService = async (tokens, accountId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Profile/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// update profile student
export const updateProfileStudentService = async (tokens, body) => {
  try {
    const response = await axios.put(
      `${REACT_APP_API_URL}/api/Profile/Student/${body.accountId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
// update profile teacher
export const updateProfileTeacherService = async (tokens, body) => {
  try {
    const response = await axios.put(
      `${REACT_APP_API_URL}/api/Profile/Teacher/${body.accountId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
