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


const EditHostelMgmt = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [buildingList, setBuildingList] = useState([]);

  const fetchBuildingList = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Buildings`, config);
      setBuildingList(response.data);

    } catch (error) {
      console.error("Error fetching building list:", error);
    }
  };

  useEffect(() => {
    fetchBuildingList();
    const fetchHostelDataById = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(`${backendUrl}/Hostels/${id}`, config);
        const hostelData = response.data;
        setValue("hostelType", hostelData.hostelType || "");
        setValue("numberOfRooms", hostelData.noOfRoomsInHostel || 0);
        setValue("numberOfSeats", hostelData.noOfSeats || 0);
        setValue("areaCovered", hostelData.areaCoveredByHostel || 0);
        setValue("buildingName", hostelData.buildingId || 0);
        setValue("hasPlayground", hostelData.hasPlayground ? "yes" : "no");
        setValue("hasInternet", hostelData.hasInternet ? "yes" : "no");
        setValue("hasDrinkingWater", hostelData.hasDrinkingWater ? "yes" : "no");
        setValue("hasToilet", hostelData.hasToilet ? "yes" : "no");
        setValue("remarks", hostelData.remarks || "");
      } catch (error) {
        console.error("Error fetching Hostel data:", error);
      }
    };

    fetchHostelDataById();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiHostelData = {
      id: id,
      hostelType: data.hostelType || "",
      noOfRoomsInHostel: parseInt(data.numberOfRooms) || 0,
      noOfSeats: parseInt(data.numberOfSeats) || 0,
      areaCoveredByHostel: parseFloat(data.areaCovered) || 0,
      buildingId: parseInt(data.buildingName) || 0,
      hasPlayground: data.hasPlayground === "yes",
      hasInternet: data.hasInternet === "yes",
      hasDrinkingWater: data.hasDrinkingWater === "yes",
      hasToilet: data.hasToilet === "yes",
      remarks: data.remarks || "",


    };

    try {
      const config = getAuthConfigSafe()
      await axios.put(`${backendUrl}/Hostels/${id}`, apiHostelData, config);
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
        Edit Hostel Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Hostel Type */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.hostelType}>
              <InputLabel required id="hostel-type-label">Hostel Type</InputLabel>
              <Controller
                name="hostelType"
                control={control}
                defaultValue=""
                rules={{ required: "Hostel Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="hostel-type-label"
                    label="Hostel Type"
                    autoComplete="hostelType"
                  >
                    <MenuItem value="boys">Boys</MenuItem>
                    <MenuItem value="girls">Girls</MenuItem>
                  </Select>
                )}
              />
              {errors.hostelType && (
                <FormHelperText>{errors.hostelType.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>


          {/* Building Name (Block No) */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" error={!!errors.buildingName}>
              <InputLabel required id="building-name-label">
                Building Name (Block No)
              </InputLabel>
              <Controller
                name="buildingName"
                control={control}
                defaultValue=""
                rules={{ required: "Building Name (Block No) is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="building-name-label"
                    label="Building Name (Block No)"
                    autoComplete="buildingName"
                  >
                    {buildingList.length > 0 ? (
                      buildingList.map((building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {building.houseName} {/* Display the house name here */}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        No Buildings Available
                      </MenuItem>
                    )}
                  </Select>
                )}
              />
              {errors.buildingName && (
                <FormHelperText>{errors.buildingName.message}</FormHelperText>
              )}
            </FormControl>


          </Grid>

          {/* Number of Rooms in Hostel */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="numberOfRooms"
              control={control}
              defaultValue=""
              rules={{
                required: "Number of Rooms is required",
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
                  label="Number of Rooms in Hostel"
                  fullWidth
                  autoComplete="numberOfRooms"
                  error={!!errors.numberOfRooms}
                  inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                />
              )}
            />
            {errors.numberOfRooms && (
              <FormHelperText error>{errors.numberOfRooms.message}</FormHelperText>
            )}
          </Grid>

          {/* Number of Seats */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="numberOfSeats"
              control={control}
              defaultValue=""
              rules={{
                required: "Number of Seats is required",
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
                  label="Number of Seats"
                  fullWidth
                  autoComplete="numberOfSeats"
                  error={!!errors.numberOfSeats}
                  inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                />
              )}
            />
            {errors.numberOfSeats && (
              <FormHelperText error>{errors.numberOfSeats.message}</FormHelperText>
            )}
          </Grid>

          {/* Has Playground */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.hasPlayground}>
              <InputLabel required id="playground-label">Has Playground</InputLabel>
              <Controller
                name="hasPlayground"
                control={control}
                defaultValue=""
                rules={{ required: "Playground status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="playground-label"
                    label="Has Playground"
                    autoComplete="hasPlayground"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.hasPlayground && (
                <FormHelperText>{errors.hasPlayground.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Has Internet */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.hasInternet}>
              <InputLabel required id="internet-label">Has Internet Connection</InputLabel>
              <Controller
                name="hasInternet"
                control={control}
                defaultValue=""
                rules={{ required: "Internet Connection status is required" }}
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

          {/* Has Drinking Water */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.hasDrinkingWater}>
              <InputLabel required id="drinking-water-label">Has Drinking Water</InputLabel>
              <Controller
                name="hasDrinkingWater"
                control={control}
                defaultValue=""
                rules={{ required: "Drinking Water status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="drinking-water-label"
                    label="Has Drinking Water"
                    autoComplete="hasDrinkingWater"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.hasDrinkingWater && (
                <FormHelperText>{errors.hasDrinkingWater.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Has Toilet */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.hasToilet}>
              <InputLabel required id="toilet-label">Has Toilet</InputLabel>
              <Controller
                name="hasToilet"
                control={control}
                defaultValue=""
                rules={{ required: "Toilet status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="toilet-label"
                    label="Has Toilet"
                    autoComplete="hasToilet"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.hasToilet && (
                <FormHelperText>{errors.hasToilet.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>


          {/* Area Covered by Hostel */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="areaCovered"
              control={control}
              defaultValue=""
              rules={{
                required: "Area Covered by Hostel is required",
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Please enter a valid decimal number",
                },
                min: {
                  value: 0.01,
                  message: "Area Covered by Hostel must be a positive number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  type="number"
                  size="small"
                  label="Area Covered by Hostel (sq.ft)"
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

export default EditHostelMgmt;
