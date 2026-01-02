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

const LabDetailsTable = ({ index, sNo, labData }) => {
  const grandTotalOfAreaByLab = labData.reduce(
    (total, item) => total + Number(item.areaCoveredByLab),
    0
  );

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black" }}
      >
        {`${index}.${sNo}`} Lab details of campus
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
                Lab Name
              </TableCell>

              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Building Name (Block No)
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Area Covered By Lab (sq. ft)
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Lab Type
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Adequacy of Lab Equipment
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Internet Connection
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Equipment At Lab
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
            {labData.length > 0 ? (
              labData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.labName}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.buildingName}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.areaCoveredByLab}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.labType}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>
                    {data.adequencyOfLabEquipment ? "Yes" : "No"}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>
                    {data.hasInternetConnection ? "Yes" : "No"}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.equipmentAtLab}</TableCell>
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
            {labData.length > 0 && (
              <TableRow className="table-footer">
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: 'center'
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
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {grandTotalOfAreaByLab} sq. ft
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

export default LabDetailsTable;
