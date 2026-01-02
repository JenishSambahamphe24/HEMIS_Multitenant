import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Divider,
  TablePagination,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import axios from "axios";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import * as XLSX from "xlsx";
import {config} from '@config';


const MarksLedger = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const { id } = useParams();
  const examScheduleId = id || 181;
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classInfo, setClassInfo] = useState("");
  const [examName, setExamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const componentRef = useRef();

  useEffect(() => {
    if (examScheduleId) {
      fetchData();
    } else {
      setLoading(false);
      setError("No Exam Schedule ID provided in URL");
    }
  }, [examScheduleId, page, rowsPerPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!examScheduleId || isNaN(examScheduleId)) {
        throw new Error(
          "Invalid Exam Schedule ID format. It should be a number."
        );
      }

      const config = {
        ...getAuthConfigSafe(),
        headers: {
          ...getAuthConfigSafe().headers,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      };

      const timestamp = new Date().getTime();

      // Fetch marks data
      const response = await axios.get(
        `${backendUrl}/MarksEntry/GetProgramResultAll?ExamScheduleId=${examScheduleId}&pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}&t=${timestamp}`,
        config
      );

      if (response.data && response.data.data) {
        if (response.data.data.length === 0) {
          throw new Error(
            "No data found for this Exam Schedule ID. It may be incorrect or the exam may not have any results yet."
          );
        }
        processData(response.data);
        setTotalRecords(
          response.data.totalRecords ||
            response.data.total ||
            response.data.count ||
            0
        );
      } else {
        throw new Error(
          "Invalid API response structure. The server may be experiencing issues."
        );
      }
    } catch (err) {
      console.error("API Error Details:", err);
      let errorMessage = "Failed to fetch data";

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);

        if (err.response.status === 400) {
          errorMessage =
            "Bad request. Please check if the Exam Schedule ID is correct.";
        } else if (err.response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (err.response.status === 403) {
          errorMessage =
            "You don't have permission to access this exam schedule.";
        } else if (err.response.status === 404) {
          errorMessage = "The requested exam schedule was not found.";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        if (err.response.data && err.response.data.message) {
          errorMessage += ` Details: ${err.response.data.message}`;
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = err.message || "Failed to fetch data";
      }

      setError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data) => {
    if (data && data.data) {
      if (data.data.length > 0) {
        const firstStudent = data.data[0];
        setClassInfo(`${firstStudent.programName} (${firstStudent.shortName})`);
        setExamName(
          `${firstStudent.examNameManual} – ${firstStudent.batchNepali}`
        );
      }

      const allSubjectCodes = new Set();
      data.data.forEach((student) => {
        if (student.subjectResults) {
          student.subjectResults.forEach((subject) => {
            allSubjectCodes.add(subject.subjectCode);
          });
        }
      });

      const uniqueSubjects = Array.from(allSubjectCodes).map((code) => {
        const subjectWithData = data.data
          .flatMap((student) => student.subjectResults || [])
          .find((sub) => sub.subjectCode === code);

        return {
          code: code,
          fullMark:
            (parseInt(subjectWithData?.theoreticalFullMarks) || 0) +
            (parseInt(subjectWithData?.practicalFullMarks) || 0),
          passMark:
            (parseInt(subjectWithData?.theoreticalPassMarks) || 0) +
            (parseInt(subjectWithData?.practicalPassMarks) || 0),
        };
      });

      setSubjects(uniqueSubjects);

      const transformedStudents = data.data.map((student) => {
        const marks = {};
        uniqueSubjects.forEach((subject) => {
          const studentSubject = student.subjectResults
            ? student.subjectResults.find((s) => s.subjectCode === subject.code)
            : null;
          marks[subject.code] = studentSubject
            ? (parseInt(studentSubject.theoreticalMarks) || 0) +
              (parseInt(studentSubject.practicalMarks) || 0)
            : null;
        });

        let studentCode = student.registrationNumber || "N/A";
        if (studentCode.includes(" ")) {
          studentCode = studentCode.split(" ")[0];
        }

        return {
          id: student.studentId,
          code: studentCode,
          name: student.studentName,
          roll: student.rollNoManual || student.rollNo,
          marks: marks,
        };
      });

      setStudents(transformedStudents);
    } else {
      throw new Error("No data available");
    }
  };

  const calculateTotal = (studentMarks) => {
    return Object.values(studentMarks).reduce(
      (sum, mark) => sum + (mark || 0),
      0
    );
  };

  const calculatePercentage = (total, numberOfSubjects) => {
    const totalPossibleMarks = numberOfSubjects * 100;
    return totalPossibleMarks > 0 ? (total / totalPossibleMarks) * 100 : 0;
  };

  const determineStatus = (studentMarks, subjects) => {
    for (const subject of subjects) {
      const mark = studentMarks[subject.code];
      if (mark === null || mark === undefined || mark < subject.passMark) {
        return "Fail";
      }
    }
    return "Pass";
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const exportToExcel = () => {
    if (students.length === 0) return;

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet([]);

    const headerInfo = [
      ["STUDENT'S MARKS SHEET"],
      [currentUser?.institution?.name || "TEST MULTIPLE CAMPUS"],
      [`Exam: ${examName || "Examination Results"}`],
      [`Class/Program: ${classInfo || "N/A"}`],
      [`Exam Schedule ID: ${examScheduleId}`],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [],
    ];

    XLSX.utils.sheet_add_aoa(ws, headerInfo, { origin: "A1" });

    const excelHeaders = ["Student Code", "Student Name", "Roll No"];

    subjects.forEach((sub) => {
      excelHeaders.push(`${sub.code} (FM:${sub.fullMark}, PM:${sub.passMark})`);
    });

    excelHeaders.push("Total", "Percentage", "Status");

    XLSX.utils.sheet_add_aoa(ws, [excelHeaders], {
      origin: `A${headerInfo.length + 2}`,
    });

    const excelData = students.map((student) => {
      const rowData = [student.code, student.name, student.roll];

      subjects.forEach((subject) => {
        rowData.push(
          student.marks[subject.code] !== null &&
            student.marks[subject.code] !== undefined
            ? student.marks[subject.code]
            : "N/A"
        );
      });

      const total = calculateTotal(student.marks);
      const percentage = calculatePercentage(total, subjects.length);
      const status = determineStatus(student.marks, subjects);

      rowData.push(total.toFixed(2), `${percentage.toFixed(2)}%`, status);

      return rowData;
    });

    XLSX.utils.sheet_add_aoa(ws, excelData, {
      origin: `A${headerInfo.length + 3}`,
    });

    const colWidths = [{ wch: 15 }, { wch: 30 }, { wch: 10 }];

    subjects.forEach(() => {
      colWidths.push({ wch: 15 });
    });

    colWidths.push({ wch: 10 }, { wch: 12 }, { wch: 10 });

    ws["!cols"] = colWidths;

    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push({
      s: { r: 0, c: 0 },
      e: { r: 0, c: excelHeaders.length - 1 },
    });
    ws["!merges"].push({
      s: { r: 1, c: 0 },
      e: { r: 1, c: excelHeaders.length - 1 },
    });

    XLSX.utils.book_append_sheet(wb, ws, "Marks Sheet");

    XLSX.writeFile(
      wb,
      `StudentsMarksSheet_${examScheduleId}_${new Date().getTime()}.xlsx`
    );
  };

  const emptyRows = Math.max(0, rowsPerPage - students.length);

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
        className="no-print"
      >
        <Box></Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={exportToExcel}
          disabled={students.length === 0}
          color="primary"
          sx={{
            py: 1.5,
            px: 3,
            fontSize: "1rem",
            borderRadius: 2,
            boxShadow: 3,
            "&:hover": {
              boxShadow: 5,
              transform: "translateY(-2px)",
              transition: "all 0.3s ease",
            },
          }}
        >
          Export to Excel
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} className="no-print">
          {error}
        </Alert>
      )}

      <Paper
        elevation={4}
        sx={{ p: 4, backgroundColor: "#f9f9f9", position: "relative" }}
        ref={componentRef}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontWeight: "bold", color: "#2e3b55" }}
          >
            A QAA Certified Institution
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", color: "#1a237e", mb: 1 }}
          >
            {currentUser?.institution?.name || "TEST MULTIPLE CAMPUS"}
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: "#424242" }}
          >
            (Affiliated: Tribhuvan University) – Kupondole, Lalitpur –
            091-526877
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", color: "#2e7d32", mb: 2 }}
          >
            STUDENT'S MARKS SHEET
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            {examName || "Examination Results"}
          </Typography>

          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Typography variant="body1">
              <strong>Class/Program:</strong> {classInfo || "N/A"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Exam Schedule ID:</strong> {examScheduleId}
            </Typography>
          </Box>

          {students.length > 0 ? (
            <>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableRow>
                    <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                      <strong>Student Code</strong>
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                      <strong>Student Name</strong>
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                      <strong>Rollno.</strong>
                    </TableCell>

                    {subjects.map((sub) => (
                      <TableCell
                        key={sub.code}
                        sx={{ borderRight: "1px solid #ccc" }}
                      >
                        <strong>{sub.code}</strong>
                        <br />
                        <small>
                          (FM: {sub.fullMark}, PM: {sub.passMark})
                        </small>
                      </TableCell>
                    ))}
                    <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                      <strong>Percentage</strong>
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => {
                    const total = calculateTotal(student.marks);
                    const percentage = calculatePercentage(
                      total,
                      subjects.length
                    );
                    const status = determineStatus(student.marks, subjects);

                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                          {student.code}
                        </TableCell>
                        <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                          {student.name}
                        </TableCell>
                        <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                          {student.roll}
                        </TableCell>
                        {subjects.map((sub) => {
                          const mark = student.marks[sub.code];
                          const isFail =
                            mark === null ||
                            mark === undefined ||
                            mark < sub.passMark;

                          return (
                            <TableCell
                              key={sub.code}
                              sx={{
                                borderRight: "1px solid #ccc",
                                color: isFail ? "error.main" : "inherit",
                              }}
                            >
                              {mark !== null && mark !== undefined
                                ? mark.toFixed(2)
                                : "N/A"}
                            </TableCell>
                          );
                        })}
                        <TableCell
                          sx={{
                            borderRight: "1px solid #ccc",
                            fontWeight: "bold",
                          }}
                        >
                          {total.toFixed(2)}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid #ccc",
                            fontWeight: "bold",
                          }}
                        >
                          {percentage.toFixed(2)}%
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid #ccc",
                            fontWeight: "bold",
                            color:
                              status === "Pass" ? "success.main" : "error.main",
                          }}
                        >
                          {status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3 + subjects.length + 3} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[10, 50, 100, 200]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ mt: 2, "@media print": { display: "none" } }}
                className="no-print"
              />
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No student data available
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Please check if the Exam Schedule ID is correct and try again.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
        className="no-print"
      />
    </Container>
  );
};

export default MarksLedger;
