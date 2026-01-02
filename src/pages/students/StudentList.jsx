import React, { useEffect, useState } from "react";
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
  InputAdornment,
  Typography,
  Dialog,
  DialogContent,
  FormControl,
  Select,
  MenuItem,
  Box,
  capitalize,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { getStudents } from "../../components/dashboard/services/service";
import EditStudentRegister from "../../components/studentRegistration/editStudent/EditStudentStepper";
import { useSelector } from "react-redux";

const StudentList = () => {
  const [studentData, setStudentData] = useState([]);
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedFiscalYear, setSelectedFiscalYearId] = useState("");
  const [levels, setLevels] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const rowsPerPage = 25;

  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;

  const fetchData = async () => {
    try {
      const response = await getStudents();
      setStudentData(response);
      const uniqueLevels = [
        ...new Set(
          response.map((student) => student.levelName).filter(Boolean)
        ),
      ];
      const uniqueFaculties = [
        ...new Set(
          response.map((student) => student.facultyName).filter(Boolean)
        ),
      ];
      const uniquePrograms = [
        ...new Set(
          response.map((student) => student.programName).filter(Boolean)
        ),
      ];
      const uniqueFiscalYear = [
        ...new Set(
          response.map((student) => student.fiscalYear).filter(Boolean)
        ),
      ];

      setFiscalYears(uniqueFiscalYear);
      setLevels(uniqueLevels);
      setFaculties(uniqueFaculties);
      setPrograms(uniquePrograms);
    } catch (err) {
      console.error("Error fetching student data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = studentData.filter((student) => {
      const firstName = student.firstName
        ? student.firstName.toLowerCase()
        : "";
      const lastName = student.lastName ? student.lastName.toLowerCase() : "";
      const rollNo = student.rollNo ? student.rollNo.toLowerCase() : "";
      const gender = student.gender ? student.gender.toLowerCase() : "";
      const registeredYear = student.admissionYear ? student.admissionYear : "";
      const semesterYear = student.semesterYear
        ? student.semesterYear.toLowerCase()
        : "";
      const faculty = student.program
        ? student.program.faculty.facultyName.toLowerCase()
        : "";
      const program = student.program
        ? student.program.programName.toLowerCase()
        : "";
      const district = student.district ? student.district.toLowerCase() : "";
      const searchTermLower = searchTerm.toLowerCase();

      return (
        (firstName.includes(searchTermLower) ||
          lastName.includes(searchTermLower) ||
          rollNo.includes(searchTermLower) ||
          gender.includes(searchTermLower) ||
          registeredYear.includes(searchTermLower) ||
          semesterYear.includes(searchTermLower) ||
          faculty.includes(searchTermLower) ||
          program.includes(searchTermLower) ||
          district.includes(searchTermLower)) &&
        (selectedLevel === "" ||
          student.program?.level.levelName === selectedLevel) &&
        (selectedFaculty === "" ||
          student.program?.faculty.facultyName === selectedFaculty) &&
        (selectedProgram === "" ||
          student.program?.programName === selectedProgram) &&
        (selectedFiscalYear === "" || student.fiscalYear === selectedFiscalYear)
      );
    });

    setFilteredStudentData(filteredData);
  }, [
    searchTerm,
    selectedLevel,
    selectedFaculty,
    selectedProgram,
    studentData,
    selectedFiscalYear,
  ]);

  const indexOfLastStudent = page * rowsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
  const currentStudents =
    filteredStudentData.length > 0
      ? filteredStudentData.slice(indexOfFirstStudent, indexOfLastStudent)
      : [];

  const handleClose = () => {
    setOpenEditDialog(false);
    fetchData();
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleUpdate = () => {
    fetchData();
  };

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          style={{ marginBottom: "15px" }}
        >
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
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" style={{ color: "#2b6eb5" }}>
              Student Enrollment List (Student-Registered)
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={2} style={{ textAlign: "right" }}>
            <Button
              component={Link}
              to="/student-management/student-register"
              variant="contained"
              color="primary"
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
              disabled
            >
              Add Student
            </Button>
          </Grid>
        </Grid>

        <TableContainer sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead style={{ backgroundColor: "#2A629A" }}>
              <TableRow>
                <TableCell colSpan={13} style={{ padding: 0 }}>
                  {/* Filter Row */}
                  <Grid container spacing={2} padding={1}>
                    <Grid item xs={12} sm={4} md={1.5}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={selectedFiscalYear}
                          onChange={(e) =>
                            setSelectedFiscalYearId(e.target.value)
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
                          <MenuItem value="">Select Fiscal Year</MenuItem>
                          {fiscalYears.map((years, index) => (
                            <MenuItem key={index} value={years}>
                              {years}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={1.5}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={selectedLevel}
                          onChange={(e) => setSelectedLevel(e.target.value)}
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
                          <MenuItem value="">Select Level</MenuItem>
                          {levels.map((level, index) => (
                            <MenuItem key={index} value={level}>
                              {level}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={1.5}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={selectedFaculty}
                          onChange={(e) => setSelectedFaculty(e.target.value)}
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
                          <MenuItem value="">Select Faculty</MenuItem>
                          {faculties.map((faculty, index) => (
                            <MenuItem key={index} value={faculty}>
                              {faculty}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={1.5}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={selectedProgram}
                          onChange={(e) => setSelectedProgram(e.target.value)}
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
                          <MenuItem value="">Select Program</MenuItem>
                          {programs.map((program, index) => (
                            <MenuItem key={index} value={program}>
                              {program}
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
                  "Fiscal Year",
                  "Batch Year",
                  "Level",
                  "Faculty",
                  "Program",
                  "District",
                  "Status",
                  "Actions", // Last column header
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
              {currentStudents.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "left",
                    }}
                  >
                    {indexOfFirstStudent + index + 1}
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
                    {data.fiscalYear ? data.fiscalYear : ""}
                  </TableCell>

                  <TableCell
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "left",
                    }}
                  >
                    {data.admissionYear ? data.admissionYear : ""}
                  </TableCell>
                  {/* <TableCell
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      height: "24px",
                      textAlign: "left",
                    }}
                  >
                    {data.program ? data.program.programType : ""}
                  </TableCell> */}

                  {/* <TableCell
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      height: "24px",
                      textAlign: "left",
                    }}
                  >
                    {data.rollNo}
                  </TableCell> */}
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
                    {data.facultyName}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "left",
                    }}
                  >
                    {data.programName}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "left",
                    }}
                  >
                    {data.pDistrict ? data.pDistrict : ""}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {data.isVerified ? (
                      ""
                    ) : (
                      <Chip label="Unverified" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "center",
                      // display:"flex"
                    }}
                  >
                    {/* <Button
                      onClick={() => handleEditClick(data.id)}
                      variant="outlined"
                      size="small"
                      style={{
                        fontSize: "10px",
                        textTransform: "capitalize",
                      }}
                
                    >
                      Edit
                    </Button> */}

                    <Button
                      component={Link}
                      to={`/student-management/student-verification/${data.id}`}
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#1976d2",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#1565c0",
                        },
                        borderRadius: 2,
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
          <Pagination
            count={Math.ceil(filteredStudentData.length / rowsPerPage)}
            page={page}
            shape="rounded"
            onChange={handlePageChange}
          />
        </Grid>

        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="lg"
        >
          <DialogContent>
            <EditStudentRegister
              id={selectedStudent}
              setOpenEditDialog={setOpenEditDialog}
              onClose={() => setOpenEditDialog(false)}
              onUpdate={handleUpdate}
              handleClose={handleClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default StudentList;
