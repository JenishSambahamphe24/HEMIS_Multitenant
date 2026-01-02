import { Box, Container, Grid, Typography, Button } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import Image from "../../../assets/AlumniImg.jpg";
import { Link } from "react-router-dom";

function AlumniHome() {
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
          <Grid container gap="20px" alignItems="center">
            <Grid item bgcolor="red" xs={12} md={5.5}>
              <img
                src={Image}
                alt="Online Test"
                style={{
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            </Grid>

            <Grid item xs={12} md={5.5}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  color: blue[700],
                  textAlign: "left",
                }}
              >
                Welcome to the Alumni management Module
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 4,
                  color: grey[700],
                  textAlign: "left",
                }}
              >
                This module helps alumni stay connected with the college
                community, manage their profiles, view registration history, and
                access reports.
              </Typography>
              <Button
                size="small"
                variant="outlined"
                sx={{ textTransform: "capitalize" }}
              >
                <Link to="/Alumni/register">Register Alumni</Link>
              </Button>
              <Button
                size="small"
                variant="outlined"
                sx={{ textTransform: "capitalize", ml: "20px" }}
              >
                <Link to="/Alumni/Alumni-list">Alumni List</Link>
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
}

export default AlumniHome