import React from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { Typography, Container, Box, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
`;

const ErrorPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  background-color: white;
`;

const animateTextBackground = keyframes`
  0% { background-position: 0 0; }
  25% { background-position: 100% 0; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0 100%; }
  100% { background-position: 0 0; }
`;

const ForbiddenTitle = styled.h1`
  font-size: 30vh;
  font-weight: bold;
  position: relative;
  margin: -8vh 0 0;
  padding: 0;
  color: #fff;

  &:after {
    content: attr(data-h1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    color: transparent;
    background: -webkit-repeating-linear-gradient(
      -45deg,
      #ff6b6b,
      #ff7f7f,
      #ff9e9e,
      #ffb8b8,
      #ff9e9e,
      #ff7f7f,
      #ff6b6b
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 400%;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.25);
    animation: ${animateTextBackground} 10s ease-in-out infinite;
  }

  @media (max-width: 767px) {
    font-size: 32vw;
  }
`;

const ForbiddenDescription = styled.p`
  color: #d6d6d6;
  font-size: 8vh;
  font-weight: bold;
  line-height: 10vh;
  max-width: 600px;
  position: relative;

  &:after {
    content: attr(data-p);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    color: transparent;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
  }

  @media (max-width: 767px) {
    font-size: 8vw;
    line-height: 10vw;
    max-width: 70vw;
  }
`;

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <>
      <GlobalStyle />
      <ErrorPage>
        <Box>
          <ForbiddenTitle data-h1="403">403</ForbiddenTitle>
          <ForbiddenDescription data-p="FORBIDDEN">
            FORBIDDEN
          </ForbiddenDescription>
          <Typography variant="body1" paragraph>
            You do not have permission to access this page.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
          >
            Go to Homepage
          </Button>
        </Box>
      </ErrorPage>
    </>
  );
};

export default Forbidden;
