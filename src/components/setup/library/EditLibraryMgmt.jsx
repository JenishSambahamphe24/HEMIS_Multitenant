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
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const EditLibraryMgmt = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [buildingList, setBuildingList] = useState([]);
  const [libraryDatas, setLibraryDatas] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const campsuId = currentUser?.institution?.id;


  useEffect(() => {
    const fetchLibraryDataById = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(`${backendUrl}/Library/${id}`, config);
        const libraryData = response.data;
        setLibraryDatas(libraryData)
        setValue("libraryName", libraryData.libraryName || "");
        setValue("buildingName", libraryData.buildingId || "");
        setValue("numberOfLibraryrooms", libraryData.noOfLibraryRooms || 0);
        setValue("areaCoveredRooms", libraryData.totalAreaOfLibraryRoom || 0);
        setValue("numberOfReadingHalls", libraryData.noOfReadingHalls || "");
        setValue("areaReadingHalls", libraryData.areaOfReadingHall || 0);
        setValue("numberofBooks", libraryData.noOfBooks || 0);
        setValue("numberofDailyJournals", libraryData.noOfDailyJournals || 0);
        setValue("numberofweeklyJournals", libraryData.noOfWeeklyJournals || 0);
        setValue("numberofmonthlyJournals", libraryData.noOfMonthlyJournals || 0);
        setValue("numberofannualJournals", libraryData.noOfAnnualJournals || 0);
        setValue("hasELibrary", libraryData.hasELibraryFacility ? "yes" : "no");
        setValue("remarks", libraryData.remarks || "");
      } catch (error) {
        console.error("Error fetching Library data:", error);
      }
    };

    fetchLibraryDataById();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiLibraryData = {
      id: id,
      libraryName: data.libraryName || "",
      buildingId: data.buildingName || "",
      campusId: campsuId,
      noOfLibraryRooms: parseInt(data.numberOfLibraryrooms) || 0,
      totalAreaOfLibraryRoom: parseFloat(data.areaCoveredRooms) || 0,
      noOfReadingHalls: parseInt(data.numberOfReadingHalls) || 0,
      areaOfReadingHall: parseFloat(data.areaReadingHalls) || 0,
      noOfBooks: parseInt(data.numberofBooks) || 0,
      noOfDailyJournals: parseInt(data.numberofDailyJournals) || 0,
      noOfWeeklyJournals: parseInt(data.numberofweeklyJournals) || 0, noOfMonthlyJournals: parseInt(data.numberofmonthlyJournals) || 0,
      noOfAnnualJournals: parseInt(data.numberofannualJournals) || 0,
      hasELibraryFacility: data.hasELibrary === "yes",
      remarks: data.remarks || "",


    };

    try {
      const config = getAuthConfigSafe()
      await axios.put(`${backendUrl}/Library/${id}`, apiLibraryData, config);
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
  }, []);

  return (
    <DialogContent fullWidth>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", color: "#2A629A", padding: "10px" }}
      >
        Edit Library Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Controller
              name="libraryName"
              control={control}
              defaultValue=""
              rules={{ required: "Library Name  is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Library Name"
                  fullWidth
                  autoComplete="libraryName"
                  error={!!errors.libraryName}
                />
              )}
            />
            {errors.libraryName && (
              <FormHelperText error>{errors.libraryName.message}</FormHelperText>
            )}
          </Grid>

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
          <Grid item xs={12} sm={3}>
            <Controller
              name="numberOfLibraryrooms"
              control={control}
              defaultValue=""
              rules={{
                required: "Number of Library Rooms is required",
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
                  label="Number of Library Rooms"
                  fullWidth
                  autoComplete="numberOfLibraryrooms"
                  error={!!errors.numberOfLibraryrooms}
                  inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                />
              )}
            />
            {errors.numberOfLibraryrooms && (
              <FormHelperText error>{errors.numberOfLibraryrooms.message}</FormHelperText>
            )}
          </Grid>
          {/* Area Covered by Library Rooms */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="areaCoveredRooms"
              control={control}
              defaultValue=""
              rules={{
                required: "Total Area Covered by Library Rooms is required",
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Please enter a valid decimal number",
                },
                min: {
                  value: 0.01,
                  message: "Total Area Covered by Library Rooms must be a positive number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  type="number"
                  size="small"
                  label="Total Area Covered by Library Rooms (sq.ft)"
                  fullWidth
                  autoComplete="areaCoveredRooms"

                  inputProps={{ step: "0.01", min: "0.01" }} // Allows only positive decimal numbers
                />
              )}
            />
            {errors.areaCoveredRooms && (
              <FormHelperText error>{errors.areaCoveredRooms.message}</FormHelperText>
            )}
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="numberOfReadingHalls"
              control={control}
              defaultValue=""
              rules={{
                required: "Number of Reading Halls  is required",
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
                  label="Number of Reading Halls"
                  fullWidth
                  autoComplete="numberOfReadingHalls"
                  error={!!errors.numberOfReadingHalls}
                  inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                />
              )}
            />
            {errors.numberOfReadingHalls && (
              <FormHelperText error>{errors.numberOfReadingHalls.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="areaReadingHalls"
              control={control}
              defaultValue=""
              rules={{
                required: "Total Area Covered by Reading Halls is required",
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Please enter a valid decimal number",
                },
                min: {
                  value: 0.01,
                  message: "Area of Reading Hall must be a positive number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  type="number"
                  size="small"
                  label="Area of Reading Halls (sq.ft)"
                  fullWidth
                  autoComplete="areaReadingHalls"

                  inputProps={{ step: "0.01", min: "0.01" }} // Allows only positive decimal numbers
                />
              )}
            />
            {errors.areaReadingHalls && (
              <FormHelperText error>{errors.areaReadingHalls.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="numberofBooks"
              control={control}
              defaultValue=""
              rules={{ required: "Number of Books is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Number of Books"
                  fullWidth
                  autoComplete="numberofBooks"
                  error={!!errors.numberofBooks}
                />
              )}
            />
            {errors.numberofBooks && (
              <FormHelperText error>{errors.numberofBooks.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={2}>
            <Controller
              name="numberofDailyJournals"
              control={control}
              defaultValue=""

              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Number of Daily Journals"
                  fullWidth
                  autoComplete="numberofDailyJournals"
                  error={!!errors.numberofDailyJournals}
                />
              )}
            />
            {errors.numberofDailyJournals && (
              <FormHelperText error>{errors.numberofDailyJournals.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={2}>
            <Controller
              name="numberofweeklyJournals"
              control={control}
              defaultValue=""

              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Number of Weekly Journals"
                  fullWidth
                  autoComplete="numberofweeklyJournals"
                  error={!!errors.numberofweeklyJournals}
                />
              )}
            />
            {errors.numberofweeklyJournals && (
              <FormHelperText error>{errors.numberofweeklyJournals.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={2}>
            <Controller
              name="numberofmonthlyJournals"
              control={control}
              defaultValue=""

              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Number of Monthly Journals"
                  fullWidth
                  autoComplete="numberofmonthlyJournals"
                  error={!!errors.numberofmonthlyJournals}
                />
              )}
            />
            {errors.numberofmonthlyJournals && (
              <FormHelperText error>{errors.numberofmonthlyJournals.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={2}>
            <Controller
              name="numberofannualJournals"
              control={control}
              defaultValue=""

              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Number of Annual Journals"
                  fullWidth
                  autoComplete="numberofannualJournals"
                  error={!!errors.numberofannualJournals}
                />
              )}
            />
            {errors.numberofannualJournals && (
              <FormHelperText error>{errors.numberofanualJournals.message}</FormHelperText>
            )}
          </Grid>
          {/* Has E-Library Facility */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" error={!!errors.hasELibrary}>
              <InputLabel required id="elibrary-label">Has E-Library Facility </InputLabel>
              <Controller
                name="hasELibrary"
                control={control}
                defaultValue=""
                rules={{ required: "Has ELibrary Facility is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="elibrary-label"
                    label="Has ELibrary Facility"
                    autoComplete="hasELibrary"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.hasELibrary && (
                <FormHelperText>{errors.hasELibrary.message}</FormHelperText>
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

export default EditLibraryMgmt;
