import React from "react";
import { Routes, Route } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProfileUser from "../pages/ProfileUser";
import LoadingBar from "../components/LoadingBar";
import ForgotPassword from "../pages/ForgotPassword";
import OTPConfirm from "../pages/OTPConfirm";
import ChangePassword from "../pages/ChangePassword";
import NotFound from "../pages/NotFound";

const DefaultRoutes = () => {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        {/* Các route con của DefaultLayout */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfileUser />} />
        <Route path="/loading" element={<LoadingBar />} />
        <Route path="/otp-confirm" element={<OTPConfirm />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default DefaultRoutes;
