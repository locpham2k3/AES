// src/pages/student/EssayGraded.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CircularProgress,
  Alert,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Paper,
  Pagination,
  Chip,
  Stack,
  Box,
  Tooltip,
  TableCell,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  fetchEssaysMarked,
  fetchListComplainByStudentId,
} from "../../redux/StudentSlide";
import TaskIcon from "@mui/icons-material/Assignment";
import CoherenceIcon from "@mui/icons-material/SyncAlt";
import LexicalIcon from "@mui/icons-material/Book";
import GrammarIcon from "@mui/icons-material/Spellcheck";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { StyledTableCell } from "./StyledTableCell";

const EssayGraded = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.auth.user);
  const StudentID = profile?.profile.StudentID;

  const {
    essayGraded = [],
    loading,
    error,
  } = useSelector((state) => state.essayGrade);

  const {
    data = [],
    loading: loadingComplain,
    error: errorComplain,
  } = useSelector((state) => state.conplainStudent);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  console.log("data complain ", data);
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    if (StudentID) {
      dispatch(fetchEssaysMarked({ tokens, studentId: StudentID }));
      dispatch(fetchListComplainByStudentId({ tokens, studentId: StudentID }));
    }
  }, [dispatch, StudentID]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = essayGraded.slice(indexOfFirstTask, indexOfLastTask);

  const handleRowClick = (id) => {
    navigate(`/student/essay-grade-detail/${id}`, { state: { check: 0 } });
  };
  const getComplainStatus = (evaluationAssigningId) => {
    const complainItem = data.find(
      (complain) => complain.evaluationAssigningId === evaluationAssigningId
    );
    return complainItem ? complainItem.status : null;
  };
  if (loading || loadingComplain) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "300px" }}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" style={{ marginLeft: "10px" }}>
          Loading...
        </Typography>
      </Grid>
    );
  }

  if (error || errorComplain) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Alert severity="error">
          <Typography variant="h6">Error: {error}</Typography>
        </Alert>
      </Grid>
    );
  }

  // Hàm để xác định màu sắc của Chip dựa trên giá trị điểm
  const getScoreColor = (score) => {
    if (score >= 8) return "success";
    if (score >= 5) return "warning";
    return "error";
  };

  // Hàm để lấy Icon dựa trên hạng mục
  const getScoreIcon = (category) => {
    switch (category) {
      case "Task Achievement":
        return <TaskIcon fontSize="small" />;
      case "Coherence & Cohesion":
        return <CoherenceIcon fontSize="small" />;
      case "Lexical Resource":
        return <LexicalIcon fontSize="small" />;
      case "Grammar Range":
        return <GrammarIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      <Grid container alignItems="center" style={{ marginBottom: "20px" }}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Graded Essays
          </Typography>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Essay Task
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Teacher & Dates
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Status
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  Scores
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTasks.length > 0 ? (
              currentTasks.map((item, index) => {
                const complainStatus = getComplainStatus(
                  item.evaluationAssigningId
                );

                return (
                  <TableRow
                    key={item.evaluationAssigningId}
                    hover
                    onClick={() => handleRowClick(item.evaluationAssigningId)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: "#e0f7fa",
                      },
                    }}
                  >
                    <StyledTableCell sx={{ padding: "16px" }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.essayTaskName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Workbook: {item.workbookName}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "16px" }}>
                      <Stack spacing={0.5}>
                        <Box display="flex" alignItems="center">
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            <strong>Teacher:</strong> {item.teacherName}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <CalendarTodayIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            <strong>Submitted on:</strong>{" "}
                            {new Date(item.writtenDate).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <DateRangeIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            <strong>Assigned on:</strong>{" "}
                            {new Date(item.assignedDate).toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "16px" }}>
                      <Typography variant="body2" color="text.secondary">
                        <Chip
                          label={
                            complainStatus === "0"
                              ? "Processing complaint"
                              : complainStatus === "1"
                                ? "Resolved"
                                : "No Complaint"
                          }
                          color={
                            complainStatus === "0"
                              ? "warning"
                              : complainStatus === "1"
                                ? "success"
                                : "default"
                          }
                        />
                      </Typography>
                    </StyledTableCell>{" "}
                    <StyledTableCell align="right" sx={{ padding: "16px" }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Task Achievement" arrow>
                          <Chip
                            icon={getScoreIcon("Task Achievement")}
                            label={item.taskAchievementScore}
                            color={getScoreColor(item.taskAchievementScore)}
                            variant="outlined"
                            size="small"
                          />
                        </Tooltip>
                        <Tooltip title="Coherence & Cohesion" arrow>
                          <Chip
                            icon={getScoreIcon("Coherence & Cohesion")}
                            label={item.coherenceAndCoherensionScore}
                            color={getScoreColor(
                              item.coherenceAndCoherensionScore
                            )}
                            variant="outlined"
                            size="small"
                          />
                        </Tooltip>
                        <Tooltip title="Lexical Resource" arrow>
                          <Chip
                            icon={getScoreIcon("Lexical Resource")}
                            label={item.lexicalResourceScore}
                            color={getScoreColor(item.lexicalResourceScore)}
                            variant="outlined"
                            size="small"
                          />
                        </Tooltip>
                        <Tooltip title="Grammar Range" arrow>
                          <Chip
                            icon={getScoreIcon("Grammar Range")}
                            label={item.grammarRangeScore}
                            color={getScoreColor(item.grammarRangeScore)}
                            variant="outlined"
                            size="small"
                          />
                        </Tooltip>
                      </Stack>
                    </StyledTableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No Graded Essays Found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
        <Pagination
          count={Math.ceil(essayGraded.length / tasksPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Grid>
    </div>
  );
};

export default EssayGraded;
