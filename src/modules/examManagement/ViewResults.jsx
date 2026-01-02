import {
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  InputLabel,
  Select,
  TableHead,
  TableRow,
  Typography,
  Box,
  FormControl,
  MenuItem,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import { blue } from "@mui/material/colors";
import { useNavigate, useParams } from "react-router-dom";
import {  getExamDataByExamId } from "../../components/dashboard/services/service";
import { getAllApearedStudents } from "../../components/dashboard/services/service";


export default function ViewResults() {
  const [page, setPage] = useState(1);
  const [moduleData, setModuleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(500);
  const navigate = useNavigate();
  const { id } = useParams();

  // Add state for exam data
  const [examData, setExamData] = useState(null);
  const [examLoading, setExamLoading] = useState(false);

  // Fetch exam data by ID
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setExamLoading(true);
        const response = await getExamDataByExamId(id);
        console.log(response);
        setExamData(response);
      } catch (err) {
        console.log(err);
      } finally {
        setExamLoading(false);
      }
    };

    if (id) {
      fetchExamData();
    }
  }, [id]);


  const fetchAppearedStudents = async () => {
    if (!examData) return;

    try {
      setLoading(true);
      const response = await getAllApearedStudents({
        batchId: examData.batchId,
        programId: examData.programMgmtId,
        page: page,
        limit: rowsPerPage,
      });
      setModuleData(response.data)
      setTotalStudents(response.data.totalRecords || 0);
    } catch (err) {
      console.error("Error fetching appeared students:", err);
      setModuleData([]);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examData) {
      fetchAppearedStudents();
    }
  }, [examData, page, rowsPerPage]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };
  
  return (
    <>
      {loading || examLoading ? (
        <Grid
          container
          justifyContent={"center"}
          alignItems="center"
          sx={{ mt: "auto", minHeight: "400px" }}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Grid container alignItems="center" mb={1} spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" color={blue[700]} textAlign="center">
                Appeared Students - Generate Exam Report Card
              </Typography>
            </Grid>
          </Grid>

          <Grid container >
            <h1 className="px-2 text-left text-md text-red-700"><span className="text-md font-medium text-red-700">Note: </span>This data only applies to students who appeared in the exam. Please manage attendance via the <span className="text-md font-medium text-[#2b6eb5]">Exam Attendance </span>  module </h1>
            <Grid item xs={12}>
              <TableContainer sx={{ borderRadius: 2 }}>
                <Table
                  style={{
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                  }}
                >
                  <TableHead style={{ backgroundColor: "#2A629A" }}>
                    <TableRow>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        S.No
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        Student Name
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        Roll No.
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        Student ID
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        Program Name
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        Batch
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        Semester/Year
                      </TableCell>

                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ bgcolor: "white" }}>
                    {moduleData.length > 0 ? (
                      moduleData.map((student, index) => (
                        <TableRow key={student.id || index}>
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
                            {student.fullName}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                            }}
                          >
                            {student.rollNo || 'N/A'}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                            }}
                          >
                            {student?.studentId || "N/A"}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                            }}
                          >
                            {student?.program || "N/A"}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                            }}
                          >
                            {student?.batchYear || "N/A"}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                            }}
                          >
                            {student?.year && student.year !== "0" && student.year !== ""
                              ? student.year
                              : (student?.semester && student.semester !== "0" && student.semester !== ""
                                ? student.semester
                                : "N/A"
                              )
                            }
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #ddd",
                              padding: "4px",
                              display: "flex",
                              gap: "2px",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              sx={{
                                bgcolor: "#1976d2",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "#1565c0",
                                },
                                borderRadius: 2,
                                fontSize: "10px",
                              }}
                              onClick={() =>
                                navigate(
                                  `/exam-management/report-card?examschedule=${id}&studentid=${student.studentId}`
                                )
                              }
                            >
                              Results
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            border: "1px solid #ddd",
                          }}
                        >
                          No appeared students found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </>
      )}
      <Box className="flex items-center justify-end h-16 mt-4">
        <Box sx={{ mr: 2 }}>
          <FormControl size="small">
            <Select
              variant="standard"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <MenuItem value={10}>10 rows</MenuItem>
              <MenuItem value={25}>25 rows</MenuItem>
              <MenuItem value={50}>50 rows</MenuItem>
              <MenuItem value={100}>100 rows</MenuItem>
              <MenuItem value={150}>150 rows</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Pagination
          count={totalPages}
          page={page}
          shape="rounded"
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  );
}