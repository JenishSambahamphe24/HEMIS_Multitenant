// NotFound.js
import React from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      mt={5}
      spacing={4}
      style={{ minHeight: '10vh', padding: '20px' }}
    >
      <Grid item>
        <Typography variant="h1" color="primary" gutterBottom>
          Oops!
        </Typography>
        <Typography variant="h3" gutterBottom>
          404 Error: Page not found
        </Typography>
        <Typography variant="body1" gutterBottom>
          The page you're looking for does not exist.
        </Typography>
      </Grid>
      <Grid item>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
        >
          Go to homepage
        </Button>
      </Grid>
    </Grid>
  );
}

export default NotFound;
