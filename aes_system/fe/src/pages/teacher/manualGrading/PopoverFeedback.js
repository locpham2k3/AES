import React from "react";
import {
  Popover,
  Box,
  Grid,
  Button,
  Autocomplete,
  CircularProgress,
  TextField,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PopoverFeedback = ({
  anchorEl,
  popoverPosition,
  onClose,
  selectedErrorType,
  setSelectedErrorType,
  selectedSubError,
  setSelectedSubError,
  categoryData,
  categoryLoading,
  decodedSubCategories,
  subCategoriesLoading,
  subCategoriesError,
  feedback,
  handleFeedbackChange, // Nhận hàm trực tiếp để cập nhật nội dung
  handleSaveFeedback,
  selectedText,
  setTempHighlight,
  // isReviewMode,
}) => {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorReference="anchorPosition"
      anchorPosition={popoverPosition}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box sx={{ p: 2, minWidth: 300 }}>
        <Grid container spacing={2}>
          {/* Error Type and Subcategory Selection */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Autocomplete
                  value={selectedErrorType}
                  onChange={(event, newValue) => {
                    setSelectedErrorType(newValue);
                    setSelectedSubError(null);

                    setTempHighlight((prev) => ({
                      ...prev,
                      errorType: newValue ? newValue.name : null,
                    }));
                  }}
                  options={categoryData || []}
                  loading={categoryLoading}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select or Search Category"
                      fullWidth
                      error={Boolean(subCategoriesError)}
                      helperText={
                        subCategoriesError ? "Failed to load categories" : ""
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {categoryLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              {selectedErrorType && (
                <Grid item xs={6}>
                  <Autocomplete
                    value={selectedSubError}
                    onChange={(event, newValue) => {
                      setSelectedSubError(newValue);
                    }}
                    options={
                      selectedSubError
                        ? Array.from(
                            new Set([
                              ...decodedSubCategories,
                              selectedSubError,
                            ]),
                            (item) => item.mistakeId
                          ).map((id) =>
                            [...decodedSubCategories, selectedSubError].find(
                              (item) => item.mistakeId === id
                            )
                          )
                        : decodedSubCategories
                    }
                    loading={subCategoriesLoading}
                    getOptionLabel={(option) => option.description || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.mistakeId === value.mistakeId
                    }
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        key={`${option.mistakeId}-${option.description}`}
                      >
                        {option.description}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select or Search Mistake"
                        fullWidth
                        error={Boolean(subCategoriesError)}
                        helperText={
                          subCategoriesError ? "Failed to load mistakes" : ""
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {subCategoriesLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Text Editor for Feedback */}
          <Grid item xs={12} sx={{ paddingBottom: 5 }}>
            <ReactQuill
              theme="snow"
              value={feedback}
              onChange={handleFeedbackChange} // Truyền nội dung trực tiếp vào `handleFeedbackChange`
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline"],
                  ["link", "image"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["clean"],
                ],
              }}
              style={{ height: 200 }}
            />
          </Grid>

          {/* Save Feedback Button */}
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveFeedback}
              disabled={!selectedSubError} // Vô hiệu hóa nếu chưa chọn subError
            >
              Save Feedback
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Popover>
  );
};

export default PopoverFeedback;
