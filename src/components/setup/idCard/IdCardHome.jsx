import { Box, Typography, Button, Grid, Container } from "@mui/material";
import React from "react";
import { blue, grey } from "@mui/material/colors";
import IdCardImage from "../../../assets/Identity_card_home.png";
import AddCardIcon from "@mui/icons-material/AddCard";
import { Link } from "react-router-dom";

export default function IdCardHome() {
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
              Get Access to Student's e-identity card
            </Typography>
            <Typography
              variant="h6"
              sx={{
                marginBottom: 4,
                color: grey[700],
                textAlign: "left",
              }}
            >
              Get student's e-identity card here, Click apply for getting the
              student's identity card
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
            >
              {/* <Grid item xs={12} sm={6} md={12} lg={8}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/student-management/student-list-for-id"
                  size="sm"
                  fullWidth
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <AddCardIcon sx={{ mr: 1 }} />
                  Get Individual Identity Card
                </Button>
              </Grid> */}

              <Grid item xs={12} sm={6} md={12} lg={8}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/student-management/all-student-cards"
                  size="sm"
                  fullWidth
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <AddCardIcon sx={{ mr: 1 }} />
                  Get All Identity Cards
                </Button>
              </Grid>

              <Grid item xs={12} sm={8} md={12} lg={8}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/student-management/generated-id-cards"
                  size="sm"
                  fullWidth
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "5px"
                  }}
                >
                  <AddCardIcon sx={{ mr: 1 }} />
                  View Generated Identity Cards
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
