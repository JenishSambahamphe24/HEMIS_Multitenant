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
} from "@mui/material";


const EquipDetailsTable = ({ index, sNo, equipData }) => {
 

  const grandTotalQuantity = equipData.reduce(
    (total, item) => total + Number(item.noOfQty),
    0
  );

  return (
    <Box>

      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black" }}
      >
        {`${index}.${sNo}`}  Equipment details of campus
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
                  width: '5%'
                }}
              >
                S.No.
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Category
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Item Name
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Quantity
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Item Description
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
            {equipData.length > 0 ? (
              equipData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}> <p style={{ textTransform: 'uppercase' }}>{data.itemType}</p></TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.itemName}</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.noOfQty} Qty.</TableCell>
                  <TableCell style={{ border: "1px solid black", padding: "8px" }}>{data.itemDescription}</TableCell>
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
            {equipData.length > 0 && (
              <TableRow className="table-footer">
                <TableCell
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight:'bold',
                    textAlign:'center'
                  }}
                  colSpan={2}
                >
                  Grand Total
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
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {grandTotalQuantity} Qty.
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

export default EquipDetailsTable;
