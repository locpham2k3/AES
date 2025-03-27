import React, { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Popover,
  IconButton,
  Box,
  TableCell,
  Divider,
  TableFooter,
  TablePagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { styled } from "@mui/material/styles";
import { stringToColor } from "../../../utils/colorUtils";

// Styled components for consistent styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  padding: theme.spacing(1.5),
}));

const FeedbackSummary = ({ feedbackData, essayContent }) => {
  console.log("FeedbackSummary props:", { feedbackData, essayContent }); // Debugging
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMistake, setSelectedMistake] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  // Pagination states
  const [page, setPage] = useState(0);
  const rowsPerPage = 5; // Fixed to 5 as per requirement

  // Remove the filter to include all feedback items
  const filteredFeedbackData = useMemo(() => {
    console.log("Filtered Feedback Data (all):", feedbackData); // Debugging
    return feedbackData;
  }, [feedbackData]);

  // Process feedback to create a summary
  const errorSummary = useMemo(() => {
    const summary = filteredFeedbackData.reduce((acc, range) => {
      if (range?.mistakeDescription && range?.categoryName) {
        const key = `${range.categoryName}-${range.mistakeDescription}`;
        if (!acc[key]) {
          acc[key] = {
            category: range.categoryName,
            mistake: range.mistakeDescription,
            count: 0,
            feedbacks: [],
          };
        }
        acc[key].count += 1;

        // Determine endPosition if not present
        const endPosition =
          Number(range.endPosition) || Number(range.startPosition) + 10; // Default to 10 characters

        // Extract text snippet from essayContent
        const text =
          essayContent && Number(range.startPosition) < essayContent.length
            ? essayContent.substring(
                Number(range.startPosition),
                Number(endPosition) > essayContent.length
                  ? essayContent.length
                  : Number(endPosition)
              )
            : "N/A";

        acc[key].feedbacks.push({
          text: text,
          feedback: range.comment,
        });
      }
      return acc;
    }, {});
    console.log("Error Summary:", summary); // Debugging
    return summary;
  }, [filteredFeedbackData, essayContent]);

  const errorSummaryArray = useMemo(
    () => Object.values(errorSummary),
    [errorSummary]
  );
  console.log("Error Summary Array:", errorSummaryArray); // Debugging

  const handleRowClick = (event, category, mistake, feedbackList) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
    setSelectedMistake(mistake);
    setFeedbacks(feedbackList);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
    setSelectedMistake(null);
    setFeedbacks([]);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Helper function to get color for category
  const getCategoryColor = (categoryName) => {
    return stringToColor(categoryName) || "#000"; // Default to black if not found
  };

  // Calculate the rows to display based on the current page
  const paginatedErrorSummary = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return errorSummaryArray.slice(start, end);
  }, [errorSummaryArray, page, rowsPerPage]);

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 4, backgroundColor: "#ffffff" }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Feedback Summary
      </Typography>
      <TableContainer>
        <Table size="medium" aria-label="feedback summary">
          <TableHead>
            <TableRow>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Mistake</StyledTableCell>
              <StyledTableCell align="right">Count</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedErrorSummary.length > 0 ? (
              paginatedErrorSummary.map((error, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={(e) =>
                    handleRowClick(
                      e,
                      error.category,
                      error.mistake,
                      error.feedbacks
                    )
                  }
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FiberManualRecordIcon
                        fontSize="small"
                        sx={{
                          color: getCategoryColor(error.category),
                          mr: 1,
                        }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {error.category}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{error.mistake}</TableCell>
                  <TableCell align="right">{error.count}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2">
                    Không có feedback nào.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* Add TableFooter with Pagination if there are more than 5 items */}
          {errorSummaryArray.length > rowsPerPage && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[rowsPerPage]}
                  colSpan={3}
                  count={errorSummaryArray.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  // Hide the label "Rows per page" since it's fixed
                  labelRowsPerPage=""
                  // Remove the select component for rows per page
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>

      {/* Popover to display Feedback details */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: { padding: 2, maxWidth: 500 },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {`${selectedCategory} - ${selectedMistake}`}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <TableContainer
          sx={{
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          <Table size="small" aria-label="feedback details">
            <TableHead>
              <TableRow>
                <StyledTableCell>Highlighted Text</StyledTableCell>
                <StyledTableCell>Feedback</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((feedbackItem, idx) => (
                <TableRow key={idx}>
                  <TableCell>{feedbackItem.text}</TableCell>
                  <TableCell>{feedbackItem.feedback}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Popover>
    </Paper>
  );
};

export default FeedbackSummary;
