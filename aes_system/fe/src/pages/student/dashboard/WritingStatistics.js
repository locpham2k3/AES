// WritingStatistics.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Card,
} from "@mui/material";
import PropTypes from "prop-types";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  Title,
} from "chart.js";
import { format, parseISO } from "date-fns";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DraftsIcon from "@mui/icons-material/Drafts";
import GradeIcon from "@mui/icons-material/Grade";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import {
  getWrittingPaperStatisticOfStudent,
  getWrittingPerformanceOfStudent,
} from "../../../redux/DashboardSilde";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartTooltip,
  Legend,
  Title
);

const WritingStatistics = ({ tokens, studentId }) => {
  const dispatch = useDispatch();

  // Access data from Redux store
  const {
    data: performanceData,
    loading: performanceLoading,
    error: performanceError,
  } = useSelector((state) => state.writtingPerformanceOfStudent);

  const {
    data: paperStatisticData,
    loading: paperStatisticLoading,
    error: paperStatisticError,
  } = useSelector((state) => state.writtingPaperStatisticOfStudent);

  // Fetch data when component mounts or when tokens/studentId change
  useEffect(() => {
    if (tokens && studentId) {
      dispatch(getWrittingPerformanceOfStudent({ tokens, studentId }));
      dispatch(getWrittingPaperStatisticOfStudent({ tokens, studentId }));
    }
  }, [dispatch, tokens, studentId]);

  // Process writing performance data to prepare for Bar chart
  const writingPerformanceChartData = useMemo(() => {
    if (
      !performanceData ||
      !Array.isArray(performanceData) ||
      performanceData.length === 0
    )
      return null;

    const labels = performanceData.map(
      (item) =>
        `W${item.week} (${format(parseISO(item.startDate), "MM/dd")} - ${format(
          parseISO(item.endDate),
          "MM/dd"
        )})`
    );

    const data = performanceData.map((item) => item.totalPapers);

    return {
      labels,
      datasets: [
        {
          label: "Total Papers",
          data,
          backgroundColor: "#4caf50",
          borderColor: "#388e3c",
          borderWidth: 1,
        },
      ],
    };
  }, [performanceData]);

  // Configuration for Writing Performance Bar chart
  const writingPerformanceChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false, // Allow fixed height
      plugins: {
        legend: {
          display: false, // Hide legend for simplicity
        },
        title: {
          display: true,
          text: "Weekly Writing Performance",
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Papers",
            font: {
              size: 12,
            },
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Week",
            font: {
              size: 12,
            },
          },
          ticks: {
            font: {
              size: 10,
            },
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    }),
    []
  );

  // Prepare data for Combined Doughnut Chart
  const combinedDoughnutChartData = useMemo(() => {
    if (
      !paperStatisticData ||
      !Array.isArray(paperStatisticData) ||
      paperStatisticData.length === 0
    )
      return null;

    const {
      submittedWritingPaper,
      saveDraftWritingPaper,
      gradedWritingPaper,
      unGradedWritingPaper,
    } = paperStatisticData[0];

    return {
      labels: [
        "Submitted Papers",
        "Saved Drafts",
        "Graded Papers",
        "Ungraded Papers",
      ],
      datasets: [
        {
          label: "Papers",
          data: [
            submittedWritingPaper,
            saveDraftWritingPaper,
            gradedWritingPaper,
            unGradedWritingPaper,
          ],
          backgroundColor: ["#2196f3", "#ffeb3b", "#f44336", "#ff9800"],
          hoverBackgroundColor: ["#1976d2", "#fdd835", "#d32f2f", "#fb8c00"],
        },
      ],
    };
  }, [paperStatisticData]);

  // Handle loading state
  const isLoading = performanceLoading || paperStatisticLoading;

  // Handle error state
  const error = performanceError || paperStatisticError;

  // Handle no data state
  const hasNoData =
    (!performanceData || performanceData.length === 0) &&
    (!paperStatisticData ||
      (Array.isArray(paperStatisticData) && paperStatisticData.length === 0));

  return (
    <Box
      p={2}
      bgcolor="#ffffff"
      borderRadius={2}
      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      minHeight="60vh"
    >
      <Typography variant="h6" gutterBottom align="center" color="#1a237e">
        Writing Statistics
      </Typography>

      {/* Loading State */}
      {isLoading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {/* No Data State */}
      {hasNoData && (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" color="textSecondary">
            No data available to display.
          </Typography>
        </Box>
      )}

      {/* Main Content */}
      {!isLoading && !error && !hasNoData && (
        <Grid container spacing={2}>
          {/* Statistic Cards */}
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {/* Submitted Papers */}
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    backgroundColor: "#2196f3",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    padding: 1,
                    height: "100%",
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 30, marginRight: 1 }} />
                  <Box>
                    <Typography variant="subtitle2">Submitted</Typography>
                    <Typography variant="h6">
                      {paperStatisticData[0].submittedWritingPaper}
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              {/* Saved Drafts */}
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    backgroundColor: "#ffeb3b",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    padding: 1,
                    height: "100%",
                  }}
                >
                  <DraftsIcon sx={{ fontSize: 30, marginRight: 1 }} />
                  <Box>
                    <Typography variant="subtitle2">Saved Drafts</Typography>
                    <Typography variant="h6">
                      {paperStatisticData[0].saveDraftWritingPaper}
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              {/* Graded Papers */}
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    padding: 1,
                    height: "100%",
                  }}
                >
                  <GradeIcon sx={{ fontSize: 30, marginRight: 1 }} />
                  <Box>
                    <Typography variant="subtitle2">Graded</Typography>
                    <Typography variant="h6">
                      {paperStatisticData[0].gradedWritingPaper}
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              {/* Ungraded Papers */}
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    backgroundColor: "#ff9800",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    padding: 1,
                    height: "100%",
                  }}
                >
                  <HourglassEmptyIcon sx={{ fontSize: 30, marginRight: 1 }} />
                  <Box>
                    <Typography variant="subtitle2">Ungraded</Typography>
                    <Typography variant="h6">
                      {paperStatisticData[0].unGradedWritingPaper}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{ padding: 1, borderRadius: 1, height: 300 }}
              aria-label="Line chart showing weekly writing performance"
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                align="center"
                color="#1a237e"
              >
                Weekly Writing Performance
              </Typography>
              {writingPerformanceChartData ? (
                <Line
                  data={writingPerformanceChartData}
                  options={writingPerformanceChartOptions}
                />
              ) : (
                <Typography variant="body2" align="center">
                  No writing performance data available.
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{ padding: 1, borderRadius: 1, height: 300 }}
              aria-label="Bar chart showing submission and grading statistics"
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                align="center"
                color="#1a237e"
              >
                Submission
              </Typography>
              {combinedDoughnutChartData ? (
                <Bar
                  data={{
                    labels: [
                      "Submitted Papers",
                      "Saved Drafts",
                      "Graded Papers",
                      "Ungraded Papers",
                    ],
                    datasets: [
                      {
                        label: "Papers",
                        data: [
                          paperStatisticData[0].submittedWritingPaper,
                          paperStatisticData[0].saveDraftWritingPaper,
                          paperStatisticData[0].gradedWritingPaper,
                          paperStatisticData[0].unGradedWritingPaper,
                        ],
                        backgroundColor: [
                          "#2196f3",
                          "#ffeb3b",
                          "#f44336",
                          "#ff9800",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          font: {
                            size: 12,
                          },
                        },
                      },
                      title: {
                        display: true,
                        text: "Submission ",
                        font: {
                          size: 16,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Number of Papers",
                          font: {
                            size: 10,
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <Typography variant="body2" align="center">
                  No submission and grading data available.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

// Define PropTypes for component props validation
WritingStatistics.propTypes = {
  tokens: PropTypes.shape({
    accessToken: PropTypes.string.isRequired,
    refreshToken: PropTypes.string.isRequired,
  }).isRequired,
  studentId: PropTypes.string.isRequired,
};

export default WritingStatistics;
