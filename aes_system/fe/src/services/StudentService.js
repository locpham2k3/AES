// src/service/authService.js
import axios from "axios";
const REACT_APP_API_URL = "https://gateway-service.aes-system.io.vn";
// const REACT_APP_API_URL = "http://localhost:3800";
// ==========================================================
// Lấy danh sách cấp độ (Levels)
// ==========================================================
export const getListLevelService = async (tokens) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/Level`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    console.log(response); // Log kiểm tra response
    return response.data; // Trả về dữ liệu cấp độ
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// ==========================================================
// Lấy danh sách workbook dựa trên cấp độ được chọn
// ==========================================================
export const getListWorkbookService = async (tokens, selectedLevel) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/Workbook/Level/${selectedLevel}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu workbook theo cấp độ
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// ==========================================================
// Lấy danh sách thể loại của workbook
// ==========================================================
export const getListCategoryService = async (tokens) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/WorkbookCategory`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu thể loại workbook
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// ==========================================================
// Lấy danh sách bài viết theo loại workbook và ID người viết (nếu có)
// ==========================================================
export const getListEssayByWorkbookService = async (
  tokens,
  typeWorkBook,
  id
) => {
  try {
    let response;
    if (id) {
      // Nếu có ID người viết, lấy danh sách bài viết theo writerId
      response = await axios.get(
        `${REACT_APP_API_URL}/api/EssayTaskProviding/EssayTask/${typeWorkBook}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
          },
        }
      );
    } else {
      // Nếu không có ID, chỉ lấy danh sách bài viết theo loại workbook
      response = await axios.get(
        `${REACT_APP_API_URL}/api/EssayTaskProviding/EssayTask/${typeWorkBook}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
          },
        }
      );
    }
    return response.data; // Trả về dữ liệu danh sách bài viết
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// ==========================================================
// Gửi bài viết của người dùng
// ==========================================================
export const submitEssayService = async (tokens, essayData) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/WritingEssay/AddEssay`,
      {
        workbookEssayTaskId: essayData.workbookEssayTaskId,
        writerId: essayData.writerId,
        writtenContent: essayData.writtenContent,
        writtenDate: essayData.writtenDate,
        durationTimeRemainingInSeconds:
          essayData.durationTimeRemainingInSeconds,
        writtenTimeInSeconds: essayData.writtenTimeInSeconds,
      },
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu phản hồi sau khi gửi
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};
// ==========================================================
// Gửi bài viết save draft của người dùng
// ==========================================================
export const submitEssayDraftService = async (tokens, essayData) => {
  try {
    console.log("submitEssayDraftService: Calling API");
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/WritingEssay/SubmitDraft?writerId=${essayData.writerId}&workbookEssayTaskId=${essayData.workbookEssayTaskId}`,
      {
        workbookEssayTaskId: essayData.workbookEssayTaskId,
        writerId: essayData.writerId,
        writtenContent: essayData.writtenContent,
        writtenDate: essayData.writtenDate,
        durationTimeRemainingInSeconds:
          essayData.durationTimeRemainingInSeconds,
        writtenTimeInSeconds: essayData.writtenTimeInSeconds,
      },
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    console.log("submitEssayDraftService: API response", response.data);
    return response.data; // Trả về dữ liệu phản hồi sau khi gửi
  } catch (error) {
    console.error("submitEssayDraftService: Error", error);
    throw new Error(error.response?.data?.message || error.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// ==========================================================
// Gửi bài viết của người dùng theo class
// ==========================================================
export const submitEssayClassService = async (tokens, essayData) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/WritingEssay/AddEssayAssignedByTeacher`,
      {
        classId: essayData.classId,
        workbookEssayTaskId: essayData.workbookEssayTaskId,
        writerId: essayData.writerId,
        writtenContent: essayData.writtenContent,
        writtenDate: essayData.writtenDate,
        durationTimeRemainingInSeconds:
          essayData.durationTimeRemainingInSeconds,
        writtenTimeInSeconds: essayData.writtenTimeInSeconds,
      },
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu phản hồi sau khi gửi
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// ==========================================================
// Gửi lưu lại bài viết của người dùng
// ==========================================================
export const saveDraftEssayService = async (tokens, essayData) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/WritingEssay/SaveDraft`,
      {
        workbookEssayTaskId: essayData.workbookEssayTaskId,
        writerId: essayData.writerId,
        writtenContent: essayData.writtenContent,
        writtenDate: essayData.writtenDate,
        durationTimeRemainingInSeconds:
          essayData.durationTimeRemainingInSeconds,
        writtenTimeInSeconds: essayData.writtenTimeInSeconds,
      },
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu phản hồi sau khi gửi
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// ==========================================================
// Lấy chi tiết bài viết đã nộp của người dùng theo essayId và studentId
// ==========================================================
export const getDetailEssaySubmittedService = async (
  tokens,
  essayId,
  studentId,
  writingPaperId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/WritingEssay/GetSubmittedEssay?writerId=${studentId}&workbookEssayTaskId=${essayId}&writingPaperId=${writingPaperId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu chi tiết bài viết đã nộp
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};
// ==========================================================
// Lấy danh sách bài viết đã chấm của người dùng theo studentId
// ==========================================================
export const getListEssayGreadedService = async (tokens, studentId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/ManualGrading/StudentGradedHistory?studentId=${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu chi tiết bài viết đã nộp
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// ==========================================================
// Lấy chi tiết bài viết đã chấm của người dùng theo studentId
// ==========================================================
export const getDetailEssayGreadedService = async (
  tokens,
  evaluationAssigningId,
  studentId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/ManualGrading/StudentGradedDetails?evaluationAssigningId=${evaluationAssigningId}&studentId=${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu chi tiết bài viết đã nộp
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};
// ==========================================================
// Lấy danh sách lớp theo studentId
// ==========================================================

export const getListClassByStudentIdService = async (tokens, studentId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Class/list-class-by-student-id/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu chi tiết bài viết đã nộp
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};
// ==========================================================
// Lấy danh sách sinh vien theo classId
// ==========================================================

export const getListStudentByClassIdStudentService = async (
  tokens,
  classId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Class/get-list-student-by-class-id/${classId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về danh sách sinh viên theo lớp học
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// ==========================================================
// Lấy danh sách task theo classId
// ==========================================================

export const getListTaskByClassIdStudentService = async (
  tokens,
  classId,
  studentId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Class/list-task-in-class/${classId}/with-student/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về danh sách
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};
// ==========================================================
// Lấy danh sách complain theo studentId
// ==========================================================
export const getListComplainByStudentIdService = async (tokens, studentId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Feedback/Complain/Student/${studentId}?offset=0&limit=100&direction=asc&sortBy=ID`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về danh sách complain theo studentId
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};
// ==========================================================
// Lấy chi tiết complain theo studentId và evaluationId
// ==========================================================

export const getDetailComplainByStudentIdService = async (
  tokens,
  studentId,
  evaluationAssigningId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Feedback/Complain/student-id/${studentId}/evaluation-id/${evaluationAssigningId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về chi tiết complain theo studentId và evaluationId
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};
