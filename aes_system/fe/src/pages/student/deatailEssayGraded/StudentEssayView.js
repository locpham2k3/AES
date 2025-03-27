// src/components/Student/StudentEssayView.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Alert,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import EssayContent from "./EssayContent";
import FeedbackPopover from "./FeedbackPopover";
import ProgressChart from "./ProgressChart";
import FeedbackSummary from "./FeedbackSummary"; // Import component mới
import GradingTable from "./GradingTable"; // Import component mới
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDetailComplainByStudentId,
  fetchEssayGradedDetail,
} from "../../../redux/StudentSlide";
import { addRefereeComplain } from "../../../redux/RefereeSlide";
import { toast } from "react-toastify";

const StudentEssayView = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();

  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState(null);
  const contentRef = useRef(null);
  const profile = useSelector((state) => state.auth.user);
  const StudentID = profile?.profile.StudentID;

  const {
    essayGradedDetail = [],
    loading,
    error,
  } = useSelector((state) => state.essayGradeDetail);
  const complainState = useSelector((state) => state.complainDetailStudent); // Đảm bảo tên slice đúng

  if (!complainState) {
    console.error("complainState is undefined!");
  }

  const {
    data = [], // detail complain by student
    loading: loadingComplain,
    error: errorComplain,
  } = complainState || {}; // Fallback khi complainState là undefined
  console.log("data", data);

  // Fetch essay details and complaints when component mounts or dependencies change
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    if (StudentID && id) {
      // Fetch essay graded details
      dispatch(
        fetchEssayGradedDetail({
          tokens,
          evaluationAssigningId: id,
          studentId: StudentID,
        })
      );
    }
  }, [StudentID, id, dispatch]); // Add dependencies

  // Update replyMessage and reportMessage once data is fetched
  useEffect(() => {
    if (data) {
      setReplyMessage(data?.replyMessage || ""); // Safe access with optional chaining
      setReportMessage(data?.reportMessage || ""); // Safe access with optional chaining
    }
  }, [data]);
  // Cập nhật highlightedRanges khi essayGradedDetail thay đổi
  useEffect(() => {
    if (essayGradedDetail && essayGradedDetail.length > 0) {
      const essay = essayGradedDetail[0];
      setHighlightedRanges(essay.feedbackData);
    }
  }, [essayGradedDetail]);

  const handleTextClick = (highlight, event) => {
    console.log("handleTextClick called with:", highlight, event); // Debugging
    setAnchorEl(event.currentTarget);
    setPopoverData(highlight);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setPopoverData(null);
  };

  // State để điều khiển mở/đóng modal và lưu trữ nội dung complain
  const [openModal, setOpenModal] = useState(false);
  const [complainContent, setComplainContent] = useState(""); // Nội dung complain
  const [isReply, setIsReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  // Hàm mở modal khi nhấn nút "Report"
  const handleOpenModal = () => {
    setOpenModal(true);
    setIsReply(essayGradedDetail[0]?.complainStatus === "1");
    if (essayGradedDetail[0]?.complainStatus === "1") {
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      dispatch(
        fetchDetailComplainByStudentId({
          tokens,
          studentId: StudentID,
          evaluationAssigningId: id,
        })
      );
      // setReplyMessage(data[0]?.replyMessage || ""); // Safe access with optional chaining
      // setReportMessage(data[0]?.reportMessage || ""); // Safe access with optional chaining
    }
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setComplainContent(""); // Reset nội dung khi đóng modal
  };

  // Hàm gọi API để thêm complain
  const handleSendComplain = () => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const complainData = {
      reportMessage: complainContent,
      evaluationAssigningId: id,
      studentId: StudentID,
    };

    dispatch(addRefereeComplain({ tokens, complainData }))
      .then((response) => {
        console.log("Complain added successfully:", response);
        // Đóng modal sau khi gửi thành công
        setOpenModal(false);
        setComplainContent("");
        toast.success("Report successfully!");
      })
      .catch((error) => {
        console.error("Error adding complain:", error);
        toast.error("Report fail: " + error);
      });
  };

  // Extract essayData từ essayGradedDetail
  const essayData =
    essayGradedDetail && essayGradedDetail.length > 0
      ? essayGradedDetail[0]
      : null;

  const formattedDate = essayData?.writtenDate
    ? format(new Date(essayData.writtenDate), "yyyy-MM-dd")
    : "Date not available";
  // Trích xuất complainStatus từ essayGradedDetail
  const complainStatus = essayGradedDetail[0]?.complainStatus;

  // // Kiểm tra xem nút "Report" có nên hiển thị hay không
  // const shouldShowReportButton =
  //   !(location.state?.check === 1 || location.state?.check === "1") &&
  //   complainStatus !== "0";

  // // Xác định nhãn của nút dựa trên complainStatus
  // const reportButtonLabel = complainStatus ? "View Report" : "Report";

  // Hiển thị loading spinner khi đang fetch dữ liệu
  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "300px" }}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" style={{ marginLeft: "10px" }}>
          Loading...
        </Typography>
      </Grid>
    );
  }

  // Hiển thị error nếu fetch thất bại
  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Alert severity="error">
          <Typography variant="h6">Error: {error}</Typography>
        </Alert>
      </Grid>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f0f4f8" }}>
      <Grid container spacing={3}>
        {/* Cột Trái: Nội dung bài luận và Biểu đồ tiến độ */}
        <Grid item xs={12} md={7}>
          <Paper
            variant="outlined"
            sx={{ p: 3, mb: 4, backgroundColor: "#ffffff" }}
          >
            {essayData ? (
              <>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ color: "#1976d2", fontWeight: "bold" }}
                >
                  {essayData.workbookName} - {essayData.essayTaskName}
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: "#424242" }}
                >
                  <strong>Topic:</strong> {essayData.taskPlainContent}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: "#616161" }}
                >
                  <strong>Writer:</strong> {essayData.writerName}
                </Typography>

                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ color: "#757575" }}
                >
                  <strong>Written Date:</strong> {formattedDate} |{" "}
                  <strong>Word Count:</strong> {essayData.wordCount} |{" "}
                  <strong>Word Limit:</strong> {essayData.wordLimit} |{" "}
                  <strong>Time Limit:</strong> {essayData.timeLimit} mins |
                  {essayData.cefrAssessment &&
                    essayData.cefrAssessment !== "" && (
                      <>
                        <strong style={{ color: "#FA4032" }}>
                          CEFR Assessment:
                        </strong>{" "}
                        {essayData.cefrAssessment}
                      </>
                    )}
                </Typography>
                <EssayContent
                  content={essayData.writtenContent}
                  highlightedRanges={highlightedRanges}
                  onTextClick={handleTextClick} // Updated here
                  contentRef={contentRef}
                />
              </>
            ) : (
              <Typography variant="body1">
                Essay details not available.
              </Typography>
            )}
          </Paper>

          {/* Biểu đồ tiến độ */}
          {essayData && essayData.progressOfStudentWritingPapers && (
            <Paper
              variant="outlined"
              sx={{ p: 2, mb: 4, backgroundColor: "#ffffff" }}
            >
              <ProgressChart data={essayData.progressOfStudentWritingPapers} />
            </Paper>
          )}
        </Grid>

        {/* Cột Phải: Tóm tắt Feedback và Bảng Chấm điểm */}
        <Grid item xs={12} md={5}>
          {/* Tóm tắt Feedback */}
          {highlightedRanges && highlightedRanges.length > 0 && (
            <Paper
              variant="outlined"
              sx={{ p: 3, mb: 4, backgroundColor: "#ffffff" }}
            >
              <FeedbackSummary
                feedbackData={highlightedRanges}
                essayContent={essayData.writtenContent} // Truyền nội dung bài luận
              />
              {/* Nút Report */}
              {location.state?.check !== 1 &&
                location.state?.check !== "1" &&
                complainStatus !== "0" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                  >
                    {complainStatus ? "View Report" : "Report"}
                  </Button>
                )}
            </Paper>
          )}

          {/* Bảng Chấm điểm */}
          {essayData && (
            <Paper variant="outlined" sx={{ p: 3, backgroundColor: "#ffffff" }}>
              <GradingTable
                grades={{
                  taskAchievementScore: essayData.taskAchievementScore,
                  coherenceAndCoherensionScore:
                    essayData.coherenceAndCoherensionScore,
                  lexicalResourceScore: essayData.lexicalResourceScore,
                  grammarRangeScore: essayData.grammarRangeScore,
                }}
              />
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Popover Feedback */}
      {popoverData && (
        <FeedbackPopover
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClosePopover}
          feedback={popoverData}
          date={essayData.assignedDate} // Ensure correct field name
        />
      )}

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {isReply ? (
            <>
              <Typography variant="h6" gutterBottom>
                Student's Message
              </Typography>
              <Box
                sx={{
                  bgcolor: "grey.100",
                  p: 2,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography variant="body1">{reportMessage}</Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                Referee's Reply
              </Typography>
              <Box
                sx={{
                  bgcolor: "grey.100",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1">{replyMessage}</Typography>
              </Box>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseModal} // Đóng modal
                >
                  Close
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Enter your message
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter your message..."
                value={complainContent}
                onChange={(e) => setComplainContent(e.target.value)} // Cập nhật nội dung complain
                required // Đánh dấu trường này là bắt buộc
                error={!complainContent} // Hiển thị lỗi nếu nội dung complain trống
                helperText={!complainContent ? "Message is required" : ""} // Thông báo lỗi nếu không có nội dung
              />
              <Box
                sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseModal} // Đóng modal
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendComplain} // Gọi API gửi complain
                  disabled={!complainContent} // Disable nút gửi nếu không có nội dung complain
                >
                  {loadingComplain ? (
                    <CircularProgress size={20} color="inherit" /> // Show loading spinner
                  ) : (
                    "Send"
                  )}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default StudentEssayView;
