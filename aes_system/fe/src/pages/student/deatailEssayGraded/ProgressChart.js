import React from "react";
import { Paper, Typography, useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    const className = payload[0].payload.className;
    return (
      <Paper elevation={3} sx={{ p: 1 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Date: {label}
        </Typography>
        <Typography variant="body2" color="textPrimary">
          Score: {score !== null ? score.toFixed(1) : "N/A"}
        </Typography>
        {className && (
          <Typography variant="body2" color="textPrimary">
            Class: {className}
          </Typography>
        )}
      </Paper>
    );
  }
  return null;
};

const ProgressChart = ({ data }) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 3, mt: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Progress Chart
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No data available.
        </Typography>
      </Paper>
    );
  }

  // Compute statistics
  const statistics = {
    totalAttempts: data.length,
    classAttempts: data.filter((item) => item.isClass === "1").length,
    nonClassAttempts: data.filter((item) => item.isClass === "0").length,
    averageScore:
      data.reduce((sum, item) => sum + item.totalScore, 0) / data.length,
    highestScore: Math.max(...data.map((item) => item.totalScore)),
    lowestScore: Math.min(...data.map((item) => item.totalScore)),
  };

  // Prepare chart data directly from input data
  const chartData = data.map((item) => ({
    date: format(parseISO(item.dateOfGradedAssignment), "MM-dd"),
    totalScore: item.totalScore,
    className: item.className,
    isClass: item.isClass,
  }));

  // Determine color based on score and isClass
  const getDotColor = (score, isClass) => {
    if (isClass === "1") return "#C2FFC7"; // Class data points
    // if (score >= 8) return "#640D5F";
    // if (score >= 6) return "#FFB200";
    // if (score >= 4) return "#EB5B00";
    // if (score >= 2) return "#D91656";
    return "#f44336";
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 4, backgroundColor: "#ffffff" }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
        Progress Over Time
      </Typography>

      {/* Statistics Display */}
      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}
      >
        <Typography variant="subtitle1">Performance Summary</Typography>
        <Typography variant="body2">
          Total Attempts: {statistics.totalAttempts}
          {" | "}Class Attempts: {statistics.classAttempts}
          {" | "}Non-Class Attempts: {statistics.nonClassAttempts}
        </Typography>
        <Typography variant="body2">
          Average Score: {statistics.averageScore.toFixed(1)}
          {" | "}Highest Score: {statistics.highestScore}
          {" | "}Lowest Score: {statistics.lowestScore}
        </Typography>
      </Paper>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.grey[300]}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: theme.palette.text.primary }}
            label={{
              value: "Date (MM-DD)",
              position: "insideBottom",
              offset: -40,
              fill: theme.palette.text.primary,
            }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fill: theme.palette.text.primary }}
            label={{
              value: "Total Score",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fill: theme.palette.text.primary,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="totalScore"
            stroke="#1976d2"
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  stroke={getDotColor(payload.totalScore, payload.isClass)}
                  strokeWidth={2}
                  fill="#fff"
                />
              );
            }}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ProgressChart;
