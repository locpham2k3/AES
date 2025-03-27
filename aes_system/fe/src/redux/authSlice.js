// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  logout as logoutService,
  login as loginService,
  register as registerService,
  googleLogin as googleLoginService,
  loginWithTokenService,
  confirmOtpService,
  resendOtpService,
  forgotPasswordRequestService,
  verifyPasswordResetOTPService,
  resetPasswordService,
  getProfileService,
  updateProfileStudentService,
  updateProfileTeacherService,
} from "../services/authService";

// =======================
// Asynchronous Thunks
// =======================

// 1. Login with Token
export const loginWithToken = createAsyncThunk(
  "auth/loginWithToken",
  async (tokens, { rejectWithValue }) => {
    try {
      const user = await loginWithTokenService(tokens);
      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Token verification failed."
      );
    }
  }
);

// 2. Google Login
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (token, { rejectWithValue }) => {
    try {
      const user = await googleLoginService(token);
      return user;
    } catch (error) {
      return rejectWithValue(error || "Google login failed.");
    }
  }
);

// 3. Standard Login
export const login = createAsyncThunk(
  "auth/login",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const user = await loginService(userCredentials);
      return user;
    } catch (error) {
      return rejectWithValue(error || "Login failed.");
    }
  }
);

// 4. Register
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerService(userData);
      // Include email in the fulfilled action for OTP confirmation
      return { ...response, email: userData.email };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed."
      );
    }
  }
);

// 5. Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (tokens, { rejectWithValue }) => {
    try {
      const response = await logoutService(tokens);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Logout failed.");
    }
  }
);

// 6. Confirm OTP
export const confirmOtp = createAsyncThunk(
  "auth/confirmOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await confirmOtpService(otpData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP confirmation failed."
      );
    }
  }
);

// 7. Resend OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (resendData, { rejectWithValue }) => {
    try {
      const response = await resendOtpService(resendData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Resending OTP failed."
      );
    }
  }
);
//  8. forgot Password Request
export const forgotPasswordRequest = createAsyncThunk(
  "auth/forgotPasswordRequest",
  async (email, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordRequestService(email);
      return response;
    } catch (error) {
      console.log(error?.message);
      return rejectWithValue(
        error?.message || "Forgot password request failed."
      );
    }
  }
);
// 9. verify Password Reset OTP
export const verifyPasswordResetOTP = createAsyncThunk(
  "auth/verifyPasswordResetOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await verifyPasswordResetOTPService(otpData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed."
      );
    }
  }
);
// 10. Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await resetPasswordService(passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Password reset failed.");
    }
  }
);
//11. get profile
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async ({ tokens, accountId }, thunkAPI) => {
    try {
      const response = await await getProfileService(tokens, accountId);
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

// update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ tokens, body, check }, thunkAPI) => {
    try {
      const response =
        check == 0
          ? await updateProfileStudentService(tokens, body)
          : await updateProfileTeacherService(tokens, body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// =======================
// Initial State
// =======================
const initialState = {
  user: null,
  role: null,
  loading: false,
  error: null,
  // OTP Confirmation States
  otpLoading: false,
  otpError: null,
  // Resend OTP States
  resendLoading: false,
  resendError: null,
  // Pending Email for OTP
  pendingEmail: null,
  // Email Verification Status
  isEmailVerified: false,
  // Password Reset States
  passwordResetLoading: false,
  passwordResetError: null,
  passwordResetSuccess: false,
};

// =======================
// Auth Slice
// =======================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous logout action to clear user state
    logoutUser(state) {
      state.user = null;
      state.role = null;
      state.loading = false;
      state.error = null;
      state.otpLoading = false;
      state.otpError = null;
      state.resendLoading = false;
      state.resendError = null;
      state.pendingEmail = null;
      state.isEmailVerified = false;
      state.passwordResetLoading = false;
      state.passwordResetError = null;
      state.passwordResetSuccess = false;
      // Optionally, clear localStorage or other storage mechanisms here
      // Example:
      // localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    // ===========================
    // 1. Register
    // ===========================
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // Set pendingEmail to the email used for registration
        state.pendingEmail = action.payload.email;
        // Optionally, set a flag to indicate registration flow
        state.isRegistration = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    // ===========================
    // 2. Confirm OTP
    // ===========================
    builder
      .addCase(confirmOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(confirmOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        // Check if OTP confirmation was successful
        if (action.payload.code === 200) {
          state.isEmailVerified = true;
          // Optionally, set user data or proceed with authentication
        } else {
          state.otpError = action.payload.message || "OTP confirmation failed.";
        }
      })
      .addCase(confirmOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload || action.error.message;
      });

    // ===========================
    // 3. Resend OTP
    // ===========================
    builder
      .addCase(resendOtp.pending, (state) => {
        state.resendLoading = true;
        state.resendError = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.resendLoading = false;
        // Optionally, handle any response data if needed
        // e.g., update a resend count or reset the timer
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendLoading = false;
        state.resendError = action.payload || action.error.message;
      });

    // ===========================
    // 4. Login with Token
    // ===========================
    builder
      .addCase(loginWithToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.role = action.payload.data.role || null;
        state.isEmailVerified = true; // Assuming token implies verified email
      })
      .addCase(loginWithToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // ===========================
    // 5. Google Login
    // ===========================
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.role = action.payload.data.role || null;
        state.isEmailVerified = true; // Assuming Google login implies verified email
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // ===========================
    // 6. Standard Login
    // ===========================
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.role = action.payload.data.role || null;
        state.isEmailVerified = true; // Assuming login implies verified email
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    // ===========================
    // 7. Logout
    // ===========================
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.isEmailVerified = false;
        state.pendingEmail = null;
        state.isForgotPassword = false;
        state.isRegistration = false;
        // Reset other states if necessary
        state.otpLoading = false;
        state.otpError = null;
        state.resendLoading = false;
        state.resendError = null;
        state.passwordResetLoading = false;
        state.passwordResetError = null;
        state.passwordResetSuccess = false;
        state.loading = false;
        state.user = null;
        state.role = null;
        state.isEmailVerified = false;
        state.pendingEmail = null;
        state.isForgotPassword = false;
        state.isRegistration = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    // ===========================
    // 8. Forgot Password Request
    // ===========================
    builder
      .addCase(forgotPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingEmail = action.payload.email; // Thiết lập pendingEmail đúng cách
        state.isForgotPassword = true;
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      }); // ===========================
    // 9. Verify Password Reset OTP
    // ===========================
    builder
      .addCase(verifyPasswordResetOTP.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(verifyPasswordResetOTP.fulfilled, (state, action) => {
        state.otpLoading = false;
        if (action.payload.code === 200) {
          state.isEmailVerified = true;
          // Ready to change password
        } else {
          state.otpError = action.payload.message || "OTP verification failed.";
        }
      })
      .addCase(verifyPasswordResetOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload || action.error.message;
      });
    // ===========================
    // 10. Reset Password
    // ===========================
    builder
      .addCase(resetPassword.pending, (state) => {
        state.passwordResetLoading = true;
        state.passwordResetError = null;
        state.passwordResetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.passwordResetLoading = false;
        state.passwordResetSuccess = true;
        state.passwordResetError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordResetLoading = false;
        state.passwordResetError = action.payload || action.error.message;
      });
  },
});
// =======================
// Profile Slice
// =======================
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ===========================
    // 11. Get Profile
    // ===========================
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    // ===========================
    // 12. Update Profile
    // ===========================
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// =======================
// Export Actions and Reducer
// =======================
export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
export const { clearProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
