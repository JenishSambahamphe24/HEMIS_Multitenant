import { useEffect, useState, useRef } from "react";
import EditStudentRegister from "../../../components/studentRegistration/editStudent/EditStudentStepper";
import {
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Box,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  FormControl,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { getMigratedPaginatedStudent } from "../../../components/dashboard/services/service";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import { getProgramByCollegeId } from "../../../services/services";
import { getBatch } from "../../../services/services";
import { getDateOnly } from "../../../utils/dateUtils";



const InFromOutsideSystemn = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser.institution.id;
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [levelName, setlevelName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [batchId, setBatchId] = useState("");
  const [programId, setProgramId] = useState("");
  const [allPrograms, setAllPrograms] = useState([]);
  const [semYear, setSemYear] = useState("");
  const [allBatch, setAllBatch] = useState([]);
  const [programType, setProgramType] = useState("");

  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handleSemChange = (e) => {
    setSelectedSemester(e.target.value);
    setSemYear(e.target.value);
  };

  const handleUpdate = () => {
    // queryClient.invalidateQueries(['verifiedStudents']);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSemYear(e.target.value);
  };
  const handleClose = () => {
    // queryClient.invalidateQueries(['verifiedStudents']);
    console.log('hello')
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

  const handleEditClick = (id) => {
    setSelectedStudentId(id)
    setOpenEditDialog(true);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const paginatedResponse = await getMigratedPaginatedStudent({
        page,
        pageSize: rowsPerPage,
        batchId,
        programId,
        semYear: semYear,
        isTransferredIn: true
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
    fetchData(page);
  }, [page, batchId, programId, rowsPerPage, semYear]);

  const handlePageChange = (event, value) => {
    setPage(value);
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
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginBottom: "15px" }}
          >
            <Grid display='flex' justifyContent='space-between' item xs={12} >
              <h1 className="text-2xl flex-1">
                 List of student transfer requests from other campus (outside HEMIS)
              </h1>

              <Link to='/student-management/student-transfer-in/register'>
                <Button
                  size="small"
                  variant="contained"
                >
                  Transfer-in Student
                </Button>
              </Link>
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
                        {programId != 0 && programType === "semester" && (
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
                        {programId != 0 && programType === "annual" && (
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
                    "Transferred from",
                    "Transferred date",
                    "Batch Year",
                    "Semester/Year",
                    "Level",
                    "Faculty",
                    "Program",
                    // "Status",
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
                      {data.transferredFrom}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {getDateOnly(data.transferredDate)}
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
                      <Tooltip title={data.programName}>
                        {data.programShortName}
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
                        size="small"
                        variant="outlined"
                        onClick={() => handleEditClick(data.id)}
                        color="secondary"
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
          <Dialog
            sx={{ padding: "0px" }}
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            maxWidth="lg"
          >
            <DialogContent sx={{ padding: "10px" }}>
              <EditStudentRegister
                id={selectedStudentId}
                setOpenEditDialog={setOpenEditDialog}
                handleEditDialogClose={handleEditDialogClose}
                onClose={() => setOpenEditDialog(false)}
                onUpdate={handleUpdate}
                handleClose={handleClose}
                isTransferredIn={true}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default InFromOutsideSystemn;
