import React, { useState, useRef, useEffect, useMemo } from "react";
import { Box, Grid, Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { toast } from "react-toastify";
import AssistantIcon from "@mui/icons-material/Assistant";
import CircularProgress from "@mui/material/CircularProgress";
import EssayContent from "./EssayContent";
import FeedbackSummary from "./FeedbackSummary";
import GradingTable from "./GradingTable";
import PopoverFeedback from "./PopoverFeedback";
import { decodeHTMLEntities } from "../../../utils/decodeHTMLEntities";
import {
  fetchDetailEssayGrade,
  fetchListCategory,
  fetchMistakeByCategory,
  fetchTeacherGradeEssayByAi,
  fetchTeacherGrammarCheck,
  resetData,
  resetEssayGrade,
  resetMistakes,
  submitEssayGradeTeacher,
} from "../../../redux/TeacherSlide";
import { stringToColor } from "../../../utils/colorUtils";
import GrammarCheck from "./GrammarCheck";

const EssayGrade = () => {
  const location = useLocation();
  const isReviewMode = location.state?.isReviewMode || false;
  const { id } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [feedback, setFeedback] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const [grade, setGrade] = useState({});
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const [selectedErrorType, setSelectedErrorType] = useState(null);
  const [selectedSubError, setSelectedSubError] = useState(null);
  const [tempHighlight, setTempHighlight] = useState(null);
  const [isGrammarChecked, setIsGrammarChecked] = useState(false);
  const [isAiGraded, setIsAiGraded] = useState(false);
  const lastSelectedErrorType = useRef(null);
  const profile = useSelector((state) => state.auth.user);
  const TeacherID = profile?.profile.TeacherID;

  const navigate = useNavigate();

  // Sử dụng useSelector để lấy dữ liệu từ redux
  const { data: categoryData = [], loading: categoryLoading } = useSelector(
    (state) => state.categoryTeacher
  );
  const { data: GrammarData = [], loading: GrammarLoading } = useSelector(
    (state) => state.grammarCheckTeacher
  );

  const { essayDetailGrade: essayData, loading: essayLoading } = useSelector(
    (state) => state.essayGradeTeacher
  );

  const {
    mistake: subCategories,
    loading: subCategoriesLoading,
    error: subCategoriesError,
  } = useSelector((state) => state.mistakeTeacher);
  // lay data cham bai tu ai
  const {
    data: aiData = [],
    loading: aiLoading,
    error: aiError,
  } = useSelector((state) => state.gradeEssayTeacher);
  const decodedSubCategories = useMemo(() => {
    if (subCategories && Array.isArray(subCategories)) {
      return subCategories.map((item) => ({
        ...item,
        description: item?.description
          ? decodeHTMLEntities(item.description)
          : "", // Đảm bảo `description` có giá trị mặc định là chuỗi rỗng nếu không tồn tại
        example: item?.example ? decodeHTMLEntities(item.example) : "", // Đảm bảo `example` có giá trị mặc định là chuỗi rỗng nếu không tồn tại
      }));
    }
    return [];
  }, [subCategories]);

  // Tạo danh sách categoryData với màu sắc
  const categoryDataWithColors = useMemo(() => {
    if (categoryData && categoryData.length > 0) {
      return categoryData.map((category) => ({
        ...category,
        color: category.color || stringToColor(category.name),
      }));
    }
    return [];
  }, [categoryData]);

  // Lấy danh mục category khi vào trang
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchListCategory({ tokens }));
  }, [dispatch]);

  useEffect(() => {
    if (
      selectedErrorType &&
      selectedErrorType.id !== lastSelectedErrorType.current?.id
    ) {
      lastSelectedErrorType.current = selectedErrorType; // Cập nhật giá trị mới cho lần tiếp theo

      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };
      dispatch(
        fetchMistakeByCategory({
          tokens,
          categoryId: selectedErrorType.id,
        })
      );
    } else if (!selectedErrorType) {
      dispatch(resetMistakes());
    }
  }, [selectedErrorType, dispatch]);
  useEffect(() => {
    setGrade({});
    dispatch(resetData());
    // aiData = [];
  }, [isReviewMode, dispatch]);

  // Gọi API lấy chi tiết bài luận nếu điều kiện phù hợp
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(
      fetchDetailEssayGrade({
        tokens,
        evaluationAssigningId: id,
        teacherId: TeacherID,
        isHistory: isReviewMode,
      })
    )
      .unwrap()
      .then((data) => {
        if (
          data &&
          data[0].feedbackData &&
          Array.isArray(data[0].feedbackData)
        ) {
          const loadedHighlights = data[0].feedbackData.map((feedbackItem) => {
            const text = data[0].writtenContent.substring(
              feedbackItem.startPosition,
              feedbackItem.endPosition
            );

            const errorTypeObject = {
              id: feedbackItem.categoryId,
              name: feedbackItem.categoryName,
              color: stringToColor(feedbackItem.categoryName),
            };

            const subErrorObject = {
              mistakeId: feedbackItem.mistakeId,
              description: feedbackItem.mistakeDescription,
              // Nếu cần, thêm các thuộc tính khác
            };

            return {
              text,
              feedback: feedbackItem.comment,
              errorType: feedbackItem.categoryName,
              subError: subErrorObject,
              errorTypeObject,
            };
          });

          setHighlightedRanges(loadedHighlights);

          // Đặt lại selectedErrorType và selectedSubError dựa trên phản hồi
          if (
            loadedHighlights.length > 0 &&
            (!lastSelectedErrorType.current ||
              lastSelectedErrorType.current.id !==
                loadedHighlights[0].errorTypeObject.id)
          ) {
            const firstHighlight = loadedHighlights[0];
            setSelectedErrorType(firstHighlight.errorTypeObject);
            setSelectedSubError(firstHighlight.subError);

            // Tự động gọi API để lấy danh sách sub lỗi nếu cần
            if (firstHighlight.errorTypeObject) {
              const tokens = {
                accessToken: localStorage.getItem("accessToken"),
                refreshToken: localStorage.getItem("refreshToken"),
              };
              dispatch(
                fetchMistakeByCategory({
                  tokens,
                  categoryId: firstHighlight.errorTypeObject.id,
                })
              );
              lastSelectedErrorType.current = firstHighlight.errorTypeObject; // Cập nhật sau khi gọi API
            }
          }

          setGrade({
            "Task Achievement": data[0].taskAchievementScore,
            "Coherence & Cohesion": data[0].coherenceAndCoherensionScore,
            "Lexical Resource": data[0].lexicalResourceScore,
            "Grammar Range": data[0].grammarRangeScore,
          });
        } else {
          console.warn("No feedback data available for this essay");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch essay grade details:", error);
      });
  }, [id, dispatch, TeacherID, isReviewMode]); // Loại bỏ categoryData và decodedSubCategories

  // Handle grammar check
  const handleGrammarCheck = async () => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const body = {
      topic: essayData[0].taskPlainContent,
      writingEssay: essayData[0].writtenContent,
    };
    try {
      dispatch(
        fetchTeacherGrammarCheck({
          tokens,
          body,
        })
      )
        .unwrap()
        .then((response) => {
          setIsGrammarChecked(true);
        });
      toast.success("Grammar check successfully");

      setIsGrammarChecked(true);
    } catch (error) {
      toast.error("Grammar check failed");
    }
  };
  // Thêm hàm để gọi API gửi dữ liệu cho AI
  const handleSubmitToAI = async () => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const body = {
      topic: essayData[0].taskPlainContent,
      writing_essay: essayData[0].writtenContent,
    };

    try {
      await dispatch(fetchTeacherGradeEssayByAi({ tokens, body }))
        .unwrap()
        .then((response) => {
          // console.log("AI Response:", response);
          // Khi API trả về thành công, cập nhật grade từ aiData
          if (response && response[0]) {
            const aiGrades = {
              "Task Achievement": response[0].TaskAchievement.Score || 0,
              "Coherence & Cohesion":
                response[0].CoherenceAndCohesion.Score || 0,
              "Lexical Resource": response[0].LexicalResource.Score || 0,
              "Grammar Range":
                response[0].GrammaticalRangeAndAccuracy.Score || 0,
            };
            setGrade(aiGrades); // Cập nhật grade
          }
          setIsAiGraded(true);
        });

      toast.success("AI grading completed successfully");
    } catch (error) {
      toast.error("Failed to send data to AI");
    }
  };
  const handleTextSelect = (event) => {
    event.preventDefault();
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const selectedText = selection.toString();
      setSelectedText(selectedText);
      setTempHighlight({
        text: selectedText,
        errorType: selectedErrorType ? selectedErrorType.name : null,
        color: selectedErrorType ? selectedErrorType.color : "#ffd966", // Màu mặc định
      });
      setAnchorEl(contentRef.current);
      setPopoverPosition({
        top: event.clientY + window.scrollY + 10,
        left: event.clientX + window.scrollX + 10,
      });
    } else {
      setAnchorEl(null);
      setFeedback("");
      setSelectedErrorType(null);
      setSelectedSubError(null);
      setTempHighlight(null);
    }
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    window.getSelection().empty();
  };

  const handleHighlightedTextClick = (highlight, index) => {
    setSelectedText(highlight.text);
    setFeedback(highlight.feedback || "");
    setSelectedErrorType(highlight.errorTypeObject || null);
    setSelectedSubError(highlight.subError || null);
    setAnchorEl(contentRef.current);
    setTempHighlight(null);
  };

  const handleFeedbackChange = (content) => {
    // if (!isReviewMode)
    setFeedback(content);
  };

  const handleSaveFeedback = () => {
    // if (
    //   isReviewMode ||
    //   !selectedText ||
    //   !selectedErrorType ||
    //   !selectedSubError
    // )
    //   return;
    if (!selectedText || !selectedErrorType || !selectedSubError) return;

    // Cập nhật feedback vào vùng chọn
    setHighlightedRanges((prevRanges) => {
      const existingIndex = prevRanges.findIndex(
        (range) => range.text === selectedText
      );

      const newHighlight = {
        text: selectedText,
        feedback: feedback,
        errorType: selectedErrorType.name,
        errorTypeObject: selectedErrorType,
        subError: selectedSubError,
      };

      // Nếu đã có vùng chọn này thì cập nhật, nếu chưa có thì thêm mới
      if (existingIndex !== -1) {
        const updatedRanges = [...prevRanges];
        updatedRanges[existingIndex] = newHighlight;
        return updatedRanges;
      }

      return [...prevRanges, newHighlight];
    });

    // Reset lại trạng thái sau khi lưu
    setFeedback("");
    setSelectedErrorType(null);
    setSelectedSubError(null);
    setAnchorEl(null);
  };
  const handleGradeChange = (category, value) => {
    // if (!isReviewMode)
    setGrade((prevGrade) => ({ ...prevGrade, [category]: value }));
  };

  const handleCompleteGrading = () => {
    if (
      !essayData ||
      essayData.length === 0 ||
      !grade ||
      Object.keys(grade).length === 0
    ) {
      toast.error("Missing essential data for grading");
      return;
    }
    // if (!essayData || essayData.length === 0) return;
    // if (isReviewMode || !essayData || essayData.length === 0) return;

    const evaluationAssigningId =
      isReviewMode == true
        ? essayData[0].evaluationAssigningId
        : essayData[0].id;

    // Validate essential data before proceeding
    if (!evaluationAssigningId) {
      toast.error("Invalid evaluation ID");
      return;
    }
    const assignedDate = new Date().toISOString();

    const taskAchievementScore = grade["Task Achievement"];
    const coherenceAndCoherensionScore = grade["Coherence & Cohesion"];
    const lexicalResourceScore = grade["Lexical Resource"];
    const grammarRangeScore = grade["Grammar Range"];

    const feedbackdata = highlightedRanges
      .map((item) => {
        if (!item.subError) return null; // Kiểm tra subError để tránh lỗi undefined
        const startPosition = essayData[0].writtenContent.indexOf(item.text);
        const endPosition = startPosition + item.text.length;

        return {
          mistakeId: item.subError.mistakeId,
          startPosition,
          endPosition,
          feedbackDate: format(new Date(), "yyyy-MM-dd"),
          isGood: 0,
          comment: item.feedback,
        };
      })
      .filter((item) => item !== null); // Loại bỏ phần tử null

    const baseBody = {
      evaluationAssigningId,
      assignedDate,
      taskAchievementScore,
      coherenceAndCoherensionScore,
      lexicalResourceScore,
      grammarRangeScore,
      feedbackdata,
    };

    const body = isReviewMode
      ? { ...baseBody, teacherId: TeacherID }
      : baseBody;

    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    dispatch(
      submitEssayGradeTeacher({ tokens, body, isReGraded: isReviewMode })
    )
      .unwrap()
      .then(() => {
        let meess = isReviewMode
          ? "Update grading successfully"
          : "Grading completed successfully";
        toast.success(meess);
        dispatch(resetEssayGrade());
        // navigate("/teacher/feedback", { state: { isHistory: isReviewMode } });
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to submit the grade");
      });
  };

  const onClosePopover = () => {
    // Nếu không có feedback hoặc không chọn loại lỗi, xóa highlight tạm thời
    // if (!feedback || !selectedErrorType || !selectedSubError) {
    setTempHighlight(null); // Loại bỏ highlight tạm thời
    // }

    // Đặt lại trạng thái của popover
    setAnchorEl(null);
    setFeedback("");
    setSelectedErrorType(null);
    setSelectedSubError(null);
  };

  return (
    <Box sx={{ p: 3 }} onContextMenu={handleContextMenu}>
      <Box sx={{ p: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      {essayData && essayData.length > 0 ? (
        <Grid container spacing={2}>
          {/* Student's Essay */}
          <Grid item xs={8}>
            <Box sx={{ mb: 2 }}>
              <EssayContent
                essayData={essayData}
                essayLoading={essayLoading}
                highlightedRanges={highlightedRanges}
                handleTextSelect={handleTextSelect}
                handleHighlightedTextClick={handleHighlightedTextClick}
                contentRef={contentRef}
                categoryData={categoryDataWithColors}
                tempHighlight={tempHighlight}
                isReviewMode={isReviewMode}
              />
            </Box>

            {isGrammarChecked &&
            GrammarData?.[0]?.checkingGrammar?.length > 0 ? (
              <GrammarCheck
                text={essayData[0].writtenContent}
                grammarErrors={GrammarData[0].checkingGrammar}
              />
            ) : (
              isGrammarChecked && (
                <Box sx={{ mt: 2, color: "blue" }}>
                  No grammar errors found.
                </Box>
              )
            )}
          </Grid>

          {/* Feedback and Grading */}
          <Grid item xs={4}>
            <FeedbackSummary
              highlightedRanges={highlightedRanges}
              categoryData={categoryDataWithColors}
            />

            <GradingTable
              grade={grade}
              handleGradeChange={handleGradeChange}
              isReviewMode={isReviewMode}
              {...(aiData && { aiData })} // Chỉ truyền aiData nếu aiData có giá trị
            />

            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="outlined"
                onClick={handleGrammarCheck}
                disabled={isGrammarChecked}
              >
                {GrammarLoading ? "Checking..." : "Check Grammar"}
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleCompleteGrading}
              >
                {isReviewMode
                  ? "Update Grading Process"
                  : "Complete Grading Process"}
              </Button>
            </Box>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                onClick={handleSubmitToAI}
                sx={{
                  ml: 2, // Add left margin
                  background:
                    "linear-gradient(45deg, #FF5733, #FFBD33, #75FF33, #33FFBD, #335BFF, #A833FF)", // Rainbow gradient
                  color: "white", // Set text color
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #FF5733, #FFBD33, #75FF33, #33FFBD, #335BFF, #A833FF)", // Maintain gradient on hover
                    filter: "brightness(0.9)", // Slightly darken on hover
                  },
                  borderRadius: "8px", // Rounded corners
                  padding: "10px 20px", // Padding for better appearance
                  fontWeight: "bold", // Bold text
                }}
                disabled={aiLoading || isAiGraded}
              >
                {aiLoading ? (
                  <>
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        left: "50%",
                        marginLeft: "-12px",
                      }}
                    />{" "}
                    {/* Spinner */}
                    Sending to AI...
                  </>
                ) : (
                  <>
                    <AssistantIcon sx={{ marginRight: 1 }} />{" "}
                    {/* Icon with margin */}
                    Send to AI for Grading
                  </>
                )}
              </Button>{" "}
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ p: 2 }}>No essay data available</Box>
      )}

      <PopoverFeedback
        anchorEl={anchorEl}
        popoverPosition={popoverPosition}
        onClose={onClosePopover}
        selectedErrorType={selectedErrorType}
        setSelectedErrorType={setSelectedErrorType}
        selectedSubError={selectedSubError}
        setSelectedSubError={setSelectedSubError}
        categoryData={categoryDataWithColors}
        categoryLoading={categoryLoading}
        decodedSubCategories={decodedSubCategories}
        subCategoriesLoading={subCategoriesLoading}
        subCategoriesError={subCategoriesError}
        feedback={feedback}
        handleFeedbackChange={handleFeedbackChange}
        handleSaveFeedback={handleSaveFeedback}
        selectedText={selectedText}
        setTempHighlight={setTempHighlight}
      />
    </Box>
  );
};

export default EssayGrade;
