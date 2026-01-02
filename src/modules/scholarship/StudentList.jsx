import React, { useEffect, useState } from "react";
import {
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
  Typography,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  capitalize,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";

import {
  getPaginatedVerifiedStudents,
} from "../../components/dashboard/services/service";
import { useSelector } from "react-redux";
import { blue } from "@mui/material/colors";
import { LoadingOverlay } from "@mantine/core";
import { getProgramByCollegeId } from "../../services/services";
import { getBatch } from "../../services/services";
import AddScholarship from "./AddScholarship";

const StudentListForScholarship = () => {
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser.institution.id;
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [levelName, setlevelName] = useState("");
  const [filteredStudentData, setFilteredStudentData] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [batchId, setBatchId] = useState("");
  const [programId, setProgramId] = useState("");
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [semYear, setSemYear] = useState("");
  const [allBatch, setAllBatch] = useState([]);
  const [programType, setProgramType] = useState("");

  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [openScholarshipDialog, setOpenScholarshipDialog] = useState(false);
  
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
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
  const debouncedSearchTerm = useDebounce(searchTerm, 3000);

  const handleSemChange = (e) => {
    setSelectedSemester(e.target.value);
    setSemYear(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSemYear(e.target.value);
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
  };

  const handleOpenScholarshipDialog = (student) => {
    setSelectedStudentId(student);
    setOpenScholarshipDialog(true);
  };
  const handleCloseScholarshipDialog = () => {
    setOpenScholarshipDialog(false);
    setSelectedStudentId(null);
  };
  useEffect(() => {
    const fetchFilterParams = async () => {
      const batchResponse = await getBatch();
      const programResponse = await getProgramByCollegeId(collegeId);
      setAllBatch(batchResponse);
      setAllPrograms(programResponse);
    };
    fetchFilterParams();
  }, []);

  useEffect(() => {
    const filteredData =
      studentData &&
      studentData.filter((student) => {
        return (
          (selectedSemester === "" || student.semester === selectedSemester) &&
          (selectedYear === "" || student.year === selectedYear)
        );
      });

    setFilteredStudentData(filteredData);
  }, [selectedSemester, selectedYear, studentData]);

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, [page, batchId, programId, debouncedSearchTerm, rowsPerPage, semYear]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleUpdate = () => {
    fetchData();
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
          <Grid container alignItems="center" style={{ marginBottom: "15px" }}>
            <Grid item xs={12} sm={6} md={2.3}>
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
            <Grid item xs={12} sm={6} md={7.7}>
              <Typography
                variant="h6"
                style={{ color: blue[700], textAlign: "center", width: "100%" }}
              >
                Assign Scholarship/Discount for Students{" "}
              </Typography>
            </Grid>
          </Grid>
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  <TableCell colSpan={15} style={{ padding: 0 }}>
                    <Grid container spacing={2} padding={1}>
                      <Grid item xs={12} sm={4} md={1.5}>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
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
                            onChange={handleProgramIdChange}
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
                      <Grid item xs={12} sm={4} md={4}>
                        {programId !== "" && programType === "semester" && (
                          <FormControl size="small" fullWidth>
                            <Select
                              value={semYear}
                              onChange={handleSemChange}
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
                                <em> All Semesters</em>
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
                        {programId !== "" && programType === "annual" && (
                          <FormControl size="small" fullWidth>
                            <Select
                              value={semYear}
                              onChange={handleYearChange}
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
                                <em>All Year</em>
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
                    </Grid>
                  </TableCell>
                </TableRow>
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
                            ? "15%"
                            : "auto",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ bgcolor: "white" }}>
                {studentData.map((data, index) => (
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
                      {`${data.firstName ? data.firstName : ""} ${
                        data.middleName ? data.middleName : ""
                      } ${data.lastName ? data.lastName : ""}`}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.gender ? capitalize(data.gender) : ""}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.doBBS}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.ethnicity}
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
                      {data?.rollNoManual}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data?.universityRegdNo}
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
                        <span>{data.programShortName}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                    width='400px'
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "center",
                        // width:'400px'
                      }}
                    >
                      <Link
                       onClick={() => handleOpenScholarshipDialog(data)}
                      className="text-[#2B6EB5] text-[12px]"
                      >
                        Assign Scholarship/Discount
                      </Link>
                      {/* </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
                  <MenuItem value={25}>
                    <em>rows per page</em>
                  </MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={150}>150</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Dialog
              open={openScholarshipDialog}
              onClose={handleCloseScholarshipDialog}
              maxWidth="md"
              sx={{
                borderRadius: "14px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(4px)",
              }}
            >
              <AddScholarship
                student={selectedStudentId}
                onClose={handleCloseScholarshipDialog}
              />
            </Dialog>
            <Pagination
              sx={{ ml: "40px" }}
              count={totalStudents}
              page={page}
              shape="rounded"
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StudentListForScholarship;
