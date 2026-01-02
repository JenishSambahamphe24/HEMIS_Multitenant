import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Button,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { toast } from "react-toastify";
import axios from "axios";
import EditGeneralFeeType from "./EditGeneralFeeType";
import { useSelector } from "react-redux";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const GeneralFeeType = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const { currentUser } = useSelector((state) => state.user);
  const campusId = currentUser.institution.id;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [feeTypeData, setFeeTypeData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);

  const selectedFeeType = watch("feeType");

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/GeneralFeeType?pageNumber=1&pageSize=1000`, config);
      const data = response.data.data || [];
      setFeeTypeData(data);
      setTotalRecords(response.data.totalRecords || data.length);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data!");
      setFeeTypeData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataWithServerPagination = async (pageNum = 1, pageSize = 15) => {
    try {
      setLoading(true);
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/GeneralFeeType?pageNumber=${pageNum}&pageSize=${pageSize}`,
        config
      );
      const data = response.data.data || [];
      setFeeTypeData(data);
      setTotalRecords(response.data.totalRecords || 0);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data!");
      setFeeTypeData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Choose which fetch method to use
  // For small datasets (< 1000 records), use fetchAllData
  // For large datasets, use fetchDataWithServerPagination
  const fetchData = fetchAllData; // Change this to fetchDataWithServerPagination if needed

  useEffect(() => {
    fetchData();
  }, []);

  // For server-side pagination, fetch data when page changes
  useEffect(() => {
    if (fetchData === fetchDataWithServerPagination) {
      fetchDataWithServerPagination(page + 1, rowsPerPage);
    }
  }, [page, rowsPerPage]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = {
        id: 0,
        campusId: campusId,
        feeType: data.feeType,
        feeName: data.name,
        amount: data.feeType === "courseFee" ? 0 : parseFloat(data.amount) || 0,
        status: Boolean(data.isActive),
        remarks: data.remarks || "",
      };
      const config = getAuthConfigSafe()
      
      await axios.post(`${backendUrl}/GeneralFeeType`, formData, config);
      toast.success("Data added successfully!", {
        autoClose: 2000,
      });

      if (fetchData === fetchAllData) {
        await fetchData();
      } else {
        setPage(0);
        await fetchDataWithServerPagination(1, rowsPerPage);
      }

      reset();
    } catch (err) {
      console.error("Error adding data:", err);
      toast.error("Failed to add data!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (generalId) => {
    setSelectedFeeId(generalId);
    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    if (fetchData === fetchAllData) {
      await fetchData();
    } else {
      await fetchDataWithServerPagination(page + 1, rowsPerPage);
    }
    setOpenEditDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const getDisplayData = () => {
    if (fetchData === fetchAllData) {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return feeTypeData.slice(startIndex, endIndex);
    } else {
      return feeTypeData;
    }
  };

  const paginatedData = getDisplayData();
  const startIndex = fetchData === fetchAllData ? page * rowsPerPage : (page * rowsPerPage);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={false} md={2} />
        <Grid item xs={12} md={8}>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Fee Items
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Fee Type</InputLabel>
                      <Select
                        {...register("feeType", { required: "Fee type is required" })}
                        size="small"
                        label="Fee Type"
                        fullWidth
                        defaultValue=""
                        error={!!errors.feeType}
                      >
                        <MenuItem disabled value="">
                          Select Fee Type
                        </MenuItem>
                        <MenuItem value="generalFee">General Fee</MenuItem>
                        <MenuItem value="courseFee">Course Specific Fee</MenuItem>
                      </Select>
                    </FormControl>
                    {errors.feeType && (
                      <Typography variant="caption" color="error">
                        {errors.feeType.message}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={selectedFeeType === "courseFee" ? 6 : 4}>
                    <TextField
                      required
                      {...register("name", { required: "Name is required" })}
                      size="small"
                      type="text"
                      label="Fee Item Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>

                  {selectedFeeType !== "courseFee" && (
                    <Grid item xs={12} sm={3}>
                      <TextField
                        required
                        {...register("amount", {
                          required: "Amount is required",
                          min: {
                            value: 0,
                            message: "Amount must be positive"
                          }
                        })}
                        size="small"
                        type="number"
                        label="Amount (NPR)"
                        fullWidth
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Rs.
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={selectedFeeType === "courseFee" ? 3 : 2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        {...register("isActive")}
                        size="small"
                        label="Status"
                        fullWidth
                        defaultValue={true}
                      >
                        <MenuItem value={true}>
                          <span style={{ color: "green" }}>Active</span>
                        </MenuItem>
                        <MenuItem value={false}>
                          <span style={{ color: "red" }}>Inactive</span>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      {...register("remarks")}
                      size="small"
                      label="Remarks"
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Enter any remarks..."
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  style={{
                    margin: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    disabled={loading}
                    style={{
                      backgroundColor: "#007aff",
                      color: "white",
                      minWidth: "100px"
                    }}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Grid>
              </form>
            </CardContent>
          </Paper>

          <Grid margin="10px">
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", color: "#2A629A" }}
            >
              List of Fee Items
            </Typography>



            <TableContainer component={Paper}>
              <Table
                style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
              >
                <TableHead style={{ backgroundColor: "#2A629A" }}>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                        width: "5%",
                        fontWeight: "bold"
                      }}
                    >
                      S.No
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold"
                      }}
                    >
                      Fee Type
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold"
                      }}
                    >
                      Fee Type Name
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold"
                      }}
                    >
                      Fee Amount (NPR)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold"
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                        fontWeight: "bold"
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "white" }}>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          border: "1px solid #ddd"
                        }}
                      >
                        Loading data...
                      </TableCell>
                    </TableRow>
                  ) : paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          border: "1px solid #ddd"
                        }}
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((data, index) => (
                      <TableRow key={data.id || index}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.feeType === "courseFee" || data.feeType === "Course Fee"
                            ? "Course Specific Fee"
                            : data.feeType === "generalFee"
                              ? "General Fee"
                              : data.feeType || "General Fee"
                          }
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.feeName || "N/A"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.feeType === "courseFee"
                            ? "N/A"
                            : `Rs. ${data.amount?.toLocaleString() || 0}`
                          }
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.status ? (
                            <span style={{ color: "green", fontWeight: "bold" }}>
                              Active
                            </span>
                          ) : (
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              Inactive
                            </span>
                          )}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <Button
                            onClick={() => handleEditClick(data.id)}
                            size="small"
                            variant="outlined"
                            startIcon={<EditNoteIcon />}
                            style={{
                              color: "#2A629A",
                              borderColor: "#2A629A"
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[15, 25, 50, 100]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                }
              />
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        maxWidth="md"
        fullWidth
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
      >
        <EditGeneralFeeType
          id={selectedFeeId}
          onClose={() => setOpenEditDialog(false)}
          onUpdate={handleUpdate}
        />
      </Dialog>
    </>
  );
};

export default GeneralFeeType;