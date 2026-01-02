import {
  Button,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getBatch, getFiscalYear, postFee } from "../../../services/services";
import FeeSetupList from "./FeeSetupList";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const FeeSetup = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [getProgramData, setGetProgramData] = useState([]);
  const [programType, setProgramType] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [duration, setDuration] = useState(0);
  const [feeType, setFeeType] = useState("");
  const [feeTypeData, setFeeTypeData] = useState([]);
  const [fiscalYear, setFiscalYear] = useState([]);
  const [defaultFiscal, setDefaultFiscal] = useState("");
  const [batchYear, setBatchYear] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const instituteId = currentUser?.institution?.id;
  console.log(instituteId);

  const fetchData = async () => {
    try {
      const fiscalYearData = await getFiscalYear();
      const batchYear = await getBatch();
      const feeTypes = await axios.get(`${backendUrl}/FeeType`);
      setFeeTypeData(feeTypes.data);
      setBatchYear(batchYear);
      setFiscalYear(fiscalYearData);

      const activeFiscalYear = fiscalYearData.find(
        (data) => data && data.activeFiscalYear === true
      );
      if (activeFiscalYear) {
        setDefaultFiscal(activeFiscalYear.id);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchProgramData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/ProgramMgmt/GetCollegePrograms`,
        config
      );
      setGetProgramData(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
    fetchProgramData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        programId: Number(data.programId) || 0,
        instituteId: Number(instituteId) || 0,
        batchID: data.academicYear,
        fiscalYearID: Number(data.fiscalYearId) || 0,
        feeTypeId: feeType || "",
        amount: data.feeAmount,
      };
      const response = await postFee(payload);
      if (response.ok)
        toast.success("Data Added successfully", {
          autoClose: 2000,
        });
      reset();
      fetchData();
    } catch (err) {
      toast.error("Failed to add!!", err, {
        autoClose: 2000,
      });
    }
  };

  const handleProgramChange = (event) => {
    const selectedProgram = getProgramData.find(
      (program) => program.id === event.target.value
    );
    setProgramType(selectedProgram ? selectedProgram.programType : "");
    setInstituteName(selectedProgram ? selectedProgram.campus : "");
    setDuration(selectedProgram ? selectedProgram.duration : "");
  };

  const handleUpdate = () => {
    fetchData();
  };
  const handleFeeTypeChange = (event) => {
    setFeeType(event.target.value);
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
                Program Fee Setup
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="programId" required>
                        Program Name
                      </InputLabel>
                      <Select
                        required
                        {...register("programId", { required: true })}
                        id="programId"
                        size="small"
                        name="programId"
                        label="Program Name"
                        fullWidth
                        autoComplete="given-name"
                        error={!!errors.programId}
                        helpertext={
                          errors.programId ? "Program is required" : ""
                        }
                        onChange={handleProgramChange}
                      >
                        <MenuItem value="" disabled>
                          Select Programs
                        </MenuItem>
                        {getProgramData.map((data) => (
                          <MenuItem value={data.id} key={data.id}>
                            {data.shortName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      {...register("programType")}
                      id="programType"
                      size="small"
                      name="programType"
                      label="Program Type"
                      fullWidth
                      disabled
                      value={programType}
                      error={!!errors.programType}
                      helpertext={
                        errors.programType ? "Program Type required" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      {...register("duration")}
                      id="duration"
                      size="small"
                      name="duration"
                      label="Duration"
                      fullWidth
                      disabled
                      value={duration}
                      error={!!errors.duration}
                      helpertext={
                        errors.duration ? "Program Type required" : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="feeType" required>
                        Fee Type{" "}
                      </InputLabel>
                      <Select
                        required
                        {...register("feeType", { required: true })}
                        id="feeType"
                        size="small"
                        name="feeType"
                        label="Fee Type"
                        fullWidth
                        autoComplete="given-name"
                        error={!!errors.feeType}
                        helpertext={errors.feeType ? "Program is required" : ""}
                        onChange={handleFeeTypeChange}
                      >
                        {feeTypeData &&
                          feeTypeData.map((data) => (
                            <MenuItem value={data.id}>{data.name}</MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={2.5}>
                    <TextField
                      required
                      id="feeAmount"
                      {...register("feeAmount", { required: true })}
                      name="feeAmount"
                      size="small"
                      label="Amount"
                      fullWidth
                      error={!!errors.feeAmount}
                      helpertext={errors.feeAmount ? "Fee Amount required" : ""}
                    />
                  </Grid>

                  {fiscalYear.length > 0 && (
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="fiscalYearId" required>
                          Fiscal Year
                        </InputLabel>
                        <Select
                          required
                          {...register("fiscalYearId", { required: true })}
                          id="fiscalYearId"
                          size="small"
                          name="fiscalYearId"
                          label="Fiscal Year"
                          fullWidth
                          value={defaultFiscal}
                          autoComplete="given-name"
                          error={!!errors.fiscalYearId}
                          helperText={
                            errors.fiscalYearId ? "Fiscal year is required" : ""
                          }
                        >
                          {fiscalYear.map((data) => (
                            <MenuItem value={data.id} key={data.id}>
                              {data.yearNepali}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="academicYear" required>
                        Acad. Year{" "}
                      </InputLabel>
                      <Select
                        required
                        {...register("academicYear", { required: true })}
                        id="academicYear"
                        size="small"
                        name="academicYear"
                        label="Academic Year "
                        fullWidth
                        autoComplete="given-name"
                        error={!!errors.academicYear}
                        helpertext={
                          errors.academicYear ? "Program is required" : ""
                        }
                      >
                        {batchYear.map((data) => (
                          <MenuItem value={data.id} key={data.id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="remark"
                      size="small"
                      name="remark"
                      label="Remarks"
                      value={instituteName}
                      fullWidth
                    />
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
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Paper>
          <FeeSetupList
            onUpdate={handleUpdate} />
        </Grid>

      </Grid>
    </>
  );
};

export default FeeSetup;
