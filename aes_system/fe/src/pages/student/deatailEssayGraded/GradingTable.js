// src/components/Student/GradingTable.jsx

import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// StyledTableCell for consistent header styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  textAlign: "center",
}));

const GradingTable = ({ grades }) => {
  // Define the grading categories with corresponding keys and labels
  const gradingCategories = [
    { key: "taskAchievementScore", label: "Task Achievement" },
    { key: "coherenceAndCoherensionScore", label: "Coherence & Cohesion" },
    { key: "lexicalResourceScore", label: "Lexical Resource" },
    { key: "grammarRangeScore", label: "Grammar Range" },
  ];

  // Calculate total and maximum scores
  const totalScore = gradingCategories.reduce((acc, category) => {
    const score = grades[category.key];
    return acc + (typeof score === "number" ? score : 0);
  }, 0);

  const maximumTotal = gradingCategories.length * 10; // Assuming each category max is 10

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Grading Summary
      </Typography>
      <TableContainer>
        <Table size="small" aria-label="grading table">
          <TableBody>
            {gradingCategories.map((category) => (
              <TableRow key={category.key}>
                <TableCell>{category.label}</TableCell>
                <TableCell align="center">
                  {grades[category.key] !== undefined
                    ? grades[category.key]
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
            {/* Total Score Row */}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GradingTable;
