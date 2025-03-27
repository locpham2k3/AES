import React, { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import LevelSelector from "./LevelSelector";
import { fetchLevels } from "../../redux/StudentSlide";

const StudentPage = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.level);

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    dispatch(fetchLevels(tokens));
  }, [dispatch]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Container sx={{ padding: "10px" }}>
      {/* <Box display="flex" justifyContent="center" alignItems="center">
        <LevelSelector levels={data} />
      </Box> */}
      <p>Welcome student</p>
    </Container>
  );
};

export default StudentPage;
