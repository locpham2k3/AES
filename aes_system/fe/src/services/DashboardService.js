// DashboardService.js
import axios from "axios";
const REACT_APP_API_URL = "https://gateway-service.aes-system.io.vn";
// const REACT_APP_API_URL = "http://localhost:3800";

/*
.########.########....###.....######..##.....##.########.########.
....##....##.........##.##...##....##.##.....##.##.......##.....##
....##....##........##...##..##.......##.....##.##.......##.....##
....##....######...##.....##.##.......#########.######...########.
....##....##.......#########.##.......##.....##.##.......##...##..
....##....##.......##.....##.##....##.##.....##.##.......##....##.
....##....########.##.....##..######..##.....##.########.##.....##
*/
// get total class and student by teacherId
export const getTotalClassAndStudentByTeacherService = async (
  tokens,
  teacherId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/teacher/ClassAndStudentStatistic?teacherId=${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    // console.log(response); // Log kiểm tra response
    return response.data; // Trả về dữ liệu cấp độ
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// get list task expiry in class
export const getListTaskExpiryByTeacherService = async (tokens, teacherId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/teacher/ListDealineOfTask?teacherId=${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    // console.log(response); // Log kiểm tra response
    return response.data; // Trả về dữ liệu cấp độ
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};
// get grading effect of teacher
export const getGradingEffectByTeacherService = async (tokens, teacherId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/teacher/GradeStatistics?teacherId=${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    // console.log(response); // Log kiểm tra response
    return response.data; // Trả về dữ liệu cấp độ
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

// get average score of teacher
export const getAverageScoreByTeacherService = async (
  tokens,
  teacherId,
  classId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/teacher/AverageScoreInClass?teacherId=${teacherId}&classId=${classId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    // console.log(response); // Log kiểm tra response
    return response.data; // Trả về dữ liệu cấp độ
  } catch (error) {
    throw new Error(error.response.data.message); // Bắt lỗi và trả về thông báo lỗi
  }
};

/*
..######..########.##.....##.########..########.##....##.########
.##....##....##....##.....##.##.....##.##.......###...##....##...
.##..........##....##.....##.##.....##.##.......####..##....##...
..######.....##....##.....##.##.....##.######...##.##.##....##...
.......##....##....##.....##.##.....##.##.......##..####....##...
.##....##....##....##.....##.##.....##.##.......##...###....##...
..######.....##.....#######..########..########.##....##....##...
*/
// get average score per class
export const getAverageScorePerClassStudentService = async (
  tokens,
  studentId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/student/AverageScorePerClass?studentId=${studentId}`,
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

// get process of student
export const getProcessOfStudentService = async (tokens, studentId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/student/ProgressOfStudent?studentId=${studentId}`,
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

// get writting performance of student
export const getWrittingPerformanceOfStudentService = async (
  tokens,
  studentId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/student/WritingPerformance?studentId=${studentId}`,
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

// post get writting performance of student
export const postWrittingPerformanceOfStudentService = async (tokens, data) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/Dashboard/student/WritingPerformance`,
      data,
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

// get writting paper statistic of student
export const getWrittingPaperStatisticOfStudentService = async (
  tokens,
  studentId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/student/WritingPaperStatistics?studentId=${studentId}`,
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

// get average writting time of student
export const getAverageWrittingTimeOfStudentService = async (
  tokens,
  studentId
) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/student/AverageWritingTime?studentId=${studentId}`,
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
// get deeadline class of student
export const getDeadlineClassOfStudentService = async (tokens, studentId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/student/DealineClass?studentId=${studentId}`,
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

/*
....###....##.....##.########..####.##....##
...##.##...###...###.##.....##..##..###...##
..##...##..####.####.##.....##..##..####..##
.##.....##.##.###.##.##.....##..##..##.##.##
.#########.##.....##.##.....##..##..##..####
.##.....##.##.....##.##.....##..##..##...###
.##.....##.##.....##.########..####.##....##
*/

// get total user (student, teacher, referee)
export const getTotalUserOfAdminService = async (tokens) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/admin/StatisticUser`,
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

// get list class and detail of class
export const getListClassAndDetailOfAdminService = async (tokens) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/admin/ListActive/Class`,
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
//get total essaytask in system
export const getTotalEssayTaskOfAdminService = async (tokens) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/admin/ListActive/EssayTask`,
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

// get total complain in system
export const getTotalComplainOfAdminService = async (tokens) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Dashboard/admin/ComplainStatistic`,
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
