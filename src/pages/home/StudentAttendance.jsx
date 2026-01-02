import React, { useState, useEffect } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { getVerifiedStudents } from "../../components/dashboard/services/service";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';


const StudentAttendance = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  
  const [studentData, setStudentData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [programData, setProgramData] = useState([]);
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [faculty, setFaculty] = useState("");
  const currentDay = new Date().getDate();
  const { currentUser } = useSelector((state) => state.user);
  const campusId = currentUser?.institution?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVerifiedStudents();
        setStudentData(data);
        setFilteredStudents(data);
      } catch (err) {
        console.log("Error fetching students:", err);
      }
    };
    fetchData();
  }, []);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  });

  const sortedDays = [
    ...daysInMonth.filter((date) => date.getDate() < currentDay),
    new Date(),
    ...daysInMonth.filter((date) => date.getDate() > currentDay),
  ];

  const getInitialAttendance = (students, startDate, endDate) => {
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    return students.reduce((acc, student) => {
      acc[student.rollNo] = dates.reduce((dateAcc, date) => {
        dateAcc[format(date, "yyyy-MM-dd")] = false;
        return dateAcc;
      }, {});
      return acc;
    }, {});
  };

  useEffect(() => {
    const startOfMonthDate = startOfMonth(selectedMonth);
    const endOfMonthDate = endOfMonth(selectedMonth);
    const initialAttendance = getInitialAttendance(
      studentData,
      startOfMonthDate,
      endOfMonthDate
    );
    setAttendanceData(initialAttendance);
  }, [selectedMonth, studentData]);

  const handleAttendanceChange = (rollNo, date, isChecked) => {
    setAttendanceData((prevData) => {
      const updatedData = { ...prevData };
      if (!updatedData[rollNo]) {
        updatedData[rollNo] = {};
      }
      updatedData[rollNo][date] = isChecked;
      return updatedData;
    });
  };

  const saveAttendance = async () => {
    const attendanceToSave = [];
    const checkedStudentIds = [];
    filteredStudents.forEach((student) => {
      if (attendanceData[student.rollNo]) {
        sortedDays.forEach((date) => {
          const formattedDate = format(date, "yyyy-MM-dd");
          const hasAttended = attendanceData[student.rollNo][formattedDate];

          if (hasAttended !== undefined) {
            if (hasAttended) {
              checkedStudentIds.push(student.id);
            }
            attendanceToSave.push({
              campusId: campusId,
              subjectID: selectedSubject || 0,
              semester: selectedSemester || student.semester,
              section: "A",
              studentId: student.id,
              hasAttended,
              dateAttended: formattedDate,
              timeAttended: new Date().toISOString(),
            });
          }
        });
      }
    });

    if (attendanceToSave.length === 0) {
      toast.error("No attendance data to save.");
      return;
    }
    const config = getAuthConfigSafe()
    try {
      const response = await fetch(`${backendUrl}/AttendanceStudent`, config, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceData: attendanceToSave,
          studentIds: checkedStudentIds,
        }),
      });

      if (response.ok) {
        toast.success("Attendance Saved Successfully!!");
      } else {
        toast.error(`Failed to save attendance: ${response.statusText}`);
      }
    } catch (error) {
      toast.error("Attendance failed to save!!");
    }
  };

  const handleSearch = () => {
    const filtered = studentData.filter(
      (student) =>
        (selectedProgram ? student.programName === selectedProgram : true) &&
        (selectedSemester ? student.semester === selectedSemester : true)
    );
    setFilteredStudents(filtered);
  };

  const getIncrementingNumber = (date, idx) => {
    if (date.getDay() === 6) return null;
    return idx + 1;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthconfigSafe()()
        const response = await axios.get(
          `${backendUrl}/ProgramMgmt/GetCollegePrograms`,
          config
        );
        setProgramData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const faculties = [...new Set(programData.map((item) => item.facultyName))];
    setFilteredFaculties(faculties);
  }, [programData]);

  useEffect(() => {
    const programs = programData.filter((item) => item.facultyName === faculty);
    const uniquePrograms = [...new Set(programs.map((item) => item))];
    setFilteredPrograms(uniquePrograms);
  }, [faculty, programData]);

  return (
    <Box
      sx={{
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          color: blue[700],
          fontWeight: 400,
          paddingBottom: 2,
        }}
      >
        Student Attendance Register
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <FormControl sx={{ minWidth: 240 }} size="small">
          <InputLabel id="select-program-label">Faculty</InputLabel>
          <Select
            labelId="select-program-label"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            label="Program"
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          >
            {filteredFaculties.map((faculty, index) => (
              <MenuItem key={index} value={faculty}>
                {faculty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 240 }} size="small">
          <InputLabel id="select-program-label">Program</InputLabel>
          <Select
            fullWidth
            required
            size="small"
            name="program"
            label="Program"
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          >
            {filteredPrograms?.map((program) => (
              <MenuItem key={program.id} value={program?.id}>
                {" "}
                {program?.programName}{" "}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel id="select-semester-label">Semester</InputLabel>
          <Select
            labelId="select-semester-label"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            label="Semester"
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          >
            {studentData.map((student, index) => (
              <MenuItem key={index} value={student.semester}>
                {student.semester}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel id="select-subject-label">Subject</InputLabel>
          <Select
            labelId="select-subject-label"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            label="Subject"
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          >
            {filteredFaculties.map((facultyName, index) => (
              <MenuItem key={index} value={facultyName}>
                {facultyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Select Month"
          type="month"
          size="small"
          value={format(selectedMonth, "yyyy-MM")}
          onChange={(e) => setSelectedMonth(new Date(e.target.value))}
          sx={{ minWidth: 220, backgroundColor: "#fff", borderRadius: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleSearch}
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
          Search
        </Button>
      </Box>

      <TableContainer
        sx={{
          marginBottom: 3,
          backgroundColor: "white",
          borderRadius: 2,
        }}
      >
        <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <TableHead sx={{ backgroundColor: blue[700] }}>
            <TableRow>
              <TableCell
                align="center"
                style={{
                  color: "#FFFFFF",

                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                <strong>S.No.</strong>
              </TableCell>
              <TableCell
                align="center"
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  minWidth: 200,
                  textAlign: "center",
                }}
              >
                <strong>Roll No</strong>
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "8px",
                  margin: "auto",
                  minWidth: 220,
                }}
              >
                Students Name
              </TableCell>

              {sortedDays.map((date) => (
                <TableCell
                  key={date}
                  align="center"
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  <strong>{format(date, "EEE, d")}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStudents.map((student, index) => (
              <TableRow
                key={student.rollNo}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f6e6e6",
                }}
              >
                <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                  {index + 1}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                  }}
                >
                  {student.rollNo}
                </TableCell>
                <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                  {`${student.firstName} ${student.lastName}`}
                </TableCell>

                {sortedDays.map((date, idx) => (
                  <TableCell
                    key={date}
                    style={{
                      border: "1px solid #ddd",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {date.getDate() > currentDay ? (
                      ""
                    ) : date.getDay() === 6 ? (
                      "-"
                    ) : date.getDate() < currentDay ? (
                      getIncrementingNumber(date, idx)
                    ) : (
                      <Checkbox
                        checked={
                          attendanceData[student.rollNo] &&
                          attendanceData[student.rollNo][
                          format(date, "yyyy-MM-dd")
                          ]
                        }
                        onChange={(e) =>
                          handleAttendanceChange(
                            student.rollNo,
                            format(date, "yyyy-MM-dd"),
                            e.target.checked
                          )
                        }
                        sx={{ padding: 0 }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="success"
          onClick={saveAttendance}
          sx={{
            borderRadius: 2,
            backgroundColor: blue[700],
            "&:hover": { backgroundColor: blue[600] },
          }}
        >
          Save Attendance
        </Button>
      </Box>
    </Box>
  );
};

export default StudentAttendance;
