import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import BikramSambatDateInput from "../../DateField/DateInputField";
import { StdDocUploader } from "../../../pages/students/StdDocUploader";
import { BSToAD, ADToBS } from "bikram-sambat-js";
import { config } from "@config";

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

const GraduationModule = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState({});
  const [fiscalYears, setFiscalYears] = useState([]);
  const [activeFiscal, setActiveFiscal] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [responseId, setResponseId] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const studentId = id;
  const collegeId = currentUser.institution?.id;

  const [fileUploads, setFileUploads] = useState({
    uploadPhoto: null,
    uploadSignature: null,
    uploadReceipt: null,
    uploadTranscript: null,
    uploadOtherDocs: null,
  });

  // Function to get today's date in Nepali and English system
  const getTodayDates = () => {
    const todayAD = new Date();
    const adDateFormatted = todayAD.toISOString().split("T")[0];

    // Convert to BS
    try {
      const bsDate = ADToBS(adDateFormatted.replace(/-/g, "/"));
      const bsDateFormatted = `${bsDate.replace(/\//g, "-")}T00:00:00`;
      return { adDate: adDateFormatted, bsDate: bsDateFormatted };
    } catch (error) {
      console.error("Failed to convert AD to BS:", error);
      return { adDate: adDateFormatted, bsDate: "" };
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const config = getAuthConfigSafe();
        const verifiedStudents = await axios.get(
          `${backendUrl}/Student/${id}`,
          config
        );
        const studentData = verifiedStudents.data;
        setStudents(studentData);
        setValue("email", studentData.email || "");
        setValue("fatherName", studentData.fatherName || "");
        setValue("motherName", studentData.motherName || "");
        setValue("doBNepali", studentData.doBBS || "");
        setValue("applicantNameNep", studentData.nepaliName || "");
        // Fix for AD date format - extract just the date part
        const doBAD = studentData.doBAD ? studentData.doBAD.split("T")[0] : "";
        setValue("doBEng", doBAD);

        // Fix for student address - check if all components exist
        const addressParts = [
          studentData.tLocality,
          studentData.tLocalLevel,
          studentData.tDistrict,
        ].filter((part) => part && part.trim() !== "");

        setValue("studentAddress", addressParts.join(", ") || "");
        setValue("campusRollNo", studentData.rollNoManual || "");
        setValue("symbolNo", studentData.symbolNo || "");
        setValue("studentRegNo", studentData.universityRegdNo || "");
        // setValue("enrolledYear", studentData.admissionYear || "");

        // Today Dates - FIXED: Use consistent field names
        const todayDates = getTodayDates();
        setValue("issueDateNep", todayDates.bsDate);
        setValue("issueDateEng", todayDates.adDate); // Fixed field name
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error("Failed to load students");
      }
    };

    fetchStudents();
  }, [id, setValue]);

  const fetchGraduationData = async () => {
    try {
      const config = getAuthConfigSafe();
      const fiscalYearResponse = await axios.get(
        `${backendUrl}/FiscalYear`,
        config
      );
      const active = fiscalYearResponse.data.find(
        (item) => item.activeFiscalYeavr === true
      );
      setFiscalYears(fiscalYearResponse.data);
      if (active) {
        setActiveFiscal(active);
        setValue("fiscalYearId", active.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraduationData();
  }, []);

  // Handle file changes
  const handleFileChange = (fieldName, file) => {
    setFileUploads((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
    setValue(fieldName, file);
  };

  const handledoBBSChange = (newValue) => {
    setValue("doBNepali", newValue);
    if (!newValue || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(newValue)) {
      setValue("doBEng", "");
      return;
    }
    try {
      const datePart = newValue.split("T")[0];
      const bsDateFormatted = datePart.replace(/-/g, "/");
      const convertedDate = BSToAD(bsDateFormatted);
      // Extract just the date part for consistency
      const convertedDatePart = convertedDate.split("T")[0];
      setValue("doBEng", convertedDatePart);
    } catch (error) {
      console.error("Failed to convert BS to AD:", error.message);
      setValue("doBEng", "");
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
      // Extract just the date part for consistency
      const convertedDatePart = convertedDate.split("T")[0];
      setValue("issueDateEng", convertedDatePart);
    } catch (error) {
      console.error("Failed to convert BS to AD:", error.message);
      setValue("issueDateEng", "");
    }
  };

  const onSubmit = async (data) => {
    // Create FormData object for multipart form data
    const formData = new FormData();

    // Append all text fields
    formData.append("fiscalYearID", parseInt(data.fiscalYearId) || 0);
    formData.append("studentID", parseInt(studentId) || 0);
    formData.append(
      "universityName",
      students.uniName || "Tribhuvan University"
    );
    formData.append("campusId", collegeId || 0);
    formData.append("campusName", students.collegeName || "");
    formData.append("facultyName", students.facultyName || "");
    formData.append("levelName", students.levelName || "");
    formData.append("programType", students.programType || "");
    formData.append("programName", students.programName || "");
    formData.append(
      "applicantNameEng",
      `${students.firstName || ""} ${students.middleName || ""} ${
        students.lastName || ""
      }`.trim()
    );
    formData.append(
      "applicantNameNep",
     data.applicantNameNep ||students.nepaliName || ""
    );
    formData.append("doBNepali", data.doBNepali || students.doBBS || "");
    formData.append(
      "doBEng",
      data.doBEng || students.doBAD || new Date().toISOString()
    );
    formData.append("email", data.email || students.email || "");
    formData.append("universityIssueNo", data.universityIssueNo || "");
    formData.append(
      "studentRegNo",
      data.studentRegNo || students.universityRegdNo || ""
    );
    formData.append(
      "symbolNoUniversity",
      data.symbolNo || students.symbolNo || ""
    );
    formData.append(
      "campusRolNo",
      data.campusRollNo || students.rollNoManual || ""
    );
    formData.append(
      "enrolledYear",
      parseInt(data.enrolledYear) || parseInt(students.admissionYear) || 0
    );
    formData.append("passedYear", parseInt(data.passedYear) || 0);
    formData.append("division", data.division || "");
    formData.append("gpa", parseFloat(data.gpa) || 0);
    formData.append("fatherName", data.fatherName || students.fatherName || "");
    formData.append("motherName", data.motherName || students.motherName || "");
    formData.append("contactNo", students.phoneNumber || "");
    formData.append("edj", ""); // Not provided in form
    formData.append("remarks", data.remarks || "");
    formData.append("programMgmtId", students.programId || 0);
    formData.append("gender", students.gender || "");
    formData.append(
      "issueDateEng",
      data.issueDateEng || new Date().toISOString()
    );
    formData.append("issueDateNep", data.issueDateNep || "");
    formData.append("studentType", "regular"); // Default value
    formData.append(
      "studentAddress",
      data.studentAddress ||
        `${students.tLocality}, ${students.tLocalLevel}, ${students.tDistrict}` ||
        ""
    );
    formData.append("ethinicity", students.ethnicity || "");

    // Append file uploads if they exist
    if (fileUploads.uploadSignature) {
      formData.append("uploadSignature", fileUploads.uploadSignature);
    }
    if (fileUploads.uploadPhoto) {
      formData.append("uploadPPSizePhoto", fileUploads.uploadPhoto);
    }
    if (fileUploads.uploadReceipt) {
      formData.append("uploadReceipt", fileUploads.uploadReceipt);
    }
    if (fileUploads.uploadTranscript) {
      formData.append("uploadTranscript", fileUploads.uploadTranscript);
    }
    if (fileUploads.uploadOtherDocs) {
      formData.append("uploadOtherDoc", fileUploads.uploadOtherDocs);
    }

    try {
      setIsLoading(true);
      const config = getAuthConfigSafe();

      // Update config for multipart form data
      const multipartConfig = {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        `${backendUrl}/Graduation/GenerateGraduationApplicationForStudent`,
        formData,
        multipartConfig
      );

      const responseId = response.data.id;
      setResponseId(responseId);

      if (response.status === 201) {
        toast.success("Data posted successfully", {
          autoClose: 1500,
          onClose: () => {
            // Redirect to graduation list page after successful submission
            navigate("/graduation-management/graduation-list-enrolled");
          },
        });
      } else {
        toast.error("An error occurred while submitting the form.");
      }

      reset();
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  //Get current Year
  const getCurrentYear = () => new Date().getFullYear();
  const currentYear = getCurrentYear();
  //Validation for enrolled year
  const validateEnrolledYear = (value) => {
    const year = parseInt(value);

    if (!value) return "Enrolled year is required";
    if (isNaN(year)) return "Please enter a valid Year";
    if (year > currentYear) return `cannot be greater than ${currentYear}`;
    if (year < 1900) return "Year must be after 1900";

    return true;
  };
  const validatePassedYear = (value) => {
    const passedYear = parseInt(value);
    const enrolledYear = parseInt(watch("enrolledYear"));

    if (!value) return "Passed year is required";
    if (isNaN(passedYear)) return "Please enter a valid year";
    if (passedYear > currentYear)
      return `Cannot be greater than ${currentYear}`;

    //Validate against enrolled year
    if (enrolledYear && passedYear < enrolledYear) {
      return "Passed year cannot be earlier than enrolled year";
    }
    if (passedYear < 1900) {
      return "Please enter a valid passed year";
    }
    return true;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} mx="auto">
        <Paper elevation={3} sx={{ borderRadius: "10px" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: "#2A629A", mb: 3 }}
            >
              Graduation Management for Enrolled Students
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={1}>
                {/* Student Information Section */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="studentName"
                    size="small"
                    label="Student Name"
                    value={`${students.firstName || ""} ${
                      students.middleName || ""
                    } ${students.lastName || ""}`.trim()}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="applicantNameNep"
                    size="small"
                    label="Student Name (Nepali)"
                    // value={students.nepaliName || ""}
                    InputLabelProps={{ shrink: true }}
                    {...register("applicantNameNep")}
                    // defaultValue={students.nepaliName || ""}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="level"
                    size="small"
                    label="Level"
                    value={students.levelName || ""}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="program"
                    size="small"
                    label="Program"
                    value={students.programName || ""}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={2.2}>
                  <FormControl fullWidth size="small">
                    <InputLabel required id="fiscalYearId-label">
                      Graduated Fiscal Year
                    </InputLabel>
                    <Select
                      {...register("fiscalYearId", { required: true })}
                      id="fiscalYearId"
                      value={watch("fiscalYearId") || ""}
                      labelId="fiscalYearId-label"
                      label="Graduated Fiscal Year"
                      error={!!errors.fiscalYearId}
                    >
                      {fiscalYears.map((fy) => (
                        <MenuItem key={fy.id} value={fy.id}>
                          {fy.yearNepali}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={2.8}>
                  <TextField
                    fullWidth
                    required
                    name="email"
                    size="small"
                    label="Student Email"
                    type="email"
                    {...register("email", { required: true })}
                    error={!!errors.email}
                    helperText={errors.email && "Student email is required"}
                    InputLabelProps={{ shrink: true }}
                    // InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      fullWidth
                      name="gender"
                      size="small"
                      label="Gender"
                      value={students.gender || ""}
                      InputProps={{ readOnly: true }}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="studentAddress"
                    size="small"
                    label="Student Address"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    {...register("studentAddress", { required: true })}
                    error={!!errors.studentAddress}
                    helperText={
                      errors.studentAddress && "Student address is required"
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="ethnicity"
                    size="small"
                    label="Ethnicity"
                    value={students.ethnicity || ""}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    disabled
                  />
                </Grid>

                <Grid
                  display="flex"
                  justifyContent="space-between"
                  item
                  xs={12}
                  sm={2}
                >
                  <Controller
                    name="doBNepali"
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
                        name="doBNepali"
                        format={"YYYY/MM/DD"}
                        InputLabelProps={{ shrink: true }}
                        value={field.value || students.doBBS || ""}
                        readOnly={true}
                        disabled={true}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          handledoBBSChange(newValue);
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    name="doBEng"
                    size="small"
                    label="Date of Birth (A.D)"
                    value={watch("doBEng") || ""}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    required
                    name="fatherName"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="Father's Name"
                    {...register("fatherName", { required: true })}
                    error={!!errors.fatherName}
                    helperText={
                      errors.fatherName && "Father's name is required"
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    name="motherName"
                    InputLabelProps={{ shrink: true }}
                    label="Mother's Name"
                    {...register("motherName", { required: true })}
                    error={!!errors.motherName}
                    helperText={
                      errors.motherName && "Mother's name is required"
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    name="contactNumber"
                    label="Contact Number"
                    InputLabelProps={{ shrink: true }}
                    type="tel"
                    value={students.phoneNumber || ""}
                    InputProps={{ readOnly: true }}
                    disabled
                  />
                </Grid>

                {/* Academic Information Section */}
                <Grid
                  display="flex"
                  justifyContent="space-between"
                  item
                  xs={12}
                  sm={2}
                >
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
                        label="Issue Date (B.S)"
                        name="issueDateNep"
                        format={"YYYY/MM/DD"}
                        value={field.value || ""}
                        InputLabelProps={{ shrink: true }}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          changeIssueDateBs(newValue);
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    name="issueDateEng"
                    size="small"
                    label="Issue Date (AD)"
                    InputLabelProps={{ shrink: true }}
                    value={watch("issueDateEng") || ""}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    name="universityIssueNo"
                    label="University Issue No."
                    {...register("universityIssueNo", { required: true })}
                    error={!!errors.universityIssueNo}
                    helperText={
                      errors.universityIssueNo &&
                      "University Issue No. is required"
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    name="studentRegNo"
                    InputLabelProps={{ shrink: true }}
                    label="Registration Number"
                    {...register("studentRegNo", { required: true })}
                    error={!!errors.studentRegNo}
                    helperText={
                      errors.studentRegNo && "Registration Number is required"
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    name="symbolNo"
                    label="Symbol Number"
                    {...register("symbolNo", { required: true })}
                    error={!!errors.symbolNo}
                    helperText={errors.symbolNo && "Symbol Number is required"}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    name="campusRollNo"
                    InputLabelProps={{ shrink: true }}
                    label="Campus Roll No."
                    {...register("campusRollNo")}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    name="enrolledYear"
                    label="Enrolled Year (AD)"
                    InputLabelProps={{ shrink: true }}
                    {...register("enrolledYear", {
                      required: "Enrolled year is required",
                      validate: validateEnrolledYear,
                    })}
                    error={!!errors.enrolledYear}
                    helperText={errors.enrolledYear?.message}
                    InputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                        if (e.target.value.length > 4) {
                          e.target.value = e.target.value.slice(0, 4);
                        }
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Passed Year (AD)"
                    InputLabelProps={{ shrink: true }}
                    name="passedYear"
                    {...register("passedYear", {
                      required: "Passed year is required",
                      validate: validatePassedYear,
                    })}
                    error={!!errors.passedYear}
                    helperText={errors.passedYear?.message}
                    InputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                        if (e.target.value.length > 4) {
                          e.target.value = e.target.value.slice(0, 4);
                        }
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    {...register("division", { required: true })}
                    label="Grade/Division"
                    InputLabelProps={{ shrink: true }}
                    name="division"
                    size="small"
                    required // Add this prop
                    error={!!errors.division}
                    helperText={errors.division && "Grade/Division is required"}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    name="gpa"
                    label="GPA / Percentage"
                    inputProps={{ step: "0.01", min: 0, max: 100 }}
                    {...register("gpa", { required: true })}
                    error={!!errors.gpa}
                    helperText={errors.gpa && "GPA/Percentage is required"}
                  />
                </Grid>

                {/* Document Upload Section */}
                <Grid container xs={12} style={outerBorderStyle}>
                  <h1 style={sectionHeadingStyle}>
                    Passport Size Photo & Documents
                  </h1>
                  <Grid item xs={3} className="pt-4 pl-2 pb-2">
                    <StdDocUploader
                      label="Upload PP Size Photo"
                      name="uploadPhoto"
                      value={fileUploads.uploadPhoto}
                      onFileChange={(file) =>
                        handleFileChange("uploadPhoto", file)
                      }
                      acceptedTypes="image/*"
                    />
                  </Grid>
                  <Grid item xs={3} className="pt-4 pl-2 pb-2">
                    <StdDocUploader
                      label="Upload Transcript"
                      name="uploadTranscript"
                      value={fileUploads.uploadTranscript}
                      onFileChange={(file) =>
                        handleFileChange("uploadTranscript", file)
                      }
                      acceptedTypes="image/*,application/pdf"
                      existingFileUrl={null}
                    />
                  </Grid>
                  <Grid item xs={3} className="pt-4 pl-2 pb-2">
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
                  <Grid item xs={3} className="pt-4 pl-2 pb-2">
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
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    name="remarks"
                    label="Remarks"
                    {...register("remarks")}
                  />
                </Grid>

                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Graduated"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GraduationModule;
