
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const StudentAppearedList = ({ studentData }) => {
  const uniqueStudents = studentData.reduce((unique, student) => {
    if (!unique.has(student.id)) {
      unique.set(student.id, student);
    }
    return unique;
  }, new Map());

  const filteredStudents = Array.from(uniqueStudents.values());
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
              Registration No
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

        <TableBody style={{backgroundColor:'white'}}>
          {filteredStudents.length > 0 ? (
            [...filteredStudents]
              .sort((a, b) => {
                const fullNameA = [a.firstName, a.middleName, a.lastName].filter(Boolean).join(" ");
                const fullNameB = [b.firstName, b.middleName, b.lastName].filter(Boolean).join(" ");
                return fullNameA.localeCompare(fullNameB);
              })
              .map((student, index) => (
                <TableRow key={student.id} hover>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {[student.firstName, student.middleName, student.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.phoneNumber}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.rollNoManual}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.universityRegdNo}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.batchNameNepali}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.levelName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.programName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
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
                    Appeared
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

export default StudentAppearedList;