import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

const TeachingNonTeachingTable = ({index, teachingData, nonTeachingData}) => {

  const teachingTotals = teachingData.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      if (key !== "position") {
        acc[key] = (acc[key] || 0) + curr[key];
      }
    });
    return acc;
  }, {});
  const nonTeachingTotals = nonTeachingData.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      if (key !== "position")  {
        acc[key] = (acc[key] || 0) + curr[key];
      }
    });
    return acc;
  }, {});
  return (
    <Box>
      <h3 className="sub-heading mt-4">{index}.1 Teaching staff by gender and contract type by post</h3>
      <TableContainer className='mt-2' component={Paper}>
        <Table size="small" aria-label="teaching-non-teaching-table" sx={{ border: "1px solid black" }}>
          {/* Header */}
          <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
            <TableRow>
              <TableCell
                rowSpan={2}
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", textTransform: "uppercase", padding: "3px", color:'white' }}
              >
                Post
              </TableCell>
              {["Permanent", "Temporary", "Contract", "Part-Time"].map((header, idx) => (
                <TableCell
                  key={idx}
                  colSpan={4}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold", textTransform: "uppercase", padding: "3px", color:'white' }}
                >
                  {header}
                </TableCell>
              ))}
              <TableCell
                rowSpan={2}
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", color:'white', textTransform: "uppercase", padding: "3px" }}
              >
                Grand Total
              </TableCell>
            </TableRow>
            <TableRow>
              {Array(4)
                .fill(["Male", "Female", "Others", "Total"])
                .flat()
                .map((subHeader, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      padding: "3px",
                      border: "1px solid black",
                      fontWeight: "bold",
                      color:'white'
                    }}
                  >
                    {subHeader}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          {/* Body */}
          <TableBody>
            {teachingData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell align="left" sx={{ border: "1px solid black" }}>
                  {row.position}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentMale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentFemale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentOther}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentTotal}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.temporaryMale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.temporaryFemale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.temporaryOther}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.temporaryTotal}
                </TableCell>

                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.contractMale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.contractFemale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.contractOther}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentTotal}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.partTimeMale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.partTimeFemale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.partTimeOther}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.partTimeTotal}
                </TableCell>

                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.grandTotal}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="center" sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                Total
              </TableCell>
              {
                Object.entries(teachingTotals).map(([key, value], index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                    {value}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Non-teaching */}
      <h3 className="sub-heading mt-6">{index}.2 Non-teaching staff by gender and contract type by post</h3>
      <TableContainer className='mt-2' component={Paper}>
        <Table size="small" aria-label="teaching-non-teaching-table" sx={{ border: "1px solid black" }}>
          {/* Header */}
          <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
            <TableRow>
              <TableCell
                rowSpan={2}
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", textTransform: "uppercase", padding: "3px", color:'white' }}
              >
                Post
              </TableCell>
              {["Permanent", "Temporary", "Contract", "Part-Time"].map((header, idx) => (
                <TableCell
                  key={idx}
                  colSpan={4}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold", textTransform: "uppercase", padding: "3px", color:'white' }}
                >
                  {header}
                </TableCell>
              ))}
              <TableCell
                rowSpan={2}
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", textTransform: "uppercase", padding: "3px", color: 'white' }}
              >
                Grand Total
              </TableCell>
            </TableRow>


            <TableRow>
              {Array(4)
                .fill(["Male", "Female", "Others", "Total"])
                .flat()
                .map((subHeader, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      padding: "3px",
                      border: "1px solid black",
                      fontWeight: "bold",
                      color:'white'
                    }}
                  >
                    {subHeader}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          {/* Body */}
          <TableBody>
            {nonTeachingData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell align="left" sx={{ border: "1px solid black" }}>
                  {row.position}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentMale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentFemale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentOther}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentTotal}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.temporaryMale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.temporaryFemale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.temporaryOther}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.temporaryTotal}
                </TableCell>

                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.contractMale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.contractFemale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.contractOther}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.permanentTotal}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.partTimeMale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.partTimeFemale}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.partTimeOther}
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.partTimeTotal}
                </TableCell>

                <TableCell align="center" sx={{ border: "1px solid black" }}>
                  {row.grandTotal}
                </TableCell>
              </TableRow>
            ))}
            <TableRow >
              <TableCell className="table-footer" align="center" sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                Total
              </TableCell>
              {
                Object.entries(nonTeachingTotals).map(([key, value], index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                    {value}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeachingNonTeachingTable;