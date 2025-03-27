import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { addClass, fetchListClass } from "../../../redux/TeacherSlide";
import { toast } from "react-toastify";

const CreateClass = ({ teacherId, onClose }) => {
  const dispatch = useDispatch();
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Biểu thức kiểm tra giá trị chỉ chứa chữ cái và số
    const validClassNameRegex = /^[a-zA-Z0-9]+$/;

    if (!className.trim()) {
      // Nếu className trống hoặc chỉ chứa dấu cách
      setError("Class name is required and cannot be empty or just spaces.");
      return; // Dừng lại không gửi yêu cầu
    }

    if (!validClassNameRegex.test(className)) {
      // Nếu className chứa ký tự không hợp lệ
      setError("Class name can only contain letters and numbers.");
      return; // Dừng lại không gửi yêu cầu
    }

    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const body = {
      className,
      teacherId,
    };

    dispatch(addClass({ tokens, body }))
      .unwrap() // unwrap() giúp bạn xử lý kết quả hoặc lỗi dễ dàng hơn
      .then((response) => {
        console.log(response);
        // Nếu thêm lớp thành công, hiển thị thông báo
        toast.success("Class added successfully!"); // Toast thông báo thành công
        onClose(); // Đóng dialog
        const tokens = {
          accessToken: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken"),
        };

        dispatch(
          fetchListClass({
            tokens,
            teacherId,
          })
        );
      })
      .catch((error) => {
        // Lỗi sẽ được trả về từ .unwrap()
        toast.error(`Error: ${error.message || error}`);
      });
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}
    >
      <TextField
        label="Class Name"
        variant="outlined"
        value={className}
        onChange={(e) => {
          setClassName(e.target.value);
          setError(""); // Xóa lỗi khi người dùng bắt đầu sửa
        }}
        fullWidth
        required
        error={Boolean(error)} // Hiển thị lỗi nếu có
        helperText={error} // Hiển thị thông báo lỗi dưới input
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
      >
        Add Class
      </Button>
    </Box>
  );
};

export default CreateClass;
