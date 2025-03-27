import React from "react";
import { Paper, Typography } from "@mui/material";
import { format } from "date-fns";
import { HighlightedText } from "./StyledComponents";

const EssayContent = ({
  essayData,
  essayLoading,
  highlightedRanges,
  handleTextSelect,
  handleHighlightedTextClick,
  contentRef,
  categoryData,
  tempHighlight,
}) => {
  const renderContent = () => {
    if (!essayData || essayData.length === 0) return null;

    const content = essayData[0].writtenContent;
    let lastIndex = 0;
    const elements = [];

    // Kết hợp highlightedRanges và tempHighlight
    const allHighlights = [...highlightedRanges];

    // Nếu tempHighlight tồn tại, thêm vào allHighlights
    if (tempHighlight && tempHighlight.text) {
      allHighlights.push(tempHighlight);
    }

    // Sắp xếp highlights theo vị trí xuất hiện trong nội dung
    allHighlights.sort((a, b) => {
      const indexA = content.indexOf(a.text, lastIndex);
      const indexB = content.indexOf(b.text, lastIndex);
      return indexA - indexB;
    });

    // Xử lý nội dung với các đoạn văn bản và highlight
    while (lastIndex < content.length) {
      const nextHighlight = allHighlights.find((highlight) => {
        const start = content.indexOf(highlight.text, lastIndex);
        return start >= lastIndex;
      });

      if (!nextHighlight) {
        // Không có highlight tiếp theo, thêm phần còn lại của văn bản
        elements.push(
          <span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>
        );
        break;
      }

      const start = content.indexOf(nextHighlight.text, lastIndex);
      if (start > lastIndex) {
        // Thêm văn bản trước highlight
        elements.push(
          <span key={`text-${lastIndex}`}>
            {content.substring(lastIndex, start)}
          </span>
        );
      }

      // Thêm văn bản được highlight
      elements.push(
        <HighlightedText
          key={`highlight-${start}`}
          errorType={nextHighlight.errorType}
          categories={categoryData}
          style={{
            backgroundColor: nextHighlight.errorType
              ? categoryData.find((cat) => cat.name === nextHighlight.errorType)
                  ?.color
              : "#ffd966", // Màu mặc định khi chưa chọn danh mục
            color: nextHighlight.errorType ? "#000" : "#333", // Đảm bảo chữ luôn hiển thị rõ ràng
          }}
          onClick={() =>
            tempHighlight
              ? null
              : handleHighlightedTextClick(nextHighlight, start)
          }
        >
          {nextHighlight.text}
        </HighlightedText>
      );

      lastIndex = start + nextHighlight.text.length;
      allHighlights.splice(allHighlights.indexOf(nextHighlight), 1); // Xóa highlight sau khi thêm
    }

    return elements;
  };

  // Định dạng `writtenDate` một cách an toàn
  const formattedDate = essayData[0]?.writtenDate
    ? format(new Date(essayData[0].writtenDate), "yyyy-MM-dd")
    : "Date not available";

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      {essayData && essayData.length > 0 ? (
        <>
          <Typography variant="h6">
            {essayData[0].workbookName} - {essayData[0].essayTaskName}
          </Typography>
          <Typography variant="h7">
            <strong>Topic:</strong> {essayData[0].taskPlainContent}
          </Typography>
          <Typography variant="body1">
            <strong>Writer:</strong> {essayData[0].writerName}
          </Typography>
          <Typography variant="body2">
            <strong>Written Date:</strong> {formattedDate} |{" "}
            <strong>Word Count:</strong> {essayData[0].wordCount} |{" "}
            <strong>Word Limit:</strong> {essayData[0].wordLimit} |{" "}
            <strong>Time Limit:</strong> {essayData[0].timeLimit} mins
          </Typography>

          <div
            ref={contentRef}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "text",
              userSelect: "text",
              minHeight: "150px",
              marginTop: "10px",
            }}
            onMouseUp={handleTextSelect}
          >
            {renderContent()}
          </div>
        </>
      ) : (
        <Typography variant="body1">
          {essayLoading ? "Loading..." : "Essay details not available."}
        </Typography>
      )}
    </Paper>
  );
};

export default EssayContent;
