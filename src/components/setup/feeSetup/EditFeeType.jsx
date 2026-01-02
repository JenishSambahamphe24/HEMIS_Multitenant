import React, { useEffect, useState } from "react";
import {
  DialogActions,
  DialogContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';
const EditFeeType = ({ feeTypeId, onUpdate, onClose }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [feeTypeData, setFeeTypeData] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log(feeTypeData)

  useEffect(() => {
    const fetchFeeType = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/FeeType/${feeTypeId}`,
          config
        );
        setFeeTypeData(response.data)
      } catch (error) {
        console.error("Error fetching fee type data:", error);
      }
    };
    fetchFeeType();
  }, [feeTypeId]);

  const onSubmit = async (data) => {
    try {
      data.amount = parseInt(data.amount, 10);
      data.isActive = data.isActive === "true";
      data.id = feeTypeId;

      await axios.put(
        `${backendUrl}/FeeType/${feeTypeId}`,
        data
      );
      toast.success("Fee type updated successfully!");
      onUpdate();
      onClose();
    } catch (err) {
      toast.error("Failed to update fee type!");
    }
  };

  if (!feeTypeData) return null;

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Use Grid container to display fields in a row */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              {...register("name", { required: "Name is required" })}
              label="Fee Type Name"
              fullWidth
              defaultValue={feeTypeData?.name}
              error={!!errors.name}
              helperText={errors.name?.message}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              {...register("amount", {
                required: "Amount is required",
              })}
              size="small"
              type="number"
              label="Fee Amount (NPR)"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">RS.</InputAdornment>
                ),
              }}
              defaultValue={feeTypeData?.amount}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                {...register("isActive")}
                label="Status"
                defaultValue={feeTypeData.isActive.toString()} // Convert boolean to string for the select dropdown
                size="small"
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </form>
    </DialogContent>
  );
};

export default EditFeeType;
