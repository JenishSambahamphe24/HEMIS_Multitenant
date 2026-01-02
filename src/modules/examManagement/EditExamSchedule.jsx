import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BSToAD } from "bikram-sambat-js";
import {
  Grid,
  TextField,
  Select,
  FormControl,
  Typography,
  CardContent,
  InputLabel,
  MenuItem,
  Button,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { LoadingOverlay } from "@mantine/core";

import BikramSambatDateInput from "../../components/DateField/DateInputField";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import { config } from "@config";

export default function EditExamSchedule({ selectedId, onClose, onUpdate }) {
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
  const navigate = useNavigate();
  const [programsData, setProgramsData] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [batchYears, setBatchYears] = useState([]);
  const [selectedProgramType, setSelectedProgramType] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [yearOptions, setYearOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [generatedExamName, setGeneratedExamName] = useState("");
  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const isMounted = useRef(true);

  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser?.institution?.id;

  useEffect(() => {
    const fetchExamData = async () => {
      if (!selectedId) return;

      try {
        setIsLoading(true);
        const authConfig = getAuthConfigSafe();
        const examResponse = await axios.get(
          `${backendUrl}/ExamSchedule/${selectedId}`,
          authConfig
        );
        const fetchedExamData = examResponse?.data;
        setExamData(fetchedExamData);

        // Get the exam type from API response
        const apiExamType = fetchedExamData.examType; // This will be "external" or "internal"
        
        console.log("Fetched exam data:", fetchedExamData);
        console.log("Exam type from API:", apiExamType);
        
        // Set selectedType for UI logic
        // IMPORTANT: Use the exact value from API
        setSelectedType(apiExamType);

        // Set form values with fetched data
        // Use the exact value from API for examType field
        const formData = {
          fiscalYearId: fetchedExamData.fiscalYearId,
          batchId: fetchedExamData.batchId,
          programId: fetchedExamData.programMgmtId,
          examType: apiExamType, // Use exact value: "external" or "internal"
          type: fetchedExamData.type || "",
          examName: fetchedExamData.examName || "",
          dateFrom: fetchedExamData.dateFrom?.slice(0, 10) || "",
          dateTo: fetchedExamData.dateTo?.slice(0, 10) || "",
          dateFromNepali: fetchedExamData?.dateFromNepali || "",
          dateToNepali: fetchedExamData?.dateToNepali || "",
          details: fetchedExamData.description || "",
          year: fetchedExamData.year || "",
          semester: fetchedExamData.semester || "",
        };

        console.log("Setting form data:", formData);
        reset(formData);

        // Set selected states
        setSelectedProgramId(fetchedExamData.programMgmtId);

        // Set year/semester based on actual data
        if (fetchedExamData.year) {
          setSelectedYear(fetchedExamData.year);
        }
        if (fetchedExamData.semester) {
          setSelectedSemester(fetchedExamData.semester);
        }

        // Also set the program type directly from response
        if (fetchedExamData.programType) {
          setSelectedProgramType(fetchedExamData.programType);
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
        toast.error("Failed to load exam data");
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchExamData();
  }, [selectedId, reset, setValue, backendUrl]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const authConfig = getAuthConfigSafe();

        const [
          programs,
          fiscalYearsResponse,
          batchYearsResponse,
          semesterData,
          yearData,
        ] = await Promise.all([
          axios.get(`${backendUrl}/ProgramMgmt/GetCollegePrograms`, authConfig),
          axios.get(
            `${backendUrl}/FiscalYear/GetFiscalYearsForSelection`,
            authConfig
          ),
          axios.get(`${backendUrl}/Batch`, authConfig),
          axios.get(`${backendUrl}/StudentUpgrade/Semesters`, authConfig),
          axios.get(`${backendUrl}/StudentUpgrade/Years`, authConfig),
        ]);

        setProgramsData(programs?.data || []);
        setFiscalYears(fiscalYearsResponse?.data || []);
        setBatchYears(batchYearsResponse?.data || []);
        setSemesterOptions(semesterData?.data || []);
        setYearOptions(yearData?.data || []);

        setIsDataLoaded(true);
      } catch (err) {
        console.error("Failed to load form data:", err);
        toast.error("Failed to load form data");
      }
    };

    fetchInitialData();
  }, [backendUrl]);

  // Generate exam name when dependencies change - FOR BOTH INTERNAL AND EXTERNAL
  useEffect(() => {
    const generateExamName = () => {
      if (!programsData.length || !batchYears.length || !fiscalYears.length)
        return;

      const selectedProgram = programsData.find(
        (program) => program.id === selectedProgramId
      );

      if (!selectedProgram) return;

      const programName = selectedProgram?.programName || "";
      const batchNepali =
        batchYears.find((batch) => watch("batchId") == batch.id)?.batchNepali ||
        "";
      const yearSemester =
        selectedProgramType === "annual"
          ? `${selectedYear} Year`
          : `${selectedSemester} Semester`;

      const boardType = watch("type") || "";
      
      // Get current exam type from form
      const currentExamType = watch("examType");
      
      // Determine exam type label for BOTH internal and external
      let examTypeLabel = "";
      if (currentExamType === "external") {
        examTypeLabel = "Board Exam";
      } else if (currentExamType === "internal") {
        examTypeLabel = "Internal Exam";
      }
      
      const fynepali = fiscalYears.find(
        (fy) => fy.id == watch("fiscalYearId")
      )?.yearNepali;

      // Build the exam name for BOTH exam types
      let generatedName = `${programName}-${batchNepali}`;
      
      if (yearSemester) {
        generatedName += `-${yearSemester}`;
      }
      
      if (examTypeLabel) {
        generatedName += `-${examTypeLabel}`;
      }
      
      // Add Regular/Partial only for Board exams
      if (boardType && currentExamType === "external") {
        generatedName += `-${boardType}`;
      }
      
      if (fynepali) {
        generatedName += `-${fynepali}`;
      }

      console.log("Generated exam name:", generatedName);
      setGeneratedExamName(generatedName);

      // Auto-fill exam name for BOTH exam types
      setValue("examName", generatedName);
    };

    if (
      selectedProgramId &&
      watch("batchId") &&
      watch("fiscalYearId") &&
      watch("examType")
    ) {
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

  const handleNepaliDateChange = (name, value) => {
    setValue(name, value, { shouldValidate: true, shouldDirty: true });
    if (!value || value.length !== 10) {
      return;
    }
    try {
      const englishDate = BSToAD(value);
      if (englishDate) {
        const formattedDate = new Date(englishDate).toISOString().split("T")[0];
        if (name === "dateFromNepali") {
          setValue("dateFrom", formattedDate, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else if (name === "dateToNepali") {
          setValue("dateTo", formattedDate, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    } catch (error) {
      console.error(`Error converting ${name} to AD:`, error);
      toast.error(
        `Error converting Nepali date to English date. Please check the format.`
      );
    }
  };

  const onSubmit = async (data) => {
    try {
      const authConfig = getAuthConfigSafe();

      const yearOrSemester =
        selectedProgramType === "annual"
          ? { year: selectedYear, semester: null }
          : { year: null, semester: selectedSemester };

      // Make sure to include both Nepali and AD dates
      const dateFrom = data.dateFrom
        ? new Date(data.dateFrom).toISOString()
        : null;
      const dateTo = data.dateTo ? new Date(data.dateTo).toISOString() : null;

      // Get exam type from form data
      const examType = data.examType; // This will be "external" or "internal"

      const payload = {
        id: selectedId,
        fiscalYearId: data.fiscalYearId,
        campusId: collegeId,
        batchId: data.batchId,
        programMgmtId: data.programId,
        examType: examType,
        type: data.type || null,
        examName: generatedExamName, // Always use generated name for both types
        dateFrom,
        dateTo,
        dateFromNepali: data.dateFromNepali,
        dateToNepali: data.dateToNepali,
        status: true,
        description: data.details || "",
        ...yearOrSemester,
      };

      console.log("Submitting payload:", payload);

      const response = await axios.put(
        `${backendUrl}/ExamSchedule/${selectedId}`,
        payload,
        authConfig
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Exam Schedule updated successfully!");
        if (onUpdate && typeof onUpdate === "function") {
          onUpdate();
        }
        if (onClose && typeof onClose === "function") {
          onClose();
        } else {
          navigate("/exam-management/exam-list");
        }
      }
    } catch (error) {
      console.error("Error updating exam schedule:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleProgramChange = (e) => {
    const value = e.target.value;
    const selectedProgram = programsData.find(
      (program) => program.id === value
    );
    setSelectedProgramId(value);
    setSelectedProgramType(selectedProgram?.programType || "");
    setValue("programId", value);

    if (selectedProgram?.programType === "annual") {
      setSelectedSemester("");
      setValue("semester", "");
    } else {
      setSelectedYear("");
      setValue("year", "");
    }
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    
    // Update selectedType state
    setSelectedType(value);
    
    // Update form value
    setValue("examType", value);
    
    console.log("Exam type changed to:", value);
  };

  const handleExamNameChange = (e) => {
    // Allow manual editing for both types if needed
    setValue("examName", e.target.value);
  };

  useEffect(() => {
    if (selectedProgramType === "annual" && selectedYear) {
      setValue("year", selectedYear);
      setValue("semester", null);
    } else if (selectedProgramType === "semester" && selectedSemester) {
      setValue("semester", selectedSemester);
      setValue("year", null);
    }
  }, [selectedProgramType, selectedYear, selectedSemester, setValue]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (isLoading || !isDataLoaded) {
    return (
      <LoadingOverlay
        visible={isLoading || !isDataLoaded}
        zIndex={100}
        overlayProps={{ radius: "sm", blur: 1 }}
        loaderProps={{ color: "#1976d2", type: "bars" }}
      />
    );
  }

  const isBoardExam = watch("examType") === "external";

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={12}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", color: "#2A629A" }}
          >
            Edit Exam Schedule
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel required>Exam F.Y.</InputLabel>
                  <Select
                    required
                    {...register("fiscalYearId")}
                    value={watch("fiscalYearId") || ""}
                    id="fiscalYearId"
                    size="small"
                    fullWidth
                    label="Fiscal Year"
                  >
                    {fiscalYears?.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.yearNepali}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel required>Enrolled Batch</InputLabel>
                  <Select
                    required
                    {...register("batchId")}
                    id="batchId"
                    size="small"
                    value={watch("batchId") || ""}
                    name="batchId"
                    fullWidth
                    label="Enrolled Batch"
                  >
                    {batchYears?.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.batchNepali}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="programId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel required>Program Name</InputLabel>
                      <Select
                        {...field}
                        required
                        id="programId"
                        size="small"
                        label="Program Name"
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleProgramChange(e);
                        }}
                      >
                        {programsData.length > 0 &&
                          programsData.map((data) => (
                            <MenuItem key={data.id} value={data.id}>
                              {data.programName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel required>
                    {selectedProgramType === "annual" ? "Year" : "Semester"}
                  </InputLabel>
                  <Select
                    required
                    value={
                      selectedProgramType === "annual"
                        ? selectedYear || ""
                        : selectedSemester || ""
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
              <Grid item xs={12} sm={2}>
                <Controller
                  name="examType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel required>Exam Type</InputLabel>
                      <Select
                        {...field}
                        required
                        id="examType"
                        size="small"
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
              {isBoardExam && (
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel required>Regular or Partial Exam</InputLabel>
                    <Select
                      required
                      {...register("type")}
                      id="type"
                      size="small"
                      name="type"
                      fullWidth
                      value={watch("type") || ""}
                      label="Regular or Partial Exam"
                    >
                      <MenuItem value="Regular">Regular Exam</MenuItem>
                      <MenuItem value="Partial">Partial Exam</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} sm={isBoardExam ? 9 : 12}>
                <TextField
                  required
                  {...register("examName")}
                  id="examName"
                  size="small"
                  name="examName"
                  label="Exam Name"
                  fullWidth
                  value={watch("examName") || ""}
                  onChange={handleExamNameChange}
                  error={!!errors.examName}
                  helperText={errors.examName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Controller
                  name="dateFromNepali"
                  control={control}
                  render={({ field }) => (
                    <BikramSambatDateInput
                      label="Exam Date From (BS)"
                      value={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                        handleNepaliDateChange("dateFromNepali", value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Controller
                  name="dateToNepali"
                  control={control}
                  render={({ field }) => (
                    <BikramSambatDateInput
                      label="Exam Date To (BS)"
                      value={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                        handleNepaliDateChange("dateToNepali", value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Exam Date (From AD)"
                  InputLabelProps={{ shrink: true }}
                  type="date"
                  disabled
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
                  type="date"
                  disabled
                  value={watch("dateTo") || ""}
                  {...register("dateTo")}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Details (Optional)"
                  multiline
                  rows={2}
                  {...register("details")}
                  value={watch("details") || ""}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                mt={2}
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Button
                    size="small"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Update Exam Schedule
                  </Button>
                </Grid>
                {onClose && (
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Grid>
    </Grid>
  );
}