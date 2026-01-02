import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';
import { FormControl, InputLabel, IconButton, InputAdornment } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from '../../assets/defaultLogo.jpeg'

import {config} from '@config';

const StyledAvatar = styled(Avatar)({
  backgroundColor: '#ffffff',
  border: '2px solid #2B6EB5',
});

const StyledButton = styled(Button)({
  borderRadius: '20px',
  padding: '8px 16px',
});

const SignInLink = styled(Typography)({
  fontSize: '14px',
  fontWeight: '500',
  color: '#2B6EB5',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const Register = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const navigate = useNavigate();

  const password = watch('password'); 
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (data) => {
    try {
      await axios.post(`${backendUrl}/User`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/login');
      toast.success('Student successfully registered.', {
        autoClose: 1500
      });
    } catch (error) {
      toast.error('Student registration failed!', {
        autoClose: 1500
      });
    }
  };

  const handleClickShowPassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Container  component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 10,
          paddingX: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <StyledAvatar sx={{ m: 1, width: 40, height: 40 }}>
          <img src={logo} alt='logo' width={40} height={40}/>
        </StyledAvatar>
        <Typography component="h1" variant="h6" sx={{ mb: 1 }}>
          Student Sign Up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    autoComplete="off"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="middleName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="middleName"
                    label="Middle Name"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                    autoComplete="off"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    autoComplete="off"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: 'Phone number is required',
                  pattern: {
                    value: /^\d{10}$/,
                    message: 'Phone number must be 10 digits',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) {
                        setPhoneNumber(value);
                        field.onChange(e); // Notify react-hook-form of the change
                      }
                    }}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    autoComplete="off"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    autoComplete="off"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size='small'>
                <InputLabel required>Gender</InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      required
                      fullWidth
                      id="gender"
                      label='Gender'
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                      error={!!errors.gender}
                    >
                      <MenuItem value="" disabled>Select Gender</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  )}
                />
                {errors.gender && <Typography color="error" variant="body2">{errors.gender.message}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    label="Password"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    autoComplete="off"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleClickShowPassword('password')}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Confirm password is required',
                  validate: (value) => {
                    if (value !== password) {
                      return 'Passwords do not match';
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      required
                      fullWidth
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      label="Confirm Password"
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      autoComplete="off"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleClickShowPassword('confirmPassword')}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                    {confirmPassword && (
                      <Typography
                        color={confirmPassword === password ? 'success.main' : 'error.main'}
                        variant="body2"
                        sx={{ mt: 0.5 }}
                      >
                        {confirmPassword === password ? 'Passwords match' : 'Passwords do not match'}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>
          </Grid>
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Sign Up
          </StyledButton>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography fontSize='13px'>Have an account?</Typography>
            <Link to='/login'>
              <SignInLink> Sign in</SignInLink>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
