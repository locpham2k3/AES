import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchEssay,
  fetchEssaySubmit,
  resetEssayData,
  reSubmitEssay,
  saveDraftEssay,
  submitEssay,
} from "../../redux/StudentSlide";

const EssayWritingComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [essayWrite, setEssayWrite] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(
    location.state?.isSubmitted || 0
  );
  const [openBackConfirmDialog, setOpenBackConfirmDialog] = useState(false);
  const workbookEssayTaskId = location.state?.workbookEssayTaskId;
  const writingPaperId = location.state?.writingPaperId;
  const { essayWriting, loading, error } = useSelector(
    (state) => state.essayWriting
  );
  const profile = useSelector((state) => state.auth.user);
  const StudentID = profile?.profile?.StudentID;

  const dispatch = useDispatch();

  const parseTimeToSeconds = useCallback((timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }, []);

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    if (isSubmitted !== 2 && isSubmitted !== 1) {
      dispatch(fetchEssay({ tokens, id }));
    } else {
      dispatch(
        fetchEssaySubmit({
          tokens,
          essayId: workbookEssayTaskId,
          studentId: StudentID,
          writingPaperId: writingPaperId || "",
        })
      );
    }
  }, [dispatch, workbookEssayTaskId, isSubmitted, StudentID, writingPaperId]);

  useEffect(() => {
    if (Array.isArray(essayWriting) && essayWriting.length > 0) {
      const submittedData = essayWriting[0];
      setEssayWrite(submittedData.writtenContent || "");
      setWordCount(
        (submittedData.writtenContent || "")
          .split(" ")
          .filter((word) => word.length > 0).length
      );
      if (isSubmitted === 1 || isSubmitted === 2 || isSubmitted === 3) {
        const writtenTimeInSeconds = submittedData.writtenTime
          ? parseTimeToSeconds(submittedData.writtenTime)
          : 0;
        setTimeLeft(submittedData.durationLimit * 60 - writtenTimeInSeconds);
      } else if (submittedData.durationLimit) {
        setTimeLeft(submittedData.durationLimit * 60);
      }
    }
  }, [essayWriting, isSubmitted, parseTimeToSeconds]);

  useEffect(() => {
    setWordCount(
      essayWrite.split(" ").filter((word) => word.length > 0).length
    );
  }, [essayWrite]);

  useEffect(() => {
    if (timeLeft > 0 && isSubmitted !== 2 && isSubmitted !== 3) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && isSubmitted === 0 && essayWrite.length > 0) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted, essayWrite]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }, []);

  const handleEssayChange = (event) => {
    setEssayWrite(event.target.value);
  };

  const handleSubmit = async (type = "submit") => {
    console.log("handleSubmit");

    // Kiểm tra điều kiện để tiếp tục xử lý
    if (
      (isSubmitted == 0 ||
        isSubmitted == 1 ||
        isSubmitted === "0" ||
        isSubmitted === "1") &&
      essayWrite.length > 0
    ) {
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      // Lấy ngày tháng hiện tại và định dạng
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}/${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}/${currentDate.getFullYear()}`;

      const essayData = {
        classId: location.state?.classId || "",
        workbookEssayTaskId: essayWriting[0].workbookEssayTaskId,
        writerId: StudentID,
        writtenContent: essayWrite,
        writtenDate: formattedDate,
        durationTimeRemainingInSeconds: timeLeft,
        writtenTimeInSeconds: essayWriting[0].durationLimit * 60,
      };

      try {
        // Xác định action sẽ dispatch dựa trên type và trạng thái isSubmitted
        let actionToDispatch;
        if (type === "submit") {
          // Kiểm tra xem đã được nộp chưa và gọi đúng action
          if (String(isSubmitted) === "1") {
            actionToDispatch = submitEssay({ tokens, essayData, check: 2 });
          } else {
            actionToDispatch = submitEssay({
              tokens,
              essayData,
              check: location.state?.check,
            });
          }
        } else {
          // Nếu không phải submit thì lưu nháp
          actionToDispatch = saveDraftEssay({ tokens, essayData });
        }

        // Dispatch action và xử lý kết quả
        await dispatch(actionToDispatch);

        toast.success(
          type === "submit"
            ? "Essay submitted successfully!"
            : "Draft saved successfully!"
        );

        // Cập nhật trạng thái nếu submit thành công
        if (type === "submit") setIsSubmitted(2);
        dispatch(resetEssayData());

        // Điều hướng về trang trước
        navigate(-1);
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
        toast.error(
          type === "submit"
            ? "An error occurred while submitting the essay."
            : "An error occurred while saving the draft."
        );
      }
    }
  };
  const handleBackNavigation = () => {
    // Check if essay has content and is not yet submitted or saved
    if (
      (isSubmitted === 0 || isSubmitted === 1) &&
      essayWrite.trim().length > 0
    ) {
      // Open confirmation dialog
      setOpenBackConfirmDialog(true);
    } else {
      // No content or already submitted, just navigate back
      navigate(-1);
    }
  };
  const handleBackConfirmAction = (action) => {
    setOpenBackConfirmDialog(false);

    if (action === "submit") {
      handleSubmit("submit");
    } else if (action === "saveDraft") {
      handleSubmit("saveDraft");
    } else {
      // Discard and navigate back
      navigate(-1);
    }
  };

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
  const handleRewriteEssay = async () => {
    try {
      // Retrieve tokens securely
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        toast.error("Authentication tokens are missing. Please log in again.");
        navigate("/login"); // Redirect to login if tokens are missing
        return;
      }

      const tokens = { accessToken, refreshToken };

      // Dispatch an action to reset the essay data before fetching
      dispatch(resetEssayData());

      // Fetch the latest essay data to ensure it's up-to-date
      await dispatch(fetchEssay({ tokens, id })).unwrap();

      // Reset local state to allow the user to start rewriting
      setEssayWrite("");
      setWordCount(0);
      setTimeLeft(essayWriting[0]?.durationLimit * 60 || 0);
      setIsSubmitted(0);

      toast.info("You can now start rewriting your essay.");
    } catch (err) {
      console.error("Error rewriting essay:", err);
      toast.error("Failed to initiate essay rewrite. Please try again later.");
    }
  };
  if (!essayWriting || essayWriting.length === 0) {
    return <p>No essays found</p>;
  }

  return (
    <div className="container-fluid">
      {/* Confirmation Dialog */}
      <Dialog
        open={openBackConfirmDialog}
        onClose={() => setOpenBackConfirmDialog(false)}
        aria-labelledby="back-confirmation-dialog-title"
        aria-describedby="back-confirmation-dialog-description"
      >
        <DialogTitle id="back-confirmation-dialog-title">
          Unsaved Essay
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="back-confirmation-dialog-description">
            Do you want save draft or submit ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleBackConfirmAction("discard")}
            color="secondary"
          >
            Discard
          </Button>
          {!(location.state?.check && location.state?.check == 1) ? (
            <Button
              onClick={() => handleBackConfirmAction("saveDraft")}
              color="default"
            >
              Save Draft
            </Button>
          ) : null}

          <Button
            onClick={() => handleBackConfirmAction("submit")}
            color="primary"
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <div className="row">
        <div className="col-12" style={{ marginBottom: "20px" }}>
          <Button
            variant="contained"
            onClick={handleBackNavigation}
            style={{ marginBottom: "20px", marginLeft: "10px" }}
          >
            Back
          </Button>
        </div>

        {/* Task Requirement Section */}
        <div className="col-4">
          <Card
            className="shadow p-4 mb-5 bg-white rounded"
            style={{ borderRadius: "15px" }}
          >
            <Typography variant="h5" className="mb-3">
              Topic: {essayWriting[0]?.taskName || "N/A"}
            </Typography>

            <Typography variant="body1" className="mb-3">
              {essayWriting[0]?.taskPlainContent || "N/A"}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              className="mb-4"
            >
              You should write {essayWriting[0]?.wordCountLimit || "N/A"} words.
            </Typography>
          </Card>
        </div>

        <div className="col-8">
          <Card
            className="shadow p-4 mb-5 bg-white rounded"
            style={{ borderRadius: "15px", minHeight: "500px" }}
          >
            <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
              <Typography variant="h6" className="text-muted">
                Time Remaining
              </Typography>
              <Box
                sx={{
                  display: "inline-block",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  marginBottom: "5px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: timeLeft <= 60 ? "red" : "black",
                  }}
                >
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Box>
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={12}
              fullWidth
              value={essayWrite}
              onChange={handleEssayChange}
              variant="outlined"
              placeholder="Start writing your essay here..."
              className="mb-3"
              style={{ borderRadius: "10px" }}
              disabled={isSubmitted === 2 || isSubmitted === 3}
              autoComplete="off"
            />
            <div className="d-flex justify-content-between align-items-center">
              <Typography variant="body2" className="text-muted">
                {wordCount}/{essayWriting[0]?.wordCountLimit || "N/A"} words
              </Typography>
              <div>
                {!(location.state?.check && location.state?.check == 1) ? (
                  <Button
                    variant="contained"
                    color="default"
                    onClick={() => handleSubmit("saveDraft")}
                    disabled={isSubmitted > 1 || essayWrite.length === 0}
                    style={{ borderRadius: "8px", marginRight: "10px" }}
                  >
                    Save Draft
                  </Button>
                ) : null}
                <Button
                  variant="contained"
                  color={essayWrite.length > 0 ? "primary" : "secondary"}
                  onClick={() => handleSubmit("submit")}
                  disabled={isSubmitted > 1 || essayWrite.length === 0}
                  style={{ borderRadius: "8px" }}
                >
                  {isSubmitted === 1 ? "Resubmit Essay" : "Submit Essay"}
                </Button>
                {isSubmitted > 1 ? (
                  <Button
                    variant="contained"
                    color="default"
                    onClick={() => handleRewriteEssay()}
                    // disabled={isSubmitted > 1 || essayWrite.length === 0}
                    style={{ borderRadius: "8px", marginRight: "10px" }}
                  >
                    Rewrite
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EssayWritingComponent;
