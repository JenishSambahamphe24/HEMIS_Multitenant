import {
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  TextField,
  FormControl,
  CardContent,
  Paper,
  FormHelperText,
  Typography,
  InputLabel,
  MenuItem,
  Button,
  Select,
} from "@mui/material";
import { getAuthConfigSafe, getDateOnly } from "../../utils/dateUtils";

import NepaliDatePicker from "../../components/Nepali-date-picker/NepaliDatePicker";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { config } from "@config";
import { BSToAD } from "bikram-sambat-js";

export default function RoutineSchedule() {
  const backendUrl = config.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [scheduleExam, setScheduleExam] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const Id = queryParams.get("examschedule");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTheoretical, setIsTheoretical] = useState(true);
  const [isPractical, setIsPractical] = useState(false);
  const programMgmtId = scheduleExam.programMgmtId;

  
  const handleNepaliDateChange = (name, value) => {
    setValue(name, value);
    try {
      const englishDate = BSToAD(value);
      const dateOnly = getDateOnly(englishDate);
      if (englishDate) {
        setValue("dateFrom", dateOnly);
      }
    } catch (error) {
      console.error("Date conversion error:", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      isTheoritical: true,
      isPractical: false,
      status: true,
    },
  });

  const watchIsTheoretical = watch("isTheoritical");
  const watchIsPractical = watch("isPractical");

  useEffect(() => {
    setIsTheoretical(watchIsTheoretical);
  }, [watchIsTheoretical]);

  useEffect(() => {
    setIsPractical(watchIsPractical);
  }, [watchIsPractical]);

  useEffect(() => {
    const fetchExamSchedule = async () => {
      if (!Id) return;

      setLoading(true);
      setError(null);
      try {
        const config = getAuthConfigSafe();
        const scheduleExams = await axios.get(
          `${backendUrl}/ExamSchedule/${Id}`,
          config
        );
        setScheduleExam(scheduleExams.data);
      } catch (err) {
        setError("Failed to fetch exam schedule");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamSchedule();
  }, [Id]);

  useEffect(() => {
    const fetchDependentData = async () => {
      if (!programMgmtId) return;
      setLoading(true);
      setError(null);
      try {
        const config = getAuthConfigSafe();
        const [getSubjects, getSemester, getYear] = await Promise.all([
          axios.get(
            `${backendUrl}/Subject/GetSubjectByProgramId?programId=${programMgmtId}`,
            config
          ),
          axios.get(`${backendUrl}/StudentUpgrade/Semesters`, config),
          axios.get(`${backendUrl}/StudentUpgrade/Years`, config),
        ]);

        setSubjects(getSubjects.data);
        setSemesterData(getSemester.data);
        setYearData(getYear.data);
      } catch (err) {
        setError("Failed to fetch subjects and related data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDependentData();
  }, [programMgmtId]);

  useEffect(() => {
    if (scheduleExam?.programType === "semester" && selectedSemester) {
      setFilteredSubjects(
        subjects.filter((subject) => subject.semester === selectedSemester)
      );
    } else if (scheduleExam?.programType === "annual" && selectedYear) {
      setFilteredSubjects(
        subjects.filter((subject) => subject.year === selectedYear)
      );
    } else {
      setFilteredSubjects(subjects);
    }
  }, [selectedSemester, selectedYear, subjects, scheduleExam?.programType]);

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const onSubmit = async (data) => {
    const examData = {
      examScheduleId: Id,
      subjectID: data.subjectId,
      isTheoretical: data.isTheoritical,
      isPractical: data.isPractical,
      examDate: `${data.dateFromNepali}`,
      examTime: data.examTime,
      theoreticalFullMarks: data.fullMark,
      theoreticalPassMarks: data.passMark,
      practicalFullMark: data.pFullMark || 0,
      practicalPassMark: data.pPassMark || 0,
      year: data.year,
      semester: data.semester,
      description: data.details,
    };
    try {
      const config = getAuthConfigSafe();
      await axios.post(`${backendUrl}/SubjectExamSchedule`, examData, config);
      toast.success("Subject Exam Created Successfully!!");
      navigate("/exam-management/exam-list");
    } catch (err) {
      console.error("Error while saving exam schedule:", err);
    }
  };

  return (
    <div>
      <Grid container justifyContent={"center"}>
        <Grid item xs={12} md={10}>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Subject Exam Schedule For{" "}
                <strong>{scheduleExam?.examName}</strong>
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      size="small"
                      fullWidth
                      disabled
                      label="Exam Scheduled"
                      value={scheduleExam?.examName || ""}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  {scheduleExam?.programType === "semester" && (
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel required>Semester</InputLabel>
                        <Select
                          {...register("semester")}
                          required
                          value={selectedSemester}
                          onChange={handleSemesterChange}
                          id="semester"
                          size="small"
                          name="semester"
                          fullWidth
                          label="Semester"
                        >
                          <MenuItem value="">Select Semester</MenuItem>
                          {semesterData.length > 0 &&
                            semesterData.map((data) => (
                              <MenuItem key={data} value={data}>
                                {data}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {scheduleExam?.programType === "annual" && (
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel required>Year</InputLabel>
                        <Select
                          {...register("year")}
                          required
                          value={selectedYear}
                          onChange={handleYearChange}
                          id="year"
                          size="small"
                          name="year"
                          fullWidth
                          label="Year"
                        >
                          <MenuItem value="">Select Year</MenuItem>
                          {yearData.length > 0 &&
                            yearData.map((data) => (
                              <MenuItem key={data} value={data}>
                                {data}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Subject</InputLabel>
                      <Select
                        required
                        {...register("subjectId")}
                        id="subjectId"
                        size="small"
                        name="subjectId"
                        fullWidth
                        label="Subject"
                      >
                        <MenuItem value="">Select Subject</MenuItem>
                        {filteredSubjects.length > 0 &&
                          filteredSubjects.map((data) => (
                            <MenuItem key={data.id} value={data.id}>
                              {data.subjectName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...register("isTheoritical")}
                            id="isTheoritical"
                            name="isTheoritical"
                            color="primary"
                            defaultChecked={true}
                          />
                        }
                        label="isTheoritical"
                      />
                      {errors.isTheoritical && (
                        <FormHelperText error>
                          {"isTheoritical required"}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...register("isPractical")}
                            id="isPractical"
                            name="isPractical"
                            color="primary"
                            defaultChecked={false}
                          />
                        }
                        label="isPractical"
                      />
                      {errors.isPractical && (
                        <FormHelperText error>
                          {"isPractical required"}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <NepaliDatePicker
                        {...register("dateFromNepali", { required: true })}
                        label="Exam Date (BS)"
                        name="dateFromNepali"
                        value={watch("dateFromNepali")}
                        onDateChange={(name, value) =>
                          handleNepaliDateChange(name, value)
                        }
                      />
                      <input
                        required
                        type="hidden"
                        {...register("dateFromNepali", { required: true })}
                        value={watch("dateFromNepali") || ""}
                      />
                      {errors.dateFrom && (
                        <FormHelperText error>Date is required</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <TextField
                        required
                        {...register("examTime", { required: true })}
                        id="examTime"
                        type="time"
                        size="small"
                        name="examTime"
                        label="Exam Time"
                        fullWidth
                        error={!!errors.examTime}
                        helpertext={errors.examTime ? "Time From required" : ""}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Theoretical marks fields - only required when isTheoretical is checked */}
                  <Grid item xs={12} sm={2}>
                    <TextField
                      required={isTheoretical}
                      {...register("fullMark", { required: isTheoretical })}
                      id="fullMark"
                      type="number"
                      size="small"
                      name="fullMark"
                      label="Full Marks(The.)"
                      fullWidth
                      error={!!errors.fullMark}
                      helpertext={errors.fullMark ? "Full Mark required" : ""}
                      disabled={!isTheoretical}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      required={isTheoretical}
                      {...register("passMark", { required: isTheoretical })}
                      id="passMark"
                      type="number"
                      size="small"
                      name="passMark"
                      label="Pass Marks (The.)"
                      fullWidth
                      error={!!errors.passMark}
                      helpertext={errors.passMark ? "Pass Mark required" : ""}
                      disabled={!isTheoretical}
                    />
                  </Grid>

                  {/* Practical marks fields - only required when isPractical is checked */}
                  <Grid item xs={12} sm={2}>
                    <TextField
                      required={isPractical}
                      {...register("pFullMark", { required: isPractical })}
                      id="pFullMark"
                      type="number"
                      size="small"
                      name="pFullMark"
                      label="Full Marks(Prac)"
                      fullWidth
                      error={!!errors.pFullMark}
                      helpertext={errors.pFullMark ? "Full Mark required" : ""}
                      disabled={!isPractical}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      required={isPractical}
                      {...register("pPassMark", { required: isPractical })}
                      id="pPassMark"
                      type="number"
                      size="small"
                      name="pPassMark"
                      label="Pass Marks(Prac)"
                      fullWidth
                      error={!!errors.pPassMark}
                      helpertext={errors.pPassMark ? "Pass Mark required" : ""}
                      disabled={!isPractical}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="status" required>
                        Status
                      </InputLabel>
                      <Select
                        required
                        {...register("status")}
                        id="status"
                        size="small"
                        name="status"
                        fullWidth
                        label="Status"
                        defaultValue={true}
                      >
                        <MenuItem value={true}>
                          <Chip label="Active" color="success" size="small" />
                        </MenuItem>
                        <MenuItem value={false}>
                          <Chip label="Inactive" color="error" size="small" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("details")}
                      id="details"
                      label="Description"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      sx={{
                        borderColor: "#3f51b5",
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  style={{
                    margin: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: "#007aff", color: "#inherit" }}
                  >
                    Submit
                  </Button>
                  <Button sx={{marginLeft:"5px"}} variant="outlined" size="small" color="secondary"  onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                </Grid>
              </form>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
