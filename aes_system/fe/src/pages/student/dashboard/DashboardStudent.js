import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AverageScoreStatistics from "./AverageScoreStatistics";
import WeeklyPerformanceStatistics from "./WeeklyPerformanceStatistics";
import WritingStatistics from "./WritingStatistics";
import UpcomingTasks from "./UpcomingTasks";
// import { fetchListClass } from "../../../redux/TeacherSlide";

// Chỉnh sửa Select style
const selectStyle = {
  "& .MuiSelect-root": {
    padding: "8px 12px", // Thêm padding để chọn dễ dàng hơn
  },
  "& .MuiInputBase-root": {
    borderRadius: "8px", // Bo góc của select
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#B2DFDB", // Màu viền nhẹ cho Select
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#00796B", // Màu viền khi hover
  },
  "& .MuiSelect-icon": {
    color: "#00796B", // Màu icon khi hover
  },
};

const DashboardStudent = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.user);
  const studentId = profile?.profile.StudentID;
  //   const studentId = 52;
  //   const { data, loading, error } = useSelector((state) => state.classTeacher);
  const [classId, setClassId] = useState(""); // State để lưu classId

  //   useEffect(() => {
  //     const tokens = {
  //       accessToken: localStorage.getItem("accessToken"),
  //       refreshToken: localStorage.getItem("refreshToken"),
  //     };
  //     dispatch(fetchListClass({ tokens, teacherId: teacherId }));
  //   }, [dispatch, teacherId]);

  const tokens = {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };

  const handleClassChange = (event) => {
    setClassId(event.target.value); // Cập nhật classId khi người dùng chọn lớp
  };

  // Đặt giá trị mặc định là lớp đầu tiên trong danh sách, nếu có dữ liệu
  //   useEffect(() => {
  //     if (data && data.length > 0) {
  //       setClassId(data[0].id); // Đặt lớp đầu tiên làm mặc định
  //     }
  //   }, [data]);

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Student Dashboard
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          {/* Summary Cards */}
          <Grid item xs={12} md={12}>
            <AverageScoreStatistics tokens={tokens} studentId={studentId} />
          </Grid>

          {/* Grading Effect */}
          <Grid item xs={12} md={12}>
            <WeeklyPerformanceStatistics
              tokens={tokens}
              studentId={studentId}
            />
          </Grid>

          {/* Average Score with Class Selection */}
          <Grid item xs={12} md={12}>
            <WritingStatistics tokens={tokens} studentId={studentId} />
          </Grid>

          {/* Task Expiry List */}
          <Grid item xs={12}>
            <UpcomingTasks tokens={tokens} studentId={studentId} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardStudent;
