import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  TextField,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BSToAD, ADToBS } from "bikram-sambat-js";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import BikramSambatDateInput from "../../../components/DateField/DateInputField";
import { getEthnicGroup } from "../../../services/services";
import { StdDocUploader } from "../../../pages/students/StdDocUploader";
import { config } from '@config';

// Helper function to format date from backend (2025-08-22T00:00:00 to 2025-08-22)
const formatDateFromBackend = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

const AlumniUnverified = ({ open, onClose, alumniData, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${backendUrl}/${path.replace(/^\/+/, "")}`;
  };


  const {
    reset,
    watch,
    setValue,
    control,
  } = useForm();

  const [fiscalYears, setFiscalYears] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [ethnicGroup, setEthnicGroup] = useState([]);
  const [matchingFiscalYear, setMatchingFiscalYear] = useState(null);

  // Add state to store file objects
  const [fileUploads, setFileUploads] = useState({
    uploadPhoto: null,
    uploadSignature: null,
    uploadReceipt: null,
    uploadTranscript: null,
    uploadOtherDocs: null,
  });

  const authConfig = getAuthConfigSafe();

  const fetchEthnicData = async () => {
    try {
      const response = await getEthnicGroup();
      setEthnicGroup(response);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch fiscal years and find the matching one for the alumni
  const fetchGraduationData = async () => {
    try {
      const fiscalYearResponse = await axios.get(
        `${backendUrl}/FiscalYear`,
        authConfig
      );
      setFiscalYears(fiscalYearResponse.data);

      // Find the fiscal year that matches the alumni's graduatedFiscalyear
      if (alumniData?.graduatedFiscalyear) {
        const foundFiscalYear = fiscalYearResponse.data?.find(
          (fy) => fy.id === alumniData.graduatedFiscalyear
        );
        setMatchingFiscalYear(foundFiscalYear);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEthnicData();
  }, []);

  // Populate form with alumni data when dialog opens
  useEffect(() => {
    if (open && alumniData) {
      setIsFormLoading(true);
      reset();

      // Fetch fiscal years first
      fetchGraduationData();

      // Direct mapping from API → form fields
      setValue("applicantNameNep", alumniData.applicantNameNep || "");
      setValue("applicantNameEng", alumniData.applicantNameEng || "");

      // Set fiscal year - this will be displayed in a read-only field
      setValue("graduatedFiscalyear", alumniData.graduatedFiscalyear || "");

      setValue("dobNepali", alumniData.doBNepali || "");
      setValue("dobEng", formatDateFromBackend(alumniData.doBEng));

      setValue("email", alumniData.email || "");
      setValue("gender", alumniData.gender || "");
      setValue("ethnicity", alumniData.ethinicity || "");
      setValue("studentAddress", alumniData.studentAddress || "");

      setValue("studentRegNo", alumniData.studentRegNo  || "");
      setValue("symbolNo", alumniData.symbolNoUniversity || "");
      setValue("campusRollNo", alumniData.campusRolNo || "");

      setValue("universityIssueNo", alumniData.universityIssueNo || "");

      setValue("enrolledYear", alumniData.enrolledYear || "");
      setValue("passedYear", alumniData.passedYear || "");

      setValue("division", alumniData.division || "");
      setValue("gpa", alumniData.gpa || "");

      setValue("fatherName", alumniData.fatherName || "");
      setValue("motherName", alumniData.motherName || "");
      setValue("contactNumber", alumniData.contactNo || "");

      setValue("remarks", alumniData.remarks || "");

      setValue("issueDateNep", alumniData.issueDateNep || "");
      setValue("issueDateEng", formatDateFromBackend(alumniData.issueDateEng));

      // Set the program name from API (not the ID)
      setValue("programName", alumniData.programName|| "");

      // Set the level from API
      setValue("level", alumniData.levelName || "");

      setIsFormLoading(false);
    }
  }, [open, alumniData, setValue, reset]);

  const handleFileChange = (fieldName, file) => {
    setFileUploads((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
    setValue(fieldName, file);
  };

  // Function to update alumni status to "Approved"
 const handleVerifyAlumni = async () => {
  try {
    setIsLoading(true);

    const url = `${backendUrl}/AlumniRegister/Verify/${alumniData.id}`;

    await axios.post(
      url,
      {}, // no body needed
      {
        headers: {
          Authorization: `Bearer ${currentUser.tokenString}`,
        },
      }
    );

    toast.success("Alumni verified and login created!", { autoClose: 1500 });
    onUpdate();
    onClose();
  } catch (error) {
    console.error("Error verifying alumni:", error);
    toast.error("Verification failed!");
  } finally {
    setIsLoading(false);
  }
};


  // Common read-only InputProps for all fields
  const readOnlyProps = {
    readOnly: true,
    sx: {
      '& .MuiInputBase-input': {
        color: 'rgba(0, 0, 0, 0.6)',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.12)',
      }
    }
  };

  const disabledSelectProps = {
    sx: {
      '& .MuiSelect-select': {
        color: 'rgba(0, 0, 0, 0.6)',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.12)',
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h5"
            sx={{
              color: "#2A629A",
              textAlign: "center",
              width: "100%",
            }}
          >
            Unverified Alumni Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {isFormLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <CardContent
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <Grid container spacing={2}>
              {/* Graduated Fiscal Year - Read Only */}
              <Grid item xs={12} sm={6} md={2.3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Graduated Fiscal Year"
                  value={matchingFiscalYear?.yearNepali || alumniData?.fiscalYear || "N/A"}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  name="applicantNameNep"
                  size="small"
                  label="आवेदकको नाम देवनागरीमा(unicode)"
                  value={watch("applicantNameNep") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  name="applicantNameEng"
                  size="small"
                  label="Applicant Name (English)"
                  value={watch("applicantNameEng") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2.7}>
                <Controller
                  name="dobNepali"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <BikramSambatDateInput
                      {...field}
                      label="Date of Birth (B.S)"
                      name="dobNepali"
                      format={"YYYY/MM/DD"}
                      value={field.value || ""}
                      InputProps={{ readOnly: true }}
                      sx={{
                        '& .MuiInputBase-input': {
                          color: 'rgba(0, 0, 0, 0.6)',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <TextField
                  name="dobEng"
                  size="small"
                  label="Date of Birth (A.D)"
                  value={watch("dobEng") || ""}
                  InputProps={readOnlyProps}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3.5}>
                <TextField
                  fullWidth
                  name="email"
                  size="small"
                  label="Email"
                  value={watch("email") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={watch("gender") || ""}
                    label="Gender"
                    disabled
                    sx={disabledSelectProps}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3.5}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="ethnicity">Ethnicity</InputLabel>
                  <Select
                    labelId="ethnicity"
                    label="Ethnicity"
                    value={watch("ethnicity") || ""}
                    disabled
                    sx={disabledSelectProps}
                  >
                    <MenuItem value="" disabled>
                      Select Ethnicity
                    </MenuItem>
                    {ethnicGroup?.map((data) => (
                      <MenuItem key={data.id} value={data.name}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8} md={6}>
                <TextField
                  fullWidth
                  name="studentAddress"
                  size="small"
                  label="Student Address"
                  value={watch("studentAddress") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  name="studentRegNo"
                  label="Registration Number"
                  value={watch("studentRegNo") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              {/* Level - Read Only */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Level"
                  value={watch("level") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              {/* Program - Read Only */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Program"
                  value={watch("programName") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="issueDateNep"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <BikramSambatDateInput
                      {...field}
                      label="Date of Issue (B.S)"
                      name="issueDateNep"
                      format={"YYYY/MM/DD"}
                      value={field.value || ""}
                      InputProps={{ readOnly: true }}
                      sx={{
                        '& .MuiInputBase-input': {
                          color: 'rgba(0, 0, 0, 0.6)',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  name="issueDateEng"
                  size="small"
                  label="Date of Issue (A.D)"
                  value={watch("issueDateEng") || ""}
                  InputProps={readOnlyProps}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  name="universityIssueNo"
                  label="University Issue No."
                  value={watch("universityIssueNo") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  name="symbolNo"
                  label="Symbol Number"
                  value={watch("symbolNo") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  name="campusRollNo"
                  label="Campus Roll No."
                  value={watch("campusRollNo") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  name="enrolledYear"
                  label="Enrolled Year (B.S)"
                  value={watch("enrolledYear") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Passed Year (B.S)"
                  name="passedYear"
                  value={watch("passedYear") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Grade/Division"
                  name="division"
                  size="small"
                  fullWidth
                  value={watch("division") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.3}>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  name="gpa"
                  label="GPA / Percentage"
                  value={watch("gpa") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3.7}>
                <TextField
                  fullWidth
                  name="fatherName"
                  size="small"
                  label="Father Name"
                  value={watch("fatherName") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  name="motherName"
                  label="Mother Name"
                  value={watch("motherName") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <TextField
                  fullWidth
                  size="small"
                  name="contactNumber"
                  label="Contact Number"
                  value={watch("contactNumber") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6.5}>
                <TextField
                  fullWidth
                  size="small"
                  name="remarks"
                  label="Remarks"
                  value={watch("remarks") || ""}
                  InputProps={readOnlyProps}
                />
              </Grid>

              <Grid
                container
                item
                xs={12}
                sx={{
                  position: "relative",
                  borderRadius: "5px",
                  border: "1px dashed #c1c1c1",
                  marginTop: "30px",
                  padding: "8px",
                  opacity: 0.6,
                }}
              >
                <Typography
                  sx={{
                    position: "absolute",
                    top: "-16px",
                    color: "#666666",
                    left: "15px",
                    border: "1px solid ",
                    borderRadius: "10px",
                    background: "white",
                    padding: "2px 8px",
                    fontWeight: "500",
                  }}
                >
                  Passport size photo & Documents
                </Typography>
                {/* Display existing file previews */}
                <Grid
                  container
                  item
                  xs={12}
                  sx={{
                    position: "relative",
                    borderRadius: "5px",
                    border: "1px dashed #c1c1c1",
                    marginTop: "30px",
                    padding: "8px",
                    opacity: 0.6,
                  }}
                >
                  <Typography
                    sx={{
                      position: "absolute",
                      top: "-16px",
                      color: "#666666",
                      left: "15px",
                      border: "1px solid ",
                      borderRadius: "10px",
                      background: "white",
                      padding: "2px 8px",
                      fontWeight: "500",
                    }}
                  >
                    Passport size photo & Documents
                  </Typography>

                  {/* Display existing file previews */}
                  <Grid item xs={12}>
                    <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
                      {alumniData?.uploadPPSizePhoto && (
                        <Box>
                          <Typography variant="caption">Photo</Typography>
                          <img
                            src={getImageUrl(alumniData.uploadPPSizePhoto)}
                            alt="Photo"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                            }}
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                        </Box>
                      )}

                      {alumniData?.uploadTranscript && (
                        <Box>
                          <Typography variant="caption">Transcript</Typography>
                          <img
                            src={getImageUrl(alumniData.uploadTranscript)}
                            alt="Transcript"
                            style={{ width: "120px", border: "1px solid #ccc" }}
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                        </Box>
                      )}

                      {alumniData?.uploadReceipt && (
                        <Box>
                          <Typography variant="caption">Receipt</Typography>
                          <img
                            src={getImageUrl(alumniData.uploadReceipt)}
                            alt="Receipt"
                            style={{ width: "120px", border: "1px solid #ccc" }}
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                        </Box>
                      )}

                      {alumniData?.uploadOtherDoc && (
                        <Box>
                          <Typography variant="caption">Other</Typography>
                          <img
                            src={getImageUrl(alumniData.uploadOtherDoc)}
                            alt="Other Doc"
                            style={{ width: "120px", border: "1px solid #ccc" }}
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                        </Box>
                      )}

                      {alumniData?.uploadSignature && (
                        <Box>
                          <Typography variant="caption">Signature</Typography>
                          <img
                            src={getImageUrl(alumniData.uploadSignature)}
                            alt="Signature"
                            style={{ width: "120px", border: "1px solid #ccc" }}
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                        </Box>
                      )}

                      {!alumniData?.uploadPPSizePhoto &&
                        !alumniData?.uploadTranscript &&
                        !alumniData?.uploadReceipt &&
                        !alumniData?.uploadOtherDoc &&
                        !alumniData?.uploadSignature && (
                          <Typography variant="body2" color="text.secondary">
                            No files uploaded
                          </Typography>
                        )}
                    </Box>
                  </Grid>
                </Grid>

              </Grid>

            </Grid>
          </CardContent>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleVerifyAlumni}
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading ? "Verifying..." : "Verify Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlumniUnverified;
