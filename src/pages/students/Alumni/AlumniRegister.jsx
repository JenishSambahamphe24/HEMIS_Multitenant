import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BSToAD, ADToBS } from "bikram-sambat-js";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import BikramSambatDateInput from "../../../components/DateField/DateInputField";
import { getEthnicGroup } from "../../../services/services";
import { useNavigate } from "react-router-dom";
import { StdDocUploader } from "../../../pages/students/StdDocUploader";

import {config as appConfig} from '@config';

const getTodayBS = () => {
  const today = new Date();
  const todayAD = today.toISOString().split("T")[0].replace(/-/g, "/");
  return ADToBS(todayAD);
};

const getTodayAD = () => {
  return new Date().toISOString().split("T")[0];
};

const AlumniRegister = ({ value }) => {
  const backendUrl = appConfig.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [fiscalYears, setFiscalYears] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [programData, setProgramData] = useState([]);
  const collegeId = currentUser.institution?.id;
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [level, setLevel] = useState("");
  const [defaultFiscal, setDefaultFiscal] = useState("");
  const [ethnicGroup, setEthnicGroup] = useState([]);
  const navigate = useNavigate();

  // Add state to store file objects
  const [fileUploads, setFileUploads] = useState({
    uploadPhoto: null,
    uploadSignature: null,
    uploadReceipt: null,
    uploadTranscript: null,
    uploadOtherDocs: null,
  });

  const config = getAuthConfigSafe();

  // Set default issue date to today
  useEffect(() => {
    const todayBS = getTodayBS();
    const todayAD = getTodayAD();

    setValue("issueDateNep", todayBS);
    setValue("issueDateEng", todayAD);
  }, [setValue]);

  const fetchData = async () => {
    try {
      const response = await getEthnicGroup();
      setEthnicGroup(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/ProgramMgmt/GetCollegePrograms`,
          config
        );
        setProgramData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const levels = [...new Set(programData.map((item) => item.levelName))];
    setFilteredLevels(levels);
  }, [programData]);

  useEffect(() => {
    const programs = programData.filter((item) => item.levelName === level);
    const uniquePrograms = [...new Set(programs.map((item) => item))];
    setFilteredPrograms(uniquePrograms);
  }, [level, programData]);

  const handleFileChange = (fieldName, file) => {
    setFileUploads((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
    setValue(fieldName, file);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("fiscalYearID", data.fiscalYearId);
      formData.append("campusId", collegeId);
      formData.append("applicantNameEng", data.applicantNameEng);
      formData.append("applicantNameNep", data.applicantNameNep);
      formData.append("doBNepali", data.dobNep);
      formData.append("doBEng", data.dobEng);
      formData.append("email", data.email);
      formData.append("universityIssueNo", data.universityIssueNo);
      formData.append("studentRegNo", data.studentRegNo);
      formData.append("symbolNoUniversity", data.symbolNo);
      formData.append("campusRolNo", data.campusRollNo);
      formData.append("enrolledYear", data.enrolledYear);
      formData.append("passedYear", data.passedYear);
      formData.append("division", data.division);
      formData.append("gpa", data.gpa || 0);
      formData.append("fatherName", data.fatherName);
      formData.append("motherName", data.motherName);
      formData.append("contactNo", data.contactNumber);
      formData.append("uploadSignature", fileUploads.uploadSignature || "");
      formData.append("uploadPPSizePhoto", fileUploads.uploadPhoto || "");
      formData.append("uploadReceipt", fileUploads.uploadReceipt || "");
      formData.append("uploadTranscript", fileUploads.uploadTranscript || "");
      formData.append("uploadOtherDoc", fileUploads.uploadOtherDocs || "");

      formData.append("remarks", data.remarks);
      formData.append("gender", data.gender);
      formData.append("programMgmtId", data.program);
      formData.append("ethinicity", data.ethnicity);
      formData.append("studentAddress", data.studentAddress);
      formData.append("issueDateEng", data.issueDateEng);
      formData.append("issueDateNep", data.issueDateNep);

      await axios.post(
        `${backendUrl}/Graduation/GenerateGraduationApplication`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.tokenString}`,
          },
        }
      );

      toast.success("Data posted successfully", { autoClose: 1500 });
      navigate("/Alumni/Alumni-list"); // Updated navigation path

      reset({
        fiscalYearID: data.fiscalYearId,
        campusId: collegeId,
        applicantNameEng: "",
        applicantNameNep: "",
        doBNepali: "",
        doBEng: "",
        email: "",
        universityIssueNo: "",
        studentRegNo: "",
        symbolNoUniversity: "",
        campusRolNo: "",
        enrolledYear: "",
        passedYear: "",
        division: "",
        gpa: 0,
        fatherName: "",
        motherName: "",
        contactNo: 0,
        level: 0,
        programMgmtId: 0,
        remarks: "",
        gender: "",
        ethinicity: 0,
        studentAddress: "",
        issueDateEng: "",
        issueDateNep: "",
      });

      // Reset file uploads
      setFileUploads({
        uploadPhoto: null,
        uploadSignature: null,
        uploadReceipt: null,
        uploadTranscript: null,
        uploadOtherDocs: null,
      });
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGraduationData = async () => {
    try {
      const fiscalYearResponse = await axios.get(
        `${backendUrl}/FiscalYear`,
        config
      );

      // Set the fiscal years first
      setFiscalYears(fiscalYearResponse.data);

      // Find the active fiscal year
      const activeFiscalYear = fiscalYearResponse.data?.find(
        (data) => data && data.activeFiscalYear === true
      );

      if (activeFiscalYear) {
        setDefaultFiscal(activeFiscalYear.id);
        setValue("fiscalYearId", activeFiscalYear.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.tokenString) {
      fetchGraduationData();
    }
  }, [currentUser]);

  const handleDobBsChange = (newValue) => {
    setValue("dobNep", newValue);
    if (!newValue || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(newValue)) {
      setValue("dobEng", "");
      return;
    }
    try {
      const datePart = newValue.split("T")[0];
      const bsDateFormatted = datePart.replace(/-/g, "/");
      const convertedDate = BSToAD(bsDateFormatted);
      setValue("dobEng", convertedDate);
    } catch (error) {
      console.error("Failed to convert BS to AD:", error.message);
      setValue("dobEng", "");
    }
  };

  const changeIssueDateBs = (newValue) => {
    setValue("issueDateNep", newValue);
    if (!newValue || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(newValue)) {
      setValue("issueDateEng", "");
      return;
    }
    try {
      const datePart = newValue.split("T")[0];
      const bsDateFormatted = datePart.replace(/-/g, "/");
      const convertedDate = BSToAD(bsDateFormatted);
      setValue("issueDateEng", convertedDate);
    } catch (error) {
      console.error("Failed to convert BS to AD:", error.message);
      setValue("issueDateEng", "");
    }
  };

  // Function to validate BS year input (4 digits)
  const validateBSYear = (value) => {
    if (!value) return "Year is required";
    if (!/^\d{4}$/.test(value)) return "Please enter a valid 4-digit year";
    const year = parseInt(value);
    if (year < 2000 || year > 2100)
      return "Year must be between 2000 and 2100 BS";
    return true;
  };

  const outerBorderStyle = {
    position: "relative",
    borderRadius: "5px",
    border: "1px dashed #c1c1c1",
    marginTop: "30px",
    padding: "8px",
  };

  const sectionHeadingStyle = {
    position: "absolute",
    top: "-16px",
    color: "#666666",
    left: "15px",
    border: "1px solid #666666",
    borderRadius: "10px",
    background: "white",
    padding: "2px 8px",
    fontWeight: "500",
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={10} mx="auto">
          <Box
            sx={{
              backgroundColor: "#2A629A",
              py: 2,
              textAlign: "center",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <Typography variant="h5" sx={{ color: "white", fontWeight: "600" }}>
              Alumni Registration
            </Typography>
          </Box>
          <CardContent
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: "0 0 10px 10px",
              boxShadow: "0px 3px 6px rgba(0,0,0,0.16)",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.3}>
                  <FormControl fullWidth size="small">
                    <InputLabel required id="fiscalYearId-label">
                      Graduated Fiscal Year
                    </InputLabel>
                    <Select
                      {...register("fiscalYearId", { required: true })}
                      value={watch("fiscalYearId") || defaultFiscal}
                      id="fiscalYearId"
                      labelId="fiscalYearId-label"
                      label="Graduated Fiscal Year"
                    >
                      {fiscalYears.map((fy) => (
                        <MenuItem key={fy.id} value={fy.id}>
                          {fy.yearNepali}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    required
                    name="applicantNameNep"
                    size="small"
                    label="आवेदकको नाम देवनागरीमा(unicode)"
                    type="text"
                    {...register("applicantNameNep", { required: true })}
                    error={!!errors.applicantNameNep}
                    helperText={
                      errors.applicantNameNep &&
                      "Applicant Name (Nepali) is required"
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    required
                    name="applicantNameEng"
                    size="small"
                    label="Applicant Name (English)"
                    {...register("applicantNameEng", { required: true })}
                    error={!!errors.applicantNameEng}
                    helperText={
                      errors.applicantNameEng && "Applicant Name is required"
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2.7}>
                  <Controller
                    name="dobNep"
                    control={control}
                    defaultValue=""
                    rules={{
                      validate: (value) => {
                        if (value) {
                          const date = new Date(value);
                          if (isNaN(date.getTime())) {
                            return "Invalid Date";
                          }
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <BikramSambatDateInput
                        {...field}
                        required
                        label="Date of Birth (B.S)"
                        name="dobNep"
                        format={"YYYY/MM/DD"}
                        value={field.value || ""}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          handleDobBsChange(newValue);
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
                    InputProps={{ readOnly: true }}
                    fullWidth
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3.5}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    size="small"
                    label="Email"
                    type="email"
                    {...register("email", { required: true })}
                    error={!!errors.email}
                    helperText={errors.email && "Email is required"}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.5}>
                  <FormControl fullWidth size="small" error={!!errors.gender}>
                    <InputLabel required>Gender</InputLabel>
                    <Select
                      fullWidth
                      required
                      name="gender"
                      size="small"
                      label="Gender"
                      {...register("gender", { required: true })}
                      error={!!errors.gender}
                    >
                      <MenuItem disabled value="">
                        Select Gender
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3.5}>
                  <FormControl
                    sx={{ borderColor: "blue" }}
                    size="small"
                    fullWidth
                    error={!!errors.ethnicity}
                  >
                    <InputLabel
                      sx={{ borderColor: "blue" }}
                      id="ethnicity"
                      required
                    >
                      Ethnicity
                    </InputLabel>

                    <Select
                      {...register("ethnicity", { required: true })}
                      required
                      labelId="ethnicity"
                      id="ethnicity"
                      name="ethnicity"
                      label="Ethnicity"
                      fullWidth
                      error={!!errors.ethnicity}
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
                    type="text"
                    required
                    {...register("studentAddress", { required: true })}
                    error={!!errors.studentAddress}
                    helperText={
                      errors.studentAddress && "Student Address is required"
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    name="studentRegNo"
                    label="Registration Number"
                    {...register("studentRegNo")}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" error={!!errors.level}>
                    <InputLabel required>Level</InputLabel>
                    <Select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      fullWidth
                      required
                      size="small"
                      name="level"
                      label="Level"
                      error={!!errors.level}
                    >
                      <MenuItem value="" disabled>
                        Select Level
                      </MenuItem>
                      {filteredLevels.map((levelName, index) => (
                        <MenuItem key={index} value={levelName}>
                          {levelName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth size="small" error={!!errors.program}>
                    <InputLabel required>Program</InputLabel>
                    <Select
                      {...register("program", { required: true })}
                      fullWidth
                      required
                      size="small"
                      name="program"
                      label="Program"
                      error={!!errors.program}
                    >
                      <MenuItem value="" disabled>
                        Select Program
                      </MenuItem>
                      {filteredPrograms?.map((program) => (
                        <MenuItem key={program.id} value={program?.id}>
                          {" "}
                          {program?.programName}{" "}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="issueDateNep"
                    control={control}
                    defaultValue=""
                    rules={{
                      validate: (value) => {
                        if (value) {
                          const date = new Date(value);
                          if (isNaN(date.getTime())) {
                            return "Invalid Date";
                          }
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <BikramSambatDateInput
                        {...field}
                        required
                        label="Date of Issue (B.S)"
                        name="issueDateNep"
                        format={"YYYY/MM/DD"}
                        value={field.value || ""}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          changeIssueDateBs(newValue);
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
                    InputProps={{ readOnly: true }}
                    fullWidth
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    name="universityIssueNo"
                    label="University Issue No."
                    {...register("universityIssueNo")}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    name="symbolNo"
                    label="Symbol Number"
                    {...register("symbolNo")}
                    error={!!errors.symbolNo}
                    helperText={errors.symbolNo && ""}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    name="campusRollNo"
                    label="Campus Roll No."
                    {...register("campusRollNo")}
                  />
                </Grid>

                {/* Updated Enrolled Year field to accept BS year */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    name="enrolledYear"
                    label="Enrolled Year (B.S)"
                    inputProps={{
                      maxLength: 4,
                      pattern: "[0-9]{4}",
                      inputMode: "numeric",
                    }}
                    {...register("enrolledYear", {
                      required: "Enrolled Year is required",
                      validate: validateBSYear,
                    })}
                    error={!!errors.enrolledYear}
                    helperText={errors.enrolledYear?.message || ""}
                  />
                </Grid>

                {/* Updated Passed Year field to accept BS year */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Passed Year (B.S)"
                    name="passedYear"
                    inputProps={{
                      maxLength: 4,
                      pattern: "[0-9]{4}",
                      inputMode: "numeric",
                    }}
                    {...register("passedYear", {
                      required: "Passed Year is required",
                      validate: validateBSYear,
                    })}
                    error={!!errors.passedYear}
                    helperText={errors.passedYear?.message || ""}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    {...register("division")}
                    label="Grade/Division"
                    name="division"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.3}>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    name="gpa"
                    label="GPA / Percentage"
                    inputProps={{ step: "0.01", min: 0, max: 100 }}
                    {...register("gpa")}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3.7}>
                  <TextField
                    required
                    fullWidth
                    name="fatherName"
                    size="small"
                    label="Father Name"
                    {...register("fatherName", { required: true })}
                    error={!!errors.fatherName}
                    helperText={errors.fatherName && "Father Name is required"}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    name="motherName"
                    label="Mother Name"
                    {...register("motherName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2.5}>
                  <TextField
                    fullWidth
                    size="small"
                    name="contactNumber"
                    label="Contact Number"
                    type="tel"
                    inputProps={{ maxLength: 10 }}
                    {...register("contactNumber", {
                      required: true,
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
                    })}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber?.message || ""}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6.5}>
                  <TextField
                    fullWidth
                    size="small"
                    name="remarks"
                    label="Remarks"
                    {...register("remarks")}
                  />
                </Grid>

                <Grid container item xs={12} sx={outerBorderStyle}>
                  <Typography sx={sectionHeadingStyle}>
                    Passport size photo & Documents
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                    sx={{ pt: 2, pl: 1, pb: 1, ml: 3 }}
                  >
                    <StdDocUploader
                      label="Upload PP size photo"
                      name="uploadPhoto"
                      value={fileUploads.uploadPhoto}
                      onFileChange={(file) =>
                        handleFileChange("uploadPhoto", file)
                      }
                      acceptedTypes="image/*"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                    sx={{ pt: 2, pl: 2, pb: 1, ml: 3 }}
                  >
                    <StdDocUploader
                      label="Upload Transcript"
                      name="uploadTranscript"
                      value={fileUploads.uploadTranscript}
                      onFileChange={(file) =>
                        handleFileChange("uploadTranscript", file)
                      }
                      acceptedTypes="image/*,application/pdf"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                    sx={{ pt: 2, pl: 1, pb: 1, ml: 3 }}
                  >
                    <StdDocUploader
                      label="Upload Receipt"
                      name="uploadReceipt"
                      value={fileUploads.uploadReceipt}
                      onFileChange={(file) =>
                        handleFileChange("uploadReceipt", file)
                      }
                      acceptedTypes="image/*,application/pdf"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                    sx={{ pt: 2, pl: 1, pb: 1, ml: 3 }}
                  >
                    <StdDocUploader
                      label="Upload Other Docs"
                      name="uploadOtherDocs"
                      value={fileUploads.uploadOtherDocs}
                      onFileChange={(file) =>
                        handleFileChange("uploadOtherDocs", file)
                      }
                      acceptedTypes="image/*,application/pdf"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                    sx={{ pt: 2, pl: 1, pb: 1, ml: 3 }}
                  >
                    <StdDocUploader
                      label="Upload Signature"
                      name="uploadSignature"
                      value={fileUploads.uploadSignature}
                      onFileChange={(file) =>
                        handleFileChange("uploadSignature", file)
                      }
                      acceptedTypes="image/*"
                    />
                  </Grid>
                </Grid>
                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    sx={{ px: 4, py: 1, fontSize: "1.1rem" }}
                    startIcon={isLoading && <CircularProgress size={20} />}
                  >
                    {isLoading ? "Submitting..." : "Submit Alumni Form"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlumniRegister;
