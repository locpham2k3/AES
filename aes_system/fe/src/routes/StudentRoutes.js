import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import StudentPage from "../pages/student/StudentPage"; // Import trang của học sinh
import EssayCardList from "../pages/student/EssayCardList";
import EssayWritingComponent from "../pages/student/EssayWriting";
import EssayGraded from "../pages/student/EssayGraded";
import StudentEssayView from "../pages/student/deatailEssayGraded/StudentEssayView";
import NotFound from "../pages/NotFound";
import ListClassStudent from "../pages/student/class/ListClassStudent";
import DetailClassStudent from "../pages/student/class/DetailClassStudent";
import DashboardStudent from "../pages/student/dashboard/DashboardStudent";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route path="/home" element={<StudentPage />} />
        <Route path="/dashboard" element={<DashboardStudent />} />
        <Route path="/essay/:type" element={<EssayCardList />} />
        <Route
          path="/essay/essay-writing/:id"
          element={<EssayWritingComponent />}
        />
        <Route path="/essay-greade/" element={<EssayGraded />} />
        <Route path="/essay-grade-detail/:id" element={<StudentEssayView />} />
        <Route path="/list-class" element={<ListClassStudent />} />
        <Route path="/detail-class/:id" element={<DetailClassStudent />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
