import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tooltip,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  getListClassOfAdmin,
  getTotalUserOfAdmin,
} from "../../../redux/DashboardSilde";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ClassIcon from "@mui/icons-material/Class";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const TotalUserAndClass = ({ tokens }) => {
  const dispatch = useDispatch();
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const detailsRef = useRef(null);

  // Access the Redux store data
  const {
    data: totalUserData,
    loading: loadingUser,
    error: errorUser,
  } = useSelector((state) => state.totalUserOfAdmin);

  const {
    data: listClassData,
    loading: loadingClass,
    error: errorClass,
  } = useSelector((state) => state.listClassOfAdmin);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(getTotalUserOfAdmin({ tokens }));
    dispatch(getListClassOfAdmin({ tokens }));
  }, [dispatch, tokens]);

  // Loading, Error, and No Data Handlers
  const isLoading = loadingUser || loadingClass;
  const hasError = errorUser || errorClass;

  // Toggle function for class details
  const toggleClassDetails = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  return (
    <Box p={4} bgcolor="#f5f5f5">
      {/* Loading Spinner */}
      {isLoading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={50} color="primary" />
        </Box>
      )}

      {/* Error State */}
      {hasError && (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" color="error">
            Error loading data. Please try again later.
          </Typography>
        </Box>
      )}

      {/* Total Users Section */}
      {!isLoading && !hasError && totalUserData && (
        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 2, boxShadow: 6 }}>
              <CardHeader
                title="Total User Statistics"
                subheader="Overview of all users"
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: 2,
                }}
              />
              <CardContent>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Tooltip title="Total registered users in the system" arrow>
                      <Chip
                        label={`Total Users: ${totalUserData[0].totalUser}`}
                        color="primary"
                        size="large"
                        icon={<PeopleIcon fontSize="small" />}
                        sx={{
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#1976d2",
                            color: "#fff",
                          },
                          boxShadow: 2,
                        }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Total number of students" arrow>
                      <Chip
                        label={`Students: ${totalUserData[0].totalStudent}`}
                        color="secondary"
                        size="large"
                        icon={<SchoolIcon fontSize="small" />}
                        sx={{
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#f50057",
                            color: "#fff",
                          },
                          boxShadow: 2,
                        }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Total number of teachers" arrow>
                      <Chip
                        label={`Teachers: ${totalUserData[0].totalTeacher}`}
                        color="success"
                        size="large"
                        icon={<PersonIcon fontSize="small" />}
                        sx={{
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#4caf50",
                            color: "#fff",
                          },
                          boxShadow: 2,
                        }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Total number of referees" arrow>
                      <Chip
                        label={`Referees: ${totalUserData[0].totalReferee}`}
                        color="default"
                        size="large"
                        icon={<VerifiedUserIcon fontSize="small" />}
                        sx={{
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#9e9e9e",
                            color: "#fff",
                          },
                          boxShadow: 2,
                        }}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Class Statistics Section */}
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 2, boxShadow: 6 }}>
              <CardHeader
                title="Class Statistics"
                subheader="Overview of classes"
                sx={{
                  backgroundColor: "#388e3c",
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: 2,
                }}
              />
              <CardContent>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Tooltip title="Total number of classes" arrow>
                      <Chip
                        label={`Total Classes: ${listClassData[0].totalClass}`}
                        color="primary"
                        size="large"
                        icon={<ClassIcon fontSize="small" />}
                        sx={{
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#1976d2",
                            color: "#fff",
                          },
                          boxShadow: 2,
                        }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Number of active classes" arrow>
                      <Chip
                        label={`Active Classes: ${listClassData[0].totalActiveClass}`}
                        color="success"
                        size="large"
                        icon={<CheckCircleIcon fontSize="small" />}
                        sx={{
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#4caf50",
                            color: "#fff",
                          },
                          boxShadow: 2,
                        }}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Class Details Section with Toggle and Animated Collapse */}
      {!isLoading && !hasError && listClassData && (
        <Box mt={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
            >
              Detailed Class Information
            </Typography>
            <IconButton onClick={toggleClassDetails} color="primary">
              {isDetailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={isDetailsExpanded} unmountOnExit>
            <Paper
              ref={detailsRef}
              elevation={4}
              sx={{
                padding: 3,
                borderRadius: 2,
                maxHeight: isDetailsExpanded ? "1000px" : "0px",
                transition:
                  "max-height 0.3s ease-in-out, padding 0.3s ease-in-out",
                overflow: "hidden",
              }}
            >
              {listClassData[0].classInfo.length > 0 ? (
                listClassData[0].classInfo.map((classItem, index) => (
                  <Box key={index} mb={2}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" color="textPrimary">
                          {classItem.className}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Chip
                          label={`Total Students: ${classItem.totalStudent}`}
                          color="primary"
                          size="large"
                          sx={{ borderRadius: 2, boxShadow: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Chip
                          label={`Status: ${classItem.activeStatus === 0 ? "Active" : "Inactive"}`}
                          color={
                            classItem.activeStatus === 0 ? "success" : "error"
                          }
                          size="large"
                          sx={{ borderRadius: 2, boxShadow: 2 }}
                        />
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginY: 1 }} />
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No class details available.
                </Typography>
              )}
            </Paper>
          </Collapse>
        </Box>
      )}
    </Box>
  );
};

export default TotalUserAndClass;
