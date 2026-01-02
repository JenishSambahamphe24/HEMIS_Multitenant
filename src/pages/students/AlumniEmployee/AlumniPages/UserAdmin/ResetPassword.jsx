import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "@config";


export default function ResetPasswordPage() {
  
  const backendUrl = config.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const { email: emailParam} = useParams();
const verificationToken = localStorage.getItem("alumni_verification_token");

  const [values, setValues] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (emailParam) {
      setValues((v) => ({ ...v, email: decodeURIComponent(emailParam) }));
    }
  }, [emailParam]);

  const handleChange = (prop) => (e) => {
    setValues((v) => ({ ...v, [prop]: e.target.value }));
    if (errors[prop]) setErrors((err) => ({ ...err, [prop]: "" }));
  };

  const toggleVisibility = (field) => {
    setValues((v) => ({ ...v, [field]: !v[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.newPassword)
      newErrors.newPassword = "New password is required";

    if (values.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";

    if (!values.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";

    if (values.newPassword !== values.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!verificationToken) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    const payload = {
      email: values.email,
      resetToken: verificationToken,
      newPassword: values.newPassword,
    };

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/User/ResetPasswordAlumni`, payload);

      toast.success("Password reset successfully!");
      navigate("/alumni-admin");
    } catch (err) {
      toast.error(err.response?.data || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 9,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
        Reset Password
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={values.email}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />

        <TextField
          label="New Password"
          type={values.showPassword ? "text" : "password"}
          value={values.newPassword}
          onChange={handleChange("newPassword")}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          fullWidth
          required
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => toggleVisibility("showPassword")}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          type={values.showConfirmPassword ? "text" : "password"}
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          fullWidth
          required
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    toggleVisibility("showConfirmPassword")
                  }
                  edge="end"
                >
                  {values.showConfirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} />}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Box>
  );
}
