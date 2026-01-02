import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SimplePasswordChange() {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (prop) => (e) => {
    setValues((v) => ({ ...v, [prop]: e.target.value }));
    if (errors[prop]) setErrors((err) => ({ ...err, [prop]: "" }));
  };

  const toggleVisibility = (prop) => {
    setValues((v) => ({ ...v, [prop]: !v[prop] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!values.newPassword) newErrors.newPassword = "New password is required";
    else if (values.newPassword.length < 6)
      newErrors.newPassword = "New password must be at least 6 characters";
    if (!values.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (values.newPassword !== values.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Here you can call your API. For now, just show success
    setSuccess(true);
    setValues({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      showCurrent: false,
      showNew: false,
      showConfirm: false,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" textAlign="center" mb={1}>
        Change Password
      </Typography>

      {success && <Alert severity="success">Password changed successfully!</Alert>}

      <TextField
        label="Current Password"
        type={values.showCurrent ? "text" : "password"}
        value={values.currentPassword}
        onChange={handleChange("currentPassword")}
        error={!!errors.currentPassword}
        helperText={errors.currentPassword}
        required
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => toggleVisibility("showCurrent")} edge="end">
                {values.showCurrent ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="New Password"
        type={values.showNew ? "text" : "password"}
        value={values.newPassword}
        onChange={handleChange("newPassword")}
        error={!!errors.newPassword}
        helperText={errors.newPassword}
        required
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => toggleVisibility("showNew")} edge="end">
                {values.showNew ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm New Password"
        type={values.showConfirm ? "text" : "password"}
        value={values.confirmPassword}
        onChange={handleChange("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        required
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => toggleVisibility("showConfirm")} edge="end">
                {values.showConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button type="submit" variant="contained" fullWidth size="large">
        Change Password
      </Button>
    </Box>
  );
}
