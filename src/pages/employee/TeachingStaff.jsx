import { useEffect, useState } from "react";
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
  Box,
} from "@mui/material";
import RolePrevilege from "./RolePrevilege";
import { Link, useNavigate } from "react-router-dom";
import { LoadingOverlay } from "@mantine/core";
import SearchIcon from "@mui/icons-material/Search";
import { getEmployees } from "../../components/dashboard/services/service";
import EditEmployeeRegister from "./editEmployee/EditEmployee";
import { useSelector } from "react-redux";
import Signature from "../Signature/Signature";

const TeachingStaff = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddSignatureDialog, setOpenAddSignatureDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getEmployees();
      setEmployeeData(
        response.filter((data) => data && data.positionType === "Teaching")
      );
    } catch (err) {
      console.error("Error fetching employee data:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFetch = () => {
    fetchData();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRoleClick = (id) => {
    setSelectedEmployee(id);
    setOpenRoleDialog(true);
  };

  const filteredEmployeeData = employeeData.filter((employee) => {
    const campusName = employee.campus?.campusName || "";
    const universityName = employee.campus?.university?.name || "";
    const code = employee.code || "";
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

  const handleAddSignature = (employeeId) => {
    setSelectedEmployee(employeeId);
    setOpenAddSignatureDialog(true);
  };

  const handleSignatureClose = () => {
    setOpenAddSignatureDialog(false);
  };
  const handleRoleClose = () => {
    setOpenRoleDialog(false);
  };

  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;
  const isButtonDisabled = roleName === "Admin";
  return (
    <>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <h1 className="text-lg font-medium text-[#2b6eb5]">
          List of Registered Teaching staff
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
                placeholder="Search name, type, code"
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
                to="/employee-management/employee-register?employeeType=teaching"
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  padding: "5px 20px 5px 20px",
                  textTransform: "capitalize",
                }}
                disabled={isButtonDisabled}
              >
                Add teaching staff
              </Button>
            </Grid>
          </Grid>
          <TableContainer>
            <Table>
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  {[
                    "S.No.",
                    "Full Name",
                    "Position",
                    "Citizenship No",
                    "DOB (B.S.)",
                    "Joining",
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
              <TableBody sx={{ bgcolor: "white" }}>
                {paginatedData.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {indexOfFirstRow + index + 1}
                    </TableCell>

                    <TableCell
                      style={{
                        width: "15%",
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {data.salutation || ""} {data.firstName || ""}{" "}
                      {data.middleName || ""} {data.lastName || ""}
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
                      {data.dateOFBirth ? data.dateOFBirth.split('T')[0] : ''}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {capitalize(data?.joiningType)}
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
                        textAlign: "left",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          onClick={() => handleEditClick(data.id)}
                          variant="contained"
                          size="small"
                          disabled={isButtonDisabled}
                          sx={{
                            fontSize: "10px",
                            textTransform: "capitalize",
                            mr: "5px",
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleAddSignature(data.id)}
                          variant="contained"
                          size="small"
                          disabled={isButtonDisabled}
                          sx={{
                            fontSize: "10px",
                            textTransform: "capitalize",
                            mr: "5px",
                          }}
                        >
                          Add sign
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleRoleClick(data.id)}
                          size="small"
                          disabled={isButtonDisabled}
                          sx={{
                            fontSize: "10px",
                            textTransform: "capitalize",
                            mr: "5px",
                          }}
                        >
                          Role
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate(
                              `/employee-management/documents/${data.id}`
                            )
                          }
                          size="small"
                          sx={{
                            minWidth: "84px",
                            fontSize: "10px",
                            textTransform: "capitalize",
                          }}
                        >
                          View Docs
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {paginatedData.length === 0 && (
            <Typography color="error"> Teaching Staff Not Recorded</Typography>
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
              handleFetch={handleFetch}
            />
          </Dialog>
          {/* Add signature dialog */}
          <Dialog
            open={openAddSignatureDialog}
            onClose={() => setOpenAddSignatureDialog(false)}
            maxWidth="lg"
          >
            <Signature
              id={selectedEmployee}
              setOpenAddSignatureDialog={setOpenAddSignatureDialog}
              handleSignatureClose={handleSignatureClose}
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

export default TeachingStaff;
