import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Button,
  Box,
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


const EditBuildingMgmt = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBuildingDataById = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(`${backendUrl}/Buildings/${id}`, config);
        const buildingData = response.data;
        setValue("houseName", buildingData.houseName || "");
        setValue("areaCovered", buildingData.areaCoveredByBuilding || 0);
        setValue("numberOfClassrooms", buildingData.noOfClassrooms || 0);
        setValue("areaCoveredAllRooms", buildingData.areaCoveredByAllRooms || 0);
        setValue("ownership", buildingData.ownershipOfBuilding ? "yes" : "no");
        setValue("hasInternet", buildingData.hasInternetConnection ? "yes" : "no");
        setValue("remarks", buildingData.remarks || "");
      } catch (error) {
        console.error("Error fetching building data:", error);
      }
    };

    fetchBuildingDataById();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiBuildingData = {
      id: id,
      houseName: data.houseName,
      areaCoveredByBuilding: parseFloat(data.areaCovered) || 0,
      noOfClassrooms: parseInt(data.numberOfClassrooms) || 0,
      areaCoveredByAllRooms: parseFloat(data.areaCoveredAllRooms) || 0,
      ownershipOfBuilding: data.ownership === "yes",
      hasInternetConnection: data.hasInternet === "yes",
      remarks: data.remarks,

    };

    try {
      const config = getAuthConfigSafe()
      await axios.put(`${backendUrl}/Buildings/${id}`, apiBuildingData, config);
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
        Edit Building Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* House Name (Block No) */}
          <Grid item xs={12} sm={4}>
            <Controller
              name="houseName"
              control={control}
              defaultValue=""
              rules={{ required: "House Name (Block No) is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="House Name (Block No)"
                  fullWidth
                  autoComplete="houseName"
                  error={!!errors.houseName}
                />
              )}
            />
            {errors.houseName && (
              <FormHelperText error>{errors.houseName.message}</FormHelperText>
            )}
          </Grid>

          {/* Area Covered by Building */}
          <Grid item xs={12} sm={4}>
            <Controller
              name="areaCovered"
              control={control}
              defaultValue=""
              rules={{
                required: "Area Covered by Building is required",
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Please enter a valid decimal number",
                },
                min: {
                  value: 0.01,
                  message: "Area Covered by Building must be a positive number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  type="number"
                  size="small"
                  label="Area Covered by Building (sq.ft)"
                  fullWidth
                  autoComplete="areaCovered"
                  error={!!errors.areaCovered}
                  inputProps={{ step: "0.01", min: "0.01" }} // Allows only positive decimal numbers
                />
              )}
            />
            {errors.areaCovered && (
              <FormHelperText error>{errors.areaCovered.message}</FormHelperText>
            )}

          </Grid>

          {/* Number of Classrooms */}
          <Grid item xs={12} sm={4}>
            <Controller
              name="numberOfClassrooms"
              control={control}
              defaultValue=""
              rules={{
                required: "Number of Classrooms is required",
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
                  label="Number of Classrooms"
                  fullWidth
                  autoComplete="numberOfClassrooms"
                  error={!!errors.numberOfClassrooms}
                  inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                />
              )}
            />
            {errors.numberOfClassrooms && (
              <FormHelperText error>{errors.numberOfClassrooms.message}</FormHelperText>
            )}
          </Grid>

          {/* Area Covered by All Rooms */}
          <Grid item xs={12} sm={4}>
            <Controller
              name="areaCoveredAllRooms"
              control={control}
              defaultValue=""
              rules={{
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Please enter a valid decimal number",
                },
                min: {
                  value: 0.01,
                  message: "Area Covered by All Rooms must be a positive number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  type="number"
                  size="small"
                  label="Area Covered by All Rooms (sq.ft)"
                  fullWidth
                  autoComplete="areaCoveredAllRooms"

                  inputProps={{ step: "0.01", min: "0.01" }} // Allows only positive decimal numbers
                />
              )}
            />
            {errors.areaCoveredAllRooms && (
              <FormHelperText error>{errors.areaCoveredAllRooms.message}</FormHelperText>
            )}
          </Grid>

          {/* Ownership of Building */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" error={!!errors.ownership}>
              <InputLabel required id="ownership-label">Ownership of Building</InputLabel>
              <Controller
                name="ownership"
                control={control}
                defaultValue=""
                rules={{ required: "Ownership of Building is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="ownership-label"
                    label="Ownership of Building"
                    autoComplete="ownership"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.ownership && (
                <FormHelperText>{errors.ownership.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Has Internet Connection */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" error={!!errors.hasInternet}>
              <InputLabel required id="internet-label">Has Internet Connection</InputLabel>
              <Controller
                name="hasInternet"
                control={control}
                defaultValue=""
                rules={{ required: "Has Internet Connection is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="internet-label"
                    label="Has Internet Connection"
                    autoComplete="hasInternet"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.hasInternet && (
                <FormHelperText>{errors.hasInternet.message}</FormHelperText>
              )}
            </FormControl>
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

export default EditBuildingMgmt;
