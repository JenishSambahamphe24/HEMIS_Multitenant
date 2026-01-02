import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { blue } from "@mui/material/colors";
import { useLocation } from "react-router-dom";
import StudentPassedList from "./StudentPassedList";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const FilterPassedStudents = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  
  const [examData, setExamData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const [batchData, setBatchData] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const examscheduleId = queryParams.get("examschedule");



  const fetchWithAuth = async (url) => {
    try {
      const config = getAuthConfigSafe()
      return await axios.get(url, config);
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [examData, batch] = await Promise.all([
          fetchWithAuth(`${backendUrl}/ExamSchedule`),
          fetchWithAuth(`${backendUrl}/Batch`),
        ]);

        if (examData) setExamData(examData.data.data);
        if (batch) setBatchData(batch.data);
      } catch (err) {
        setError("Failed to load initial data");
      }
    };
    fetchInitialData();
  }, []);

  // const handleProgramChange = (e) => {
  //   const selectedProgram = programData.find(
  //     (program) => program.id === e.target.value
  //   );
  //   setSelectedProgramId(e.target.value);
  //   setSelectedProgramType(selectedProgram?.programType || "");
  //   setSelectedYear("");
  //   setSelectedSemester("");
  //   setStudentData([]);
  // };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `${backendUrl}/BulkExamAttend?BatchId=${selectedBatchId}&ExamScheduleId=${selectedExamId}`
      );
      if (response) {
        setStudentData(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Box sx={{ p: 0 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography textAlign={"center"} color={blue[700]} padding={1}>
        Student Passed List
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="batch-select-label">Batch</InputLabel>
            <Select
              labelId="batch-select-label"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              label="Batch"
            >
              {batchData?.map((batch) => (
                <MenuItem key={batch.id} value={batch.id}>
                  {batch.batchNepali}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
        <Grid item xs={12} md={7}>
          <FormControl fullWidth size="small">
            <InputLabel id="exam-select-label">Exam Name</InputLabel>
            <Select
              labelId="exam-select-label"
              value={selectedExamId}
              label="Exam Name"
              onChange={(e) => setSelectedExamId(e.target.value)}
            >
              {examData &&
                examData?.map((exam) => (
                  <MenuItem key={exam.id} value={exam.id}>
                    {exam.examName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !selectedExamId}
            fullWidth
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Grid>
      </Grid>

      <StudentPassedList
        studentData={studentData}
        examscheduleId={examscheduleId}
      />
    </Box>
  );
};

export default FilterPassedStudents;
