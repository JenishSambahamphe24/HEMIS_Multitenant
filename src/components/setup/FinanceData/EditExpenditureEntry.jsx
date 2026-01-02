import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  DialogContent,
  InputAdornment,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { getFinanceHead } from "./FinanceApi";
import DateInputField from "../../DateField/DateInputField";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditExpenditureEntry = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [financeHeadData, setFinanceHeadData] = useState([]);
  const [headTypeValue, setHeadTypeValue] = useState("");
  const [expenditureTypeValue, setExpenditureTypeValue] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    watch,
    reset,
  } = useForm();

  const headType = watch("headType");
  const filteredHeadData = financeHeadData.filter((item) => {
    if (!headType) return false;
    if (headType === "Income") {
      return item.headType && item.headType === "Income";
    } else if (headType === "Expenditure") {
      if (expenditureTypeValue) {
        return (
          item.headType === "Expenditure" &&
          item.expenditureType === expenditureTypeValue
        );
      }
      return item.headType === "Expenditure";
    }
    return false;
  });

  useEffect(() => {
    const fetchFinanceHeadData = async () => {
      try {
        const financeHeadResponse = await getFinanceHead();
        setFinanceHeadData(financeHeadResponse);
      } catch (error) {
        console.error("Error fetching finance head data:", error);
        toast.error("Error fetching finance head data");
      }
    };

    fetchFinanceHeadData();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const config = getAuthConfigSafe()
        const expenditureResponse = await axios.get(
          `${backendUrl}/IncomeExpenditureEntry/${id}`,
          config
        );
        const entryData = expenditureResponse.data;
        const fiscalYearResponse = await axios.get(`${backendUrl}/FiscalYear`, config);
        setFiscalYears(fiscalYearResponse.data);

        if (entryData && entryData.headName) {
          const headTypeVal = entryData.headName.headType || "";
          const expenditureTypeVal = entryData.headName.expenditureType || "";
          setHeadTypeValue(headTypeVal);
          setValue("headType", headTypeVal);

          if (headTypeVal === "Expenditure" && expenditureTypeVal) {
            setExpenditureTypeValue(expenditureTypeVal);
            setValue("expenditureType", expenditureTypeVal);
          }

          // Set the headNameID field with the correct ID
          setValue("headNameID", entryData.headNameId);
        }

        // Format date properly - extract just the date part if it's a full datetime
        let formattedDate = entryData.dateOfEntry;
        if (formattedDate && formattedDate.includes('T')) {
          formattedDate = formattedDate.split('T')[0];
        }

        // Set the rest of the form values
        setValue("fiscalYearId", entryData.fiscalYearId);
        setValue("amount", entryData.amount);
        setValue("remarks", entryData.remarks || "");
        setValue("dateOfEntry", formattedDate);

        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading entry data");
      }
    };

    if (id) {
      fetchInitialData();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("id", id);
    formData.append("headNameId", parseInt(data.headNameID) || 0);
    formData.append("fiscalYearId", data.fiscalYearId);
    formData.append("dateOfEntry", data.dateOfEntry);
    formData.append("amount", parseInt(data.amount) || 0);

    // Only append evidence document if a new file is selected
    if (data.evidenceDocument && data.evidenceDocument[0]) {
      formData.append("evidenceDoc", data.evidenceDocument[0]);
    }

    formData.append("remarks", data.remarks || "");

    try {
      const config = getAuthConfigSafe()
      await axios.put(
        `${backendUrl}/IncomeExpenditureEntry/${id}`,
        formData,
        config
      );

      toast.success("Entry updated successfully", {
        autoClose: 1500,
      });
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Error updating entry: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!dataLoaded) {
    return (
      <DialogContent>
        <Typography>Loading data...</Typography>
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", color: "#2A629A", padding: "10px" }}
      >
        Edit Income/Expenditure Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Head Type Dropdown */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" error={!!errors.headType}>
              <InputLabel required id="headType-label">
                Head Type
              </InputLabel>
              <Controller
                name="headType"
                control={control}
                defaultValue={headTypeValue}
                rules={{ required: "Head Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="headType-label"
                    id="headType"
                    label="Head Type"
                    onChange={(e) => {
                      field.onChange(e);
                      setHeadTypeValue(e.target.value);

                      if (e.target.value !== "Expenditure") {
                        setExpenditureTypeValue("");
                        setValue("expenditureType", "");
                      }

                      // Clear the headNameID when head type changes
                      setValue("headNameID", "");
                    }}
                  >
                    <MenuItem value="Income">Income</MenuItem>
                    <MenuItem value="Expenditure">Expenditure</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Conditional Expenditure Type Dropdown */}
          {headType === "Expenditure" && (
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" error={!!errors.expenditureType}>
                <InputLabel required id="expenditureType-label">
                  Expenditure Type
                </InputLabel>
                <Controller
                  name="expenditureType"
                  control={control}
                  defaultValue={expenditureTypeValue}
                  rules={{ required: "Expenditure Type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="expenditureType-label"
                      id="expenditureType"
                      label="Expenditure Type"
                      onChange={(e) => {
                        field.onChange(e);
                        setExpenditureTypeValue(e.target.value);

                        // Clear the headNameID when expenditure type changes
                        setValue("headNameID", "");
                      }}
                    >
                      <MenuItem value="Capital Expenditure">
                        Capital Expenditure
                      </MenuItem>
                      <MenuItem value="Operating Expenditure">
                        Operating Expenditure
                      </MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          )}

          {/* Head Name Dropdown */}
          <Grid item xs={12} sm={headType === "Expenditure" ? 4 : 8}>
            <FormControl fullWidth size="small" error={!!errors.headNameID}>
              <InputLabel required id="headNameID-label">
                Head Name
              </InputLabel>
              <Controller
                name="headNameID"
                control={control}
                rules={{ required: "Head Name is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="headNameID"
                    labelId="headNameID-label"
                    label="Head Name"
                  >
                    {filteredHeadData.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.headName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Fiscal Year Dropdown */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" error={!!errors.fiscalYearId}>
              <InputLabel required id="fiscalYearId-label">
                Fiscal Year
              </InputLabel>
              <Controller
                name="fiscalYearId"
                control={control}
                rules={{ required: "Fiscal Year is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="fiscalYearId"
                    labelId="fiscalYearId-label"
                    label="Fiscal Year"
                  >
                    {fiscalYears.map((fy) => (
                      <MenuItem key={fy.id} value={fy.id}>
                        {fy.yearNepali}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Date of Entry */}
          <Grid item xs={12} sm={4}>
            <Controller
              name="dateOfEntry"
              control={control}
              rules={{ required: "Date of Entry is required" }}
              render={({ field }) => (
                <DateInputField
                  label="Date of Entry"
                  name="dateOfEntry"
                  value={field.value || ""}
                  onChange={(newValue) => field.onChange(newValue)}
                  error={!!errors.dateOfEntry}
                  helperText={errors.dateOfEntry?.message || ""}
                />
              )}
            />
          </Grid>

          {/* Amount Field */}
          <Grid item xs={12} sm={4}>
            <Controller
              name="amount"
              control={control}
              rules={{ required: "Amount is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="amount"
                  required
                  size="small"
                  label="Amount"
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Rs.</InputAdornment>
                    ),
                  }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message || ""}
                />
              )}
            />
          </Grid>

          {/* Evidence Document File Upload */}
          <Grid item xs={12} sm={8}>
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

          {/* Remarks Field */}
          <Grid item xs={12}>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="remarks"
                  label="Remarks"
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                />
              )}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2} mt={1}>
              <Grid item>
                <Button onClick={onClose} variant="outlined">
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ backgroundColor: "#2A629A" }}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </DialogContent>
  );
};

export default EditExpenditureEntry;