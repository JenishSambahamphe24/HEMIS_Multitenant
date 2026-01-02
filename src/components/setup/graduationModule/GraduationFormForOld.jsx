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
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BSToAD, ADToBS } from "bikram-sambat-js";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import BikramSambatDateInput from "../../DateField/DateInputField";

import { getEthnicGroup } from "../../../services/services";
import { useNavigate } from "react-router-dom";
import { StdDocUploader } from "../../../pages/students/StdDocUploader";
import { config as appConfig } from '@config';


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

const GraduationFormForOld = ({ value }) => {
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
  const [activeFiscal, setActiveFiscal] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [programData, setProgramData] = useState([]);
  const collegeId = currentUser.institution?.id;
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [level, setLevel] = useState("");
  const [defaultFiscal, setDefaultFiscal] = useState(7);
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

  const authConfig = getAuthConfigSafe();

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
          authConfig
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

  // Function to get today's date in BS and AD
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
    // Set today's date as default for issue date
    const todayDates = getTodayDates();
    setValue("issueDateNep", todayDates.bsDate);
    setValue("issueDateEng", todayDates.adDate);
  }, []);

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
      navigate("/graduation-management/graduation-list-old");

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
        authConfig
      );
      const active = fiscalYearResponse.data.find(
        (item) => item.activeFiscalYear === true
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

  //get currentYear
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
    if (passedYear > currentYear) return `Cannot be greater than ${currentYear}`;

    //Validate against enrolled year
    if (enrolledYear && passedYear < enrolledYear) {
      return "Passed year cannot be earlier than enrolled year";
    }
    if (passedYear < 1900) {
      return "Please enter a valid passed year";
    }
    return true;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} mx="auto">
          <Paper elevation={3} sx={{ borderRadius: "10px" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", color: "#2A629A", mb: 3 }}
              >
                Graduation Management
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1}>

                  <Grid item xs={12} sm={2}>
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
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      required
                      name="applicantNameNep"
                      size="small"
                      label="Applicant Name (Nepali)"
                      type="text"
                      {...register("applicantNameNep", { required: true })}
                      error={!!errors.applicantNameNep}
                      helperText={
                        errors.applicantNameNep &&
                        "applicant Name (Nepali) is required"
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
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

                  <Grid
                    display="flex"
                    justifyContent="space-between"
                    item
                    xs={12}
                    sm={2}
                  >
                    <Controller
                      name="dobNep"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Date of Birth is required",
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
                  <Grid item xs={12} sm={2}>
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
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      name="email"
                      size="small"
                      label="Email"
                      type="email"
                      {...register("email")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Gender</InputLabel>
                      <Select
                        fullWidth
                        required
                        name="gender"
                        size="small"
                        label="Gender"
                        type="gender"
                        {...register("gender", { required: true })}
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
                  <Grid item xs={12} sm={2}>
                    <FormControl
                      sx={{ borderColor: "blue" }}
                      size="small"
                      fullWidth
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
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      name="studentAddress"
                      size="small"
                      label="Student Address"
                      type="studentAddress"
                      required
                      {...register("studentAddress")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Level</InputLabel>
                      <Select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        fullWidth
                        required
                        size="small"
                        name="level"
                        label="Level"
                      >
                        {filteredLevels.map((levelName, index) => (
                          <MenuItem key={index} value={levelName}>
                            {levelName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Program</InputLabel>
                      <Select
                        {...register("program", { required: true })}
                        fullWidth
                        required
                        size="small"
                        name="program"
                        label="Program"
                      >
                        {filteredPrograms?.map((program) => (
                          <MenuItem key={program.id} value={program?.id}>
                            {" "}
                            {program?.programName}{" "}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="issueDateNep"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Date of Issue is required",
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
                          label="Date of Issue (B.S)"
                          name="issueDateNep"
                          required
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
                  <Grid item xs={12} sm={2}>
                    <TextField
                      name="issueDateEng"
                      size="small"
                      label="Date of Issue (AD)"
                      InputLabelProps={{ shrink: true }}
                      value={watch("issueDateEng") || ""}
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      name="studentRegNo"
                      label="Registration Number"
                      {...register("studentRegNo")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      name="symbolNo"
                      label="Symbol Number"
                      {...register("symbolNo")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      name="campusRollNo"
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
                        validate: validateEnrolledYear
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
                        validate: validatePassedYear
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
                      {...register("division")}
                      label="Grade/Division"
                      name="division"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
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

                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      name="fatherName"
                      size="small"
                      label="Father Name"
                      {...register("fatherName")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      name="motherName"
                      label="Mother Name"
                      {...register("motherName")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      name="contactNumber"
                      label="Contact Number"
                      type="tel"
                      {...register("contactNumber")}
                      InputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        onInput: (e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                        },
                      }}
                    />
                  </Grid>
                  <Grid container xs={12} style={outerBorderStyle}>
                    <h1 style={sectionHeadingStyle}>
                      Passport size photo & Documents
                    </h1>
                    <Grid item xs={3} className="pt-4 pl-2 pb-2">
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
                      {isLoading ? "submiting..." : "Submit Graduated"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default GraduationFormForOld;
