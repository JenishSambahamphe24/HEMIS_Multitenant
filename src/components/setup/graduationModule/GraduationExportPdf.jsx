import React, { forwardRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

const GraduationPdfExport = forwardRef((props, ref) => {
  const {
    fiscalYear,
    studentName,
    dobNep,
    dobEng,
    division,
    gpa,
    fatherName,
    motherName,
    contactNumber,
    enrolledYear,
    passedYear,
    remarks,
  } = props;

  return (
    <Box
      ref={ref}
      style={{
        padding: "50px",
        maxWidth: "800px",
        margin: "100px auto",
        border: "1px solid #000",
        backgroundColor: "#fff",
      }}
    >
      {/* Header Section */}
      <Typography variant="h6" align="center" gutterBottom>
        त्रिभुवन विश्वविद्यालय
        <br />
        Tribhuvan University
      </Typography>
      <Typography align="center" gutterBottom>
        Campus/Dept./Unit
        <br />
        Application for Character Certificate
      </Typography>

      <Divider style={{ margin: "10px 0" }} />

      {/* Details Section */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">
            <strong>Fiscal Year:</strong> {fiscalYear || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography variant="body2">
            <strong>Enrolled Year:</strong> {enrolledYear || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            <strong>Name of the Student:</strong> {studentName || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography variant="body2">
            <strong>Passed Year:</strong> {passedYear || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            <strong>Date of Birth (Nepali):</strong> {dobNep?.slice(0,10) || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography variant="body2">
            <strong>Date of Birth (English):</strong> {dobEng || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            <strong>Division:</strong> {division || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography variant="body2">
            <strong>GPA:</strong> {gpa || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            <strong>Father's Name:</strong> {fatherName || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography variant="body2">
            <strong>Mother's Name:</strong> {motherName || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">
            <strong>Contact Number:</strong> {contactNumber || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12}>
          <Typography variant="body2">
            <strong>Remarks:</strong> {remarks || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Divider style={{ margin: "10px 0" }} />

      {/* Footer Section */}
      <Typography variant="body2" style={{ marginTop: "10px" }}>
        <strong>Note:</strong> Please verify all details before final submission.
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        style={{ marginTop: "20px" }}
      >
        <Typography variant="body2">
          Verified by: .....................................................
        </Typography>
        <Typography variant="body2">
          Signature: .....................................................
        </Typography>
      </Box>
    </Box>
  );
});

export default GraduationPdfExport;
