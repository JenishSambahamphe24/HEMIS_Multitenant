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

const ReceiveFellowship = ({data, index, sNo }) => {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black", marginBottom: "10px", marginTop:'10px' }}
      > {`${index}.${sNo}`}  Faculty Member receiving Fellowship:
      </Typography>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small" sx={{ border: "1px solid black" }}>
          {/* Header */}
          <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
            <TableRow>
              <TableCell
                colSpan={4}
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", color:'white' }}
              >
                Fellowship Faculty Members Details
              </TableCell>
              <TableCell
                colSpan={6}
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", color:'white' }}
              >
                Particulars
              </TableCell>
            </TableRow>
            <TableRow>
              {[
                "SNo",
                "Name",
                "Post",
                "Faculty",
                "Fellowship Duration ",
                "Sponsoring Agency",
                "Fellowship Award Date",
                "Fellowship Durtion",
                "Total Fellowship amount",
                "Total Fellowship amount (Rs.)",
              ].map((header, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold", color:'white' }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {
                      index + 1
                    }
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
                    {item.employeePosition}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {
                      item.facultyName
                    }
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
                    {item.fundedBy}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.fundedAt}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.duration}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.fundedAmount}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.fundedAmount}
                  </TableCell>
                </TableRow>
              )
              )
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Note */}
      <Box sx={{ marginTop: "15px", padding: "10px" }}>
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", color: "black" }}
        >
          Does the campus have a   Research Management Cell: Yes [ ]   No   [ ]
        </Typography>

        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", color: "black", textAlign: "center" }}
        >
          Note: Make additional copies of this form if necessary
        </Typography>
      </Box>
    </Box>
  );
};

export default ReceiveFellowship;