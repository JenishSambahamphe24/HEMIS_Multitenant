import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  CardContent,
  Typography,
  TextField,
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
  TableFooter,
  Dialog,
  InputAdornment,
  Box,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import EditExpenditureEntry from "./EditExpenditureEntry";
import DateInputField from "../../DateField/DateInputField";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const IncomeExpenditureEntry = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Watch the Head Type and Expenditure Type fields
  const headType = watch("headType");
  const expenditureType = watch("expenditureType");

  const [loading, setLoading] = useState(false);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [financeHeadData, setFinanceHeadData] = useState([]);
  const [incomeExpData, setIncomeExpData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedExpenditureId, setSelectedExpenditureId] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("all");


  const filteredHeadData = financeHeadData.filter((item) => {
    if (!headType) return false;
    if (headType.toLowerCase() === "income") {
      return item.headType && item.headType.toLowerCase() === "income";
    } else if (headType.toLowerCase() === "expenditure") {
      if (expenditureType) {
        return (
          item.headType &&
          item.headType.toLowerCase() === "expenditure" &&
          item.expenditureType &&
          item.expenditureType.toLowerCase() === expenditureType.toLowerCase()
        );
      }
      return item.headType && item.headType.toLowerCase() === "expenditure";
    }
    return false;
  });

  const calculateTotals = (data) => {
    const totals = {
      income: 0,
      expenditure: 0,
    };

    data.forEach((item) => {
      if (item.headName?.headType?.toLowerCase() === "income") {
        totals.income += item.amount;
      } else if (item.headName?.headType?.toLowerCase() === "expenditure") {
        totals.expenditure += item.amount;
      }
    });

    return totals;
  };

  useEffect(() => {
    if (selectedFiscalYear === "all") {
      setFilteredData(incomeExpData);
    } else {
      const filtered = incomeExpData.filter(
        (item) => item.fiscalYear?.id === selectedFiscalYear
      );
      setFilteredData(filtered);
    }
  }, [selectedFiscalYear, incomeExpData]);

  const fetchIncomeEntryData = async () => {
    try {
      const config = getAuthConfigSafe()
      const [fiscalYearResponse, financeHeadResponse, incomeResponse] =
        await Promise.all([
          axios.get(`${backendUrl}/FiscalYear`, config),
          axios.get(`${backendUrl}/FinanceHead`, config),
          axios.get(`${backendUrl}/IncomeExpenditureEntry`, config),
        ]);

      setFiscalYears(fiscalYearResponse.data);

      setFinanceHeadData(financeHeadResponse.data);

      const incomeExpDataFromResponse = incomeResponse.data;
      setIncomeExpData(incomeExpDataFromResponse);
      setFilteredData(incomeExpDataFromResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data. Please try again.");
    }
  };


  useEffect(() => {
    fetchIncomeEntryData();
  }, []);


  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("headNameId", parseInt(data.headNameID) || 0);
    formData.append("fiscalYearId", data.fiscalYearId);
    formData.append("dateOfEntry", data.dateOfEntry);
    formData.append("amount", parseInt(data.amount) || 0);
    formData.append("evidenceDoc", data.evidenceDocument?.[0] || "");
    formData.append("remarks", data.remarks?.trim() || "");

    try {
      const config = getAuthConfigSafe()
      await axios.post(
        `${backendUrl}/IncomeExpenditureEntry`,
        formData,
        config
      );
      toast.success("Data posted successfully", { autoClose: 1500 });
      reset();
      fetchIncomeEntryData();
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error("Error posting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => {
    setSelectedExpenditureId(id);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    setOpenEditDialog(false);
    fetchIncomeEntryData();
  };

  const toggleTotalVisibility = () => {
    setShowTotal((prevState) => !prevState);
  };

  const handleFiscalYearFilterChange = (event) => {
    setSelectedFiscalYear(event.target.value);
  };

  const totals = calculateTotals(filteredData);

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
                Income & Expenditure Entry Management
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* Head Type Dropdown */}
                  <Grid item xs={12} sm={3}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.headType}
                    >
                      <InputLabel required id="headType-label">
                        Head Type
                      </InputLabel>
                      <Select
                        {...register("headType", { required: true })}
                        id="headType"
                        defaultValue=""
                        label="Head Type"
                      >
                        <MenuItem value="Income">Income</MenuItem>
                        <MenuItem value="Expenditure">Expenditure</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Conditional Expenditure Type Dropdown */}
                  {headType && headType.toLowerCase() === "expenditure" && (
                    <Grid item xs={12} sm={3}>
                      <FormControl
                        fullWidth
                        size="small"
                        error={!!errors.expenditureType}
                      >
                        <InputLabel required id="expenditureType-label">
                          Expenditure Type
                        </InputLabel>
                        <Select
                          {...register("expenditureType", { required: true })}
                          id="expenditureType"
                          defaultValue=""
                          label="Expenditure Type"
                        >
                          <MenuItem value="Capital Expenditure">
                            Capital Expenditure
                          </MenuItem>
                          <MenuItem value="Operating Expenditure">
                            Operating Expenditure
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {/* Dynamic Head Name Dropdown filtered by Head Type */}
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel required id="headNameID-label">
                        Head Name
                      </InputLabel>
                      <Select
                        {...register("headNameID", { required: true })}
                        id="headNameID"
                        defaultValue=""
                        label="Head Name"
                      >
                        {filteredHeadData.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            {item.headName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Fiscal Year Dropdown */}
                  <Grid item xs={12} sm={3}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.fiscalYearId}
                    >
                      <InputLabel required id="fiscalYearId-label">
                        Fiscal Year
                      </InputLabel>
                      <Select
                        {...register("fiscalYearId", { required: true })}
                        id="fiscalYearId"
                        defaultValue=""
                        label="Fiscal Year"
                      >
                        {fiscalYears.map((fy) => (
                          <MenuItem key={fy.id} value={fy.id}>
                            {fy.yearNepali}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Date of Entry */}
                  <Grid item xs={12} sm={3}>
                    <DateInputField
                      label="Date of Entry"
                      name="dateOfEntry"
                      value={watch("dateOfEntry")}
                      onChange={(newValue) => setValue("dateOfEntry", newValue)}
                    />
                  </Grid>

                  {/* Amount Field */}
                  <Grid item xs={12} sm={3}>
                    <TextField
                      {...register("amount", { required: true })}
                      id="amount"
                      required
                      size="small"
                      name="amount"
                      label="Amount"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">Rs.</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Evidence Document */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register("evidenceDocument")}
                      id="evidenceDocument"
                      size="small"
                      name="evidenceDocument"
                      label="Evidence Document"
                      type="file"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Remarks */}
                  <Grid item xs={12}>
                    <TextField
                      {...register("remarks")}
                      id="remarks"
                      size="small"
                      name="remarks"
                      label="Remarks"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ backgroundColor: "#007aff", color: "#inherit" }}
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
              Income & Expenditure Entry List
            </Typography>

            {/* Fiscal Year Filter */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="fiscal-year-filter-label">Filter by Fiscal Year</InputLabel>
                <Select
                  labelId="fiscal-year-filter-label"
                  id="fiscal-year-filter"
                  value={selectedFiscalYear}
                  label="Filter by Fiscal Year"
                  onChange={handleFiscalYearFilterChange}
                >
                  <MenuItem value="all">All Fiscal Years</MenuItem>
                  {fiscalYears.map((fy) => (
                    <MenuItem key={fy.id} value={fy.id}>
                      {fy.yearNepali}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TableContainer>
              <Table
                style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
              >
                <TableHead style={{ backgroundColor: "#2A629A" }}>
                  <TableRow>
                    {[
                      "S.No",
                      "Head Name",
                      "Head Type",
                      "F.Y",
                      "Date of Entry",
                      "Income Amount",
                      "Expenditure Amount",
                      "Remarks",
                      "Action",
                    ].map((header, index) => (
                      <TableCell
                        key={index}
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "8px",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "white" }}>
                  {filteredData.length > 0 ? (
                    filteredData.map((data, index) => (
                      <TableRow key={data.id}>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        >
                          {data?.headName?.headName}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        >
                          {data?.headName?.headType}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        >
                          {fiscalYears.find(
                            (fy) => fy.id === Number(data.fiscalYearId)
                          )?.yearNepali || "N/A"}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        >
                          {data.dateOfEntry.slice(0, 10)}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        >
                          {data?.headName?.headType?.toLowerCase() === "income"
                            ? `Rs. ${data.amount}`
                            : "-"}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        >
                          {data?.headName?.headType?.toLowerCase() === "expenditure"
                            ? `Rs. ${data.amount}`
                            : "-"}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        >
                          {data.remarks}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        >
                          <Button
                            onClick={() => handleEditClick(data?.id)}
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ borderRadius: 2 }}
                            startIcon={<EditNoteIcon />}
                          >
                            Edit
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
                {showTotal && (
                  <TableFooter>
                    <TableRow style={{ backgroundColor: "#f4f4f4" }}>
                      <TableCell
                        colSpan={5}
                        style={{ textAlign: "right", paddingRight: "20px" }}
                      >
                        <strong>Total Amount:</strong>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#2A629A",
                          textAlign: "center",
                        }}
                      >
                        Rs. {totals.income}
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "#2A629A",
                          textAlign: "center",
                        }}
                      >
                        Rs. {totals.expenditure}
                      </TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                    <TableRow style={{ backgroundColor: "#e6f7ff" }}>
                      <TableCell
                        colSpan={5}
                        style={{ textAlign: "right", paddingRight: "20px" }}
                      >
                        <strong>Balance:</strong>
                      </TableCell>
                      <TableCell
                        colSpan={2}
                        style={{
                          fontWeight: "bold",
                          color: totals.income > totals.expenditure ? "green" : "red",
                          textAlign: "center",
                        }}
                      >
                        Rs. {totals.income - totals.expenditure}
                      </TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </TableContainer>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={toggleTotalVisibility}
                sx={{
                  backgroundColor: "#2A629A",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1f7fed",
                    color: "#fff",
                  },
                }}
              >
                {showTotal ? "Hide Total Amount" : "Show Total Amount"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="md"
        >
          <EditExpenditureEntry
            id={selectedExpenditureId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default IncomeExpenditureEntry;