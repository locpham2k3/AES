import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Tooltip } from "@mui/material";
import { StyledTableCell } from "./StyledComponents";

const GradingTable = ({ grade, handleGradeChange, isReviewMode, aiData }) => {
  const gradingCategories = [
    "Task Achievement",
    "Coherence & Cohesion",
    "Lexical Resource",
    "Grammar Range",
  ];

  // Map aiData sang định dạng dễ sử dụng hơn
  const aiGradeMap = aiData
    ? {
        "Task Achievement": aiData[0]?.TaskAchievement || {},
        "Coherence & Cohesion": aiData[0]?.CoherenceAndCohesion || {},
        "Lexical Resource": aiData[0]?.LexicalResource || {},
        "Grammar Range": aiData[0]?.GrammaticalRangeAndAccuracy || {},
      }
    : {};

  // Tooltip dữ liệu từ aiData
  const [tooltips, setTooltips] = useState({});

  // Cập nhật tooltip khi aiData thay đổi
  useEffect(() => {
    if (aiData) {
      setTooltips({
        "Task Achievement": aiGradeMap["Task Achievement"].Explain || "",
        "Coherence & Cohesion":
          aiGradeMap["Coherence & Cohesion"].Explain || "",
        "Lexical Resource": aiGradeMap["Lexical Resource"].Explain || "",
        "Grammar Range": aiGradeMap["Grammar Range"].Explain || "",
      });
    }
  }, [aiData]);

  const handleCellClick = (category, value) => {
    handleGradeChange(category, value);

    // Xóa tooltip nếu người dùng thay đổi điểm
    setTooltips((prevTooltips) => ({
      ...prevTooltips,
      [category]: "", // Xóa tooltip của category được chỉnh sửa
    }));
  };

  const getCurrentGrade = (category) => {
    return grade[category] || aiGradeMap[category]?.Score || 0;
  };

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ fontSize: "14px", mb: 1 }}>
        Rubric Grading Criteria
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(10, auto)",
          gap: 0.5,
        }}
      >
        {/* Các ô điểm từ 1 đến 9 */}
        <Box />
        {[...Array(9)].map((_, idx) => (
          <Box
            key={idx}
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            {idx + 1}
          </Box>
        ))}

        {/* Các danh mục chấm điểm và điểm */}
        {gradingCategories.map((category) => (
          <React.Fragment key={category}>
            <Box sx={{ fontSize: "12px", padding: "4px" }}>{category}</Box>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
              const selectedValue = getCurrentGrade(category);
              const tooltipText = tooltips[category]; // Tooltip cho điểm

              return (
                <Tooltip
                  key={value}
                  title={
                    selectedValue === value && tooltipText ? tooltipText : ""
                  }
                  arrow
                  disableHoverListener={!tooltipText}
                >
                  <StyledTableCell
                    value={value}
                    selected={selectedValue === value} // Hiển thị ô đã chọn
                    onClick={() => handleCellClick(category, value)}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    {value}
                  </StyledTableCell>
                </Tooltip>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default GradingTable;
