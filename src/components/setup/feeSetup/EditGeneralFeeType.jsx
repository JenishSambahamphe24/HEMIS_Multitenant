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
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditGeneralFeeType = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGeneralFeeTypeById = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/GeneralFeeType/${id}`,
          config
        );
        const feeTypeData = response.data;
        setValue("feeType", feeTypeData.feeType || "");
        setValue("name", feeTypeData.feeName || "");
        setValue("amount", feeTypeData.amount || 0);
        setValue("status", feeTypeData.status ? "true" : "false");
      } catch (error) {
        console.error("Error fetching fee type data:", error);
      }
    };

    fetchGeneralFeeTypeById();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiData = {
      id,
      feeType: data.feeType,
      feeName: data.name,
      amount: data.feeType === "courseFee" ? 0 : data.amount,
      status: Boolean(data.isActive),
      remarks: data.remarks,
    };

    try {
      const config = getAuthConfigSafe()
      await axios.put(`${backendUrl}/GeneralFeeType/${id}`, apiData, config);

      toast.success("General Fee Type updated successfully", {
        autoClose: 1500,
      });
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Error updating general fee type: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent fullWidth>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", color: "#2A629A", padding: "10px" }}
      >
        Edit General Fee Type
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}>
            <Controller
              name="feeType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <InputLabel required>Fee Type</InputLabel>
                  <Select
                    {...field}
                    size="small"
                    name="feeType"
                    id="feeType"
                    label="fee Type"
                    fullWidth
                    defaultValue={""}
                    required
                  >
                    <MenuItem disabled value={""}>
                      Select Fee Type
                    </MenuItem>
                    <MenuItem value={"generalFee"}>General Fee</MenuItem>
                    <MenuItem value={"courseFee"}>Course Specific Fee</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Fee Type Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Fee Item Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="amount"
              control={control}
              defaultValue=""
              rules={{
                required: "Amount is required",
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Please enter a valid number",
                },
              }}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  size="small"
                  label="Fee Amount (NPR)"
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">RS.</InputAdornment>
                    ),
                  }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.status}>
              <InputLabel required id="status-label">
                Status
              </InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select {...field} labelId="status-label" label="Status">
                    <MenuItem value="true">
                      <span style={{ color: "green" }}>Active</span>
                    </MenuItem>
                    <MenuItem value="false">
                      <span style={{ color: "red" }}>Inactive</span>
                    </MenuItem>
                  </Select>
                )}
              />
              {errors.status && (
                <Typography variant="body2" color="error">
                  {errors.status.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <DialogActions sx={{ justifyContent: "center", marginTop: 2 }}>
          <Button
            size="small"
            onClick={onClose}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </form>
    </DialogContent>
  );
};

export default EditGeneralFeeType;
