import { useEffect, useState } from "react";
import { StdDocUploader } from "../../../pages/students/StdDocUploader";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  DialogContent,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import DateInputField from "../../DateField/DateConverterField";
import { BSToAD } from "bikram-sambat-js";
import toast from "react-hot-toast";
import { getEthnicGroup } from "../../../services/services";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

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

// Utility function for safe date conversion
const safeBSToAD = (nepaliDate) => {
  if (!nepaliDate) return "";

  // Validate the format first
  if (!nepaliDate.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) {
    console.warn("Invalid Nepali date format:", nepaliDate);
    return "";
  }

  try {
    const englishDate = BSToAD(nepaliDate);
    // Validate the converted date
    const dateObj = new Date(englishDate);
    if (englishDate && !isNaN(dateObj.getTime())) {
      return englishDate;
    }
    return "";
  } catch (error) {
    console.error("Date conversion error:", error);
    return "";
  }
};

// Function to format date as YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return "";

  // If it's already in YYYY-MM-DD format, return as is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }

  // If it's a full ISO string, extract the date part
  if (dateString.includes("T")) {
    return dateString.split("T")[0];
  }

  // Try to parse and format
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return "";
};

const EditGraduationForOld = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
 const uploadURL=config.VITE_BASE_URL; 
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fiscalYearId: "",
      applicantNameEng: "",
      applicantNameNep: "",
      dobNep: "",
      dobEng: "",
      email: "",
      gender: "",
      ethnicity: "",
      studentAddress: "",
      levelName: "",
      program: "",
      issueDateNep: "",
      issueDateEng: "",
      universityIssueNo: "",
      studentRegNo: "",
      symbolNo: "",
      campusRollNo: "",
      enrolledYear: "",
      passedYear: "",
      division: "",
      gpa: "",
      fatherName: "",
      motherName: "",
      contactNumber: "",
      remarks: "",
      uploadPhoto: null,
      uploadTranscript: null,
      uploadReceipt: null,
      uploadOtherDocs: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [level, setLevel] = useState("");
  const [ethnicGroup, setEthnicGroup] = useState([]);

  const fetchProgramData = async () => {
    try {
      const config = getAuthConfigSafe();
      const response = await axios.get(
        `${backendUrl}/ProgramMgmt/GetCollegePrograms`,
        config
      );
      setProgramData(response.data);
    } catch (err) {
      console.error("Error fetching program data:", err);
      toast.error("Failed to load programs");
    }
  };

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
    fetchProgramData();
  }, []);

  useEffect(() => {
    if (programData.length > 0) {
      const levels = [...new Set(programData.map((item) => item.levelName))];
      setFilteredLevels(levels);
    }
  }, [programData]);

  const fetchGraduationData = async () => {
    setIsLoading(true);
    try {
      const config = getAuthConfigSafe();
      const [graduationResponse, fiscalYearResponse] = await Promise.all([
        axios.get(`${backendUrl}/Graduation/${id}`, config),
        axios.get(`${backendUrl}/FiscalYear`, config),
      ]);
      const graduationData = graduationResponse.data;
      setFiscalYears(fiscalYearResponse.data);

      // Set level state
      setLevel(graduationData.levelName || "");

      // Set form values
      Object.entries({
        fiscalYearId: graduationData.fiscalYearID,
        applicantNameEng: graduationData.applicantNameEng || "",
        applicantNameNep: graduationData.applicantNameNep || "",
        dobNep: graduationData.doBNepali || "",
        email: graduationData.email || "",
        universityIssueNo: graduationData.universityIssueNo || "",
        levelName: graduationData.levelName || "",
        studentRegNo: graduationData.studentRegNo || "",
        symbolNo: graduationData.symbolNoUniversity || "",
        campusRollNo: graduationData.campusRolNo || "",
        enrolledYear: graduationData.enrolledYear || "",
        passedYear: graduationData.passedYear || "",
        division: graduationData.division || "",
        gpa: graduationData.gpa || "",
        gender: graduationData.gender || "",
        fatherName: graduationData.fatherName || "",
        motherName: graduationData.motherName || "",
        contactNumber: graduationData.contactNo || "",
        program: graduationData.programMgmtId || "",
        remarks: graduationData.remarks || "",
        ethnicity: graduationData.ethinicity || "",
        studentAddress: graduationData.studentAddress || "",
        issueDateNep: graduationData.issueDateNep || "",
        uploadPPSizePhoto: graduationData.uploadPPSizePhoto || "",
        uploadTranscript: graduationData.uploadTranscript || "",
        uploadReceipt: graduationData.uploadReceipt || "",
        uploadOtherDoc: graduationData.uploadOtherDoc || "",
      }).forEach(([key, value]) => {
        setValue(key, value);
      });

      // Handle date conversions with safe functions
      if (graduationData.doBNepali) {
        const englishDate = safeBSToAD(graduationData.doBNepali);
        if (englishDate) {
          setValue("dobEng", formatDate(englishDate));
        } else if (graduationData.doBEng) {
          setValue("dobEng", formatDate(graduationData.doBEng));
        } else {
          setValue("dobEng", "");
        }
      } else if (graduationData.doBEng) {
        setValue("dobEng", formatDate(graduationData.doBEng));
      } else {
        setValue("dobEng", "");
      }

      if (graduationData.issueDateNep) {
        const englishDate = safeBSToAD(graduationData.issueDateNep);
        if (englishDate) {
          setValue("issueDateEng", formatDate(englishDate));
        } else if (graduationData.issueDateEng) {
          setValue("issueDateEng", formatDate(graduationData.issueDateEng));
        } else {
          setValue("issueDateEng", "");
        }
      } else if (graduationData.issueDateEng) {
        setValue("issueDateEng", formatDate(graduationData.issueDateEng));
      } else {
        setValue("issueDateEng", "");
      }
    } catch (error) {
      console.error("Error fetching graduation data:", error);
      toast.error("Failed to load graduation details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGraduationData();
    }
  }, [id, setValue]);

  useEffect(() => {
    if (level && programData.length > 0) {
      const programs = programData.filter((item) => item.levelName === level);
      setFilteredPrograms(programs);
    }
  }, [level, programData]);

  const dobNep = watch("dobNep");
  const issueDateNep = watch("issueDateNep");

  // Fixed DOB date conversion
  useEffect(() => {
    if (dobNep) {
      const englishDate = safeBSToAD(dobNep);
      setValue("dobEng", formatDate(englishDate));
    } else {
      setValue("dobEng", "");
    }
  }, [dobNep, setValue]);

  // Fixed Issue date conversion
  useEffect(() => {
    if (issueDateNep) {
      const englishDate = safeBSToAD(issueDateNep);
      setValue("issueDateEng", formatDate(englishDate));
    } else {
      setValue("issueDateEng", "");
    }
  }, [issueDateNep, setValue]);

  const handleLevelChange = (e) => {
    const selectedLevel = e.target.value;
    setLevel(selectedLevel);
    setValue("levelName", selectedLevel);
    setValue("program", "");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append all required fields
      formData.append("id", id);
      formData.append("fiscalYearID", data.fiscalYearId);
      formData.append("applicantNameEng", data.applicantNameEng);
      formData.append("applicantNameNep", data.applicantNameNep);
      formData.append("doBNepali", data.dobNep);
      formData.append("doBEng", data.dobEng);
      formData.append("email", data.email);
      formData.append("gender", data.gender);
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
      formData.append("programMgmtId", data.program);
      formData.append("remarks", data.remarks || "");
      formData.append("ethinicity", data.ethnicity || "");
      formData.append("studentAddress", data.studentAddress || "");
      formData.append("issueDateEng", data.issueDateEng || "");
      formData.append("issueDateNep", data.issueDateNep || "");

      // Handle file uploads properly
      if (data.uploadPhoto instanceof File) {
        formData.append("uploadPPSizePhoto", data.uploadPhoto);
      } else if (data.uploadPPSizePhoto) {
        formData.append("uploadPPSizePhoto", data.uploadPPSizePhoto);
      }

      if (data.uploadTranscript instanceof File) {
        formData.append("uploadTranscript", data.uploadTranscript);
      } else if (data.uploadTranscript) {
        formData.append("uploadTranscript", data.uploadTranscript);
      }

      if (data.uploadReceipt instanceof File) {
        formData.append("uploadReceipt", data.uploadReceipt);
      } else if (data.uploadReceipt) {
        formData.append("uploadReceipt", data.uploadReceipt);
      }

      if (data.uploadOtherDocs instanceof File) {
        formData.append("uploadOtherDoc", data.uploadOtherDocs);
      } else if (data.uploadOtherDoc) {
        formData.append("uploadOtherDoc", data.uploadOtherDoc);
      }

      const config = getAuthConfigSafe();

      // Log the data for debugging
      console.log("Submitting data:", {
        dobNep: data.dobNep,
        dobEng: data.dobEng,
        issueDateNep: data.issueDateNep,
        issueDateEng: data.issueDateEng,
      });

      await axios.put(`${backendUrl}/Graduation/${id}`, formData, {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Graduation details updated successfully");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating graduation data:", error);
      console.error("Error response:", error.response);
      toast.error(
        error.response?.data?.message || "Failed to update graduation details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", color: "#2A629A", padding: "10px" }}
      >
        Edit Graduation Details for old students
      </Typography>
      {isLoading ? (
        <Typography align="center">Loading data...</Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small" error={!!errors.fiscalYearId}>
                <InputLabel required id="fiscalYearId-label">
                  Fiscal Year
                </InputLabel>
                <Controller
                  name="fiscalYearId"
                  control={control}
                  rules={{ required: "Fiscal Year is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="fiscalYearId"
                      labelId="fiscalYearId-label"
                      label="Fiscal Year"
                    >
                      {fiscalYears.map((fy) => (
                        <MenuItem key={fy.id} value={fy.id}>
                          {fy.yearNepali}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                name="applicantNameNep"
                size="small"
                label="Applicant Name (Nepali)"
                type="text"
                {...register("applicantNameNep", {
                  required: "Nepali name is required",
                })}
                error={!!errors.applicantNameNep}
                helperText={errors.applicantNameNep?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                name="applicantNameEng"
                size="small"
                label="Applicant Name (English)"
                {...register("applicantNameEng", {
                  required: "English name is required",
                })}
                error={!!errors.applicantNameEng}
                helperText={errors.applicantNameEng?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <DateInputField
                name="dobNep"
                label="DOB (Nepali)"
                control={control}
                format="YYYY/MM/DD"
                rules={{
                  required: "Nepali date of birth is required",
                  validate: (value) => {
                    if (!value) return "Date of birth is required";
                    if (!value.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) {
                      return "Invalid date format (YYYY/MM/DD)";
                    }
                    try {
                      const englishDate = BSToAD(value);
                      const dateObj = new Date(englishDate);
                      if (isNaN(dateObj.getTime())) {
                        return "Invalid Nepali date";
                      }
                      return true;
                    } catch (error) {
                      return "Invalid Nepali date";
                    }
                  },
                }}
                error={errors.dobNep}
                helperText={errors.dobNep?.message}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                name="dobEng"
                size="small"
                label="DOB (English)"
                InputLabelProps={{ shrink: true }}
                value={watch("dobEng") || ""}
                {...register("dobEng")}
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                name="email"
                size="small"
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small" error={!!errors.gender}>
                <InputLabel required>Gender</InputLabel>
                <Select
                  {...register("gender", { required: "Gender is required" })}
                  label="Gender"
                  value={watch("gender") || ""}
                  error={!!errors.gender}
                >
                  <MenuItem disabled value="">
                    Select Gender
                  </MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography variant="caption" color="error">
                    {errors.gender.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl
                sx={{ borderColor: "blue" }}
                size="small"
                fullWidth
                error={!!errors.ethnicity}
              >
                <InputLabel
                  sx={{ borderColor: "blue" }}
                  id="ethnicity-label"
                  required
                >
                  Ethnicity
                </InputLabel>
                <Select
                  required
                  labelId="ethnicity-label"
                  id="ethnicity"
                  label="Ethnicity"
                  fullWidth
                  {...register("ethnicity", {
                    required: "Ethnicity is required",
                  })}
                  value={watch("ethnicity") || ""}
                >
                  <MenuItem value="" disabled>
                    Select Ethnicity
                  </MenuItem>
                  {ethnicGroup &&
                    ethnicGroup.map((data) => (
                      <MenuItem key={data.id} value={data.name}>
                        {data.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                name="studentAddress"
                size="small"
                label="Student Address"
                type="text"
                required
                {...register("studentAddress", {
                  required: "Student address is required",
                })}
                error={!!errors.studentAddress}
                helperText={errors.studentAddress?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small" error={!!errors.levelName}>
                <InputLabel required>Level</InputLabel>
                <Controller
                  name="levelName"
                  control={control}
                  rules={{ required: "Level is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleLevelChange(e);
                      }}
                      label="Level"
                      error={!!errors.levelName}
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
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" error={!!errors.program}>
                <InputLabel required>Program</InputLabel>
                <Controller
                  name="program"
                  control={control}
                  rules={{ required: "Program is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Program"
                      disabled={!level || filteredPrograms.length === 0}
                      error={!!errors.program}
                    >
                      <MenuItem value="" disabled>
                        Select Program
                      </MenuItem>
                      {filteredPrograms.map((program) => (
                        <MenuItem key={program.id} value={program.id}>
                          {program.programName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <DateInputField
                name="issueDateNep"
                label="Date of Issue (BS)"
                control={control}
                format="YYYY/MM/DD"
                rules={{
                  required: "Issue date is required",
                  validate: (value) => {
                    if (!value) return "Issue date is required";
                    if (!value.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) {
                      return "Invalid date format (YYYY/MM/DD)";
                    }
                    try {
                      const englishDate = BSToAD(value);
                      const dateObj = new Date(englishDate);
                      if (isNaN(dateObj.getTime())) {
                        return "Invalid Nepali date";
                      }
                      return true;
                    } catch (error) {
                      return "Invalid Nepali date";
                    }
                  },
                }}
                error={errors.issueDateNep}
                helperText={errors.issueDateNep?.message}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                required
                fullWidth
                name="issueDateEng"
                size="small"
                label="Date of Issue (AD)"
                InputLabelProps={{ shrink: true }}
                value={watch("issueDateEng") || ""}
                {...register("issueDateEng")}
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                name="universityIssueNo"
                label="University Issue No."
                {...register("universityIssueNo")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                name="studentRegNo"
                label="Registration Number"
                {...register("studentRegNo")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                name="symbolNo"
                label="Symbol Number"
                {...register("symbolNo")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                name="campusRollNo"
                label="Campus Roll No."
                {...register("campusRollNo")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                required
                size="small"
                name="enrolledYear"
                label="Enrolled Year(AD)"
                {...register("enrolledYear", {
                  required: "Enrolled year is required",
                  pattern: {
                    value: /^\d{4}$/,
                    message: "Please enter a valid 4-digit year",
                  },
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
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                required
                size="small"
                label="Passed Year(AD)"
                name="passedYear"
                {...register("passedYear", {
                  required: "Passed year is required",
                  pattern: {
                    value: /^\d{4}$/,
                    message: "Please enter a valid 4-digit year",
                  },
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
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                {...register("division", { required: "Division is required" })}
                label="Grade/Division"
                name="division"
                size="small"
                required
                error={!!errors.division}
                helperText={errors.division?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                name="gpa"
                label="GPA/Percentage"
                {...register("gpa", {
                  pattern: {
                    value: /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/,
                    message: "Enter a valid GPA/percentage",
                  },
                })}
                error={!!errors.gpa}
                helperText={errors.gpa?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                name="fatherName"
                size="small"
                label="Father Name"
                {...register("fatherName", {
                  required: "Father's name is required",
                })}
                error={!!errors.fatherName}
                helperText={errors.fatherName?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                size="small"
                name="motherName"
                label="Mother Name"
                {...register("motherName", {
                  required: "Mother's name is required",
                })}
                error={!!errors.motherName}
                helperText={errors.motherName?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                name="contactNumber"
                label="Contact Number"
                type="tel"
                {...register("contactNumber", {
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                })}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber?.message}
                InputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10);
                    }
                  },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid container xs={12} style={outerBorderStyle}>
              <h1 style={sectionHeadingStyle}>
                Passport size photo & Documents
              </h1>
              <Grid item xs={3} className="pt-4 pl-2 pb-2">
                <StdDocUploader
                  label="Upload Photo"
                  name="uploadPhoto"
                  value={watch("uploadPhoto")}
                  onFileChange={(file) => {
                    setValue("uploadPhoto", file);
                    setValue("uploadPPSizePhoto", file ? file.name : "");
                  }}
                  acceptedTypes="image/*"
                  existingFileUrl={
                    watch("uploadPPSizePhoto")
                      ? `${uploadURL}/Graduation/${watch("uploadPPSizePhoto")}`
                      : null
                  }
                />
              </Grid>
              <Grid item xs={3} className="pt-4 pl-2 pb-2">
                <StdDocUploader
                  label="Upload Transcript"
                  name="uploadTranscript"
                  value={watch("uploadTranscript")}
                  onFileChange={(file) => {
                    setValue("uploadTranscript", file);
                    setValue("uploadTranscript", file ? file.name : "");
                  }}
                  acceptedTypes="image/*,application/pdf"
                  existingFileUrl={
                    watch("uploadTranscript")
                      ? `${uploadURL}/Graduation/${watch("uploadTranscript")}`
                      : null
                  }
                />
              </Grid>
              <Grid item xs={3} className="pt-4 pl-2 pb-2">
                <StdDocUploader
                  label="Upload Receipt"
                  name="uploadReceipt"
                  value={watch("uploadReceipt")}
                  onFileChange={(file) => {
                    setValue("uploadReceipt", file);
                    setValue("uploadReceipt", file ? file.name : "");
                  }}
                  acceptedTypes="image/*,application/pdf"
                  existingFileUrl={
                    watch("uploadReceipt")
                      ? `${uploadURL}/Graduation/${watch("uploadReceipt")}`
                      : null
                  }
                />
              </Grid>
              <Grid item xs={3} className="pt-4 pl-2 pb-2">
                <StdDocUploader
                  label="Upload Other Docs"
                  name="uploadOtherDocs"
                  value={watch("uploadOtherDocs")}
                  onFileChange={(file) => {
                    setValue("uploadOtherDocs", file);
                    setValue("uploadOtherDoc", file ? file.name : "");
                  }}
                  acceptedTypes="image/*,application/pdf"
                  existingFileUrl={
                    watch("uploadOtherDoc")
                      ? `${uploadURL}/Graduation/${watch("uploadOtherDoc")}`
                      : null
                  }
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                size="small"
                name="remarks"
                label="Remarks"
                multiline
                rows={2}
                {...register("remarks")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{ textAlign: "center", marginTop: "10px" }}
            >
              <Button
                type="button"
                size="small"
                variant="outlined"
                color="error"
                onClick={onClose}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Graduation"}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </DialogContent>
  );
};

export default EditGraduationForOld;
