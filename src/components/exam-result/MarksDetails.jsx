import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { blue } from '@mui/material/colors';
import React from 'react'

const MarksDetails = ({ moduleData }) => {
   const calculateColumnTotals = () => {
    if (!moduleData?.subjectResults) return {};

    return moduleData.subjectResults.reduce(
      (totals, subject) => {
        totals.theoreticalFullMarks +=
          parseInt(subject.theoreticalFullMarks) || 0;
        totals.practicalFullMarks += parseInt(subject.practicalFullMarks) || 0;
        totals.theoreticalPassMarks +=
          parseInt(subject.theoreticalPassMarks) || 0;
        totals.practicalPassMarks += parseInt(subject.practicalPassMarks) || 0;
        totals.theoreticalMarks += parseInt(subject.theoreticalMarks) || 0;
        totals.practicalMarks += parseInt(subject.practicalMarks) || 0;
        totals.totalMarks += parseInt(subject.totalMarks) || 0;
        return totals;
      },
      {
        theoreticalFullMarks: 0,
        practicalFullMarks: 0,
        theoreticalPassMarks: 0,
        practicalPassMarks: 0,
        theoreticalMarks: 0,
        practicalMarks: 0,
        totalMarks: 0,
      }
    );
  };
  return (
    <Paper elevation={2} sx={{ mt: 2, mb: 3, opacity: 0.8 }}>
          <TableContainer>
            <Table size="small" sx={{ minWidth: "100%" }}>
              <TableHead sx={{ backgroundColor: blue[700] }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      fontWeight: 600,
                      p: 0.5,
                      textAlign: "center",
                    }}
                    rowSpan={2}
                  >
                    S.N.
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      fontWeight: 600,
                      p: 0.5,
                      minWidth: "120px",
                      textAlign: "center",
                    }}
                    rowSpan={2}
                  >
                    Subject Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      fontWeight: 600,
                      p: 0.5,
                    }}
                    colSpan={2}
                  >
                    Full Marks 
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      fontWeight: "bold",
                      p: 0.5,
                    }}
                    colSpan={2}
                  >
                    Pass Marks
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      fontWeight: "bold",
                      p: 0.5,
                    }}
                    colSpan={3}
                  >
                    Marks Obtained
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      fontWeight: 600,
                      p: 0.5,
                    }}
                    rowSpan={2}
                  >
                    Remarks
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      p: 0.3,
                      textAlign: "center",
                    }}
                  >
                    TH
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      p: 0.3,
                      textAlign: "center",
                    }}
                  >
                    PR
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      p: 0.3,
                      textAlign: "center",
                    }}
                  >
                    TH
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      p: 0.3,
                      textAlign: "center",
                    }}
                  >
                    PR
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      p: 0.3,
                      textAlign: "center",
                    }}
                  >
                    TH
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      p: 0.3,
                      textAlign: "center",
                    }}
                  >
                    PR
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      border: "1px solid #c2c2c2",
                      fontSize: { xs: "12px", print: "12px" },
                      p: 0.3,
                      textAlign: "center",
                    }}
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {moduleData?.subjectResults?.map((subject, index) => (
                  <TableRow
                    key={subject.subjectExamScheduleId}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                  >
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        textAlign: "center",
                        fontSize: { xs: "12px", print: "12px" },
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        fontSize: { xs: "12px", print: "12px" },
                      }}
                    >
                      {subject.subjectCode} : {subject.subjectName}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        textAlign: "center",
                        fontSize: { xs: "12px", print: "12px" },
                        fontFamily: "monospace",
                      }}
                    >
                      {subject.theoreticalFullMarks || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        textAlign: "center",
                        fontSize: { xs: "12px", print: "12px" },
                        fontFamily: "monospace",
                      }}
                    >
                      {subject.practicalFullMarks || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        textAlign: "center",
                        fontSize: { xs: "12px", print: "12px" },
                        fontFamily: "monospace",
                      }}
                    >
                      {subject.theoreticalPassMarks || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        textAlign: "center",
                        fontSize: { xs: "12px", print: "12px" },
                        fontFamily: "monospace",
                      }}
                    >
                      {subject.practicalPassMarks || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        textAlign: "center",
                        fontSize: { xs: "12px", print: "12px" },
                        fontFamily: "monospace",
                        fontWeight: "bold",
                      }}
                    >
                      {subject.theoreticalMarks || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        textAlign: "center",
                        fontSize: { xs: "12px", print: "12px" },
                        fontFamily: "monospace",
                        fontWeight: "bold",
                      }}
                    >
                      {subject.practicalMarks || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        textAlign: "center",
                        fontSize: { xs: "12px", print: "12px" },
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "primary.main",
                      }}
                    >
                      {subject.totalMarks || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #c2c2c2",
                        p: 1,
                        textAlign: "center",
                        fontSize: { xs: "12px", print: "12px" },
                      }}
                    >
                      {subject.remarks || "-"}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Total Row with Calculations */}
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 1,
                      fontSize: { xs: "12px", print: "12px" },
                    }}
                    colSpan={2}
                  >
                    TOTAL
                  </TableCell>

                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 1,
                      fontSize: { xs: "12px", print: "12px" },
                      fontFamily: "monospace",
                    }}
                  >
                    {calculateColumnTotals().theoreticalFullMarks || "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 0.5,
                      fontSize: { xs: "11px", print: "9px" },
                      fontFamily: "monospace",
                    }}
                  >
                    {calculateColumnTotals().practicalFullMarks || "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 0.5,
                      fontSize: { xs: "12px", print: "12px" },
                      fontFamily: "monospace",
                    }}
                  >
                    {calculateColumnTotals().theoreticalPassMarks || "-"}
                  </TableCell>

                  {/* Practical Pass Marks Total */}
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 0.5,
                      fontSize: { xs: "11px", print: "9px" },
                      fontFamily: "monospace",
                    }}
                  >
                    {calculateColumnTotals().practicalPassMarks || "-"}
                  </TableCell>

                  {/* Theoretical Marks Total */}
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 0.5,
                      fontSize: { xs: "11px", print: "9px" },
                      fontFamily: "monospace",
                      color: "primary.main",
                    }}
                  >
                    {calculateColumnTotals().theoreticalMarks || "-"}
                  </TableCell>

                  {/* Practical Marks Total */}
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 0.5,
                      fontSize: { xs: "11px", print: "9px" },
                      fontFamily: "monospace",
                      color: "primary.main",
                    }}
                  >
                    {calculateColumnTotals().practicalMarks || "-"}
                  </TableCell>

                  {/* Grand Total */}
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 0.5,
                      fontSize: { xs: "11px", print: "9px" },
                      fontFamily: "monospace",
                      backgroundColor: "#1976d2",
                      color: "white",
                    }}
                  >
                    {calculateColumnTotals().totalMarks || "-"}
                  </TableCell>

                  {/* Remarks column - leave empty for totals row */}
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 0.5,
                      fontSize: { xs: "10px", print: "8px" },
                    }}
                  >
                    -
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
  )
}

export default MarksDetails