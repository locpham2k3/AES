import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  TextField,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteStudentFromClass,
  enrollStudentToClass,
  fetchListStudentByClassId,
  importStudentToClass,
} from "../../../redux/TeacherSlide";
import { toast } from "react-toastify";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EmailIcon from "@mui/icons-material/Email";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PeopleIcon from "@mui/icons-material/People";

const defaultAvatar = "../assets/Logo.ico";

const StudentListTeacher = ({ classId }) => {
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const dispatch = useDispatch();

  const {
    students = [],
    loadingDetail,
    error,
  } = useSelector((state) => state.classDetailTeacher || {});

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchListStudentByClassId({ tokens, classId }));
  }, [dispatch, classId]);

  const isValidEmail = (email) => {
    // Check if email is null, undefined, or an empty string
    if (!email || email.trim() === "") {
      return false;
    }

    // Regex to validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleOpenAddStudentDialog = () => setOpenAddStudentDialog(true);
  const handleCloseAddStudentDialog = () => setOpenAddStudentDialog(false);

  const handleAddStudent = async () => {
    if (!newStudentName || !isValidEmail(newStudentName)) return;

    setLoading(true);
    try {
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      const result = await dispatch(
        enrollStudentToClass({
          tokens,
          classId,
          emailStudent: newStudentName,
        })
      );
      // .unwrap()
      // .then((res) => res).catac;
      console.log(result);
      if (result.error) {
        toast.error(`Email student not found: ${newStudentName}`);
        console.error("Error adding student:", result.payload.message);
      } else {
        setNewStudentName("");
        toast.success("Add student successfully!");
        handleCloseAddStudentDialog();
      }
      dispatch(fetchListStudentByClassId({ tokens, classId }));
    } catch (error) {
      toast.error(
        `Error adding student: ${error.message || "Something went wrong"}`
      );
      console.error("Error adding student:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenImportDialog = () => setOpenImportDialog(true);
  const handleCloseImportDialog = () => setOpenImportDialog(false);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop,
  });

  const handleUploadCSV = async () => {
    if (!file) {
      console.log("No file selected.");
      return;
    }

    setLoading(true);
    try {
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };
      await dispatch(importStudentToClass({ tokens, classId, file: file }));
      setLoading(false);
      handleCloseImportDialog();
      dispatch(fetchListStudentByClassId({ tokens, classId }));
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      const result = await dispatch(
        deleteStudentFromClass({ tokens, classId, studentId })
      );

      if (result.error) {
        toast.error(
          `Error: ${result.payload.message || "Something went wrong"}`
        );
      } else {
        toast.success("Student removed successfully!");
        dispatch(fetchListStudentByClassId({ tokens, classId }));
      }
    } catch (error) {
      toast.error(
        `Error removing student: ${error.message || "Something went wrong"}`
      );
      console.error("Error removing student:", error);
    }
  };

  const handleOpenConfirmDialog = (student) => {
    setSelectedStudent(student);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedStudent(null);
  };

  const handleConfirmRemove = async () => {
    if (selectedStudent) {
      console.log("Removing student:", selectedStudent);
      await handleRemoveStudent(selectedStudent.studentId);
      handleCloseConfirmDialog();
    }
  };

  if (loadingDetail) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">Error loading data: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, maxWidth: "90%", mx: "auto" }}>
      {/* Enhanced Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -10,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(26,35,126,0.2) 0%, rgba(26,35,126,0.4) 50%, rgba(26,35,126,0.2) 100%)",
          },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1a237e, #3949ab)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
              mb: 1,
            }}
          >
            List of Students
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PeopleIcon sx={{ fontSize: 16 }} />
            {students?.length || 0} students in this class
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "50%",
              left: -20,
              width: "1px",
              height: "30px",
              transform: "translateY(-50%)",
              background:
                "linear-gradient(to bottom, rgba(26,35,126,0.1), rgba(26,35,126,0.3), rgba(26,35,126,0.1))",
            },
          }}
        >
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenAddStudentDialog}
            sx={{
              background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
              borderRadius: "50px",
              textTransform: "none",
              padding: "6px 20px",
              boxShadow: "0 3px 15px rgba(26, 35, 126, 0.2)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 5px 20px rgba(26, 35, 126, 0.4)",
                transition: "all 0.3s",
              },
            }}
          >
            Add Student
          </Button>

          {/* <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={handleOpenImportDialog}
            sx={{
              borderColor: "#1a237e",
              color: "#1a237e",
              borderRadius: "50px",
              textTransform: "none",
              padding: "6px 20px",
              borderWidth: "1.5px",
              "&:hover": {
                borderColor: "#3949ab",
                background: "rgba(26, 35, 126, 0.04)",
                transform: "translateY(-2px)",
                transition: "all 0.3s",
              },
            }}
          >
            Import CSV
          </Button> */}
        </Box>
      </Box>

      {/* Enhanced Students List Section */}
      {students && students.length > 0 ? (
        <Box
          sx={{
            maxHeight: "calc(100vh - 400px)",
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
              "&:hover": {
                background: "linear-gradient(45deg, #3949ab, #1a237e)",
              },
            },
          }}
        >
          {students.map((student, index) => (
            <Box
              key={index}
              sx={{
                mb: 1,
                p: 2,
                borderRadius: "12px",
                background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "4px",
                  height: "100%",
                  background: "linear-gradient(to bottom, #1a237e, #3949ab)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
                  "&::before": {
                    opacity: 1,
                  },
                },
              }}
            >
              <Avatar
                src={student.avatarUrl || defaultAvatar}
                alt={student.studentName}
                sx={{
                  width: 50,
                  height: 50,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "3px solid white",
                }}
              />
              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#1a237e",
                    mb: 0.5,
                    fontSize: "0.9rem",
                  }}
                >
                  {student.studentName}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "& svg": {
                      color: "#3949ab",
                    },
                    fontSize: "0.8rem",
                  }}
                >
                  <EmailIcon sx={{ fontSize: 16 }} />
                  {student.studentEmail || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label="Student"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(26, 35, 126, 0.1)",
                    color: "#1a237e",
                    fontWeight: 600,
                    borderRadius: "12px",
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
                <IconButton
                  onClick={() => handleOpenConfirmDialog(student)}
                  sx={{
                    color: "#d32f2f",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.04)",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
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
          <PersonOffIcon
            sx={{
              fontSize: 64,
              color: "#1a237e",
              opacity: 0.5,
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#1a237e",
              fontWeight: 600,
              opacity: 0.7,
            }}
          >
            No students available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start by adding students to your class
          </Typography>
        </Box>
      )}

      {/* Enhanced Dialogs - Add Student */}
      <Dialog
        open={openAddStudentDialog}
        onClose={handleCloseAddStudentDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            background: "linear-gradient(145deg, #ffffff, #fafafa)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontWeight: 700,
            color: "#1a237e",
          }}
        >
          Add New Student
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email of Student"
            type="email"
            fullWidth
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            error={!isValidEmail(newStudentName) && newStudentName.length > 0}
            helperText={
              !isValidEmail(newStudentName) && newStudentName.length > 0
                ? "Invalid email format"
                : ""
            }
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseAddStudentDialog}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddStudent}
            disabled={loading || !isValidEmail(newStudentName)}
            sx={{
              background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
              color: "white",
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              "&:disabled": {
                background: "#ccc",
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Add Student"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Dialogs - Import CSV */}
      <Dialog
        open={openImportDialog}
        onClose={handleCloseImportDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            background: "linear-gradient(145deg, #ffffff, #fafafa)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontWeight: 700,
            color: "#1a237e",
          }}
        >
          Import CSV File
        </DialogTitle>
        <DialogContent>
          <Box
            {...getRootProps()}
            sx={{
              p: 4,
              border: "2px dashed #ccc",
              borderRadius: 2,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                borderColor: "#1a237e",
                backgroundColor: "rgba(26, 35, 126, 0.04)",
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: "#1a237e", mb: 2 }} />
            {file ? (
              <Typography sx={{ color: "#1a237e", fontWeight: 600 }}>
                {file.name}
              </Typography>
            ) : (
              <Typography>
                Drag and drop a CSV file here, or click to select
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClearFile}
              disabled={!file}
              startIcon={<DeleteIcon />}
              sx={{
                borderColor: "#d32f2f",
                color: "#d32f2f",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#b71c1c",
                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                },
              }}
            >
              Clear File
            </Button>
            <Button
              variant="contained"
              onClick={handleUploadCSV}
              disabled={!file || loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <UploadIcon />
              }
              sx={{
                background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
                textTransform: "none",
                "&:disabled": {
                  background: "#ccc",
                },
              }}
            >
              Upload
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Enhanced Dialogs - Confirm Remove */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            background: "linear-gradient(145deg, #ffffff, #fafafa)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontWeight: 700,
            color: "#d32f2f",
          }}
        >
          Confirm Remove Student
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove{" "}
            <strong>{selectedStudent?.studentName}</strong> from this class?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseConfirmDialog}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            sx={{
              backgroundColor: "#d32f2f",
              color: "white",
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentListTeacher;
