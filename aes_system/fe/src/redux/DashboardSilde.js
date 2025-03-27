import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAverageScoreByTeacherService,
  getAverageScorePerClassStudentService,
  getAverageWrittingTimeOfStudentService,
  getDeadlineClassOfStudentService,
  getGradingEffectByTeacherService,
  getListClassAndDetailOfAdminService,
  getListTaskExpiryByTeacherService,
  getProcessOfStudentService,
  getTotalClassAndStudentByTeacherService,
  getTotalComplainOfAdminService,
  getTotalEssayTaskOfAdminService,
  getTotalUserOfAdminService,
  getWrittingPaperStatisticOfStudentService,
  getWrittingPerformanceOfStudentService,
} from "../services/DashboardService";

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
export const getTotalClassAndStudentByTeacher = createAsyncThunk(
  "dashboard/getTotalClassAndStudentByTeacher",
  async ({ tokens, teacherId }, thunkAPI) => {
    try {
      const response = await getTotalClassAndStudentByTeacherService(
        tokens,
        teacherId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// get list task expiry in class
export const getListTaskExpiryByTeacher = createAsyncThunk(
  "dashboard/getListTaskExpiryByTeacher",
  async ({ tokens, teacherId }, thunkAPI) => {
    try {
      const response = await getListTaskExpiryByTeacherService(
        tokens,
        teacherId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// get grading effect of teacher
export const getGradingEffectByTeacher = createAsyncThunk(
  "dashboard/getGradingEffectByTeacher",
  async ({ tokens, teacherId }, thunkAPI) => {
    try {
      const response = await getGradingEffectByTeacherService(
        tokens,
        teacherId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

// get average score of teacher
export const getAverageScoreByTeacher = createAsyncThunk(
  "dashboard/getAverageScoreByTeacher",
  async ({ tokens, teacherId, classId }, thunkAPI) => {
    try {
      const response = await getAverageScoreByTeacherService(
        tokens,
        teacherId,
        classId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

// slide for total class and student by teacherId
const totalClassAndStudenOfTeacherSlice = createSlice({
  name: "totalClassAndStudentOfteacher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTotalClassAndStudentByTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalClassAndStudentByTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTotalClassAndStudentByTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// slide for list task expiry in class
const listTaskExpiryOfTeacherSlice = createSlice({
  name: "listTaskExpiryOfTeacher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListTaskExpiryByTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListTaskExpiryByTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getListTaskExpiryByTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// slide for grading effect of teacher
const gradingEffectOfTeacherSlice = createSlice({
  name: "gradingEffectOfTeacher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGradingEffectByTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGradingEffectByTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getGradingEffectByTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// slide for average score of teacher
const averageScoreOfTeacherSlice = createSlice({
  name: "averageScoreOfTeacher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAverageScoreByTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAverageScoreByTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAverageScoreByTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const totalClassAndStudentReducer =
  totalClassAndStudenOfTeacherSlice.reducer;
export const listTaskExpiryReducer = listTaskExpiryOfTeacherSlice.reducer;
export const gradingEffectReducer = gradingEffectOfTeacherSlice.reducer;
export const averageScoreReducer = averageScoreOfTeacherSlice.reducer;

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
export const getAverageScoreByClassOfStudent = createAsyncThunk(
  "dashboard/getAverageScoreByClassOfStudent",
  async ({ tokens, studentId }, thunkAPI) => {
    try {
      const response = await getAverageScorePerClassStudentService(
        tokens,
        studentId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// get process of student
export const getProcessOfStudent = createAsyncThunk(
  "dashboard/getProcessOfStudent",
  async ({ tokens, studentId }, thunkAPI) => {
    try {
      const response = await getProcessOfStudentService(tokens, studentId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// get writting performance of student
export const getWrittingPerformanceOfStudent = createAsyncThunk(
  "dashboard/getWrittingPerformanceOfStudent",
  async ({ tokens, studentId }, thunkAPI) => {
    try {
      const response = await getWrittingPerformanceOfStudentService(
        tokens,
        studentId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

// get writting paper statistic of student
export const getWrittingPaperStatisticOfStudent = createAsyncThunk(
  "dashboard/getWrittingPaperStatisticOfStudent",
  async ({ tokens, studentId }, thunkAPI) => {
    try {
      const response = await getWrittingPaperStatisticOfStudentService(
        tokens,
        studentId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// get average writting time of student
export const getAverageWrittingTimeOfStudent = createAsyncThunk(
  "dashboard/getAverageWrittingTimeOfStudent",
  async ({ tokens, studentId }, thunkAPI) => {
    try {
      const response = await getAverageWrittingTimeOfStudentService(
        tokens,
        studentId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// get deeadline class of student
export const getDeadlineClassOfStudent = createAsyncThunk(
  "dashboard/getDeadlineClassOfStudent",
  async ({ tokens, studentId }, thunkAPI) => {
    try {
      const response = await getDeadlineClassOfStudentService(
        tokens,
        studentId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
//slide
const averageScorePerClassOfStudentSlice = createSlice({
  name: "averageScorePerClassOfStudent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAverageScoreByClassOfStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAverageScoreByClassOfStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAverageScoreByClassOfStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const processOfStudentSlice = createSlice({
  name: "processOfStudent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProcessOfStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProcessOfStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getProcessOfStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const writtingPerformanceOfStudentSlice = createSlice({
  name: "writtingPerformanceOfStudent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWrittingPerformanceOfStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWrittingPerformanceOfStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getWrittingPerformanceOfStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const writtingPaperStatisticOfStudentSlice = createSlice({
  name: "writtingPaperStatisticOfStudent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWrittingPaperStatisticOfStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getWrittingPaperStatisticOfStudent.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getWrittingPaperStatisticOfStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const averageWrittingTimeOfStudentSlice = createSlice({
  name: "averageWrittingTimeOfStudent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAverageWrittingTimeOfStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAverageWrittingTimeOfStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAverageWrittingTimeOfStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const deadlineClassOfStudentSlice = createSlice({
  name: "deadlineClassOfStudent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDeadlineClassOfStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeadlineClassOfStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getDeadlineClassOfStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const averageScorePerClassOfStudentReducer =
  averageScorePerClassOfStudentSlice.reducer;
export const processOfStudentReducer = processOfStudentSlice.reducer;
export const writtingPerformanceOfStudentReducer =
  writtingPerformanceOfStudentSlice.reducer;
export const writtingPaperStatisticOfStudentReducer =
  writtingPaperStatisticOfStudentSlice.reducer;
export const averageWrittingTimeOfStudentReducer =
  averageWrittingTimeOfStudentSlice.reducer;
export const deadlineClassOfStudentReducer =
  deadlineClassOfStudentSlice.reducer;

/*
....###....########..##.....##.####.##....##
...##.##...##.....##.###...###..##..###...##
..##...##..##.....##.####.####..##..####..##
.##.....##.##.....##.##.###.##..##..##.##.##
.#########.##.....##.##.....##..##..##..####
.##.....##.##.....##.##.....##..##..##...###
.##.....##.########..##.....##.####.##....##
*/

// get total user (student, teacher, referee)
export const getTotalUserOfAdmin = createAsyncThunk(
  "dashboard/getTotalUser",
  async ({ tokens }, thunkAPI) => {
    try {
      const response = await getTotalUserOfAdminService(tokens);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
// get list class and detail of class
export const getListClassOfAdmin = createAsyncThunk(
  "dashboard/getListClassOfAdmin",
  async ({ tokens }, thunkAPI) => {
    try {
      const response = await getListClassAndDetailOfAdminService(tokens);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);
//get total essaytask in system
export const getTotalEssayTaskOfAdmin = createAsyncThunk(
  "dashboard/getTotalEssayTaskOfAdmin",
  async ({ tokens }, thunkAPI) => {
    try {
      const response = await getTotalEssayTaskOfAdminService(tokens);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

// get total complain in system
export const getTotalComplainOfAdmin = createAsyncThunk(
  "dashboard/getTotalComplainOfAdmin",
  async ({ tokens }, thunkAPI) => {
    try {
      const response = await getTotalComplainOfAdminService(tokens);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

// slide
const totalUserOfAdminSlice = createSlice({
  name: "totalUserOfAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTotalUserOfAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalUserOfAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTotalUserOfAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const listClassOfAdminSlice = createSlice({
  name: "listClassOfAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListClassOfAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListClassOfAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getListClassOfAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const totalEssayTaskOfAdminSlice = createSlice({
  name: "totalEssayTaskOfAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTotalEssayTaskOfAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalEssayTaskOfAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTotalEssayTaskOfAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const totalComplainOfAdminSlice = createSlice({
  name: "totalComplainOfAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTotalComplainOfAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalComplainOfAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTotalComplainOfAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const totalUserOfAdminReducer = totalUserOfAdminSlice.reducer;
export const listClassOfAdminReducer = listClassOfAdminSlice.reducer;
export const totalEssayTaskOfAdminReducer = totalEssayTaskOfAdminSlice.reducer;
export const totalComplainOfAdminReducer = totalComplainOfAdminSlice.reducer;
