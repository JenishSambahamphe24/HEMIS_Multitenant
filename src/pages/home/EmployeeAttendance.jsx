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
} from "@mui/material";
import { blue } from "@mui/material/colors";
import axios from "axios";

const EmployeeAttendance = () => {
  const today = new Date();
  const startOfMonthDate = startOfMonth(today);
  const endOfMonthDate = endOfMonth(today);

  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const department =[];

  useEffect(() => {
    axios
      .get("http://apiheims.dibugsoft.com/api/Employee/getEmployee") // Use your API endpoint here
      .then((response) => {
        setEmployees(response.data); // Assuming the response contains an array of employees
        setFilteredEmployees(response.data); // Initially, show all employees
        setAttendanceData(getInitialAttendance(response.data, startOfMonthDate, endOfMonthDate)); // Initialize attendance data
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  const getInitialAttendance = (employees, startDate, endDate) => {
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    return employees.reduce((acc, employee) => {
      acc[employee.employeeID] = dates.reduce((dateAcc, date) => {
        dateAcc[format(date, "yyyy-MM-dd")] = false;
        return dateAcc;
      }, {});
      return acc;
    }, {});
  };

  const currentDay = today.getDate();

  const handleAttendanceChange = (employeeID, date, isChecked) => {
    setAttendanceData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[employeeID][date] = isChecked;
      return updatedData;
    });
  };

  const saveAttendance = () => {
    const attendanceToPost = [];
    Object.keys(attendanceData).forEach((employeeID) => {
      const employeeAttendance = attendanceData[employeeID];
      Object.keys(employeeAttendance).forEach((date) => {
        if (employeeAttendance[date]) {
          attendanceToPost.push({
            campusId: 0, // Assuming campusId is constant or dynamic based on context
            employeeID: parseInt(employeeID),
            hasAttended: true,
            dateAttended: new Date(date).toISOString(),
            timeAttended: "09:00 AM", // Mocked time
          });
        }
      });
    });
    axios
      .post(
        "http://apiheims.dibugsoft.com/api/AttendanceEmployee/List",
        attendanceToPost
      )
      .then((response) => {
        alert("Attendance saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving attendance:", error);
        alert("Error saving attendance.");
      });
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedDepartment ? startOfMonthDate : today),
    end: endOfMonth(today),
  });

  const sortedDays = [
    ...daysInMonth.filter((date) => date.getDate() < currentDay),
    today,
    ...daysInMonth.filter((date) => date.getDate() > currentDay),
  ];

  const handleSearch = () => {
    const filtered = employees.filter((employee) =>
      selectedDepartment ? employee.department === selectedDepartment : true
    );
    setFilteredEmployees(filtered);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="select-department-label">Department</InputLabel>
          <Select
            labelId="select-department-label"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            label="Department"
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
              "& .MuiInputLabel-root": {
                fontSize: "1rem",
              },
              "& .MuiSelect-icon": {
                color: blue[700],
              },
            }}
          >
            <MenuItem value="">Select Department</MenuItem>
            {department.map((department, index) => (
              <MenuItem key={index} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ height: "100%" }}
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
                  <strong>SNo</strong>
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
                  <strong>Employee ID</strong>
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
                  <strong>Name</strong>
                </TableCell>
                {sortedDays.map((date, index) => (
                  <TableCell
                    key={index}
                    align="center"
                  style={{
                    color: "#FFFFFF",
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  >
                    {`${format(date, "d")}`} <br />
                    {format(date, "EEE")} {/* Show the day of the week */}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredEmployees.map((employee, index) => (
                <TableRow
                  key={index}
                  sx={{ backgroundColor: index % 2 === 0 ? "#f6e6e6" : "#ffffff" }}
                >
                  <TableCell
                    align="center"
                    style={{ border: "1px solid #ddd", padding: "4px",}}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                    border: "1px solid #ddd",
                    padding: "4px"
                  }}
                  >
                    {employee.employeeID}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {employee.name}
                  </TableCell>
                  {sortedDays.map((date, index) => {
                    const dateString = format(date, "yyyy-MM-dd");
                    return (
                      <TableCell key={index} align="center">
                        {date.getDate() < currentDay ? (
                          <span>
                            {attendanceData[employee.employeeID][dateString] ? (
                              <Checkbox
                                checked
                                onChange={(e) =>
                                  handleAttendanceChange(
                                    employee.employeeID,
                                    dateString,
                                    e.target.checked
                                  )
                                }
                              />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </span>
                        ) : date.getDate() === currentDay ? (
                          <Checkbox
                            checked={attendanceData[employee.employeeID][dateString]}
                            onChange={(e) =>
                              handleAttendanceChange(
                                employee.employeeID,
                                dateString,
                                e.target.checked
                              )
                            }
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={saveAttendance}
        sx={{ mt: 4 }}
      >
        Save Attendance
      </Button>
      </Box>

      
    </Box>
  );
};

export default EmployeeAttendance;
