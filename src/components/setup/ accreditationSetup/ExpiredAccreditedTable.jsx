import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import AccrediationAppBar from "../../../modules/navbar/AccrediationAppBar";

const ExpiredAccreditedTable = () => {
  return (
    <>
            <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
            >
                Number of HEIs expired the accreditation in each type of campus by universities
            </Typography>
      <TableContainer>
        <Table style={{ borderCollapse: "collapse", border: "1px solid #000" }}>
          <TableHead>
            <TableRow>
              <TableCell 
                rowSpan={2}
                style={{
                  backgroundColor: "#2A629A",
                  color: "#ffffff",
                  border: "1px solid #000",
                  padding: "4px",
                  height: "24px",
                  textAlign: "center",
                  width: "80px"
                }}
              >
                S.No.
              </TableCell>
              <TableCell 
                rowSpan={2}
                style={{
                  backgroundColor: "#2A629A",
                  color: "#ffffff",
                  border: "1px solid #000",
                  padding: "4px",
                  height: "24px",
                  textAlign: "center"
                }}
              >
                University
              </TableCell>
              <TableCell 
                colSpan={3}
                align="center"
                style={{
                  backgroundColor: "#2A629A",
                  color: "#ffffff",
                  border: "1px solid #000",
                  padding: "4px",
                  height: "24px",
                  textAlign: "center"
                }}
              >
                Campus Type
              </TableCell>
              <TableCell 
                rowSpan={2}
                style={{
                  backgroundColor: "#2A629A",
                  color: "#ffffff",
                  border: "1px solid #000",
                  padding: "4px",
                  height: "24px",
                  textAlign: "center"
                }}
              >
                Total
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell 
                style={{
                  backgroundColor: "#2A629A",
                  color: "#ffffff",
                  border: "1px solid #000",
                  padding: "4px",
                  height: "24px",
                  textAlign: "center"
                }}
              >
                Community
              </TableCell>
              <TableCell 
                style={{
                  backgroundColor: "#2A629A",
                  color: "#ffffff",
                  border: "1px solid #000",
                  padding: "4px",
                  height: "24px",
                  textAlign: "center"
                }}
              >
                Constituent
              </TableCell>
              <TableCell 
                style={{
                  backgroundColor: "#2A629A",
                  color: "#ffffff",
                  border: "1px solid #000",
                  padding: "4px",
                  height: "24px",
                  textAlign: "center"
                }}
              >
                Private
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(7)].map((_, index) => (
              <TableRow key={index}>
                <TableCell style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>
                  {index + 1}
                </TableCell>
                <TableCell style={{ border: "1px solid #000", padding: "8px" }}></TableCell>
                <TableCell style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}></TableCell>
                <TableCell style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}></TableCell>
                <TableCell style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}></TableCell>
                <TableCell style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}></TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell 
                colSpan={2} 
                style={{ 
                  border: "1px solid #000",
                  padding: "8px",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                Total
              </TableCell>
              <TableCell style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}></TableCell>
              <TableCell style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}></TableCell>
              <TableCell style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}></TableCell>
              <TableCell style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      </>
    
    
  );
  
};


export default ExpiredAccreditedTable;
