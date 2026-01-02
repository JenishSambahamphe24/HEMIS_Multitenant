import React, { useEffect, useState, useRef } from "react";
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
  DialogContent,
  capitalize,
  Chip,
  Menu,
  Tooltip,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";

import { useSelector } from "react-redux";

import { blue } from "@mui/material/colors";
import { LoadingOverlay } from "@mantine/core";
import { getProgramByCollegeId } from "../../services/services";
import { getBatch } from "../../services/services";
import EditScholarship from "./EditScholars";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import { config } from "@config";

const ScholarsList = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser.institution.id;
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [levelName, setlevelName] = useState("");
  const [filteredStudentData, setFilteredStudentData] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [batchId, setBatchId] = useState("");
  const [programId, setProgramId] = useState("");
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [semYear, setSemYear] = useState("");
  const [allBatch, setAllBatch] = useState([]);
  const [programType, setProgramType] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [fiscalYears, setFiscalYears] = useState([]);

  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Fixed state name - changed to openEditDialog for consistency
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

  const handleFiscalYearChange = (e) => {
    setFiscalYear(e.target.value);
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

      // Fetch fiscal years from API
      try {
        const config = getAuthConfigSafe();
        const fiscalYearResponse = await axios.get(
          `${backendUrl}/FiscalYear`,
          config
        );
        setFiscalYears(fiscalYearResponse.data || []);
      } catch (error) {
        console.error("Error fetching fiscal years:", error);
      }
    };
    fetchFilterParams();
  }, []);

  useEffect(() => {
    const filteredData =
      studentData &&
      studentData.filter((student) => {
        return (
          (selectedSemester === "" || student.semester === selectedSemester) &&
          (selectedYear === "" || student.year === selectedYear) &&
          (fiscalYear === "" || student.fiscalYearId === fiscalYear)
        );
      });

    setFilteredStudentData(filteredData);
  }, [selectedSemester, selectedYear, fiscalYear, studentData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = getAuthConfigSafe();
      // Add fiscalYearId to the API call
      const response = await axios.get(
        `${backendUrl}/Scholarship/filter?batchId=${batchId}&programId=${programId}&fiscalYearId=${fiscalYear}&page=${page}&pageSize=${rowsPerPage}`,
        config
      );

      // Set total students count (adjust based on your API response structure)
      setTotalStudents(response.data?.totalCount || 0);
      setStudentData(response.data?.scholarships || []);
    } catch (err) {
      console.error("Error fetching student data:", err);
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
    debouncedSearchTerm,
    rowsPerPage,
    semYear,
    fiscalYear,
  ]);

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
                List of Scholars Students{" "}
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
                            {allBatch &&
                              allBatch?.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.batchNepali}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4} md={2}>
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
                            {allPrograms?.map((item, index) => (
                              <MenuItem key={index} value={item.id}>
                                {item.programName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4} md={2}>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={fiscalYear}
                            onChange={handleFiscalYearChange}
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
                              <em>All Fiscal Years</em>
                            </MenuItem>
                            {fiscalYears.map((fiscalYear) => (
                              <MenuItem
                                key={fiscalYear.id}
                                value={fiscalYear.id}
                              >
                                {fiscalYear.yearNepali}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4} md={3}>
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
                    "Fiscal Year",
                    "Semester/Year",
                    "Roll No",
                    "Scholarship Type",
                    "Amount",
                    "Level",
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
                {filteredStudentData
                  ?.sort((a, b) => b.id - a.id)
                  .map((data, index) => (
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
                        {data?.studentName}
                      </TableCell>

                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data?.gender ? capitalize(data?.gender) : ""}
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
                        {data.batchNepali ? data.batchNepali : ""}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.yearNepali || ""}
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
                        {data?.scholarshipType}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.isAmount
                          ? `Rs ${data?.amount}`
                          : `${data?.percentage} %`}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.levelName}
                      </TableCell>

                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <Tooltip title={data.programName}>
                          <span>{data.programName}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          sx={{ fontSize: "12px" }}
                          onClick={() => handleOpenScholarshipDialog(data)}
                        >
                          Edit
                        </Button>
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
                  <MenuItem value={50}>
                    <em>rows per page</em>
                  </MenuItem>

                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={150}>150</MenuItem>
                  <MenuItem value={200}>200</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Pagination
              sx={{ ml: "40px" }}
              count={Math.ceil(totalStudents / rowsPerPage)}
              page={page}
              shape="rounded"
              onChange={handlePageChange}
            />
          </div>

          {/* Moved Dialog outside of the table container and fixed the open prop */}
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
            <EditScholarship
              open={openScholarshipDialog} // Added the open prop
              onClose={handleCloseScholarshipDialog}
              scholarship={selectedStudentId}
              onUpdate={handleUpdate}
            />
          </Dialog>
        </div>
      )}
    </>
  );
};

export default ScholarsList;
