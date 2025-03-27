import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
  FormGroup,
  Autocomplete,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { getAllUsers, updateUser } from "../../redux/AdminSlide";
import { toast } from "react-toastify";

const ManageUser = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.userAdmin);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchEmail, setSearchEmail] = useState("");
  const pageSize = 7; // Number of items per page

  const roleMapping = {
    2: "Student",
    3: "Teacher",
    4: "Referee",
    5: "Manager",
  };

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    dispatch(
      getAllUsers({
        tokens,
        condition: { offset: 0, limit: 100, direction: "asc", sortBy: "id" },
      })
    );
  }, [dispatch]);

  // Filtered and paginated users
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
  }, [users, searchEmail]);

  const pageCount = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setNewRole(user.roleId);
    setNewStatus(user.status === "1");
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (selectedUser) {
      const updatedUser = {
        accountId: selectedUser.id,
        newRoleId: newRole,
        newStatus: newStatus ? "1" : "2",
      };
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      dispatch(
        updateUser({
          tokens,
          body: updatedUser,
        })
      )
        .then((response) => {
          if (response.payload.code === 200) {
            toast.success("User updated successfully!");
            dispatch(
              getAllUsers({
                tokens,
                condition: {
                  offset: 0,
                  limit: 100,
                  direction: "asc",
                  sortBy: "id",
                },
              })
            );
          } else {
            toast.error("Error: " + response.payload.message);
          }
        })
        .catch((err) => {
          toast.error(`Error: ${err.message}`);
        });

      setOpenDialog(false);
    }
  };

  const handleStatusChange = (user) => {
    const updatedUser = {
      accountId: user.id,
      newRoleId: user.roleId,
      newStatus: user.status === "1" ? "2" : "1",
    };
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    dispatch(
      updateUser({
        tokens,
        body: updatedUser,
      })
    )
      .then((response) => {
        if (response.payload.code === 200) {
          toast.success("Status updated successfully!");
          dispatch(
            getAllUsers({
              tokens,
              condition: {
                offset: 0,
                limit: 100,
                direction: "asc",
                sortBy: "id",
              },
            })
          );
        } else {
          toast.error("Error: " + response.payload.message);
        }
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`);
      });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setCurrentPage(newPage);
    }
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchEmail]);

  return (
    <>
      <div className="table-container">
        <h2 style={{ textAlign: "center" }}>Manage User</h2>

        {/* Search Input */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ position: "relative", width: "400px" }}>
            <TextField
              label="Search by Email"
              variant="outlined"
              fullWidth
              style={{
                borderRadius: "25px",
                backgroundColor: "#f5f5f5",
              }}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Enter email to search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.email}</td>
                <td>{row.firstName}</td>
                <td>{row.lastName}</td>
                <td>
                  <FormGroup style={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={row.status === "1"}
                          onChange={() => handleStatusChange(row)}
                          name="status"
                          color="primary"
                        />
                      }
                      label={row.status === "1" ? "Active" : "Inactive"}
                    />
                  </FormGroup>
                </td>
                <td>{roleMapping[row.roleId]}</td>
                <td>
                  <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={() => handleEdit(row)}
                  >
                    <EditIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <Button
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            {"<"}
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount - 1}
          >
            {">"}
          </Button>
          <Button
            onClick={() => handlePageChange(pageCount - 1)}
            disabled={currentPage === pageCount - 1}
          >
            {">>"}
          </Button>
          <span>
            Page{" "}
            <strong>
              {currentPage + 1} of {pageCount}
            </strong>{" "}
          </span>
        </div>
      </div>

      {/* Loading Overlay */}
      <Dialog
        open={loading}
        onClose={() => {}}
        style={{ backdropFilter: "blur(5px)" }}
      >
        <DialogContent
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <CircularProgress />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        style={{ minWidth: "400px" }}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent style={{ padding: "20px" }}>
          {selectedUser && (
            <>
              <TextField
                label="Email"
                value={selectedUser.email}
                fullWidth
                disabled
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="First Name"
                value={selectedUser.firstName}
                fullWidth
                disabled
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Last Name"
                value={selectedUser.lastName}
                fullWidth
                disabled
                style={{ marginBottom: "10px" }}
              />
              <Autocomplete
                value={newRole}
                onChange={(event, newValue) => setNewRole(newValue)}
                options={[2, 3, 4, 5]}
                getOptionLabel={(option) => roleMapping[option] || ""}
                renderInput={(params) => <TextField {...params} label="Role" />}
                fullWidth
                style={{ marginBottom: "10px" }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            style={{ color: "gray" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{ backgroundColor: "#1976d2", color: "white" }}
            disabled={loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageUser;
