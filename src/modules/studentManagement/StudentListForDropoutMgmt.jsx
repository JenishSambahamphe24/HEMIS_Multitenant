
import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TableContainer,
  Table,
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
import Dialog from "@mui/material/Dialog";
import DropoutManagement from "./dropoutManagement";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import { useNavigate } from "react-router-dom";
import { getPaginatedVerifiedStudents } from "../../components/dashboard/services/service";
import { getBatch } from "../../services/services";
import { getProgramByCollegeId } from "../../services/services";
import { useSelector } from "react-redux";

const StudentListForDropout = ({ value }) => {
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser.institution.id;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(0);
  const [batchId, setBatchId] = useState("");
  const [programId, setProgramId] = useState("");
  const [allPrograms, setAllPrograms] = useState([]);
  const [allBatch, setAllBatch] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(50);
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1)
  }

  useEffect(() => {
    const fetchFilterParams = async () => {
      const batchResponse = await getBatch();
      const programResponse = await getProgramByCollegeId(collegeId);
      setAllBatch(batchResponse);
      setAllPrograms(programResponse);
    };
    fetchFilterParams();
  }, []);

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

  const fetchData = async () => {
    setLoading(true)
    try {
      const verifiedStudents = await getPaginatedVerifiedStudents({
        page,
        pageSize: rowsPerPage,
        batchId,
        programId,
        name: debouncedSearchTerm,
      });
      setTotalStudents(verifiedStudents.totalPages);
      setStudentData(verifiedStudents.students)
    } catch (err) {
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, batchId, programId, debouncedSearchTerm, rowsPerPage]);


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleClickOpen = (data) => {
    setSelectedStudent(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            style={{ marginBottom: "15px" }}
          >
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

            <Grid item xs={12} sm={6} md={7.5}>
              <Typography
                variant="h6"
                style={{ color: blue[700] }}
                textAlign="center"
              >
                You can manage dropout records from this page
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={1.5}>
              <Button
                variant="contained"
                onClick={() => navigate("/dropout-management/dropout-list")}
                style={{ color: "white" }}
                size="small"
                startIcon={<FormatListNumberedRtlIcon />}
              >
                Dropout List
              </Button>
            </Grid>
          </Grid>
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
                            onChange={(e) => setProgramId(e.target.value)}
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
                {studentData.length > 0 && studentData.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      {`${data.firstName ? data.firstName : ""} ${data.middleName ? data.middleName : ""
                        } ${data.lastName ? data.lastName : ""}`}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      {data.gender ? capitalize(data.gender) : ""}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      {data.phoneNumber}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      {data.admissionYear ? data.admissionYear : ""}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      {data.year
                        ? `${data.year} year`
                        : `${data.semester} semester`}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      {data.rollNoManual}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      {data.levelName}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      {data.facultyName}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "left",
                        padding: '2px'
                      }}
                    >
                      <Tooltip title={data.programName}>
                        {data.programShortName}
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        textAlign: "center",
                        padding: '2px'
                      }}
                    >
                      <Button size="small" onClick={() => handleClickOpen(data)}>
                        Dropout entry
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
          <Dialog
            open={open}
            onClose={handleClose}
            sx={{
              borderRadius: "14px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(4px)",
            }}
          >
            <DropoutManagement student={selectedStudent}  onClose={handleClose} />
          </Dialog>

          <div className="flex items-center justify-end h-16 " >
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
                  <MenuItem value="10"><em>rows per page</em></MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={150}>150</MenuItem>
                  <MenuItem value={200}>200</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Pagination
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

export default StudentListForDropout;