import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const LandDetailsTable = ({ sNo, index, landData }) => {
  
  const grandTotal = landData.reduce(
    (total, item) => total + Number(item.totalArea),
    0
  );

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black" }}
      >
        {index}.{sNo} Land details of campus
      </Typography>
      <TableContainer>
        <Table style={{ borderCollapse: "collapse", border: "1px solid black" }}>
          <TableHead style={{ backgroundColor: "#2A629A" }}>
            <TableRow>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                S.No
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Kitta No.
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Total Area (sq. ft)
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Area Unit
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Ownership
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Sheet No. of Land
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Remarks
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {landData.length > 0 ? (
              landData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.kittaNo}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.totalArea} sq. ft
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.unit}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.ownerShip ? "Yes" : "No"}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.sheetNo}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.remarks}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  style={{
                    border: "1px solid black",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  No Data Available
                </TableCell>
              </TableRow>
            )}

            {landData.length > 0 && (
              <TableRow className="table-footer">
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                  colSpan={2}
                >
                  Grand Total
                </TableCell>
                <TableCell
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {grandTotal}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >

                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LandDetailsTable;
