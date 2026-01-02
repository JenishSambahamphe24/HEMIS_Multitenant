import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Select,
  FormControl,
  Tooltip,
  Box,
  MenuItem,
  Typography,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { getAllViewMarksForASubjectByExam } from "../../components/dashboard/services/service";
import toast from "react-hot-toast";

export default function ViewMarksList() {
  const { id } = useParams(); 

  const [moduleData, setModuleData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce search term
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  const fetchExamAppearData = async () => {
    if (!id) {
      toast.error("Subject exam schedule ID is missing");
      return;
    }
    setLoading(true);
    try {
      const response = await getAllViewMarksForASubjectByExam({
        examscheduleId: id,
        page,
        pageSize: rowsPerPage,
        name: debouncedSearchTerm
      });
      if (response && Array.isArray(response.data)) {
        setModuleData(response.data);
        setTotalRecords(response.totalRecords || response.data.length);
        setTotalPages(Math.ceil(response.totalRecords / rowsPerPage));
      } else {
        setModuleData([]);
        setTotalRecords(0);
        setTotalPages(0);
        toast.info("No data found.");
      }
    } catch (err) {
      console.error("Error fetching exam appear data:", err);
      setModuleData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExamAppearData();
  }, [id, page, rowsPerPage, debouncedSearchTerm]);

  return (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" textAlign="center">
          Entered Marks
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          placeholder="Search by student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TableContainer>
          <Table
            style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
          >
            <TableHead style={{ backgroundColor: "#2A629A" }}>
              <TableRow>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  rowSpan={2}
                >
                  S.No
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  rowSpan={2}
                >
                  Student Name
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  rowSpan={2}
                >
                  Roll No
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  rowSpan={2}
                >
                  Subject Name
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  rowSpan={2}
                >
                  Exam Name
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  rowSpan={2}
                >
                  Program
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  rowSpan={2}
                >
                  Semester/Year
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  align="center"
                  colSpan={3}
                >
                  Theoretical
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  align="center"
                  colSpan={3}
                >
                  Practical
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  rowSpan={2}
                >
                  Total Score
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  rowSpan={2}
                >
                  Remarks
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  align="center"
                >
                  Full Marks
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  align="center"
                >
                  Pass Marks
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  align="center"
                >
                  Obtained Marks
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  align="center"
                >
                  Full Marks
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  align="center"
                >
                  Pass Marks
                </TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  align="center"
                >
                  Obtained Marks
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: "white" }}>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : moduleData.length > 0 ? (
                moduleData.map((data, index) => {
                  const totalScore =
                    (data.theoreticalMarks || 0) +
                    (data.practicalMarks || 0);
                  const theoreticalPassed =
                    (data.theoreticalMarks || 0) >=
                    (data.theoriticalPassMark || 0);
                  const practicalPassed =
                    (data.practicalMarks || 0) >=
                    (data.practicalPassMark || 0);
                  const overallPassed = theoreticalPassed && practicalPassed;

                  return (
                    <TableRow key={data.id || index}>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {(page - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {data?.firstName || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {data?.rollNo || ""}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {data?.subjectName || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {data?.examName || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        <Tooltip
                          title={`${data?.programName || "N/A"} (${data?.programType || "N/A"
                            })`}
                          arrow
                        >
                          <span>{data?.programName || "N/A"}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {data?.semester
                          ? `${data?.semester} Semester`
                          : `${data?.year} Year`}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {data.theoriticalFullMark || "-"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {data.theoriticalPassMark || "-"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          backgroundColor: theoreticalPassed
                            ? "#e8f5e8"
                            : "#ffe8e8",
                        }}
                      >
                        {data.theoreticalMarks || "-"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {data.practicalFullMark || "-"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {data.practicalPassMark || "-"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          backgroundColor: practicalPassed
                            ? "#e8f5e8"
                            : "#ffe8e8",
                        }}
                      >
                        {data.practicalMarks || "-"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          fontWeight: "bold",
                          backgroundColor: overallPassed
                            ? "#e8f5e8"
                            : "#ffe8e8",
                        }}
                      >
                        {totalScore}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        <span
                          style={{
                            color:
                              data.theoreticalMarks >=
                                data.theoriticalPassMark
                                ? "green"
                                : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {data?.remarks ||
                            (data.theoreticalMarks >=
                              data.theoriticalPassMark
                              ? "PASS"
                              : "FAIL")}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
 
        <Box  width='100%'  display='flex' justifyContent='flex-end'>
          <FormControl size="small">
            <Select
              variant="standard"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              <MenuItem value={25}>25 rows</MenuItem>
              <MenuItem value={50}>50 rows</MenuItem>
              <MenuItem value={100}>100 rows</MenuItem>
              <MenuItem value={150}>150 rows</MenuItem>
              <MenuItem value={200}>200 rows</MenuItem>
            </Select>
          </FormControl>
        <Pagination
          count={totalPages}
          page={page}
          shape="rounded"
          onChange={handleChangePage}
          showFirstButton
          showLastButton
          disabled={loading}
        />
        </Box>

    </Grid>
  );
}

