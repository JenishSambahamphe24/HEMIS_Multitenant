import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  DialogContent,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditEquipmentMgmt = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEquipmentDataById = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(`${backendUrl}/FurnitureEquipmentVehicle/${id}`, config);
        const equipmentData = response.data;

        setValue("category", equipmentData.itemType || "");
        setValue("itemName", equipmentData.itemName || "");
        setValue("quantity", equipmentData.noOfQty || 0);
        setValue("itemDescription", equipmentData.itemDescription || "");
        setValue("remarks", equipmentData.remarks || "");
      } catch (error) {
        console.error("Error fetching Equipment data:", error);
      }
    };

    fetchEquipmentDataById();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiEquipmentData = {
      id: id,
      itemType: data.category || "",
      itemName: data.itemName || "",
      noOfQty: data.quantity || 0,
      itemDescription: data.itemDescription || "",
      remarks: data.remarks || "",


    };

    try {
      const config = getAuthConfigSafe()
      await axios.put(`${backendUrl}/FurnitureEquipmentVehicle/${id}`, apiEquipmentData, config);
      toast.success("Data updated successfully", {
        autoClose: 1500,
      });
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Error updating data: " + error.message);
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
        Edit Equipment Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Category Dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small" error={!!errors.category}>
              <InputLabel required id="category-label">Category</InputLabel>
              <Controller
                name="category"
                control={control}
                defaultValue=""
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="category-label"
                    label="Category"
                  // onChange={(e) => {
                  //     handleCategoryChange(e);
                  //     field.onChange(e); // Ensure form state is updated
                  // }}
                  >
                    <MenuItem value="furniture">Furniture</MenuItem>
                    <MenuItem value="equipment">Equipment</MenuItem>
                    <MenuItem value="vehicle">Vehicle</MenuItem>
                  </Select>
                )}
              />
              {errors.category && (
                <FormHelperText>{errors.category.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Item Dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small" error={!!errors.itemName}>
              <Controller
                name="itemName"
                control={control}
                defaultValue=""
                rules={{ required: "Item name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Item Name"
                    size="small"
                    error={!!errors.itemName}
                    helperText={errors.itemName ? errors.itemName.message : ""}
                    required
                  />
                )}
              />
            </FormControl>
          </Grid>


          {/* Quantity */}
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="quantity"
              control={control}
              defaultValue=""
              rules={{
                required: "Quantity is required",
                pattern: {
                  value: /^[1-9][0-9]*$/,
                  message: "Please enter a positive integer",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  type="number"
                  size="small"
                  label="Quantity"
                  fullWidth
                  autoComplete="quantity"
                  error={!!errors.quantity}
                  inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                />
              )}
            />
            {errors.quantity && (
              <FormHelperText error>{errors.quantity.message}</FormHelperText>
            )}
          </Grid>

          {/* Item Description */}
          <Grid item xs={12}>
            <Controller
              name="itemDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Item Description"
                  fullWidth
                  autoComplete="itemDescription"
                  multiline
                  rows={2}
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
                  size="small"
                  label="Remarks"
                  fullWidth
                  autoComplete="remarks"
                  multiline rows={2}
                  InputProps={{ style: { minWidth: '100%' } }}
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

export default EditEquipmentMgmt;
