import React from "react";
import { Routes, Route } from "react-router-dom";
import TeacherLayout from "../layouts/TeacherLayout";
import TeacherPage from "../pages/teacher/TeacherPage"; // Import trang của giáo viên
import Feedback from "../pages/teacher/FeedBack";
import EssayGrade from "../pages/teacher/manualGrading/EssayGrade";
import ManageEssay from "../pages/teacher/ManageEssay";
import NotFound from "../pages/NotFound";
import ListClassTeacher from "../pages/teacher/class/ListClassTeacher";
import ManageClass from "../pages/teacher/class/ManageClass";
import FeedbackClass from "../pages/teacher/class/FeedbackClass";
import ManageWorkbook from "../pages/teacher/ManageWorkbook";
import GrammarCheck from "../pages/teacher/manualGrading/GrammarCheck";
import DashboardTeacher from "../pages/teacher/dashboard/DashboardTeacher";
const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<TeacherLayout />}>
        <Route path="/home" element={<TeacherPage />} />
        <Route path="/dashboard" element={<DashboardTeacher />} />
        <Route path="/feedback/" element={<Feedback isHistory />} />
        <Route path="/essay-grade/:id" element={<EssayGrade isReviewMode />} />
        <Route path="/manage-essay/" element={<ManageWorkbook />} />
        <Route path="/manage-essay/detal-esaay/:id" element={<ManageEssay />} />
        <Route path="/list-class/" element={<ListClassTeacher />} />
        <Route path="/list-class/detail-class/:id" element={<ManageClass />} />
        <Route path="/detail-task/:id" element={<FeedbackClass />} />
        <Route path="/grammar" element={<GrammarCheck />} />
        <Route path="*" element={<NotFound />} />

        {/* Thêm các route khác cho giáo viên ở đây */}
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;
