import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CircularProgress,
  Alert,
  Grid,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchRefereeComplains } from "../../redux/RefereeSlide";
import StudentEssayModal from "./StudentEssayModal";

const Referee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { complains, loading, error } = useSelector((state) => state.referee);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 15;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleViewClick = (task) => {
    setSelectedTask(task); // Store the clicked task
    setModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setModalOpen(false); // Close the modal
    setSelectedTask(null); // Clear the selected task
  };

  // Fetch complains when component mounts or page changes
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    // Điều kiện fetch data
    const condition = {
      offset: (currentPage - 1) * tasksPerPage, // Tính offset dựa trên trang hiện tại
      limit: tasksPerPage,
    };
    console.log("rfe: ", condition);

    dispatch(fetchRefereeComplains({ tokens, condition }));
  }, [dispatch, currentPage, tasksPerPage]);

  // Render loading state
  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "300px" }}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" style={{ marginLeft: "10px" }}>
          Loading...
        </Typography>
      </Grid>
    );
  }

  // Render error state
  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Alert severity="error">
          <Typography variant="h6">Error: {error}</Typography>
        </Alert>
      </Grid>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Referee Complaints
      </Typography>
      {/* Render bảng dữ liệu */}
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Edit Date</TableCell>
              <TableCell>Report Message</TableCell>
              <TableCell>Reply Message</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Response Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complains.map((task) => (
              <TableRow key={task.id} hover style={{ cursor: "pointer" }}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.createDate || "N/A"}</TableCell>
                <TableCell>{task.editDate || "N/A"}</TableCell>
                <TableCell>{task.reportMessage || "N/A"}</TableCell>
                <TableCell>{task.replyMessage || "N/A"}</TableCell>
                <TableCell>{task.studentId || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={task.status === "0" ? "Unresolved" : "Resolved"}
                    color={task.status === "0" ? "warning" : "success"}
                  />
                </TableCell>
                <TableCell>{task.responseDate || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewClick(task)} // Pass the task to the handler
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <Box display="flex" justifyContent="center" marginTop="20px">
        {Array.from(
          { length: Math.ceil(complains.length / tasksPerPage) },
          (_, i) => i + 1
        ).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "contained" : "outlined"}
            color="primary"
            onClick={() => setCurrentPage(page)}
            sx={{ margin: "0 5px" }}
          >
            {page}
          </Button>
        ))}
      </Box>
      {modalOpen && (
        <StudentEssayModal
          open={modalOpen}
          onClose={handleModalClose}
          evaluationAssigningId={selectedTask?.evaluationAssigningId}
          studentID={selectedTask?.studentId}
          id={selectedTask?.id}
          status={selectedTask?.status}
        />
      )}
    </div>
  );
};

export default Referee;
