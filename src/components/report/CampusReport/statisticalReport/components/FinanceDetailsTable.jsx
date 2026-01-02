import React from "react";
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

const FinanceDetailsTable = ({index, sNo}) => {
  return (
    <Box>
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          color: "black",
          marginBottom: "10px",
        }}
      >
        {index}. Financial Details of College in fiscal Year
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black", marginBottom: "10px" }}
      >
       {`${index}.${sNo}`} Annual Budget:
      </Typography>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small" sx={{ border: "1px solid black" }}>
          {/* Header */}
          <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
            <TableRow>
              <TableCell
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold" , color:'white'}}

              >
                Year
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold" , color:"white"}}
              >
                Income
              </TableCell>
              <TableCell
                colSpan={2}
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold",color:"white" }}
              >
                Expenditure
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", color:"white" }}
              >
                Balance (Surplus or Deficit)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", color:"white" }}
              >
                Regular (Recurrent)
              </TableCell>
              <TableCell
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", color:"white" }}
              >
                Development
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {[
              { year: "LAST F.Y.........................Actual", income: "", regular: "", development: "", balance: "" },
              { year: "CURRENT F.Y..................Estimated", income: "", regular: "", development: "", balance: "" },
            ].map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.year}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.income}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.regular}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.development}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.balance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FinanceDetailsTable;