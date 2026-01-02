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
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditLabMgmt = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [buildingList, setBuildingList] = useState([]);
  const [labData, setLabData] = useState({});

  useEffect(() => {
    const fetchLabDataById = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(`${backendUrl}/Labs/${id}`, config);
        const labData = response.data;
        setLabData(labData);
        setValue("labName", labData.labName || "");
        setValue("buildingName", labData?.buildingId || 0);
        setValue("areaCovered", labData.areaCoveredByLab || 0);
        setValue("labType", labData.labType || "");
        setValue(
          "equipmentAdequacy",
          labData.adequencyOfLabEquipment ? "yes" : "no"
        );
        setValue(
          "hasInternetConnection",
          labData.hasInternetConnection ? "yes" : "no"
        );
        setValue("equipmentAtLab", labData.equipmentAtLab || "");
        setValue("remarks", labData.remarks || "");
      } catch (error) {
        console.error("Error fetching lab data:", error);
      }
    };

    fetchLabDataById();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiLabData = {
      id: id,
      labName: data.labName || "",
      buildingId: data.buildingName || "",
      areaCoveredByLab: parseFloat(data.areaCovered) || 0,
      labType: data.labType || "",
      adequencyOfLabEquipment: data.equipmentAdequacy === "yes",
      hasInternetConnection: data.hasInternetConnection === "yes",
      equipmentAtLab: data.equipmentAtLab || "",
      remarks: data.remarks || "",
    };

    try {
      const config = getAuthConfigSafe()
      await axios.put(`${backendUrl}/Labs/${id}`, apiLabData, config);
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
        Edit Lab Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Lab Name */}
          <Grid item xs={12} sm={4}>
            <Controller
              name="labName"
              control={control}
              defaultValue=""
              rules={{ required: "Lab Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Lab Name"
                  fullWidth
                  autoComplete="labName"
                  error={!!errors.labName}
                />
              )}
            />
            {errors.labName && (
              <FormHelperText error>{errors.labName.message}</FormHelperText>
            )}
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
                defaultValue={labData?.buildingId || ""}
                rules={{ required: "Building Name (Block No) is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="building-name-label"
                    label="Building Name (Block No)"
                    autoComplete="buildingName"
                    defaultValue={labData?.buildingId || ""}

                  >
                    {buildingList.length > 0 ? (
                      buildingList.map((building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {building.houseName}{" "}
                          {/* Display the house name here */}
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

          {/* Area Covered by Lab */}
          <Grid item xs={12} sm={4}>
            <Controller
              name="areaCovered"
              control={control}
              defaultValue=""
              rules={{
                required: "Area Covered by Lab is required",
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Please enter a valid decimal number",
                },
                min: {
                  value: 0.01,
                  message: "Area Covered by Lab must be a positive number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  type="number"
                  size="small"
                  label="Area Covered by Lab(in sq. ft)"
                  fullWidth
                  autoComplete="areaCovered"
                  error={!!errors.areaCovered}
                  inputProps={{ step: "0.01", min: "0.01" }} // Allows decimal input, min value set
                />
              )}
            />
            {errors.areaCovered && (
              <FormHelperText error>
                {errors.areaCovered.message}
              </FormHelperText>
            )}
          </Grid>

          {/* Lab Type */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="labType"
              control={control}
              defaultValue=""
              rules={{ required: "Lab Type is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Lab Type"
                  fullWidth
                  autoComplete="labType"
                  error={!!errors.labType}
                />
              )}
            />
            {errors.labType && (
              <FormHelperText error>{errors.labType.message}</FormHelperText>
            )}
          </Grid>

          {/* Adequacy of Lab Equipment */}
          <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              size="small"
              error={!!errors.equipmentAdequacy}
            >
              <InputLabel required id="equipment-adequacy-label">
                Adequacy of Lab Equipment
              </InputLabel>
              <Controller
                name="equipmentAdequacy"
                control={control}
                defaultValue=""
                rules={{ required: "Adequacy of Lab Equipment is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="equipment-adequacy-label"
                    label="Adequacy of Lab Equipment"
                    autoComplete="equipmentAdequacy"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.equipmentAdequacy && (
                <FormHelperText>
                  {errors.equipmentAdequacy.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Has Internet Connection */}
          <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              size="small"
              error={!!errors.hasInternetConnection}
            >
              <InputLabel required id="internet-connection-label">
                Has Internet Connection
              </InputLabel>
              <Controller
                name="hasInternetConnection"
                control={control}
                defaultValue=""
                rules={{ required: "Internet Connection status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="internet-connection-label"
                    label="Has Internet Connection"
                    autoComplete="hasInternetConnection"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                )}
              />
              {errors.hasInternetConnection && (
                <FormHelperText>
                  {errors.hasInternetConnection.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Equipment at Lab */}
          <Grid item xs={12} sm={3}>
            <Controller
              name="equipmentAtLab"
              control={control}
              defaultValue=""
              rules={{ required: "Equipment at Lab is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Equipment at Lab"
                  fullWidth
                  autoComplete="equipmentAtLab"
                  error={!!errors.equipmentAtLab}
                />
              )}
            />
            {errors.equipmentAtLab && (
              <FormHelperText error>
                {errors.equipmentAtLab.message}
              </FormHelperText>
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
                  multiline
                  rows={2}
                  InputProps={{ style: { minWidth: "100%" } }}
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

export default EditLabMgmt;
