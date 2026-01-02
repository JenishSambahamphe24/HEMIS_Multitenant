import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  CssBaseline,
} from '@mui/material';

const AdminUser = () => {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          height: '78vh',
          backgroundImage: 'url(https://images.unsplash.com/photo-1503676260728-1c00da094a0b)', // Change to your own background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {/* Gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
        />

        {/* Content */}
        <Container
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h2"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Welcome, Alumni!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Reconnect with your batchmates, celebrate achievements, and be part of a growing legacy.
          </Typography>
        
        </Container>
      </Box>
    </>
  );
};

export default AdminUser;
