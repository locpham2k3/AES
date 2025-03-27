// src/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Sử dụng localStorage
import authSlice, { profileReducer } from "./redux/authSlice";
import {
  categoryReducer,
  classDetailStudentReducer,
  classStudentReducer,
  complainDetailStudentReducer,
  complainStudentReducer,
  essayGradedDetailReducer,
  essayGradeReducer,
  essayReducer,
  essayWritingReducer,
  levelReducer,
  workbookReducer,
} from "./redux/StudentSlide";
import {
  categoryTeacherReducer,
  essayGradeTeacherReducer,
  feedbackTeacherReducer,
  mistakeTeacherReducer,
  essayTaskTeacherReducer,
  classTeacherReducer,
  classDetailTeacherReducer,
  workbookTeacherReducer,
  grammarCheckTeacherReducer,
  gradeEssayTeacherReducer,
} from "./redux/TeacherSlide";
import { userAdminReducer, workbookAdminReducer } from "./redux/AdminSlide";
import { refereeReducer } from "./redux/RefereeSlide";
import {
  averageScorePerClassOfStudentReducer,
  averageScoreReducer,
  averageWrittingTimeOfStudentReducer,
  deadlineClassOfStudentReducer,
  gradingEffectReducer,
  listClassOfAdminReducer,
  listTaskExpiryReducer,
  processOfStudentReducer,
  totalClassAndStudentReducer,
  totalComplainOfAdminReducer,
  totalEssayTaskOfAdminReducer,
  totalUserOfAdminReducer,
  writtingPaperStatisticOfStudentReducer,
  writtingPerformanceOfStudentReducer,
} from "./redux/DashboardSilde";

// =======================
// Cấu Hình Persist Cho authSlice
// =======================

const authPersistConfig = {
  key: "auth", // Khóa duy nhất cho auth slice
  storage,
  blacklist: [], // Thêm các trường không muốn persist nếu có
};

// =======================
// Kết Hợp Các Reducer
// =======================

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice), // authSlice được persist
  level: levelReducer,
  workbook: workbookReducer,
  category: categoryReducer,
  essay: essayReducer,
  profile: profileReducer,
  essayWriting: essayWritingReducer,
  essayGrade: essayGradeReducer,
  essayGradeDetail: essayGradedDetailReducer,
  classStudent: classStudentReducer,
  conplainStudent: complainStudentReducer,
  complainDetailStudent: complainDetailStudentReducer,
  classStudentDetail: classDetailStudentReducer,
  feedbackTeacher: feedbackTeacherReducer,
  categoryTeacher: categoryTeacherReducer,
  mistakeTeacher: mistakeTeacherReducer,
  essayGradeTeacher: essayGradeTeacherReducer,
  essayTaskTeacher: essayTaskTeacherReducer,
  workbookTeacher: workbookTeacherReducer,
  workbookAdmin: workbookAdminReducer,
  userAdmin: userAdminReducer,
  classTeacher: classTeacherReducer,
  classDetailTeacher: classDetailTeacherReducer,
  referee: refereeReducer,
  grammarCheckTeacher: grammarCheckTeacherReducer,
  gradeEssayTeacher: gradeEssayTeacherReducer,
  // Thêm các reducer khác nếu cần

  /*
 .......########.....###.....######..##.....##.########...#######.....###....########..########.
 .......##.....##...##.##...##....##.##.....##.##.....##.##.....##...##.##...##.....##.##.....##
 .......##.....##..##...##..##.......##.....##.##.....##.##.....##..##...##..##.....##.##.....##
 .......##.....##.##.....##..######..#########.########..##.....##.##.....##.########..##.....##
 .......##.....##.#########.......##.##.....##.##.....##.##.....##.#########.##...##...##.....##
 .......##.....##.##.....##.##....##.##.....##.##.....##.##.....##.##.....##.##....##..##.....##
 .......########..##.....##..######..##.....##.########...#######..##.....##.##.....##.########.
 */

  //teacher
  totalClassAndStudentTeacher: totalClassAndStudentReducer,
  listTaskExpiryTeacher: listTaskExpiryReducer,
  gradingEffectTeacher: gradingEffectReducer,
  averageScoreTeacher: averageScoreReducer,
  //student
  averageScorePerClassOfStudent: averageScorePerClassOfStudentReducer,
  processOfStudent: processOfStudentReducer,
  writtingPerformanceOfStudent: writtingPerformanceOfStudentReducer,
  writtingPaperStatisticOfStudent: writtingPaperStatisticOfStudentReducer,
  averageWrittingTimeOfStudent: averageWrittingTimeOfStudentReducer,
  deadlineClassOfStudent: deadlineClassOfStudentReducer,
  //admin
  totalUserOfAdmin: totalUserOfAdminReducer,
  listClassOfAdmin: listClassOfAdminReducer,
  totalEssayTaskOfAdmin: totalEssayTaskOfAdminReducer,
  totalComplainOfAdmin: totalComplainOfAdminReducer,
});

// =======================
// Cấu Hình Store
// =======================

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua các hành động của Redux Persist để tránh cảnh báo về tính tuần hoàn
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PERSIST",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

// =======================
// Tạo Persistor
// =======================

const persistor = persistStore(store);

// =======================
// Xuất Store và Persistor
// =======================

export { store, persistor };
