import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Alert,
  Modal,
  Backdrop,
  Fade,
  Button,
  TextField,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import EssayContent from "../student/deatailEssayGraded/EssayContent";
import FeedbackPopover from "../student/deatailEssayGraded/FeedbackPopover";
import FeedbackSummary from "../student/deatailEssayGraded/FeedbackSummary";
import GradingTable from "../student/deatailEssayGraded/GradingTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchEssayGradedDetail } from "../../redux/StudentSlide";
import axios from "axios";
import {
  regradeRefereeComplain,
  updateRefereeComplain,
} from "../../redux/RefereeSlide";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentEssayModal = ({
  open,
  onClose,
  evaluationAssigningId,
  studentID,
  id,
  status,
}) => {
  const dispatch = useDispatch();

  const {
    essayGradedDetail = [],
    loading,
    error,
  } = useSelector((state) => state.essayGradeDetail);

  const {
    complains,
    loadingUpdate,
    error: error1,
  } = useSelector((state) => state.referee);

  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState(null);
  const [regradeReason, setRegradeReason] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [isRegradeRequest, setIsRegradeRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch essay details when the modal opens
  useEffect(() => {
    if (open && studentID && evaluationAssigningId) {
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      dispatch(
        fetchEssayGradedDetail({
          tokens,
          evaluationAssigningId,
          studentId: studentID,
        })
      );
    }
  }, [open, studentID, evaluationAssigningId, dispatch]);

  useEffect(() => {
    if (essayGradedDetail && essayGradedDetail.length > 0) {
      const essay = essayGradedDetail[0];
      setHighlightedRanges(essay.feedbackData);
    }
  }, [essayGradedDetail]);

  const handleTextClick = (highlight, event) => {
    setAnchorEl(event.currentTarget);
    setPopoverData(highlight);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setPopoverData(null);
  };

  const handleSendRegrade = async () => {
    try {
      const requestData = {
        id: id,
        replyMessage: regradeReason,
      };
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      const response = await dispatch(
        regradeRefereeComplain({ tokens, requestData })
      ).unwrap();
      console.log("Regrading submitted:", response);
      setRegradeReason(""); // Reset sau khi gửi
      toast.success("Send successfully!");
      setIsRegradeRequest(false);
      setOpenReplyModal(false); // Đóng modal trả lời
      handleClosePopover(); // Đóng popover nếu đang mở
    } catch (error) {
      console.error("Error submitting regrading:", error);
      toast.error(`Send fail: ${error.message || error}`);
    }
  };

  const handleSendToStudent = async () => {
    try {
      const requestData = {
        id: id,
        replyMessage: replyMessage,
      };
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      const response = await dispatch(
        updateRefereeComplain({ tokens, requestData })
      ).unwrap();
      console.log("Message sent to student:", response);
      setReplyMessage("");
      toast.success("Send successfully!");
      setOpenReplyModal(false); // Đóng modal trả lời
      handleClosePopover(); // Đóng popover nếu đang mở
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(`Send fail: ${error.message || error}`);
    }
  };

  const essayData =
    essayGradedDetail && essayGradedDetail.length > 0
      ? essayGradedDetail[0]
      : null;

  const formattedDate = essayData?.writtenDate
    ? format(new Date(essayData.writtenDate), "yyyy-MM-dd")
    : "Date not available";

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxHeight: "90%",
            overflow: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            position: "relative", // Required for the close button
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          {loading ? (
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
          ) : error || error1 ? (
            <Grid container justifyContent="center" alignItems="center">
              <Alert severity="error">
                <Typography variant="h6">Error: {error}</Typography>
              </Alert>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={7}>
                <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
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
                        <strong>Time Limit:</strong> {essayData.timeLimit} mins
                      </Typography>
                      <EssayContent
                        content={essayData.writtenContent}
                        highlightedRanges={highlightedRanges}
                        onTextClick={handleTextClick}
                      />
                    </>
                  ) : (
                    <Typography variant="body1">
                      Essay details not available.
                    </Typography>
                  )}
                </Paper>

                {/* Grading Table */}
                {essayData && (
                  <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
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

              {/* Right Column */}
              <Grid item xs={12} md={5}>
                {/* Feedback Summary */}
                {highlightedRanges && highlightedRanges.length > 0 && (
                  <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                    <FeedbackSummary
                      feedbackData={highlightedRanges}
                      essayContent={essayData.writtenContent}
                    />
                  </Paper>
                )}

                {/* Action Buttons */}
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mb: 2 }}
                    onClick={() => {
                      setIsRegradeRequest(false);
                      setOpenReplyModal(true);
                    }}
                    disabled={status === "1" || status === 1}
                  >
                    Send to Student
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => {
                      setIsRegradeRequest(true);
                      setOpenReplyModal(true);
                    }}
                    disabled={status === "1" || status === 1}
                  >
                    Request Regrading
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          )}

          {popoverData && (
            <FeedbackPopover
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClosePopover}
              feedback={popoverData}
              date={essayData.assignedDate}
            />
          )}

          <Modal
            open={openReplyModal}
            onClose={() => setOpenReplyModal(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Fade in={openReplyModal}>
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
                <Typography variant="h6" gutterBottom>
                  {isRegradeRequest
                    ? "Regrade Request"
                    : "Send Message to Student"}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter your message..."
                  value={isRegradeRequest ? regradeReason : replyMessage}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isRegradeRequest) {
                      setRegradeReason(value);
                    } else {
                      setReplyMessage(value);
                    }
                  }}
                  error={
                    isRegradeRequest
                      ? !regradeReason.trim() || /[';/`\\|]/.test(regradeReason) // Bắt lỗi trống hoặc ký tự đặc biệt
                      : !replyMessage.trim() || /[';/`\\|]/.test(replyMessage) // Bắt lỗi trống hoặc ký tự đặc biệt
                  }
                  helperText={
                    isRegradeRequest
                      ? !regradeReason.trim()
                        ? "Regrade reason is required"
                        : /[';/`\\|]/.test(regradeReason) &&
                          "Special characters are not allowed" // Thông báo lỗi ký tự đặc biệt
                      : !replyMessage.trim()
                        ? "Reply message is required"
                        : /[';/`\\|]/.test(replyMessage) &&
                          "Special characters are not allowed" // Thông báo lỗi ký tự đặc biệt
                  }
                />

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setOpenReplyModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      isRegradeRequest ? handleSendRegrade : handleSendToStudent
                    }
                    disabled={
                      isRegradeRequest
                        ? !regradeReason.trim() ||
                          /[';/`\\|]/.test(regradeReason) // Bắt lỗi trống hoặc ký tự đặc biệt
                        : !replyMessage.trim() || /[';/`\\|]/.test(replyMessage) // Bắt lỗi trống hoặc ký tự đặc biệt
                    }
                  >
                    {loadingUpdate ? (
                      <CircularProgress size={20} color="inherit" /> // Show loading spinner
                    ) : (
                      "Send"
                    )}
                  </Button>
                </Box>
                {/* Show error message if there's an error */}
                {error1 && toast.success("Send fail: " + error1)}
              </Box>
            </Fade>
          </Modal>
        </Box>
      </Fade>
    </Modal>
  );
};

export default StudentEssayModal;
