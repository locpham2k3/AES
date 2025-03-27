// WeeklyPerformanceStatistics.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, CircularProgress, Grid, Paper } from "@mui/material";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { getProcessOfStudent } from "../../../redux/DashboardSilde";
// Corrected import path from DashboardSilde to DashboardSlice

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend
);

// Utility function to generate different colors for classes
const generateColor = (index) => {
  const colors = [
    "#3949ab",
    "#ff9800",
    "#4caf50",
    "#f44336",
    "#9c27b0",
    "#00bcd4",
    "#ff5722",
    "#3f51b5",
    "#8bc34a",
    "#e91e63",
  ];
  return colors[index % colors.length];
};

const WeeklyPerformanceStatistics = ({ tokens, studentId }) => {
  const dispatch = useDispatch();

  // Access data from Redux store
  const { data, loading, error } = useSelector(
    (state) => state.processOfStudent
  );

  // Fetch data when component mounts or when tokens/studentId change
  useEffect(() => {
    if (tokens && studentId) {
      dispatch(getProcessOfStudent({ tokens, studentId }));
    }
  }, [dispatch, tokens, studentId]);

  // Process data to group by type (Practice or Class) and then by week
  const groupedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    const now = new Date();

    // Initialize groups: Practice and Classes
    const groups = {};

    data.forEach((item) => {
      const type =
        item.isClass === "0" ? "Practice" : item.className || "Unknown Class";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(item);
    });

    // Calculate weekly statistics for each group
    const weeklyStats = {};

    Object.keys(groups).forEach((group) => {
      const assignments = groups[group];
      const weeks = Array.from({ length: 4 }, (_, index) => {
        const start = startOfWeek(subWeeks(now, 3 - index), {
          weekStartsOn: 1,
        }); // Week starts on Monday
        const end = endOfWeek(subWeeks(now, 3 - index), { weekStartsOn: 1 });
        return {
          label: `Week ${index + 1} `,
          count: 0,
          totalScore: 0,
        };
      });

      assignments.forEach((item) => {
        const date = parseISO(item.dateOfGradedAssignment);
        weeks.forEach((week) => {
          const [_, weekNumber] = week.label.split("Week ");
          const weekIndex = parseInt(weekNumber, 10) - 1;
          const weekStart = startOfWeek(subWeeks(now, 3 - weekIndex), {
            weekStartsOn: 1,
          });
          const weekEnd = endOfWeek(subWeeks(now, 3 - weekIndex), {
            weekStartsOn: 1,
          });

          if (isWithinInterval(date, { start: weekStart, end: weekEnd })) {
            weeks[weekIndex].count += 1;
            weeks[weekIndex].totalScore += item.totalScore;
          }
        });
      });

      // Calculate average score
      const processedWeeks = weeks.map((week) => ({
        ...week,
        averageScore:
          week.count > 0 ? (week.totalScore / week.count).toFixed(2) : 0,
      }));

      weeklyStats[group] = processedWeeks;
    });

    return weeklyStats;
  }, [data]);

  // Prepare data for Practice Assignments chart
  const practiceChartData = useMemo(() => {
    if (!groupedData?.["Practice"]) return null;
    return {
      labels: groupedData["Practice"].map((week) => week.label),
      datasets: [
        {
          type: "bar",
          label: "Number of Assignments",
          data: groupedData["Practice"].map((week) => week.count),
          backgroundColor: "#3949ab",
          yAxisID: "y",
        },
        {
          type: "line",
          label: "Average Score",
          data: groupedData["Practice"].map((week) => week.averageScore),
          borderColor: "#ff9800",
          backgroundColor: "#ff9800",
          fill: false,
          yAxisID: "y1",
          tension: 0.4, // Smooth curve
          pointBackgroundColor: "#ff9800",
          pointBorderColor: "#ff9800",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#ff9800",
        },
      ],
    };
  }, [groupedData]);

  // Configuration for Practice Assignments chart
  const practiceChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false, // Allow fixed height
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
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
          text: "Weekly Practice Assignment Performance (Last 4 Weeks)",
          font: {
            size: 16,
          },
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Number of Assignments",
            font: {
              size: 14,
            },
          },
          ticks: {
            stepSize: 1,
            font: {
              size: 12,
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Average Score",
            font: {
              size: 14,
            },
          },
          grid: {
            drawOnChartArea: false, // Only draw grid for one axis
          },
          ticks: {
            beginAtZero: true,
            font: {
              size: 12,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 12,
            },
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    }),
    []
  );

  // Prepare data for Class Assignments chart
  const classChartData = useMemo(() => {
    if (!groupedData) return null;
    const classNames = Object.keys(groupedData).filter(
      (group) => group !== "Practice"
    );
    if (classNames.length === 0) return null; // No classes available

    const colors = classNames.map((_, index) => generateColor(index));

    // Assume all class groups have the same week labels
    const labels = groupedData[classNames[0]].map((week) => week.label);

    const datasets = classNames.flatMap((className, index) => [
      {
        type: "bar",
        label: `${className} - Number of Assignments`,
        data: groupedData[className].map((week) => week.count),
        backgroundColor: colors[index],
        yAxisID: "y",
      },
      {
        type: "line",
        label: `${className} - Average Score`,
        data: groupedData[className].map((week) => week.averageScore),
        borderColor: colors[index],
        backgroundColor: colors[index],
        fill: false,
        yAxisID: "y1",
        tension: 0.4, // Smooth curve
        pointBackgroundColor: colors[index],
        pointBorderColor: colors[index],
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: colors[index],
      },
    ]);

    return {
      labels: labels,
      datasets: datasets,
    };
  }, [groupedData]);

  // Configuration for Class Assignments chart
  const classChartOptions = useMemo(() => {
    if (!classChartData) return {};

    return {
      responsive: true,
      maintainAspectRatio: false, // Allow fixed height
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
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
          text: "Weekly Class Assignment Performance (Last 4 Weeks)",
          font: {
            size: 16,
          },
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Number of Assignments",
            font: {
              size: 14,
            },
          },
          ticks: {
            stepSize: 1,
            font: {
              size: 12,
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Average Score",
            font: {
              size: 14,
            },
          },
          grid: {
            drawOnChartArea: false, // Only draw grid for one axis
          },
          ticks: {
            beginAtZero: true,
            font: {
              size: 12,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 12,
            },
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    };
  }, [classChartData]);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        {/* Optional: Add Retry Button */}
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(getProcessOfStudent({ tokens, studentId }))}
          sx={{ mt: 2 }}
        >
          Retry
        </Button> */}
      </Box>
    );
  }

  // No data state
  if (!groupedData || Object.keys(groupedData).length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="textSecondary">
          No data available to display.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      p={2}
      bgcolor="#ffffff"
      borderRadius={3}
      boxShadow="0 4px 12px rgba(0,0,0,0.05)"
    >
      <Typography variant="h5" gutterBottom align="center" color="#1a237e">
        Weekly Assignment Performance
      </Typography>

      <Grid container spacing={4}>
        {/* Practice Assignments Chart */}
        {practiceChartData && (
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ padding: 2, borderRadius: 2, height: 500 }}
              aria-label="Combination chart showing weekly practice performance"
            >
              <Typography variant="h6" gutterBottom align="center">
                Practice Assignments
              </Typography>
              <Bar data={practiceChartData} options={practiceChartOptions} />
            </Paper>
          </Grid>
        )}

        {/* Class Assignments Chart */}
        {classChartData ? (
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ padding: 2, borderRadius: 2, height: 500 }}
              aria-label="Combination chart showing weekly class performance"
            >
              <Typography variant="h6" gutterBottom align="center">
                Class Assignments
              </Typography>
              <Bar data={classChartData} options={classChartOptions} />
            </Paper>
          </Grid>
        ) : (
          // Handle case where classChartData is null, undefined, or empty
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={500}
              bgcolor="#f5f5f5"
              borderRadius={2}
            >
              <Typography variant="h6" color="textSecondary">
                No class assignment data available to display.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

// Define PropTypes for component props validation
WeeklyPerformanceStatistics.propTypes = {
  tokens: PropTypes.shape({
    accessToken: PropTypes.string.isRequired,
    refreshToken: PropTypes.string.isRequired,
  }).isRequired,
  studentId: PropTypes.string.isRequired,
};

export default WeeklyPerformanceStatistics;
