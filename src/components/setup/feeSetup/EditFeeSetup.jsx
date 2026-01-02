import {
  Button,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getBatch } from "../../../services/services";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import useProgramData from "../../programs/Program";
import {config} from '@config';


const EditFeeSetup = ({ feeId, onUpdate, onClose }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

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
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  // Watch form values
  const watchedProgramId = watch("programId");
  const watchedMajorSubjectId = watch("majorSubject");

  const fetchBatchData = async () => {
    try {
      const data = await getBatch();
      setGetBatchData(data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch batch data");
    }
  };

  const fetchFeeData = async () => {
    try {
      const config = getAuthConfigSafe();
      const response = await axios.get(`${backendUrl}/FeeType/${feeId}`, config);
      const feeData = response.data;
      
      // Set form values
      setValue("batch", feeData.batchId);
      setValue("programId", feeData.programId);
      setValue("amount", feeData.amount);
      setValue("name", feeData.name);
      setValue("isActive", feeData?.isActive || false);

      // Handle program selection to populate major subjects
      if (feeData.programId && programData.length > 0) {
        const program = programData.find(p => p.programMgmtId === feeData.programId);
        if (program) {
          handleProgramSelect(program);
        }
      }

      // Set major subject if it exists
      if (feeData?.majorSubjectId) {
        setValue("majorSubject", feeData.majorSubjectId);
        
        // Find and select the major subject
        setTimeout(() => {
          const majorSubject = uniqueMajorSubjects.find(ms => ms.id === feeData.majorSubjectId);
          if (majorSubject) {
            handleMajorSubjectSelect(majorSubject);
          }
        }, 100);
      }
    } catch (err) {
      console.error("Failed to fetch fee data:", err);
      toast.error("Failed to fetch fee details");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsFetchingData(true);
      try {
        await fetchBatchData();
      } catch (err) {
        console.error("Error fetching initial data:", err);
        toast.error("Failed to load necessary data");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (!isFetchingData && programData.length > 0) {
      fetchFeeData();
    }
  }, [isFetchingData, programData.length, feeId]);

  // Handle program selection
  const handleProgramChange = (e) => {
    const programId = e.target.value;
    setValue("programId", programId);
    setValue("majorSubject", "");

    // Find the selected program object
    const program = programData.find(p => p.programMgmtId === programId);
    if (program) {
      handleProgramSelect(program);
    }
  };

  // Handle major subject selection
  const handleMajorSubjectChange = (e) => {
    const majorSubjectId = e.target.value;
    setValue("majorSubject", majorSubjectId);

    // Find the selected major subject object
    const majorSubject = uniqueMajorSubjects.find(ms => ms.id === majorSubjectId);
    if (majorSubject) {
      handleMajorSubjectSelect(majorSubject);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const submitData = {
        id: feeId,
        batchId: data.batch,
        programId: data.programId,
        majorSubjectId: data.majorSubject || null,
        amount: parseFloat(data.amount),
        name: data.name,
        isActive: Boolean(data.isActive),
      };

      const config = getAuthConfigSafe();
      await axios.put(`${backendUrl}/FeeType/${feeId}`, submitData, config);

      toast.success("Fee type updated successfully!");
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Error updating fee details:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update fee details";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "200px" }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading fee data...
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", color: "#2A629A" }}
          >
            Update Fee Type 
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel required>Batch</InputLabel>
                  <Select
                    {...register("batch", {
                      required: "Batch is required",
                    })}
                    size="small"
                    label="Batch"
                    value={watch("batch") || ""}
                    disabled={isLoading}
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
                    <FormHelperText error>
                      {errors.batch.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel required>Programs</InputLabel>
                  <Select
                    {...register("programId", {
                      required: "Program is required",
                    })}
                    size="small"
                    label="Programs"
                    value={watchedProgramId || ""}
                    onChange={handleProgramChange}
                    disabled={isLoading}
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
                    <FormHelperText error>
                      {errors.programId.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Major Subject Selection */}
              {uniqueMajorSubjects.length > 0 && (
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Major Subject</InputLabel>
                    <Select
                      {...register("majorSubject")}
                      size="small"
                      label="Major Subject"
                      value={watchedMajorSubjectId || ""}
                      onChange={handleMajorSubjectChange}
                      disabled={isLoading}
                      error={!!errors.majorSubject}
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
                    {errors.majorSubject && (
                      <FormHelperText error>
                        {errors.majorSubject.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} sm={uniqueMajorSubjects.length > 0 ? 2 : 3}>
                <TextField
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 0, message: "Amount must be positive" },
                  })}
                  size="small"
                  type="number"
                  label="Total Fee Amount"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">NPR</InputAdornment>
                    ),
                  }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    {...register("isActive")}
                    size="small"
                    label="Status"
                    value={watch("isActive") ?? false}
                    onChange={(e) => setValue("isActive", e.target.value)}
                    disabled={isLoading}
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
              justifyContent="center"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Grid item>
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  disabled={isLoading}
                  sx={{ backgroundColor: "#007aff" }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                      Updating...
                    </>
                  ) : (
                    "Update Fee"
                  )}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Grid>
    </Grid>
  );
};

export default EditFeeSetup;