import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDetailComplainByStudentIdService,
  getDetailEssayGreadedService,
  getDetailEssaySubmittedService,
  getListCategoryService,
  getListClassByStudentIdService,
  getListComplainByStudentIdService,
  getListEssayByWorkbookService,
  getListEssayGreadedService,
  getListLevelService,
  getListStudentByClassIdStudentService,
  getListTaskByClassIdStudentService,
  getListWorkbookService,
  saveDraftEssayService,
  submitEssayClassService,
  submitEssayDraftService,
  submitEssayService, // Bổ sung service này vào để quản lý trạng thái khi submit bài luận
} from "../services/StudentService";

// Async thunks cho việc gọi API
// Tạo async thunk để lấy dữ liệu level
export const fetchLevels = createAsyncThunk(
  "level/getListLevel",
  async (tokens, { rejectWithValue }) => {
    try {
      const response = await getListLevelService(tokens);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy dữ liệu workbook
export const fetchWorkbooks = createAsyncThunk(
  "workbook/getWorkbookList",
  async ({ tokens, selectedLevel }, { rejectWithValue }) => {
    try {
      const response = await getListWorkbookService(tokens, selectedLevel);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy dữ liệu category
export const fetchCategories = createAsyncThunk(
  "category/getCategoryList",
  async (tokens, { rejectWithValue }) => {
    try {
      const response = await getListCategoryService(tokens);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy danh sách bài luận
export const fetchEssaysByWorkbook = createAsyncThunk(
  "essays/getEssaysList",
  async ({ tokens, typeWorkBook, id }, { rejectWithValue }) => {
    try {
      const response = await getListEssayByWorkbookService(
        tokens,
        typeWorkBook,
        id
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy chi tiết bài luận
export const fetchEssay = createAsyncThunk(
  "essays/getEssay",
  async ({ tokens, id }, { rejectWithValue }) => {
    try {
      const response = await getListEssayByWorkbookService(tokens, id);
      // Chuyển đổi từ object thành mảng chứa object đó
      const essaysArray = [response.data];
      return essaysArray;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy chi tiết bài luận đã submit
export const fetchEssaySubmit = createAsyncThunk(
  "essays/getEssaySubmit",
  async (
    { tokens, essayId, studentId, writingPaperId },
    { rejectWithValue }
  ) => {
    try {
      const response = await getDetailEssaySubmittedService(
        tokens,
        essayId,
        studentId,
        writingPaperId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để submit bài luận
export const submitEssay = createAsyncThunk(
  "essayWriting/submitEssay",
  async ({ tokens, essayData, check }, { rejectWithValue }) => {
    try {
      const response =
        check == 0 || check == "0"
          ? await submitEssayService(tokens, essayData)
          : check == 2
            ? await submitEssayDraftService(tokens, essayData)
            : await submitEssayClassService(tokens, essayData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để save draft bài luận
export const saveDraftEssay = createAsyncThunk(
  "essayWriting/saveDraftEssay",
  async ({ tokens, essayData }, { rejectWithValue }) => {
    try {
      const response = await saveDraftEssayService(tokens, essayData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy danh sách bài đã chấm
export const fetchEssaysMarked = createAsyncThunk(
  "essays/getEssaysMarked",
  async ({ tokens, studentId }, { rejectWithValue }) => {
    try {
      const response = await getListEssayGreadedService(tokens, studentId);
      return response.data || []; // Đảm bảo trả về mảng rỗng nếu response.data undefined
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy chi tiết bài đã chấm
export const fetchEssayGradedDetail = createAsyncThunk(
  "essays/getEssayGradedDetail",
  async ({ tokens, evaluationAssigningId, studentId }, { rejectWithValue }) => {
    try {
      const response = await getDetailEssayGreadedService(
        tokens,
        evaluationAssigningId,
        studentId
      );
      return response.data || []; // Đảm bảo trả về mảng rỗng nếu response.data undefined
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy danh sách lớp
export const fetchClasses = createAsyncThunk(
  "class/getListClass",
  async ({ tokens, studentId }, { rejectWithValue }) => {
    try {
      const response = await getListClassByStudentIdService(tokens, studentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy danh sách học sinh theo ID lớp
export const fetchListStudentByClassId = createAsyncThunk(
  "teacher/class/getListStudentByClassId",
  async ({ tokens, classId }, { rejectWithValue }) => {
    try {
      const response = await getListStudentByClassIdStudentService(
        tokens,
        classId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy danh sách bài tập theo ID lớp
export const fetchListTaskByClassId = createAsyncThunk(
  "teacher/class/getListTaskByClassId",
  async ({ tokens, classId, studentId }, { rejectWithValue }) => {
    try {
      const response = await getListTaskByClassIdStudentService(
        tokens,
        classId,
        studentId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy danh sách khiếu nại của học sinh
export const fetchListComplainByStudentId = createAsyncThunk(
  "student/getListComplainByStudentId",
  async ({ tokens, studentId }, { rejectWithValue }) => {
    try {
      const response = await getListComplainByStudentIdService(
        tokens,
        studentId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo async thunk để lấy chi tiết khiếu nại của học sinh theo ID
export const fetchDetailComplainByStudentId = createAsyncThunk(
  "student/getDetailComplainByStudentId",
  async ({ tokens, studentId, evaluationAssigningId }, { rejectWithValue }) => {
    try {
      const response = await getDetailComplainByStudentIdService(
        tokens,
        studentId,
        evaluationAssigningId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Slice cho level
const levelSlice = createSlice({
  name: "level",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Slice cho workbook
const WorkbookSlice = createSlice({
  name: "workbook",
  initialState: {
    workbook: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkbooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkbooks.fulfilled, (state, action) => {
        state.loading = false;
        state.workbook = action.payload.data;
      })
      .addCase(fetchWorkbooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Slice cho category
const CategorySlice = createSlice({
  name: "category",
  initialState: {
    category: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Slice cho danh sách bài luận
const EssaySlice = createSlice({
  name: "essay",
  initialState: {
    essay: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEssaysByWorkbook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEssaysByWorkbook.fulfilled, (state, action) => {
        state.loading = false;
        state.essay = action.payload;
      })
      .addCase(fetchEssaysByWorkbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
// Slice cho danh sách bài luận đã chấm
const EssayGradeSlice = createSlice({
  name: "essayGraded",
  initialState: {
    essayGraded: [], // Tên chính xác để sử dụng trong component
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEssaysMarked.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEssaysMarked.fulfilled, (state, action) => {
        state.loading = false;
        state.essayGraded = action.payload || []; // Lưu dữ liệu vào essayGraded và mặc định là mảng rỗng nếu payload không có giá trị
      })
      .addCase(fetchEssaysMarked.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
// Slice cho chi tiết bài luận và submit bài luận
const EssayWritingSlice = createSlice({
  name: "essayWriting",
  initialState: {
    essayWriting: [], // Nơi lưu dữ liệu trả về từ API
    loading: false,
    error: null,
    submitSuccess: false, // Thêm trạng thái submit
  },
  reducers: {
    // Thêm action để xóa dữ liệu bài luận
    resetEssayData: (state) => {
      state.essayWriting = [];
      state.loading = false;
      state.error = null;
      state.submitSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEssay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEssay.fulfilled, (state, action) => {
        state.loading = false;
        state.essayWriting = action.payload; // Lưu dữ liệu trả về vào state
      })
      .addCase(fetchEssay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Xử lý submit bài luận
      .addCase(submitEssay.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(submitEssay.fulfilled, (state, action) => {
        state.loading = false;
        state.submitSuccess = true;
      })
      .addCase(submitEssay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.submitSuccess = false;
      })
      // Xử lý save draft bài luận
      .addCase(saveDraftEssay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDraftEssay.fulfilled, (state, action) => {
        state.loading = false;
      })

      // Xử lý khi lấy chi tiết bài luận đã submit
      .addCase(fetchEssaySubmit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEssaySubmit.fulfilled, (state, action) => {
        state.loading = false;
        state.essayWriting = action.payload; // Lưu dữ liệu trả về vào state
      })
      .addCase(fetchEssaySubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
// Slice cho danh sách bài luận đã chấm
const EssayGradedDetailSlice = createSlice({
  name: "essayGradedDetail",
  initialState: {
    essayGradedDetail: [], // Tên chính xác để sử dụng trong component
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEssayGradedDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEssayGradedDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.essayGradedDetail = action.payload || []; // Lưu dữ liệu vào essayGraded và mặc định là mảng rỗng nếu payload không có giá trị
      })
      .addCase(fetchEssayGradedDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
// Slice cho danh sách lớp
const classStudent = createSlice({
  name: "classStudent",
  initialState: {
    data: [], // Lưu trữ dữ liệu lớp học, bao gồm tasks và students
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = createClassSlides(action.payload); // Tạo các slide lớp học từ dữ liệu
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Lưu lỗi nếu có
      });
  },
});
// Slice cho complain
const complainSlice = createSlice({
  name: "complain",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListComplainByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListComplainByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || []; // Đảm bảo có fallback khi payload là undefined
      })
      .addCase(fetchListComplainByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
const complainDetailSlice = createSlice({
  name: "complainDetail",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailComplainByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailComplainByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || []; // Đảm bảo có fallback khi payload là undefined
      })
      .addCase(fetchDetailComplainByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Slide creation function to handle both class creation (POST) and class list fetch (GET)
export const createClassSlides = (classData) => {
  return classData.map((classItem) => ({
    id: classItem.id || Date.now(), // Generate ID if not provided
    name: classItem.name || "Unnamed Class", // Fallback to "Unnamed Class" if className is missing
    totalTask: classItem.totalTask || 0, // Ensure totalTask is set to 0 if not provided
    teacherName: classItem.teacherName || "", // Ensure totalStudent is set to 0 if not provided
    status: classItem.status || "0", // Ensure status defaults to "0" if not provided
  }));
};
// Slice cho danh sách sinh viên và task của lớp học
const classDetailStudetnSlice = createSlice({
  name: "classDetailStudent",
  initialState: {
    students: [], // Dữ liệu sinh viên của lớp học
    tasks: [], // Dữ liệu task của lớp học
    loading: false, // Cờ tải dữ liệu
    error: null, // Lỗi khi fetch
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch danh sách sinh viên
      .addCase(fetchListStudentByClassId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListStudentByClassId.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload; // Cập nhật danh sách sinh viên
      })
      .addCase(fetchListStudentByClassId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Lưu lỗi nếu có
      })
      // Fetch danh sách task
      .addCase(fetchListTaskByClassId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListTaskByClassId.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // Cập nhật danh sách task
      })
      .addCase(fetchListTaskByClassId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Lưu lỗi nếu có
      });
  },
});

// Export hành động reset để sử dụng
export const { resetEssayData } = EssayWritingSlice.actions;
// Export reducers từ từng slice
export const essayReducer = EssaySlice.reducer;
export const essayWritingReducer = EssayWritingSlice.reducer;
export const categoryReducer = CategorySlice.reducer;
export const levelReducer = levelSlice.reducer;
export const workbookReducer = WorkbookSlice.reducer;
export const essayGradeReducer = EssayGradeSlice.reducer;
export const essayGradedDetailReducer = EssayGradedDetailSlice.reducer;
export const classStudentReducer = classStudent.reducer;
export const classDetailStudentReducer = classDetailStudetnSlice.reducer;
export const complainStudentReducer = complainSlice.reducer;
export const complainDetailStudentReducer = complainDetailSlice.reducer;
