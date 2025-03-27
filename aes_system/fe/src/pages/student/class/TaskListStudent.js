import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import { fetchListTaskByClassId } from "../../../redux/StudentSlide";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const TaskListStudent = ({ classId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for managing toast notifications
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const profile = useSelector((state) => state.auth.user);
  const StudentID = profile?.profile.StudentID;
  const {
    tasks = [],
    loading,
    error,
  } = useSelector((state) => state.classDetailTeacher || {});

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchListTaskByClassId({ tokens, classId, studentId: StudentID }));
  }, [dispatch, classId, StudentID]);

  // Function to handle task button click
  const handleTaskClick = (task) => {
    if (task.isExpired === "1") {
      setToastMessage("This task has expired and cannot be completed.");
      setToastOpen(true);
    } else {
      if (task.isSubmitted === "1") {
        navigate(`/student/essay/essay-writing/${task.workbookEssayTaskID}`, {
          state: {
            isSubmitted: 2,
            check: 1,
            classId,
            workbookEssayTaskId: task.workbookEssayTaskID,
            writingPaperId: task.writingPaperId,
          },
        });
      } else if (task.isSubmitted === "2") {
        navigate(`/student/essay-grade-detail/${task.evaluationAssigningId}`, {
          state: { check: 1 },
        });
      } else {
        navigate(`/student/essay/essay-writing/${task.essayTaskId}`, {
          state: { isSubmitted: parseInt(task.isSubmitted), check: 1, classId },
        });
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">Error loading data: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 2,
        height: "70vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontWeight: 800,
          fontSize: "1.8rem",
          background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <AssignmentIcon sx={{ color: "#1a237e", fontSize: "2rem" }} />
        Assigned Tasks
      </Typography>

      {tasks.length > 0 ? (
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "10px",
              "&:hover": {
                background: "#666",
              },
            },
          }}
        >
          <List
            sx={{
              gap: 3,
              display: "flex",
              flexDirection: "column",
              py: 2,
              px: 1,
            }}
          >
            {tasks.map((task) => (
              <ListItem
                key={task.essayTaskId}
                sx={{
                  p: 0,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "70%",
                    backgroundColor:
                      task.isExpired === "1"
                        ? "#ff5252"
                        : task.isSubmitted === "2"
                          ? "#4caf50"
                          : task.isSubmitted === "1"
                            ? "#2196f3"
                            : "#ffa726",
                    borderRadius: "0 4px 4px 0",
                    opacity: 0.7,
                  },
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    borderRadius: "20px",
                    ml: 1,
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(0,0,0,0.05)",
                    "&:hover": {
                      transform: "translateY(-4px) translateX(4px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 3,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.3rem",
                            color: "#1a237e",
                            mb: 2,
                            lineHeight: 1.3,
                          }}
                        >
                          {task.taskName}
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.secondary",
                            mb: 3,
                            lineHeight: 1.7,
                            fontSize: "1rem",
                          }}
                        >
                          {task.taskPlainContent}
                        </Typography>

                        <Grid container spacing={3} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={6}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                color: "text.secondary",
                                backgroundColor: "rgba(0,0,0,0.02)",
                                p: 1.5,
                                borderRadius: "12px",
                              }}
                            >
                              <CalendarTodayIcon
                                sx={{ color: "primary.main" }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                Due: {task.dueDate}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                color: "text.secondary",
                                backgroundColor: "rgba(0,0,0,0.02)",
                                p: 1.5,
                                borderRadius: "12px",
                              }}
                            >
                              <AssignmentIcon sx={{ color: "primary.main" }} />
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                Word Limit: {task.wordCountLimit}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <Chip
                            label={
                              task.isExpired === "1" ? "Expired" : "Active"
                            }
                            color={task.isExpired === "1" ? "error" : "success"}
                            sx={{
                              borderRadius: "10px",
                              fontWeight: 600,
                              px: 2,
                              height: "32px",
                              "& .MuiChip-label": {
                                px: 1,
                              },
                            }}
                          />
                          <Chip
                            label={
                              task.isSubmitted === "1"
                                ? "Submitted"
                                : task.isSubmitted === "2"
                                  ? "Graded"
                                  : "Pending"
                            }
                            color={
                              task.isSubmitted === "1"
                                ? "primary"
                                : task.isSubmitted === "2"
                                  ? "success"
                                  : "warning"
                            }
                            sx={{
                              borderRadius: "10px",
                              fontWeight: 600,
                              px: 2,
                              height: "32px",
                              "& .MuiChip-label": {
                                px: 1,
                              },
                            }}
                          />
                        </Box>
                      </Box>

                      <Button
                        variant={
                          task.isExpired === "1" ? "outlined" : "contained"
                        }
                        color={task.isExpired === "1" ? "error" : "primary"}
                        onClick={() => handleTaskClick(task)}
                        sx={{
                          ml: 3,
                          minWidth: "130px",
                          height: "48px",
                          borderRadius: "14px",
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: 600,
                          boxShadow:
                            task.isExpired === "1"
                              ? "none"
                              : "0 4px 12px rgba(0,0,0,0.15)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow:
                              task.isExpired === "1"
                                ? "none"
                                : "0 8px 20px rgba(0,0,0,0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        {task.isExpired === "1"
                          ? "Expired"
                          : task.isSubmitted === "1"
                            ? "View"
                            : task.isSubmitted === "2"
                              ? "View Grade"
                              : "Start Task"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            py: 10,
            px: 4,
            backgroundColor: "#f8f9fa",
            borderRadius: "20px",
            border: "2px dashed rgba(0,0,0,0.1)",
            m: 2,
          }}
        >
          <AssignmentIcon
            sx={{
              fontSize: 80,
              color: "text.secondary",
              mb: 3,
              opacity: 0.5,
            }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            No tasks available
          </Typography>
        </Box>
      )}

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          sx={{
            width: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            borderRadius: "16px",
            fontSize: "1rem",
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskListStudent;
