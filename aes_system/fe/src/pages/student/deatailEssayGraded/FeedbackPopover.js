// FeedbackPopover.jsx
import React from "react";
import { Popover, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FeedbackPopover = ({
  anchorEl,
  open,
  onClose,
  feedback, // Feedback object
  date,
}) => {
  console.log("FeedbackPopover props:", { feedback, date }); // Debugging

  if (!feedback) return null; // Ensure feedback is provided

  const { categoryName, mistakeDescription, comment } = feedback;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      sx={{
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 3, maxWidth: 350, bgcolor: "#f9f9f9" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#1976d2", fontWeight: "bold" }}
          >
            Feedback Details
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "#757575" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ color: "#616161", mb: 1 }}>
          <strong>Category:</strong> {categoryName}
        </Typography>
        <Typography variant="body2" sx={{ color: "#616161", mb: 1 }}>
          <strong>Description:</strong> {mistakeDescription}
        </Typography>
        <Typography variant="body2" sx={{ color: "#616161", mb: 2 }}>
          <strong>Comment:</strong> {comment}
        </Typography>
        {/* Optionally display date and total score */}
        {date && (
          <Typography variant="body2" sx={{ color: "#616161", mb: 1 }}>
            <strong>Date:</strong> {date}
          </Typography>
        )}
      </Box>
    </Popover>
  );
};

export default FeedbackPopover;
