
import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Checkbox,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { getExamAppearedStdByExamId, getMajorSubsByProgramId } from "../../components/dashboard/services/service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { blue } from "@mui/material/colors";
import { getExamAppearedStudents } from "../../components/dashboard/services/service";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const ExamAppear = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm();
  const [selectedStudents, setSelectedStudents] = useState({});
  const [majors, setMajors] = useState([])
  const [selectedMajor, setSelectedMajors] = useState(0)
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const queryParams = new URLSearchParams(location.search);
  const Id = queryParams.get("examroutine");

  const { data: examData = {}, isLoading: examLoading } = useQuery({
    queryKey: ['examData', Id],
    queryFn: async () => {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/SubjectExamSchedule/${Id}`, config);
      return response.data;
    },
    enabled: !!Id,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 2,
  });


  const programId = examData.programId;
  useEffect(() => {
    const fetchMajors = async () => {
      if (!programId) return;

      try {
        const response = await getMajorSubsByProgramId(programId);
        setMajors(response.data || response);
      } catch (err) {
        console.error("Error fetching majors:", err);
        setMajors([]);
      }
    };
    fetchMajors();
  }, [programId])


  const { data: moduleData = [] } = useQuery({
    queryKey: ['moduleData', Id],
    queryFn: async () => {
      return await getExamAppearedStdByExamId({
        subExamId: Id,
        studentPage: page,
        studentPageSize: rowsPerPage
      });
    },
    enabled: !!Id,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 2,
  });
  const {
    data: studentResponse = { students: [], totalPages: 0, totalCount: 0 },
    isLoading: studentsLoading
  } = useQuery({
    queryKey: [
      'examStudents',
      examData.programId,
      examData.batchId,
      examData.semester,
      examData.year,
      page,
      rowsPerPage,
      selectedMajor
    ],
    queryFn: async () => {
      try {
        const studentData = await getExamAppearedStudents({
          programId: examData.programId,
          batchId: examData.batchId,
          semester: examData.semester,
          year: examData.year,
          page,
          pageSize: rowsPerPage,
          majorSubjectId: selectedMajor
        });
        setTotalRecords(studentData.totalRecords || 0);
        setTotalPages(Math.ceil((studentData.totalRecords) / rowsPerPage));
        return {
          students: studentData?.data || [],
          totalPages: Math.ceil((studentData.totalRecords || 0) / rowsPerPage),
          totalCount: studentData.totalRecords || 0
        };
      } catch (error) {
        console.error("Error fetching students:", error);
        return { students: [], totalPages: 0, totalCount: 0 };
      }
    },
    enabled: !!examData.programId,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 2,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (moduleData && moduleData.data && moduleData.data.length > 0 && studentResponse.students && studentResponse.students.length > 0) {
      const preSelectedStudents = {};

      studentResponse.students.forEach(student => {
        let hasAppeared = false;
        let existingRemarks = "";

        moduleData.data.forEach(examRecord => {
          if (examRecord.studentExamRecords && examRecord.studentExamRecords.length > 0) {
            const record = examRecord.studentExamRecords.find(r => r.studentId === student.id);
            if (record && record.doesAppear) {
              hasAppeared = true;
              existingRemarks = record.remarks || "";
            }
          }
        });

        if (hasAppeared) {
          preSelectedStudents[student.id] = {
            isSelected: true,
            remarks: existingRemarks
          };
        }
      });

      if (Object.keys(preSelectedStudents).length > 0) {
        setSelectedStudents(prev => {
          const shouldUpdate = Object.keys(preSelectedStudents).some(
            studentId => !prev[studentId] || prev[studentId].isSelected !== preSelectedStudents[studentId].isSelected
          );

          if (shouldUpdate) {
            return { ...prev, ...preSelectedStudents };
          }
          return prev;
        });
      }
    }
  }, [moduleData, studentResponse.students, page]);

  const { students = [] } = studentResponse;
  const loading = examLoading || studentsLoading;

  const filteredStudents = students.filter((student) => {
    if (!student || !examData) return false;
    const programMatch = student.programName === examData.programName;
    const yearMatch = examData.year ? student.year === examData.year : true;
    const semesterMatch = examData.semester
      ? student.semester === examData.semester
      : true;
    return programMatch && (yearMatch || semesterMatch);
  });

  const paginatedStudents = filteredStudents;

  const onSubmit = async (formData) => {
    const selectedIds = Object.keys(selectedStudents)
      .filter((selectedId) => selectedStudents[selectedId]?.isSelected)
      .map((selectedId) => parseInt(selectedId, 10));

    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student.");
      return;
    }

    try {
      const config = getAuthConfigSafe()
      const formPayload = new FormData();
      formPayload.append("subjectExamScheduleId", examData?.id);
      formPayload.append("doesAppeared", "true");
      formPayload.append("remarks", formData.remarks || "");

      selectedIds.forEach((id, index) => {
        formPayload.append(`StudentIds[${index}]`, id);
      });

      const response = await axios.post(
        `${backendUrl}/ExamAppearManagement/upsert`,
        formPayload,
        config
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Attendance submitted successfully!");
        queryClient.invalidateQueries(['examStudents']);
        queryClient.invalidateQueries(['moduleData']);
        navigate("/exam-management/routine-list");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error(
        error.response?.data?.message ||
        "There was an error submitting the attendance. Please try again."
      );
    }
  };

  const handleSelectAllClick = (event) => {
    const checked = event.target.checked;
    if (checked) {
      const newSelected = {};
      paginatedStudents.forEach((student) => {
        newSelected[student.id] = {
          isSelected: true,
          remarks: selectedStudents[student.id]?.remarks || ""
        };
      });
      setSelectedStudents((prev) => ({ ...prev, ...newSelected }));
    } else {
      const newSelected = { ...selectedStudents };
      paginatedStudents.forEach((student) => {
        if (newSelected[student.id]) {
          newSelected[student.id].isSelected = false;
        }
      });
      setSelectedStudents(newSelected);
    }
  };

  const handleStudentAttendanceChange = (studentId, checked) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: {
        isSelected: checked,
        remarks: prev[studentId]?.remarks || ""
      },
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: remarks,
      }
    }));
  };

  const isAllSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every(
      (student) => selectedStudents[student.id]?.isSelected
    );

  const isIndeterminate =
    paginatedStudents.some(
      (student) => selectedStudents[student.id]?.isSelected
    ) && !isAllSelected;

  return (
    <>
      {loading ? (
        <Grid container alignItems="center" justifyContent="center" >
          <CircularProgress />
        </Grid>
      ) : (
        <Box >
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            color={blue[700]}
          >
            Managing the exam attendance for <strong>{examData.examName}</strong>
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={0} justifyContent="center">
              <Grid item xs={12}>
                <Box >
                  <Grid container spacing={1} my='5px'>
                    <Grid item xs={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel disabled>Program Name</InputLabel>
                        <Select
                          label="Program Name"
                          value={examData?.programName || ""}
                          disabled
                          size="small"
                        >
                          <MenuItem value={examData?.programName || ""}>
                            {examData?.programName || ""}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Subject Name"
                            InputLabelProps={{ shrink: true }}
                            value={`${examData?.subjectName || ""} (${examData?.code || ""})`}
                            sx={{
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              borderColor: "#c2c2c2",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#c2c2c2",
                                },
                                "&:hover fieldset": {
                                  borderColor: blue[500],
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: blue[700],
                                  boxShadow: `0 0 0 2px ${blue[100]}`,
                                },
                              },
                              "& .MuiInputLabel-root": { fontSize: "1rem" },
                            }}
                            disabled
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <Controller
                        name="semester"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Semester/Year"
                            InputLabelProps={{ shrink: true }}
                            value={
                              examData.year
                                ? `${examData.year} Year`
                                : `${examData.semester || ""} Semester`
                            }
                            sx={{
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              borderColor: "#c2c2c2",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#c2c2c2",
                                },
                                "&:hover fieldset": {
                                  borderColor: blue[500],
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: blue[700],
                                  boxShadow: `0 0 0 2px ${blue[100]}`,
                                },
                              },
                              "& .MuiInputLabel-root": { fontSize: "1rem" },
                            }}
                            disabled
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Exam Date"
                            InputLabelProps={{ shrink: true }}
                            value={examData?.examDate?.slice(0, 10) || ""}
                            sx={{
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              borderColor: "#c2c2c2",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#c2c2c2",
                                },
                                "&:hover fieldset": {
                                  borderColor: blue[500],
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: blue[700],
                                  boxShadow: `0 0 0 2px ${blue[100]}`,
                                },
                              },
                              "& .MuiInputLabel-root": { fontSize: "1rem" },
                            }}
                            disabled
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <Controller
                        name="time"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            disabled
                            size="small"
                            label="Exam Time"
                            InputLabelProps={{ shrink: true }}
                            value={examData?.examTime || ""}
                            sx={{
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              borderColor: "#c2c2c2",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#c2c2c2",
                                },
                                "&:hover fieldset": {
                                  borderColor: blue[500],
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: blue[700],
                                  boxShadow: `0 0 0 2px ${blue[100]}`,
                                },
                              },
                              "& .MuiInputLabel-root": { fontSize: "1rem" },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Major Subject</InputLabel>
                        <Select
                          label="Major Subject"
                          value={selectedMajor}
                          onChange={(e) => {
                            setSelectedMajors(Number(e.target.value));
                            setPage(1); // Reset to first page
                          }}
                        >
                          <MenuItem value={0}>All Majors</MenuItem>
                          {majors.map((major) => (
                            <MenuItem key={major.id} value={major.id}>
                              {major.majorSubjectName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={12}>
                <Box component={Paper} sx={{ padding: 1 }}>
                  <TableContainer
                    sx={{
                      marginTop: 0,
                      height: 400,
                      overflowY: 'auto',
                      border: "1px solid #ddd"
                    }}
                  >
                    <Table
                      stickyHeader
                      style={{
                        borderCollapse: "collapse",
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2A629A",
                              border: "1px solid #ddd",
                              padding: "4px",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            S.No.
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2A629A",
                              border: "1px solid #ddd",
                              padding: "4px",
                              textAlign: "center",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            Student Name
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2A629A",
                              border: "1px solid #ddd",
                              padding: "4px",
                              textAlign: "center",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            Roll No
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2A629A",
                              border: "1px solid #ddd",
                              padding: "4px",
                              textAlign: "center",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            University Reg No
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2A629A",
                              border: "1px solid #ddd",
                              padding: "4px",
                              textAlign: "center",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            Program Name
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2A629A",
                              border: "1px solid #ddd",
                              padding: "4px",
                              textAlign: "center",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            Semester/Year
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2A629A",
                              border: "1px solid #ddd",
                              padding: "4px",
                              textAlign: "center",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            Subject
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2A629A",
                              border: "1px solid #ddd",
                              padding: "4px",
                              textAlign: "center",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            <Checkbox
                              sx={{ color: "whitesmoke" }}
                              onChange={handleSelectAllClick}
                              checked={isAllSelected}
                              indeterminate={isIndeterminate}
                            />
                            Attendance
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#FFFFFF",
                              backgroundColor: "#2A629A",
                              border: "1px solid #ddd",
                              padding: "4px",
                              width: "10%",
                              textAlign: "center",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            Remarks
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {paginatedStudents.map((student, index) => (
                          <TableRow key={student.id}>
                            <TableCell style={{ border: "1px solid #ddd", padding: "2px 4px" }}>
                              <h1 className="text-xs">
                                {(page - 1) * rowsPerPage + index + 1}
                              </h1>
                            </TableCell>
                            <TableCell style={{ border: "1px solid #ddd", padding: "2px 4px" }}>
                              <h1 className="text-xs">
                                {`${student.firstName || ""} ${student.middleName || ""} ${student.lastName || ""}`.trim()}
                              </h1>
                            </TableCell>
                            <TableCell style={{ border: "1px solid #ddd", padding: "2px 4px" }}>
                              <h1 className="text-xs">{student.rollNoManual}</h1>
                            </TableCell>
                            <TableCell style={{ border: "1px solid #ddd", padding: "2px 4px" }}>
                              <h1 className="text-xs">{student.universityRegdNo || ""}</h1>
                            </TableCell>
                            <TableCell style={{ border: "1px solid #ddd", padding: "2px 4px" }}>
                              <h1 className="text-xs">{student.programName || ""}</h1>
                            </TableCell>
                            <TableCell style={{ border: "1px solid #ddd", padding: "2px 4px" }}>
                              <h1 className="text-xs">
                                {student.year
                                  ? `${student.year} Year`
                                  : student.semester
                                    ? `${student.semester} Semester`
                                    : ""}
                              </h1>
                            </TableCell>
                            <TableCell style={{ border: "1px solid #ddd", padding: "2px 4px" }}>
                              <h1 className="text-xs">
                                {`${examData?.subjectName || ""} (${examData?.code || ""})`.trim()}
                              </h1>
                            </TableCell>
                            <TableCell style={{ border: "1px solid #ddd", padding: "2px 4px" }}>
                              <h1 className="text-xs">
                                <Checkbox
                                  checked={selectedStudents[student.id]?.isSelected || false}
                                  onChange={(e) =>
                                    handleStudentAttendanceChange(student.id, e.target.checked)
                                  }
                                />
                              </h1>
                            </TableCell>
                            <TableCell style={{ border: "1px solid #ddd", padding: "0px" }}>
                              <TextField
                                fullWidth
                                size="small"
                                sx={{
                                  padding: 0,
                                  "& fieldset": { border: "none" },
                                }}
                                value={selectedStudents[student.id]?.remarks || ""}
                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              />
                            </TableCell>
                          </TableRow>

                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2, px: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, totalRecords)} of {totalRecords} entries
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2}>
                      <FormControl size="small">
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
                              padding: "2px 8px",
                              fontSize: "0.75rem",
                            },
                            "& .MuiSelect-icon": {
                              fontSize: "1rem",
                            },
                          }}
                        >
                          <MenuItem value={25}>25 </MenuItem>
                          <MenuItem value={50}>50 </MenuItem>
                          <MenuItem value={150}>150 </MenuItem>
                          <MenuItem value={250}>250 </MenuItem>
                        </Select>
                      </FormControl>

                      <Pagination
                        count={totalPages}
                        page={page}
                        size="small"
                        shape="rounded"
                        onChange={handlePageChange}
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: "center", marginTop: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      color="primary"
                      disabled={Object.keys(selectedStudents).filter(id => selectedStudents[id]?.isSelected).length === 0}
                    >
                      Submit Attendance ({Object.keys(selectedStudents).filter(id => selectedStudents[id]?.isSelected).length} selected)
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}
    </>
  );
};
export default ExamAppear;
