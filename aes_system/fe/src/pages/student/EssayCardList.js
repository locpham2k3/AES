import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEssaysByWorkbook } from "../../redux/StudentSlide";
import {
  CircularProgress,
  Alert,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Paper,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DraftsIcon from "@mui/icons-material/Drafts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GradeIcon from "@mui/icons-material/Grade";

const EssayCardList = () => {
  const { type } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { essay, loading, error } = useSelector((state) => state.essay);
  const profile = useSelector((state) => state.auth.user);
  const StudentID = profile?.profile.StudentID;
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const tasksPerPage = 5;

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(
      fetchEssaysByWorkbook({ tokens, typeWorkBook: type, id: StudentID })
    );
  }, [dispatch, type, StudentID]);

  const filteredTasks = essay.filter((item) =>
    item.taskName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (isSubmitted) => {
    switch (parseInt(isSubmitted)) {
      case 0:
        return {
          icon: <EditIcon sx={{ fontSize: 20, marginRight: 1 }} />,
          label: "Not Started",
          chipProps: {
            sx: {
              backgroundColor: "#f5f5f5",
              color: "#455a64",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
              fontSize: "0.6rem",
              fontWeight: 400,
              padding: "4px 8px",
              height: "auto",
              borderRadius: "6px",
              border: "1px solid #e0e0e0",
            },
          },
        };
      case 1:
        return {
          icon: <DraftsIcon sx={{ fontSize: 20, marginRight: 1 }} />,
          label: "Draft Saved",
          chipProps: {
            sx: {
              backgroundColor: "#e3f2fd",
              color: "#0d47a1",
              "&:hover": {
                backgroundColor: "#bbdefb",
              },
              fontSize: "0.6rem",
              fontWeight: 400,
              padding: "4px 8px",
              height: "auto",
              borderRadius: "6px",
              border: "1px solid #90caf9",
            },
          },
        };
      case 2:
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 20, marginRight: 1 }} />,
          label: "Submitted",
          chipProps: {
            sx: {
              backgroundColor: "#e8f5e9",
              color: "#1b5e20",
              "&:hover": {
                backgroundColor: "#c8e6c9",
              },
              fontSize: "0.6rem",
              fontWeight: 400,
              padding: "4px 8px",
              height: "auto",
              borderRadius: "6px",
              border: "1px solid #a5d6a7",
            },
          },
        };
      default:
        return {};
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Alert severity="error">
          <Typography variant="h6">Error: {error}</Typography>
        </Alert>
      </Grid>
    );
  }

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div
      style={{
        padding: "30px",
        margin: "0 auto",
        backgroundColor: "#f8fafc",
      }}
    >
      <Grid container alignItems="center" style={{ marginBottom: "30px" }}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            align="center"
            style={{
              fontWeight: "500",
              color: "#1a237e",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Essay Tasks
          </Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" style={{ marginBottom: "30px" }}>
        <Grid item xs={8}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search by workbook category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: "14px",
                borderRadius: "12px",
                border: "2px solid #e0e7ff",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                outline: "none",
                "&:focus": {
                  borderColor: "#3f51b5",
                  boxShadow: "0 2px 12px rgba(63,81,181,0.15)",
                },
              }}
            />
          </div>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          backgroundColor: "white",
          border: "1px solid #e0e7ff",
        }}
      >
        <Table>
          <TableBody>
            {currentTasks.length > 0 ? (
              currentTasks.map((item, index) => (
                <TableRow
                  key={item.id}
                  onClick={() =>
                    navigate(`/student/essay/essay-writing/${item.id}`, {
                      state: {
                        isSubmitted: parseInt(item.isSubmitted),
                        workbookEssayTaskId: item.workbookEssayTaskId,
                        check: 0,
                        writingPaperId: item?.writingPaperId || "",
                      },
                    })
                  }
                  onMouseEnter={() => setHoveredTask(index)}
                  onMouseLeave={() => setHoveredTask(null)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor:
                      parseInt(item.isSubmitted) === 0
                        ? "#ffffff"
                        : parseInt(item.isSubmitted) === 1
                          ? "#89A8B2"
                          : "#A1EEBD",
                    transform:
                      hoveredTask === index ? "scale(1.005)" : "scale(1)",
                    boxShadow:
                      hoveredTask === index
                        ? "0px 4px 14px rgba(0, 0, 0, 0.1)"
                        : "none",
                  }}
                >
                  <TableCell
                    style={{ width: "15%", borderBottom: "1px solid #e0e7ff" }}
                  >
                    <Typography
                      variant="h6"
                      style={{
                        color: "#3f51b5",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {`Task ${indexOfFirstTask + index + 1}`}
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ width: "70%", borderBottom: "1px solid #e0e7ff" }}
                  >
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: "600",
                        color: hoveredTask === index ? "#3f51b5" : "#2c3e50",
                        transition: "color 0.3s ease",
                        fontSize: "1.1rem",
                        marginBottom: "10px",
                        lineHeight: "1.4",
                      }}
                    >
                      {item.taskName}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        color: "#546e7a",
                        fontSize: "0.95rem",
                        lineHeight: "1.6",
                      }}
                    >
                      {item.taskPlainContent}
                    </Typography>

                    {hoveredTask === index && (
                      <div
                        style={{
                          marginTop: "15px",
                          padding: "15px",
                          backgroundColor: "#fafbff",
                          borderRadius: "12px",
                          border: "1px solid #e3e8ff",
                          boxShadow: "0 2px 8px rgba(63,81,181,0.08)",
                        }}
                      >
                        <Typography
                          variant="body2"
                          style={{
                            color: "#3f51b5",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "8px",
                            fontSize: "0.95rem",
                          }}
                        >
                          <strong>Word Limit:</strong>
                          <span
                            style={{
                              marginLeft: "8px",
                              backgroundColor: "#e3e8ff",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "0.6rem",
                            }}
                          >
                            {item.wordCountLimit} words
                          </span>
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            color: "#3f51b5",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.75rem",
                          }}
                        >
                          <strong>Duration:</strong>
                          <span
                            style={{
                              marginLeft: "8px",
                              backgroundColor: "#e3e8ff",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "0.6rem",
                            }}
                          >
                            {item.durationLimit} minutes
                          </span>
                        </Typography>
                      </div>
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      width: "20%",
                      borderBottom: "1px solid #e0e7ff",
                      padding: "16px 24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "8px",
                      }}
                    >
                      <Chip
                        icon={getStatusConfig(item.isSubmitted).icon}
                        label={getStatusConfig(item.isSubmitted).label}
                        {...getStatusConfig(item.isSubmitted).chipProps}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography
                    variant="body1"
                    style={{
                      color: "#9e9e9e",
                      padding: "40px 0",
                      fontSize: "1.1rem",
                    }}
                  >
                    No essays found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container justifyContent="center" style={{ marginTop: "30px" }}>
        <Pagination
          count={Math.ceil(filteredTasks.length / tasksPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
          size="large"
          style={{
            "& .MuiPaginationItem-root": {
              fontSize: "1.1rem",
            },
          }}
        />
      </Grid>
    </div>
  );
};

export default EssayCardList;
