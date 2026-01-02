import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
// import logo from "../../assets/defaultLogo.jpeg";
import axios from "axios";
import {config} from '@config';

const campusId = config.VITE_CAMPUSID;
const uniId = config.VITE_UNIVERSITYID;

function ForgetPassword() {
  const backendUrl=config.VITE_BACKEND_URL;
const baseUrl=config.VITE_BASE_URL;

  const [formData, setFormData] = useState({
    email: "",
    campusId: campusId,
    uniId: uniId,
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
    const [defaultLogo, setDefaultLogo] = useState("");
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${backendUrl}/University/${uniId}`);
          const defaultLogo = response?.data?.logo;
          setDefaultLogo(defaultLogo);
        } catch (err) {
          console.log(err);
        }
      };
      
      fetchData();
    }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/User/GetCodeUser?email=${encodeURIComponent(
          formData.email
        )}&collegeId=${formData.campusId}&uniId=${formData.uniId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        setStatus("success");
      } else if (response.status === 404) {
        setStatus("error");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setStatus(null);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={5} sx={{borderRadius: "15px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          {/* <img src={logo} alt="logo" style={{ height: "45px" }} /> */}
          {defaultLogo && (
            <img
              src={`${baseUrl}/${defaultLogo}`}
              alt="logo"
              style={{ height: "45px" }}
            />
          )}
          <Typography component="h1" variant="h5">
            Reset Password 
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              size="small"
              label="Please enter a valid email address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Typography color="primary" fontSize="12px">
              A reset link will be sent to your email if the account is found
              with the entered address.
            </Typography>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "12rem", mx: "auto", mt: ".7rem" }}
              size="small"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Success or Error Message */}
            {status === "success" && (
              <Box
                sx={{
                  mt: "1rem",
                  color: "green",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CheckCircleIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  A reset link has been sent to your email. Please Check your
                  Email.
                </Typography>
              </Box>
            )}
            {status === "error" && (
              <Box
                sx={{
                  mt: "1rem",
                  color: "red",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ErrorIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Failed to send reset link. Please check the email address and
                  try again.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default ForgetPassword;
