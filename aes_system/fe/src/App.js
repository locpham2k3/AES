// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentRoutes from "./routes/StudentRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import RefereeRoutes from "./routes/RefereeRoutes";
import DefaultRoutes from "./routes/DefaultRoutes";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import ServerError from "./pages/ServerError";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { loginWithToken, logoutUser } from "./redux/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import "./App.css";

function AppWrapper() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || "student";

  useEffect(() => {
    const savedTokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    if (savedTokens.accessToken && savedTokens.refreshToken) {
      dispatch(loginWithToken(savedTokens))
        .unwrap()
        .then((response) => {
          const { accessToken, refreshToken } = response.tokens;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        })
        .catch((error) => {
          // Thông báo lỗi cho người dùng
          toast.error(error.message || "Invalid tokens. Please log in again.");

          // Xóa token khỏi localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("persist:auth");

          // Gọi action để logout người dùng
          dispatch(logoutUser());
        });
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Các route có điều kiện hoặc với các quyền truy cập khác */}
        <Route path="/*" element={<DefaultRoutes />} />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute>
              {userRole === "student" ? <StudentRoutes /> : <Forbidden />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute>
              {userRole === "teacher" ? <TeacherRoutes /> : <Forbidden />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              {userRole === "admin" ? <AdminRoutes /> : <Forbidden />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/referee/*"
          element={
            <ProtectedRoute>
              {userRole === "referee" ? <RefereeRoutes /> : <Forbidden />}
            </ProtectedRoute>
          }
        />

        {/* Các trang lỗi */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="/500" element={<ServerError />} />

        {/* 404 Not Found sẽ phải là route cuối cùng */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppWrapper;
