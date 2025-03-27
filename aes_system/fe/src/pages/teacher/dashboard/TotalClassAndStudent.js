import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GroupsIcon from "@mui/icons-material/Groups";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import { getTotalClassAndStudentByTeacher } from "../../../redux/DashboardSilde";

// Custom Color Palette
const colorPalette = {
  primary: "#4CAF50", // Xanh lá tươi sáng
  secondary: "#FF7043", // Cam ấm áp
  accent: "#42A5F5", // Xanh dương nhẹ nhàng
  background: "#F5F7FA", // Nền sáng
  textPrimary: "#37474F",
  studentColor: "#FF7043",
  classColor: "#4CAF50",
  lineColor: "#42A5F5",
  gradientStart: "#E8F5E9",
  gradientEnd: "#F9FBE7",
};

// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: colorPalette.primary,
    },
    secondary: {
      main: colorPalette.secondary,
    },
    background: {
      default: colorPalette.background,
    },
    text: {
      primary: colorPalette.textPrimary,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Styled components with enhanced color scheme
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  background: `linear-gradient(135deg, ${colorPalette.gradientStart} 0%, ${colorPalette.gradientEnd} 100%)`,
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 48px rgba(0,0,0,0.12)",
  },
}));

const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-6px)",
    "& .icon-container": {
      transform: "scale(1.1) rotate(5deg)",
    },
  },
  "& .icon-container": {
    width: 80,
    height: 80,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    background: colorPalette.gradientStart,
  },
}));

const TotalClassAndStudent = ({ tokens, teacherId }) => {
  const dispatch = useDispatch();
  const {
    data = [],
    loading,
    error,
  } = useSelector((state) => state.totalClassAndStudentTeacher);

  useEffect(() => {
    if (teacherId && tokens)
      dispatch(getTotalClassAndStudentByTeacher({ tokens, teacherId }));
  }, [dispatch, tokens, teacherId]);

  // Memoized data processing
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const { classData } = data[0];

    // Transform class data for visualization
    return classData.map((classItem) => ({
      name: classItem.className,
      students: classItem.totalStudentInClass,
      averageStudentsPerClass: classItem.totalStudentInClass,
    }));
  }, [data]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!processedData) return null;

  const { totalClass, totalStudent } = data[0];
  const averageStudentsPerClass = totalStudent / totalClass;

  return (
    <ThemeProvider theme={theme}>
      <StyledCard>
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            mb={3}
            color={colorPalette.textPrimary}
          >
            <SchoolIcon
              sx={{ fontSize: 40, mr: 2, color: colorPalette.primary }}
            />
            <Typography variant="h5" fontWeight="bold">
              Class and Student Overview
            </Typography>
          </Box>

          {/* Overall Statistics */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <StatBox>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <BarChartIcon
                    sx={{
                      fontSize: 48,
                      color: colorPalette.classColor,
                      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                    }}
                  />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Classes
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {totalClass}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Active Teaching Groups
                </Typography>
              </StatBox>
            </Grid>

            <Grid item xs={12} md={4}>
              <StatBox>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <PeopleIcon
                    sx={{
                      fontSize: 48,
                      color: colorPalette.studentColor,
                      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                    }}
                  />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Students
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="secondary">
                  {totalStudent}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Enrolled Learners
                </Typography>
              </StatBox>
            </Grid>

            <Grid item xs={12} md={4}>
              <StatBox>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <TrendingUpIcon
                    sx={{
                      fontSize: 48,
                      color: colorPalette.lineColor,
                      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                    }}
                  />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Average per Class
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {averageStudentsPerClass.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Avg. Students per Class
                </Typography>
              </StatBox>
            </Grid>
          </Grid>

          {/* Detailed Class-wise Visualization */}
          <Typography variant="h6" mb={2} color={colorPalette.textPrimary}>
            Class-wise Student Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={processedData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colorPalette.primary}
                opacity={0.3}
              />
              <XAxis dataKey="name" stroke={colorPalette.textPrimary} />
              <YAxis yAxisId="left" stroke={colorPalette.textPrimary} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={colorPalette.textPrimary}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: `1px solid ${colorPalette.primary}`,
                  borderRadius: "8px",
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <Paper
                        sx={{
                          p: 2,
                          background: "white",
                          border: `1px solid ${colorPalette.primary}`,
                          borderRadius: "8px",
                        }}
                      >
                        <Typography
                          variant="h6"
                          color={colorPalette.textPrimary}
                        >
                          {data.name}
                        </Typography>
                        <Typography color={colorPalette.studentColor}>
                          Students: {data.students}
                        </Typography>
                      </Paper>
                    );
                  }
                  return null;
                }}
              />
              <Legend iconType="circle" color={colorPalette.textPrimary} />
              <Bar
                yAxisId="left"
                dataKey="students"
                barSize={20}
                fill={colorPalette.studentColor}
                name="Number of Students"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="averageStudentsPerClass"
                stroke={colorPalette.lineColor}
                name="Avg. Students"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </StyledCard>
    </ThemeProvider>
  );
};

export default TotalClassAndStudent;
