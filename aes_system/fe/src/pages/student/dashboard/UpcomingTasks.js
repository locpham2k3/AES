// UpcomingTasks.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  format,
  parseISO,
  differenceInDays,
  isBefore,
  addDays,
} from "date-fns";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { getDeadlineClassOfStudent } from "../../../redux/DashboardSilde";

// Reusable TaskItem component within the same file
const TaskItem = ({ task }) => {
  // Utility function to determine chip color based on urgency
  const getChipColor = (dueDate) => {
    const today = new Date();
    const due = parseISO(dueDate);
    const daysLeft = differenceInDays(due, today);

    if (daysLeft <= 3) {
      return "error"; // Red for urgent tasks
    } else if (daysLeft <= 7) {
      return "warning"; // Orange for upcoming tasks
    } else {
      return "default"; // Default color
    }
  };

  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <Avatar sx={{ bgcolor: "#2196f3", marginRight: 2 }}>
          <AssignmentIcon />
        </Avatar>
        <ListItemText
          primary={
            <Typography variant="subtitle1" color="#1a237e">
              {task.taskName}
            </Typography>
          }
          secondary={
            <>
              <Typography variant="body2" color="textPrimary">
                {task.taskPlainContent}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={`Due: ${format(parseISO(task.dueDate), "MM/dd/yyyy")}`}
                  size="small"
                  color={getChipColor(task.dueDate)}
                  sx={{ marginRight: 1 }}
                />
                <Chip
                  label={`Assigned: ${format(
                    parseISO(task.assignmentDate),
                    "MM/dd/yyyy"
                  )}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </>
          }
        />
      </ListItem>
      <Divider component="li" />
    </React.Fragment>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    taskName: PropTypes.string.isRequired,
    taskPlainContent: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    assignmentDate: PropTypes.string.isRequired,
  }).isRequired,
};

const UpcomingTasks = ({ tokens, studentId }) => {
  const dispatch = useDispatch();

  // Access data from Redux store
  const {
    data: deadlineData,
    loading: deadlineLoading,
    error: deadlineError,
  } = useSelector((state) => state.deadlineClassOfStudent); // Ensure correct slice name

  // Fetch data when component mounts or when tokens/studentId change
  useEffect(() => {
    if (tokens && studentId) {
      dispatch(getDeadlineClassOfStudent({ tokens, studentId }));
    }
  }, [dispatch, tokens, studentId]);

  // Filter tasks that are due within the next 7 days
  const upcomingDeadlineData = useMemo(() => {
    if (!deadlineData || !Array.isArray(deadlineData)) return [];

    const today = new Date();
    const sevenDaysFromNow = addDays(today, 7);

    // Iterate over classes and filter tasks
    return deadlineData
      .map((classItem) => {
        const upcomingTasks = classItem.taskInfomationDTO.filter((task) => {
          const dueDate = parseISO(task.dueDate);
          return (
            isBefore(today, dueDate) &&
            (isBefore(dueDate, sevenDaysFromNow) ||
              differenceInDays(dueDate, today) === 7)
          );
        });

        if (upcomingTasks.length === 0) return null;

        return {
          className: classItem.className,
          tasks: upcomingTasks,
        };
      })
      .filter((item) => item !== null);
  }, [deadlineData]);

  // Handle loading state
  const isLoading = deadlineLoading;

  // Handle error state
  const error = deadlineError;

  // Handle no data state
  const hasNoData = upcomingDeadlineData.length === 0;

  return (
    <Box
      p={3}
      bgcolor="#f9f9f9"
      borderRadius={2}
      boxShadow="0 2px 12px rgba(0,0,0,0.1)"
      minHeight="60vh"
    >
      <Typography variant="h5" gutterBottom align="center" color="#1a237e">
        Upcoming Deadlines
      </Typography>

      {/* Loading State */}
      {isLoading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={32} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {/* No Data State */}
      {hasNoData && !isLoading && !error && (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" color="textSecondary">
            No upcoming deadlines within the next 7 days.
          </Typography>
        </Box>
      )}

      {/* Main Content */}
      {!isLoading && !error && !hasNoData && (
        <Grid container spacing={3}>
          {upcomingDeadlineData.map((classItem, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <AssignmentIcon color="primary" sx={{ marginRight: 1 }} />
                  <Typography variant="h6" color="#1a237e">
                    {classItem.className}
                  </Typography>
                </Box>
                <List>
                  {classItem.tasks.map((task, idx) => (
                    <TaskItem task={task} key={idx} />
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

// Define PropTypes for component props validation
UpcomingTasks.propTypes = {
  tokens: PropTypes.shape({
    accessToken: PropTypes.string.isRequired,
    refreshToken: PropTypes.string.isRequired,
  }).isRequired,
  studentId: PropTypes.string.isRequired,
};

export default UpcomingTasks;
