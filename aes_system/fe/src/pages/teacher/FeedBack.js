import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherFeedbacks } from "../../redux/TeacherSlide";
import { Typography } from "@mui/material";
import LoadingBar from "../../components/LoadingBar"; // Import LoadingBar

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-row:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
}));

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHistory = location.state?.isHistory || false;
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.feedbackTeacher
  );
  const profile = useSelector((state) => state.auth.user);
  const TeacherID = profile?.profile.TeacherID;

  React.useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const body = {
      teacherId: TeacherID,
      status: isHistory ? "1" : "0",
    };

    // Gọi API chỉ khi có TeacherID và accessToken
    if (TeacherID && tokens.accessToken) {
      dispatch(
        fetchTeacherFeedbacks({
          tokens,
          check: 0,
          body,
        })
      );
    }
  }, [dispatch, TeacherID, isHistory]);

  // Kiểm tra và xử lý dữ liệu trả về từ API
  const rows = (data || []).map((feedback, index) => ({
    id: feedback.id || `feedback-${index}`, // Dùng index nếu không có id
    workbookName: feedback.workbookName,
    essayTaskName: feedback.essayTaskName,
    writerName: feedback.writerName,
    writtenDate: feedback.writtenDate,
    writtenTime: feedback.writtenTime,
    submitTime: feedback.submitTime,
    wordCount: feedback.wordCount,
    wordLimit: feedback.wordLimit,
    timeLimit: feedback.timeLimit,
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "workbookName", headerName: "Workbook", width: 150 },
    { field: "essayTaskName", headerName: "Task", width: 150 },
    { field: "writerName", headerName: "Writer", width: 150 },
    { field: "writtenDate", headerName: "Written Date", width: 150 },
    { field: "writtenTime", headerName: "Writing Time", width: 150 },
    { field: "submitTime", headerName: "Submit Time", width: 150 },
    { field: "wordCount", headerName: "Word Count", width: 150 },
    { field: "wordLimit", headerName: "Word Limit", width: 150 },
    { field: "timeLimit", headerName: "Time Limit (mins)", width: 150 },
  ];

  const handleRowClick = (params) => {
    const { id } = params.row;
    if (id) {
      navigate(`/teacher/essay-grade/${id}`, {
        state: { isReviewMode: isHistory },
      });
    } else {
      console.error("Invalid row id");
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isHistory ? "Feedback History" : "Pending Feedback"}
      </Typography>

      {loading ? (
        <div>
          <LoadingBar />
        </div>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : (
        <StyledDataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          onRowClick={handleRowClick}
          getRowId={(row) => row.id} // Dùng id từ dữ liệu
          style={{ height: 350, width: "100%" }}
        />
      )}
    </div>
  );
};

export default Feedback;
