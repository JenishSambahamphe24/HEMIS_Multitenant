
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {  getFiscalYear, getProgram } from '../../../services/services';
import { getStudentById } from '../../../services/employeeService';
import {config} from '@config';


const EnrollmentForm = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const location = useLocation();
  const studentId = location.state?.id || 0;

  const { handleSubmit } = useForm();
  const [formData, setFormData] = useState({
    studentId: '',
    feeType: '',
    programFee: '',
    feeToPay: '',
    haveScholarship: false,
    scholarshipAmount: '',
    batch: '',
    rollNo: '',
    faculty: '',
    level: '',
    program: '',
    yearSemesterType: '',
    yearSemester: '',
    dateOfPayment: new Date().toISOString().split('T')[0],
    admissionYear: '',
    uploadReceipt: null,
    fiscalYear: '',
    remarks: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [feeOptions, setFeeOptions] = useState([]);
  const [yearSemesterOptions, setYearSemesterOptions] = useState([]);

  useEffect(() => {
    const fetchFiscalYears = async () => {
      try {
        const data = await getFiscalYear();
        setFiscalYears(data.map(item => item.yearEnglish || item)); // Adjust based on the response structure
      } catch (err) {
        console.error('Error fetching fiscal years:', err);
      }
    };

    const fetchStudentData = async () => {
      try {
        const data = await getStudentById(studentId);
        if (data) {
          setFormData(prev => ({
            ...prev,
            ...data,
            studentId: data.studentId || '',
          }));
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
      }
    };

    const fetchProgramData = async () => {
      try {
        const data = await getProgram();
        setProgramData(data.programs || []); // Set programData to be an array of programs
        setFeeOptions(data.feeTypes || []);
        
        const newYearSemesterOptions = data.programs?.reduce((acc, program) => {
          const { name, years, semesters } = program;
          const options = [];
          if (formData.yearSemesterType === 'Year') {
            for (let i = 1; i <= years; i++) {
              options.push(`${i} Year`);
            }
          } else if (formData.yearSemesterType === 'Semester') {
            for (let i = 1; i <= semesters; i++) {
              options.push(`${i} Semester`);
            }
          }
          acc[name] = options;
          return acc;
        }, {});
        setYearSemesterOptions(newYearSemesterOptions || {});
      } catch (err) {
        console.error('Error fetching program data:', err);
      }
    };

    fetchFiscalYears();
    fetchStudentData();
    fetchProgramData();
  }, [studentId, formData.yearSemesterType]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onSubmit = () => {
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'uploadReceipt' && formData[key]) {
            formDataToSend.append('receipt', formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      const response = await axios.post(`${backendUrl}/Enrollment`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setOpenDialog(false);
        // Optionally clear the form or redirect
      } else {
        throw new Error('Failed to enroll');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const getYearSemesterOptions = () => {
    return yearSemesterOptions[formData.program] || [];
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Payment Form
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="studentId"
                  label="Student ID"
                  value={formData.studentId}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{display: 'none'}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Fee Type</InputLabel>
                  <Select
                    name="feeType"
                    value={formData.feeType}
                    onChange={handleChange}
                    label="Fee Type"
                    required
                  >
                    {feeOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name} {/* Ensure `option.name` is a string */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="programFee"
                  label="Program Fee"
                  value={formData.programFee}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="feeToPay"
                  label="Paid Amount"
                  value={formData.feeToPay}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.haveScholarship}
                      onChange={handleChange}
                      name="haveScholarship"
                      color="primary"
                    />
                  }
                  label="Have a Scholarship?"
                />
              </Grid>
              {formData.haveScholarship && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="scholarshipAmount"
                    label="Scholarship Amount"
                    value={formData.scholarshipAmount}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}                     sx={{display:'none'}}
>
                <TextField
                  name="batch"
                  label="Batch"
                  value={formData.batch}
                  onChange={handleChange}
                  fullWidth
                  sx={{display:'none'}}

                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}                     sx={{display:'none'}}
>
                <TextField
                  name="rollNo"
                  label="Roll No"
                  value={formData.rollNo}
                  onChange={handleChange}
                  fullWidth
                  sx={{display:'none'}}

                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}                     sx={{display:'none'}}
>
                <TextField
                  name="faculty"
                  label="Faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  fullWidth
                  sx={{display:'none'}}

                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}                     sx={{display:'none'}}
>
                <TextField
                  name="level"
                  label="Level"
                  value={formData.level}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{display:'none'}}

                />
              </Grid>
              <Grid item xs={12} sm={6}                     sx={{display:'none'}}
>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel                       sx={{display:'none'}}
>Program</InputLabel>
                  <Select
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    label="Program"
                    required
                    sx={{display:'none'}}

                  >
                    {programData.map((program) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.programName} {/* Ensure `program.programName` is a string */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}                     sx={{display:'none'}}
>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel                       sx={{display:'none'}}
>Year/Semester Type</InputLabel>
                  <Select
                    name="yearSemesterType"
                    value={formData.yearSemesterType}
                    onChange={handleChange}
                    label="Year/Semester Type"
                    required
                    sx={{display:'none'}}

                  >
                    <MenuItem value="Year">Year</MenuItem>
                    <MenuItem value="Semester">Semester</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formData.program && (
                <Grid item xs={12} sm={6}                     sx={{display:'none'}}
>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Year/Semester</InputLabel>
                    <Select
                      name="yearSemester"
                      value={formData.yearSemester}
                      onChange={handleChange}
                      label="Year/Semester"
                      sx={{display:'none'}}
                      required

                    >
                      {getYearSemesterOptions().map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} sm={6}                     sx={{display:'none'}}
>
                <TextField
                  name="dateOfPayment"
                  label="Date of Payment"
                  type="date"
                  value={formData.dateOfPayment}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{display:'none'}}

                />
              </Grid>
              <Grid item xs={12} sm={6}                     sx={{display:'none'}}
>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel                       sx={{display:'none'}}
>Admission Year</InputLabel>
                  <Select
                    name="admissionYear"
                    value={formData.admissionYear}
                    onChange={handleChange}
                    label="Admission Year"
                    required
                    

                  >
                    {fiscalYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to submit the form?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EnrollmentForm;
