import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  Paper,
  InputLabel,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Checkbox,
  DialogTitle,
  DialogContent,
  TextField, InputAdornment,
  Dialog,
  DialogContentText,
  DialogActions,
  capitalize,
} from "@mui/material";
import { LoadingOverlay } from "@mantine/core";
import DropoutManagement from "../../modules/studentManagement/dropoutManagement";

import SearchIcon from "@mui/icons-material/Search";
import {
  getPaginatedStudentsForUpgrade,
  upgradeStudents,
} from "../../components/dashboard/services/service";
import { useSelector } from "react-redux";
import { blue } from "@mui/material/colors";
import toast from "react-hot-toast";
import { getBatch, getProgramByCollegeId } from "../../services/services";

const UpgradeAcademics = () => {
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser?.institution?.id;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [batchId, setBatchId] = useState('');
  const [semYear, setSemYear] = useState('');
  const [programId, setProgramId] = useState('');
  const [allPrograms, setAllPrograms] = useState([]);
  const [allBatch, setAllBatch] = useState([]);
  const [programType, setProgramType] = useState('');
  const [studentData, setStudentData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dropoutOpen, setDropoutOpen] = useState(false);
  const [selectedStudentForDropout, setSelectedStudentForDropout] = useState(null);
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [levelName, setLevelName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [filtersApplied, setFiltersApplied] = useState(false);

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
  const debouncedSearchTerm = useDebounce(searchTerm, 1500);

  // Handle Semester/Year change
  const handleSemYearChange = (e) => {
    setSemYear(e.target.value);
  };

  // Check if required filters are selected
  const isFiltersValid = () => {
    return batchId && programId && semYear;
  };

  // Apply filters
  const handleSubmitFilters = () => {
    if (isFiltersValid()) {
      setFiltersApplied(true);
      setPage(1);
    } else {
      toast.warn('Please select both Batch and Program');
    }
  };

  const handleResetFilters = () => {
    setBatchId("");
    setProgramId("");
    setSemYear("");
    setProgramType("");
    setLevelName("");
    setFiltersApplied(false);
    setStudentData([]);
    setFilteredStudentData([]);
    setTotalStudents(0);
    setPage(1);
    setSearchTerm("");
    setSelectedStudents([]);
  };

  // Handle Program selection
  const handleProgramIdChange = (e) => {
    const selectedId = e.target.value;
    setProgramId(selectedId);
    const program = allPrograms.find((prog) => prog.id === selectedId);
    if (program) {
      setProgramType(program.programType);
      setLevelName(program.levelName);
    } else {
      setProgramType("");
      setLevelName("");
    }
    setSemYear("");
  };

  // Fetch initial filter options
  useEffect(() => {
    const fetchFilterParams = async () => {
      if (!collegeId) return;
      try {
        const [batchResponse, programResponse] = await Promise.all([
          getBatch(),
          getProgramByCollegeId(collegeId)
        ]);
        setAllBatch(batchResponse || []);
        setAllPrograms(programResponse || []);
      } catch (error) {
        console.error("Error fetching filter parameters:", error);
        toast.error("Failed to load filter options.");
      }
    };
    fetchFilterParams();
  }, [collegeId]);

  // Fetch student data
  const fetchData = async () => {
    if (!filtersApplied || !batchId || !programId) return;

    setLoading(true);
    try {
      const paginatedResponse = await getPaginatedStudentsForUpgrade({
        page,
        pageSize: rowsPerPage,
        batchId,
        programId,
        name: debouncedSearchTerm,
        semYear: semYear,
      });

      if (paginatedResponse) {
        setTotalStudents(paginatedResponse.totalPages || 0);
        const students = paginatedResponse.studentUpgrades || [];
        setStudentData(students);
        setFilteredStudentData(students);
      } else {
        setStudentData([]);
        setFilteredStudentData([]);
        setTotalStudents(0);
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
      toast.error("Failed to load student data.");
      setStudentData([]);
      setFilteredStudentData([]);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filtersApplied, page, batchId, programId, debouncedSearchTerm, rowsPerPage, semYear]);



  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  // Focus search input when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [debouncedSearchTerm]);

  // Checkbox handlers
  const handleCheckboxChange = (event, studentId) => {
    if (event.target.checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedStudents(filteredStudentData.map((student) => student.studentId));
    } else {
      setSelectedStudents([]);
    }
  };

  // Upgrade logic
  const ProgramType = {
    SEMESTER: 'semester',
    ANNUAL: 'annual',
  };

  const getNextSemesterOrYear = (programType, currentSemester, currentYear) => {
    if (programType === ProgramType.SEMESTER) {
      switch (currentSemester) {
        case 'First': return { semester: 'Second', year: '' };
        case 'Second': return { semester: 'Third', year: '' };
        case 'Third': return { semester: 'Fourth', year: '' };
        case 'Fourth': return { semester: 'Fifth', year: '' };
        case 'Fifth': return { semester: 'Sixth', year: '' };
        case 'Sixth': return { semester: 'Seventh', year: '' };
        case 'Seventh': return { semester: 'Eighth', year: '' };
        default: return { semester: '', year: '' };
      }
    } else if (programType === ProgramType.ANNUAL) {
      switch (currentYear) {
        case 'First': return { semester: '', year: 'Second' };
        case 'Second': return { semester: '', year: 'Third' };
        case 'Third': return { semester: '', year: 'Fourth' };
        default: return { semester: '', year: '' };
      }
    } else {
      return { semester: '', year: '' };
    }
  };

  const handleUpgrade = async () => {
    if (selectedStudents.length === 0) {
      toast.warn('No students selected for upgrade.');
      return;
    }

    setLoading(true);
    try {
      if (!Array.isArray(selectedStudents) || !Array.isArray(studentData)) {
        throw new Error('Invalid input data');
      }

      const upgradeData = selectedStudents
        .map((studentId) => {
          const student = studentData.find((student) => student.studentId === studentId);
          if (student && !student.isUpgraded) {
            const { semester, year } = getNextSemesterOrYear(
              student.programType,
              student.semester,
              student.year
            );
            return {
              programId: student.programId,
              studentId: studentId,
              year: year,
              semester: semester,
              batchId: student.batchId,
              isIrregular: false,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      if (upgradeData.length === 0) {
        toast.warn('No students available for upgrade.');
        return;
      }

      const response = await upgradeStudents(upgradeData);

      // Check for successful response - adjust based on your API response format
      if (response === 'stuent upgrade success' || response === 'student upgrade success') {
        toast.success('Student(s) Upgraded Successfully!');
        setPage(1);
        fetchData();
        setSelectedStudents([]);
        setOpen(false);
      } else if (response === 'students already upgraded') {
        toast.warn('Some selected students are already upgraded.');
      } else {
        toast.warn('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error upgrading students:', error);
      toast.error('Failed to upgrade students.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleClickDropoutOpen = (data) => {
    setSelectedStudentForDropout(data);
    setDropoutOpen(true);
  };

  const handleDropoutClose = () => {
    setDropoutOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const hasSelectedRows = selectedStudents.length > 0;

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
        <div>
          {/* Filter Section */}
          <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: "15px" }}>
            <Grid item xs={12} style={{ marginBottom: "20px" }}>
              <h1 className="text-lg font-medium text-[#2b6eb5] text-center mb-1">
                Student List For Upgrading Semester/Year
              </h1>

              <Paper elevation={1} style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} sm={6} md={2}>
                    <FormControl size="small" fullWidth required>
                      <InputLabel>Batch</InputLabel>
                      <Select
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        label="Batch"
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

                  <Grid item xs={12} sm={6} md={2}>
                    {programId && programType === "semester" && (
                      <FormControl fullWidth size="small">
                        <InputLabel>Semester</InputLabel>
                        <Select
                          value={semYear}
                          onChange={handleSemYearChange}
                          label="Semester"
                          disabled={loading}
                        >
                          <MenuItem value="">
                            <em>All Semesters</em>
                          </MenuItem>
                          <MenuItem value="First">First</MenuItem>
                          <MenuItem value="Second">Second</MenuItem>
                          <MenuItem value="Third">Third</MenuItem>
                          <MenuItem value="Fourth">Fourth</MenuItem>
                          <MenuItem value="Fifth" disabled={levelName === "Master"}>
                            Fifth
                          </MenuItem>
                          <MenuItem value="Sixth" disabled={levelName === "Master"}>
                            Sixth
                          </MenuItem>
                          <MenuItem value="Seventh" disabled={levelName === "Master"}>
                            Seventh
                          </MenuItem>
                          <MenuItem value="Eighth" disabled={levelName === "Master"}>
                            Eighth
                          </MenuItem>
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
                          disabled={loading}
                        >
                          <MenuItem value="">
                            <em>All Years</em>
                          </MenuItem>
                          <MenuItem value="First">First</MenuItem>
                          <MenuItem value="Second">Second</MenuItem>
                          <MenuItem value="Third" disabled={levelName === "Master"}>
                            Third
                          </MenuItem>
                          <MenuItem value="Fourth" disabled={levelName === "Master"}>
                            Fourth
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={5}>
                    <Box display="flex" justifyContent='flex-end' gap={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitFilters}
                        disabled={!isFiltersValid() || loading}
                        size="small"
                      >
                        Apply
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleResetFilters}
                        disabled={loading}
                        size="small"
                      >
                        Reset
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Search Box - Appears only after filters are applied */}
            {filtersApplied && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  variant="outlined"
                  size="small"
                  ref={inputRef}
                  placeholder="Search by Students..."
                  value={searchTerm}
                  onChange={handleSearchChange}
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
                  sx={{ bgcolor: "whitesmoke", mb: '.5rem' }}
                />
              </Grid>
            )}
          </Grid>

          <Box display="flex" justifyContent="flex-end" alignItems='center' gap='20px' my={1}>
            {filtersApplied && hasSelectedRows && (
              <Typography variant="body2" color="#1976d2" >
                No of Selected Students: {selectedStudents.length}
              </Typography>
            )}

            {/* Upgrade Button */}
            {filtersApplied && hasSelectedRows && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
                sx={{
                  borderRadius: 2,
                  textTransform: "capitalize",
                }}
              >
                Upgrade Selected
              </Button>
            )}
          </Box>

          {/* Table and Pagination */}
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table >
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  {semYear && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{ color: "white" }}
                        color="default"
                        onChange={handleSelectAllClick}
                        checked={
                          selectedStudents.length > 0 &&
                          selectedStudents.length === filteredStudentData.length
                        }
                        disabled={loading || filteredStudentData.length === 0}
                      />
                    </TableCell>
                  )}
                  {[
                    "S.No.",
                    "Roll No",
                    "Full Name",
                    "Uni reg No",
                    "Gender",
                    "Batch Year",
                    "Semester/Year",
                    "Phone No.",
                    "Level",
                    "Faculty",
                    "Program",
                    "District",
                    "Action"
                  ].map((header) => (
                    <TableCell
                      key={header}
                      style={{
                        color: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "24px",
                        textAlign: "center",
                        width: header === "S.No." ? "2%" : header === "Action" ? "8%" : "auto",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {filtersApplied ? (
                <>
                  <TableBody sx={{ backgroundColor: "whitesmoke" }}>
                    {filteredStudentData && filteredStudentData.length > 0 ? (
                      filteredStudentData.map((student, index) => (
                        <TableRow key={student.studentId}>
                          {semYear && (
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedStudents.includes(student.studentId)}
                                onChange={(event) =>
                                  handleCheckboxChange(event, student.studentId)
                                }
                                disabled={loading}
                              />
                            </TableCell>
                          )}
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {(page - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.student?.rollNoManual || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {`${student.student?.firstName || ""} ${student.student?.middleName || ""} ${student.student?.lastName || ""}`.trim() || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.student?.universityRegdN || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.student?.gender ? capitalize(student.student.gender) : "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.student?.admissionYear || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.year
                              ? `${student.year} year`
                              : student.semester
                                ? `${student.semester} semester`
                                : "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.student?.phoneNumber || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.levelName || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.facultyName || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            <Tooltip title={student.programName || "N/A"}>
                              <span>{student.programShortName || "N/A"}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.student?.pDistrict || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", textAlign: "center", padding: '2px' }}>
                            <Button
                              size="small"
                              onClick={() => handleClickDropoutOpen(student.student)}
                              disabled={loading}
                            >
                              Dropout entry
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={semYear ? 14 : 13} style={{ textAlign: "center", padding: "20px" }}>
                          <Typography variant="body1" style={{ color: "#666" }}>
                            No student data found for the selected filters.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>

                </>
              ) : (
                <TableBody className="h-[260px]">
                  <TableRow >
                    <TableCell colSpan={14}>
                      <h1 className="text-red-500 text-lg text-center font-medium">
                        Please select Batch and Program to load students.
                      </h1>
                    </TableCell>
                  </TableRow>
                </TableBody>

              )}
            </Table>
          </TableContainer>
          {filteredStudentData && filteredStudentData.length > 0 && (
            <div className=" flex items-center justify-end w-[100%]">
              <FormControl size="small" >
                <Select
                  variant="standard"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  disabled={loading}
                  sx={{
                    backgroundColor: "whitesmoke",
                    borderColor: "lightgray",
                    borderRadius: 1,
                    width: "150px",
                    "& .MuiSelect-select": {
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                    },
                  }}
                >
                  <MenuItem value="10"><em>rows per page</em></MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={150}>150</MenuItem>
                  <MenuItem value={200}>200</MenuItem>
                  <MenuItem value={250}>250</MenuItem>
                </Select>
              </FormControl>
              <Pagination
                sx={{ ml: '40px' }}
                count={totalStudents}
                page={page}
                shape="rounded"
                onChange={handlePageChange}
                disabled={loading}
              />

            </div>
          )}
          {/* Upgrade Confirmation Dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <DialogTitle
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1rem",
                bgcolor: blue[700],
                color: "white",
                py: 1.5,
                mb: 1.5,
              }}
            >
              Confirm Upgrade
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {programType === "semester" ? (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#444",
                      lineHeight: 1.7,
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      textAlign: "center",
                      mb: 2,
                    }}
                  >
                    You are currently in the{" "}
                    <span style={{ fontWeight: "bold", color: "#1976d2" }}>
                      {semYear} Semester
                    </span>
                    . We are upgrading the selected students to the{" "}
                    <span style={{ fontWeight: "bold", color: "#1976d2" }}>
                      Next Semester
                    </span>
                    .
                  </Typography>
                ) : programType === "annual" ? (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#444",
                      lineHeight: 1.7,
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      textAlign: "center",
                      mb: 2,
                    }}
                  >
                    You are currently in the{" "}
                    <span style={{ fontWeight: "bold", color: "#1976d2" }}>
                      {semYear} Year
                    </span>
                    . We are upgrading the selected students to the{" "}
                    <span style={{ fontWeight: "bold", color: "#1976d2" }}>
                      Next Year
                    </span>
                    .
                  </Typography>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#444",
                      lineHeight: 1.7,
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      textAlign: "center",
                      mb: 2,
                    }}
                  >
                    Please select a valid program type to see upgrade details.
                  </Typography>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                p: 1,
                pb: 2,
                borderTop: "1px solid #ddd",
              }}
            >
              <Button
                onClick={handleClose}
                color="error"
                variant="outlined"
                size="small"
                sx={{
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  borderRadius: 2,
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpgrade}
                color="success"
                variant="contained"
                size="small"
                sx={{
                  bgcolor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#1565c0",
                  },
                  padding: "6px 12px",
                  borderRadius: 2,
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={dropoutOpen}
            onClose={handleDropoutClose}
            sx={{
              borderRadius: "14px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(4px)",
            }}
          >
            <DropoutManagement student={selectedStudentForDropout} onClose={handleDropoutClose} />
          </Dialog>

        </div>
      )}
    </>
  );
};

export default UpgradeAcademics;



