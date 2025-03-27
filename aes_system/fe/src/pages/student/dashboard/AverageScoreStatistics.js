// AverageScoreStatistics.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  Divider,
  Avatar,
  Tooltip,
  Button, // Thêm Button nếu bạn muốn thêm nút Retry trong trường hợp lỗi
} from "@mui/material";
import PropTypes from "prop-types";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import PeopleIcon from "@mui/icons-material/People";
import BookOnlineOutlined from "@mui/icons-material/BookOnlineOutlined";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import GradeIcon from "@mui/icons-material/Grade";
import { getAverageScoreByClassOfStudent } from "../../../redux/DashboardSilde";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Title,
  ChartTooltip,
  Legend
);

const AverageScoreStatistics = ({ tokens, studentId }) => {
  const dispatch = useDispatch();

  // Truy cập dữ liệu từ Redux store
  const { data, loading, error } = useSelector(
    (state) => state.averageScorePerClassOfStudent
  );

  useEffect(() => {
    if (tokens && studentId) {
      dispatch(getAverageScoreByClassOfStudent({ tokens, studentId }));
    }
  }, [dispatch, tokens, studentId]);

  // Tối ưu hóa việc lọc dữ liệu với useMemo
  const {
    practiceClasses,
    inClassClasses,
    totalClasses,
    overallAverageScore,
    highestScore,
    lowestScore,
    cefrDistribution,
  } = useMemo(() => {
    if (!data)
      return {
        practiceClasses: [],
        inClassClasses: [],
        totalClasses: 0,
        overallAverageScore: 0,
        highestScore: null,
        lowestScore: null,
        cefrDistribution: {},
      };

    const practice = data.filter((item) => item.isClass === "0");
    const inClass = data.filter((item) => item.isClass === "1");
    const total = data.length;
    const overallAvg =
      data.reduce((acc, item) => acc + item.averageScore, 0) / total;

    let highest = data[0];
    let lowest = data[0];
    data.forEach((item) => {
      if (item.averageScore > highest.averageScore) highest = item;
      if (item.averageScore < lowest.averageScore) lowest = item;
    });

    const cefrCount = {};
    data.forEach((item) => {
      cefrCount[item.cefrAssessment] =
        (cefrCount[item.cefrAssessment] || 0) + 1;
    });

    return {
      practiceClasses: practice,
      inClassClasses: inClass,
      totalClasses: total,
      overallAverageScore: overallAvg.toFixed(2),
      highestScore: highest,
      lowestScore: lowest,
      cefrDistribution: cefrCount,
    };
  }, [data]);

  // Điều kiện render: Kiểm tra trạng thái loading
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  // Điều kiện render: Kiểm tra lỗi
  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        {/* Nếu muốn thêm nút Retry */}
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(getAverageScoreByClassOfStudent({ tokens, studentId }))}
          sx={{ mt: 2 }}
        >
          Retry
        </Button> */}
      </Box>
    );
  }

  // Điều kiện render: Kiểm tra dữ liệu rỗng hoặc không hợp lệ
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="textSecondary">
          No data available to display.
        </Typography>
      </Box>
    );
  }

  // Chuẩn bị dữ liệu cho Pie Chart
  const pieData = {
    labels: ["Practice", "In-Class"],
    datasets: [
      {
        label: "Class Type Distribution",
        data: [practiceClasses.length, inClassClasses.length],
        backgroundColor: ["#1a237e", "#3949ab"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép đặt chiều cao cố định
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: "Class Type Distribution",
        font: {
          size: 14,
        },
      },
    },
  };

  // Chuẩn bị dữ liệu cho Line Chart (CEFR Assessment Distribution)
  const lineData = {
    labels: Object.keys(cefrDistribution),
    datasets: [
      {
        label: "CEFR Assessment Distribution",
        data: Object.values(cefrDistribution),
        fill: true,
        backgroundColor: "rgba(26, 35, 126, 0.2)", // Màu nền
        borderColor: "rgba(26, 35, 126, 1)", // Màu đường
        tension: 0.4, // Đường cong mượt mà
        pointBackgroundColor: "rgba(26, 35, 126, 1)", // Màu điểm
        pointBorderColor: "#fff", // Màu viền điểm
        pointBorderWidth: 2, // Độ dày viền điểm
        pointRadius: 5, // Kích thước điểm
        borderWidth: 2, // Độ dày đường
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép đặt chiều cao cố định
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12, // Kích thước chữ cho legend
          },
        },
      },
      title: {
        display: true,
        text: "CEFR Assessment Distribution",
        font: {
          size: 16, // Kích thước chữ cho tiêu đề
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Hiển thị giá trị trong tooltip
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 10,
          },
        },
        title: {
          display: true,
          text: "Count",
          font: {
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  // Chuẩn bị dữ liệu cho Doughnut Chart (Thay thế Bar Chart)
  const doughnutData = {
    labels: inClassClasses.map((item) => item.className || "Practice"),
    datasets: [
      {
        label: "Average Score",
        data: inClassClasses.map((item) => item.averageScore),
        backgroundColor: inClassClasses.map(
          (_, index) => `rgba(26, 35, 126, ${0.6 - index * 0.05})`
        ),
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép đặt chiều cao cố định
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: "Average Score Distribution",
        font: {
          size: 14,
        },
      },
    },
  };

  return (
    <Box
      p={2}
      bgcolor="#f9f9f9"
      borderRadius={3}
      boxShadow="0 4px 12px rgba(0,0,0,0.05)"
    >
      <Typography variant="h5" gutterBottom align="center" color="#1a237e">
        Average Score Statistics
      </Typography>

      {/* Summary Statistics */}
      <Grid container spacing={1} mb={3}>
        {/* Total Classes */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              padding: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#1a237e",
              color: "#ffffff",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                mr: 1,
                width: 25,
                height: 25,
              }}
            >
              <SchoolIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2">Total Classes</Typography>
              <Typography variant="h6">{totalClasses}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Overall Average Score */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              padding: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#3949ab",
              color: "#ffffff",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                mr: 1,
                width: 25,
                height: 25,
              }}
            >
              <AssessmentIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2">Overall Avg Score</Typography>
              <Typography variant="h6">{overallAverageScore}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Highest Score */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              padding: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#ff9800",
              color: "#ffffff",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                mr: 1,
                width: 25,
                height: 25,
              }}
            >
              <StarIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2">Highest Score</Typography>
              <Typography variant="h6">
                {highestScore ? highestScore.averageScore : "N/A"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Lowest Score */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              padding: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "#f44336",
              color: "#ffffff",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                mr: 1,
                width: 25,
                height: 25,
              }}
            >
              <GradeIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2">Lowest Score</Typography>
              <Typography variant="h6">
                {lowestScore ? lowestScore.averageScore : "N/A"}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Section - All Charts in One Row */}
      <Grid container spacing={2} mb={4}>
        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{ padding: 1, borderRadius: 2, height: 200 }}
            aria-label="Pie chart showing class type distribution"
          >
            <Pie data={pieData} options={pieOptions} />
          </Paper>
        </Grid>

        {/* Line Chart (Replacing Radar Chart) */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{ padding: 1, borderRadius: 2, height: 200 }}
            aria-label="Line chart showing CEFR assessment distribution"
          >
            <Line data={lineData} options={lineOptions} />
          </Paper>
        </Grid>

        {/* Doughnut Chart */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{ padding: 1, borderRadius: 2, height: 200 }}
            aria-label="Doughnut chart showing average score distribution"
          >
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </Paper>
        </Grid>
      </Grid>

      {/* Practice and In-Class Statistics */}
      <Grid container spacing={2}>
        {/* Practice Statistics */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 1, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar
                sx={{
                  bgcolor: "#1a237e",
                  mr: 1,
                  width: 25,
                  height: 25,
                }}
              >
                <BookOnlineOutlined fontSize="small" />
              </Avatar>
              <Typography variant="subtitle1" color="#1a237e">
                <strong>Practice</strong>
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            {practiceClasses.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No Practice Data.
              </Typography>
            ) : (
              practiceClasses.map((classItem, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 0.5 }}>
                    <Typography variant="subtitle2" color="#3949ab">
                      {classItem.className || "Practice"}
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                      Avg Score: <strong>{classItem.averageScore}</strong>
                    </Typography>
                    <Chip
                      label={`CEFR: ${classItem.cefrAssessment}`}
                      size="small"
                      color="primary"
                      sx={{ mt: 0.3 }}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        {/* In-Class Statistics */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 1, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar
                sx={{
                  bgcolor: "#3949ab",
                  mr: 1,
                  width: 25,
                  height: 25,
                }}
              >
                <PeopleIcon fontSize="small" />
              </Avatar>
              <Typography variant="subtitle1" color="#1a237e">
                <strong>In-Class</strong>
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            {inClassClasses.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No In-Class Data.
              </Typography>
            ) : (
              inClassClasses.map((classItem, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 0.5 }}>
                    <Typography variant="subtitle2" color="#3949ab">
                      {classItem.className}
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                      Avg Score: <strong>{classItem.averageScore}</strong>
                    </Typography>
                    <Chip
                      label={`CEFR: ${classItem.cefrAssessment}`}
                      size="small"
                      color="secondary"
                      sx={{ mt: 0.3 }}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Định nghĩa PropTypes cho việc xác thực props của component
AverageScoreStatistics.propTypes = {
  tokens: PropTypes.shape({
    accessToken: PropTypes.string.isRequired,
    refreshToken: PropTypes.string.isRequired,
  }).isRequired,
  studentId: PropTypes.string.isRequired,
};

export default AverageScoreStatistics;
