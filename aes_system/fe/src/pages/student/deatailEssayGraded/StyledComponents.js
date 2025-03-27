// src/components/StyledComponents.jsx

import { styled } from "@mui/material/styles";
import { getContrastTextColor, stringToColor } from "../../../utils/colorUtils";

export const HighlightedText = styled("span")(({ theme, categoryName }) => {
  // Import the color utility functions

  // Generate a consistent color based on the category name
  const backgroundColor = categoryName
    ? stringToColor(categoryName)
    : "#ffff99"; // Default light yellow

  // Determine appropriate text color based on background for readability
  const contrastTextColor = getContrastTextColor(backgroundColor);

  return {
    backgroundColor: backgroundColor,
    color: contrastTextColor,
    padding: "0 4px",
    borderRadius: "3px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
    "&:hover": {
      opacity: 0.8,
    },
  };
});
