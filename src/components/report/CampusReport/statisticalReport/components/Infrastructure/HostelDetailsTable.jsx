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

const HostelDetailsTable = ({ index, sNo, hostelData }) => {
  const grandTotalOfRooms = hostelData.reduce(
    (total, item) => total + Number(item.noOfRoomsInHostel),
    0
  );
  const grandTotalOfSeats = hostelData.reduce(
    (total, item) => total + Number(item.noOfSeats),
    0
  );
  const grandTotalOfArea = hostelData.reduce(
    (total, item) => total + Number(item.areaCoveredByHostel),
    0
  );

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black", }}
      >
        {`${index}.${sNo}`}  Hostel details of campus
      </Typography>
      <TableContainer>
        <Table
          style={{ borderCollapse: "collapse", border: "1px solid black" }}
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
                Hostel Type
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Number of Rooms in Hostel
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Number of Seats
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Area Covered By Hostels
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
                Playground
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
                Drinking Water
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Toilet
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
            {hostelData.length > 0 ? (
              hostelData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.hostelType}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.noOfRoomsInHostel}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.noOfSeats}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.areaCoveredByHostel} sq. ft
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.buildingId}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.hasPlayground ? "Yes" : "No"}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.hasInternet ? "Yes" : "No"}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.hasDrinkingWater ? "Yes" : "No"}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {data.hasToilet ? "Yes" : "No"}
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
                <TableCell colSpan={9} style={{ textAlign: "center" }}>
                  No Data Available
                </TableCell>
              </TableRow>
            )}
            {hostelData.length > 0 && (
              <TableRow className="table-footer">
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                  colSpan={2}
                >
                  Grand Total
                </TableCell>
                <TableCell
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {grandTotalOfRooms}

                </TableCell>

                <TableCell
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {grandTotalOfSeats}

                </TableCell>
                <TableCell
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {grandTotalOfArea} sq. ft

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

export default HostelDetailsTable;
