import React, { useState, useMemo, useCallback } from "react";
import { Typography, Box } from "@mui/material";

const GrammarCheck = ({ text, grammarErrors }) => {
  // Move hooks to the top of the component, before any conditional logic
  const [hoveredError, setHoveredError] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Handlers defined unconditionally
  const handleMouseEnter = useCallback((event, error) => {
    setHoveredError(error);
    setCursorPosition({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredError(null);
  }, []);

  // Check if text and grammarErrors are valid
  const isValidInput =
    text && Array.isArray(grammarErrors) && grammarErrors.length > 0;

  // Render logic moved to a useMemo called unconditionally
  const renderTextWithErrors = useMemo(() => {
    if (!isValidInput) return null;

    const parts = [];
    let lastIndex = 0;

    grammarErrors.forEach((error) => {
      const { startposition, endposition } = error;
      const beforeError = text.slice(lastIndex, startposition);
      const errorText = text.slice(startposition, endposition);

      if (beforeError) parts.push(<span key={lastIndex}>{beforeError}</span>);

      parts.push(
        <span
          key={startposition}
          className="highlighted-error"
          onMouseEnter={(e) => handleMouseEnter(e, error)}
          onMouseLeave={handleMouseLeave}
        >
          {errorText}
        </span>
      );

      lastIndex = endposition;
    });

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }

    return parts;
  }, [text, grammarErrors, handleMouseEnter, handleMouseLeave, isValidInput]);

  const calculateTooltipPosition = (cursorPosition) => {
    const tooltipWidth = 300;
    const tooltipHeight = 150;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = cursorPosition.x + 10;
    let y = cursorPosition.y + 10;

    if (x + tooltipWidth > windowWidth) {
      x = cursorPosition.x - tooltipWidth - 10;
    }

    if (y + tooltipHeight > windowHeight) {
      y = cursorPosition.y - tooltipHeight - 10;
    }

    return { x, y };
  };

  // Render method
  if (!isValidInput) {
    return (
      <Box
        sx={{
          padding: "16px",
          lineHeight: 1.6,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "16px",
          minHeight: "150px",
        }}
      >
        <Typography variant="h5" color="primary" gutterBottom>
          Grammar Check
        </Typography>
        <Typography variant="body1" color="error">
          No text or grammar errors to display. Please provide valid input.
        </Typography>
      </Box>
    );
  }

  const tooltipPosition = calculateTooltipPosition(cursorPosition);

  return (
    <div>
      <Box
        sx={{
          padding: "16px",
          lineHeight: 1.6,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "16px",
          minHeight: "150px",
        }}
      >
        <Typography variant="h5" color="primary" gutterBottom>
          Grammar Check
        </Typography>
        <Typography variant="body1">{renderTextWithErrors}</Typography>
      </Box>

      {hoveredError && (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            padding: "12px 16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            width: "300px",
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Category: {hoveredError.category}
          </Typography>
          <Typography variant="body2">
            <strong>Message:</strong> {hoveredError.message}
          </Typography>
          <Typography variant="body2">
            <strong>Corrections:</strong> {hoveredError.corrections.join(", ")}
          </Typography>
        </div>
      )}

      <style>
        {`
          .highlighted-error {
            background-color: #ffeb3b;
            cursor: pointer;
            font-weight: bold;
            text-decoration: underline;
            padding: 0 4px;
            border-radius: 3px;
          }

          .highlighted-error:hover {
            background-color: #ff9800;
          }
        `}
      </style>
    </div>
  );
};

export default GrammarCheck;
