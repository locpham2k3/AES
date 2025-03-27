import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import { deleteClass, fetchListClass } from "../../../redux/TeacherSlide.js";
import CreateClass from "./CreateClass.js";
import GroupIcon from "@mui/icons-material/Group";
import TaskIcon from "@mui/icons-material/Task";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon for completed class status
import PendingIcon from "@mui/icons-material/Pending"; // Icon for pending class status
import EditIcon from "@mui/icons-material/Edit"; // Icon for edit
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Icon for more options
import { useNavigate } from "react-router-dom";
import UpdateClass from "./UpdateClass.js";
import { toast } from "react-toastify";
import { GridDeleteIcon } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";

// Thêm custom theme constants
const THEME = {
  colors: {
    primary: {
      main: "#1976D2",
      light: "#64B5F6",
      dark: "#1565C0",
      gradient: "linear-gradient(135deg, #1976D2 0%, #64B5F6 100%)",
      hover: "linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)",
    },
    status: {
      active: "#4CAF50",
      inactive: "#FFA726",
    },
  },
  transitions: {
    quick: "all 0.3s ease-in-out",
  },
};

const ListClassTeacher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error, erorrMessage } = useSelector(
    (state) => state.classTeacher
  );
  const profile = useSelector((state) => state.auth.user);
  const TeacherID = profile?.profile.TeacherID;

  const [openAddClassDialog, setOpenAddClassDialog] = useState(false);
  const [openEditClassDialog, setOpenEditClassDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchListClass({ tokens, teacherId: TeacherID }));
  }, [dispatch, TeacherID]);

  const handleClassClick = (classId, classItem, e) => {
    if (e.target.closest(".menu-button") || e.target.closest(".MuiMenu-root")) {
      return;
    }
    navigate(`/teacher/list-class/detail-class/${classId}`, {
      state: { classItem },
    });
  };

  const openMenu = (event, classItem) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setEditingClass(classItem);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditClass = () => {
    setOpenEditClassDialog(true);
    setAnchorEl(null);
  };

  const handleDeleteClass = () => {
    setOpenDeleteDialog(true);
    setDeletingClass(editingClass);
    setAnchorEl(null);
  };

  const handleDeleteConfirm = () => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    dispatch(
      deleteClass({
        tokens,
        classId: deletingClass.id,
        teacherId: TeacherID,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Class deleted successfully!");
        setOpenDeleteDialog(false);
        dispatch(
          fetchListClass({
            tokens,
            teacherId: TeacherID,
          })
        );
      })
      .catch((error) => {
        toast.error(`Error deleting class: ${error.message}`);
      });
  };

  const handleUpdateClass = () => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    dispatch(
      fetchListClass({
        tokens,
        teacherId: TeacherID,
      })
    );
    setOpenEditClassDialog(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={2}>
        <Typography variant="h6" color="error">
          An error occurred: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Enhanced Header Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: THEME.colors.primary.main,
              mb: 0.5,
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            My Classes
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
            }}
          >
            Manage and organize your teaching classes
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpenAddClassDialog(true)}
          sx={{
            borderRadius: "20px",
            boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
            px: 1,
            py: 1,
            background: THEME.colors.primary.gradient,
            transition: THEME.transitions.quick,
            "&:hover": {
              background: THEME.colors.primary.hover,
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
            },
          }}
          startIcon={<AddCircleIcon />}
        >
          Create New Class
        </Button>
      </Box>
      {/* Enhanced Class List */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          overflowX: "hidden",
          pr: 1,
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(180deg, #1976D2 0%, #64B5F6 100%)",
            borderRadius: "10px",
            border: "2px solid #f1f1f1",
            "&:hover": {
              background: THEME.colors.primary.hover,
            },
          },
        }}
      >
        <Grid container spacing={2}>
          {data.map((classItem) => (
            <Grid item xs={12} sm={5} md={3} key={classItem.id}>
              <Card
                sx={{
                  boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                  borderRadius: "20px",
                  transition: THEME.transitions.quick,
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                  },
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  bgcolor: "white",
                }}
                onClick={(e) => handleClassClick(classItem.id, classItem, e)}
              >
                <Box
                  sx={{
                    background: THEME.colors.primary.gradient,
                    p: 1,
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "white",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                      mb: 1,
                    }}
                  >
                    {classItem.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {classItem.status === "0" ? (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                        label="Active"
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          "& .MuiChip-icon": { color: "#4CAF50" },
                        }}
                      />
                    ) : (
                      <Chip
                        icon={<PendingIcon sx={{ fontSize: 16 }} />}
                        label="Inactive"
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          "& .MuiChip-icon": { color: "#FFA726" },
                        }}
                      />
                    )}
                  </Box>
                  <IconButton
                    className="menu-button"
                    onClick={(e) => openMenu(e, classItem)}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: "white",
                      zIndex: 2,
                      "&:hover": {
                        background: "rgba(255,255,255,0.2)",
                      },
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1,
                          bgcolor: "rgba(25, 118, 210, 0.05)",
                          borderRadius: 2,
                        }}
                      >
                        <TaskIcon
                          sx={{ mr: 1, color: THEME.colors.primary.main }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                          >
                            {classItem.totalTask}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tasks
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1.5,
                          bgcolor: "rgba(25, 118, 210, 0.05)",
                          borderRadius: 2,
                        }}
                      >
                        <GroupIcon
                          sx={{ mr: 1, color: THEME.colors.primary.main }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                          >
                            {classItem.totalStudent}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Students
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Enhanced Dialogs */}
      <Dialog
        open={openAddClassDialog}
        onClose={() => setOpenAddClassDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            m: 1,
            position: "relative",
            overflow: "hidden",
            "& .MuiDialogTitle-root": {
              background: THEME.colors.primary.gradient,
              color: "white",
              py: 1,
            },
            "& .MuiDialogContent-root": {
              p: 2,
            },
            "& .MuiDialogActions-root": {
              px: 2,
              py: 1,
              borderTop: "1px solid rgba(0,0,0,0.1)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
              Create New Class
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 0.5, opacity: 0.8 }}>
              Fill in the details to create a new class
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenAddClassDialog(false)}
            sx={{
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: "24px !important" }}>
          <CreateClass
            teacherId={TeacherID}
            onClose={() => setOpenAddClassDialog(false)}
          />
        </DialogContent>
      </Dialog>
      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            minWidth: "150px",
          },
        }}
      >
        <MenuItem
          onClick={handleEditClass}
          sx={{
            py: 1.5,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.08)",
            },
          }}
        >
          <EditIcon sx={{ fontSize: 20 }} />
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClass}
          sx={{
            py: 1.5,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: "error.main",
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.08)",
            },
          }}
        >
          <GridDeleteIcon sx={{ fontSize: 20 }} />
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
      {/* Edit Class Dialog */}
      <Dialog
        open={openEditClassDialog}
        onClose={() => setOpenEditClassDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Class</DialogTitle>
        <DialogContent>
          <UpdateClass
            classItem={editingClass}
            onUpdate={handleUpdateClass}
            onClose={() => setOpenEditClassDialog(false)}
          />
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Class</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the class "{deletingClass?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>{" "}
    </Box>
  );
};

export default ListClassTeacher;
