import React from "react";
import { Grid, Select, MenuItem } from "@mui/material";

const CategoryList = ({
  selectedCategory,
  handleCategoryChange,
  categories,
}) => {
  return (
    <Grid container justifyContent="center" style={{ margin: "20px 0" }}>
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        displayEmpty
      >
        <MenuItem value="">All Categories</MenuItem>
        {/* Map danh sách category */}
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  );
};

export default CategoryList;
