import axios from "axios";
const REACT_APP_API_URL = "https://gateway-service.aes-system.io.vn";
// const REACT_APP_API_URL = "http://localhost:3800";

// Lấy danh sách danh mục các lỗi thường gặp
export const getListCategory = async (tokens) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/ManualGrading/CommonMistake/getAllCommonMistakeCategory`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu danh mục các lỗi
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Lấy danh sách lỗi theo danh mục
export const getListMistakeByCategory = async (tokens, categoryId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/ManualGrading/CommonMistake/getCommonMistakeByCategory?categoryId=${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về danh sách lỗi của một danh mục
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Lấy danh sách phản hồi của giảng viên theo trạng thái
export const getListFeedback = async (tokens, teacherId, status) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/ManualGrading/EvaluationAssigning?teacherId=${teacherId}&status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về danh sách phản hồi
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};
// Lấy danh sách phản hồi của giảng viên theo trạng thái va lop hoc
export const getListFeedbackByClass = async (
  tokens,
  classId,
  teacherId,
  status
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/ManualGrading/ListEvaluationAssigingInClass?status=${status}&classId=${classId}&teacherId=${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về danh sách phản hồi
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Lấy chi tiết điểm bài luận theo đánh giá của giảng viên
export const getDetailEssayGrade = async (
  tokens,
  evaluationAssigningId,
  teacherId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/ManualGrading/EvaluationAssigningDetail?evaluationAssigningId=${evaluationAssigningId}&teacherId=${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về chi tiết điểm bài luận
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Lấy lịch sử chấm điểm bài luận
export const getDetailHistoryEssayGrade = async (
  tokens,
  evaluationAssigningId,
  teacherId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/ManualGrading/GradedEvaluationAssigning?evaluationAssigningId=${evaluationAssigningId}&teacherId=${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về lịch sử điểm bài luận
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// workbook list
export const getListWorkbookService = async (tokens, condition) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/Workbook?offset=${condition.offset}&limit=${condition.limit}&direction=${condition.direction}&sortBy=${condition.sortBy}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    // console.log(response.data);
    return response.data; // Trả về dữ liệu cấp độ
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

//total workbook
export const getTotalListWorkbookService = async (tokens) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/Workbook/Count`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    // console.log(response.data);
    return response.data; // Trả về dữ liệu cấp độ
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Nộp điểm bài luận
export const submitEssayGrade = async (tokens, body) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/ManualGrading/EvaluationAssigingGrade`,
      body, // Truyền `body` là đối số thứ hai
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả nộp điểm
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Nộp yêu cầu xét lại điểm bài luận
export const submitEssayReGrade = async (tokens, body) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/ManualGrading/ReGradeEvaluationAssigning`,
      body, // Truyền `body` là đối số thứ hai
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả xét lại điểm
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Lấy danh sách bài tập luận
export const getListEssayTask = async (tokens, condition) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/EssayTask/Workbook/${condition.id}?offset=${condition.offset}&limit=${condition.limit}&direction=${condition.direction}&sortBy=${condition.sortBy}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về danh sách bài tập luận
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};
export const getListEssayTaskChooseService = async (tokens, condition) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/EssayTask?offset=${condition.offset}&limit=${condition.limit}&direction=${condition.direction}&sortBy=${condition.sortBy}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về danh sách bài tập luận
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Cập nhật bài tập luận
export const updateEssayTask = async (tokens, body) => {
  try {
    const response = await axios.put(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/EssayTask`,
      body,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả cập nhật
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Tạo bài tập luận mới
export const createEssayTask = async (tokens, body) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/add-essay-with-workbook-${body.workbookEssayTaskId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả tạo bài tập
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Xóa bài tập luận
export const deleteEssayTask = async (tokens, essayTaskId) => {
  try {
    const response = await axios.delete(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/EssayTask/${essayTaskId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả xóa bài tập
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// Lấy tổng số bài tập luận
export const getTotalListEssayTask = async (tokens) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/EssayTask/Count`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về tổng số bài tập luận
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// lấy danh sách lớp học
export const getListClassService = async (tokens, teacherId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Class/list-class-by-teacher-id/${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về danh sách lớp học
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// add class
export const addClassService = async (tokens, body) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/Class/create`,
      body,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả thêm lớp học
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};
// edit class
export const editClassService = async (tokens, body) => {
  try {
    const response = await axios.put(
      `${REACT_APP_API_URL}/api/Class/UpdateClass`,
      body,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả chỉnh sửa l
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};
// delete class
export const deleteClassService = async (tokens, classId, teacherId) => {
  try {
    const response = await axios.delete(
      `${REACT_APP_API_URL}/api/Class/DeleteClass?classId=${classId}&teacherId=${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả xóa lớp học
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};

// enroll student to class by email
export const enrollStudentToClassService = async (
  tokens,
  classId,
  emailStudent
) => {
  try {
    // Mã hóa email trước khi đưa vào URL
    const encodedEmail = encodeURIComponent(emailStudent);

    const response = await axios.post(
      `${REACT_APP_API_URL}/api/Class/${classId}/enroll-student-by-email/${encodedEmail}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    // console.log(response.data);
    return response.data; // Trả về kết quả nếu thành công
  } catch (error) {
    // Bắt lỗi và trả về thông báo lỗi chi tiết hơn
    // console.error(error);
    const errorMessage =
      error.response?.data?.message ||
      "An error occurred during student enrollment.";
    throw new Error(errorMessage); // Throw error với thông báo chi tiết
  }
};
//delete student from class
export const deleteStudentFromClassService = async (
  tokens,
  classId,
  studentId
) => {
  try {
    const response = await axios.delete(
      `${REACT_APP_API_URL}/api/Class/DeleteStudentInClass?studentId=${studentId}&classId=${classId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};
//  import student to class by csv file
export const importStudentFileService = async (tokens, classId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Thêm file vào FormData với key là 'file'

    // Gửi yêu cầu POST lên backend với FormData
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/Class/${classId}/add-students-from-file-by-email`, // Địa chỉ API backend
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Chỉ định loại nội dung là multipart/form-data
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả từ backend
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Xử lý lỗi nếu có
  }
};

//get list student by class id
export const getListStudentByClassIdService = async (tokens, classId) => {
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

// get list task by class id
export const getListTaskByClassIdService = async (tokens, classId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Class/TaskAssignToClass/${classId}`,
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

// create task to class by class id
export const createTaskToClassService = async (tokens, teacherId, body) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/Class/${teacherId}/assign-task`,
      body,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về kết quả
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};
// delete task from class
export const deleteTaskFromClassService = async (
  tokens,
  classId,
  teacherId,
  workbookEssayTaskId
) => {
  try {
    const response = await axios.delete(
      `${REACT_APP_API_URL}/api/Class/DeleteWorkbookEssayTask?teacherId=${teacherId}&classId=${classId}&workbookEssayTaskInClassId=${workbookEssayTaskId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};
// get count task in class by class id and teacher id
export const getCountTaskInClassService = async (
  tokens,
  classId,
  teacherId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Class/count-task-scored/${classId}/${teacherId}`,
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

// get count task in class by classAssigmentId and teacherId
export const getCountTaskInClassByAssigmentService = async (
  tokens,
  classTaskAssignmentId,
  teacherId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Class/count-task-scored-with-class-task-assignment/${classTaskAssignmentId}/${teacherId}`,
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

// check grammar
export const checkGrammarService = async (tokens, body) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/grammarCheck`,
      body,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

// grade essay for ai
export const gradeEssayForAiService = async (tokens, body) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/grade/ai-grade`,
      // `http://20.189.113.11:9090/api/grade/ai-grade`,
      body
      // {
      //   headers: {
      //     Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
      //   },
      // }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};
