import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { signOut } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { MdLockReset } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import {config} from '@config';

const campusId = config.VITE_CAMPUSID;

const PasswordReset = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const baseUrl=config.VITE_BASE_URL;
  const { email, token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    email: email || "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false
  });
  
  const [defaultLogo, setDefaultLogo] = useState("");
  const [collegeName, setCollegeName] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    if (email) {
      setFormData((prevState) => ({
        ...prevState,
        email: decodeURIComponent(email),
      }));
    }
  }, [email]);

  // Fetch campus data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true);
        const response = await axios.get(`${backendUrl}/Campus/${campusId}`);
        const logo = response?.data?.logo;
        setCollegeName(response.data.campusName);
        setDefaultLogo(logo || "");
      } catch (err) {
        console.error("Error fetching campus logo:", err);
        toast.error("Could not load campus logo", { id: "logo-error" });
      } finally {
        setLocalLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const clearAuthState = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionExpiry");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("email");
    sessionStorage.clear();
    dispatch(signOut());
  };

  const validatePasswords = () => {
    if (!formData.newPassword.trim()) {
      toast.error("New password cannot be empty.");
      return false;
    }
    
    if (!formData.confirmPassword.trim()) {
      toast.error("Please confirm your password.");
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    try {
      setLocalLoading(true);
      const response = await axios.post(
        `${backendUrl}/User/ResetPassword`,
        {
          email: formData.email,
          newPassword: formData.newPassword,
          resetToken: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success(
          "Your password has been successfully reset. Redirecting to sign-in page...",
          {
            duration: 3000,
          }
        );

        setFormVisible(false);
        clearAuthState();
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.response?.status === 400) {
        toast.error("Invalid or expired reset token. Please request a new password reset.");
      } else {
        toast.error("An error occurred. Please check your input and try again.");
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleNavigateToLogin = () => {
    clearAuthState();
    navigate("/login", { replace: true });
  };

  // Check if form is valid for submission
  const isFormValid = 
    formData.newPassword.trim().length >= 6 && 
    formData.confirmPassword.trim().length >= 6 &&
    formData.newPassword === formData.confirmPassword;

  const passwordsMatch = formData.newPassword === formData.confirmPassword;
  const showPasswordMismatch = formData.confirmPassword.length > 0 && !passwordsMatch;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center'
      }}
      className='my-1'
    >
      <Box
        sx={{
          background: '#2b6eb5',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          height: '400px',
          width: '400px'
        }}
        className='rounded-l-md'
      >
        <Box
          sx={{
            textAlign: 'center',
            zIndex: 1,
            maxWidth: 400,
          }}
          className='px-4'
        >
          {defaultLogo && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src={`${baseUrl}/${defaultLogo}`}
                alt="Campus logo"
                style={{
                  height: "80px",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}
          <h1 className="text-3xl font-bold my-2">
            Welcome To
            <div className="text-2xl font-bold">
              {collegeName}
            </div>
          </h1>
          <h1 className="text-lg">
            Create a new secure password to regain access to your account and continue managing your dashboard.
          </h1>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e0e0e0',
          height: '400px',
          width: '500px'
        }}
        className="rounded-r-md"
      >
        <Paper
          elevation={0}
          sx={{
            padding: 0,
            width: 400,
            backgroundColor: 'white',
          }}
        >
          <Box className='px-3 py-2'>
            {formVisible ? (
              <>
                <Box
                  sx={{
                    width: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: '#1e3c72',
                      width: 44,
                      height: 44,
                    }}
                  >
                    <MdLockReset />
                  </Avatar>

                  <h1 className='text-md font-medium text-[#2b6eb5]'>
                    Reset Password
                  </h1>
                  <h1 className='text-sm'>
                    Enter your new password below
                  </h1>
                </Box>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ width: '100%' }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      mb: '3px',
                      fontWeight: 500,
                      color: '#333',
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    disabled={true}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" sx={{ color: '#666' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: '10px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f0f0f0',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                      },
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      mb: '3px',
                      fontWeight: 500,
                      color: '#333',
                    }}
                  >
                    New Password
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    name="newPassword"
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={localLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" sx={{ color: '#666' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility('newPassword')}
                            edge="end"
                            size="small"
                          >
                            {showPasswords.newPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: '10px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1e3c72',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1e3c72',
                        },
                      },
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      mb: '3px',
                      fontWeight: 500,
                      color: '#333',
                    }}
                  >
                    Confirm Password
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    name="confirmPassword"
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={localLoading}
                    error={showPasswordMismatch}
                    helperText={showPasswordMismatch ? "Passwords do not match" : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" sx={{ color: '#666' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                            edge="end"
                            size="small"
                          >
                            {showPasswords.confirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: '10px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                        '& fieldset': {
                          borderColor: showPasswordMismatch ? '#d32f2f' : '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: showPasswordMismatch ? '#d32f2f' : '#1e3c72',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: showPasswordMismatch ? '#d32f2f' : '#1e3c72',
                        },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    disabled={!isFormValid || localLoading}
                    sx={{
                      marginInline: 'auto',
                      bgcolor: '#1e3c72',
                      '&:hover': {
                        bgcolor: '#2b6eb5',
                      },
                      '&:disabled': {
                        bgcolor: '#cccccc',
                      },
                    }}
                  >
                    {localLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  py: 4
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#4caf50',
                    width: 54,
                    height: 54,
                    mb: 2,
                  }}
                >
                  ✓
                </Avatar>
                <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                  Password Reset Successful!
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                  Your password has been successfully reset. You can now sign in with your new password.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleNavigateToLogin}
                  sx={{
                    bgcolor: '#1e3c72',
                    '&:hover': {
                      bgcolor: '#2b6eb5',
                    },
                  }}
                >
                  Go to Sign In
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default PasswordReset;