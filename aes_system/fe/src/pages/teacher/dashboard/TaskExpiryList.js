import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format } from "date-fns";
import { getListTaskExpiryByTeacher } from "../../../redux/DashboardSilde";

const TaskExpiryList = ({ tokens, teacherId }) => {
  const dispatch = useDispatch();
  const {
    data = [],
    loading,
    error,
  } = useSelector((state) => state.listTaskExpiryTeacher);

  useEffect(() => {
    if (teacherId && tokens)
      dispatch(getListTaskExpiryByTeacher({ tokens, teacherId }));
  }, [dispatch, tokens, teacherId]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        Error: {error.message}
      </Alert>
    );
  if (!data)
    return (
      <Alert severity="info" sx={{ margin: 2 }}>
        No tasks expiring soon.
      </Alert>
    );

  return (
    <Card
      elevation={3}
      sx={{
        mb: 4,
        bgcolor: "#ffffff",
        borderRadius: 4,
        p: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        "&:hover": {
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-3px)",
        },
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 800,
            color: "primary.main",
            mb: 3,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)",
              borderRadius: "2px",
            },
          }}
        >
          Upcoming Task Expirations
        </Typography>

        {data.map((classTask, index) => (
          <Accordion
            key={index}
            defaultExpanded={index === 0}
            sx={{
              mb: 2,
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "12px !important",
              "&:before": { display: "none" },
              boxShadow: "none",
              "&.Mui-expanded": {
                margin: "8px 0",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                borderRadius: "12px",
                "&.Mui-expanded": {
                  minHeight: "48px",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                },
                background: "rgba(25, 118, 210, 0.04)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "primary.dark",
                }}
              >
                {classTask.className}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2 }}>
              {classTask.taskInfomationDTO.length > 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <Table
                    size="small"
                    sx={{
                      minWidth: 650,
                      "& th": {
                        fontWeight: 600,
                        backgroundColor: "rgba(25, 118, 210, 0.04)",
                      },
                      "& td, & th": {
                        padding: "12px 16px",
                      },
                      "& tr:nth-of-type(even)": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Task Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Assignment Date</TableCell>
                        <TableCell>Due Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classTask.taskInfomationDTO.map((task, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{task.taskName}</TableCell>
                          <TableCell>{task.taskPlainContent}</TableCell>
                          <TableCell>
                            {format(
                              new Date(task.assignmentDate),
                              "dd/MM/yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(task.dueDate), "dd/MM/yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontStyle: "italic",
                    textAlign: "center",
                    py: 2,
                  }}
                >
                  No upcoming tasks.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskExpiryList;
