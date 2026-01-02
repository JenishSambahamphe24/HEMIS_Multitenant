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
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditExpenseHead = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const headType = watch("headType");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const config = getAuthConfigSafe()
        const expenseResponse = await axios.get(
          `${backendUrl}/FinanceHead/${id}`,
          config
        );
        const expenseData = expenseResponse.data;
        setValue("headCode", expenseData.headCode || "");
        setValue("headType", expenseData.headType || "");
        setValue("headName", expenseData.headName || "");
        setValue("remarks", expenseData.remarks || "");
        if (expenseData.headType === "Expenditure") {
          setValue("expenditureType", expenseData.expenditureType || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitialData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("id", id);
    formData.append("headCode", data.headCode);
    formData.append("headType", data.headType);
    formData.append(
      "expenditureType",
      data.headType === "Expenditure" ? data.expenditureType : null
    ); 
    formData.append("headName", data.headName);
    formData.append("remarks", data.remarks || "");

    try {
      const config = getAuthConfigSafe()
      await axios.put(`${backendUrl}/FinanceHead/${id}`, formData, config);

      toast.success("Expense Data updated successfully", {
        autoClose: 1500,
      });
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Error updating receipt: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", color: "#2A629A", padding: "10px" }}
      >
        Edit Income/Expense Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
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
                  type="number"
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
                <FormControl fullWidth size="small" error={!!errors.headType}>
                  <InputLabel required id="headType-label">
                    Head Type
                  </InputLabel>
                  <Select
                    {...field}
                    label="Head Type"
                    id="headType"
                    labelId="headType-label"
                  >
                    <MenuItem value="Income">Income</MenuItem>
                    <MenuItem value="Expenditure">Expenditure</MenuItem>
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
                  <FormControl fullWidth size="small">
                    <InputLabel
                      required={headType === "Expenditure"}
                      id="expenditureType-label"
                    >
                      Expenditure Type
                    </InputLabel>
                    <Select
                      {...field}
                      label="Expenditure Type"
                      id="expenditureType"
                      required={headType === "Expenditure"}
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

          {/* Head Name */}
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

          {/* Remarks */}
          <Grid item xs={12}>
            <Controller
              name="remarks"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  id="remarks"
                  label="Remarks"
                  fullWidth
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid container justifyContent="center" spacing={2} mt={2}>
            <Grid item>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </DialogContent>
  );
};

export default EditExpenseHead;
