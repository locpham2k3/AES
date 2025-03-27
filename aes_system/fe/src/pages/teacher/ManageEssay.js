import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePagination, useTable } from "react-table";
import LoadingBar from "../../components/LoadingBar";
import {
  createTeacherEssayTask,
  deleteTeacherEssayTask,
  fetchTeacherEssayTask,
  fetchTotalTeacherEssayTask,
  updateTeacherEssayTask,
} from "../../redux/TeacherSlide";
import "./ManageEssay.css"; // Import CSS file
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ManageEssay = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // New state to control the display of the loading indicator with delay
  const [showLoading, setShowLoading] = useState(false);

  // Form state for controlled inputs
  const [formValues, setFormValues] = useState({
    taskName: "",
    taskPlainContent: "",
    wordCountLimit: "",
    durationLimit: "",
    workbookEssayTaskId: id,
  });

  const [errors, setErrors] = useState({
    taskName: "",
    taskPlainContent: "",
    wordCountLimit: "",
    durationLimit: "",
  });

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const condition = {
      offset: page * pageSize,
      limit: pageSize,
      direction: "asc",
      sortBy: "ID",
      id,
    };
    dispatch(fetchTeacherEssayTask({ tokens, condition, check: 0 }));
  }, [dispatch, page, pageSize, id]);

  const {
    data: essayTaskData,
    loading: essayTaskLoading,
    error: essayTaskError,
    total,
  } = useSelector((state) => state.essayTaskTeacher);

  // Effect to handle the 2-second delay for loading indicator
  useEffect(() => {
    let timer;
    if (essayTaskLoading) {
      // Start a 2-second timer
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 2000);
    } else {
      // If not loading, ensure the loading indicator is hidden
      setShowLoading(false);
    }

    // Cleanup the timer when loading state changes or component unmounts
    return () => clearTimeout(timer);
  }, [essayTaskLoading]);

  const handleOpenDialog = (action, rowData = null) => {
    setDialogContent({ action, rowData });

    // Initialize form values based on action
    if (action === "update" && rowData) {
      setFormValues({
        taskName: rowData.taskName || "",
        taskPlainContent: rowData.taskPlainContent || "",
        wordCountLimit: rowData.wordCountLimit || "",
        durationLimit: rowData.durationLimit || "",
        workbookEssayTaskId: id,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent(null);
    setFormValues({
      taskName: "",
      wordCountLimit: "",
      durationLimit: "",
      taskPlainContent: "",
      workbookEssayTaskId: id,
    });
    setErrors({
      taskName: "",
      taskPlainContent: "",
      wordCountLimit: "",
      durationLimit: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleConfirm = async () => {
    const { action, rowData } = dialogContent;
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    // Reset errors
    setErrors({
      taskName: "",
      taskPlainContent: "",
      wordCountLimit: "",
      durationLimit: "",
    });

    let hasError = false;

    // Validation checks
    if (action !== "delete") {
      // Only check for errors if not deleting
      const specialCharRegex = /[';/`\\|]/; // Regex for special characters

      if (!formValues.taskName) {
        setErrors((prev) => ({
          ...prev,
          taskName: "Task Name cannot be empty.",
        }));
        hasError = true;
      } else if (specialCharRegex.test(formValues.taskName)) {
        setErrors((prev) => ({
          ...prev,
          taskName: "Task Name cannot contain special characters.",
        }));
        hasError = true;
      }

      if (!formValues.taskPlainContent) {
        setErrors((prev) => ({
          ...prev,
          taskPlainContent: "Task Plain Content cannot be empty.",
        }));
        hasError = true;
      } else if (specialCharRegex.test(formValues.taskPlainContent)) {
        setErrors((prev) => ({
          ...prev,
          taskPlainContent:
            "Task Plain Content cannot contain special characters.",
        }));
        hasError = true;
      }

      if (formValues.wordCountLimit <= 0) {
        setErrors((prev) => ({
          ...prev,
          wordCountLimit: "Word Count Limit must be greater than 0.",
        }));
        hasError = true;
      }

      if (formValues.durationLimit <= 0) {
        setErrors((prev) => ({
          ...prev,
          durationLimit: "Duration Limit must be greater than 0.",
        }));
        hasError = true;
      }
    }

    if (hasError) return; // Stop if there are validation errors

    try {
      if (action === "create") {
        let body = {
          ...formValues,
        };
        await dispatch(createTeacherEssayTask({ tokens, body }))
          .then((response) => {
            if (response.payload.code === 200) {
              toast.success("Create essay successfully!"); // Success toast
            } else {
              toast.error("Failed to create essay"); // Error toast
            }
          })
          .catch((error) => {
            toast.error("An error occurred: " + error.msg); // Error toast for any errors
          });
      } else if (action === "update") {
        let body = {
          id: rowData.id,
          ...formValues,
        };
        await dispatch(updateTeacherEssayTask({ tokens, body }))
          .then((response) => {
            if (response.payload.code === 200) {
              toast.success("Update essay successfully!"); // Success toast
            }
          })
          .catch((error) => {
            toast.error("An error occurred: " + error.msg); // Error toast for any errors
          });
      } else if (action === "delete") {
        let essayTaskId = rowData.id;
        await dispatch(deleteTeacherEssayTask({ tokens, essayTaskId }))
          .then((response) => {
            if (response.payload.code === 200) {
              toast.success("Delete essay successfully!"); // Success toast
            }
          })
          .catch((error) => {
            toast.error("An error occurred: " + error.msg); // Error toast for any errors
          });
      }

      // After CRUD operation is done, fetch the updated list
      const condition = {
        offset: page * pageSize,
        limit: pageSize,
        direction: "asc",
        sortBy: "ID",
        id,
      };
      await dispatch(fetchTeacherEssayTask({ tokens, condition, check: 0 })); // Fetch updated tasks
    } catch (error) {
      console.error("Error during CRUD operation:", error);
    }

    // Close the dialog after the operation
    handleCloseDialog();
  };

  const renderCellValue = (value, field) => {
    const essay = essayTaskData.find((cat) => cat.id === value);
    return essay ? essay[field] : value;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "No",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "taskName",
      },
      {
        Header: "Word Count",
        accessor: "wordCountLimit",
        Cell: ({ value }) => renderCellValue(value, "name"),
      },
      {
        Header: "Duration (Minutes)",
        accessor: "durationLimit",
        Cell: ({ value }) => renderCellValue(value, "name"),
      },
      {
        Header: "Task Plain",
        accessor: "taskPlainContent",
        Cell: ({ value }) => renderCellValue(value, "name"),
      },
      {
        Header: "Create Date",
        accessor: "createDate",
        Cell: ({ value }) => renderCellValue(value, "name"),
      },
      {
        Header: "Update Date",
        accessor: "updateDate",
        Cell: ({ value }) => renderCellValue(value, "name"),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "5px" }}
          >
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={() => handleOpenDialog("update", row.original)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="secondary"
              onClick={() => handleOpenDialog("delete", row.original)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    [essayTaskData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: setTablePageSize,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: essayTaskData || [],
      initialState: { pageIndex: 0 },
      manualPagination: true,
      // Dynamically set pageCount based on the total number of tasks
      pageCount: Math.ceil(total / pageSize),
    },
    usePagination
  );

  useEffect(() => {
    setPage(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    setTablePageSize(pageSize);
  }, [pageSize, setTablePageSize]);

  return (
    <>
      <div className="table-container">
        <h2 style={{ textAlign: "center" }}>Manage Essay Task</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("create")}
          style={{ marginBottom: "20px" }}
        >
          Add Essay Task
        </Button>

        {/* Display LoadingBar only if showLoading is true */}
        {showLoading && (
          <div className="loading-container">
            <LoadingBar />
          </div>
        )}

        {/* Display errors immediately if any */}
        {essayTaskError && (
          <p style={{ color: "red" }}>Error: {essayTaskError}</p>
        )}

        {/* Display the table only when not loading */}
        {!showLoading && !essayTaskLoading && (
          <table {...getTableProps()} className="custom-table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} key={column.id}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {tablePage.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.column.id}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="pagination-controls">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </Button>
          <span>
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </Button>
        </div>
      </div>

      {/* Dialog for creating/editing/deleting */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogContent?.action === "create"
            ? "Create Essay Task"
            : dialogContent?.action === "update"
              ? "Update Essay Task"
              : "Delete Essay Task"}
        </DialogTitle>
        <DialogContent>
          {dialogContent?.action !== "delete" ? (
            <>
              <TextField
                label="Task Name"
                name="taskName"
                value={formValues.taskName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={!!errors.taskName}
                helperText={errors.taskName}
              />
              <TextField
                label="Word Count Limit"
                name="wordCountLimit"
                value={formValues.wordCountLimit}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                type="number"
                error={!!errors.wordCountLimit}
                helperText={errors.wordCountLimit}
              />
              <TextField
                label="Duration Limit"
                name="durationLimit"
                value={formValues.durationLimit}
                onChange={handleInputChange}
                fullWidth
                type="number"
                margin="normal"
                error={!!errors.durationLimit}
                helperText={errors.durationLimit}
              />
              <TextField
                label="Task Plain Content"
                name="taskPlainContent"
                value={formValues.taskPlainContent}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={!!errors.taskPlainContent}
                helperText={errors.taskPlainContent}
              />
            </>
          ) : (
            <p>Are you sure you want to delete this essay task?</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            {dialogContent?.action === "delete"
              ? "Delete"
              : dialogContent?.action === "create"
                ? "Create"
                : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageEssay;
