import  { useEffect, useState } from "react";

import {
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  TextField,
  Grid,
  Box,
  InputAdornment,
  Typography,
  Select,
  MenuItem,
  FormControl,
  capitalize,
  Menu,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import {  useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import { getBatch, getProgramByCollegeId } from "../../../services/services";
import { getPaginatedVerifiedStudents } from "../../dashboard/services/service";

const IdCardForStudent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser?.institution?.id;
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [levelName, setlevelName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [batchId, setBatchId] = useState("");
  const [programId, setProgramId] = useState("");
  const [allPrograms, setAllPrograms] = useState([]);
  const [semYear, setSemYear] = useState("");
  const [allBatch, setAllBatch] = useState([]);
  const [programType, setProgramType] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // 👉 Use search params
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔁 Sync state with URL on component mount
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (params.page) setPage(parseInt(params.page, 10));
    if (params.rowsPerPage) setRowsPerPage(parseInt(params.rowsPerPage, 10));
    if (params.batchId) setBatchId(params.batchId);
    if (params.programId) setProgramId(params.programId);
    if (params.semYear) setSemYear(params.semYear);
    if (params.search) setSearchTerm(params.search);

    // Only mark filters as applied if required params exist
    if (params.batchId && params.programId) {
      setFiltersApplied(true);
    }
  }, []);

  // 🔄 Update URL when filters change
  const updateSearchParams = () => {
    const params = {};
    if (page > 1) params.page = page;
    if (rowsPerPage !== 25) params.rowsPerPage = rowsPerPage;
    if (batchId) params.batchId = batchId;
    if (programId) params.programId = programId;
    if (semYear) params.semYear = semYear;
    if (searchTerm) params.search = searchTerm;

    setSearchParams(params, { replace: true }); // Use replace to avoid cluttering history
  };

  // Run after any filter/state change that should reflect in URL
  useEffect(() => {
    if (filtersApplied) {
      updateSearchParams();
    }
  }, [page, rowsPerPage, batchId, programId, semYear, searchTerm, filtersApplied]);

  // Debounce hook
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
  const debouncedSearchTerm = useDebounce(searchTerm, 3000);

  // Handle Semester/Year change
  const handleSemYearChange = (e) => {
    setSemYear(e.target.value);
  };

  // Validate required filters
  const isFiltersValid = () => {
    return batchId && programId;
  };

  // Apply filters and sync with URL
  const handleSubmitFilters = () => {
    if (isFiltersValid()) {
      setFiltersApplied(true);
      setPage(1); // Reset to first page
      updateSearchParams(); // Update URL
    }
  };

  // Reset filters and clear URL
  const handleResetFilters = () => {
    setBatchId("");
    setProgramId("");
    setSemYear("");
    setProgramType("");
    setlevelName("");
    setFiltersApplied(false);
    setStudentData([]);
    setTotalStudents(0);
    setPage(1);
    setSearchTerm("");
    setSearchParams({}); // Clear all query params
  };

  // Handle Program selection
  const handleProgramIdChange = (e) => {
    const selectedId = e.target.value;
    setProgramId(selectedId);
    const program = allPrograms.find((prog) => prog.id === selectedId);
    if (program) {
      setProgramType(program.programType);
      setlevelName(program.levelName);
    } else {
      setProgramType("");
      setlevelName("");
    }
    setSemYear("");
  };

  // Fetch filter options
  useEffect(() => {
    const fetchFilterParams = async () => {
      if (!collegeId) return;
      try {
        const [batchResponse, programResponse] = await Promise.all([
          getBatch(),
          getProgramByCollegeId(collegeId),
        ]);
        setAllBatch(batchResponse);
        setAllPrograms(programResponse);
      } catch (error) {
        console.error("Error fetching filter parameters:", error);
      }
    };
    fetchFilterParams();
  }, [collegeId]);

  // Fetch student data
  const fetchData = async () => {
    if (!filtersApplied || !batchId || !programId) return;
    setLoading(true);
    try {
      const paginatedResponse = await getPaginatedVerifiedStudents({
        page,
        pageSize: rowsPerPage,
        batchId,
        programId,
        name: debouncedSearchTerm,
        semYear,
      });
      setTotalStudents(paginatedResponse.totalPages || 0);
      setStudentData(paginatedResponse.students || []);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setStudentData([]);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filtersApplied, page, rowsPerPage, debouncedSearchTerm, batchId, programId, semYear]);

  // Pagination handlers
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  return (
    <>
      {loading ? (
        <LoadingOverlay
          visible={loading}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ color: "#1976d2", type: "bars" }}
        />
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: "15px" }}>
            <Grid item xs={12} style={{ marginBottom: "20px" }}>
              <h1 className="mb-4 text-lg font-medium text-[#2B6EB5]">
                Generate Student ID Cards
              </h1>
              <Paper elevation={1} style={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} sm={6} md={1.5}>
                    <FormControl size="small" fullWidth required>
                      <InputLabel>Batch</InputLabel>
                      <Select
                        size="small"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        label="Batch"
                        fullWidth
                        sx={{ textAlign: 'left' }}
                        disabled={loading}
                      >
                        <MenuItem value="">
                          <em>Select Batch</em>
                        </MenuItem>
                        {allBatch.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.batchNepali}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl size="small" fullWidth required>
                      <InputLabel>Program</InputLabel>
                      <Select
                        value={programId}
                        onChange={handleProgramIdChange}
                        label="Program"
                        fullWidth
                        disabled={loading}
                      >
                        <MenuItem value="">
                          <em>Select Program</em>
                        </MenuItem>
                        {allPrograms.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            {item.programName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    {programId && programType === "semester" && (
                      <FormControl fullWidth size="small">
                        <InputLabel>Semester</InputLabel>
                        <Select
                          value={semYear}
                          onChange={handleSemYearChange}
                          label="Semester"
                          fullWidth
                          sx={{ textAlign: 'left' }}
                          disabled={loading}
                        >
                          <MenuItem value="">
                            <em>Select Semester</em>
                          </MenuItem>
                          {["First", "Second", "Third", "Fourth", "Five", "Six", "Seven", "Eighth"].map((sem) => (
                            <MenuItem
                              key={sem}
                              value={sem}
                              disabled={sem === "Five" && levelName === "Master"}
                            >
                              {sem}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {programId && programType === "annual" && (
                      <FormControl size="small" fullWidth>
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={semYear}
                          onChange={handleSemYearChange}
                          label="Year"
                          fullWidth
                          sx={{ textAlign: 'left' }}
                          disabled={loading}
                        >
                          <MenuItem value="">
                            <em>Select Year</em>
                          </MenuItem>
                          {["First", "Second", "Third", "Fourth"].map((year) => (
                            <MenuItem
                              key={year}
                              value={year}
                              disabled={year === "Third" && levelName === "Master"}
                            >
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                  <Grid item xs={6} gap='10px' display='flex' justifyContent='flex-end'>
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitFilters}
                        disabled={!isFiltersValid() || loading}
                        fullWidth
                        size="small"
                      >
                        Apply
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleResetFilters}
                        disabled={loading}
                        fullWidth
                        size="small"
                      >
                        Reset
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {filtersApplied && (
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search by Students..."
                  value={searchTerm}
                  sx={{ bgcolor: "whitesmoke" }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon style={{ color: "#2b6eb5" }} />
                      </InputAdornment>
                    ),
                    style: {
                      height: "36px",
                      padding: "0 10px",
                      fontSize: "13px",
                    },
                  }}
                  fullWidth
                  disabled={loading}
                />
              </Grid>
            )}
          </Grid>

          {filtersApplied ? (
            <>
              <TableContainer sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead style={{ backgroundColor: "#2A629A" }}>
                    <TableRow>
                      {[
                        "S.No.",
                        "Full Name",
                        "Gender",
                        "DOB(BS)",
                        "Ethnicity",
                        "Batch Year",
                        "Semester/Year",
                        "Roll No",
                        "Uni Reg. No.",
                        "Phone No.",
                        "Level",
                        "Faculty",
                        "Program",
                        "Actions",
                      ].map((header, index) => (
                        <TableCell
                          key={index}
                          style={{
                            color: "#ffffff",
                            border: "1px solid #ddd",
                            padding: "4px",
                            height: "24px",
                            textAlign: "center",
                            width:
                              header === "S.No."
                                ? "2%"
                                : header === "Actions"
                                  ? "5%"
                                  : "auto",
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ bgcolor: "white" }}>
                    {studentData.length > 0 ? (
                      studentData.map((data, index) => (
                        <TableRow key={data.id}>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {(page - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {`${data.firstName || ""} ${data.middleName || ""} ${data.lastName || ""}`.trim()}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data.gender ? capitalize(data.gender) : ""}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data.doBBS?data.doBBS.split("T")[0]:""}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data.ethnicity}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data.batchNameNepali || ""}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data.year ? `${data.year} year` : `${data.semester} semester`}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data?.rollNoManual}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data?.universityRegdNo}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data.phoneNumber}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data.levelName}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {data.facultyName}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            <Tooltip title={data.programName}>
                              {data.programShortName}
                            </Tooltip>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "center" }}>
                            <Button
                              onClick={() => navigate(`/student-management/student-card/${data?.id}`)}
                              disabled={loading}
                              size="small"
                            >
                              Generate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={14} style={{ textAlign: "center", padding: "20px" }}>
                          <Typography variant="body1" style={{ color: "#666" }}>
                            No student data found for the selected filters.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {studentData.length > 0 && (
                <div className="flex items-center justify-end h-16">
                  <Box>
                    <FormControl size="small" fullWidth>
                      <Select
                        variant="standard"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        displayEmpty
                        sx={{
                          backgroundColor: "whitesmoke",
                          borderColor: "lightgray",
                          borderRadius: 1,
                          width: "150px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "lightgray",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "blue",
                          },
                          "& .MuiSelect-select": {
                            padding: "4px 8px",
                            fontSize: "0.75rem",
                          },
                          "& .MuiSelect-icon": {
                            fontSize: "1rem",
                          },
                        }}
                        disabled={loading}
                      >
                        <MenuItem value="25">
                          <em>rows per page</em>
                        </MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={200}>200</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Pagination
                    sx={{ ml: "40px" }}
                    count={totalStudents}
                    page={page}
                    shape="rounded"
                    onChange={handlePageChange}
                    disabled={loading}
                  />
                </div>
              )}
            </>
          ) : (
            <Typography variant="body1" style={{ color: "#d32f2f", marginTop: "20px" }}>
              Please select Batch and Program to load students.
            </Typography>
          )}
        </div>
      )}
    </>
  );
};

export default IdCardForStudent;
