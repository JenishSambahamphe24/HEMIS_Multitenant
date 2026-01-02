import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const StudentPassedList = ({ studentData }) => {
  const [passedData, setPassedData] = useState([]);
  useEffect(() => {
    const filteredData = studentData.filter(
      (student) => student.isPass === true
    );
    setPassedData(filteredData);
  }, [studentData]);
  return (
    <TableContainer>
      <Table size="small">
        <TableHead sx={{ bgcolor: "primary.main" }}>
          <TableRow>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              S.No
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Full Name
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Phone Number
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Registration Number
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Roll No
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Batch
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Level
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Program
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Latest Passed Semester/Year
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Status
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody style={{ backgroundColor: "white" }}>
          {passedData.length > 0 ? (
            passedData
              .sort((a, b) => a.studentName.localeCompare(b.studentName))
              .map((student, index) => (
                <TableRow key={student.id} hover>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.studentName}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.phoneNumber}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.registrationNumber}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.rollNoManual}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.batch}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.levelName}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.programName}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.year
                      ? `${student?.year} Year`
                      : `${student?.semester} Semester`}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ddd",
                      padding: "4px",
                      color: "green",
                    }}
                  >
                    Passed
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" color="textSecondary">
                  Please Search the Students
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentPassedList;
