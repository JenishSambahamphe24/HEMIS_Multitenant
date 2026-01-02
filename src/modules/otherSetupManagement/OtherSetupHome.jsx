import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import Image from "../../assets/undraw_scrum-board_uqku.png"

const OtherSetupHome = () => {
  return (
    <div>
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
                Welcome to the Setup Module
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 4,
                  color: grey[700],
                  textAlign: "left",
                }}
              >
                Welcome to the Setup Module – your control center for managing Sections and Departments.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default OtherSetupHome;
