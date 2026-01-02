import { Box, Typography, Button, Grid, Container } from "@mui/material";
import React from "react";
import { blue, grey } from "@mui/material/colors";
import Image from "../../../src/assets/undraw_online-test_20lm.png"; // Image path

export default function ExamSetupHome() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: grey[100],
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Left Side: Image */}
          <Grid item xs={12} md={6}>
            <img
              src={Image}
              alt="Online Test"
              style={{
                width: "100%",
                objectFit: "contain",
              }}
            />
          </Grid>

          {/* Right Side: Text and Button */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                marginBottom: 2,
                color: blue[700],
                textAlign: "left",
              }}
            >
              Welcome to the Exam Setup Module
            </Typography>
            <Typography
              variant="h6"
              sx={{
                marginBottom: 4,
                color: grey[700],
                textAlign: "left",
              }}
            >
              Get ready to manage your exams! Prepare yourself with the tools
              and environment you need to succeed.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
