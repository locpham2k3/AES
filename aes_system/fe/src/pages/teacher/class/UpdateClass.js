import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateClassName } from "../../../redux/TeacherSlide";
import { toast } from "react-toastify";

const UpdateClass = ({ classItem, onUpdate, onClose }) => {
  const [className, setClassName] = useState(classItem?.name || "");
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.user);
  const TeacherID = profile?.profile.TeacherID;

  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  const handleSave = () => {
    // Trim and validate class name
    const trimmedClassName = className.trim();

    if (!trimmedClassName) {
      toast.error("Class name cannot be empty");
      return;
    }

    // Check if the name is actually different
    if (trimmedClassName === classItem.name) {
      onClose();
      return;
    }

    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    const body = {
      id: classItem.id,
      className: trimmedClassName,
      teacherId: TeacherID,
    };

    dispatch(updateClassName({ tokens, body }))
      .unwrap()
      .then(() => {
        toast.success("Class name updated successfully!");
        onUpdate();
        onClose();
      })
      .catch((error) => {
        toast.error(`Error updating class name: ${error.message}`);
      });
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Class Name</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Edit name for: <strong>{classItem?.name}</strong>
        </Typography>
        <TextField
          label="New Class Name"
          variant="outlined"
          fullWidth
          value={className}
          onChange={handleClassNameChange}
          sx={{ mb: 2 }}
          error={!className.trim()}
          helperText={!className.trim() ? "Class name cannot be empty" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={!className.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateClass;
