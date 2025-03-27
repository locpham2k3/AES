import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addClassService,
  checkGrammarService,
  createEssayTask,
  createTaskToClassService,
  deleteClassService,
  deleteEssayTask,
  deleteStudentFromClassService,
  deleteTaskFromClassService,
  editClassService,
  enrollStudentToClassService,
  getDetailEssayGrade,
  getDetailHistoryEssayGrade,
  getListCategory,
  getListClassService,
  getListEssayTask,
  getListEssayTaskChooseService,
  getListFeedback,
  getListFeedbackByClass,
  getListMistakeByCategory,
  getListStudentByClassIdService,
  getListTaskByClassIdService,
  getListWorkbookService,
  getTotalListEssayTask,
  getTotalListWorkbookService,
  gradeEssayForAiService,
  importStudentFileService,
  submitEssayGrade,
  submitEssayReGrade,
  updateEssayTask,
} from "../services/TeacherService";

// Tạo async thunk để lấy dữ liệu feedback cho teacher
export const fetchTeacherFeedbacks = createAsyncThunk(
  "teacher/feedbacks/getTeacherFeedbackList",
  async ({ tokens, check, body }) => {
    const response =
      check == 1
        ? await getListFeedbackByClass(
            tokens,
            body.classId,
            body.teacherId,
            body.status
          )
        : await getListFeedback(tokens, body.teacherId, body.status);
    return response.data; // Trả về dữ liệu từ response
  }
);
export const fetchListCategory = createAsyncThunk(
  "teacher/category/getListCategory",
  async ({ tokens }) => {
    const response = await getListCategory(tokens);
    return response.data; // Trả về dữ liệu từ response
  }
);
export const fetchMistakeByCategory = createAsyncThunk(
  "teacher/mistake/getMistakeByCategory",
  async ({ tokens, categoryId }) => {
    const response = await getListMistakeByCategory(tokens, categoryId);
    // console.log(response.data[0].commonMistakes);
    return response.data[0].commonMistakes; // Trả về dữ liệu từ response
  }
);
export const fetchDetailEssayGrade = createAsyncThunk(
  "teacher/essay/getDetailEssayGrade",
  async ({ tokens, evaluationAssigningId, teacherId, isHistory = false }) => {
    const response = isHistory
      ? await getDetailHistoryEssayGrade(
          tokens,
          evaluationAssigningId,
          teacherId
        )
      : await getDetailEssayGrade(tokens, evaluationAssigningId, teacherId);
    console.log(response.data);
    return response.data;
  }
);
export const submitEssayGradeTeacher = createAsyncThunk(
  "teacher/essay/submitEssayGrade",
  async ({ tokens, body, isReGraded }) => {
    const response = isReGraded
      ? await submitEssayReGrade(tokens, body)
      : await submitEssayGrade(tokens, body);
    return response.data; // Trả về dữ liệu từ response
  }
);

// Tạo async thunk để lấy danh sách essaytask cho teacher
export const fetchTeacherEssayTask = createAsyncThunk(
  "teacher/essaytask/getTeacherEssayTaskList",
  async ({ tokens, condition, check }) => {
    const response =
      check == 1
        ? await getListEssayTaskChooseService(tokens, condition)
        : await getListEssayTask(tokens, condition);
    return response.data; // Trả về dữ liệu từ response
  }
);

// Thêm async thunk để cập nhật essaytask
export const updateTeacherEssayTask = createAsyncThunk(
  "teacher/essaytask/updateTeacherEssayTask",
  async ({ tokens, body }) => {
    const response = await updateEssayTask(tokens, body);
    return response; // Trả về dữ liệu từ response
  }
);

// Thêm async thunk để tạo essaytask mới
export const createTeacherEssayTask = createAsyncThunk(
  "teacher/essaytask/createTeacherEssayTask",
  async ({ tokens, body }) => {
    const response = await createEssayTask(tokens, body);
    return response; // Trả về dữ liệu từ response
  }
);

// Thêm async thunk để xóa essaytask
export const deleteTeacherEssayTask = createAsyncThunk(
  "teacher/essaytask/deleteTeacherEssayTask",
  async ({ tokens, essayTaskId }) => {
    console.log(essayTaskId);
    const response = await deleteEssayTask(tokens, essayTaskId);
    return response; // Trả về dữ liệu từ response
  }
);

export const fetchTotalTeacherEssayTask = createAsyncThunk(
  "teacher/essaytask/getTotalTeacherEssayTaskList",
  async ({ tokens }) => {
    const response = await getTotalListEssayTask(tokens);
    return Number(response.data[0]); // Trả về dữ liệu từ response
  }
);

// get list class
export const fetchListClass = createAsyncThunk(
  "teacher/class/getListClass",
  async ({ tokens, teacherId }) => {
    const response = await getListClassService(tokens, teacherId);
    return response.data; // Trả về dữ liệu từ response
  }
);
// add class
export const addClass = createAsyncThunk(
  "teacher/class/addClass",
  async ({ tokens, body }, { dispatch, rejectWithValue }) => {
    try {
      const response = await addClassService(tokens, body); // Thêm lớp học mới
      return response.data; // Trả về dữ liệu của lớp học vừa thêm
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message); // Xử lý lỗi nếu có
    }
  }
);

// update class
export const updateClassName = createAsyncThunk(
  "teacher/class/updateClassName",
  async ({ tokens, body }, { dispatch, rejectWithValue }) => {
    try {
      const response = await editClassService(tokens, body); // Cập nhật tên lớp học
      return response.data; // Trả về dữ liệu của lớp học vừa cập nhật
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Xử lý lỗi nếu có
    }
  }
);

// delete class
export const deleteClass = createAsyncThunk(
  "teacher/class/deleteClass",
  async ({ tokens, classId, teacherId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteClassService(tokens, classId, teacherId); // Xóa lớp học
      return response.data; // Trả về dữ liệu từ response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Xử lý lỗi nếu có
    }
  }
);
// enroll student to class by email
export const enrollStudentToClass = createAsyncThunk(
  "teacher/class/enrollStudentToClass",
  async ({ tokens, classId, emailStudent }, { rejectWithValue }) => {
    try {
      const response = await enrollStudentToClassService(
        tokens,
        classId,
        emailStudent
      );
      console.log(response);
      if (response.code == 500) {
        const errorMessage =
          response.message || "An error occurred while enrolling the student.";
        return rejectWithValue({
          message: errorMessage,
          status: response.code || 500, // Đảm bảo có mã trạng thái trong lỗi
        });
      }
      return response.data; // Trả về dữ liệu nếu thành công
    } catch (error) {
      // Trả về lỗi với thông báo rõ ràng
      const errorMessage =
        error || "An error occurred while enrolling the student.";
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500, // Đảm bảo có mã trạng thái trong lỗi
      });
    }
  }
);
// delete student from class
export const deleteStudentFromClass = createAsyncThunk(
  "teacher/class/deleteStudentFromClass",
  async ({ tokens, classId, studentId }, { dispatch }) => {
    const response = await deleteStudentFromClassService(
      tokens,
      classId,
      studentId
    );
    // if (response.data) {
    //   // Gọi lại fetchListStudentByClassId sau khi xóa sinh viên khỏi lớp học thành công
    //   await dispatch(fetchListStudentByClassId({ tokens, classId }));
    // }
    return response.data; // Trả về dữ liệu từ response
  }
);
// Import student to class from CSV file
export const importStudentToClass = createAsyncThunk(
  "teacher/class/importStudentToClass",
  async ({ tokens, classId, file }, { dispatch }) => {
    // const formData = new FormData();
    // formData.append("file", file); // Thêm file vào FormData

    try {
      // Gửi file lên backend
      const response = await importStudentFileService(tokens, classId, file);

      // Kiểm tra mã trạng thái trả về
      // if (response.code === 200) {
      //   // Gọi lại fetchListStudentByClassId và fetchListTaskByClassId nếu import thành công
      //   await dispatch(fetchListStudentByClassId({ tokens, classId }));
      //   await dispatch(fetchListTaskByClassId({ tokens, classId }));
      // }

      return response.data; // Trả về dữ liệu từ response
    } catch (error) {
      throw new Error(error.message || "Error importing students.");
    }
  }
);
//get list student by class id
export const fetchListStudentByClassId = createAsyncThunk(
  "teacher/class/getListStudentByClassId",
  async ({ tokens, classId }) => {
    const response = await getListStudentByClassIdService(tokens, classId);
    return response.data; // Trả về dữ liệu từ response
  }
);
// get list task by class id
export const fetchListTaskByClassId = createAsyncThunk(
  "teacher/class/getListTaskByClassId",
  async ({ tokens, classId }) => {
    const response = await getListTaskByClassIdService(tokens, classId);
    return response.data; // Trả về dữ liệu từ response
  }
);

// add task to class by class id
export const addTaskToClass = createAsyncThunk(
  "teacher/class/addTaskToClass",
  async ({ tokens, teacherId, body }) => {
    const response = await createTaskToClassService(tokens, teacherId, body);
    return response.data; // Trả về dữ liệu từ response
  }
);

// delete task from class by class id
export const deleteTaskFromClass = createAsyncThunk(
  "teacher/class/deleteTaskFromClass",
  async ({ tokens, classId, teacherId, workbookEssayTaskId }) => {
    const response = await deleteTaskFromClassService(
      tokens,
      classId,
      teacherId,
      workbookEssayTaskId
    );
    return response.data; // Trả về dữ liệu từ response
  }
);
//list workbook
export const fetchTeacherWorkbooks = createAsyncThunk(
  "teacher/workbooks/getTeacherWorkbookList",
  async ({ tokens, condition }) => {
    const response = await getListWorkbookService(tokens, condition);
    return response.data; // Trả về dữ liệu từ response
  }
);
// total workbook
export const fetchTotalTeacherWorkbooks = createAsyncThunk(
  "teacher/workbooks/getTotalTeacherWorkbookList",
  async ({ tokens }) => {
    const response = await getTotalListWorkbookService(tokens);
    return Number(response.data[0]); // Trả về dữ liệu từ response
  }
);

// grammar check
export const fetchTeacherGrammarCheck = createAsyncThunk(
  "teacher/grammarCheck/getTeacherGrammarCheckList",
  async ({ tokens, body }) => {
    const response = await checkGrammarService(tokens, body);
    return response.data; // Trả về dữ liệu từ response
  }
);
export const fetchTeacherGradeEssayByAi = createAsyncThunk(
  "teacher/gradeEssay/getTeacherGradeEssayList",
  async ({ tokens, body }, { rejectWithValue }) => {
    try {
      const response = await gradeEssayForAiService(tokens, body);
      return response.data; // Trả về dữ liệu từ response
    } catch (error) {
      // Xử lý lỗi, trả về lỗi nếu có
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

// Slice cho feedbackTeacher
const feedbackTeacher = createSlice({
  name: "feedbackTeacher",
  initialState: {
    data: [], // Đây là nơi lưu trữ danh sách slide feedback
    loading: false,
    error: null,
  },
  reducers: {
    addFeedbackSlide: (state, action) => {
      // state.data.push(action.payload);
    },
    updateFeedbackSlide: (state, action) => {
      // const { index, slide } = action.payload;
      // state.data[index] = slide;
    },
    removeFeedbackSlide: (state, action) => {
      // state.data = state.data.filter((_, index) => index !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = createFeedbackSlides(action.payload);
      })
      .addCase(fetchTeacherFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
// Slice cho categoryTeacher
const categoryTeacher = createSlice({
  name: "categoryTeacher",
  initialState: {
    data: [], // Đây là nơi lưu trữ danh sách slide category
    loading: false,
    error: null,
  },
  reducers: {
    addCategory: (state, action) => {
      state.data = action.payload;
    },
    resetMistakes: (state) => {
      state.mistake = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchListCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
// Slice cho mistakeTeacher
const mistakeTeacher = createSlice({
  name: "mistakeTeacher",
  initialState: {
    mistake: [], // Lưu trữ danh sách mistake
    loading: false,
    error: null,
  },
  reducers: {
    addMistake: (state, action) => {
      state.mistake = action.payload;
    },
    resetMistakes: (state) => {
      state.mistake = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMistakeByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMistakeByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.mistake = action.payload;
        console.log("Fetched mistakes:", action.payload);
      })
      .addCase(fetchMistakeByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Slide cho EssayGrade
const essayGradeTeacher = createSlice({
  name: "essayGradeTeacher",
  initialState: {
    essayDetailGrade: [], // Lưu trữ dữ liệu chấm điểm của bài essay
    loading: false,
    error: null,
    successMessage: null, // Để hiển thị thông báo khi chấm thành công
  },
  reducers: {
    addEssayGrade: (state, action) => {
      state.essayDetailGrade = action.payload;
    },
    resetEssayGrade: (state) => {
      state.essayDetailGrade = []; // Xóa dữ liệu sau khi chấm xong
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailEssayGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailEssayGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.essayDetailGrade = action.payload;
        // console.log("Fetched essay detail grade:", action.payload);
      })
      .addCase(fetchDetailEssayGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Xử lý submitEssayGrade
      .addCase(submitEssayGradeTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitEssayGradeTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Grading completed successfully";
        state.essayDetailGrade = [];
      })
      .addCase(submitEssayGradeTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lưu lỗi nếu có
      });
  },
});

// Slice cho essayTaskTeacher
const essayTaskTeacher = createSlice({
  name: "essayTaskTeacher",
  initialState: {
    data: [], // Đây là nơi lưu trữ danh sách slide dữ liệu
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addEssayTaskSlide: (state, action) => {
      state.data.push(action.payload);
    },
    updateEssayTaskSlide: (state, action) => {
      const { index, slide } = action.payload;
      state.data[index] = slide;
    },
    removeEssayTaskSlide: (state, action) => {
      state.data = state.data.filter((_, index) => index !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Xử lý fetchTeacherEssayTask
    builder
      .addCase(fetchTeacherEssayTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherEssayTask.fulfilled, (state, action) => {
        state.loading = false;
        state.data = createEssayTaskSlides(action.payload);
        console.log("Fetched essay task:", action.payload);
      })
      .addCase(fetchTeacherEssayTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Xử lý updateTeacherEssayTask
      .addCase(updateTeacherEssayTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacherEssayTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex(
          (essaytask) => essaytask.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateTeacherEssayTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Xử lý createTeacherEssayTask
      .addCase(createTeacherEssayTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacherEssayTask.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createTeacherEssayTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Xử lý deleteTeacherEssayTask
      .addCase(deleteTeacherEssayTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeacherEssayTask.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(
          (essaytask) => essaytask.id !== action.meta.arg.essayTaskId
        );
      })
      .addCase(deleteTeacherEssayTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// slide cho class list by Teacher Id
const classTeacher = createSlice({
  name: "classTeacher",
  initialState: {
    data: [], // Lưu trữ dữ liệu lớp học, bao gồm tasks và students
    loading: false,
    error: null,
    erorrMessage: null,
  },
  reducers: {
    addClassSlide: (state, action) => {
      state.data.push(action.payload); // Thêm lớp học mới vào danh sách
    },
    updateClassSlide: (state, action) => {
      const { index, slide } = action.payload;
      state.data[index] = slide; // Cập nhật lớp học
    },
    removeClassSlide: (state, action) => {
      state.data = state.data.filter((_, index) => index !== action.payload); // Xóa lớp học
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListClass.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Dữ liệu lớp học sau khi gọi fetchListClass
      })
      .addCase(fetchListClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Lưu lỗi nếu có
      })
      // Xử lý thêm lớp học thành công
      .addCase(addClass.pending, (state) => {
        state.loading = true; // Bật loading khi thêm lớp học
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.loading = false;
        // Thêm lớp học mới vào danh sách
        // state.data.push(action.payload);
      })
      .addCase(addClass.rejected, (state, action) => {
        state.loading = false;
        state.erorrMessage = action.error.message; // Lưu lỗi nếu thêm lớp học thất bại
      })
      // Xử lý cập nhật tên lớp học thành công
      .addCase(updateClassName.pending, (state) => {
        state.loading = true; // Bật loading khi cập nhật tên lớp học
      })
      .addCase(updateClassName.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật lớp học đã chỉnh sửa (bằng cách tìm lớp theo ID và thay thế thông tin mới)
        // const updatedClass = action.payload;
        // state.data = state.data.map((classItem) =>
        //   classItem.id === updatedClass.id ? updatedClass : classItem
        // );
      })
      .addCase(updateClassName.rejected, (state, action) => {
        state.loading = false;
        state.erorrMessage = action.error.message; // Lưu lỗi nếu cập nhật tên lớp học thất bại
      })
      // Xóa lớp học
      .addCase(deleteClass.pending, (state) => {
        state.loading = true; // Bật loading khi cập nhật tên lớp học
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật lớp học đã chỉnh sửa (bằng cách tìm lớp theo ID và thay thế thông tin mới)
        // const updatedClass = action.payload;
        //  state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.erorrMessage = action.error.message; // Lưu lỗi nếu cập nhật tên lớp học thất bại
      });
  },
}); // Slide creation function to handle both class creation (POST) and class list fetch (GET)
export const createClassSlides = (classData) => {
  return classData.map((classItem) => ({
    id: classItem.id || Date.now(), // Generate ID if not provided
    name: classItem.name || "Unnamed Class", // Fallback to "Unnamed Class" if className is missing
    totalTask: classItem.totalTask || 0, // Ensure totalTask is set to 0 if not provided
    totalStudent: classItem.totalStudent || 0, // Ensure totalStudent is set to 0 if not provided
    status: classItem.status || "0", // Ensure status defaults to "0" if not provided
  }));
};

const classDetailSlice = createSlice({
  name: "classDetail",
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
      })
      // Enroll student to class by email
      .addCase(enrollStudentToClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollStudentToClass.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Cập nhật sinh viên sau khi enroll vào lớp
        // state.students = [...state.students, action.payload];
      })
      .addCase(enrollStudentToClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Lưu lỗi nếu có
      })
      // Delete student from class
      .addCase(deleteStudentFromClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudentFromClass.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Cập nhật danh sách sinh viên sau khi xóa sinh viên khỏi lớp
        // state.students = state.students.filter(
        //   (student) => student.id !== action.payload
        // );
      })
      .addCase(deleteStudentFromClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Lưu lỗi nếu có
      })
      // Import student to class from CSV file
      .addCase(importStudentToClass.pending, (state) => {
        state.loading = true; // Đặt trạng thái loading khi bắt đầu import
        // state.error = null; // Reset lỗi
      })
      .addCase(importStudentToClass.fulfilled, (state, action) => {
        state.loading = false; // Dừng loading khi import xong
        // state.error = null; // Reset lỗi
        // Cập nhật danh sách sinh viên mới sau khi import thành công
        // state.students = [...state.students, ...action.payload];
      })
      .addCase(importStudentToClass.rejected, (state, action) => {
        state.loading = false; // Dừng loading khi có lỗi
        state.error = action.error.message; // Lưu thông báo lỗi
      })

      // Add task to class by class id
      .addCase(addTaskToClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskToClass.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Cập nhật danh sách task sau khi thêm task vào lớp
        // state.tasks = [...state.tasks, action.payload];
      })
      .addCase(addTaskToClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Lưu thông báo lỗi
      })

      // Delete task from class by class id
      .addCase(deleteTaskFromClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskFromClass.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Cập nhật danh sách task sau khi xóa task khỏi lớp
        // state.tasks = state.tasks.filter(
        //   (task) => task.id !== action.meta.arg.workbookEssayTaskId
        // );
      })
      .addCase(deleteTaskFromClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Lưu thông báo lỗi
      });
  },
});
// Slice cho workbookTeacher
const workbookTeacher = createSlice({
  name: "workbookTeacher",
  initialState: {
    data: [], // Đây là nơi lưu trữ danh sách slide dữ liệu
    total: 0,
    loading: false,
    error: null,
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
    // Xử lý fetchTeacherWorkbooks
    builder
      .addCase(fetchTeacherWorkbooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherWorkbooks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = createWorkbookSlides(action.payload);
        console.log("Fetched workbooks:", action.payload);
      })
      .addCase(fetchTeacherWorkbooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Xử lý fetchTotalTeacherWorkbooks
      .addCase(fetchTotalTeacherWorkbooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalTeacherWorkbooks.fulfilled, (state, action) => {
        state.total = action.payload;
      })
      .addCase(fetchTotalTeacherWorkbooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Slide cho grammarCheck
const grammarCheckTeacher = createSlice({
  name: "grammarCheckTeacher",
  initialState: {
    data: [], // Đây là nơi lưu trữ danh sách slide feedback
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherGrammarCheck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherGrammarCheck.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTeacherGrammarCheck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// slide grade essay by ai
const gradeEssayTeacher = createSlice({
  name: "gradeEssayTeacher",
  initialState: {
    data: [], // Đây là nơi lưu trữ danh sách slide feedback
    loading: false,
    error: null,
  },
  reducers: {
    resetData: (state) => {
      state.data = []; // Reset data về trạng thái rỗng
      state.error = null; // Reset lỗi (nếu cần)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherGradeEssayByAi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherGradeEssayByAi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTeacherGradeEssayByAi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export action resetData
export const { resetData } = gradeEssayTeacher.actions;
// Hàm tạo slide cho workbook
export const createWorkbookSlides = (workbooks) => {
  return workbooks;
};

export const { addSlide, updateSlide, removeSlide } = workbookTeacher.actions;
export const workbookTeacherReducer = workbookTeacher.reducer;

export const { addClassSlide, updateClassSlide, removeClassSlide } =
  classTeacher.actions;
// Hàm tạo slide cho essaytask
export const createEssayTaskSlides = (essaytask) => {
  return essaytask;
};

// Hàm tạo slide cho feedback
export const createFeedbackSlides = (feedbacks) => {
  return feedbacks;
};

// Export các reducer actions và reducer để sử dụng

export const {
  addEssayTaskSlideSlide,
  updateEssayTaskSlideSlide,
  removeEssayTaskSlideSlide,
} = essayTaskTeacher.actions;
export const essayTaskTeacherReducer = essayTaskTeacher.reducer;

export const { addFeedbackSlide, updateFeedbackSlide, removeFeedbackSlide } =
  feedbackTeacher.actions;
export const feedbackTeacherReducer = feedbackTeacher.reducer;

export const { addCategory } = categoryTeacher.actions;
export const categoryTeacherReducer = categoryTeacher.reducer;
export const { addEssayGrade, resetEssayGrade } = essayGradeTeacher.actions;
export const essayGradeTeacherReducer = essayGradeTeacher.reducer;

export const { addMistake, resetMistakes } = mistakeTeacher.actions;
export const mistakeTeacherReducer = mistakeTeacher.reducer;
export const classTeacherReducer = classTeacher.reducer;
export const classDetailTeacherReducer = classDetailSlice.reducer;
export const grammarCheckTeacherReducer = grammarCheckTeacher.reducer;
export const gradeEssayTeacherReducer = gradeEssayTeacher.reducer;
