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


const BuildingDetailsTable = ({ index, sNo, buildingData }) => {
  const grandTotalOfBuilding = buildingData.reduce(
    (total, item) => total + Number(item.areaCoveredByBuilding),
    0
  );
  const grandTotalOfRooms = buildingData.reduce(
    (total, item) => total + Number(item.areaCoveredByAllRooms),
    0
  );
  const grandTotalOfClasses = buildingData.reduce(
    (total, item) => total + Number(item.noOfClassrooms),
    0
  );

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black"}}
      >
        {`${index}.${sNo}`} Building details of campus
      </Typography>

      <TableContainer>
        <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
        >
          <TableHead style={{ backgroundColor: "#2A629A" }}>
            <TableRow>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                  width: "100px",
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
                House Name (Block No)
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Area Covered By Building (sq. ft)
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Number of Classrooms
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Area Covered By all Rooms (sq. ft)
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Ownership of Building
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Has Internet Connection
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
            {buildingData.length > 0 ? (
              buildingData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.houseName}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.areaCoveredByBuilding} sq. ft</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.noOfClassrooms}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.areaCoveredByAllRooms} sq. ft</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>
                    {data.ownershipOfBuilding ? "Yes" : "No"}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>
                    {data.hasInternetConnection ? "Yes" : "No"}
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
            {buildingData.length > 0 && (
              <TableRow className="table-footer">
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight: 'bold'
                  }}
                  colSpan={2}
                >
                  Grand Total
                </TableCell>

                <TableCell
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {grandTotalOfBuilding} sq. ft
                </TableCell>

                <TableCell
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {grandTotalOfClasses}
                </TableCell>
                <TableCell
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {grandTotalOfRooms} sq. ft
                </TableCell>

                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",

                  }}
                >
                  {/* No total */}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",

                  }}
                >
                  {/* No total */}
                </TableCell>

                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",

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

export default BuildingDetailsTable;
