import {
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  TextField,
  FormControl,
  CardContent,
  Typography,
  InputLabel,
  MenuItem,
  Button,
  Select,
  DialogContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import BikramSambatDateInput from "../../components/DateField/DateInputField";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getSubject } from "../../services/services";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

export default function EditRoutineSchedule({ Id, onClose, programId, onUpdate }) {
  const backendUrl = config.VITE_BACKEND_URL;
  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      isTheoretical: true,
      isPractical: false,
      status: true,
      examDate: ''
    },
  });

  const [scheduleExam, setScheduleExam] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTheoretical, setIsTheoretical] = useState(true);
  const [isPractical, setIsPractical] = useState(false);
  const watchIsTheoretical = watch("isTheoretical");
  const watchIsPractical = watch("isPractical");

  useEffect(() => {
    setIsTheoretical(watchIsTheoretical);
  }, [watchIsTheoretical]);

  useEffect(() => {
    setIsPractical(watchIsPractical);
  }, [watchIsPractical]);

  useEffect(() => {
    const fetchSubjectExamSchedule = async () => {
      if (!Id) return;

      setLoading(true);
      setError(null);
      try {
        const config = getAuthConfigSafe()
        const scheduleExams = await axios.get(`${backendUrl}/SubjectExamSchedule/${Id}`, config);
        const examData = scheduleExams.data;
        setScheduleExam(examData);

        setValue("examSchedule", examData?.examName || "");
        setValue("subjectId", examData.subjectID || "");
        setValue("isTheoretical", examData?.isTheoretical === true ? true : false);
        setValue("isPractical", examData?.isPractical === true ? true : false);
        setValue("examDate", examData?.examDate?.split("T")[0] || "");
        setValue("examTime", examData.examTime || "");
        setValue("fullMark", examData.theoreticalFullMarks || examData.fullMark || "");
        setValue("passMark", examData.theoreticalPassMarks || examData.passMark || "");
        setValue("pFullMark", examData.practicalFullMark || "");
        setValue("pPassMark", examData.practicalPassMark || "");
        setValue("details", examData.description || "");
        setValue("status", examData?.status !== undefined ? examData.status : true);
        setValue("semester", examData.semester || "");
        setValue("year", examData.year || "");

        setIsTheoretical(examData?.isTheoretical === true ? true : false);
        setIsPractical(examData?.isPractical === true ? true : false);
        setSelectedSemester(examData.semester || "");
        setSelectedYear(examData.year || "");
      } catch (err) {
        setError("Failed to fetch subject exam schedule");
        console.error("Error fetching schedule exam data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectExamSchedule();
  }, [Id, setValue]);

  useEffect(() => {
    const fetchDependentData = async () => {
      if (!programId) return;

      setLoading(true);
      setError(null);
      try {
        const config = getAuthConfigSafe()
        const [getSubjects, getSemester, getYear] = await Promise.all([
          axios.get(`${backendUrl}/Subject/GetSubjectByProgramId?programId=${programId}`, config),
          axios.get(`${backendUrl}/StudentUpgrade/Semesters`, config),
          axios.get(`${backendUrl}/StudentUpgrade/Years`, config),
        ]);
        setSubjects(getSubjects.data);
        setSemesterData(getSemester.data);
        setYearData(getYear.data);
      } catch (err) {
        setError("Failed to fetch subjects and related data");
        console.error("Error fetching dependent data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDependentData();
  }, [programId]);

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
    setValue("semester", event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setValue("year", event.target.value);
  };

  if (loading && !scheduleExam.id) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const onSubmit = async (data) => {
    setLoading(true);

    const updatedExamData = {
      ...scheduleExam,
      id: Id,
      subjectID: data.subjectId,
      isTheoretical: data.isTheoretical,
      isPractical: data.isPractical,
      examDate: data.examDate,
      nepaliExamDate: '2025-07-28T06:30:00.000Z',
      examTime: data.examTime,
      theoreticalFullMarks: data.fullMark,
      theoreticalPassMarks: data.passMark,
      practicalFullMark: data.pFullMark || 0,
      practicalPassMark: data.pPassMark || 0,
      year: data.year || 0,
      semester: data.semester || 0,
      description: data.details,
      status: data.status,
    };
    try {
      const config = getAuthConfigSafe()
      await axios.put(
        `${backendUrl}/SubjectExamSchedule/${Id}`,
        updatedExamData,
        config
      );

      toast.success("Exam schedule updated successfully!", {
        autoClose: 1500,
      });
      if (onUpdate) onUpdate();
      if (onClose) onClose();
    } catch (err) {
      console.error("Error while updating exam schedule:", err);
      toast.error("Failed to update exam schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent fullWidth>
      <Grid container justifyContent={"center"}>
        <Grid item xs={12} md={12}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", color: "#2A629A" }}
            >
              Edit Exam Schedule For Subject 
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                  <TextField
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
                    <Controller
                      name="subjectId"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Subject is required" }}
                      render={({ field }) => (
                        <Select {...field} label="Subject" error={!!errors.subjectId}>
                          <MenuItem value="">Select Subject</MenuItem>
                          {filteredSubjects.map((subject) => (
                            <MenuItem key={subject.id} value={subject.id}>
                              {subject.subjectName}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.subjectId && (
                      <FormHelperText error>
                        {errors.subjectId.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth size="small">
                    <Controller
                      name="isTheoretical"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              color="primary"
                            />
                          }
                          label="Theoretical"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth size="small">
                    <Controller
                      name="isPractical"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              color="primary"
                            />
                          }
                          label="Practical"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controller
                    name="examDate"
                    control={control}
                    render={({ field }) => (
                      <BikramSambatDateInput
                        label="Exam Date From (BS)"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Controller
                    name="examTime"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Exam time is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Exam Time"
                        type="time"
                        size="small"
                        fullWidth
                        error={!!errors.examTime}
                        helperText={errors.examTime ? errors.examTime.message : ""}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Controller
                    name="fullMark"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: isTheoretical ? "Full marks required" : false
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Full Marks(The.)"
                        type="number"
                        size="small"
                        fullWidth
                        disabled={!isTheoretical}
                        error={!!errors.fullMark}
                        helperText={errors.fullMark ? errors.fullMark.message : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Controller
                    name="passMark"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: isTheoretical ? "Pass marks required" : false
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pass Marks(The.)"
                        type="number"
                        size="small"
                        fullWidth
                        disabled={!isTheoretical}
                        error={!!errors.passMark}
                        helperText={errors.passMark ? errors.passMark.message : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Controller
                    name="pFullMark"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: isPractical ? "Practical full marks required" : false
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Full Marks(Prac)"
                        type="number"
                        size="small"
                        fullWidth
                        disabled={!isPractical}
                        error={!!errors.pFullMark}
                        helperText={errors.pFullMark ? errors.pFullMark.message : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Controller
                    name="pPassMark"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: isPractical ? "Practical pass marks required" : false
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pass Marks(Prac)"
                        type="number"
                        size="small"
                        fullWidth
                        disabled={!isPractical}
                        error={!!errors.pPassMark}
                        helperText={errors.pPassMark ? errors.pPassMark.message : ""}
                      />
                    )}
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={2}>
                  <Controller
                    name="status"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value={true}>
                            <Chip label="Active" color="success" size="small" />
                          </MenuItem>
                          <MenuItem value={false}>
                            <Chip label="Inactive" color="error" size="small" />
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <Controller
                    name="details"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Buttons */}
              <Grid
                container
                justifyContent="center"
                spacing={2}
                style={{ marginTop: "20px" }}
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    style={{ backgroundColor: "#007aff", color: "#inherit" }}
                  >
                    {loading ? "Updating..." : "Update"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Grid>
      </Grid>
    </DialogContent>
  );
}
