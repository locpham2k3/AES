import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Tab,
  Tabs,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import StudentListTeacher from "./StudentListTeacher";
import TaskListTeacher from "./TaskListTeacher";
import ListEssayGrade from "./ListEssayGrade";

const ManageClass = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const classItem = location.state?.classItem;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8faff",
        backgroundImage: "linear-gradient(to bottom right, #f8faff, #f0f4ff)",
        overflow: "hidden",
      }}
    >
      {/* Fixed Header Section */}
      <Box
        sx={{
          padding: { xs: 2, md: 3 },
          paddingBottom: 1,
          flexShrink: 0,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 1,
            borderRadius: 2,
            textTransform: "none",
            background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
            boxShadow: "0 2px 10px rgba(26, 35, 126, 0.2)",
            padding: "6px 16px",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 3px 15px rgba(26, 35, 126, 0.4)",
              transition: "all 0.3s",
            },
          }}
          onClick={() => navigate("/teacher/list-class/")}
        >
          Back to list
        </Button>

        {classItem && (
          <Card
            sx={{
              mb: 2,
              borderRadius: 4,
              background: "linear-gradient(to right, #ffffff, #fafafa)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ padding: "16px !important" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  fontSize: "1rem",
                  background: "linear-gradient(45deg, #1a237e, #3949ab)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {classItem.name}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      justifyContent: "flex-start",
                    }}
                  >
                    {/* Student Stats */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "rgba(26, 35, 126, 0.04)",
                        padding: "12px 20px",
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(26, 35, 126, 0.08)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <PeopleIcon
                        sx={{
                          color: "#1a237e",
                          fontSize: 32,
                          marginRight: 1.5,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            color: "#1a237e",
                            lineHeight: 1,
                            fontSize: "0.8rem",
                          }}
                        >
                          {classItem.totalStudent}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 400,
                            fontSize: "0.6rem",
                          }}
                        >
                          Students
                        </Typography>
                      </Box>
                    </Box>

                    {/* Task Stats */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "rgba(26, 35, 126, 0.04)",
                        padding: "12px 20px",
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(26, 35, 126, 0.08)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <AssignmentIcon
                        sx={{
                          color: "#1a237e",
                          fontSize: 32,
                          marginRight: 1.5,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            color: "#1a237e",
                            lineHeight: 1,
                            fontSize: "1rem",
                          }}
                        >
                          {classItem.totalTask}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 400,
                            fontSize: "0.8rem",
                          }}
                        >
                          Tasks
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "flex-end" },
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={classItem.status === "0" ? "Active" : "Inactive"}
                    color={classItem.status === "0" ? "success" : "warning"}
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.8rem",
                      padding: "8px 6px",
                      borderRadius: "10px",
                      "& .MuiChip-label": { px: 0.5 },
                    }}
                  />
                </Grid>
              </Grid>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  mt: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "0.7rem",
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 20 }} />
                Created on: {classItem.createdAt}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="class-tabs"
          centered
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 -2px 15px rgba(0,0,0,0.06)",
            backdropFilter: "blur(10px)",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 500,
              minWidth: 80,
              padding: "8px 16px",
              color: "#666",
              "&.Mui-selected": {
                color: "#1a237e",
                background: "rgba(26, 35, 126, 0.06)",
                borderRadius: "10px 10px 0 0",
              },
              "&:hover": {
                color: "#1a237e",
                background: "rgba(26, 35, 126, 0.03)",
                transition: "all 0.3s",
              },
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: 1.5,
              background: "linear-gradient(45deg, #1a237e, #3949ab)",
            },
          }}
        >
          <Tab label="Students" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Tasks" icon={<AssignmentIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Scrollable Content Section */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 -4px 30px rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            padding: { xs: 2, md: 3 },
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {activeTab === 0 && <StudentListTeacher classId={id} />}
          {activeTab === 1 && <TaskListTeacher classId={id} />}
        </Box>
      </Box>
    </Box>
  );
};

export default ManageClass;
