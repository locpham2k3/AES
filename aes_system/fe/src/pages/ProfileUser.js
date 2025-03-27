import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Avatar,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import { getProfile, resetPassword, updateProfile } from "../redux/authSlice";
const formatDateToISO = (dob) => {
  if (!dob) return ""; // Nếu dob là null hoặc chuỗi rỗng, trả về chuỗi rỗng
  const [day, month, year] = dob.split("/"); // Tách dd, mm, yyyy
  return `${year}-${month}-${day}`; // Trả về định dạng yyyy-mm-dd
}; // Hàm chuyển đổi từ yyyy-mm-dd sang dd/mm/yyyy
const formatISOToDate = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-"); // Tách yyyy-mm-dd thành 3 phần
  return `${day}/${month}/${year}`; // Định dạng lại thành dd/mm/yyyy
};
const deafualtProfileImage =
  "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";
export default function ProfileUser() {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [open, setOpen] = useState(false); // điều khiển mở/đóng
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false); // Track if avatar is changed
  const [error, setError] = useState("");
  const profileUser = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    email: profileUser?.profile.Email,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const AccountID = profileUser?.profile.AccountID;
  const check = profileUser?.role == "student" ? 0 : 1;
  const {
    profile = [],
    loading,
    error: profileError,
  } = useSelector((state) => state.profile);
  // console.log("profileUser", profile);

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };

    dispatch(getProfile({ tokens, accountId: AccountID }));
  }, [dispatch, AccountID]);

  // URL ảnh đại diện mặc định nếu ProfileImage là null
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [originalName, setOriginalName] = useState(""); //lưu tên ban đầu
  const [name, setName] = useState(""); // lưu tên
  const [email, setEmail] = useState(""); // lưu email
  const [dob, setDob] = useState(""); // lưu Ngày Sinh

  useEffect(() => {
    if (profile?.[0]) {
      // Kiểm tra an toàn sự tồn tại của profile[0]
      const fullName = `${profile[0]?.firstName || ""} ${profile[0]?.lastName || ""}`;
      setName(fullName);
      setOriginalName(fullName); // Lưu tên ban đầu
      setEmail(profileUser?.profile?.Email);
      setDob(profile[0]?.dob ? formatDateToISO(profile[0]?.dob) : "");

      // Cải tiến việc gán avatar
      const profileImageSrc = profile[0].profileImage
        ? profile[0].profileImage.startsWith("data:image/")
          ? profile[0].profileImage // Nếu đã có tiền tố "data:image", không thay đổi
          : `data:image/png;base64,${profile[0].profileImage}` // Thêm tiền tố base64 nếu thiếu
        : deafualtProfileImage; // Sử dụng ảnh mặc định nếu không có base64

      setAvatar(profileImageSrc);
    }
  }, [profile]); // Chạy lại mỗi khi profile thay đổi
  // Regex pattern for special characters
  const specialCharsPattern = /[;'"|\/`\\]/g;

  // Validate username and DOB
  const validateForm = () => {
    if (!name || name.trim() === "") {
      setError("Username cannot be empty");
      setSnackbarOpen(true);
      return false;
    }
    if (specialCharsPattern.test(name)) {
      setError("Username contains invalid characters");
      setSnackbarOpen(true);
      return false;
    }
    if (!dob || dob.trim() === "") {
      setError("Date of birth cannot be empty");
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // File type validation: Only allow images
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (file && !validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPG or PNG.");
      return;
    }

    // File size validation: Limit file size to 5MB
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxFileSize) {
      toast.error(
        "File is too large. Please upload an image smaller than 5MB."
      );
      return;
    }

    // Convert file to base64 and update the avatar state
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setAvatar(base64Image); // Set the avatar to the base64 string
      setIsAvatarChanged(true); // Mark avatar as changed
    };

    // Read the file as a Data URL (base64)
    if (file) {
      const base64data = reader.result;
      setAvatar(base64data);
      localStorage.setItem("userAvatar", base64data);
      reader.readAsDataURL(file); // This triggers the conversion to base64
      setSelectedFile(file); // Store the selected file
    }
  };
  const handleSaveAvatar = () => {
    if (isAvatarChanged) {
      if (!name.trim()) {
        toast.error(`Please enter your name.`);
        setSnackbarOpen(false);
        return;
      }

      // Tách fullName thành firstName và lastName
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0]; // Lấy phần đầu tiên làm firstName
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""; // Nếu có phần sau, lấy làm lastName

      let Image = avatar.split(",")[1];

      // Khởi tạo đối tượng baseBody với thông tin cần thiết
      let baseBody = {
        image: Image || deafualtProfileImage,
        firstName: firstName,
        lastName: lastName,
        dob: formatISOToDate(dob),
        accountId: AccountID,
        teacherExprience: 0,
        degree: "a",
      };

      // Thêm thông tin studentId hoặc teacherId tùy vào role

      // Lấy tokens từ localStorage
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      try {
        // Gửi action updateProfile
        dispatch(updateProfile({ tokens, body: baseBody, check }));

        // Thông báo thành công
        toast.success("Avatar saved successfully!");
        // dispatch(getProfile({ tokens, accountId: AccountID }));
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error updating Avatar:", error);
        toast.error("Failed to update Avatar. Please try again.");
      }

      // Reset trạng thái avatar đã thay đổi
      setIsAvatarChanged(false);
    } else {
      toast.error("No new avatar selected.");
    }
  };

  //dob
  const handleDOBChange = (e) => {
    const selectedDate = e.target.value;
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);
    // Hàm thay đổi ngày sinh

    // Check if selected date is in the future
    if (selectedDateObj > currentDate) {
      toast.error("Date of Birth cannot be in the future.");
      return;
    }
    if (
      selectedDateObj.getMonth() === 1 && // February
      selectedDateObj.getDate() === 29 && // 29th
      !isLeapYear(selectedDateObj.getFullYear()) // Check if not a leap year
    ) {
      toast.error("February can only have 29 days in a leap year.");
      return;
    }
    // Set the DOB if valid
    setDob(selectedDate);
  };

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const handleEditClick = () => {
    setOriginalName(name); // Lưu tên gốc khi bắt đầu chỉnh sửa
    setOpen(true); // Mở khi nhấn nút edit
  };

  const handleClose = () => {
    setName(originalName); // Khôi phục tên về giá trị ban đầu
    setOpen(false);
  };

  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true); // Mở mk
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false); // Đóng mk
  };

  const handleSave = () => {
    if (validateForm()) {
      if (!name.trim()) {
        toast.error(`Please enter your name.`);
        setSnackbarOpen(false);
        return;
      }

      // Tách fullName thành firstName và lastName
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0]; // Lấy phần đầu tiên làm firstName
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""; // Nếu có phần sau, lấy làm lastName
      let Image = avatar.split(",")[1];
      let baseBody = {
        image: Image || deafualtProfileImage, // Kiểm tra nếu Image rỗng thì gán giá trị mặc định là ""
        firstName: firstName,
        lastName: lastName,
        dob: formatISOToDate(dob),
        accountId: AccountID,
        teacherExprience: 0,
        degree: "a",
      };

      console.log("Save:", baseBody);

      // Lấy tokens từ localStorage
      const tokens = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };

      try {
        // Gửi action updateProfile
        dispatch(updateProfile({ tokens, body: baseBody, check }));

        // Thông báo thành công
        toast.success("Update profile successfully!");
        // dispatch(getProfile({ tokens, accountId: AccountID }));
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }

      // Để lưu thay đổi (tên, email, mật khẩu, dob)
      setOriginalName(name);

      setOpen(false);
    }
  };
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  const validateFormPassword = () => {
    let valid = true;
    const newErrors = {
      password: "",
      confirmPassword: "",
    };

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters, including one uppercase letter and one lowercase letter";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (validateFormPassword()) {
      try {
        await dispatch(resetPassword(formData)).unwrap();
        toast.success("Password changed successfully");
      } catch (err) {
        toast.error(err || "Failed to change password");
      }
      setOpenPasswordDialog(false); // Đóng mk
    } else {
      // setOpenPasswordDialog(); // Đóng mk
      // toast.error("Please fix the errors before submitting");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close Snackbar
  };

  if (loading) return <CircularProgress />;
  // if (profileError) return <Alert severity="error">{profileError}</Alert>;

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 8,
        padding: 3,
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Profile User
      </Typography>

      <Grid container spacing={2}>
        {/* Phần bên trái cho Avatar */}
        <Grid item xs={6}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }} // Ẩn input
              id="avatar-upload"
              onClick={(e) => {
                e.target.value = null; // Đặt lại giá trị input để cho phép tải lên lại cùng một tệp
              }}
            />
            <label htmlFor="avatar-upload">
              <Avatar
                sx={{ width: 120, height: 120, mb: 2, cursor: "pointer" }}
                alt="Avatar User"
                src={avatar}
              />
            </label>
            <Typography variant="h6" align="center">
              Avatar
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                mt: 2,
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: "rgb(159, 117, 197)",
                  color: "#fff",
                  borderColor: "#1976d2",
                },
              }}
              onClick={handleSaveAvatar}
            >
              <SendAndArchiveIcon style={{ marginRight: "5px" }} />
              Save Avatar
            </Button>
          </Box>
        </Grid>

        {/* Phần bên phải cho Thông Tin Hồ Sơ */}
        <Grid item xs={6}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" align="center">
              Profile
            </Typography>
            <TextField
              margin="normal"
              label="Username"
              disabled
              fullWidth
              variant="outlined"
              value={name} // Hiển thị tên người dùng
              InputProps={{
                readOnly: true, // Làm cho trường tên chỉ đọc
              }}
            />
            <TextField
              margin="normal"
              label="Email"
              disabled
              fullWidth
              variant="outlined"
              value={email} // Hiển thị email
              InputProps={{
                readOnly: true, // Làm cho trường email chỉ đọc
              }}
            />
            <TextField
              margin="normal"
              label="DOB"
              disabled
              fullWidth
              variant="outlined"
              value={dob} // Hiển thị ngày sinh
              InputProps={{
                readOnly: true, // Làm cho trường dob chỉ đọc
              }}
            />
            <div style={{ display: "flex" }}>
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  mt: 2,
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": {
                    backgroundColor: "rgb(159, 117, 197)",
                    color: "#fff",
                    borderColor: "#1976d2",
                  },
                }}
                onClick={handleEditClick}
              >
                <ModeEditIcon sx={{ mr: 1 }} />
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  mt: 2,
                  ml: 2,
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": {
                    backgroundColor: "rgb(159, 117, 197)",
                    color: "#fff",
                    borderColor: "#1976d2",
                  },
                }} // Khoảng cách bên trái
                onClick={handlePasswordDialogOpen} // đổi mật khẩu
              >
                <ChangeCircleIcon sx={{ mr: 1 }} />
                Change Password
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>

      {/* popup cho edit */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)} // Xử lý nhập tên
            error={Boolean(error)}
            helperText={error && error}
          />
          <TextField
            margin="dense"
            label="Email"
            disabled
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Xử lý nhập email
          />
          <TextField
            margin="dense"
            label="DOB"
            type="date"
            fullWidth
            variant="outlined"
            value={dob}
            onChange={handleDOBChange} // Use the new handler
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: new Date().toISOString().split("T")[0], // Set max date to today
            }}
            // error={Boolean(error)}
            // helperText={error && error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* popup đổi mật khẩu */}
      <Dialog open={openPasswordDialog} onClose={handlePasswordDialogClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            name="password" // Thêm name
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            required
          />
          <TextField
            name="confirmPassword" // Thêm name
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={handleChangePassword}>
            Change
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
