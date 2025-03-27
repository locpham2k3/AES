import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Tab,
  Tabs,
  Box,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";

import StudentList from "./StudentList";
import TaskListStudent from "./TaskListStudent";

const DetailClassStudent = () => {
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
        padding: { xs: 2, md: 3 }, // Reduced padding
        backgroundColor: "#f8f9fa",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 2, // Reduced margin
          borderRadius: "10px",
          textTransform: "none",
          fontSize: "0.9rem", // Smaller font
          padding: "8px 20px", // Reduced padding
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          },
        }}
        onClick={() => navigate("/student/list-class/")}
      >
        Back to Class List
      </Button>

      {classItem && (
        <Card
          sx={{
            mb: 2, // Reduced margin
            borderRadius: "12px",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            transition: "all 0.3s ease",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {" "}
            {/* Reduced padding */}
            <Typography
              variant="h5" // Changed from h4
              sx={{
                fontWeight: 700,
                mb: 2, // Reduced margin
                background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
                fontSize: "1.5rem", // Smaller font size
              }}
            >
              {classItem.name}
            </Typography>
            <Grid container spacing={2} alignItems="center">
              {" "}
              {/* Reduced spacing */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Chip
                    icon={<AssignmentIcon />}
                    label={`${classItem.totalTask} Tasks`}
                    color="primary"
                    sx={{
                      borderRadius: "8px",
                      padding: "4px",
                      "& .MuiChip-icon": {
                        color: "inherit",
                      },
                      transition: "all 0.2s ease",
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Chip
                  label={classItem.status === "0" ? "Active" : "Inactive"}
                  color={classItem.status === "0" ? "success" : "warning"}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    padding: "16px 12px", // Reduced padding
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                />
              </Grid>
            </Grid>
            <Typography
              variant="body2" // Changed from body1
              sx={{
                mt: 2,
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "0.85rem",
              }}
            >
              <CalendarTodayIcon
                fontSize="small"
                sx={{ color: "primary.main" }}
              />
              Created on: {classItem.createdAt}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          borderRadius: "12px",
          overflow: "hidden",
          height: "calc(100vh - 200px)", // Fixed height calculation
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="class-tabs"
          centered
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "white",
            minHeight: "48px", // Reduced height
            "& .MuiTab-root": {
              fontSize: "0.9rem",
              fontWeight: 600,
              minWidth: 120,
              minHeight: "48px", // Reduced height
              py: 1.5,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.02)",
              },
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: "2px 2px 0 0",
            },
          }}
        >
          <Tab
            label="Tasks"
            icon={<AssignmentIcon sx={{ fontSize: "1.2rem" }} />}
            iconPosition="start"
          />
          <Tab
            label="Students"
            icon={<PeopleIcon sx={{ fontSize: "1.2rem" }} />}
            iconPosition="start"
          />
        </Tabs>

        <Box
          sx={{
            height: "calc(100% - 48px)", // Subtract tabs height
            overflow: "hidden",
          }}
        >
          {activeTab === 0 && <TaskListStudent classId={id} />}
          {activeTab === 1 && <StudentList classId={id} />}
        </Box>
      </Card>
    </Box>
  );
};
export default DetailClassStudent;
