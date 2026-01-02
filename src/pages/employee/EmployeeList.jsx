import React, { useEffect, useState } from "react";
import {
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  TextField,
  InputAdornment,
  Typography,
  Pagination,
  Stack,
  Dialog,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { getEmployees } from "../../components/dashboard/services/service";
import EditEmployeeRegister from "./editEmployee/EditEmployee";

const EmployeeList = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployees();
        setEmployeeData(response);
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredEmployeeData = employeeData.filter((employee) => {
    const campusName = employee.campus?.campusName || "";
    const universityName = employee.campus?.university?.name || "";
    const code = employee.code || "";

    return (
      campusName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination calculations
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = filteredEmployeeData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const handleEditClick = (employeeId) => {
    setSelectedEmployee(employeeId);
    setOpenEditDialog(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: "5px" }}
      >
        <Grid item xs={9} sm={5} md={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search name, type, code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" style={{ color: "#2b6eb5" }} />
                </InputAdornment>
              ),
              style: {
                height: "36px",
                padding: "0 10px",
                fontSize: "13px",
              },
            }}
            fullWidth
            sx={{
              border: "1px solid #2b6eb5",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                height: "36px",
                "& fieldset": {
                  borderRadius: "5px",
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: "14px",
              },
              "& .MuiInputBase-input": {
                padding: "6px 12px",
              },
            }}
          />
        </Grid>
        <Grid item xs={3} sm={2} md={4} style={{ textAlign: "center" }}>
          <Typography
            sx={{ fontSize: "24px", color: "#2b6eb5", padding: "10px" }}
          >
            List Of Employees
          </Typography>
        </Grid>
        <Grid item xs={3} sm={4} md={2} style={{ textAlign: "right" }}>
          <Button
            component={Link}
            to="/employee-register"
            variant="contained"
            color="primary"
            size="small"
            sx={{ padding: "5px 20px 5px 20px", textTransform: "capitalize" }}
          >
            Add Employee
          </Button>
          {/* <FilterIcon /> */}
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead style={{ backgroundColor: "#2A629A" }}>
            <TableRow>
              {[
                "S.No.",
                "Full Name",
                "Campus Name",
                "Employee Type",
                "Citizenship No",
                "Org ID",
                "Date of Birth",
                "Position",
                "Joining Type",
                "Work Phone",
                "Work Email",
                "Action",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  style={{
                    color: "#ffffff",
                    border: "1px solid #ddd",
                    padding: "4px",
                    height: "24px",
                    textAlign: "center",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((data, index) => (
              <TableRow key={data.id}>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {indexOfFirstRow + index + 1}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.user?.salutation || ""}. {data.user?.firstName || ""}{" "}
                  {data.user?.middleName || ""} {data.user?.lastName || ""}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.campus?.campusName}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.employeeType}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.citizenshipNo}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.orgId}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.dateOFBirth}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.position}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.joiningType}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.workPhone}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {data.workEmail}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  <Button
                    onClick={() => handleEditClick(data.id)}
                    variant="contained"
                    padding={-2}
                    size="small"
                    sx={{
                      fontSize: "10px",
                      textTransform: "capitalize",
                      mr: "5px",
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} alignItems="center">
        <Pagination
          count={Math.ceil(filteredEmployeeData.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          shape="rounded"
          sx={{ padding: "10px" }}
        />
      </Stack>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        BackdropProps={{
          invisible: true,
          onClick: (event) => event.stopPropagation(),
        }}
        disableEscapeKeyDown
      >
        <EditEmployeeRegister
          id={selectedEmployee}
          setOpenEditDialog={setOpenEditDialog}
        />
      </Dialog>
    </div>
  );
};

export default EmployeeList;
