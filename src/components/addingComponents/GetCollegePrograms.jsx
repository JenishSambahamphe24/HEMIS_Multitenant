import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { useState } from "react";

const GetCollegePrograms = ({ programData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedPrograms = programData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <TableContainer style={{ width: "100%" }}>
        <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <TableHead style={{ backgroundColor: "#2A629A" }}>
            <TableRow>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                S.No:
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Level
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Faculty
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Program ID
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Programs
              </TableCell>
              {/* <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Status
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "white" }}>
            {paginatedPrograms.map((program, index) => (
              <TableRow key={program.id} style={{ border: "1px solid #ddd" }}>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    height: "20px",
                  }}
                >
                  {index + 1 + page * rowsPerPage}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    height: "20px",
                  }}
                >
                  {program.levelName}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    height: "20px",
                  }}
                >
                  {program.facultyName}
                </TableCell>
                <TableCell
                  style={{
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "none",
                  }}
                >
                  {program.id}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    height: "20px",
                  }}
                >
                  <Tooltip title={program?.shortName} arrow>
                    {program?.programName}
                  </Tooltip>
                </TableCell>
                {/* <TableCell
                  style={{
                    padding: "8px",
                    color: "green",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "none",
                  }}
                >
                  <span>Active</span>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15, 25]}
        component="div"
        count={programData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default GetCollegePrograms;
