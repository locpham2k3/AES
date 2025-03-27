import React, { useState } from "react";
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Popover,
  TextField,
  Button,
  IconButton,
  Box,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { StyledTableCell } from "./StyledComponents";

const FeedbackSummary = ({ highlightedRanges, categoryData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMistake, setSelectedMistake] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [updatedFeedback, setUpdatedFeedback] = useState("");
  const [page, setPage] = useState(0); // Track the current page for the summary table
  const [rowsPerPage] = useState(5); // Items per page for both tables

  // Generate error summary data from highlightedRanges
  const errorSummary = highlightedRanges.reduce((acc, range) => {
    if (range?.subError?.description) {
      const key = `${range.errorType}-${range.subError.description}`;
      if (!acc[key]) {
        acc[key] = {
          category: range.errorType,
          mistake: range.subError.description,
          count: 0,
          feedbacks: [],
        };
      }
      acc[key].count += 1;
      acc[key].feedbacks.push({
        text: range.text,
        feedback: range.feedback,
      });
    }
    return acc;
  }, {});

  const errorSummaryArray = Object.values(errorSummary);

  const handleRowClick = (event, category, mistake, feedbackList) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
    setSelectedMistake(mistake);
    setFeedbacks(feedbackList);

    const currentFeedback = feedbackList.find(
      (item) => item.category === category && item.mistake === mistake
    );

    if (currentFeedback) {
      setUpdatedFeedback(currentFeedback.feedback);
    }

    setEditingIndex(
      feedbackList.findIndex(
        (item) => item.category === category && item.mistake === mistake
      )
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setUpdatedFeedback(feedbacks[index].feedback);
  };

  const handleSaveFeedback = (index) => {
    const updatedFeedbacks = [...feedbacks];
    updatedFeedbacks[index] = {
      ...updatedFeedbacks[index],
      feedback: updatedFeedback,
    };
    setFeedbacks(updatedFeedbacks);
    setEditingIndex(null);
    setUpdatedFeedback("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Pagination: Slice the error summary and feedbacks for the current page
  const paginatedErrorSummaryArray = errorSummaryArray.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const paginatedFeedbacks = feedbacks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">Found Mistakes Summary</Typography>

      {/* Summary Table */}
      <TableContainer>
        <Table size="small" aria-label="feedback summary">
          <TableHead>
            <TableRow>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Mistake</StyledTableCell>
              <StyledTableCell>Count</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedErrorSummaryArray.map((error, index) => (
              <TableRow
                key={index}
                onClick={(e) =>
                  handleRowClick(
                    e,
                    error.category,
                    error.mistake,
                    error.feedbacks
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <StyledTableCell>{error.category}</StyledTableCell>
                <StyledTableCell>{error.mistake}</StyledTableCell>
                <StyledTableCell>{error.count}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination for the Summary Table */}
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={errorSummaryArray.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />

      {/* Popover with Feedbacks Table */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ minWidth: 400, maxWidth: 600, width: "100%" }}
      >
        <Paper sx={{ p: 2, minWidth: 400 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" gutterBottom>
              {`${selectedCategory} - ${selectedMistake}`}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Feedbacks Table with Pagination */}
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
                {paginatedFeedbacks.map((feedbackItem, index) => (
                  <TableRow key={index}>
                    <StyledTableCell>{feedbackItem.text}</StyledTableCell>
                    <StyledTableCell>
                      {editingIndex === index ? (
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={updatedFeedback}
                          onChange={(e) => setUpdatedFeedback(e.target.value)}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 150,
                          }}
                        >
                          {feedbackItem.feedback.length > 30
                            ? `${feedbackItem.feedback.slice(0, 30)}...`
                            : feedbackItem.feedback}
                        </Typography>
                      )}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination for Feedbacks Table */}
          <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={feedbacks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </Popover>
    </Paper>
  );
};

export default FeedbackSummary;
