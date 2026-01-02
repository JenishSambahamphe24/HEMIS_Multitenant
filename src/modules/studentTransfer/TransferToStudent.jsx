import React, { useState, useEffect } from "react";
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
  FormHelperText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Autocomplete,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import toast from "react-hot-toast";
import SchoolIcon from "@mui/icons-material/School";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import { useSelector } from "react-redux";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

export default function TransferStudent({ studentId, onClose, open }) {
  const backendUrl = config.VITE_BACKEND_URL;
  const [student, setStudent] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [targetCampusId, setTargetCampusId] = useState("");
  const [campusName, setCampusName] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [transferDate, setTransferDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [targetProgram, setTargetProgram] = useState("");
  const [programsList, setProgramsList] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [transferDocument, setTransferDocument] = useState(null);
  const [maintainFees, setMaintainFees] = useState(true);
  const [clearDues, setClearDues] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loadingCampuses, setLoadingCampuses] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const sourceCampusId = currentUser?.institution?.id;

  // Fetch student data when the component opens
  useEffect(() => {
    if (open && studentId) {
      fetchStudentData();
    }
  }, [open, studentId]);

  useEffect(() => {
    if (open) {
      fetchCampuses();
    }
  }, [open]);

  useEffect(() => {
    if (targetCampusId && targetCampusId !== "other") {
      fetchProgramsForCampus(targetCampusId);
    } else {
      setProgramsList([]);
    }
  }, [targetCampusId]);

  const fetchStudentData = async () => {
    if (!studentId) return;

    setLoadingStudent(true);
    try {
      const authConfig = getAuthConfigSafe();
      if (!authConfig) {
        toast.error("Authentication failed. Please login again.");
        return;
      }

      const response = await axios.get(
        `${backendUrl}/Student/${studentId}`,
        authConfig
      );
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error(
        error.response?.data?.message || "Error loading student information"
      );
    } finally {
      setLoadingStudent(false);
    }
  };

  const fetchCampuses = async () => {
    try {
      const authConfig = getAuthConfigSafe();
      if (!authConfig) {
        toast.error("Authentication failed. Please login again.");
        return;
      }
      const response = await axios.get(
        `${backendUrl}/Campus/GetAllCampuses`,
        authConfig
      );
      const otherCampuses = response.data.filter(
        (campus) => campus.id !== sourceCampusId
      );
      setCampuses(otherCampuses);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      toast.error(error.response?.data?.message || "Error loading campuses");
    } finally {
      setLoadingCampuses(false);
    }
  };

  const fetchProgramsForCampus = async (campusId) => {
    setLoadingPrograms(true);
    try {
      const config = getAuthConfigSafe();
      const response = await axios.get(
        `${backendUrl}/Program/byCampus/${campusId}`,
        config
      );
      setProgramsList(response.data);

      // Try to find a matching program by name
      if (student) {
        const matchingProgram = response.data.find(
          (p) => p.name === student?.programName
        );
        if (matchingProgram) {
          setTargetProgram(matchingProgram.id);
        }
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to fetch programs");
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleTargetCampusChange = (e) => {
    setTargetCampusId(e.target.value);
    if (e.target.value !== "other") {
      setCampusName("");
    }
  };

  const handleCampusNameChange = (e) => setCampusName(e.target.value);
  const handleTransferReasonChange = (e) => setTransferReason(e.target.value);
  const handleTransferDateChange = (e) => setTransferDate(e.target.value);
  const handleTargetProgramChange = (e) => setTargetProgram(e.target.value);
  const handleRemarksChange = (e) => setRemarks(e.target.value);
  const handleMaintainFeesChange = (e) => setMaintainFees(e.target.checked);
  const handleClearDuesChange = (e) => setClearDues(e.target.checked);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTransferDocument(file);
      setFileUploaded(true);
      toast.success(`File "${file.name}" uploaded successfully!`);
    }
  };

  const validateForm = () => {
    if (!targetCampusId) {
      setError("Target campus is required");
      return false;
    }
    if (targetCampusId === "other" && !campusName.trim()) {
      setError("Campus name is required when selecting 'Other Campus'");
      return false;
    }
    if (!transferReason.trim()) {
      setError("Transfer reason is required");
      return false;
    }
    if (!transferDate) {
      setError("Transfer date is required");
      return false;
    }
    return true;
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Open confirmation dialog instead of submitting directly
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);

    try {
      const authConfig = getAuthConfigSafe();
      if (!authConfig) {
        setError("Authentication failed. Please login again.");
        return;
      }
      const formData = new FormData();
      const isOtherCampus = targetCampusId === "other";
      formData.append("studentId", studentId);
      formData.append("sourceCampusId", sourceCampusId);
      formData.append("transferReason", transferReason);
      formData.append("transferDate", transferDate);
      formData.append("maintainFees", maintainFees.toString());
      formData.append("clearDues", clearDues.toString());
      formData.append("remarks", remarks);
      if (isOtherCampus) {
        formData.append("targetCampusId", 0);
        formData.append("campusName", campusName);
      } else {
        formData.append("targetCampusId", targetCampusId);
        if (targetProgram) {
          formData.append("targetProgramId", targetProgram);
        }
      }
      if (transferDocument) {
        formData.append("transferDocument", transferDocument);
      }
      await axios.post(`${backendUrl}/StudentTransfer`, formData, {
        headers: {
          ...authConfig.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Student transfer request submitted successfully!");
      onClose();
    } catch (err) {
      console.error("Error submitting transfer request:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmDialogOpen(false);
  };

  const getCampusNameById = (id) => {
    const campus = campuses.find((c) => c.id === id);
    return campus ? campus.name : "Unknown Campus";
  };

  const getTargetProgramName = () => {
    const program = programsList.find((p) => p.id === targetProgram);
    return program ? program.name : "";
  };

  // Helper function to get student full name
  const getStudentFullName = () => {
    if (!student) return "";
    return `${student.firstName || ""} ${student.middleName || ""} ${
      student.lastName || ""
    }`.trim();
  };

  // Helper function to get semester/year information
  const getSemesterYearInfo = () => {
    if (!student) return "";

    if (student.year) {
      return `${student.year} Year`;
    } else if (student.semester) {
      return `${student.semester} Semester`;
    } else if (student.currentSemester) {
      return `${student.currentSemester} Semester`;
    } else if (student.currentYear) {
      return `${student.currentYear} Year`;
    }

    return "Not specified";
  };

  // Helper function to get admission year
  const getAdmissionYear = () => {
    if (!student) return "";

    if (student.batchNameNepali) {
      return student.batchNameNepali;
    } else if (student.admissionYear) {
      return student.admissionYear;
    } else if (student.batchName) {
      return student.batchName;
    }

    return "Not specified";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <div>
        <Box sx={{ display: "flex", flexDirection: "column", margin: 2 }}>
          <Box sx={{ maxWidth: "lg", margin: "auto" }}>
            <Typography
              variant="body1"
              gutterBottom
              align="center"
              sx={{
                mb: 2,
                color: blue[700],
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SwapHorizIcon sx={{ mr: 1 }} />
              Student Transfer Out
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loadingStudent ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : student ? (
              <>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    mb: 1,
                    backgroundColor: blue[50],
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 0, color: blue[800] }}
                  >
                    Student Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">
                        <strong>Full Name:</strong> {getStudentFullName()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">
                        <strong>Roll No:</strong>{" "}
                        {student?.rollNoManual ||
                          student?.rollNo ||
                          "Not available"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">
                        <strong>Current Program:</strong>{" "}
                        {student?.programName ||
                          student?.program?.name ||
                          "Not specified"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">
                        <strong>Semester/Year:</strong> {getSemesterYearInfo()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">
                        <strong>Admission Year:</strong> {getAdmissionYear()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Divider sx={{ mb: 1 }}>
                  <Chip label="Transfer Details" sx={{ color: blue[700] }} />
                </Divider>

                <form onSubmit={handleSubmitClick}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                      <FormControl
                        fullWidth
                        size="small"
                        required
                        disabled={loadingCampuses}
                      >
                        <Autocomplete
                          options={[
                            ...campuses.map((c) => ({
                              label: c.name,
                              value: c.id.toString(),
                            })),
                            {
                              label: "Campus not in list (Other Campus)",
                              value: "other",
                            },
                          ]}
                          getOptionLabel={(option) => option.label}
                          value={
                            campuses.find(
                              (c) => c.id.toString() === targetCampusId
                            ) ||
                            (targetCampusId === "other" && {
                              label: "Campus not in list (Other Campus)",
                              value: "other",
                            }) ||
                            null
                          }
                          onChange={(event, newValue) => {
                            handleTargetCampusChange({
                              target: { value: newValue?.value || "" },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Transfer to Campus"
                              size="small"
                              required
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    <InputAdornment position="start">
                                      <LocationOnIcon fontSize="small" />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                        />
                      </FormControl>
                    </Grid>

                    {targetCampusId === "other" && (
                      <Grid item xs={12} md={5}>
                        <TextField
                          label="Campus Name"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={campusName}
                          onChange={handleCampusNameChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOnIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          required
                        />
                      </Grid>
                    )}

                    {targetCampusId && targetCampusId !== "other" && (
                      <Grid item xs={12} md={6}>
                        <FormControl
                          fullWidth
                          size="small"
                          disabled={loadingPrograms}
                        >
                          <InputLabel>Target Program</InputLabel>
                          <Select
                            value={targetProgram}
                            onChange={handleTargetProgramChange}
                            label="Target Program"
                            startAdornment={
                              <InputAdornment position="start">
                                <SchoolIcon fontSize="small" />
                              </InputAdornment>
                            }
                          >
                            {programsList.map((program) => (
                              <MenuItem key={program.id} value={program.id}>
                                {program.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            Select program at target campus
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    )}

                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Transfer Date"
                        variant="outlined"
                        fullWidth
                        size="small"
                        type="date"
                        value={transferDate}
                        onChange={handleTransferDateChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventNoteIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <TextField
                        label="Transfer Reason"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={transferReason}
                        onChange={handleTransferReasonChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DescriptionIcon fontSize="small" />
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
                          ? `File Uploaded: ${transferDocument.name}`
                          : "Upload Transfer Request"}
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
                      <FormHelperText>
                        Upload signed transfer application form
                      </FormHelperText>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Remarks"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={remarks}
                        onChange={handleRemarksChange}
                        placeholder="Additional information or special instructions for this transfer"
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
                        color="warning"
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
                          mr: 1,
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                          "Submit Transfer Request"
                        )}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={onClose}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </>
            ) : (
              <Alert severity="error" sx={{ mt: 2 }}>
                Failed to load student information. Please try again.
              </Alert>
            )}
          </Box>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleCancelConfirm}
          aria-labelledby="transfer-confirmation-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            id="transfer-confirmation-dialog-title"
            sx={{ bgcolor: blue[50], color: blue[800] }}
          >
            Confirm Student Transfer
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <DialogContentText component="div">
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Transfer Summary:
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>{getStudentFullName()}</strong> will be transferred from{" "}
                <strong>{currentUser?.institution?.campusName}</strong> to{" "}
                <strong>
                  {targetCampusId === "other"
                    ? campusName
                    : getCampusNameById(targetCampusId)}
                </strong>
                {targetProgram && targetCampusId !== "other" && (
                  <>
                    {" "}
                    in the <strong>{getTargetProgramName()}</strong> program
                  </>
                )}{" "}
                effective{" "}
                <strong>{new Date(transferDate).toLocaleDateString()}</strong>.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Reason:</strong> {transferReason}
              </Typography>
              {remarks && (
                <Typography variant="body2">
                  <strong>Remarks:</strong> {remarks}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                Are you sure you want to proceed with this transfer request?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCancelConfirm}
              variant="outlined"
              color="error"
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                bgcolor: blue[700],
                "&:hover": { bgcolor: blue[800] },
                borderRadius: 2,
              }}
              autoFocus
            >
              Confirm Transfer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Dialog>
  );
}
