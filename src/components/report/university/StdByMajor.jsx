import { useEffect, useState } from "react";
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
  Select,
  MenuItem,
  FormControl,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import { useQuery } from '@tanstack/react-query';
import { getAllProgramsWithMajorSubs, getStudentsByMajorSubs } from "../../dashboard/services/service";
import { LoadingOverlay } from "@mantine/core";
import { getBatch } from "../../../services/services";

const StdByMajor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelName, setlevelName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [batchId, setBatchId] = useState("");
  const [programId, setProgramId] = useState("");
  const [semYear, setSemYear] = useState("");
  const [programType, setProgramType] = useState("");

  const [majorSubId, setMajorSubId] = useState('')
  const [majorSubs, setMajorSubs] = useState([]);

  const [page, setPage] = useState(1);

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
  const { data: allBatch = [] } = useQuery({
    queryKey: ['batch'],
    queryFn: getBatch,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 2,
  });

  const { data: allPrograms = [] } = useQuery({
    queryKey: ['programs'],
    queryFn: () => getAllProgramsWithMajorSubs(),
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 2,
  });

  const {
    data: studentResponse = { students: [], totalPages: 0 },
    isLoading: loading,
    error
  } = useQuery({
    queryKey: [
      'verifiedStudents',
      page,
      rowsPerPage,
      batchId,
      programId,
      debouncedSearchTerm,
      semYear,
      majorSubId
    ],
    queryFn: () => getStudentsByMajorSubs({
      page,
      pageSize: rowsPerPage,
      batchId,
      programId,
      name: debouncedSearchTerm,
      semYear: semYear,
      majorSubId: majorSubId
    }),
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 2,
    keepPreviousData: true,
  });

  const { students: studentData, totalPages: totalStudents } = studentResponse;

  const handleSemChange = (e) => {
    setSemYear(e.target.value);
  };

  const handleYearChange = (e) => {
    setSemYear(e.target.value);
  };

  const handleMajorSubIdChange = (e) => {
    setMajorSubId(e.target.value);
  };

  const handleProgramIdChange = (e) => {
    const selectedId = e.target.value;
    setProgramId(selectedId);

    const program = allPrograms.find((prog) => prog.id === selectedId);
    if (program) {
      setProgramType(program.programType);
      setlevelName(program.levelName);

      setMajorSubs(program.majorSubjects || []);
    } else {
      setProgramType("");
      setlevelName("");
      setMajorSubs([]);
    }
    setMajorSubId("");
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (error) {
    console.error("Error fetching student data:", error);
  }
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
          <h1 className="text-2xl font-medium text-[#2b6eb5]" >Students By Major</h1>
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

                      {/* {majorSubs.length > 0 && ( */}
                      <Grid item xs={12} sm={4} md={3}>
                        <FormControl size="small" fullWidth variant="outlined">
                          <Select
                            value={majorSubId}
                            onChange={handleMajorSubIdChange}
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
                              <em>Major Subjects</em>
                            </MenuItem>
                            {majorSubs.map((item, index) => (
                              <MenuItem key={index} value={item.id}>
                                {item.majorSubjectName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      {/* )} */}

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
                    "Batch Year",
                    "Semester/Year",
                    "Roll No",
                    "Phone No.",
                    "Faculty",
                    "Program",
                    "Program major",
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
                      {data.phoneNumber}
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
                        textAlign: "left",
                      }}
                    >
                      {data.majorSubjectName}
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
        </div>
      )}
    </>
  );
};
export default StdByMajor;
