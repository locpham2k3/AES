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
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

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
import { getGradingEffectByTeacher } from "../../../redux/DashboardSilde";

// Custom Color Palette
const colorPalette = {
  primary: "#0ea5e9", // Sky Blue - màu chủ đạo
  secondary: "#10b981", // Emerald Green
  accent: "#f43f5e", // Rose Red
  background: "#ffffff", // Pure White
  surface: "#f8fafc", // Light Gray Surface
  textPrimary: "#0f172a", // Slate Dark
  textSecondary: "#475569", // Slate Medium
  gradedColor: "#22c55e", // Success Green
  ungradedColor: "#f97316", // Warning Orange
  lineColor: "#6366f1", // Indigo
  chartBackground: "#ffffff",
  border: "#e2e8f0", // Slate Light
  hover: "#f1f5f9", // Hover State
};

// Custom Theme
const theme = createTheme({
  palette: {
    primary: { main: colorPalette.primary },
    secondary: { main: colorPalette.secondary },
    error: { main: colorPalette.accent },
    background: { default: colorPalette.background },
    text: {
      primary: colorPalette.textPrimary,
      secondary: colorPalette.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.3px",
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: "0.1px",
    },
  },
  shape: {
    borderRadius: 16,
  },
});

// Styled components with enhanced color scheme
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${colorPalette.border}`,
  background: colorPalette.background,
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow:
      "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transform: "translateY(-4px)",
  },
}));

const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: colorPalette.surface,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${colorPalette.border}`,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${colorPalette.primary}, ${colorPalette.secondary})`,
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
  },
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "&::before": {
      opacity: 1,
    },
  },
}));

const GradingEffect = ({ tokens, teacherId }) => {
  const dispatch = useDispatch();
  const {
    data = [],
    loading,
    error,
  } = useSelector((state) => state.gradingEffectTeacher);

  useEffect(() => {
    if (teacherId && tokens)
      dispatch(getGradingEffectByTeacher({ tokens, teacherId }));
  }, [dispatch, tokens, teacherId]);

  // Memoized data processing
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const { classData } = data[0];

    // Transform class data for visualization
    return classData.map((classItem) => ({
      name: classItem.className || "Practical",
      graded: classItem.totalGradedInClass,
      ungraded: classItem.totalUngradeInClass,
      gradingRate: parseFloat(
        (
          (classItem.totalGradedInClass /
            (classItem.totalGradedInClass + classItem.totalUngradeInClass)) *
          100
        ).toFixed(2)
      ),
    }));
  }, [data]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!processedData) return null;

  // Overall statistics
  const totalGraded = processedData.reduce((sum, item) => sum + item.graded, 0);
  const totalUngraded = processedData.reduce(
    (sum, item) => sum + item.ungraded,
    0
  );
  const overallGradingRate = parseFloat(
    ((totalGraded / (totalGraded + totalUngraded)) * 100).toFixed(2)
  );

  return (
    <ThemeProvider theme={theme}>
      <StyledCard>
        <CardContent>
          {/* Header with gradient underline */}
          <Box
            sx={{
              position: "relative",
              pb: 2,
              mb: 4,
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100px",
                height: "4px",
                background: `linear-gradient(90deg, ${colorPalette.primary}, ${colorPalette.secondary})`,
                borderRadius: "2px",
              },
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <AssessmentIcon
                sx={{
                  fontSize: 40,
                  color: colorPalette.primary,
                  filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                }}
              />
              <Typography variant="h5" color="textPrimary">
                Comprehensive Grading Analysis
              </Typography>
            </Box>
          </Box>

          {/* Stats Grid with enhanced styling */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <StatBox>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <CheckCircleIcon
                    sx={{
                      fontSize: 36,
                      color: colorPalette.gradedColor,
                      mb: 1,
                      filter: "drop-shadow(0px 2px 4px rgba(34, 197, 94, 0.2))",
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    gutterBottom
                  >
                    Total Graded
                  </Typography>
                  <Typography
                    variant="h4"
                    color="textPrimary"
                    fontWeight="bold"
                  >
                    {totalGraded}
                  </Typography>
                </Box>
              </StatBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatBox>
                <PendingIcon
                  sx={{
                    fontSize: 40,
                    mb: 1,
                    color: colorPalette.ungradedColor,
                  }}
                />
                <Typography variant="h6" color="error">
                  Total Ungraded
                </Typography>
                <Typography variant="h4" color="error">
                  {totalUngraded}
                </Typography>
              </StatBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatBox>
                <Typography variant="h6" color="primary">
                  Overall Grading Rate
                </Typography>
                <Typography variant="h4" sx={{ color: colorPalette.secondary }}>
                  {overallGradingRate}%
                </Typography>
              </StatBox>
            </Grid>
          </Grid>

          {/* Enhanced Chart Container */}
          <Box
            sx={{
              background: colorPalette.surface,
              p: 3,
              borderRadius: 2,
              border: `1px solid ${colorPalette.border}`,
            }}
          >
            <Typography
              variant="h6"
              mb={3}
              color="textPrimary"
              sx={{ borderBottom: `2px solid ${colorPalette.border}`, pb: 1 }}
            >
              Class Performance Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={colorPalette.border}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  stroke={colorPalette.textSecondary}
                  tick={{ fill: colorPalette.textSecondary, fontSize: 12 }}
                  tickLine={{ stroke: colorPalette.border }}
                />
                <YAxis
                  yAxisId="left"
                  stroke={colorPalette.textSecondary}
                  tick={{ fill: colorPalette.textSecondary, fontSize: 12 }}
                  tickLine={{ stroke: colorPalette.border }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={colorPalette.lineColor}
                  tick={{ fill: colorPalette.lineColor, fontSize: 12 }}
                  tickLine={{ stroke: colorPalette.lineColor }}
                  domain={[0, 100]}
                  unit="%"
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
                          <Typography color={colorPalette.gradedColor}>
                            Graded: {data.graded}
                          </Typography>
                          <Typography color={colorPalette.ungradedColor}>
                            Ungraded: {data.ungraded}
                          </Typography>
                          <Typography color={colorPalette.lineColor}>
                            Grading Rate: {data.gradingRate}%
                          </Typography>
                        </Paper>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" />
                <Bar
                  yAxisId="left"
                  dataKey="graded"
                  barSize={20}
                  fill={colorPalette.gradedColor}
                  name="Graded Items"
                />
                <Bar
                  yAxisId="left"
                  dataKey="ungraded"
                  barSize={20}
                  fill={colorPalette.ungradedColor}
                  name="Ungraded Items"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gradingRate"
                  stroke={colorPalette.lineColor}
                  strokeWidth={2}
                  dot={{ fill: colorPalette.lineColor, strokeWidth: 2 }}
                  name="Grading Rate (%)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </StyledCard>
    </ThemeProvider>
  );
};

export default GradingEffect;
