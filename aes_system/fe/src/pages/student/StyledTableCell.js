// src/pages/student/StyledComponents.js
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  // Bạn có thể thêm các kiểu khác tùy ý
  // Ví dụ:
  // backgroundColor: theme.palette.action.hover,
  // fontWeight: 'bold',
}));
