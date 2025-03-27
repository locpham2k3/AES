// src/components/AverageScore.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import ScoreIcon from "@mui/icons-material/Score";
import { getAverageScoreByTeacher } from "../../../redux/DashboardSilde";
import { styled } from "@mui/system";
import { calculateStatistics } from "../../../utils/calculateStatistics";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { formatNumber } from "../../../utils/formatNumber";
import TimelineIcon from "@mui/icons-material/Timeline";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import AssessmentIcon from "@mui/icons-material/Assessment";

const StyledButton = styled(Button)({
  fontWeight: "bold",
  marginRight: "8px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#3f51b5",
    color: "#fff",
  },
});

const StyledPaper = styled(Paper)({
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
  },
});

const StatCard = styled(Box)(({ theme, color = "#ffffff" }) => ({
  padding: "20px",
  borderRadius: "15px",
  background: `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%)`,
  color: "#ffffff",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
  },
}));

const StatValue = styled(Typography)({
  fontSize: "2rem",
  fontWeight: "bold",
  marginTop: "10px",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
});

const StatLabel = styled(Typography)({
  fontSize: "0.9rem",
  opacity: 0.9,
  textTransform: "uppercase",
  letterSpacing: "1px",
});

const IconWrapper = styled(Box)({
  position: "absolute",
  right: "20px",
  top: "20px",
  opacity: 0.3,
  transform: "scale(1.5)",
});

const adjustColor = (color, amount) => {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
};

const AverageScore = ({ tokens, teacherId, classId }) => {
  const dispatch = useDispatch();
  const {
    data = [],
    loading,
    error,
  } = useSelector((state) => state.averageScoreTeacher);
  const [viewType, setViewType] = useState("bar");

  useEffect(() => {
    if (teacherId && classId) {
      dispatch(getAverageScoreByTeacher({ tokens, teacherId, classId }));
    }
  }, [dispatch, tokens, teacherId, classId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data)
    return <Alert severity="info">No average score data available.</Alert>;

  // Compute statistics for each class
  const statistics = data.map((classScore) => {
    const { classAverage, studentData } = classScore;
    const { highest, lowest, average, stdDev } =
      calculateStatistics(studentData);

    return {
      ...classScore,
      highestScore: highest,
      lowestScore: lowest,
      classStdDev: stdDev,
      classAverage: average,
    };
  });

  const renderChart = (studentData) => {
    if (viewType === "pie") {
      return (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={studentData}
              dataKey="averageScore"
              nameKey="studentName"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#3f51b5"
              label
            >
              {studentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`#${((Math.random() * 0xffffff) << 0).toString(16)}`}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (viewType === "line") {
      return (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={studentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="studentName" />
            <YAxis />
            <ChartTooltip />
            <Line type="monotone" dataKey="averageScore" stroke="#3f51b5" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={studentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="studentName" />
          <YAxis domain={[0, 5]} />
          <ChartTooltip />
          <Bar dataKey="averageScore" fill="#3f51b5" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          <ScoreIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Average Scores
        </Typography>

        <Box mb={2}>
          <StyledButton
            variant={viewType === "bar" ? "contained" : "outlined"}
            onClick={() => setViewType("bar")}
          >
            Bar Chart
          </StyledButton>
          <StyledButton
            variant={viewType === "line" ? "contained" : "outlined"}
            onClick={() => setViewType("line")}
          >
            Line Chart
          </StyledButton>
          <StyledButton
            variant={viewType === "pie" ? "contained" : "outlined"}
            onClick={() => setViewType("pie")}
          >
            Pie Chart
          </StyledButton>
        </Box>

        {statistics.map((classScore, index) => (
          <StyledPaper key={index}>
            <Typography variant="h6" gutterBottom>
              Class: {classScore.className}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard color="#2196f3">
                    <IconWrapper>
                      <AssessmentIcon fontSize="large" />
                    </IconWrapper>
                    <StatLabel>Class Average</StatLabel>
                    <StatValue>
                      {formatNumber(classScore.classAverage)}
                    </StatValue>
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                      <TrendingUpIcon sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {classScore.classAverage > 3
                          ? "Above Average"
                          : "Below Average"}
                      </Typography>
                    </Box>
                  </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatCard color="#4caf50">
                    <IconWrapper>
                      <StarIcon fontSize="large" />
                    </IconWrapper>
                    <StatLabel>Highest Score</StatLabel>
                    <StatValue>
                      {formatNumber(classScore.highestScore)}
                    </StatValue>
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                      <GroupIcon sx={{ mr: 1 }} />
                      <Typography variant="body2">Top Performer</Typography>
                    </Box>
                  </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatCard color="#f44336">
                    <IconWrapper>
                      <TimelineIcon fontSize="large" />
                    </IconWrapper>
                    <StatLabel>Lowest Score</StatLabel>
                    <StatValue>
                      {formatNumber(classScore.lowestScore)}
                    </StatValue>
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                      <ShowChartIcon sx={{ mr: 1 }} />
                      <Typography variant="body2">Needs Improvement</Typography>
                    </Box>
                  </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatCard color="#ff9800">
                    <IconWrapper>
                      <EqualizerIcon fontSize="large" />
                    </IconWrapper>
                    <StatLabel>Standard Deviation</StatLabel>
                    <StatValue>
                      {formatNumber(classScore.classStdDev)}
                    </StatValue>
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                      <AssessmentIcon sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Score Distribution
                      </Typography>
                    </Box>
                  </StatCard>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom>
                      Score Distribution
                    </Typography>
                    <Box sx={{ p: 2 }}>
                      {[
                        {
                          range: "4.0-5.0",
                          label: "Excellent",
                          color: "#4caf50",
                        },
                        { range: "3.0-3.9", label: "Good", color: "#2196f3" },
                        {
                          range: "2.0-2.9",
                          label: "Average",
                          color: "#ff9800",
                        },
                        {
                          range: "0.0-1.9",
                          label: "Needs Improvement",
                          color: "#f44336",
                        },
                      ].map((category) => {
                        const count = classScore.studentData.filter(
                          (student) =>
                            student.averageScore >=
                              parseFloat(category.range.split("-")[0]) &&
                            student.averageScore <=
                              parseFloat(category.range.split("-")[1])
                        ).length;
                        const percentage =
                          (count / classScore.studentData.length) * 100;

                        return (
                          <Box key={category.range} sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>{category.label}</Typography>
                              <Typography>{`${count} students (${percentage.toFixed(1)}%)`}</Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "100%",
                                bgcolor: "#f5f5f5",
                                borderRadius: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${percentage}%`,
                                  height: 8,
                                  bgcolor: category.color,
                                  borderRadius: 1,
                                  transition: "width 1s ease-in-out",
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </StyledPaper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom>
                      Performance Insights
                    </Typography>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body1" paragraph>
                        • Class Performance:{" "}
                        {classScore.classAverage > 3.5
                          ? "Strong"
                          : "Needs attention"}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        • Score Range:{" "}
                        {formatNumber(
                          classScore.highestScore - classScore.lowestScore
                        )}{" "}
                        points
                      </Typography>
                      <Typography variant="body1" paragraph>
                        • Distribution:{" "}
                        {classScore.classStdDev < 1 ? "Consistent" : "Varied"}{" "}
                        performance
                      </Typography>
                      <Typography variant="body1">
                        • Recommendation:{" "}
                        {classScore.classAverage < 3
                          ? "Consider additional support and review sessions"
                          : "Maintain current teaching approach"}
                      </Typography>
                    </Box>
                  </StyledPaper>
                </Grid>
              </Grid>
            </Box>

            {/* Render selected chart */}
            {renderChart(classScore.studentData)}

            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <strong>Student Scores:</strong>
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Average Score</TableCell>
                  <TableCell>CEFR Assessment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classScore.studentData.map((student, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.rollNumber || "N/A"}</TableCell>
                    <TableCell>{student.averageScore}</TableCell>
                    <TableCell>{student.cefraAssessment || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledPaper>
        ))}
      </CardContent>
    </Card>
  );
};

export default AverageScore;
