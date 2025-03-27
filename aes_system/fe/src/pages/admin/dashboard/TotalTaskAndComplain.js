import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  AssignmentOutlined as EssayIcon,
  ReportProblemOutlined as ComplainIcon,
  CheckCircleOutline as ResolvedIcon,
  PendingOutlined as PendingIcon,
  CheckCircleOutline,
  PendingOutlined,
} from "@mui/icons-material";
import {
  getTotalComplainOfAdmin,
  getTotalEssayTaskOfAdmin,
} from "../../../redux/DashboardSilde";

const TotalTaskAndComplain = ({ tokens }) => {
  const dispatch = useDispatch();

  // Selectors for essay tasks and complaints
  const {
    data: essayTaskData,
    loading: essayTaskLoading,
    error: essayTaskError,
  } = useSelector((state) => state.totalEssayTaskOfAdmin);

  const {
    data: complainData,
    loading: complainLoading,
    error: complainError,
  } = useSelector((state) => state.totalComplainOfAdmin);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getTotalEssayTaskOfAdmin({ tokens }));
    dispatch(getTotalComplainOfAdmin({ tokens }));
  }, [dispatch, tokens]);

  // Determine overall loading and error states
  const isLoading = essayTaskLoading || complainLoading;
  const hasError = essayTaskError || complainError;

  // Render loading state
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  // Render error state
  if (hasError) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          Error loading data. Please try again later.
        </Typography>
      </Box>
    );
  }

  // Extract data safely
  const essayStats = essayTaskData?.[0] || {};
  const complainStats = complainData?.[0] || {};
  console.log(essayStats);
  return (
    <Box p={4} bgcolor="#f4f6f8" minHeight="100vh">
      <Typography
        variant="h4"
        color="primary"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: 700,
          textAlign: "center",
          textTransform: "uppercase",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        Overview of Tasks and Complaints
      </Typography>

      <Grid container spacing={4}>
        {/* Essay Tasks Statistics */}
        <Grid item xs={12} md={6}>
          <Card elevation={6} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardHeader
              avatar={<EssayIcon color="primary" />}
              title="Task Overview"
              titleTypographyProps={{ variant: "h6", color: "primary" }}
              sx={{
                bgcolor: "#e3f2fd",
                py: 2,
                borderRadius: "8px 8px 0 0",
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Chip
                    icon={<EssayIcon />}
                    label={`Total Tasks: ${essayStats.totalEssayTask || 0}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: "bold", borderColor: "primary.main" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    icon={<CheckCircleOutline />}
                    label={`Active: ${essayStats.totalActiveEssayTask || 0}`}
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: "bold", borderColor: "success.main" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    icon={<PendingOutlined />}
                    label={`Inactive: ${essayStats.totalInactiveEssayTask || 0}`}
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: "bold", borderColor: "warning.main" }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Complaints Statistics */}
        <Grid item xs={12} md={6}>
          <Card elevation={6} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardHeader
              avatar={<ComplainIcon color="secondary" />}
              title="Complaint Management"
              titleTypographyProps={{ variant: "h6", color: "secondary" }}
              sx={{
                bgcolor: "#fce4ec",
                py: 2,
                borderRadius: "8px 8px 0 0",
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Chip
                    icon={<ComplainIcon />}
                    label={`Total: ${complainStats.totalComplain || 0}`}
                    color="secondary"
                    variant="outlined"
                    sx={{ fontWeight: "bold", borderColor: "secondary.main" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    icon={<ResolvedIcon />}
                    label={`Resolved: ${complainStats.totalComplainResolved || 0}`}
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: "bold", borderColor: "success.main" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    icon={<PendingIcon />}
                    label={`Pending: ${complainStats.totalComplainPending || 0}`}
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: "bold", borderColor: "warning.main" }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Complaints Table */}
        <Grid item xs={12}>
          <Paper elevation={6} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Box p={2}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Complaint Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Evaluation ID</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complainStats.complainInfos?.map((complaint, index) => (
                      <TableRow key={index}>
                        <TableCell>{complaint.evaluationAssigningId}</TableCell>
                        <TableCell>{complaint.studentName}</TableCell>
                        <TableCell>
                          <Chip
                            label={complaint.complainStatus}
                            color={
                              complaint.complainStatus === "Resolved"
                                ? "success"
                                : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TotalTaskAndComplain;
