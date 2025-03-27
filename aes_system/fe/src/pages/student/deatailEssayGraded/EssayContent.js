// src/components/Student/EssayContent.jsx

import React from "react";
import { Box, Typography } from "@mui/material";
import { HighlightedText } from "./StyledComponents"; // Adjust the path as necessary

const EssayContent = ({
  content,
  highlightedRanges,
  onTextClick,
  contentRef,
}) => {
  if (!content) return null;

  const renderContent = () => {
    if (!highlightedRanges || highlightedRanges.length === 0) {
      return <span>{content}</span>;
    }

    // Sort highlights by startPosition
    const sortedHighlights = [...highlightedRanges].sort(
      (a, b) => a.startPosition - b.startPosition
    );

    const elements = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      const { startPosition, endPosition, categoryName } = highlight;

      // Add non-highlighted text before the highlight
      if (startPosition > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}-${startPosition}`}>
            {content.substring(lastIndex, startPosition)}
          </span>
        );
      }

      // Extract the highlighted text
      const highlightedText = content.substring(startPosition, endPosition);

      // Add the highlighted text with dynamic color
      elements.push(
        <HighlightedText
          key={`highlight-${startPosition}-${endPosition}-${index}`}
          categoryName={categoryName}
          onClick={(event) => onTextClick(highlight, event)} // Updated here
        >
          {highlightedText}
        </HighlightedText>
      );

      lastIndex = endPosition;
    });

    // Add any remaining non-highlighted text after the last highlight
    if (lastIndex < content.length) {
      elements.push(
        <span key={`text-${lastIndex}-end`}>
          {content.substring(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  return (
    <Box
      ref={contentRef}
      sx={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "text",
        userSelect: "text",
        minHeight: "150px",
        marginTop: "10px",
      }}
      // Removed onMouseUp={onTextClick} to prevent conflicts
    >
      <Typography variant="body1" component="div">
        {renderContent()}
      </Typography>
    </Box>
  );
};

export default EssayContent;
