import React from "react";
import {
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Alert,
  List,
  ListItem,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { fetchListStudentByClassId } from "../../../redux/StudentSlide";
import { useDispatch, useSelector } from "react-redux";
import { PersonOutline as PersonIcon } from "@mui/icons-material";

const defaultAvatar = "../assets/Logo.ico";

const StudentList = ({ classId }) => {
  const dispatch = useDispatch();
  const {
    students = [],
    loading,
    error,
  } = useSelector((state) => state.classDetailTeacher || {});

  React.useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchListStudentByClassId({ tokens, classId }));
  }, [dispatch, classId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          Error loading data: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PersonIcon sx={{ color: "#1a237e" }} />
          Class Members
        </Typography>
        <Chip
          label={`${students.length} Students`}
          color="primary"
          size="small"
          sx={{
            fontWeight: 600,
            borderRadius: "8px",
          }}
        />
      </Box>

      {students && students.length > 0 ? (
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "10px",
              "&:hover": {
                background: "#666",
              },
            },
          }}
        >
          <List sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
            {students.map((student, index) => (
              <ListItem key={student.studentId || index} sx={{ p: 0 }}>
                <Card
                  sx={{
                    width: "100%",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      background:
                        "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
                      opacity: 0.7,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      p: "16px !important",
                    }}
                  >
                    <Avatar
                      src={student.avatarUrl || defaultAvatar}
                      alt={student.studentName}
                      sx={{
                        width: 50,
                        height: 50,
                        border: "2px solid #fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#1a237e",
                          mb: 0.5,
                        }}
                      >
                        {student.studentName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {student.studentEmail || "N/A"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            py: 8,
            px: 3,
            backgroundColor: "#f8f9fa",
            borderRadius: "16px",
            border: "2px dashed rgba(0,0,0,0.1)",
          }}
        >
          <PersonIcon
            sx={{
              fontSize: 60,
              color: "text.secondary",
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            No students in this class
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StudentList;
