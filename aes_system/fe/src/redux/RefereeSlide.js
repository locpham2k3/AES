import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllComplains,
  getComplainById,
  addComplain,
  updateComplain,
  regradeComplain,
  getComplainsByStudentId,
} from "../services/RefereeService";

// Async Thunk để lấy danh sách complains
export const fetchRefereeComplains = createAsyncThunk(
  "referee/fetchComplains",
  async ({ tokens, condition }) => {
    const response = await getAllComplains({ tokens, condition });
    console.log("res", response);
    return response.data; // Trả về danh sách complains
  }
);

// Async Thunk để lấy chi tiết một complain theo ID
export const fetchComplainById = createAsyncThunk(
  "referee/fetchComplainById",
  async (id) => {
    const response = await getComplainById(id);
    return response.data; // Trả về chi tiết complain
  }
);

// Async Thunk để thêm complain
export const addRefereeComplain = createAsyncThunk(
  "referee/addComplain",
  async ({tokens, complainData}) => {
    const response = await addComplain({tokens, complainData});
    return response.data; // Trả về complain đã thêm
  }
);

// Async Thunk để cập nhật và đánh giá lại complain
export const regradeRefereeComplain = createAsyncThunk(
  "referee/regradeComplain",
  async ({ tokens, requestData }) => {
    const response = await regradeComplain({ tokens, requestData });
    return response.data;
  }
);

// Async Thunk để cập nhật complain (gửi tin nhắn cho học sinh)
export const updateRefereeComplain = createAsyncThunk(
  "referee/updateComplain",
  async ({ tokens, requestData }) => {
    console.log("slide", tokens, requestData);

    const response = await updateComplain({ tokens, requestData });
    return response.data; // Trả về kết quả cập nhật
  }
);

// Async Thunk để lấy complains theo Student ID
export const fetchComplainsByStudentId = createAsyncThunk(
  "referee/fetchComplainsByStudentId",
  async ({
    studentId,
    offset = 0,
    limit = 10,
    sortBy = "ID",
    direction = "asc",
  }) => {
    const response = await getComplainsByStudentId(studentId, {
      offset,
      limit,
      sortBy,
      direction,
    });
    return response.data; // Trả về danh sách complains
  }
);

// Slice cho Referee
const refereeSlice = createSlice({
  name: "referee",
  initialState: {
    complains: [],
    total: 0,
    loading: false,
    loadingUpdate: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý fetchRefereeComplains
      .addCase(fetchRefereeComplains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefereeComplains.fulfilled, (state, action) => {
        state.loading = false;
        state.complains = action.payload;
      })
      .addCase(fetchRefereeComplains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Xử lý fetchComplainById
      .addCase(fetchComplainById.fulfilled, (state, action) => {
        const complain = action.payload;
        state.complains = state.complains.map((c) =>
          c.id === complain.id ? complain : c
        );
      })
      // Xử lý addRefereeComplain
      .addCase(addRefereeComplain.pending, (state) => {
        state.loadingUpdate = true;
        state.error = null;
      })
      .addCase(addRefereeComplain.fulfilled, (state, action) => {
        state.complains.push(action.payload);
        state.loadingUpdate = false;
      })
      .addCase(addRefereeComplain.rejected, (state, action) => {
        state.loadingUpdate = false; // Khi bị lỗi, set loading = false
        state.error = action?.error?.message;
      })
      // Xử lý updateRefereeComplain
      .addCase(updateRefereeComplain.pending, (state) => {
        state.loadingUpdate = true;
        state.error = null;
      })
      .addCase(updateRefereeComplain.fulfilled, (state, action) => {
        state.loadingUpdate = false; // Khi hoàn thành, set loading = false
        const updatedComplain = action?.meta?.arg?.requestData;
        const index = state.complains.findIndex(
          (c) => c.id === updatedComplain.id
        );
        if (index !== -1) {
          state.complains[index].replyMessage = updatedComplain.replyMessage;
          state.complains[index].status = "1";
        }
      })
      .addCase(updateRefereeComplain.rejected, (state, action) => {
        state.loadingUpdate = false; // Khi bị lỗi, set loading = false
        state.error = action?.error?.message;
      })
      // Xử lý regradeRefereeComplain
      .addCase(regradeRefereeComplain.pending, (state) => {
        state.loadingUpdate = true;
        state.error = null;
      })
      .addCase(regradeRefereeComplain.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        const updatedComplain = action?.meta?.arg?.requestData;
        const index = state.complains.findIndex(
          (c) => c.id === updatedComplain.id
        );
        if (index !== -1) {
          state.complains[index].replyMessage = updatedComplain.replyMessage;
          state.complains[index].status = "1";
        }
      })
      .addCase(regradeRefereeComplain.rejected, (state, action) => {
        state.loadingUpdate = false; // Khi bị lỗi, set loading = false
        state.error = action?.error?.message;
      })
      // Xử lý fetchComplainsByStudentId
      .addCase(fetchComplainsByStudentId.fulfilled, (state, action) => {
        state.complains = action.payload;
      });
  },
});

// Export reducer
export const refereeReducer = refereeSlice.reducer;
