import { useEffect, useState } from "react";
import {
  Button,
  TableContainer,
  Table,
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Grid,
  InputAdornment,
  Typography,
  Select,
  MenuItem,
  FormControl,
  capitalize,
  Tooltip,
} from "@mui/material";
import { LoadingOverlay } from "@mantine/core";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllApearedStudents } from "../../components/dashboard/services/service";
import { getBatch, getProgramByCollegeId } from "../../services/services";

const StudentListForResults = ({ value }) => {
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser.institution.id;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [batchId, setBatchId] = useState("");
  const [programId, setProgramId] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [allPrograms, setAllPrograms] = useState([]);
  const [allBatch, setAllBatch] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

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

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handleExport = (id) => {
    navigate(`/exam-management/student-all-results/${id}`);
  };

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllApearedStudents({
        page,
        programId: programId || undefined,
        batchId: batchId || undefined,
        semester: semester || undefined,
        year: year || undefined,
        pageSize: rowsPerPage,
        name: debouncedSearchTerm || undefined,
      });

      const totalRecords = response.totalRecords || 0;
      const totalPagesCalculated = Math.ceil(totalRecords / rowsPerPage);

      setTotalPages(totalPagesCalculated);
      setTotalStudents(totalRecords);
      setStudentData(response.data || []);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setStudentData([]);
      setTotalPages(0);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    batchId,
    programId,
    semester,
    year,
    rowsPerPage,
    debouncedSearchTerm,
  ]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (filterType, value) => {
    setPage(1);
    switch (filterType) {
      case "batch":
        setBatchId(value);
        break;
      case "program":
        setProgramId(value);
        break;
      case "semester":
        setSemester(value);
        break;
      case "year":
        setYear(value);
        break;
      default:
        break;
    }
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
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Grid item xs={12} sm={6} md={10}>
            <Typography
              variant="h6"
              style={{ color: blue[700] }}
              textAlign="center"
            >
              Generate Student Results
            </Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            style={{ marginBottom: "15px" }}
          >
            <Grid item xs={6} sm={4} md={3}>
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
          </Grid>

          {/* Table */}
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  <TableCell colSpan={13} style={{ padding: 0 }}>
                    <Grid container spacing={2} padding={1}>
                      <Grid item xs={12} sm={4} md={1.5}>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={batchId}
                            onChange={(e) =>
                              handleFilterChange("batch", e.target.value)
                            }
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
                            <MenuItem value="">
                              <em>All Batch</em>
                            </MenuItem>
                            {allBatch.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.batchNepali}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4} md={3}>
                        <FormControl size="small" fullWidth variant="outlined">
                          <Select
                            labelId="program-select-label"
                            value={programId}
                            onChange={(e) =>
                              handleFilterChange("program", e.target.value)
                            }
                            displayEmpty
                            sx={{
                              backgroundColor: "whitesmoke",
                              borderColor: "lightgray",
                              borderRadius: 1,
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
                            <MenuItem value="">
                              <em>All Program</em>
                            </MenuItem>
                            {allPrograms.map((item, index) => (
                              <MenuItem key={index} value={item.id}>
                                {item.programName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {[
                    "S.No.",
                    "Full Name",
                    "Gender",
                    "Phone No.",
                    "Batch Year",
                    "Semester/Year",
                    "Roll No",
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
                        textAlign: "center",
                        width:
                          header === "S.No."
                            ? "2%"
                            : header === "Actions"
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
                {studentData.length > 0 ? (
                  studentData.map((data, index) => (
                    <TableRow key={data.id}>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {(page - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {`${data.fullName || ""} ${data.middleName || ""} ${
                          data.lastName || ""
                        }`.trim()}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {data.gender ? capitalize(data.gender) : ""}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {data.phoneNo || ""}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {data.batchYear || ""}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {data.year
                          ? `${data.year} year`
                          : data.semester
                          ? `${data.semester} semester`
                          : ""}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {data.rollNo || ""}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {data.levelName || ""}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {data.facultyName || ""}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        <Tooltip title={data.programName || ""}>
                          <span>{data.programShortName || ""}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "center",
                          padding: "2px",
                        }}
                      >
                        <Button onClick={() => handleExport(data.studentId)}>
                          Results
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#666",
                      }}
                    >
                      {debouncedSearchTerm
                        ? "No students found matching your search."
                        : "No students found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination & Rows per page selector */}
          <div className="flex items-center justify-end h-16">
            <Box>
              <FormControl size="small" fullWidth>
                <Select
                  variant="standard"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  <MenuItem value={50}>50 rows</MenuItem>
                  <MenuItem value={100}>100 rows</MenuItem>
                  <MenuItem value={150}>150 rows</MenuItem>
                  <MenuItem value={200}>200 rows</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Pagination
              count={totalPages}
              page={page}
              shape="rounded"
              onChange={handlePageChange}
              showFirstButton
              showLastButton
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StudentListForResults;
