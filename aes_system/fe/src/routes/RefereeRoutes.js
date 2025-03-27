import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ManageUser from "../pages/admin/ManageUser";
import NotFound from "../pages/NotFound";
import ManageWorkbook from "../pages/admin/ManageWorkbook";
import Forbidden from "../pages/Forbidden";
import ServerError from "../pages/ServerError";
import RefereeLayout from "../layouts/RefereeLayout";
import Referee from "../pages/referee/Referee";

const RefereeRoutes = () => {
  return (
    <Routes>
      <Route element={<RefereeLayout />}>
        {/* Các route con của DefaultLayout */}
        <Route path="/report" element={<Referee />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default RefereeRoutes;
