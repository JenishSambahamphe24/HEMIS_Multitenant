import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useProgramData from "../../programs/Program";
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
  IconButton,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { toast } from "react-hot-toast";
import axios from "axios";
import { getBatch } from "../../../services/services";
import EditFeeSetup from "./EditFeeSetup";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const FeeType = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const { currentUser } = useSelector((state) => state.user);
  const campusId = currentUser?.institution?.id;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      batch: "",
      programId: "",
      majorSubjectId: "",
      name: "",
      amount: "",
      isActive: true,
    }
  });

  const {
    uniquePrograms,
    uniqueMajorSubjects,
    selectedProgram,
    selectedMajorSubject,
    handleProgramSelect,
    handleMajorSubjectSelect,
    resetSelections,
    programData,
  } = useProgramData();

  const [getBatchData, setGetBatchData] = useState([]);
  const [feeTypeData, setFeeTypeData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Watch form values
  const watchedProgramId = watch("programId");
  const watchedMajorSubjectId = watch("majorSubjectId");

  const fetchBatchData = async () => {
    try {
      const data = await getBatch();
      setGetBatchData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFeeTypes = async (pageNumber = 0, pageSize = 25) => {
    try {
      setLoading(true);
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/FeeType?page=${pageNumber + 1}&pageSize=${pageSize}`,
        config
      );

      if (response.data.data) {
        setFeeTypeData(response.data.data);
        setTotalCount(response.data.totalCount || response.data.pagination?.totalCount || response.data.data.length);
      } else {
        setFeeTypeData(response.data);
        setTotalCount(response.data.length);
      }
    } catch (err) {
      toast.error("Failed to fetch fee types");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchData();
    fetchFeeTypes(page, rowsPerPage);
  }, []);

  useEffect(() => {
    fetchFeeTypes(page, rowsPerPage);
  }, [page, rowsPerPage]);

  // Handle program selection
  const handleProgramChange = (e) => {
    const programId = e.target.value;
    setValue("programId", programId);
    setValue("majorSubjectId", "");

    // Find the selected program object
    const program = programData.find(p => p.programMgmtId === programId);
    if (program) {
      handleProgramSelect(program);
    }
  };

  // Handle major subject selection
  const handleMajorSubjectChange = (e) => {
    const majorSubjectId = e.target.value;
    setValue("majorSubjectId", majorSubjectId);

    // Find the selected major subject object
    const majorSubject = uniqueMajorSubjects.find(ms => ms.id === majorSubjectId);
    if (majorSubject) {
      handleMajorSubjectSelect(majorSubject);
    }
  };

  const resetForm = () => {
    reset({
      batch: "",
      programId: "",
      majorSubjectId: "",
      name: "",
      amount: "",
      isActive: true,
    });
    resetSelections();
  };

const onSubmit = async (data) => {
  try {
    const config = getAuthConfigSafe()
    const submitData = {
      campusId: campusId,
      batchId: data.batch,
      programId: data.programId,
      name: data.name || "",
      majorSubjectId: data.majorSubjectId || "",
      amount: parseFloat(data.amount),
      isActive: Boolean(data.isActive),
    };

    await axios.post(`${backendUrl}/FeeType`, submitData, config);
    toast.success("Fee type added successfully!");
    setPage(0);
    fetchFeeTypes(0, rowsPerPage);
    resetForm();
  } catch (err) {
    // First, log the full error to see what your API returns
    console.log("Full error object:", err);
    console.log("Response status:", err.response?.status);
    console.log("Response data:", err.response?.data);
    
    const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "";
    const status = err.response?.status;
    
    // Check for duplicate errors
    const isDuplicateError = 
      status === 400 || 
      status === 409 ||
      (errorMessage && (
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("already exist")
      ));
    
    if (isDuplicateError) {
      toast.error("Course-specific Fee Type already exists!");
    } else {
      toast.error("Failed to add data!");
    }
    console.error(err);
  }
};

  const handleEditClick = (feeId) => {
    setSelectedFeeId(feeId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchFeeTypes(page, rowsPerPage);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={false} md={1} />
        <Grid item xs={12} md={10}>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Course-specific Fee Type Setup
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    sm={uniqueMajorSubjects?.length > 0 ? 1.2 : 3}
                  >
                    <FormControl fullWidth size="small">
                      <InputLabel required>Batch</InputLabel>
                      <Select
                        {...register("batch", { required: "Batch is required" })}
                        required
                        size="small"
                        label="Batch"
                        fullWidth
                        value={watch("batch")}
                        onChange={(e) => setValue("batch", e.target.value)}
                        error={!!errors.batch}
                      >
                        <MenuItem disabled value="">
                          Select Batch
                        </MenuItem>
                        {getBatchData.length > 0 &&
                          getBatchData.map((batch) => (
                            <MenuItem key={batch.id} value={batch.id}>
                              {batch.batchNepali}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.batch && (
                        <FormHelperText error>{errors.batch.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Programs</InputLabel>
                      <Select
                        {...register("programId", { required: "Program is required" })}
                        required
                        size="small"
                        fullWidth
                        label="Programs"
                        value={watchedProgramId}
                        onChange={handleProgramChange}
                        error={!!errors.programId}
                      >
                        <MenuItem disabled value="">
                          Select Program
                        </MenuItem>
                        {programData && programData.length > 0 &&
                          programData.map((program) => (
                            <MenuItem key={program.id} value={program.programMgmtId}>
                              {program.programName}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.programId && (
                        <FormHelperText error>{errors.programId.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Major Subject Selection */}
                  {uniqueMajorSubjects.length > 0 && (
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Major Subject</InputLabel>
                        <Select
                          {...register("majorSubjectId")}
                          size="small"
                          label="Major Subject"
                          fullWidth
                          value={watchedMajorSubjectId}
                          onChange={handleMajorSubjectChange}
                          error={!!errors.majorSubjectId}
                        >
                          <MenuItem disabled value="">
                            Select Major Subject
                          </MenuItem>
                          {uniqueMajorSubjects.map((subject) => (
                            <MenuItem key={subject.id} value={subject.id}>
                              {subject.majorSubjectName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.majorSubjectId && (
                          <FormHelperText error>{errors.majorSubjectId.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={2.3}>
                    <TextField
                      required
                      {...register("amount", {
                        required: "Amount is required",
                      })}
                      size="small"
                      type="number"
                      label="Total Fee Amount (NPR)"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">RS.</InputAdornment>
                        ),
                      }}
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={1.5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        {...register("isActive")}
                        size="small"
                        label="Status"
                        fullWidth
                        value={watch("isActive")}
                        onChange={(e) => setValue("isActive", e.target.value)}
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
                    style={{ backgroundColor: "#007aff", color: "#inherit" }}
                    disabled={loading}
                  >
                    Save fees
                  </Button>
                </Grid>
              </form>
            </CardContent>
          </Paper>

          <Paper elevation={5} sx={{ borderRadius: "20px", mt: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Fee Types List
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "primary.main" }}>
                    <TableRow>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        S.No.
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Batch
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Program
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Major Subject
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Amount (NPR)
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#FFFFFF",
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ backgroundColor: "white" }}>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : feeTypeData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      feeTypeData.map((fee, index) => (
                        <TableRow key={fee.id}>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "4px" }}
                          >
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "4px" }}
                          >
                            {fee.batchNepali}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "4px" }}
                          >
                            {fee.programName}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "4px" }}
                          >
                            {fee.majorSubjectName}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "4px" }}
                          >
                            Rs. {fee.amount}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "4px" }}
                          >
                            <span
                              style={{
                                color: fee.isActive ? "green" : "red",
                                fontWeight: "bold",
                              }}
                            >
                              {fee.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "4px" }}
                          >
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(fee.id)}
                              >
                                <EditNoteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[25, 50, 75]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={false} md={1} />
      </Grid>

      <Dialog
        maxWidth="lg"
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
      >
        {selectedFeeId && (
          <EditFeeSetup
            feeId={selectedFeeId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        )}
      </Dialog>
    </>
  );
};

export default FeeType;