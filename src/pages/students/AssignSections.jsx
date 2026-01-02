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
  CircularProgress,
} from "@mui/material";
import { LoadingOverlay } from "@mantine/core";
import { config } from '@config';
import SearchIcon from "@mui/icons-material/Search";
import { getBatch, getProgramByCollegeId } from "../../services/services";
import { useSelector } from "react-redux";
import { blue } from "@mui/material/colors";
import toast from "react-hot-toast";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";



const AssignSections = () => {
  const backendUrl = config.VITE_BACKEND_URL;
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
  const [studentSections, setStudentSections] = useState({});
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [levelName, setLevelName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const [bulkSectionId, setBulkSectionId] = useState('');
  const [sectionOptions, setSectionOptions] = useState([]);

  const capitalize = (s) => {
    if (!s) return s;
    try {
      return s.charAt(0).toUpperCase() + s.slice(1);
    } catch {
      return s;
    }
  };


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

  // Fetch sections using axios with proper authentication
  const fetchAllSections = async () => {
    try {
      setLoading(true);
      const config = await getAuthConfigSafe();
      const response = await axios.get(
        `${backendUrl}/SectionForStudent/all`,
        config
      );
      if (response?.data && Array.isArray(response.data)) {
        setSectionOptions(response.data);
      } else {
        console.error('Invalid response format from sections API:', response?.data);
        toast.error('Failed to load sections. Invalid response format.');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error('Failed to load sections. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSemYearChange = (e) => {
    setSemYear(e.target.value);
  };

  const isFiltersValid = () => {
    return batchId && programId && semYear;
  };

  // Apply filters
  const handleSubmitFilters = () => {
    if (isFiltersValid()) {
      setFiltersApplied(true);
      setPage(1);

      fetchAllSections();

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
    setStudentSections({});
    setBulkSectionId('');
    setSectionOptions([]);
  };

  // Handle Program selection
  const handleProgramIdChange = async (e) => {
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

  // Handle section change for a student
  const handleSectionChange = (studentId, sectionId) => {
    setStudentSections(prev => ({
      ...prev,
      [studentId]: sectionId
    }));
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

  const fetchData = async () => {
    if (!filtersApplied || !batchId || !programId) return;

    setLoading(true);
    try {
      const config = await getAuthConfigSafe();

      const params = {
        isVerified: true,
        page,
        pageSize: rowsPerPage,
      };
      if (debouncedSearchTerm) params.name = debouncedSearchTerm;
      if (batchId) params.batchId = batchId;
      if (programId) params.programId = programId;
      if (semYear) params.semYear = semYear;

      const response = await axios.get(
        `${backendUrl}/Student/GetAllStudentPaginated`,
        { params, ...config }
      );

      const data = response?.data;
      if (!data) {
        setStudentData([]);
        setFilteredStudentData([]);
        setTotalStudents(0);
        setStudentSections({});
        return;
      }

      setTotalStudents(data.totalPages || 0);

      const apiStudents = Array.isArray(data.students) ? data.students : [];

      // Map server student objects into the "studentUpgrades" style object used by the table.
      const mapped = apiStudents.map((s) => {
        const sectionId = s.sectionForStudentId ?? s.sectionId ?? (s.section ? s.section.id : null) ?? null;
        const sectionName = s.section ?? s.sectionName ?? s.sectionSymbol ?? null;

        return {

          student: s,
          studentId: s.id ?? s.studentId ?? null,
          sectionId: sectionId,
          sectionName: sectionName,
          year: s.year ?? s.semester ?? null,
          facultyName: s.facultyName ?? s.faculty ?? "",
          programName: s.programName ?? s.program ?? "",
          programShortName: s.programShortName ?? s.programShort ?? "",
          levelName: s.levelName ?? "",
        };
      });

      setStudentData(mapped);
      setFilteredStudentData(mapped);

      // Initialize section selections for students (if already assigned)
      const initialSections = {};
      mapped.forEach(student => {
        if (student.studentId) {
          const matched = sectionOptions.find(
            sec => sec.sectionSymbol === student.sectionName
          );

          initialSections[student.studentId] = matched?.id || '';
        }
      });
      setStudentSections(initialSections);

    } catch (err) {
      console.error('Error fetching student data:', err);
      toast.error("Failed to load student data.");
      setStudentData([]);
      setFilteredStudentData([]);
      setTotalStudents(0);
      setStudentSections({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setSelectedStudents((prev) => [...prev, studentId]);

      // ✅ Auto load old section when checkbox checked
      const student = filteredStudentData.find(
        (s) => s.studentId === studentId
      );

      if (student?.sectionName) {
        const matched = sectionOptions.find(
          (sec) => sec.sectionSymbol === student.sectionName
        );

        if (matched?.id) {
          setStudentSections((prev) => ({
            ...prev,
            [studentId]: matched.id,
          }));
        }
      }
    } else {
      setSelectedStudents((prev) =>
        prev.filter((id) => id !== studentId)
      );

      setStudentSections((prev) => {
        const newSections = { ...prev };
        delete newSections[studentId];
        return newSections;
      });
    }
  };


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const allStudentIds = filteredStudentData.map(
        (student) => student.studentId
      );
      setSelectedStudents(allStudentIds);

      // ✅ Auto-load old sections for all selected students
      const newSections = {};

      filteredStudentData.forEach((student) => {
        if (student.sectionName) {
          const matched = sectionOptions.find(
            (sec) => sec.sectionSymbol === student.sectionName
          );

          if (matched?.id) {
            newSections[student.studentId] = matched.id;
          }
        }
      });

      setStudentSections(newSections);
      setBulkSectionId('');
    } else {
      setSelectedStudents([]);
      setStudentSections({});
      setBulkSectionId('');
    }
  };


  // Apply bulk section to selected students
  const handleBulkSectionChange = (sectionId) => {
    setBulkSectionId(sectionId);

    if (sectionId && selectedStudents.length > 0) {
      const updatedSections = { ...studentSections };
      selectedStudents.forEach(studentId => {
        updatedSections[studentId] = sectionId;
      });
      setStudentSections(updatedSections);
      toast.success(`Section applied to ${selectedStudents.length} students`);
    }
  };

  // Assign sections using the backend PATCH endpoint (BulkUpdateSection)
  // Now sends sectionSymbol instead of id
  const handleAssignSections = async () => {
    if (selectedStudents.length === 0) {
      toast.warn('No students selected for section assignment.');
      return;
    }

    const studentsWithoutSections = selectedStudents.filter(
      studentId => !studentSections[studentId]
    );

    if (studentsWithoutSections.length > 0) {
      toast.warn('Please assign sections to all selected students.');
      return;
    }

    // Group studentIds by sectionId
    const groupMap = {};
    selectedStudents.forEach((studentId) => {
      const secId = studentSections[studentId];
      if (!groupMap[secId]) groupMap[secId] = [];
      groupMap[secId].push(studentId);
    });

    setLoading(true);
    try {
      const config = await getAuthConfigSafe();

      const requests = Object.entries(groupMap).map(([sectionId, studentIds]) => {
        // Find section to extract sectionSymbol
        const selectedSection = sectionOptions.find(
          section => String(section.id) === String(sectionId)
        );

        // ✅ Use sectionSymbol instead of id
        const sectionSymbol = selectedSection?.sectionSymbol || "";

        const payload = {
          studentIds: studentIds,
          section: sectionSymbol,   // <-- IMPORTANT CHANGE
        };

        return axios.patch(
          `${backendUrl}/Student/BulkUpdateSection`,
          payload,
          config
        );
      });

      const responses = await Promise.all(requests);
      const allSuccessful = responses.every(r => [200, 201, 204].includes(r.status));

      if (allSuccessful) {
        toast.success(`Sections assigned successfully to ${selectedStudents.length} students!`);
        setPage(1);
        await fetchData();
        setSelectedStudents([]);
        setStudentSections({});
        setBulkSectionId('');
        setOpen(false);
      } else {
        toast.warn('Some assignments may not have been completed successfully.');
      }
    } catch (error) {
      console.error('Error assigning sections:', error);
      toast.error('Failed to assign sections. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleClickOpen = () => {
    // Check if all selected students have sections
    const studentsWithoutSections = selectedStudents.filter(
      studentId => !studentSections[studentId]
    );

    if (studentsWithoutSections.length > 0) {
      toast.warn('Please assign sections to all selected students before confirming.');
      return;
    }
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
                Assign Sections to Students
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

          {/* Bulk Section Assignment Section */}
          <Box display="flex" justifyContent="flex-end" alignItems='center' gap='20px' my={1}>
            {filtersApplied && hasSelectedRows && (
              <>
                <Typography variant="body2" color="#1976d2">
                  No of Selected Students: {selectedStudents.length}
                </Typography>

                {/* Bulk Section Dropdown */}
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Assign Section to All</InputLabel>
                  <Select
                    value={bulkSectionId}
                    onChange={(e) => handleBulkSectionChange(e.target.value)}
                    label="Assign Section to All"
                    disabled={loading || selectedStudents.length === 0}
                  >
                    <MenuItem value="">
                      <em>Select Section</em>
                    </MenuItem>
                    {sectionOptions.map((section) => (
                      <MenuItem key={section.id} value={section.id}>
                        {section.sectionSymbol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Assign Sections Button */}
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
                  Assign Sections
                </Button>
              </>
            )}
          </Box>

          {/* Student Table */}
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table>
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
                    "Section",
                    "Phone No.",
                    "Level",
                    "Faculty",
                    "Program",
                    "District"
                  ].map((header) => (
                    <TableCell
                      key={header}
                      style={{
                        color: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "24px",
                        textAlign: "center",
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
                        <TableRow key={student.studentId || index}>
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
                            {student.student?.rollNoManual || student.student?.rollNo || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {`${student.student?.firstName || ""} ${student.student?.middleName || ""} ${student.student?.lastName || ""}`.trim() || "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {student.student?.universityRegdNo || student.student?.universityRegdN || "N/A"}
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
                              : student.student?.semester
                                ? `${student.student.semester} semester`
                                : "N/A"}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                            {selectedStudents.includes(student.studentId) ? (
                              <FormControl size="small" fullWidth>
                                <Select
                                  value={studentSections[student.studentId] || ''}
                                  onChange={(e) => handleSectionChange(student.studentId, e.target.value)}
                                  disabled={loading}
                                  sx={{ fontSize: '0.75rem', height: '30px' }}
                                >
                                  <MenuItem value="">
                                    <em>Select Section</em>
                                  </MenuItem>
                                  {sectionOptions.map((section) => (
                                    <MenuItem key={section.id} value={section.id}>
                                      {section.sectionSymbol}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : (
                              student.sectionName
                            )}
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
                  <TableRow>
                    <TableCell colSpan={semYear ? 14 : 13}>
                      <h1 className="text-red-500 text-lg text-center font-medium">
                        Please select Batch and Program to load students.
                      </h1>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          {/* Pagination Section */}
          {filteredStudentData && filteredStudentData.length > 0 && (
            <div className="flex items-center justify-end w-[100%]">
              <FormControl size="small">
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

          {/* Assign Sections Confirmation Dialog */}
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
              Confirm Section Assignment
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
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
                  You are about to assign sections to <span style={{ fontWeight: "bold", color: "#1976d2" }}>{selectedStudents.length}</span> selected students.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    lineHeight: 1.5,
                    fontSize: "0.8rem",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  Please review the section assignments before confirming.
                </Typography>
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
                onClick={handleAssignSections}
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
                {loading ? <CircularProgress size={20} color="inherit" /> : "Confirm Assignment"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default AssignSections;
