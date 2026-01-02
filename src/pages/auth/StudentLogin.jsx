import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { CircularProgress, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/defaultLogo.jpeg";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import {config} from '@config';

const id = config.VITE_API_KEY;

const StudentLogin = () => {
  const backendUrl=config.VITE_BACKEND_URL;
const baseUrl=config.VITE_BASE_URL;
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const { loading, currentUser } = useSelector((state) => state.user);
  const [defaultLogo, setDefaultLogo] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";
  useEffect(() => {
    const fetchData = async (id) => {
      if (!id) return;
      try {
        const response = await axios.get(`${backendUrl}/University/${id}`);
        const defaultLogo = response.data.logo;
        setDefaultLogo(defaultLogo);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData(id);
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      navigate(redirectPath);
    }
  }, [currentUser, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required.", { autoClose: 1500 });
      return;
    }

    dispatch(signInStart());

    try {
      const response = await axios.post(`${backendUrl}/User/StudentLogin`, {
        ...formData,
        rememberMe,
      });

      if (response.data.listUser && response.data.listUser.length === 0) {
        dispatch(signInSuccess({ user: response.data, rememberMe }));
        navigate("/student-home");
      } else {
        dispatch(signInSuccess({ user: response.data, rememberMe }));
        navigate(redirectPath);
      }

      toast.success("Successfully Logged In!!", { autoClose: 1500 });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("API endpoint not found.");
      } else {
        dispatch(signInFailure(err.message));
        toast.error(err.message, { autoClose: 1500 });
      }
    } finally {
      if (!currentUser) {
        dispatch(signInFailure());
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={5} sx={{ mt: "2rem", borderRadius: "15px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ height: "45px" }}
          />
          <Typography component="h1" variant="h5">
            Student Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              size="small"
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              size="small"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              size="small"
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
            >
              Student Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  to="/passwordReset"
                  variant="body2"
                  style={{ textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item display="flex">
                <Typography fontSize="13px">Don't have an Account?</Typography>
                <Link
                  style={{ textDecoration: "none" }}
                  to="/register"
                  variant="body2"
                >
                  <Typography fontSize="13px">Sign Up</Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentLogin;
