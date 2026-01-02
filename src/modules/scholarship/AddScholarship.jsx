import React, { useState, useEffect } from "react";
import axios from "axios"; // Added axios import
import BikramSambatDateInput from "../../components/DateField/DateInputField";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText,
} from "@mui/material";
import { blue, green } from "@mui/material/colors";
import toast from "react-hot-toast";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import BusinessIcon from "@mui/icons-material/Business";
import { useSelector } from "react-redux";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';
// Scholarship type options
const scholarshipTypes = ["Scholarship", "Discount"];
// Directly given to options
const directlyGivenToOptions = ["Campus Account", "Student Account"];

export default function AddScholarship({ student, onClose }) {
  const backendUrl = config.VITE_BACKEND_URL;
  const [scholarshipName, setScholarshipName] = useState("");
  const [scholarshipType, setScholarshipType] = useState("");
  const [scholarshipMode, setScholarshipMode] = useState("amount");
  const [amount, setAmount] = useState("");
  const [scholarshipPercentage, setScholarshipPercentage] = useState("");
  const [providedBy, setProvidedBy] = useState("");
  const [directlyGivenTo, setDirectlyGivenTo] = useState("");
  const [dateOfEntry, setDateOfEntry] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [remarks, setRemarks] = useState("");
  const [applicationFile, setApplicationFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [fiscalYearLoading, setFiscalYearLoading] = useState(true);

  const { currentUser } = useSelector((state) => state.user);
  const campusId = currentUser?.institution?.id;

  // Fetch fiscal years on component mount
  useEffect(() => {
    const fetchFiscalYears = async () => {
      try {
        const authConfig = getAuthConfigSafe();
        if (!authConfig) {
          setError("Authentication failed. Please login again.");
          return;
        }

        const response = await axios.get(
          `${backendUrl}/FiscalYear`,
          authConfig
        );
        setFiscalYears(response.data);

        // Find and set active fiscal year as default
        const activeFiscalYear = response.data.find(
          (year) => year.activeFiscalYear === true
        );

        if (activeFiscalYear) {
          setSelectedFiscalYear(activeFiscalYear.id);
        } else if (response.data.length > 0) {
          // Fallback to first item if no active year found
          setSelectedFiscalYear(response.data[0].id);
        }
      } catch (err) {
        console.error("Error fetching fiscal years:", err);
        toast.error("Failed to load fiscal years");
      } finally {
        setFiscalYearLoading(false);
      }
    };

    fetchFiscalYears();
  }, []);

  const handleScholarshipNameChange = (e) => setScholarshipName(e.target.value);
  const handleScholarshipTypeChange = (e) => setScholarshipType(e.target.value);
  const handleProvidedByChange = (e) => setProvidedBy(e.target.value);
  const handleDirectlyGivenToChange = (e) => setDirectlyGivenTo(e.target.value);
  const handleFiscalYearChange = (e) => setSelectedFiscalYear(e.target.value);
  const handleScholarshipModeChange = (e) => {
    setScholarshipMode(e.target.value);
    // Clear both values when switching mode to prevent submitting both
    setAmount("");
    setScholarshipPercentage("");
  };
  const handleAmountChange = (e) => {
    // Allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    if (value === "" || /^(\d+\.?\d*|\.\d+)$/.test(value)) {
      setAmount(value);
    }
  };

  const handlePercentageChange = (e) => {
    // Allow numbers and decimal point, limit to 100%
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (
      value === "" ||
      (/^(\d+\.?\d*|\.\d+)$/.test(value) && parseFloat(value) <= 100)
    ) {
      setScholarshipPercentage(value);
    }
  };

  const handleRemarksChange = (e) => setRemarks(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setApplicationFile(file);
      setFileUploaded(true);
      toast.success(`File "${file.name}" uploaded successfully!`);
    }
  };

  const validateForm = () => {
    if (!scholarshipName.trim()) {
      setError("Scholarship name is required");
      return false;
    }
    if (!scholarshipType) {
      setError("Scholarship type is required");
      return false;
    }
    if (!providedBy.trim()) {
      setError("Scholarship provider is required");
      return false;
    }
    if (!selectedFiscalYear) {
      setError("Fiscal year is required");
      return false;
    }
    if (scholarshipMode === "amount" && !amount) {
      setError("Scholarship amount is required");
      return false;
    }
    if (scholarshipMode === "percentage" && !scholarshipPercentage) {
      setError("Scholarship percentage is required");
      return false;
    }
    if (!directlyGivenTo) {
      setError("Please specify where the scholarship is directly given to");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const authConfig = getAuthConfigSafe();
      if (!authConfig) {
        setError("Authentication failed. Please login again.");
        return;
      }

      const formData = new FormData();
      const isAmountMode = scholarshipMode === "amount";

      formData.append("studentId", student.id);
      formData.append("campusId", campusId);
      formData.append("providedBy", providedBy);
      formData.append("scholarshipGivenTo", directlyGivenTo); // Changed to scholarshipGivenTo
      formData.append("scholarshipName", scholarshipName);
      formData.append("scholarshipType", scholarshipType);
      formData.append("fiscalYearId", selectedFiscalYear);
      formData.append("dateOfEntry", dateOfEntry);
      formData.append("remarks", remarks);

      if (isAmountMode) {
        formData.append("amount", amount);
        formData.append("scholarshipPercentage", "0");
        formData.append("isAmount", true);
        formData.append("isScholarship", false);
      } else {
        formData.append("scholarshipPercentage", scholarshipPercentage);
        formData.append("amount", "0");
        formData.append("isAmount", false);
        formData.append("isScholarship", true);
      }

      if (applicationFile) {
        formData.append("applicationFile", applicationFile);
      }

      await axios.post(`${backendUrl}/Scholarship`, formData, {
        headers: {
          ...authConfig.headers,
        },
      });

      toast.success("Scholarship application submitted successfully!");
      onClose();
    } catch (err) {
      console.error("Error submitting scholarship:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Box sx={{ display: "flex", flexDirection: "column", margin: 5 }}>
        <Box sx={{ maxWidth: "lg", margin: "auto" }}>
          <Typography
            variant="body1"
            gutterBottom
            align="center"
            sx={{
              mb: 2,
              fontSize: "25px",
              color: blue[700],
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "underline",
            }}
          >
            Assign Scholarship/Discount
          </Typography>

          {error && (
            <Typography
              color="error"
              variant="body2"
              align="center"
              sx={{
                mb: 2,
                p: 1,
                bgcolor: "rgba(255,0,0,0.05)",
                borderRadius: 1,
              }}
            >
              {error}
            </Typography>
          )}

          <Paper
            variant="outlined"
            sx={{
              p: 1,
              mb: 1,
              backgroundColor: blue[50],
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 0, color: blue[800] }}>
              Student Information
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Full Name:</strong>{" "}
                  {`${student?.firstName} ${student?.middleName || ""} ${
                    student?.lastName
                  }`}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Roll No:</strong> {student?.rollNoManual}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Date of birth (BS):</strong> {student?.doBBS}
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
                    : " "}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Admission Year:</strong> {student?.batchNameNepali}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Divider sx={{ mb: 1 }}>
            <Chip label="Scholarship/Discount Details" color="primary" />
          </Divider>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={3}>
                <BikramSambatDateInput
                  required
                  name="dateOfEntry"
                  label="Date of Entry"
                  value={dateOfEntry}
                  onChange={(newValue) => {
                    setDateOfEntry(newValue);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Fiscal Year</InputLabel>
                  <Select
                    value={selectedFiscalYear}
                    onChange={handleFiscalYearChange}
                    label="Fiscal Year"
                    disabled={fiscalYearLoading}
                  >
                    {fiscalYears.map((year) => (
                      <MenuItem key={year.id} value={year.id}>
                        {year.yearNepali}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={scholarshipType}
                    onChange={handleScholarshipTypeChange}
                    label="Type"
                  >
                    {scholarshipTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Scholarship/Discount Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={scholarshipName}
                  onChange={handleScholarshipNameChange}
                  required
                  placeholder="e.g. Merit Scholarship"
                />
              </Grid>

              {/* <Grid item xs={12} md={4}>
                <FormControl component="fieldset" required>
                  <RadioGroup
                    row
                    value={scholarshipMode}
                   onChange={handleScholarshipModeChange}
                  >
                    <FormControlLabel
                      value="amount"
                      control={<Radio size="small" />}
                      label="Amount"
                    />
                    <FormControlLabel
                      value="percentage"
                      control={<Radio size="small" />}
                      label="Percentage"
                    />
                  </RadioGroup>
                  <FormHelperText>Select scholarship mode</FormHelperText>
                </FormControl>
              </Grid>  */}

              {scholarshipMode === "amount" ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Scholarship Amount"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                    placeholder="Enter amount"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Rs.</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              ) : (
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Scholarship Percentage"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={scholarshipPercentage}
                    onChange={handlePercentageChange}
                    required
                    placeholder=" percentage (max 100)"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}

              {/* New Directly Given To Dropdown */}
              <Grid item xs={12} md={3.5}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Scholarship Given To</InputLabel>
                  <Select
                    value={directlyGivenTo}
                    onChange={handleDirectlyGivenToChange}
                    label="Scholarship Given To"
                  >
                    {directlyGivenToOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={5.5}>
                <TextField
                  label="Provided By"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={providedBy}
                  onChange={handleProvidedByChange}
                  required
                  placeholder="e.g. University, Government, NGO"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  component="label"
                  variant={fileUploaded ? "contained" : "outlined"}
                  color={fileUploaded ? "success" : "primary"}
                  fullWidth
                  startIcon={<AttachFileIcon />}
                  sx={{ textTransform: "none" }}
                >
                  {fileUploaded
                    ? `File Uploaded: ${applicationFile.name}`
                    : "Upload Application Document"}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                </Button>
                {fileUploaded && (
                  <Typography
                    variant="caption"
                    color="success"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Document uploaded successfully
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Remarks"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={remarks}
                  onChange={handleRemarksChange}
                  placeholder="Additional information or notes about this scholarship"
                />
              </Grid>

              <Grid
                container
                justifyContent={"center"}
                item
                xs={12}
                sx={{ mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="small"
                  disabled={loading}
                  sx={{
                    textTransform: "none",
                    bgcolor: blue[700],
                    "&:hover": {
                      bgcolor: blue[800],
                    },
                    borderRadius: 2,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Save"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </div>
  );
}
