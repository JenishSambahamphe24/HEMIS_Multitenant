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
  capitalize,
} from "@mui/material";
import RolePrevilege from "./RolePrevilege";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { getEmployees } from "../../components/dashboard/services/service";
import EditEmployeeRegister from "./editEmployee/EditEmployee";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import { getDateOnly } from "../../utils/dateUtils";

const NonTechnicalStaff = () => {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getEmployees();
      setEmployeeData(
        response.filter(
          (data) =>
            (data && data.positionType === "Administrative") ||
            data.positionType === "Technical" ||
            data.positionType === "Other"
        )
      );
    } catch (err) {
      throw new Error(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleUpdate = () => {
    fetchData();
  };

  const filteredEmployeeData = employeeData.filter((employee) => {
    const campusName = employee.campus?.campusName || "";
    const universityName = employee.campus?.university?.name || "";
    const code = employee.code || "";

    // Safely apply toLowerCase() by ensuring the value is a string and not undefined or null
    const searchString = searchTerm.toLowerCase();

    return (
      campusName.toLowerCase().includes(searchString) ||
      universityName.toLowerCase().includes(searchString) ||
      code.toLowerCase().includes(searchString) ||
      employee.firstName?.toLowerCase().includes(searchString) ||
      "" ||
      employee.lastName?.toLowerCase().includes(searchString) ||
      "" ||
      employee.email?.toLowerCase().includes(searchString) ||
      employee.postName?.toLowerCase().includes(searchString) ||
      employee.joiningType?.toLowerCase().includes(searchString) ||
      ""
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
  const { currentUser } = useSelector((state) => state.user);

  const handleRoleClick = (employeeId) => {
    setSelectedEmployee(employeeId);
    setOpenRoleDialog(true);
  };
  const handleRoleClose = () => {
    setOpenRoleDialog(false);
  };
  return (
    <>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <h1 className="text-lg font-medium text-[#2b6eb5]">
          List of non-teaching staff
        </h1>
      </Grid>
      {loading ? (
        <LoadingOverlay
          visible={loading}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ color: "#1976d2", type: "bars" }}
        />
      ) : (
        <div style={{ textAlign: "center" }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginBottom: "5px" }}
          >
            <Grid item xs={6} sm={4} md={3}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search ...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        fontSize="small"
                        style={{ color: "#2b6eb5" }}
                      />
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

            <Grid item xs={6} sm={5} md={4} style={{ textAlign: "right" }}>
              <Button
                component={Link}
                to={`/employee-management/employee-register?employeeType=administrator`}
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  padding: "5px 20px 5px 20px",
                  textTransform: "capitalize",
                }}
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
                    "Employee Post",
                    "Citizenship No",
                    "Date of Birth(B.S.)",
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
              <TableBody sx={{ backgroundColor: "white" }}>
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
                        textAlign: "left",
                      }}
                    >
                      {data.firstName || ""} {data.middleName || ""}{" "}
                      {data.lastName || ""}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.postName}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.citizenshipNo}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {getDateOnly(data.dateOFBirth)} B.S.
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {capitalize(data.joiningType)}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.phoneNumber}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.email}
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
                      <Button
                        onClick={() => handleRoleClick(data.id)}
                        variant="contained"
                        padding={-2}
                        size="small"
                        sx={{
                          fontSize: "10px",
                          textTransform: "capitalize",
                          mr: "5px",
                        }}
                      >
                        Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {paginatedData.length === 0 && (
            <Typography color="error">
              {" "}
              No Non-Teaching Staff Recorded
            </Typography>
          )}

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
            maxWidth="lg"
            BackdropProps={{
              invisible: true,
              onClick: (event) => event.stopPropagation(),
            }}
            disableEscapeKeyDown
          >
            <EditEmployeeRegister
              id={selectedEmployee}
              setOpenEditDialog={setOpenEditDialog}
              handleFetch={handleUpdate}
            />
          </Dialog>
          <Dialog
            open={openRoleDialog}
            onClose={() => setOpenRoleDialog(false)}
            maxWidth="lg"
          >
            <RolePrevilege
              id={selectedEmployee}
              open={setOpenRoleDialog}
              handleRoleClose={handleRoleClose}
            />
          </Dialog>
        </div>
      )}
    </>
  );
};

export default NonTechnicalStaff;
