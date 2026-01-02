import React, { useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  Chip,
  Button,
  Paper,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { blue } from "@mui/material/colors";

import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import EditDepartment from "./EditDepartment";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const DepartmentAdd = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [data, setData] = useState({
    departmentName: "",
    status: true,
    remarks: "",
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const fetchData = async () => {
    const config = getAuthConfigSafe();
    try {
      const response = await axios.get(
        `${backendUrl}/Management/Departments`,
        config
      );
      setDepartmentData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = getAuthConfigSafe();
      await axios.post(`${backendUrl}/Management/AddDepartment`, data, config);
      setData({
        departmentName: "",
        status: true,
        remarks: "",
      });
      fetchData();

      toast.success("Successfully Added");
    } catch (err) {
      if (err.status === 409) {
        toast.error("Same Department Already Exists!!");
      }
      console.error("Error during API call:", err);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (empPostId) => {
    setSelectedItemId(empPostId);
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    fetchData();
  };

  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          mx: "auto",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          maxWidth: "800px",
        }}
      >
        <Typography
          variant="h6"
          component="p"
          style={{
            color: blue[700],
            textAlign: "center",
            padding: "10px",
            textTransform: "uppercase",
          }}
        >
          Add New Department
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={3}
            sx={{
              marginBottom: "20px",
            }}
          >
            <Grid item xs={12} md={4}>
              <TextField
                required
                id="departmentName"
                size="small"
                name="departmentName"
                label="Department Name"
                fullWidth
                value={data.departmentName}
                onChange={(e) =>
                  setData({ ...data, departmentName: e.target.value })
                }
                autoComplete="given-name"
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: blue[500],
                    },
                    "&:hover fieldset": {
                      borderColor: blue[700],
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  required
                  id="status"
                  size="small"
                  name="status"
                  label="Status"
                  value={data.status}
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem value={true}>
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value={false}>
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                id="remarks"
                size="small"
                name="remarks"
                label="Remarks"
                fullWidth
                value={data.remarks}
                onChange={(e) => setData({ ...data, remarks: e.target.value })}
                autoComplete="given-name"
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: blue[500],
                    },
                    "&:hover fieldset": {
                      borderColor: blue[700],
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent="center" marginTop={2}>
            <Grid item xs={12} md={3}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: blue[700],
                  color: "white",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: blue[800],
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Container maxWidth="md">
        <Typography
          variant="body1"
          color="#2b6eb5"
          gutterBottom
          textAlign={"center"}
          padding={2}
          sx={{fontSize:"1.5rem"}}
        >
          Department List
        </Typography>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: blue[700] }}>
                <TableCell
                  style={{
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  S.No.
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Department Name
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Remarks
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #c2c2c2",
                    padding: "4px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {departmentData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.id}
                    style={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "left",
                      color: "white",
                    }}
                  >
                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {index + 1}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {row.departmentName}
                    </TableCell>

                    {row?.status ? (
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <Chip label="Active" color="success" size="small" />
                      </TableCell>
                    ) : (
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <Chip label="Inactive" color="error" size="small" />
                      </TableCell>
                    )}

                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {row.remarks}
                    </TableCell>

                    <TableCell
                      style={{
                        border: "1px solid #c2c2c2",
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      <Button onClick={() => handleEditClick(row.id)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10,20,100]}
          component="div"
          count={departmentData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>

      <EditDepartment
        id={selectedItemId}
        open={openEditDialog}
        handleClose={handleClose}
      />
    </div>
  );
};

export default DepartmentAdd;
