// src/pages/AlumniOtpVerification.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "@config";

export default function AlumniOtpVerification() {
  const backendUrl = config.VITE_BACKEND_URL;

  const { email: emailParam, otp: otpParam } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = decodeURIComponent(emailParam);

  useEffect(() => {
    // Optional: pre-fill OTP from URL if exists
    if (otpParam) setOtp(decodeURIComponent(otpParam));
  }, [otpParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/User/AlumniLogin`, {
        email,
        password: otp,
        cOllegeId: config.VITE_CAMPUSID,
        uniId: config.VITE_UNIVERSITYID,
        isUgc: config.VITE_ISUGC === "true",
      });

      const verificationToken = response.data?.value?.verificationToken;

      if (!verificationToken) {
        toast.error("Invalid OTP. Please try again.");
        setLoading(false);
        return;
      }
    localStorage.setItem("alumni_verification_token", verificationToken);

      toast.success("OTP verified! Please reset your password.");

      navigate(
        `/alumni/reset-password/${encodeURIComponent(
          email
        )}`
      );
    } catch (error) {
      console.error(error);
      toast.error("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" fontWeight={600}>
        Verify OTP
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          fullWidth
          disabled
        />

        <TextField
          label="OTP / Temporary Password"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </Box>
  );
}
