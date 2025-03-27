import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Tab,
  Tabs,
  Typography,
  Box,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PendingIcon from "@mui/icons-material/Pending";
import HistoryIcon from "@mui/icons-material/History";
import ListEssayGrade from "./ListEssayGrade";

const FeedbackClass = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Paper
        sx={{
          borderRadius: 2,
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        <Box sx={{ mb: 1, mt: 1, mx: 1, fontSize: "0.875rem" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="contained"
            onClick={handleBack}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              "&:hover": {
                bgcolor: "grey.100",
              },
              fontWeight: "bold",
              boxShadow: 2,
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "0.75rem",
            }}
          >
            Back
          </Button>
        </Box>

        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            p: 2,
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            fontSize: "0.875rem",
            width: "90%",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="600"
            sx={{
              letterSpacing: "0.5px",
              textAlign: "center",
              fontSize: "1.25rem",
            }}
          >
            Feedback Management
          </Typography>
        </Box>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="feedback tabs"
          sx={{
            px: 3,
            pt: 3,
            bgcolor: "background.paper",
            "& .MuiTab-root": {
              minHeight: 64,
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            },
            "& .Mui-selected": {
              color: "primary.main",
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab
            icon={<PendingIcon />}
            iconPosition="start"
            label="Pending Feedback"
          />
          <Tab
            icon={<HistoryIcon />}
            iconPosition="start"
            label="Feedback History"
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabIndex === 0 && <ListEssayGrade classId={id} isHistory={0} />}
          {tabIndex === 1 && <ListEssayGrade classId={id} isHistory={1} />}
        </Box>
      </Paper>
    </>
  );
};

export default FeedbackClass;
