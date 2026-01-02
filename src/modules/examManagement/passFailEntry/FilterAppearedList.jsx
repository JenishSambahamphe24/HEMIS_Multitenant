
import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PassFailStudentEntry from "../passFailEntry/PassFailStudentEntry";
import { blue } from "@mui/material/colors";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const FilterAppearedList = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  
  const [examScheduleData, setExamScheduleData] = useState({});
  const [studentData, setStudentData] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const examscheduleId = queryParams.get("examschedule");


  const programId = examScheduleData?.programMgmtId;
  const batchId = examScheduleData?.batchId;
  const semester = examScheduleData?.semester;
  const year = examScheduleData?.year;

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
    const handleSearch = async () => {
      try {
        const response = await fetchWithAuth(
          `${backendUrl}/BulkExamAttend/GetAllAppearedStudents?programId=${programId}&BatchId=${batchId}&examScheduleId=${examscheduleId}`
        );
        if (response) {
          setStudentData(response.data);
        }
      } catch (err) {
        setError("Failed to load initial data");
      }
    };
    handleSearch();
  }, [batchId, programId]);

  console.log(examscheduleId)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetchWithAuth(
          `${backendUrl}/ExamSchedule/${examscheduleId}`
        );
        setExamScheduleData(response.data);
      } catch (err) {
        setError("Failed to load initial data");
      }
    };
    fetchInitialData();
  }, [examscheduleId]);

  return (
    <Box sx={{ p: 0 }}>
      <Typography textAlign={"center"} color={blue[700]} padding={1}>
        Select the students from the <strong>{examScheduleData?.batch}</strong> batch who have successfully passed the <strong>{examScheduleData?.examName}</strong> exam.
      </Typography>
      <PassFailStudentEntry studentData={studentData} examscheduleId={examscheduleId} year={year} semester={semester} />
    </Box>
  );
};

export default FilterAppearedList;
