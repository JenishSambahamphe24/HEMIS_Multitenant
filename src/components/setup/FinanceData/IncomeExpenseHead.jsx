import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Paper,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Dialog,
  Box,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import EditExpenseHead from "./EditExpenseHead";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const IncomeExpenseHead = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [IncomeHeadData, setIncomeHeadData] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const headType = watch("headType");
  const fetchIncomeHeadData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/FinanceHead`, config);
      setIncomeHeadData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchIncomeHeadData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);

    const apiHeadData = {
      headCode: parseInt(data.headCode) || 0,
      headType: data.headType,
      expenditureType:
        data.headType === "Expenditure" ? data.expenditureType : null,
      headName: data.headName.trim(),
      remarks: data.remarks?.trim() || "",
    };
    try {
      const config = getAuthConfigSafe()
      await axios.post(`${backendUrl}/FinanceHead`, apiHeadData, config);
      toast.success("Data posted successfully");
      reset();
      fetchIncomeHeadData();
    } catch (error) {
      toast.error("Error posting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchIncomeHeadData();
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={false} md={1} />
        <Grid item xs={12} md={10}>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Income & Expense Head Management
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* Head Code */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="headCode"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Head Code is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          fullWidth
                          size="small"
                          id="headCode"
                          label="Head Code"
                          error={!!errors.headCode}
                          helperText={errors.headCode?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Head Type */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="headType"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Head Type is required" }}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          size="small"
                          error={!!errors.headType}
                        >
                          <InputLabel required id="headType-label">
                            Head Type
                          </InputLabel>
                          <Select
                            {...field}
                            label="Head Type"
                            id="headType"
                            labelId="headType-label"
                          >
                            <MenuItem value="Income">Income </MenuItem>
                            <MenuItem value="Expenditure">
                              Expenditure{" "}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Expenditure Type (conditionally displayed) */}
                  {headType === "Expenditure" && (
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name="expenditureType"
                        control={control}
                        defaultValue=""

                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            size="small"
                            error={!!errors.expenditureType}
                          >
                            <InputLabel required={headType === "Expenditure"} id="expenditureType-label">
                              Expenditure Type
                            </InputLabel>
                            <Select
                              {...field}
                              required={headType === "Expenditure"}
                              label="Expenditure Type"
                              id="expenditureType"
                              labelId="expenditureType-label"
                            >
                              <MenuItem value="Operating Expenditure">
                                Operating Expenditure
                              </MenuItem>
                              <MenuItem value="Capital Expenditure">
                                Capital Expenditure
                              </MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="headName"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          label="Head Name"
                          id="headName"
                          error={!!errors.headName}
                          helperText={errors.headName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="remarks"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          label="Remarks"
                          id="remarks"
                          error={!!errors.remarks}
                          helperText={errors.remarks?.message}
                        />
                      )}
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
                    variant="contained"
                    style={{ backgroundColor: "#007aff", color: "#inherit" }}
                    disabled={loading}
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
              Income & Expense Head List
            </Typography>
            <TableContainer>
              <Table
                style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
              >
                <TableHead style={{ backgroundColor: "#2A629A" }}>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      S.No
                    </TableCell>

                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Head Type
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Expenditure Type
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Head Code
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Head Name
                    </TableCell>

                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Remarks
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "white" }}>
                  {IncomeHeadData.length > 0 ? (
                    IncomeHeadData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.headType}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.expenditureType || "-"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.headCode}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.headName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.remarks}
                        </TableCell>

                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          <Button
                            onClick={() => handleEditClick(data.id)}
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{
                              borderRadius: 2,
                            }}
                          >
                            {" "}
                            <EditNoteIcon /> Edit
                          </Button>
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
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="md"
        >
          <EditExpenseHead
            id={selectedExpenseId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default IncomeExpenseHead;
