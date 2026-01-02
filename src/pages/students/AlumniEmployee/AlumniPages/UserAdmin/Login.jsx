import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { FaGraduationCap } from "react-icons/fa";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAlumni } from "../../../../../context/AlumniContext";
import { fetchGraduationData } from "../../../../../services/AlumniServices";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { config as appConfig } from "@config";

const AlumniLogin = () => {
 const backendUrl = appConfig.VITE_BACKEND_URL;
  const campusId = appConfig.VITE_CAMPUSID;

  const navigate = useNavigate();
  const {
    setApplicantNameEng,
    setProgramId,
    setBatchId,
    setCampusId,
    setGraduationApplicationId,
  } = useAlumni();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const loginMutation = useMutation({
    mutationFn: async (loginData) => {
      const response = await axios.post(
        `${backendUrl}/User/AlumniLogin`,
        loginData
      );
      return response.data;
    },
    onSuccess: async (data) => {
      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("authToken", data.tokenString);
        localStorage.setItem("programId", data.programId);
        localStorage.setItem("batchId", data.batchId);
        localStorage.setItem("campusId", data.campusId);
        localStorage.setItem("applicantNameEng", data.applicantNameEng);
        localStorage.setItem("studentAddress", data.studentAddress);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);
        localStorage.setItem("facultyName", data.facultyName);
        localStorage.setItem("levelName", data.levelName);
        localStorage.setItem("contactNo", data.contactNo);
        localStorage.setItem("programName", data.programName);
        localStorage.setItem("enrolledYear", data.enrolledYear);
        localStorage.setItem("passedYear", data.passedYear);
        localStorage.setItem("gpa", data.gpa);
        localStorage.setItem("institutionId", data.institutionId);
        localStorage.setItem(
          "graduationApplicationId",
          data.graduationApplicationId
        );
localStorage.setItem(
  "uploadPPSizePhoto",
  data.uploadPPSizePhoto ? data.uploadPPSizePhoto : ""
);

        toast.success(`Welcome, ${data.applicantNameEng} to your alumni!`);

        navigate("/alumni-admin");
      }
    },
    onError: (error) => {
      toast.error("Login failed. Check credentials and try again.");
      console.error(error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const loginData = {
      email: formData.email,
      password: formData.password,
      campusId: campusId,
      uniId: 0,
      isUgc: true,
    };

    loginMutation.mutate(loginData);
  };

  return (
    <Box className="bg-indigo-100 flex items-center justify-center p-9 pb-20">
      <Box className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side */}
        <Box className="md:w-1/2 bg-gradient-to-br from-purple-400 to-indigo-400 text-white flex flex-col items-center justify-center p-10 space-y-6">
          <FaGraduationCap className="text-7xl drop-shadow-md animate-bounce" />
          <Typography
            variant="h4"
            className="font-extrabold tracking-wide text-center"
          >
            Welcome to Our Alumni
          </Typography>
          <Typography
            variant="body1"
            className="text-lg leading-relaxed text-center"
          >
            You all are welcome to our campus. All alumni can be register/login
            to be in touch with your batchmate.
          </Typography>
        </Box>

        {/* Right Side */}
        <Box className="md:w-1/2 p-10 flex items-center justify-center">
          <Box className="w-full">
            <Typography
              variant="h5"
              className="pb-9 font-bold text-center text-indigo-800"
            >
              Alumni Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Box>
                <Typography className="text-gray-800 font-semibold pb-2 pl-2">
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  variant="outlined"
                  size="small"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 6,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography className="text-gray-800 font-semibold pb-2 pl-2">
                  Password
                </Typography>

                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  variant="outlined"
                  size="small"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 6,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              ></Box>

              {/* <Link
                  underline="none"
                  variant="body3"
                  color="#4f46e5"
                  className="cursor-pointer"
                >
                  Forgot password?
                </Link> */}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loginMutation.isPending}
                sx={{
                  backgroundColor: "#6366f1",
                  "&:hover": { backgroundColor: "#4f46e5" },
                  py: 1,
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 6,
                  boxShadow: 2,
                }}
              >
                {loginMutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                }}
              >
                Don’t have an alumni account?
              </Typography>

              <Link
                to="/alumni/register-alumni"
                style={{
                  textDecoration: "underline",
                  color: "#4f46e5",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Please Register Now
              </Link>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AlumniLogin;
