import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { fetchTeacherFeedbacks } from "../../../redux/TeacherSlide";
import LoadingBar from "../../../components/LoadingBar";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-row:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
}));

const ListEssayGrade = ({ classId, isHistory }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.feedbackTeacher
  );
  const profile = useSelector((state) => state.auth.user);
  const TeacherID = profile?.profile.TeacherID;

  // Ensure feedbacks is an empty array if data is not available or feedbacks doesn't exist
  const feedbacks = data ? data[0] : [];

  React.useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const body = {
      classId,
      status: isHistory ? "1" : "0",
      teacherId: TeacherID,
    };

    dispatch(
      fetchTeacherFeedbacks({
        tokens,
        check: 1,
        body,
      })
    );
  }, [dispatch, isHistory, classId]);

  // Ensure feedbacks is an array before calling map
  const rows = Array.isArray(feedbacks)
    ? feedbacks.map((feedback) => ({
        id: feedback.id,
        workbookName: feedback.workbookName,
        essayTaskName: feedback.essayTaskName,
        writerName: feedback.writerName,
        writtenDate: feedback.writtenDate,
        writtenTime: feedback.writtenTime,
        submitTime: feedback.submitTime,
        wordCount: feedback.wordCount,
        wordLimit: feedback.wordLimit,
        timeLimit: feedback.timeLimit,
      }))
    : [];

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
    navigate(`/teacher/essay-grade/${id}`, {
      state: { isReviewMode: isHistory },
    });
  };

  return (
    <div style={{ width: "90%", height: "100%" }}>
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
          style={{ height: 350, width: "100%" }}
        />
      )}
    </div>
  );
};

export default ListEssayGrade;
