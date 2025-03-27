import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import WorkbookCardList from "./WorkbookCardList";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkbooks, fetchCategories } from "../../redux/StudentSlide"; // Import thêm fetchCategories
import CategoryList from "./CategoryList"; // Import ListCategory component

const LevelButton = styled(Paper)(({ selected }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  cursor: "pointer",
  border: selected ? "3px solid #76ff03" : "3px solid #ccc",
  backgroundColor: selected ? "#76ff03" : "#f5f5f5",
  transition: "all 0.3s ease",
  outline: "none",
  "&:hover": {
    border: "3px solid #76ff03",
    backgroundColor: "#e0e0e0",
  },
}));

const LevelSelector = ({ levels }) => {
  const dispatch = useDispatch();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  useEffect(() => {
    if (levels.length > 0) {
      setSelectedLevel(levels[0].id);
    }
  }, [levels]);

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    if (selectedLevel) {
      dispatch(fetchWorkbooks({ tokens, selectedLevel }));
    }
  }, [dispatch, selectedLevel]);

  // Dispatch fetchCategories khi component được mount
  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchCategories(tokens)); // Gọi API lấy categories
  }, [dispatch]);

  // Lấy dữ liệu từ redux
  const workbookState = useSelector((state) => state.workbook);
  const categoryState = useSelector((state) => state.category);
  const {
    workbook,
    loading: workbookLoading,
    error: workbookError,
  } = workbookState;
  const {
    category: categories,
    loading: categoryLoading,
    error: categoryError,
  } = categoryState;
  // console.log(categories);
  if (workbookLoading || categoryLoading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "300px" }}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" style={{ marginLeft: "10px" }}>
          Loading...
        </Typography>
      </Grid>
    );
  }

  if (workbookError || categoryError) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Alert severity="error">
          <Typography variant="h6">
            Error: {workbookError || categoryError}
          </Typography>
        </Alert>
      </Grid>
    );
  }

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const filteredEssays = workbook.filter(
    (essay) =>
      (!selectedLevel || essay.levelId === selectedLevel) &&
      (!selectedCategory ||
        essay.workbookCategoryId === parseInt(selectedCategory))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEssays = filteredEssays.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEssays.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid
          item
          xs={12}
          style={{ textAlign: "center", marginBottom: "10px" }}
        >
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            Select Level
          </Typography>
        </Grid>
        {levels.map((level) => (
          <Grid item key={level.id}>
            <LevelButton
              selected={selectedLevel === level.id}
              onClick={() => handleLevelSelect(level.id)}
              tabIndex={0}
            >
              <Typography
                variant="body2"
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                {level.levelName}
              </Typography>
            </LevelButton>
          </Grid>
        ))}
      </Grid>

      {/* Sử dụng component ListCategory và truyền danh sách categories */}
      <CategoryList
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        categories={categories} // Truyền danh sách category từ Redux state
      />

      <WorkbookCardList essays={currentEssays} />

      <Grid
        container
        justifyContent="center"
        spacing={2}
        style={{ marginTop: "20px" }}
      >
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <Button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              disabled={currentPage === pageNumber}
              variant={currentPage === pageNumber ? "contained" : "outlined"}
            >
              {pageNumber}
            </Button>
          )
        )}
      </Grid>
    </div>
  );
};

export default LevelSelector;
