import React from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.grey[200],
}));

const EnrollCourse = () => {
  const navigate = useNavigate(); // Updated to correctly use navigate
  const campuses = [
    { id: 1, programName: 'BSc. CS IT', level: 'Bachelors', university: 'TU', name: 'Campus A', openingDate: '2024-08-01', closingDate: '2024-08-31' },
    { id: 2, programName: 'BSc. CS IT', level: 'Bachelors', university: 'TU', name: 'Campus B', openingDate: '2024-09-01', closingDate: '2024-09-30' },
    { id: 3, programName: 'BSc. CS IT', level: 'Bachelors', university: 'TU', name: 'Campus C', openingDate: '2024-10-01', closingDate: '2024-10-31' },
    { id: 4, programName: 'BSc. CS IT', level: 'Bachelors', university: 'TU', name: 'Campus D', openingDate: '2024-11-01', closingDate: '2024-11-30' },
  ];

  const handleApply = (campus) => {
    navigate('/student-register', { state: { campusId: campus.id } }); // Pass the campus ID as state
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Following are the admission Opended course 
        </Typography>
        <Typography component="p" variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Click on apply to Enroll
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 1, borderRadius: 2, boxShadow: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>SNo</StyledTableCell>
                <StyledTableCell>Program Name</StyledTableCell>
                <StyledTableCell>Level Name</StyledTableCell>
                <StyledTableCell>College Name</StyledTableCell>
                <StyledTableCell>Affiliated University</StyledTableCell>
                <StyledTableCell>Opening Date</StyledTableCell>
                <StyledTableCell>Closing Date</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campuses.map((campus) => (
                <TableRow key={campus.id} hover>
                  <TableCell>{campus.id}</TableCell>
                  <TableCell>{campus.programName}</TableCell>
                  <TableCell>{campus.level}</TableCell>
                  <TableCell>{campus.name}</TableCell>
                  <TableCell>{campus.university}</TableCell>
                  <TableCell>{campus.openingDate}</TableCell>
                  <TableCell>{campus.closingDate}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleApply(campus)}
                    >
                      Apply Form
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default EnrollCourse;
