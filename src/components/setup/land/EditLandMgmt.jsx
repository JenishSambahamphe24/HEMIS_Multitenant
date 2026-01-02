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
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditLandMgmt = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLandDataById = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(`${backendUrl}/Lands/${id}`, config);
        const landData = response.data;
        setValue("areaCoveredRooms", landData.totalArea || "");
        setValue("areaUnit", landData.unit || 0);
        setValue("sheetNo", landData.sheetNo || 0);
        setValue("kittaNo", landData.kittaNo || 0);
        setValue("ownership", landData.ownerShip ? "yes" : "no");
        setValue("remarks", landData.remarks || "");
      } catch (error) {
        console.error("Error fetching land data:", error);
      }
    };

    fetchLandDataById();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiData = {
      id: id,
      totalArea: data.areaCoveredRooms || "",
      unit: data.areaUnit || 0,
      sheetNo: data.sheetNo || 0,
      kittaNo: data.kittaNo || 0,
      ownerShip: data.ownership === "yes",
      remarks: data.remarks || "",
    };

    try {
      const config = getAuthConfigSafe()
      await axios.put(`${backendUrl}/Lands/${id}`, apiData, config);
      toast.success("Data updated successfully");
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
        Edit Land Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Controller
              name="areaCoveredRooms"
              control={control}
              defaultValue=""
              rules={{
                required: "Total Area Covered by Library Rooms is required",
                pattern: {
                  value: /^\d+(\.\d+)?$|^(\d+-)+\d+$/,
                  message:
                    "Please enter a valid number (e.g., 12345, 123.45, 123-456-789)",
                },
                min: {
                  message:
                    "Total Area Covered by Library Rooms must be a positive number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Total Area of Land"
                  fullWidth
                  autoComplete="areaCoveredRooms"
                />
              )}
            />
            {errors.areaCoveredRooms && (
              <FormHelperText error>
                {errors.areaCoveredRooms.message}
              </FormHelperText>
            )}
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.areaUnit}>
              <InputLabel id="area-unit-label">Area Unit</InputLabel>
              <Controller
                name="areaUnit"
                control={control}
                defaultValue=""
                rules={{ required: "Area Unit is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="area-unit-label"
                    label="Area Unit"
                  >
                    <MenuItem value="hector">Hector</MenuItem>
                    <MenuItem value="ropani">Ropani</MenuItem>
                    <MenuItem value="kattha">Kattha</MenuItem>
                    <MenuItem value="barga meter">barga meter</MenuItem>
                    <MenuItem value="barga feet">barga feet</MenuItem>
                  </Select>
                )}
              />
              {errors.areaUnit && (
                <Typography variant="body2" color="error">
                  {errors.areaUnit.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="sheetNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} size="small" label="Sheet No" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="kittaNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} size="small" label="Kitta No" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.ownership}>
              <InputLabel id="ownership-label">Ownership</InputLabel>
              <Controller
                name="ownership"
                control={control}
                defaultValue=""
                rules={{ required: "Ownership is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="ownership-label"
                    label="Ownership"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.ownership && (
                <Typography variant="body2" color="error">
                  {errors.ownership.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

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
                  multiline
                  rows={4}
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

export default EditLandMgmt;
