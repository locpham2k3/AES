import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Button,
  Modal,
  CircularProgress,
  Alert,
  Autocomplete,
  TextField as MuiTextField,
  TextField,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskToClass,
  deleteTaskFromClass,
  fetchListTaskByClassId,
  fetchTeacherEssayTask,
} from "../../../redux/TeacherSlide";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import TodayIcon from "@mui/icons-material/Today";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SchoolIcon from "@mui/icons-material/School";
import SpeedIcon from "@mui/icons-material/Speed";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import WarningIcon from "@mui/icons-material/Warning";

const TaskListTeacher = ({ classId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [dueDate, setDueDate] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const profile = useSelector((state) => state.auth.user);
  const TeacherID = profile?.profile.TeacherID;

  console.log("TeacherID", TeacherID);
  // Redux state for tasks and essay tasks
  const {
    tasks = [],
    loading,
    error,
  } = useSelector((state) => state.classDetailTeacher || {});
  const {
    data: essayTaskData,
    loading: essayTaskLoading,
    error: essayTaskError,
  } = useSelector((state) => state.essayTaskTeacher);

  // Add new states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch tasks for the class
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchListTaskByClassId({ tokens, classId }));
  }, [dispatch, classId]);

  // Fetch essay tasks for the teacher
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const condition = {
      offset: 0,
      limit: 1000,
      direction: "asc",
      sortBy: "ID",
    };
    dispatch(fetchTeacherEssayTask({ tokens, condition, check: 1 }));
  }, [dispatch]);

  // Open modal
  const handleOpenModal = () => setOpenModal(true);

  // Close modal
  const handleCloseModal = () => {
    setSelectedTask(null); // Reset selected task when closing
    setOpenModal(false);
  };

  const handleAddTask = () => {
    if (!selectedTask || !dueDate) return;

    // Chuyển đổi dueDate từ 'YYYY-MM-DD' thành 'DD/MM/YYYY'
    const formattedDueDate = format(new Date(dueDate), "dd/MM/yyyy");

    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    const body = {
      classId,
      workbookEssayTaskId: selectedTask.workbookEssayTaskId,
      dueDate: formattedDueDate, // Gửi dueDate đã được format
    };

    dispatch(addTaskToClass({ tokens, teacherId: TeacherID, body }))
      .then((response) => {
        toast.success("Task added successfully!"); // Success toast
        // Lấy lại danh sách task sau khi thêm thành công
        dispatch(fetchListTaskByClassId({ tokens, classId }));
        handleCloseModal(); // Đóng modal sau khi thêm task thành công
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`); // Error toast
      });
  };

  // Error state
  if (loading || essayTaskLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || essayTaskError) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">
          Error loading data: {error?.message || essayTaskError?.message}
        </Alert>
      </Box>
    );
  }

  // Lọc task đã có khỏi danh sách các task có sẵn
  const availableEssayTasks = essayTaskData?.filter(
    (task) =>
      !tasks.some(
        (assignedTask) =>
          assignedTask.workbookEssayTaskId === task.workbookEssayTaskId
      )
  );

  // Handle navigation to another component
  const handleTaskClick = (classId) => {
    // console.log("Navigate to task details page", classId);
    navigate(`/teacher/detail-task/${classId}`); // Navigate to the task details page
  };

  // Add new handlers for delete
  const handleDeleteClick = (event, task) => {
    event.stopPropagation();
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setTaskToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    setDeleteLoading(true);
    try {
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      // TODO: Add your delete API call here
      await dispatch(
        deleteTaskFromClass({
          tokens,
          classId,
          teacherId: TeacherID,
          workbookEssayTaskId: taskToDelete.workbookEssayTaskId,
        })
      );

      toast.success("Task deleted successfully!");
      // Refresh task list
      dispatch(fetchListTaskByClassId({ tokens, classId }));
    } catch (error) {
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Stats Cards Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        {/* Total Tasks Card */}
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxShadow: "0 4px 20px rgba(26, 35, 126, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 25px rgba(26, 35, 126, 0.3)",
            },
          }}
        >
          <AssignmentIcon sx={{ fontSize: 40, opacity: 0.9 }} />
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ fontSize: "1.25rem" }}
            >
              {tasks?.length || 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{ opacity: 0.9, fontSize: "0.75rem" }}
            >
              Total Tasks
            </Typography>
          </Box>
        </Box>

        {/* Active Tasks Card */}
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            background: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxShadow: "0 4px 20px rgba(46, 125, 50, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 25px rgba(46, 125, 50, 0.3)",
            },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.9 }} />
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ fontSize: "1.25rem" }}
            >
              {tasks?.filter((t) => t.isExpired !== "1").length || 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{ opacity: 0.9, fontSize: "0.75rem" }}
            >
              Active Tasks
            </Typography>
          </Box>
        </Box>

        {/* Expired Tasks Card */}
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            background: "linear-gradient(135deg, #c62828 0%, #ef5350 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxShadow: "0 4px 20px rgba(198, 40, 40, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 25px rgba(198, 40, 40, 0.3)",
            },
          }}
        >
          <ErrorIcon sx={{ fontSize: 40, opacity: 0.9 }} />
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ fontSize: "1.25rem" }}
            >
              {tasks?.filter((t) => t.isExpired === "1").length || 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{ opacity: 0.9, fontSize: "0.75rem" }}
            >
              Expired Tasks
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tasks Section Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -10,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #1a237e 0%, transparent 100%)",
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#1a237e",
            fontSize: "1rem",
          }}
        >
          Task List
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{
            background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
            borderRadius: "50px",
            textTransform: "none",
            padding: "6px 16px",
            boxShadow: "0 3px 15px rgba(26, 35, 126, 0.2)",
            fontWeight: 600,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 5px 20px rgba(26, 35, 126, 0.4)",
              transition: "all 0.3s",
            },
          }}
        >
          Create New Task
        </Button>
      </Box>

      {/* Task List */}
      {tasks.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
            maxHeight: "calc(100vh - 500px)",
            overflowY: "auto",
            pr: 2,
            mr: -2,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "linear-gradient(45deg, #1a237e, #3949ab)",
              borderRadius: "10px",
            },
          }}
        >
          {tasks.map((task) => (
            <Box
              key={task.workbookEssayTaskId}
              onClick={() => handleTaskClick(classId)}
              sx={{
                borderRadius: "10px",
                background: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  "& .delete-button": {
                    opacity: 1,
                    visibility: "visible",
                  },
                },
              }}
            >
              {/* Add Delete Button */}
              <Tooltip title="Delete Task" placement="top">
                <IconButton
                  className="delete-button"
                  onClick={(e) => handleDeleteClick(e, task)}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    opacity: 0,
                    visibility: "hidden",
                    transition: "all 0.2s ease",
                    zIndex: 1,
                    "&:hover": {
                      backgroundColor: "#ffebee",
                      color: "#d32f2f",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Status Bar */}
              <Box
                sx={{
                  height: "4px",
                  background:
                    task.isExpired === "1"
                      ? "linear-gradient(to right, #c62828, #ef5350)"
                      : "linear-gradient(to right, #1a237e, #3949ab)",
                }}
              />

              <Box
                sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
              >
                {/* Task Header */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1a237e",
                      mb: 1,
                      fontSize: "0.875rem",
                    }}
                  >
                    {task.taskName}
                  </Typography>
                  <Chip
                    icon={
                      task.isExpired === "1" ? (
                        <TimerIcon />
                      ) : (
                        <CheckCircleIcon />
                      )
                    }
                    label={task.isExpired === "1" ? "Expired" : "Active"}
                    size="small"
                    sx={{
                      backgroundColor:
                        task.isExpired === "1"
                          ? alpha("#ef5350", 0.1)
                          : alpha("#4caf50", 0.1),
                      color: task.isExpired === "1" ? "#ef5350" : "#4caf50",
                      fontWeight: 500,
                      "& .MuiChip-icon": {
                        color: "inherit",
                      },
                    }}
                  />
                </Box>

                {/* Task Info */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    <SpeedIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2">
                      Word Limit: <strong>{task.wordCountLimit}</strong>
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    <CalendarTodayIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2">
                      Due: <strong>{task.dueDate}</strong>
                    </Typography>
                  </Box>
                </Box>

                {/* Progress Indicator */}
                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SchoolIcon sx={{ color: "#1a237e", fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, fontSize: "0.75rem" }}
                  >
                    Assigned: {task.assignedDate}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
            borderRadius: "20px",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <AssignmentIcon
            sx={{
              fontSize: 64,
              color: "#1a237e",
              opacity: 0.5,
              mb: 2,
            }}
          />
          <Typography variant="h6" sx={{ color: "#1a237e", opacity: 0.7 }}>
            No tasks available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Create your first task to get started
          </Typography>
        </Box>
      )}

      {/* Enhanced Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 800,
            bgcolor: "white",
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            p: 4,
            background: "linear-gradient(145deg, #ffffff, #fafafa)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#1a237e",
            }}
          >
            Add New Task
          </Typography>

          <Autocomplete
            value={selectedTask}
            onChange={(event, newValue) => setSelectedTask(newValue)}
            options={availableEssayTasks}
            getOptionLabel={(option) => option.taskName}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Task"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#3949ab",
                    },
                  },
                }}
                error={!selectedTask} // Bắt lỗi nếu selectedTask trống hoặc chỉ chứa khoảng trắng
                helperText={
                  !selectedTask ? "Task is required" : "" // Thông báo lỗi nếu không có selectedTask
                }
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": {
                    backgroundColor: "rgba(26, 35, 126, 0.04)",
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "#1a237e",
                    }}
                  >
                    {option.taskName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {option.taskPlainContent}
                  </Typography>
                </Box>
              </Box>
            )}
          />

          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            sx={{
              mt: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: today, // Ngày tối thiểu
            }}
            error={!dueDate} // Bắt lỗi nếu dueDate trống
            helperText={!dueDate ? "Due date is required" : ""} // Thông báo lỗi nếu dueDate trống
          />

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              onClick={handleCloseModal}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddTask}
              sx={{
                background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 4,
              }}
              disabled={!selectedTask || !dueDate}
            >
              Add Task
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            background: "linear-gradient(145deg, #ffffff, #fafafa)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#d32f2f",
          }}
        >
          <WarningIcon color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task "{taskToDelete?.taskName}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Delete Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskListTeacher;
