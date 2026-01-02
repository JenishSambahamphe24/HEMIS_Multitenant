import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
} from "@mui/material";

const UpdatingSoonPage = () => {
  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          mt: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Currently working. Check back soon!{" "}
        </Typography>

        <Box sx={{ marginTop: 3 }}>
          <Button variant="outlined" href="/">
            Go Back to Homepage
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default UpdatingSoonPage;
