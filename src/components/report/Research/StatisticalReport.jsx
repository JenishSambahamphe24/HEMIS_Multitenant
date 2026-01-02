import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from "@mui/material";
import MgmtForm from "./MgmtForm";

const StatisticalReport = () => {
  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Typography
        variant="h5"
        sx={{ marginBottom: "20px", fontWeight: "bold" }}
      ></Typography>
      <Typography variant="body1" sx={{ marginBottom: "20px" }}>
        Student Enrolment in Current F.Y:
        ........................................
      </Typography>

      <TableContainer sx={{ border: "1px solid #ddd", marginTop: "20px" }}>
        <Table sx={{ borderCollapse: "collapse", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                rowSpan={2}
              >
                Level
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                rowSpan={2}
              >
                Program Name (e.g., B.Ed.)
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                colSpan={5}
              >
                1st Year
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                colSpan={5}
              >
                2nd Year
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                colSpan={5}
              >
                3rd Year
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                colSpan={5}
              >
                4th Year
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                rowSpan={2}
              >
                Grand Total (1+2+3+4)
              </TableCell>
            </TableRow>
            <TableRow>
              {["TOTAL", "Girls", "EDG*", "Dalit", "Madhesi"].map(
                (label, index) => (
                  <React.Fragment key={index}>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        textAlign: "center",
                        backgroundColor: "#f4f4f4",
                        fontWeight: "bold",
                      }}
                    >
                      1st Year {label}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        textAlign: "center",
                        backgroundColor: "#f4f4f4",
                        fontWeight: "bold",
                      }}
                    >
                      2nd Year {label}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        textAlign: "center",
                        backgroundColor: "#f4f4f4",
                        fontWeight: "bold",
                      }}
                    >
                      3rd Year {label}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        textAlign: "center",
                        backgroundColor: "#f4f4f4",
                        fontWeight: "bold",
                      }}
                    >
                      4th Year {label}
                    </TableCell>
                  </React.Fragment>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              "Bachelor's Level (5)",
              "Master's Level (6)",
              "M.Phil. (7)",
              "Ph.D. (8)",
            ].map((level, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    ...(index === 0 && { rowSpan: 4, fontWeight: "bold" }),
                  }}
                >
                  {index === 0 ? level : ""}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #ddd", textAlign: "center" }}
                >
                  {level}
                </TableCell>
                {Array.from({ length: 20 }, (_, i) => (
                  <TableCell
                    key={i}
                    sx={{ border: "1px solid #ddd", textAlign: "center" }}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={2}
                sx={{
                  border: "1px solid #ddd",
                  textAlign: "center",
                  fontWeight: "bold",
                  backgroundColor: "#f9f9f9",
                }}
              >
                Grand Sub Total (5+6+7+8)
              </TableCell>
              {Array.from({ length: 21 }, (_, i) => (
                <TableCell
                  key={i}
                  sx={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                  }}
                />
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <MgmtForm/>
    </Box>
  );
};

export default StatisticalReport;
