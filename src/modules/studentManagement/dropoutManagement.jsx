import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import toast from "react-hot-toast";
import {config} from '@config';

export default function DropoutManagement({ student, onClose }) {
  const backendUrl = config.VITE_BACKEND_URL;
  const [reason, setReason] = useState("");
  const [dateOfEntry, setDateOfEntry] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [remarks, setRemarks] = useState("");
  const [applicationFile, setApplicationFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReasonChange = (e) => setReason(e.target.value);
  const handleDateOfEntryChange = (e) => setDateOfEntry(e.target.value);
  const handleRemarksChange = (e) => setRemarks(e.target.value);
  const handleFileChange = (e) => setApplicationFile(e.target.files[0]);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const localStorageData = JSON.parse(localStorage.getItem("persist:root"));
      const userState = JSON.parse(localStorageData.user);
      const authToken = userState.currentUser.tokenString;

      const requestData = {
        studentId: student.id,
        reason: reason,
        dateOfEntry: dateOfEntry,
        remarks: remarks,
      };

      const response = await fetch(`${backendUrl}/DropOut`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        toast.success("Successfully Saved!!");
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData?.message || "Failed to submit dropout request");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            sx={{ mb: 2, color: blue[700] }}
          >
            Dropout Management
          </Typography>
          {error && (
            <Typography
              color="error"
              variant="body2"
              align="center"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}

          <Box sx={{ mb: 1 }}>
            <Grid container spacing={0}>
              <Grid item xs={12} md={7}>
                <Typography variant="body2">
                  <strong>Full Name:</strong>{" "}
                  {`${student?.firstName} ${student?.middleName || ""} ${student?.lastName
                    }`}
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="body2">
                  <strong>Roll No:</strong> {student?.rollNo}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>email:</strong>
                  {student?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Program:</strong> {student?.programName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Semester/Year:</strong>{" "}
                  {student?.year
                    ? `${student.year} Year`
                    : student?.semester
                      ? `${student.semester} Semester`
                      : ' '}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Admission Year:</strong> {student?.batchNameNepali}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <TextField
                  label="Date of Entry"
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="date"
                  value={dateOfEntry}
                  onChange={handleDateOfEntryChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Reason for Dropout"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  value={reason}
                  onChange={handleReasonChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Additional Remarks"
                  variant="outlined"
                  fullWidth
                  multiline
                  size="small"
                  value={remarks}
                  onChange={handleRemarksChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Upload Application"
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="file"
                  onChange={handleFileChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{ textTransform: "none" }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Submit Dropout"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </>
  );
}
