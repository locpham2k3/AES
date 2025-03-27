import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Để điều hướng

// Component hiển thị danh sách các card
const WorkbookCardList = ({ essays }) => {
  const navigate = useNavigate(); // Hook để điều hướng

  const handleCardClick = (essayId) => {
    // Điều hướng đến một trang khác khi nhấn vào card
    navigate(`/student/essay/${essayId}`);
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center" // Căn giữa các item
      style={{ marginTop: "20px", textAlign: "center" }} // Căn giữa văn bản và các phần tử
    >
      {essays.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No data
        </Typography>
      ) : (
        essays.map((essay) => (
          <Grid item key={essay.id}>
            <Card
              variant="outlined"
              sx={{ width: "250px", height: "250px" }} // Đặt width và height cố định
            >
              <CardActionArea onClick={() => handleCardClick(essay.id)}>
                {/* Hiển thị ảnh */}
                <img
                  src={essay.image} // Giả sử bài viết có thuộc tính `image`
                  alt={essay.name}
                  style={{ width: "100%", height: "50px", objectFit: "cover" }} // Đặt kích thước cho ảnh
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ height: "40px", overflow: "hidden" }}
                  >
                    {/* Giới hạn chiều cao của tiêu đề */}
                    {essay.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      height: "60px", // Giới hạn chiều cao cho description
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={essay.description} // Hiển thị toàn bộ description khi rê chuột vào
                  >
                    {essay.description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Created: {essay.createDate} | Edited: {essay.editDate}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default WorkbookCardList;
