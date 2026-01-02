import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  CardContent,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getBatch,
  getFiscalYearForSelection,
  getProgramByCollegeId,
} from "../../../services/services";
import { getDynamicReceiptNumber } from "../../dashboard/services/service";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import BikramSambatDateInput from "../../DateField/DateInputField";
import {config} from '@config';

const campusId = config.VITE_CAMPUSID;


const ReceiptForOthers = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const {
    control,
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      fiscalYearId: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [loadingFeeTypes, setLoadingFeeTypes] = useState(false);
  const [loadingReceiptNo, setLoadingReceiptNo] = useState(false); // New loading state for receipt number
  const [batchId, setBatchId] = useState("");
  const [allBatch, setAllBatch] = useState([]);
  const [fiscalYears, setAllFiscalYears] = useState([]);
  const [allPrograms, setAllprograms] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [generalFeeTypes, setGeneralFeeTypes] = useState([]);
  const [receiptNo, setReceiptNo] = useState("");
  const [selectedFeeItems, setSelectedFeeItems] = useState([]);
  const [feeAmounts, setFeeAmounts] = useState({});
  const [selectedGeneralFeeItems, setSelectedGeneralFeeItems] = useState([]);
  const [generalFeeAmounts, setGeneralFeeAmounts] = useState({});

  const watchedValues = watch([
    "batchId",
    "programName",
    "programType",
    "year",
    "semester",
    "fiscalYearId", // Add fiscalYearId to watched values
  ]);
  const [
    batchIdWatch,
    programNameWatch,
    programTypeWatch,
    yearWatch,
    semesterWatch,
    fiscalYearIdWatch, // Add fiscalYearId watch
  ] = watchedValues;

  // Find the active fiscal year
  const activeFiscalYear = Array.isArray(fiscalYears)
    ? fiscalYears.find((item) => item.activeFiscalYear === true)
    : null;

  // Function to fetch dynamic receipt number
  const fetchReceiptNumber = async (fiscalYearId) => {
    if (!fiscalYearId) {
      setReceiptNo("1");
      return;
    }

    setLoadingReceiptNo(true);
    try {
      const response = await getDynamicReceiptNumber({
        campusId: campusId,
        fiscalYearId: fiscalYearId,
      });

      if (response && Array.isArray(response) && response.length > 0) {
        const nextReceiptNo = response[0].nextReceiptNo || 1;
        setReceiptNo(nextReceiptNo.toString());
      } else {
        setReceiptNo("1");
      }
    } catch (error) {
      console.error("Error fetching receipt number:", error);
      setReceiptNo("1");
    } finally {
      setLoadingReceiptNo(false);
    }
  };
  


  const getInitialParams = async () => {
    try {
      const batchResponse = await getBatch();
      const fiscalResponse = await getFiscalYearForSelection();
      const programResponse = await getProgramByCollegeId(campusId);

      setAllBatch(Array.isArray(batchResponse) ? batchResponse : []);
      setAllFiscalYears(Array.isArray(fiscalResponse) ? fiscalResponse : []);
      setAllprograms(Array.isArray(programResponse) ? programResponse : []);

    } catch (error) {
      setAllBatch([]);
      setAllFiscalYears([]);
      setAllprograms([]);
    }
  };

  const fetchGeneralFeeTypes = async () => {
    try {
      const config = getAuthConfigSafe();
      const response = await axios.get(
        `${backendUrl}/GeneralFeeType?pageNumber=1&pageSize=100`,
        config
      );

      if (response.data && response.data.data) {
        setGeneralFeeTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching general fee types:", error);
      setGeneralFeeTypes([]);
    }
  };

  const fetchFeeTypes = async (batchId, programId, year, semester) => {
    if (!batchId || !programId) {
      setFeeTypes([]);
      return;
    }

    setLoadingFeeTypes(true);
    try {
      const config = getAuthConfigSafe();
      const params = new URLSearchParams({
        BatchId: batchId,
        ProgramId: programId,
        page: 1,
        pageSize: 100,
      });
      const response = await axios.get(
        `${backendUrl}/FeeType?${params.toString()}`,
        config
      );

      if (response.data && response.data.data) {
        setFeeTypes(response.data.data);
      } else {
        setFeeTypes([]);
      }
    } catch (error) {
      console.error("Error fetching fee types:", error);
      setFeeTypes([]);
    } finally {
      setLoadingFeeTypes(false);
    }
  };

  // Effect to set active fiscal year and fetch receipt number
  useEffect(() => {
    if (activeFiscalYear) {
      setValue("fiscalYearId", activeFiscalYear.id);
      fetchReceiptNumber(activeFiscalYear.id);
    }
  }, [activeFiscalYear, setValue]);

  useEffect(() => {
    getInitialParams();
    fetchGeneralFeeTypes();
  }, []);

  useEffect(() => {
    if (batchIdWatch && programNameWatch) {
      setSelectedFeeItems([]);
      setFeeAmounts({});
      fetchFeeTypes(batchIdWatch, programNameWatch, yearWatch, semesterWatch);
    }
  }, [batchIdWatch, programNameWatch, yearWatch, semesterWatch]);

  // New effect to handle fiscal year changes
  useEffect(() => {
    if (fiscalYearIdWatch) {
      fetchReceiptNumber(fiscalYearIdWatch);
    }
  }, [fiscalYearIdWatch]);

  const handleFeeItemChange = (feeId, feeAmount) => {
    setSelectedFeeItems((prev) => {
      if (prev.includes(feeId)) {
        const newSelectedFeeItems = prev.filter((id) => id !== feeId);
        const { [feeId]: _, ...newFeeAmounts } = feeAmounts;
        setFeeAmounts(newFeeAmounts);
        return newSelectedFeeItems;
      } else {
        const newFeeAmounts = { ...feeAmounts, [feeId]: feeAmount };
        setFeeAmounts(newFeeAmounts);
        return [...prev, feeId];
      }
    });
  };

  const handleGeneralFeeItemChange = (feeId, feeAmount) => {
    setSelectedGeneralFeeItems((prev) => {
      if (prev.includes(feeId)) {
        const newSelected = prev.filter((id) => id !== feeId);
        const { [feeId]: _, ...newAmounts } = generalFeeAmounts;
        setGeneralFeeAmounts(newAmounts);
        return newSelected;
      } else {
        const newAmounts = { ...generalFeeAmounts, [feeId]: feeAmount };
        setGeneralFeeAmounts(newAmounts);
        return [...prev, feeId];
      }
    });
  };

  const onSubmit = async (data) => {
    if (
      (!selectedFeeItems || selectedFeeItems.length === 0) &&
      (!selectedGeneralFeeItems || selectedGeneralFeeItems.length === 0)
    ) {
      toast.error("Please select at least one fee item.");
      return;
    }

    let receiptItems = [];
    selectedFeeItems.forEach((feeId) => {
      const fee = feeTypes.find((f) => f.id === feeId);
      receiptItems.push({
        FeeTypeId: feeId,
        Amount: feeAmounts[feeId] || fee?.amount || 0,
        Remarks: data.remarks || "",
        receiptType: "Course-specific Fee",
      });
    });

    selectedGeneralFeeItems.forEach((feeId) => {
      const fee = generalFeeTypes.find((f) => f.id === feeId);
      receiptItems.push({
        generalFeeTypeId: feeId,
        Amount: generalFeeAmounts[feeId] || fee?.amount || 0,
        Remarks: data.remarks || "",
        receiptType: "General Fee",
      });
    });

    const formData = new FormData();
    formData.append("receiptNo", receiptNo);
    formData.append("fiscalYearID", data.fiscalYearId);
    formData.append("studentID", 0);
    formData.append("programMgmtId", data?.programName);
    formData.append("fullName", data.studentName);
    formData.append("campusId", campusId || 0);

    receiptItems.forEach((item, index) => {
      formData.append(
        `ReceiptItemCreateDto[${index}].feeTypeId`,
        item.FeeTypeId || 0
      );
      formData.append(
        `ReceiptItemCreateDto[${index}].generalFeeTypeId`,
        item.generalFeeTypeId || 0
      );
      formData.append(`ReceiptItemCreateDto[${index}].Amount`, item.Amount);
      formData.append(`ReceiptItemCreateDto[${index}].Remarks`, item.Remarks);
      formData.append(
        `ReceiptItemCreateDto[${index}].receiptType`,
        item.receiptType
      );
    });
    formData.append("dateOfPayment", data.dateOfPayment);
    if (data.uploadApplication && data.uploadApplication[0]) {
      formData.append("uploadApplication", data.uploadApplication[0]);
    }
    try {
      setLoading(true);
      const config = getAuthConfigSafe();
      const response = await axios.post(
        `${backendUrl}/Receipt/GenerateReceipt`,
        formData,
        config
      );
      if (response.status === 201) {
        toast.success("Data posted successfully", { autoClose: 1500 });
        const receiptId = response?.data?.id;
        navigate(`/receipt-management/receipt-details/${receiptId}`);
      }
      reset();
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message === "Receipt No already exists.") {
        toast.error("Receipt No already exists.");
      } else if (error.status === 409) {
        toast.error("Duplicate Entry");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Grid container spacing={0} marginTop="10px">
        <Grid item xs={false} md={1} />
        <Grid item xs={12} md={10}>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  textAlign: "center",
                  color: "#2A629A",
                  paddingBottom: "5px",
                  textDecoration: "underline",
                }}
              >
                Please fill up the form to generate a new Receipt
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small" error={!!errors.fiscalYearId}>
                      <InputLabel required id="fiscalYearId">
                        Fiscal Year
                      </InputLabel>
                      <Controller
                        name="fiscalYearId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Fiscal Year"
                            labelId="fiscalYearId"
                          >
                            {Array.isArray(fiscalYears) &&
                              fiscalYears
                                .sort((a, b) => a.index - b.index)
                                .map((fy) => (
                                  <MenuItem key={fy.id} value={fy.id}>
                                    {fy.yearNepali}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                      />
                      {errors.fiscalYearId && (
                        <FormHelperText>This field is required.</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      {...register("receiptNo")}
                      id="receiptNo"
                      size="small"
                      value={receiptNo}
                      disabled
                      label="Receipt No."
                      fullWidth
                      error={!!errors.receiptNo}
                      helperText={
                        loadingReceiptNo
                          ? "Loading receipt number..."
                          : errors.receiptNo
                            ? "Receipt No. is required"
                            : ""
                      }
                      InputProps={{
                        endAdornment: loadingReceiptNo && (
                          <InputAdornment position="end">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.batchId}
                    >
                      <InputLabel required id="batchId">
                        Batch Year
                      </InputLabel>
                      <Select
                        {...register("batchId", { required: true })}
                        label="Batch Year"
                        onChange={(e) => {
                          setBatchId(e.target.value);
                          setValue("batchId", e.target.value);
                        }}
                        value={batchId}
                      >
                        {Array.isArray(allBatch) &&
                          allBatch.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.batchNepali}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.programName}
                    >
                      <InputLabel required id="programName">
                        Program Name
                      </InputLabel>
                      <Select
                        {...register("programName", { required: true })}
                        label="Program Name"
                      >
                        {Array.isArray(allPrograms) &&
                          allPrograms.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.programName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.programType}
                    >
                      <InputLabel required id="programType-label">
                        Program Type
                      </InputLabel>
                      <Select
                        {...register("programType", { required: true })}
                        labelId="programType-label"
                        label="Program Type"
                      >
                        <MenuItem value="annual">Annual</MenuItem>
                        <MenuItem value="semester">Semester</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {programTypeWatch === "semester" ? (
                    <Grid item xs={12} sm={2}>
                      <FormControl
                        fullWidth
                        size="small"
                        error={!!errors.semester}
                      >
                        <InputLabel required id="semester">
                          Semester
                        </InputLabel>
                        <Select
                          {...register("semester", { required: true })}
                          label="Semester"
                        >
                          {[
                            "First",
                            "Second",
                            "Third",
                            "Fourth",
                            "Fifth",
                            "Sixth",
                            "Seventh",
                            "Eighth",
                          ].map((item, index) => (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth size="small" error={!!errors.year}>
                        <InputLabel required id="year">
                          Year
                        </InputLabel>
                        <Select
                          {...register("year", { required: true })}
                          label="Year"
                        >
                          {["First", "Second", "Third", "Fourth"].map(
                            (item, index) => (
                              <MenuItem key={index} value={item}>
                                {item}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register("studentName", { required: true })}
                      required
                      size="small"
                      name="studentName"
                      label="Student Full Name (English)"
                      fullWidth
                      error={!!errors.studentName}
                      helperText={
                        errors.studentName ? "Student name is required" : ""
                      }
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={2}>
                    <TextField
                      {...register("dateOfPayment", { required: true })}
                      id="dateOfPayment"
                      required
                      defaultValue={new Date().toISOString().split("T")[0]}
                      size="small"
                      name="dateOfPayment"
                      label="Date of Payment"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      error={!!errors.dateOfPayment}
                      helperText={
                        errors.dateOfPayment
                          ? "Date of payment is required"
                          : ""
                      }
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="dateOfPayment"
                      control={control}
                      rules={{ required: "Date of payment is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <BikramSambatDateInput
                          {...field}
                          label="Date of Payment"
                          required
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={12}>
                    <Box
                      border="1px solid #8c8d90"
                      borderRadius="10px"
                      position="relative"
                      paddingBottom="5px"
                    >
                      <Typography
                        borderRadius="10px"
                        fontSize="12px"
                        display="inline-block"
                        bgcolor="white"
                        padding="0 5px"
                        position="relative"
                        left="15px"
                        bottom="12px"
                      >
                        Select at least one or more items as required
                        {loadingFeeTypes && " (Loading fee types...)"}
                      </Typography>
                      <Grid
                        item
                        xs={12}
                        ml={2}
                        style={{
                          marginTop: -5,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        <FormGroup>
                          <Grid container spacing={1}>
                            {loadingFeeTypes ? (
                              <Grid item xs={12}>
                                <Typography variant="body2">
                                  Loading fee types...
                                </Typography>
                              </Grid>
                            ) : Array.isArray(feeTypes) &&
                              feeTypes.length > 0 ? (
                              feeTypes.map((fee) => (
                                <Grid item xs={6} sm={6} md={6} key={fee.id}>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: "1px",
                                    }}
                                  >
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={() =>
                                            handleFeeItemChange(
                                              fee.id,
                                              fee.amount
                                            )
                                          }
                                          checked={selectedFeeItems.includes(
                                            fee.id
                                          )}
                                          size="small"
                                        />
                                      }
                                      label={`${fee.name}:`}
                                      style={{
                                        marginBottom: 0,
                                        fontSize: "10px",
                                      }}
                                    />
                                    <TextField
                                      id={`amountPaid-${fee.id}`}
                                      required
                                      value={
                                        feeAmounts[fee.id] || fee.amount || 0
                                      }
                                      size="small"
                                      variant="standard"
                                      name={`amountPaid-${fee.id}`}
                                      type="number"
                                      fullWidth
                                      style={{
                                        maxWidth: "10rem",
                                        fontSize: "10px",
                                      }}
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            RS.
                                          </InputAdornment>
                                        ),
                                      }}
                                      onChange={(e) =>
                                        setFeeAmounts((prev) => ({
                                          ...prev,
                                          [fee.id]: parseFloat(e.target.value),
                                        }))
                                      }
                                    />
                                  </div>
                                </Grid>
                              ))
                            ) : (
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {batchIdWatch && programNameWatch
                                    ? "No fee types available for selected criteria"
                                    : "Please select batch and program to view fee types"}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </FormGroup>
                      </Grid>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12} mt={2}>
                    <Box
                      border="1px solid #8c8d90"
                      borderRadius="10px"
                      position="relative"
                      paddingBottom="5px"
                    >
                      <Typography
                        borderRadius="10px"
                        fontSize="12px"
                        display="inline-block"
                        bgcolor="white"
                        padding="0 5px"
                        position="relative"
                        left="15px"
                        bottom="12px"
                      >
                        Select at least one general item as required
                      </Typography>

                      <Grid
                        item
                        xs={12}
                        ml={2}
                        style={{
                          marginTop: -5,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        <FormGroup>
                          <Grid container spacing={1}>
                            {Array.isArray(generalFeeTypes) &&
                              generalFeeTypes.length > 0 ? (
                              generalFeeTypes.map((generalFee) => (
                                <Grid
                                  item
                                  xs={6}
                                  sm={6}
                                  md={6}
                                  key={generalFee.id}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: "1px",
                                    }}
                                  >
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={() =>
                                            handleGeneralFeeItemChange(
                                              generalFee.id,
                                              generalFee.amount
                                            )
                                          }
                                          checked={selectedGeneralFeeItems.includes(
                                            generalFee.id
                                          )}
                                          size="small"
                                        />
                                      }
                                      label={`${generalFee.feeName || generalFee.name
                                        }:`}
                                      style={{
                                        marginBottom: 0,
                                        fontSize: "10px",
                                      }}
                                    />
                                    <TextField
                                      id={`amountPaid-general-${generalFee.id}`}
                                      required
                                      value={
                                        generalFeeAmounts[generalFee.id] ||
                                        generalFee.amount ||
                                        0
                                      }
                                      size="small"
                                      variant="standard"
                                      name={`amountPaid-general-${generalFee.id}`}
                                      type="number"
                                      fullWidth
                                      style={{
                                        maxWidth: "10rem",
                                        fontSize: "10px",
                                      }}
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            RS.
                                          </InputAdornment>
                                        ),
                                      }}
                                      onChange={(e) =>
                                        setGeneralFeeAmounts((prev) => ({
                                          ...prev,
                                          [generalFee.id]: parseFloat(
                                            e.target.value
                                          ),
                                        }))
                                      }
                                    />
                                  </div>
                                </Grid>
                              ))
                            ) : (
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  No general fee types available
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </FormGroup>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register("uploadApplication", { required: false })}
                      id="uploadApplication"
                      size="small"
                      name="uploadApplication"
                      label="Upload Application"
                      type="file"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

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

                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    margin={1}
                  >
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ReceiptForOthers;
