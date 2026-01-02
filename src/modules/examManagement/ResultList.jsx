

import {
  Button,
  capitalize,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { blue } from "@mui/material/colors";
import axios from "axios";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import { config } from "@config"


export default function ResultList() {
  const backendUrl = config.VITE_BACKEND_URL;
  const [moduleData, setModuleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [programOptions, setProgramOptions] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL params
  const resultType = searchParams.get("resultType") || "individual";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlRowsPerPage = parseInt(searchParams.get("rowsPerPage") || "25", 10);
  const urlProgram = searchParams.get("program") || "";

  const [page, setPage] = useState(urlPage - 1); 
  const [rowsPerPage, setRowsPerPage] = useState(urlRowsPerPage);
  const [selectedProgram, setSelectedProgram] = useState(urlProgram);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/ExamSchedule?pageNumber=${urlPage}&pageSize=${urlRowsPerPage}${urlProgram ? `&programName=${encodeURIComponent(urlProgram)}` : ""
        }`,
        config
      );
      setModuleData(response.data.data);
      setTotalRecords(response.data.totalRecords);
      const programs = Array.from(
        new Set(response.data.data.map((item) => item.programName))
      );
      setProgramOptions(programs);
    } catch (err) {
      console.error("Error fetching exam schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("resultType", resultType);
    params.set("page", (page + 1).toString());
    params.set("rowsPerPage", rowsPerPage.toString());
    if (selectedProgram) params.set("program", selectedProgram);

    setSearchParams(params, { replace: true });

    fetchData();
  }, [page, rowsPerPage, selectedProgram, resultType, setSearchParams]);

  useEffect(() => {
    setPage(urlPage - 1);
    setRowsPerPage(urlRowsPerPage);
    setSelectedProgram(urlProgram);
  }, [urlPage, urlRowsPerPage, urlProgram]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);

  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProgramFilterChange = (event) => {
    const value = event.target.value;
    setSelectedProgram(value);
    setPage(0);
  };

  const filteredData = selectedProgram
    ? moduleData.filter((item) => item.programName === selectedProgram)
    : moduleData;
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Grid item xs>
          <Typography variant="h6" color={blue[700]} textAlign="center">
            Result For The Scheduled Exams
          </Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end" item xs={6} sm={4} md={3} mb={2}>
        <FormControl fullWidth size="small">
          <InputLabel id="program-filter-label">Filter by Program</InputLabel>
          <Select
            labelId="program-filter-label"
            value={selectedProgram}
            label="Filter by Program"
            onChange={handleProgramFilterChange}
          >
            <MenuItem value="">
              <em>All Programs</em>
            </MenuItem>
            {programOptions.map((program) => (
              <MenuItem key={program} value={program}>
                {program}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {loading ? (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <TableContainer sx={{ borderRadius: 2 }}>
              <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
                <TableHead style={{ backgroundColor: "#2A629A" }}>
                  <TableRow>
                    <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd", padding: "8px" }}>S.No</TableCell>
                    <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd", padding: "8px" }}>Program Name</TableCell>
                    <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd", padding: "8px" }}>Exam Type</TableCell>
                    <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd", padding: "8px" }}>Exam Name</TableCell>
                    <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd", padding: "8px" }}>Exam Start Date</TableCell>
                    <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd", padding: "8px" }}>Exam End Date</TableCell>
                    <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd", padding: "8px" }}>Description</TableCell>
                    <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd", padding: "8px" }}>Status</TableCell>
                    <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd", padding: "8px" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ bgcolor: "white" }}>
                  {filteredData.length > 0 ? (
                    filteredData.map((data, index) => {
                      const today = new Date();
                      const startDate = new Date(data.dateFromNepali);
                      const endDate = new Date(data.dateToNepali);
                      let status;
                      if (today < startDate) {
                        status = "Active";
                      } else if (today >= startDate && today <= endDate) {
                        status = "Running";
                      } else {
                        status = "Finished";
                      }

                      const oneWeekBeforeEndDate = new Date(endDate);
                      oneWeekBeforeEndDate.setDate(endDate.getDate() - 7);
                      const isNew = today >= oneWeekBeforeEndDate && today <= endDate;

                      return (
                        <TableRow key={data.id}>
                          <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {index + 1}
                            {isNew && (
                              <NewReleasesIcon sx={{ fontSize: 16, color: "red", marginLeft: 1 }} />
                            )}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {data?.programName}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {capitalize(data?.type || "")}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {data.examName}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {data?.dateFromNepali?.slice(0, 10)}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {data?.dateToNepali?.slice(0, 10)}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {data.description}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <span
                              style={{
                                color: status === "Active" ? "green" : status === "Running" ? "orange" : "gray",
                              }}
                            >
                              {status}
                            </span>
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #ddd",
                              padding: "4px",
                              display: "flex",
                              gap: "2px",
                            }}
                          >
                            {resultType === "individual" ? (
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                sx={{
                                  bgcolor: "#1976d2",
                                  color: "white",
                                  "&:hover": { bgcolor: "#1565c0" },
                                  borderRadius: 2,
                                  fontSize: "10px",
                                }}
                                onClick={() =>
                                  navigate(`/exam-management/view-result/${data.id}`)
                                }
                              >
                                Results
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                sx={{
                                  bgcolor: "#1976d2",
                                  color: "white",
                                  "&:hover": { bgcolor: "#1565c0" },
                                  borderRadius: 2,
                                  fontSize: "10px",
                                }}
                                onClick={() =>
                                  navigate(`/exam-management/view-all-result/${data.id}`)
                                }
                              >
                                View All Results
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center" style={{ padding: "20px", color: "#666" }}>
                        No results found for the selected criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[25, 50, 75, 100]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
    </>
  );
}


