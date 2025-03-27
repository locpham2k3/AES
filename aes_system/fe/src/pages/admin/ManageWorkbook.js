import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createAdminWorkbook,
  deleteAdminWorkbook,
  fetchAdminWorkbooks,
  updateAdminWorkbook,
} from "../../redux/AdminSlide";
import { useTable, usePagination } from "react-table";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import "./ManageWorkbook.css";
import LoadingBar from "../../components/LoadingBar";
import { fetchListCategory } from "../../redux/TeacherSlide";
import { toast } from "react-toastify";

const levelOptions = [
  { id: 1, name: "A1" },
  { id: 2, name: "A2" },
  { id: 3, name: "B1" },
  { id: 4, name: "B2" },
  { id: 5, name: "C1" },
  { id: 6, name: "C2" },
];

const ManageWorkbook = () => {
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    workbookCategoryId: "",
    levelId: "",
    description: "",
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Thêm state cho lỗi name
  const [nameError, setNameError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [levelError, setLevelError] = useState(false);

  // Fetch category khi mount
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchListCategory({ tokens }));
  }, [dispatch]);

  // Lấy dữ liệu workbook một lần duy nhất khi mount
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const condition = {
      offset: 0,
      limit: 10000, // giả sử server cho phép, lấy hết dữ liệu
      direction: "asc",
      sortBy: "ID",
    };
    dispatch(fetchAdminWorkbooks({ tokens, condition }));
  }, [dispatch]);

  const {
    data: workbookData,
    loading: workbookLoading,
    success: workbookSuccess,
    message: workbookMessage,
  } = useSelector((state) => state.workbookAdmin);

  const { data: categoryData, loading: categoryLoading } = useSelector(
    (state) => state.categoryTeacher
  );

  useEffect(() => {
    let timer;
    if (workbookLoading || categoryLoading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 2000);
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(timer);
  }, [workbookLoading, categoryLoading]);

  useEffect(() => {
    if (workbookSuccess && workbookMessage) {
      toast.success(workbookMessage);
    }
  }, [workbookSuccess, workbookMessage]);

  const columns = React.useMemo(
    () => [
      {
        Header: "No",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Category",
        accessor: "workbookCategoryId",
        Cell: ({ value }) => {
          const category = categoryData?.find((cat) => cat.id === value);
          return category ? category.name : value;
        },
      },
      {
        Header: "Level",
        accessor: "levelId",
        Cell: ({ value }) => {
          const level = levelOptions.find((lvl) => lvl.id === value);
          return level ? level.name : value;
        },
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
    [categoryData]
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
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: workbookData || [],
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  const handleOpenDialog = (action, rowData = null) => {
    setDialogContent({ action, rowData });
    setNameError(false);
    setCategoryError(false);
    setLevelError(false);

    if (rowData) {
      setFormValues({
        name: rowData.name || "",
        workbookCategoryId: rowData.workbookCategoryId || "",
        levelId: rowData.levelId || "",
        description: rowData.description || "",
      });

      const category = categoryData?.find(
        (cat) => cat.id === rowData.workbookCategoryId
      );
      setSelectedCategory(category || null);

      const level = levelOptions.find((lvl) => lvl.id === rowData.levelId);
      setSelectedLevel(level || null);
    } else {
      setFormValues({
        name: "",
        workbookCategoryId: "",
        levelId: "",
        description: "",
      });
      setSelectedCategory(null);
      setSelectedLevel(null);
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent(null);
    setFormValues({
      name: "",
      workbookCategoryId: "",
      levelId: "",
      description: "",
    });
    setSelectedCategory(null);
    setSelectedLevel(null);
    setCategoryError(false);
    setLevelError(false);
    setNameError(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Kiểm tra ký tự đặc biệt
    const invalidCharsRegex = /[;'"|\/`\\]/g;
    if (name === "name" && invalidCharsRegex.test(value)) {
      setNameError(true); // Hiển thị lỗi
      return; // Không cập nhật giá trị
    }

    setNameError(false); // Xóa lỗi nếu không có ký tự đặc biệt
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    const { action, rowData } = dialogContent;
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    let valid = true;

    // Kiểm tra name
    if (
      (action === "create" || action === "update") &&
      !formValues.name.trim()
    ) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }

    if (!selectedCategory && (action === "create" || action === "update")) {
      setCategoryError(true);
      valid = false;
    } else {
      setCategoryError(false);
    }

    if (!selectedLevel && (action === "create" || action === "update")) {
      setLevelError(true);
      valid = false;
    } else {
      setLevelError(false);
    }

    if (!valid) return;

    let promise;
    if (action === "create") {
      const body = {
        ...formValues,
        workbookCategoryId: selectedCategory?.id,
        levelId: selectedLevel?.id,
      };
      promise = dispatch(createAdminWorkbook({ tokens, body }));
    } else if (action === "update") {
      const body = {
        id: rowData.id,
        ...formValues,
        workbookCategoryId: selectedCategory?.id,
        levelId: selectedLevel?.id,
      };
      promise = dispatch(updateAdminWorkbook({ tokens, body }));
    } else if (action === "delete") {
      const workbookId = rowData.id;
      promise = dispatch(deleteAdminWorkbook({ tokens, workbookId }));
    }

    if (promise) {
      promise
        .then(() => {
          const condition = {
            offset: 0,
            limit: 10000,
            direction: "asc",
            sortBy: "ID",
          };
          dispatch(fetchAdminWorkbooks({ tokens, condition }));
        })
        .catch((error) => {
          toast.error(`${action} workbook: ${error.message}`);
        });
    }

    handleCloseDialog();
  };

  return (
    <>
      <div className="table-container">
        <h2 style={{ textAlign: "center" }}>Manage Workbook</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("create")}
        >
          Add Workbook
        </Button>

        {showLoading ? (
          <LoadingBar />
        ) : (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              margin: "0 auto",
              marginTop: "10px",
            }}
          >
            <table {...getTableProps()} className="custom-table">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroup.id}
                  >
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

            <div className="pagination-container">
              <Button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                variant="outlined"
              >
                {"<<"}
              </Button>
              <Button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                variant="outlined"
              >
                {"<"}
              </Button>
              <Button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                variant="outlined"
              >
                {">"}
              </Button>
              <Button
                onClick={() => gotoPage(pageOptions.length - 1)}
                disabled={!canNextPage}
                variant="outlined"
              >
                {">>"}
              </Button>

              <span>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{" "}
              </span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[5, 10, 20, 50, 100].map((pageSizeOption) => (
                  <option key={pageSizeOption} value={pageSizeOption}>
                    Show {pageSizeOption}
                  </option>
                ))}
              </select>
            </div>
          </Box>
        )}
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "600px",
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle>
          {dialogContent?.action === "create"
            ? "Add Workbook"
            : dialogContent?.action === "update"
              ? "Edit Workbook"
              : "Delete Workbook"}
        </DialogTitle>
        <DialogContent>
          {dialogContent?.action !== "delete" && (
            <>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                margin="normal"
                disabled={dialogContent?.action === "delete"}
                error={nameError}
                helperText={
                  nameError
                    ? "Name cannot contain special characters like ;'\"|/`"
                    : ""
                }
              />
              <Autocomplete
                value={selectedCategory}
                onChange={(e, newValue) => {
                  setSelectedCategory(newValue);
                  setCategoryError(false);
                }}
                options={categoryData || []}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    variant="outlined"
                    margin="normal"
                    error={categoryError}
                    helperText={categoryError ? "Please select a category" : ""}
                  />
                )}
                disabled={dialogContent?.action === "delete"}
              />
              <Autocomplete
                value={selectedLevel}
                onChange={(e, newValue) => {
                  setSelectedLevel(newValue);
                  setLevelError(false);
                }}
                options={levelOptions}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Level"
                    variant="outlined"
                    margin="normal"
                    error={levelError}
                    helperText={levelError ? "Please select a level" : ""}
                  />
                )}
                disabled={dialogContent?.action === "delete"}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={3}
                disabled={dialogContent?.action === "delete"}
              />
            </>
          )}
          {dialogContent?.action === "delete" && (
            <p>Are you sure you want to delete this workbook?</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color={dialogContent?.action === "delete" ? "error" : "secondary"}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageWorkbook;
