import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; // view marks icon
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import { config } from "@config";

const headerCellStyle = {
  color: "#FFFFFF",
  border: "1px solid #ddd",
  padding: "4px",
  fontSize: 13,
  textAlign: "center",
};

const cellStyle = {
  border: "1px solid #ddd",
  padding: "6px 8px",
  fontSize: 13,
};

export default function MarksEntryList() {
  const backendUrl = config.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [moduleData, setModuleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueExamNames, setUniqueExamNames] = useState([]);
  const [allExamCache, setAllExamCache] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [examNameFilter, setExamNameFilter] = useState(
    searchParams.get("examFilter") || "All Exams"
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 0);
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(searchParams.get("rowsPerPage")) || 25
  );

  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  // Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event, rowData) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowData(rowData);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowData(null);
  };

  const updateURLParams = (newParams) => {
    const currentParams = Object.fromEntries(searchParams);
    const updatedParams = { ...currentParams, ...newParams };

    // normalize defaults so URLs stay clean
    if (updatedParams.examFilter === "" || updatedParams.examFilter === "All Exams")
      delete updatedParams.examFilter;
    if (String(updatedParams.page) === "0") delete updatedParams.page;
    if (String(updatedParams.rowsPerPage) === "25") delete updatedParams.rowsPerPage;

    setSearchParams(updatedParams);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    updateURLParams({ page: newPage.toString() });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    updateURLParams({ rowsPerPage: newRowsPerPage.toString(), page: "0" });
  };

  const handleExamFilterChange = (event, newValue) => {
    const value = newValue || "All Exams";
    setExamNameFilter(value);
    setPage(0);
    updateURLParams({ examFilter: value, page: "0" });
  };

  // Fetch exam names (cached)
  const fetchAllExamNames = async () => {
    try {
      const cfg = getAuthConfigSafe();
      const res = await axios.get(
        `${backendUrl}/SubjectExamSchedule/GetAllPaged?pageNumber=1&pageSize=500`,
        cfg
      );
      const data = res.data?.data || res.data?.items || res.data || [];
      const names = [...new Set(data.map((d) => d.examName).filter(Boolean))].sort();
      setUniqueExamNames(names);
    } catch (err) {
      console.error("Error fetching exam names:", err);
      setUniqueExamNames([]);
    }
  };

  // Fetch paged data
  const fetchData = async (pageNumber = 1, pageSize = 25, examFilter = "All Exams") => {
    setLoading(true);
    try {
      const cfg = getAuthConfigSafe();

      // When no exam filter, use server pagination
      if (!examFilter || examFilter === "All Exams") {
        const url = `${backendUrl}/SubjectExamSchedule/GetAllPaged?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        const res = await axios.get(url, cfg);
        const data = res.data?.data || res.data?.items || res.data || [];
        const total =
          res.data?.totalRecords || res.data?.totalCount || res.data?.total || data.length || 0;

        setModuleData(data);
        setFilteredData(data);
        setTotalRecords(total);
      } else {
        // If filter is applied, fetch cached 'all' once (up to reasonable limit) and then slice
        if (!allExamCache) {
          const resAll = await axios.get(
            `${backendUrl}/SubjectExamSchedule/GetAllPaged?pageNumber=1&pageSize=1000`,
            cfg
          );
          const allData = resAll.data?.data || resAll.data?.items || resAll.data || [];
          setAllExamCache(allData);
        }
        const all = allExamCache ?? (await (async () => {
          const resAll = await axios.get(
            `${backendUrl}/SubjectExamSchedule/GetAllPaged?pageNumber=1&pageSize=1000`,
            cfg
          );
          return resAll.data?.data || resAll.data?.items || resAll.data || [];
        })());

        const filteredAll = all.filter((item) => item.examName === examFilter);
        const start = (pageNumber - 1) * pageSize;
        const sliced = filteredAll.slice(start, start + pageSize);

        setModuleData(sliced);
        setFilteredData(sliced);
        setTotalRecords(filteredAll.length);
      }
    } catch (err) {
      console.error("API Error:", err);
      setModuleData([]);
      setFilteredData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // initial loads
  useEffect(() => {
    fetchAllExamNames();
    // fetch first page (page state is zero-based)
    fetchData(page + 1, rowsPerPage, examNameFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // fetch when page / rows / filter changes
  useEffect(() => {
    fetchData(page + 1, rowsPerPage, examNameFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, examNameFilter]);

  // keep filteredData and moduleData in sync (moduleData already set by fetchData)
  useEffect(() => {
    // moduleData already contains appropriate slice, but keep filteredData for memoization
    setFilteredData(moduleData);
  }, [moduleData]);

  const paginatedData = useMemo(() => {
    // moduleData is already paged by server/slice logic, but in case it's full list, ensure client pagination works:
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleMenuMarksEntry = () => {
    if (!selectedRowData) return handleMenuClose();
    navigate(`/exam-management/marks-entry/${selectedRowData.id}`);
    handleMenuClose();
  };

  const handleMenuViewMarks = () => {
    if (!selectedRowData) return handleMenuClose();
    navigate(`/exam-management/marks-list/${selectedRowData.id}`);
    handleMenuClose();
  };

  // render
  return (
    <>
      {loading ? (
        <Grid container alignItems="center" justifyContent="center" padding={3}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Grid container alignItems="center" justifyContent="space-between" padding={1}>
            <Grid item xs>
              <Typography variant="body1" color={blue[700]} textAlign="center">
                These are the List Exams For Marks Entry
              </Typography>
            </Grid>
          </Grid>

          <Box className="flex flex-row gap-2 mb-2" sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ width: { xs: "220px", md: "280px" } }}>
              <Autocomplete
                size="small"
                options={["All Exams", ...uniqueExamNames]}
                value={examNameFilter || "All Exams"}
                onChange={(e, newValue) => handleExamFilterChange(e, newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Filter by Exam Name" variant="outlined" />
                )}
                isOptionEqualToValue={(option, value) => option === value}
                sx={{ width: "100%" }}
              />
            </Box>
          </Box>

          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <TableContainer sx={{ borderRadius: 2 }}>
                <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
                  <TableHead style={{ backgroundColor: "#2A629A" }}>
                    <TableRow>
                      <TableCell rowSpan={2} style={headerCellStyle}>
                        S.No
                      </TableCell>
                      <TableCell rowSpan={2} style={headerCellStyle}>
                        Exam Name
                      </TableCell>
                      <TableCell rowSpan={2} style={headerCellStyle}>
                        Subject Name
                      </TableCell>
                      <TableCell rowSpan={2} style={headerCellStyle}>
                        Type
                      </TableCell>
                      <TableCell rowSpan={2} style={headerCellStyle}>
                        Date
                      </TableCell>
                      <TableCell rowSpan={2} style={headerCellStyle}>
                        Time
                      </TableCell>
                      <TableCell colSpan={2} align="center" style={headerCellStyle}>
                        Theory
                      </TableCell>
                      <TableCell colSpan={2} align="center" style={headerCellStyle}>
                        Practical
                      </TableCell>
                      <TableCell rowSpan={2} style={headerCellStyle}>
                        Status
                      </TableCell>
                      <TableCell rowSpan={2} style={headerCellStyle}>
                        Action
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell style={headerCellStyle} align="center">
                        Full Marks
                      </TableCell>
                      <TableCell style={headerCellStyle} align="center">
                        Pass Marks
                      </TableCell>
                      <TableCell style={headerCellStyle} align="center">
                        Full Marks
                      </TableCell>
                      <TableCell style={headerCellStyle} align="center">
                        Pass Marks
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody sx={{ bgcolor: "white" }}>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((d, idx) => {
                        const today = new Date();
                        const startDate = d?.examDate ? new Date(d.examDate) : null;

                        let status = "Not Scheduled";
                        if (startDate) {
                          if (today < startDate) status = "Active";
                          else if (today.toDateString() === startDate.toDateString()) status = "Running";
                          else status = "Finished";
                        }

                        const serialNumber = page * rowsPerPage + idx + 1;

                        return (
                          <TableRow key={d.id || idx}>
                            <TableCell style={cellStyle}>{serialNumber}</TableCell>
                            <TableCell style={cellStyle}>{d?.examName || "N/A"}</TableCell>
                            <TableCell style={cellStyle}>{d?.subjectName || "N/A"}</TableCell>
                            <TableCell style={cellStyle}>
                              {d?.isTheoretical && d?.isPractical ? (
                                <Tooltip title="Theoretical, Practical" arrow>
                                  <span>Th, Pr</span>
                                </Tooltip>
                              ) : d?.isTheoretical ? (
                                <Tooltip title="Theoretical" arrow>
                                  <span>Th</span>
                                </Tooltip>
                              ) : d?.isPractical ? (
                                <Tooltip title="Practical" arrow>
                                  <span>Pr</span>
                                </Tooltip>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {d?.examDate ? d.examDate.slice(0, 10) : "N/A"}
                            </TableCell>
                            <TableCell style={cellStyle}>{d?.examTime || "N/A"}</TableCell>
                            <TableCell style={cellStyle}>{d?.theoreticalFullMarks ?? 0}</TableCell>
                            <TableCell style={cellStyle}>{d?.theoreticalPassMarks ?? 0}</TableCell>
                            <TableCell style={cellStyle}>{d?.practicalFullMark ?? 0}</TableCell>
                            <TableCell style={cellStyle}>{d?.practicalPassMark ?? 0}</TableCell>
                            <TableCell style={cellStyle}>
                              <span
                                style={{
                                  color: status === "Active" ? "green" : status === "Running" ? "orange" : "gray",
                                  fontWeight: 600,
                                }}
                              >
                                {status}
                              </span>
                            </TableCell>
                            <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuClick(e, d)}
                                sx={{
                                  color: "#1976d2",
                                  "&:hover": { backgroundColor: "rgba(25,118,210,0.08)" },
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} align="center" style={cellStyle}>
                          {examNameFilter && examNameFilter !== "All Exams"
                            ? `No data found for exam: ${examNameFilter}`
                            : "No data available"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ elevation: 3, sx: { minWidth: 180 } }}
          >
            <MenuItem onClick={handleMenuMarksEntry}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Marks Entry</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleMenuViewMarks}>
              <ListItemIcon>
                <AssignmentTurnedInIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Marks</ListItemText>
            </MenuItem>
          </Menu>

          <TablePagination
            rowsPerPageOptions={[25, 50, 75]}
            component="div"
            count={totalRecords}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        </>
      )}
    </>
  );
}
