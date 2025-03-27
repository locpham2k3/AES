import axios from "axios";
const REACT_APP_API_URL = "https://gateway-service.aes-system.io.vn";
// const REACT_APP_API_URL = "http://localhost:3800";

export const getAllComplains = async ({ tokens, condition }) => {
  try {
    console.log("service", condition);

    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Feedback/Complain`, // Đường dẫn API
      {
        params: {
          offset: condition?.offset,
          limit: condition?.limit,
          direction: condition?.direction,
          sortBy: condition?.sortBy,
        },
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu API
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const getComplainById = async (tokens, id) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Feedback/Complain/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const addComplain = async ({ tokens, complainData }) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/Feedback/Complain`,
      complainData,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const updateComplain = async ({ tokens, requestData }) => {
  try {
    const response = await axios.put(
      `${REACT_APP_API_URL}/api/Feedback/Complain`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const regradeComplain = async ({ tokens, requestData }) => {
  try {
    const response = await axios.put(
      `${REACT_APP_API_URL}/api/Feedback/Complain/ReGrade`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const getComplainsByStudentId = async (tokens, studentId, condition) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Feedback/Complain/Student/${studentId}`,
      {
        params: {
          offset: condition.offset,
          limit: condition.limit,
          direction: condition.direction,
          sortBy: condition.sortBy,
        },
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};
