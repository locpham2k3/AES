import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ManageUser from "../pages/admin/ManageUser";
import NotFound from "../pages/NotFound";
import ManageWorkbook from "../pages/admin/ManageWorkbook";
import Forbidden from "../pages/Forbidden";
import ServerError from "../pages/ServerError";
import DasboardAdmin from "../pages/admin/dashboard/DasboardAdmin";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Các route con của DefaultLayout */}
        <Route path="/dashboard" element={<DasboardAdmin />} />
        <Route path="/manage-user" element={<ManageUser />} />
        <Route path="/manage-workbook" element={<ManageWorkbook />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
