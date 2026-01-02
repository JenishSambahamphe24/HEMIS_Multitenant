import { useEffect, useState, useRef } from "react";
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
  MenuItem,
  FormControl,
  Dialog,
  DialogContent,
  Menu,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExportStudentInfo from "./ExportStudentInfo";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaginatedVerifiedStudents } from "../../components/dashboard/services/service";
import EditStudentRegister from "../../components/studentRegistration/editStudent/EditStudentStepper";
import { useSelector } from "react-redux";
import { styled, alpha } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import { LoadingOverlay } from "@mantine/core";
import { getProgramByCollegeId } from "../../services/services";
import { getBatch } from "../../services/services";
import { getDateOnly } from "../../utils/dateUtils";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    backgroundColor: "white",
    border: "1px solid #c2c2c2",
    color: "rgb(55, 65, 81)",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

// Custom debounce hook
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

const VerifiedStudentList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser.institution.id;

  const [menuDialog, setMenuDialog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [levelName, setlevelName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [admissionYearId, setAdmissionYearId] = useState(""); // CHANGED: batchId → admissionYearId
  const [programId, setProgramId] = useState("");
  const [semYear, setSemYear] = useState("");
  const [programType, setProgramType] = useState("");
  const [page, setPage] = useState(1);
  const exportRef = useRef();

  const debouncedSearchTerm = useDebounce(searchTerm, 1200);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  const { data: allBatch = [] } = useQuery({
    queryKey: ["batch"],
    queryFn: getBatch,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 2,
  });

  const { data: allPrograms = [] } = useQuery({
    queryKey: ["programs", collegeId],
    queryFn: () => getProgramByCollegeId(collegeId),
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 2,
  });

  const {
    data: studentResponse = { students: [], totalPages: 0 },
    isLoading: loading,
    error,
    isFetching,
  } = useQuery({
    queryKey: [
      "verifiedStudents",
      page,
      rowsPerPage,
      admissionYearId,
      programId,
      debouncedSearchTerm,
      semYear,
    ],
    queryFn: () =>
      getPaginatedVerifiedStudents({
        page,
        pageSize: rowsPerPage,
        admissionYearId,
        programId,
        name: debouncedSearchTerm,
        semYear: semYear,
      }),
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 2,
    keepPreviousData: true,
  });

  const { students: studentData = [], totalPages: totalStudents = 0 } = studentResponse || {};
  const menuOpen = Boolean(menuDialog);

  const handleMenuDialogClick = (event, id) => {
    setMenuDialog(event.currentTarget);
    setSelectedStudentId(id);
  };

  const handleSemChange = (e) => {
    setSemYear(e.target.value);
    setPage(1);
  };

  const handleYearChange = (e) => {
    setSemYear(e.target.value);
    setPage(1);
  };

  const menuDialogClose = () => {
    setMenuDialog(null);
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
    setPage(1);
  };

  const handleAdmissionYearChange = (e) => {
    setAdmissionYearId(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleUpdate = () => {
    queryClient.invalidateQueries(["verifiedStudents"]);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditClick = () => {
    setOpenEditDialog(true);
    setMenuDialog(null);
  };

  const handleClose = () => {
    queryClient.invalidateQueries(["verifiedStudents"]);
  };

  if (error) {
    console.error("Error fetching student data:", error);
  }
  console.log("Student Data:", studentData);

  return (
    <>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <h1 className="text-lg font-medium text-[#2b6eb5]">
          Successfully Enrolled Students
        </h1>
      </Grid>
      {loading || isFetching ? (
        <LoadingOverlay
          visible={loading || isFetching}
          zIndex={3000}
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
            <Grid item xs={6} sm={4} md={3}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by Students..."
                value={searchTerm}
                sx={{ bgcolor: "whitesmoke" }}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
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
            <Grid item xs={6} sm={5} md={4} style={{ textAlign: "right" }}>
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
              >
                Add Student
              </Button>
            </Grid>
          </Grid>
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  <TableCell colSpan={15} style={{ padding: 0 }}>
                    <Grid container spacing={2} padding={1}>
                      {/* Admission Year Filter - UPDATED */}
                      <Grid item xs={6} sm={4} md={3}>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={admissionYearId} // CHANGED: batchId → admissionYearId
                            onChange={handleAdmissionYearChange} // CHANGED: handleBatchChange → handleAdmissionYearChange
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
                              <em>All Admission Years</em>
                            </MenuItem>
                            {allBatch.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.batchNepali}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={6} sm={4} md={3}>
                        <FormControl size="small" fullWidth>
                          <Select
                            labelId="program-select-label"
                            value={programId}
                            onChange={handleProgramIdChange}
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
                      
                      <Grid item xs={6} sm={4} md={3}>
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
                    "DOB(BS)",
                    "Ethnicity",
                    "Admission Year", // Updated header
                    "Semester/Year",
                    "Roll No",
                    "Uni Reg. No.",
                    "Phone No.",
                    "Faculty",
                    "Program",
                    "Program major",
                    "Section",
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
                      <h1 className="text-sm font-medium">{header}</h1>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ bgcolor: "white" }}>
                {studentData && studentData.length > 0 ? (
                  studentData.map((data, index) => (
                    <TableRow key={data.id}>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs font-medium">
                          {(page - 1) * rowsPerPage + index + 1}
                        </h1>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs ">
                          {`${data.firstName ? data.firstName : ""} ${data.middleName ? data.middleName : ""
                            } ${data.lastName ? data.lastName : ""}`}
                        </h1>
                      </TableCell>

                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.doBBS.split("T")[0]}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs tracking-tight">
                          {data.ethnicity}
                        </h1>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs tracking-tight">
                          {data.admissionYear} {/* Updated */}
                        </h1>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs tracking-tight">
                          {data.year
                            ? `${data.year} year`
                            : `${data.semester} semester`}
                        </h1>
                      </TableCell>

                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs tracking-tight">
                          {data?.rollNoManual}
                        </h1>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs tracking-tight">
                          {data?.universityRegdNo}
                        </h1>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs tracking-tight">
                          {data.phoneNumber}
                        </h1>
                      </TableCell>

                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs tracking-tight">
                          {data.facultyName}
                        </h1>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <Tooltip title={data.programName}>
                          <h1 className="text-xs tracking-tight">
                            {data.programShortName}
                          </h1>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs tracking-tight">
                          {data.majorSubjectName}
                        </h1>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <h1 className="text-xs tracking-tight">
                          {data.section}
                        </h1>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        <div>
                          <IconButton
                            onClick={(event) =>
                              handleMenuDialogClick(event, data.id)
                            }
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <StyledMenu
                            anchorEl={menuDialog}
                            open={menuOpen}
                            onClose={menuDialogClose}
                          >
                            <MenuItem
                              onClick={() => handleEditClick()}
                              disableRipple
                            >
                              <EditIcon />
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                navigate(
                                  `/student-management/registration-form/${selectedStudentId}`
                                )
                              }
                              disableRipple
                            >
                              <ArchiveIcon />
                              Download form
                            </MenuItem>

                            <Link
                              to={`/student-management/documents/${selectedStudentId}`}
                            >
                              <MenuItem disableRipple>
                                <DescriptionIcon />
                                File (Upload/ View)
                              </MenuItem>
                            </Link>
                          </StyledMenu>
                        </div>
                        {selectedStudentId && (
                          <div style={{ display: "none" }}>
                            <ExportStudentInfo
                              ref={exportRef}
                              id={selectedStudentId}
                            />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={14} style={{ textAlign: "center", padding: "20px" }}>
                      <Typography variant="body2" color="textSecondary">
                        No students found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
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
                  <MenuItem value={50}>50 per page</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={200}>200</MenuItem>
                  <MenuItem value={300}>300</MenuItem>
                  <MenuItem value={400}>400</MenuItem>
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
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};
export default VerifiedStudentList;
