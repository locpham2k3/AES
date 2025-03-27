import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createWorkbook,
  deleteWorkbook,
  getAllUserService,
  getListWorkbook,
  getTotalListWorkbook,
  updateUserService,
  updateWorkbook,
} from "../services/AdminService";

// Tạo async thunk để lấy danh sách workbook cho admin
export const fetchAdminWorkbooks = createAsyncThunk(
  "admin/workbooks/getAdminWorkbookList",
  async ({ tokens, condition }, thunkAPI) => {
    try {
      const response = await getListWorkbook(tokens, condition);
      return response.data;
    } catch (error) {
      // error có thể là error object từ axios
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

// Thêm async thunk để cập nhật workbook
export const updateAdminWorkbook = createAsyncThunk(
  "admin/workbooks/updateAdminWorkbook",
  async ({ tokens, body }, thunkAPI) => {
    try {
      const response = await updateWorkbook(tokens, body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// Thêm async thunk để tạo workbook mới
export const createAdminWorkbook = createAsyncThunk(
  "admin/workbooks/createAdminWorkbook",
  async ({ tokens, body }, thunkAPI) => {
    try {
      const response = await createWorkbook(tokens, body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// Thêm async thunk để xóa workbook
export const deleteAdminWorkbook = createAsyncThunk(
  "admin/workbooks/deleteAdminWorkbook",
  async ({ tokens, workbookId }, thunkAPI) => {
    try {
      const response = await deleteWorkbook(tokens, workbookId);
      return { ...response, workbookId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
export const fetchTotalAdminWorkbooks = createAsyncThunk(
  "admin/workbooks/getTotalAdminWorkbookList",
  async ({ tokens }, thunkAPI) => {
    try {
      const response = await getTotalListWorkbook(tokens);
      return Number(response.data[0]);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// get all user
export const getAllUsers = createAsyncThunk(
  "admin/mangageUser/getAllUsers",
  async ({ tokens, condition }, thunkAPI) => {
    try {
      const response = await getAllUserService(tokens, condition);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// update user
export const updateUser = createAsyncThunk(
  "admin/mangageUser/updateUser",
  async ({ tokens, body }, thunkAPI) => {
    try {
      const response = await updateUserService(tokens, body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// Slice cho workbookAdmin

const workbookAdmin = createSlice({
  name: "workbookAdmin",
  initialState: {
    data: [],
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    addSlide: (state, action) => {
      state.data.push(action.payload);
    },
    updateSlide: (state, action) => {
      const { index, slide } = action.payload;
      state.data[index] = slide;
    },
    removeSlide: (state, action) => {
      state.data = state.data.filter((_, index) => index !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAdminWorkbooks
      .addCase(fetchAdminWorkbooks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(fetchAdminWorkbooks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = createWorkbookSlides(action.payload);
        // state.success = true;
        state.message = "Fetch workbooks successfully";
      })
      .addCase(fetchAdminWorkbooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
        state.message = "Failed to fetch workbooks";
      })

      // fetchTotalAdminWorkbooks
      // .addCase(fetchTotalAdminWorkbooks.fulfilled, (state, action) => {
      //   state.total = action.payload;
      // })

      // updateAdminWorkbook
      .addCase(updateAdminWorkbook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateAdminWorkbook.fulfilled, (state, action) => {
        state.loading = false;
        // const updatedItem = action.payload;
        // const index = state.data.findIndex(
        //   (workbook) => workbook.id === updatedItem.id
        // );
        // if (index !== -1) {
        //   state.data[index] = updatedItem;
        // }
        state.success = true;
        state.message =
          action.payload?.message || "Update workbook successfully";
      })
      .addCase(updateAdminWorkbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
        state.message = "Failed to update workbook";
      })
      // createAdminWorkbook
      .addCase(createAdminWorkbook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(createAdminWorkbook.fulfilled, (state, action) => {
        state.loading = false;
        // state.data.push(action.payload);
        state.success = true;
        state.message =
          action.payload?.message || "Create workbook successfully";
      })
      .addCase(createAdminWorkbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
        state.message = "Failed to create workbook";
      })
      // deleteAdminWorkbook
      .addCase(deleteAdminWorkbook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteAdminWorkbook.fulfilled, (state, action) => {
        state.loading = false;
        // state.data = state.data.filter(
        //   (workbook) => workbook.id !== action.payload.workbookId
        // );
        state.success = true;
        state.message =
          action.payload?.message || "Delete workbook successfully";
      })
      .addCase(deleteAdminWorkbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
        state.message = "Failed to delete workbook";
      });
  },
});
// Slice quản lý trạng thái người dùng
const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userAdminSlice = createSlice({
  name: "userAdmin",
  initialState,
  reducers: {
    resetState: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Cập nhật danh sách người dùng
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Lưu lỗi
      })
      // Xử lý updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Lưu lỗi
      });
  },
});

// Export action và reducer
export const { resetState } = userAdminSlice.actions;
export const userAdminReducer = userAdminSlice.reducer;
// Hàm tạo slide cho workbook
export const createWorkbookSlides = (workbooks) => {
  return workbooks;
};

export const { addSlide, updateSlide, removeSlide } = workbookAdmin.actions;
export const workbookAdminReducer = workbookAdmin.reducer;
