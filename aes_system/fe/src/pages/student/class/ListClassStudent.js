import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Box,
} from "@mui/material";
import TaskIcon from "@mui/icons-material/Task";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon for completed class status
import PendingIcon from "@mui/icons-material/Pending"; // Icon for pending class status
import { useNavigate } from "react-router-dom";
import { fetchClasses } from "../../../redux/StudentSlide.js";
import { Person2, PersonPinCircleOutlined } from "@mui/icons-material";

const ListClassStudent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { data, loading, error } = useSelector((state) => state.classStudent);
  const profile = useSelector((state) => state.auth.user);
  const StudentID = profile?.profile.StudentID;

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchClasses({ tokens, studentId: StudentID }));
  }, [dispatch, StudentID]);

  const handleClassClick = (classId, classItem) => {
    // Khi bấm vào lớp, gửi cả classId và classItem (dữ liệu lớp)
    navigate(`/student/detail-class/${classId}`, {
      state: { classItem }, // Gửi thông tin lớp vào state
    });
    console.log(classItem);
  };

  // Hiển thị loading khi dữ liệu đang được tải
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Box textAlign="center" mt={2}>
        <Typography variant="h6" color="error">
          An error occurred: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#334155",
          textAlign: "center",
          position: "relative",
          display: "inline-block",
          left: "50%",
          transform: "translateX(-50%)",
          "&:before": {
            content: '""',
            position: "absolute",
            width: "30%",
            height: 3,
            bottom: -8,
            left: 0,
            borderRadius: 2,
          },
        }}
      >
        My Classes
      </Typography>

      {data.length === 0 ? (
        // Hiển thị khi không có lớp
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            You don't have any classes.
          </Typography>
        </Box>
      ) : (
        // Hiển thị danh sách các lớp nếu có
        <Grid container spacing={2.5}>
          {data.map((classItem) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={classItem.id}>
              <Card
                sx={{
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  },
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  height: "100%",
                  border: "1px solid #e2e8f0",
                }}
                onClick={() => handleClassClick(classItem.id, classItem)}
              >
                <Box
                  sx={{
                    background: "linear-gradient(to right, #3b82f6, #2563eb)",
                    color: "white",
                    padding: 1.5,
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                    noWrap
                  >
                    {classItem.name}
                  </Typography>
                </Box>

                <CardContent sx={{ pt: 2, pb: "16px !important" }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#f8fafc",
                        padding: 1,
                        borderRadius: 1.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <TaskIcon
                        sx={{ mr: 1, color: "#3b82f6", fontSize: 20 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {classItem.totalTask} Tasks
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#f8fafc",
                        padding: 1,
                        borderRadius: 1.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <Person2 sx={{ mr: 1, color: "#3b82f6", fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {classItem.teacherName}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor:
                          classItem.status === "0"
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(234, 179, 8, 0.1)",
                        padding: 1,
                        borderRadius: 1.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      {classItem.status === "0" ? (
                        <CheckCircleIcon
                          sx={{ color: "#22c55e", mr: 1, fontSize: 20 }}
                        />
                      ) : (
                        <PendingIcon
                          sx={{ color: "#eab308", mr: 1, fontSize: 20 }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color:
                            classItem.status === "0" ? "#22c55e" : "#eab308",
                        }}
                      >
                        {classItem.status === "0" ? "Active" : "Inactive"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ListClassStudent;
