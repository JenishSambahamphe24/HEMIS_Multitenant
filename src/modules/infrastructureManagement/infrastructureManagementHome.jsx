import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "../../assets/undraw_working-remotely_ivtz.png";
import { blue, grey } from "@mui/material/colors";

const InfrastructureManagement = () => {
  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
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
              Welcome to the Infrastructure Management Module
            </Typography>
            <Typography
              variant="h6"
              sx={{
                marginBottom: 4,
                color: grey[700],
                textAlign: "left",
              }}
            >
              Get ready to manage your Infrastructure! Prepare yourself with the tools
              and environment you need to succeed.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InfrastructureManagement;
