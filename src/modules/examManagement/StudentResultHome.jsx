import { Box, Typography, Button, Grid, Container } from "@mui/material";
import React from "react";
import { blue, grey } from "@mui/material/colors";
import IdCardImage from "../../assets/resultImage.png";
import AddCardIcon from "@mui/icons-material/AddCard";
import { Link } from "react-router-dom";

export default function StudentResultHome() {
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
          <Grid item xs={12} md={4}>
            <img
              src={IdCardImage}
              alt="Identity Card"
              style={{
                width: "100%",
                objectFit: "contain",
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                marginBottom: 2,
                color: blue[700],
                textAlign: "left",
              }}
            >
              Get Student's Result
            </Typography>
            <Typography
              variant="h6"
              sx={{
                marginBottom: 4,
                color: grey[700],
                textAlign: "left",
              }}
            >
              Get student's result here, Click below to get the student's Results
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/exam-management/results?resultType=individual"
            >
              {" "}
              <AddCardIcon />{" "}
              <span style={{ marginLeft: "5px" }}>
                {" "}
                Get Individual Results{" "}
              </span>{" "}
            </Button>
            <Button
              sx={{
                marginLeft: "18px",
              }}
              variant="contained"
              color="primary"
              component={Link}
              to="/exam-management/results?resultType=all"
            >
              {" "}
              <AddCardIcon />{" "}
              <span style={{ marginLeft: "5px" }}>
                {" "}
                Get All Results{" "}
              </span>{" "}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
