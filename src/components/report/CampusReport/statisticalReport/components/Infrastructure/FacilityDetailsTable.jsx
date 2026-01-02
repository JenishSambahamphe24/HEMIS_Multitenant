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

const FacilityDetailsTable = ({ index, sNo, regFacilityData }) => {

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black"}}
      >
        {`${index}.${sNo}`}  Facility details of campus
      </Typography>

      <TableContainer>
        <Table style={{ borderCollapse: "collapse", border: "1px solid black" }}
        >
          <TableHead style={{ backgroundColor: "#2A629A" }}>
            <TableRow>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                  width: '5%'
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
                Facility Type
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Facility Availability
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Adequancy of Facility
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
            {regFacilityData.length > 0 ? (
              regFacilityData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.facilityType}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>
                    {data.facilityAvailability ? "true" : "false"}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>
                    {data.adequacyOfFacility ? "true" : "false"}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.remarks}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} style={{ textAlign: "center" }}>
                  No Data Available
                </TableCell>
              </TableRow>
            )}
            {regFacilityData.length > 0 && (
              <TableRow className="table-footer">
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: 'center',
                    fontWeight:'bold'
                  }}
                  colSpan={2}
                >
                  Grand Total
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    backgroundColor: "lightgrey",
                  }}
                >
                  {/* No total */}
                </TableCell>

                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    backgroundColor: "lightgrey",
                  }}
                >
                  {/* No total */}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    backgroundColor: "lightgrey",
                  }}
                >
                  {/* No total */}
                </TableCell>




              </TableRow>
            )}

          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default FacilityDetailsTable;
