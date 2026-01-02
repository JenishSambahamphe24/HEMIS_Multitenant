import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { calculateDuration } from "../../../../../utils/dateUtils";

const ResearchDetailsTable = ({ index, sNo, data }) => {
  return (
    <Box >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black" }}
      >
        {`${index}.${sNo}`} Researcher Details:
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small" sx={{ border: "1px solid black" }}>
          {/* Header */}
          <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
            <TableRow >
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", textAlign: 'center' }} colSpan={4}  >
                <p className="text-white">
                  Researcher Details (Faculty Members)
                </p>
              </TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", textAlign: 'center' }} colSpan={6} >
                <p className="text-white">
                  Particulars
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              {[
                "SNo",
                "Name",
                "Position",
                "Teaching Faculty",
              ].map((header, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "#f0f0f0" }}
                >
                  {header}
                </TableCell>
              ))}
              {[
                "Research Title",
                "Sponsoring Agency",
                "Grant Received",
                "Reseach Duration (days)",
                "Remarks",
              ].map((header, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "#f0f0f0" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {
              data?.length > 0 ?
                (data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black" }}
                    >
                      {item.employeeName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black" }}
                    >
                      {item.postName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black" }}
                    >
                      {item.teachingFacultyName || ''}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black" }}
                    >
                      {item.activityTitle || ''}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black" }}
                    >
                      {item.fundedBy || ''}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black" }}
                    >
                      {item.fundedAmount || ''}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black" }}
                    >
                      {calculateDuration(item.startDate, item.endDate)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black" }}
                    >
                      {item.remarks}
                    </TableCell>
                  </TableRow>
                ))
                ) : (
                  <h1> No Data avaialable</h1>
                )
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginTop: "5px", padding: "10px" }}>
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", color: "black" }}
        >
          *: Please mention whether the Research is completed, ongoing, or in the pipeline etc.
        </Typography>
      </Box>
    </Box>
  );
};

export default ResearchDetailsTable;