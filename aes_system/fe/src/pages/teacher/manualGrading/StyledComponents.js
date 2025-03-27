import { getContrastRatio, styled } from "@mui/material/styles";
import { TableCell } from "@mui/material";

export const getColor = (value) => {
  switch (parseInt(value, 10)) {
    case 1:
      return "#ff6666"; // Red
    case 2:
      return "#ff8566"; // Light Orange
    case 3:
      return "#ffcc66"; // Yellow
    case 4:
      return "#ffff66"; // Light Yellow
    case 5:
      return "#b3ff66"; // Light Green
    case 6:
      return "#66ff66"; // Green
    case 7:
      return "#66ffcc"; // Light Blue
    case 8:
      return "#66b3ff"; // Sky Blue
    case 9:
      return "#668cff"; // Soft Blue
    default:
      return "inherit";
  }
};

export const getCategoryColor = (categoryName, categories) => {
  if (!categoryName || !categories) return "#cccccc"; // Default gray color
  const category = categories.find((cat) => cat.name === categoryName);
  return category && category.color ? category.color : "#cccccc";
};

export const HighlightedText = styled("span")(({
  theme,
  errorType,
  categories,
}) => {
  const backgroundColor =
    errorType && categories
      ? getCategoryColor(errorType, categories)
      : "#ffd966"; // Default highlight color

  // Ensure backgroundColor is a valid color string
  const validBackgroundColor = backgroundColor || "#ffd966";

  // Determine appropriate text color
  const contrastTextColor =
    getContrastRatio(validBackgroundColor, "#000") >= 4.5 ? "#000" : "#fff";

  return {
    backgroundColor: validBackgroundColor,
    color: contrastTextColor,
    padding: "0 5px",
    borderRadius: "3px",
    cursor: "pointer",
  };
});
export const StyledTableCell = styled(TableCell)(
  ({ theme, selected, value }) => ({
    border: "1px solid #ddd",
    padding: theme.spacing(1),
    textAlign: "center",
    fontSize: "14px",
    backgroundColor: selected ? getColor(value) : "transparent", // Áp dụng màu nền nếu được chọn
    cursor: "pointer",
    "&:hover": {
      backgroundColor: selected ? getColor(value) : theme.palette.action.hover,
    },
  })
);
