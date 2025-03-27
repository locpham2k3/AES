import axios from "axios";
const REACT_APP_API_URL = "https://gateway-service.aes-system.io.vn";
// const REACT_APP_API_URL = "http://localhost:3800";

export const getListWorkbook = async (tokens, condition) => {
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
export const updateWorkbook = async (tokens, body) => {
  try {
    const response = await axios.put(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/Workbook`,
      body,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`, // Gửi accessToken trong header
        },
      }
    );
    // console.log(response.data);
    return response.data; // Trả về dữ liệu cấp độ
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || "An error occurred"); // Bắt lỗi và trả về thông báo lỗi
  }
};
export const createWorkbook = async (tokens, body) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/Workbook`,
      body,
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
export const deleteWorkbook = async (tokens, workbookId) => {
  try {
    const response = await axios.delete(
      `${REACT_APP_API_URL}/api/EssayTaskProviding/Workbook/${workbookId}`,
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

export const getTotalListWorkbook = async (tokens) => {
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

// get all user
export const getAllUserService = async (tokens, condition) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/api/Admin/GetAllUsers?offset=${condition.offset}&limit=${condition.limit}&direction=${condition.direction}&sortBy=${condition.sortBy}`,
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

// update user
export const updateUserService = async (tokens, body) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/Admin/UpdateUser`,
      body,
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
