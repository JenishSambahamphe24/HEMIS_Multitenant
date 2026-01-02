import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import Image from "../../assets/undraw_scrum-board_uqku.png";
import FilterStudent from "../examManagement/bulkExamAttend/FilterStudent";

const StudentManagementHome = () => {
  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
              Welcome to the Student Management Module
            </Typography>
            <Typography
              variant="h6"
              sx={{
                marginBottom: 4,
                color: grey[700],
                textAlign: "left",
              }}
            >
              Get ready to manage your Students! Prepare yourself with the tools
              and environment you need to succeed.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentManagementHome;
