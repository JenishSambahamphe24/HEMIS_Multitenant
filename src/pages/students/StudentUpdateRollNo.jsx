import { useEffect, useState } from "react";
import {
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Box,
  InputAdornment,
  Select,
  Paper,
  MenuItem,
  FormControl,
  Tooltip,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import toast from "react-hot-toast";
import {
  getMajorSubsByProgramId,
  getPaginatedVerifiedStudents,
} from "../../components/dashboard/services/service";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import { getProgramByCollegeId } from "../../services/services";
import { getBatch } from "../../services/services";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const StudentUpdateRollNo = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [majorSubs, setMajorSubs] = useState([])
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser.institution.id;
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelName, setlevelName] = useState("");
  const [stdProgramId, setStdProgramId] = useState(0);
  const [batchId, setBatchId] = useState("");
  const [programId, setProgramId] = useState("");
  const [allPrograms, setAllPrograms] = useState([]);
  const [semYear, setSemYear] = useState("");
  const [allBatch, setAllBatch] = useState([]);
  const [programType, setProgramType] = useState("");
  const [editingId, setEditingId] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const [editData, setEditData] = useState({
    rollNoManual: "",
    symbolNo: "",
    universityRegdNo: "",
    majorSubjectId: null
  });
  // Pagination
  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };
  const handlePageChange = (event, value) => {
    setPage(value);
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

  const debouncedSearchTerm = useDebounce(searchTerm,1200);



  const handleYearChange = (e) => {
    setSemYear(e.target.value);
  };

  const isFiltersValid = () => {
    if (!batchId || !programId) return false;
    return true;
  };

  // Modified handleSubmitFilters to use useEffect for fetchData
  const handleSubmitFilters = () => {
    if (isFiltersValid()) {
      setFiltersApplied(true);
      setPage(1);
      // Remove direct fetchData() call - let useEffect handle it
    }
  };

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
  };

  useEffect(() => {
    const fetchMajorSubs = async () => {
      try {
        setLoading(true)
        const response = await getMajorSubsByProgramId(stdProgramId)
        setMajorSubs(response)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    };
    fetchMajorSubs()
  }, [editingId, stdProgramId])

  // Modified fetchData to remove the early return check
  const fetchData = async () => {
    // Only proceed if we have valid filters
    if (!batchId || !programId) return;

    setLoading(true);
    try {
      const paginatedResponse = await getPaginatedVerifiedStudents({
        page,
        pageSize: rowsPerPage,
        batchId,
        programId,
        name: debouncedSearchTerm,
        semYear: semYear,
      });
      setTotalStudents(paginatedResponse.totalPages);
      setStudentData(paginatedResponse.students);
    } catch (err) {
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentDetails = async (id, data) => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.patch(`${backendUrl}/Student/UpdateStudentIdentifiers`, {
        id: id,
        symbolNo: data.symbolNo,
        rollNoManual: data.rollNoManual,
        universityRegdNo: data.universityRegdNo,
        majorSubjectId: data.majorSubjectId
      },
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  };

  const handleEditClick = (student) => {
    setEditingId(student.id);
    setStdProgramId(student.programId)
    setEditData({
      rollNoManual: student.rollNoManual || "",
      symbolNo: student.symbolNo || "",
      universityRegdNo: student.universityRegdNo || "",
      majorSubjectId: student.majorSubjectId || null
    });
  };

  const handleSave = async (id) => {
    try {
      setLoading(true);
      setStudentData((prev) =>
        prev.map((student) =>
          student.id === id ? { ...student, ...editData } : student
        )
      );
      const updatedStudent = await updateStudentDetails(id, editData);
      setStudentData((prev) =>
        prev.map((student) =>
          student.id === id ? { ...student, ...updatedStudent } : student
        )
      );
      fetchData()
      toast.success("Student details updated successfully")
      setEditingId(null);
    } catch (error) {
      setStudentData((prev) => [...prev]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === 'majorSubjectId' ? (value === '' ? null : parseInt(value, 10)) : value
    }));
  };

  const handleProgramIdChange = (e) => {
    const selectedId = e.target.value;
    setProgramId(selectedId);
    const program = allPrograms.find((prog) => prog.id === selectedId);
    if (program) {
      setProgramType(program.programType);
      setlevelName(program.levelName);
    } else {
      setProgramType("");
    }
    setSemYear("");
  };
 console.log(studentData)
  useEffect(() => {
    const fetchFilterParams = async () => {
      try {
        const batchResponse = await getBatch();
        const programResponse = await getProgramByCollegeId(collegeId);
        setAllBatch(batchResponse);
        setAllPrograms(programResponse);
      } catch (error) {
        console.error("Error fetching filter parameters:", error);
      }
    };
    fetchFilterParams();
  }, [collegeId]);

  useEffect(() => {
    if (filtersApplied) {
      fetchData();
    }
  }, [filtersApplied, page, rowsPerPage, debouncedSearchTerm, batchId, programId, semYear]);



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
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginBottom: "15px" }}
          >


            {/* Filter Section */}
            <Grid item xs={12} style={{ marginBottom: "20px" }}>
              <h1 className="mb-4 text-lg font-medium text-[#2B6EB5]">
                Update Student Roll No. University Registration No.
                Symbol No. and major subject of a student
              </h1>
              <Paper elevation={1} style={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} sm={6} md={1.5}>
                    <FormControl size="small" fullWidth required>
                      <InputLabel>Batch </InputLabel>
                      <Select
                        size="small"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        label="Batch"
                        fullWidth
                        sx={{ textAlign: 'left' }}
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
                      >
                        <MenuItem value="">
                          <em>All program</em>
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
                          onChange={handleYearChange}
                          label="Semester"
                          fullWidth
                          sx={{ textAlign: 'left' }}
                        >
                          <MenuItem value="">
                            <em>Select Semester</em>
                          </MenuItem>
                          <MenuItem value="First">First</MenuItem>
                          <MenuItem value="Second">Second</MenuItem>
                          <MenuItem value="Third">Third</MenuItem>
                          <MenuItem value="Fourth">Fourth</MenuItem>
                          <MenuItem
                            value="Five"
                            disabled={levelName === "Master"}
                          >
                            Fifth
                          </MenuItem>
                          <MenuItem
                            value="Six"
                            disabled={levelName === "Master"}
                          >
                            Sixth
                          </MenuItem>
                          <MenuItem
                            value="Seven"
                            disabled={levelName === "Master"}
                          >
                            Seventh
                          </MenuItem>
                          <MenuItem
                            value="Eighth"
                            disabled={levelName === "Master"}
                          >
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
                          onChange={handleYearChange}
                          label="Year"
                          fullWidth
                          sx={{ textAlign: 'left' }}
                        >
                          <MenuItem value="">
                            <em>Select Year</em>
                          </MenuItem>
                          <MenuItem value="First">First</MenuItem>
                          <MenuItem value="Second">Second</MenuItem>
                          <MenuItem
                            value="Third"
                            disabled={levelName === "Master"}
                          >
                            Third
                          </MenuItem>
                          <MenuItem
                            value="Fourth"
                            disabled={levelName === "Master"}
                          >
                            Fourth
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                  <Grid item xs={6} gap='10px' display='flex' justifyContent='flex-end'>
                    <Grid item xs={2} >
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

                    <Grid item xs={2} >
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
                />
              </Grid>
            )}
          </Grid>

          {filtersApplied && (
            <>
              <TableContainer sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead style={{ backgroundColor: "#2A629A" }}>
                    <TableRow>
                      {[
                        "S.No.",
                        "Full Name",
                        "Batch Year",
                        "Sem/Year",
                        "Phone No.",
                        "Program",
                        "Roll No",
                        "Uni Reg. No.",
                        "Symbol",
                        "Group/program major",
                        "Actions",
                      ].map((header, index) => (
                        <TableCell
                          key={index}
                          style={{
                            padding: '2px',
                            color: "#ffffff",
                            border: "1px solid #ddd",
                            textAlign: "center",
                            width:
                              header === "Full Name"
                                ? "6%"
                                  ? header === 'Sem/Year'
                                  : '3%'
                                : header === "Actions"
                                  ? "10%"
                                  : header === "Roll No"
                                    ? "8%"
                                    : header === "Faculty"
                                      ? "4%"
                                      : header === "Phone No."
                                        ? "4%"
                                        : header === "Uni Reg. No."
                                          ? "10%"
                                          : header === "Symbol"
                                            ? "5%"
                                            : header === "Major subject"
                                              ? "10%"
                                              : "auto",
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ bgcolor: "white" }}>
                    {
                      studentData.length > 0 ?
                        studentData.map((data, index) => (
                          <TableRow key={data.id}>
                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              {`${data.firstName ? data.firstName : ""} ${data.middleName ? data.middleName : ""
                                } ${data.lastName ? data.lastName : ""}`}
                            </TableCell>

                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              {data.batchNameNepali ? data.batchNameNepali : ""}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              {data.year
                                ? `${data.year} year`
                                : `${data.semester} semester`}
                            </TableCell>

                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              {data.phoneNumber}
                            </TableCell>

                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              <Tooltip title={data.programName}>
                                {data.programShortName}
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              {editingId === data.id ? (
                                <TextField
                                  name="rollNoManual"
                                  variant="outlined"
                                  value={editData.rollNoManual}
                                  onChange={handleEditChange}
                                  size="small"
                                />
                              ) : (
                                data?.rollNoManual
                              )}
                            </TableCell>

                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              {editingId === data.id ? (
                                <TextField
                                  name="universityRegdNo"
                                  value={editData.universityRegdNo}
                                  onChange={handleEditChange}
                                  size="small"
                                />
                              ) : (
                                data?.universityRegdNo
                              )}
                            </TableCell>

                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              {editingId === data.id ? (
                                <TextField
                                  name="symbolNo"
                                  value={editData.symbolNo}
                                  onChange={handleEditChange}
                                  size="small"
                                />
                              ) : (
                                data?.symbolNo
                              )}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "left",
                              }}
                            >
                              {editingId === data.id ? (
                                <FormControl size='small' fullWidth>
                                  <InputLabel>Major Subject</InputLabel>
                                  <Select
                                    required
                                    InputLabelProps={{
                                      sx: {
                                        '& .MuiInputLabel-asterisk': {
                                          color: 'brown',
                                        },
                                      },
                                    }}
                                    variant='outlined'
                                    name="majorSubjectId"
                                    value={editData.majorSubjectId || ""}
                                    onChange={handleEditChange}
                                    label='Major subject'
                                    size="small"
                                  >
                                    <MenuItem value="">
                                      <em>None</em>
                                    </MenuItem>
                                    {
                                      majorSubs.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                          {item.majorSubjectName}
                                        </MenuItem>
                                      ))
                                    }
                                  </Select>
                                </FormControl>
                              ) : (
                                data.majorSubjectName || "Not assigned"
                              )}
                            </TableCell>
                            <TableCell
                              style={{
                                border: "1px solid #c2c2c2",
                                padding: "4px",
                                textAlign: "center",
                              }}
                            >
                              {editingId === data.id ? (
                                <>
                                  {loading ? (
                                    <CircularProgress size={24} />
                                  ) : (
                                    <div className="flex  gap-2">
                                      <Button
                                        color="primary"
                                        size="small"
                                        onClick={() => handleSave(data.id)}
                                        disabled={loading}
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        color="error"
                                        size="small"
                                        onClick={handleCancel}
                                        disabled={loading}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <Button
                                  variant="outlined"
                                  onClick={() => handleEditClick(data)}
                                  disabled={loading}
                                  size="small"
                                >
                                  Edit
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow >
                            <TableCell colSpan='25'>
                              <h1 className="text-lg font-medium text-red-700 text-center">No student data found</h1>
                            </TableCell>
                          </TableRow>
                        )
                    }
                  </TableBody>
                </Table>
              </TableContainer>
              {
                studentData.length > 0 && (
                  <div className="flex items-center justify-end h-16 ">
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
                        >
                          <MenuItem value="25">
                            <em>rows per page</em>
                          </MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={100}>100</MenuItem>
                          <MenuItem value={150}>150</MenuItem>
                          <MenuItem value={200}>200</MenuItem>
                          <MenuItem value={250}>250</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Pagination
                      sx={{ ml: "40px" }}
                      count={totalStudents}
                      page={page}
                      shape="rounded"
                      onChange={handlePageChange}
                    />
                  </div>
                )
              }
            </>
          )}
          {!filtersApplied && (
            <h1 className="text-red-500 text-xl font-medium">
              Please select Batch, Program, and {programType === "semester" ? "Semester" : programType === "annual" ? "Year" : "Semester/Year"} to load students
            </h1>

          )}
        </div>
      )}
    </>
  );
};
export default StudentUpdateRollNo;
