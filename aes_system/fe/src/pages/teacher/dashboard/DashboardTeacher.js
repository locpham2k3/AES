import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import TotalClassAndStudent from "./TotalClassAndStudent";
import TaskExpiryList from "./TaskExpiryList";
import GradingEffect from "./GradingEffect";
import AverageScore from "./AverageScore";
import { useDispatch, useSelector } from "react-redux";
import { fetchListClass } from "../../../redux/TeacherSlide";

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

const DashboardTeacher = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.user);
  const teacherId = profile?.profile.TeacherID;
  const { data, loading, error } = useSelector((state) => state.classTeacher);
  const [classId, setClassId] = useState(""); // State để lưu classId

  const tokens = {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
  useEffect(() => {
    dispatch(fetchListClass({ tokens, teacherId: teacherId }));
  }, [dispatch, teacherId]);

  const handleClassChange = (event) => {
    setClassId(event.target.value); // Cập nhật classId khi người dùng chọn lớp
  };

  // Đặt giá trị mặc định là lớp đầu tiên trong danh sách, nếu có dữ liệu
  useEffect(() => {
    if (data && data.length > 0) {
      setClassId(data[0].id); // Đặt lớp đầu tiên làm mặc định
    }
  }, [data]);

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Teacher Dashboard
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} md={6}>
            <TotalClassAndStudent tokens={tokens} teacherId={teacherId} />
          </Grid>

          {/* Grading Effect */}
          <Grid item xs={12} md={6}>
            <GradingEffect tokens={tokens} teacherId={teacherId} />
          </Grid>

          {/* Average Score with Class Selection */}
          <Grid item xs={12} md={12}>
            {/* Select Class */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="select-class-label">Select Class</InputLabel>
              <Select
                labelId="select-class-label"
                value={classId}
                onChange={handleClassChange}
                label="Select Class"
                sx={selectStyle} // Thêm style cho select
              >
                {loading ? (
                  <MenuItem disabled>Loading...</MenuItem> // Hiển thị khi đang tải
                ) : (
                  data?.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Chỉ hiển thị AverageScore khi đã chọn lớp */}
            {classId && (
              <AverageScore
                tokens={tokens}
                teacherId={teacherId}
                classId={classId} // Truyền classId vào component AverageScore
              />
            )}
          </Grid>

          {/* Task Expiry List */}
          <Grid item xs={12}>
            <TaskExpiryList tokens={tokens} teacherId={teacherId} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardTeacher;
