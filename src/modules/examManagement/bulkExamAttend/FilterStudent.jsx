import {
  TextField,
  Box,
  Typography,
  Pagination,
  FormControl,
  Select,
  MenuItem
}
  from "@mui/material";
import  { useEffect, useState } from "react";
import StudentList from "./StudentList";
import { useLocation } from "react-router-dom";
import { blue } from "@mui/material/colors";
import { LoadingOverlay } from "@mantine/core";
import {
  getExamAppearedStudents,
  getExamScheduleById,
} from "../../../components/dashboard/services/service";



const FilterStudent = () => {
  const [examScheduleData, setExamScheduleData] = useState({});
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const examscheduleId = queryParams.get("examschedule");

  const programId = examScheduleData?.programMgmtId;
  const batchId = examScheduleData?.batchId;
  const semester = examScheduleData?.semester;
  const year = examScheduleData?.year;

  // Debounce hook for search functionality
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  // Pagination handlers
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); 
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!examscheduleId) return;

      try {
        setLoading(true);
        const response = await getExamScheduleById(examscheduleId);
        setExamScheduleData(response);
      } catch (err) {
        console.error("Failed to load exam schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [examscheduleId]);

  useEffect(() => {
    if (!programId || !batchId) {
      return;
    }
    const fetchStudents = async () => {
      try {
        setLoading(true);
        console.log(
          "Fetching students with programId:",
          programId,
          "batchId:",
          batchId,
          "page:",
          page,
          "pageSize:",
          rowsPerPage
        );

        const response = await getExamAppearedStudents({
          programId: programId,
          batchId: batchId,
          year: year,
          semester: semester,
          page: page,
          pageSize: rowsPerPage,
        });

        if (response) {
          setStudentData(response.data || []);

          // Calculate total pages based on total records
          const totalRecords = response.totalRecords || response.total || 0;
          setTotalStudents(totalRecords);
          const totalPagesCalculated = Math.ceil(totalRecords / rowsPerPage);
          setTotalPages(totalPagesCalculated);
        } else {
          setStudentData([]);
          setTotalStudents(0);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudentData([]);
        setTotalStudents(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [batchId, programId, page, rowsPerPage, debouncedSearchTerm]);

  return (
    <Box sx={{ p: 0 }}>
      {loading ? (
        <LoadingOverlay
          visible={loading}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ color: "#1976d2", type: "bars" }}
        />
      ) : (
        <>
          <Typography textAlign={"center"} color={blue[700]} padding={1}>
            Select the students from the {" "}
            <strong>{examScheduleData?.batch}</strong> batch who appeared for
            the <strong>{examScheduleData?.examName}</strong> exam.
          </Typography>

          {/* Search Input */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <TextField
              label="Search Students"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
              placeholder="Search by student name..."
            />
          </Box>

          <StudentList
            studentData={studentData || []}
            loading={loading}
            examscheduleId={examscheduleId}
            year={year}
            semester={semester}
            programId={programId}
          />

          {/* Pagination Controls */}
          <Box className="flex items-center justify-end h-16 mt-4">
            <Box sx={{ mr: 2 }}>
              <FormControl size="small">
                <Select
                  variant="standard"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  <MenuItem value={25}>25 rows</MenuItem>
                  <MenuItem value={50}>50 rows</MenuItem>
                  <MenuItem value={100}>100 rows</MenuItem>
                  <MenuItem value={150}>150 rows</MenuItem>
                  <MenuItem value={200}>200 rows</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Total Students: {totalStudents}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              shape="rounded"
              onChange={handlePageChange}
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default FilterStudent;