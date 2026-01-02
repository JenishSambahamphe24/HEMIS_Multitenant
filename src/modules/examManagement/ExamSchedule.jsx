import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BSToAD } from "bikram-sambat-js";
import {
  Grid,
  TextField,
  Select,
  FormControl,
  Typography,
  Paper,
  CardContent,
  InputLabel,
  MenuItem,
  Button,
} from "@mui/material";
import { Controller } from "react-hook-form";

import NepaliDatePicker from "../../components/Nepali-date-picker/NepaliDatePicker";
import { useBatches } from "../../hooks/useGlobalData";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

export default function ExamSchedule() {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const path = location.pathname;
  const { data: batches } = useBatches();
  const navigate = useNavigate();
  const [programsData, setProgramsData] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [batchYears, setBatchYears] = useState([]);
  const [selectedProgramType, setSelectedProgramType] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [yearOptions, setYearOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [generatedExamName, setGeneratedExamName] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser?.institution?.id;

  // Format Nepali date (replace - with /)
  const formatNepaliDate = (dateStr) => {
    if (!dateStr) return null;
    return dateStr.replace(/-/g, "/");
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfigSafe();
        const [programs, fiscalYears, batchYears, semesterData, yearData] =
          await Promise.all([
            axios.get(
              `${backendUrl}/MajorSubject/GetProgramsWithMajorSubjects`,
              config
            ),
            axios.get(
              `${backendUrl}/FiscalYear/GetFiscalYearsForSelection`,
              config
            ),
            axios.get(`${backendUrl}/Batch`, config),
            axios.get(`${backendUrl}/StudentUpgrade/Semesters`, config),
            axios.get(`${backendUrl}/StudentUpgrade/Years`, config),
          ]);

        setProgramsData(programs?.data || []);
        setFiscalYears(fiscalYears?.data || []);
        setBatchYears(batchYears?.data || []);
        setSemesterOptions(semesterData?.data || []);
        setYearOptions(yearData?.data || []);

        // Set default active fiscal year
        const activeFiscalYear = fiscalYears.data.find(
          (year) => year.activeFiscalYear === true
        );
        if (activeFiscalYear) {
          setValue("fiscalYearId", activeFiscalYear.id);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load required data.");
      }
    };
    fetchData();
  }, [setValue]);

  // Handle Nepali date change and convert to English
  const handleNepaliDateChange = (name, value) => {
    setValue(name, value);
    try {
      const englishDate = BSToAD(value);
      if (englishDate) {
        if (name === "dateFromNepali") {
          setValue("dateFrom", englishDate);
        } else if (name === "dateToNepali") {
          setValue("dateTo", englishDate);
        }
      }
    } catch (error) {
      console.error("Date conversion error:", error);
    }
  };

  // Generate exam name dynamically
  useEffect(() => {
    const generateExamName = () => {
      const selectedProgram = programsData.find(
        (program) => program.id === selectedProgramId
      );
      const programName = selectedProgram?.shortName || "";
      const batchNepali =
        batchYears.find((batch) => watch("batchId") == batch.id)?.batchNepali ||
        "";
      const yearOrSemester =
        selectedProgramType === "annual"
          ? `${selectedYear} Year`
          : `${selectedSemester} Semester`;
      const boardType = watch("type") || "";
      
      // Get exam type from form
      const currentExamType = watch("examType");
      
      // Determine exam type label based on exam type
      const examType = 
        currentExamType === "external" ? "Board Exam" : 
        currentExamType === "internal" ? "Internal Exam" : "";
      
      const fynepali = fiscalYears.find(
        (fy) => fy.id == watch("fiscalYearId")
      )?.yearNepali;

      // Build exam name similar to edit component
      let generatedName = `${programName}-${batchNepali}`;
      
      if (yearOrSemester) {
        generatedName += `-${yearOrSemester}`;
      }
      
      if (examType) {
        generatedName += `-${examType}`;
      }
      
      // Add Regular/Partial only for external exams
      if (boardType && currentExamType === "external") {
        generatedName += `-${boardType}`;
      }
      
      if (fynepali) {
        generatedName += `-${fynepali}`;
      }

      setGeneratedExamName(generatedName);
      setValue("examName", generatedName);
    };

    if (selectedProgramId && watch("batchId") && watch("fiscalYearId") && watch("examType")) {
      generateExamName();
    }
  }, [
    selectedProgramId,
    watch("batchId"),
    selectedYear,
    selectedSemester,
    selectedProgramType,
    watch("type"),
    watch("examType"),
    watch("fiscalYearId"),
    programsData,
    batchYears,
    fiscalYears,
    setValue,
  ]);

  const onSubmit = async (data) => {
    try {
      const config = getAuthConfigSafe();

      const yearOrSemester =
        selectedProgramType === "annual"
          ? { year: selectedYear, semester: null }
          : { year: null, semester: selectedSemester };

      // Get exam type from form
      const examType = data.examType; // "internal" or "external"

      const payload = {
        fiscalYearId: data?.fiscalYearId,
        campusId: collegeId,
        batchId: data?.batchId,
        programMgmtId: data.programId,
        examType: examType,
        type: examType === "external" ? data.type : "", // Only send type for external exams
        examName: generatedExamName,
        dateFrom: data.dateFrom ? new Date(data.dateFrom).toISOString() : null,
        dateTo: data.dateTo ? new Date(data.dateTo).toISOString() : null,
        dateFromNepali: formatNepaliDate(data.dateFromNepali),
        dateToNepali: formatNepaliDate(data.dateToNepali),
        status: true,
        description: data.details || "",
        ...yearOrSemester,
      };

      console.log("Submitting payload:", payload);

      const response = await axios.post(`${backendUrl}/ExamSchedule`, payload, config);

      if (response.status === 200 || response.status === 201) {
        toast.success("Exam Schedule submitted successfully!!");
        if (path === "/exam-management/exam-schedule") {
          navigate("/exam-management/exam-list");
        } else {
          navigate("/pass-rate-management/exam-appeared");
        }
        reset();
      }
    } catch (error) {
      console.error("Error submitting exam schedule:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  // Handle program change
  const handleProgramChange = (e) => {
    const selectedProgram = programsData.find(
      (program) => program.id === e.target.value
    );
    setSelectedProgramId(e.target.value);
    setSelectedProgramType(selectedProgram?.programType || "");
    setSelectedYear("");
    setSelectedSemester("");
  };

  // Handle exam type change
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setValue("examType", value);
    
    // Clear type field when switching to internal
    if (value === "internal") {
      setValue("type", "");
    }
  };

  // Sync year/semester to form values
  useEffect(() => {
    if (selectedProgramType === "annual" && selectedYear) {
      setValue("year", selectedYear);
    } else if (selectedProgramType === "semester" && selectedSemester) {
      setValue("semester", selectedSemester);
    }
  }, [selectedProgramType, selectedYear, selectedSemester, setValue]);

  const isBoardExam = watch("examType") === "external";

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10}>
          <Paper elevation={5} sx={{ borderRadius: "20px", mt: 2, mb: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Exam Schedule For Program
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1}>
                  {/* Fiscal Year */}
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Exam F.Y.</InputLabel>
                      <Select
                        required
                        {...register("fiscalYearId")}
                        id="fiscalYearId"
                        label="Exam F.Y."
                      >
                        {fiscalYears.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.yearNepali}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Batch */}
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Enrolled Batch</InputLabel>
                      <Select
                        required
                        {...register("batchId")}
                        id="batchId"
                        label="Enrolled Batch"
                      >
                        {batchYears.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.batchNepali}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Program */}
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Program Name</InputLabel>
                      <Select
                        required
                        {...register("programId")}
                        id="programId"
                        label="Program Name"
                        onChange={handleProgramChange}
                      >
                        {programsData.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.programName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Year/Semester */}
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>
                        {selectedProgramType === "annual" ? "Year" : "Semester"}
                      </InputLabel>
                      <Select
                        required
                        value={
                          selectedProgramType === "annual"
                            ? selectedYear
                            : selectedSemester
                        }
                        onChange={(e) => {
                          if (selectedProgramType === "annual") {
                            setSelectedYear(e.target.value);
                            setValue("year", e.target.value);
                          } else {
                            setSelectedSemester(e.target.value);
                            setValue("semester", e.target.value);
                          }
                        }}
                        disabled={!selectedProgramId}
                        label={
                          selectedProgramType === "annual" ? "Year" : "Semester"
                        }
                      >
                        {(selectedProgramType === "annual"
                          ? yearOptions
                          : semesterOptions
                        ).map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Exam Type - FIXED: Using Controller with correct values */}
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="examType"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel required>Exam Type</InputLabel>
                          <Select
                            {...field}
                            required
                            id="examType"
                            label="Exam Type"
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleTypeChange(e);
                            }}
                          >
                            <MenuItem value="internal">Internal Exam</MenuItem>
                            <MenuItem value="external">Board Exam</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Regular/Partial (only for Board Exam) - FIXED: Proper conditional rendering */}
                  {isBoardExam ? (
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel required>Regular or Partial Exam</InputLabel>
                        <Select
                          required
                          {...register("type")}
                          id="type"
                          label="Regular or Partial Exam"
                        >
                          <MenuItem value="Regular">Regular Exam</MenuItem>
                          <MenuItem value="Partial">Partial Exam</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  ) : (
                    // Empty grid item to maintain layout when Internal is selected
                    <Grid item xs={12} sm={3}></Grid>
                  )}

                  {/* Generated Exam Name - FIXED: Width adjusts based on exam type */}
                  <Grid item xs={12} sm={isBoardExam ? 9 : 12}>
                    <TextField
                      required
                      {...register("examName")}
                      id="examName"
                      size="small"
                      name="examName"
                      label="Exam Name"
                      fullWidth
                      disabled
                      value={generatedExamName}
                    />
                  </Grid>

                  {/* Manual Exam Name for Internal Exams - Removed as not needed */}
                  {/* Note: If you need manual exam name for internal, uncomment below */}
                  {/* 
                  {watch("examType") === "internal" && (
                    <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
                      <TextField
                        required
                        {...register("examNameManual")}
                        id="examNameManual"
                        size="small"
                        name="examNameManual"
                        label="Exam Name Manual (for internal exams)"
                        fullWidth
                      />
                    </Grid>
                  )}
                  */}

                  {/* Date Fields - ALWAYS IN THE SAME POSITION */}
                  <Grid item xs={12} sm={2}>
                    <NepaliDatePicker
                      label="Exam Date From (BS)"
                      name="dateFromNepali"
                      value={watch("dateFromNepali") || ""}
                      onDateChange={handleNepaliDateChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <NepaliDatePicker
                      label="Exam Date To (BS)"
                      name="dateToNepali"
                      value={watch("dateToNepali") || ""}
                      onDateChange={handleNepaliDateChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Exam Date (From AD)"
                      InputLabelProps={{ shrink: true }}
                      value={watch("dateFrom") || ""}
                      {...register("dateFrom")}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Exam Date (To AD)"
                      InputLabelProps={{ shrink: true }}
                      value={watch("dateTo") || ""}
                      {...register("dateTo")}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  {/* Buttons */}
                  <Grid
                    container
                    item
                    xs={12}
                    mt={2}
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item>
                      <Button type="submit" variant="contained" color="primary">
                        Create Exam Schedule
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}