import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import {
  Button,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const EditFacility = ({ id, onUpdate, onClose }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [facilityData, setFacilityData] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchFacilityData = async () => {
      setLoading(true);
      try {
        const config = getAuthConfigSafe();
        const response = await axios.get(`${backendUrl}/Facilty/${id}`, config);
        const data = response.data;

        if (data) {
          setValue("facilityType", data.facilityType || "");
          setValue("adequacyOfFacility", data.adequacyOfFacility || false);
          setValue("facilityAvailability", data.facilityAvailability || false);
          setValue("remarks", data.remarks || "");
          setFacilityData(data);
        } else {
          setErrorMessage("Failed to load facility data: Data is empty.");
        }
      } catch (error) {
        console.error("Failed to load facility data:", error);
        setErrorMessage("Failed to load facility data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const config = getAuthConfigSafe()
      const updatedData = {
        id: id,
        ...data,
      };
      await axios.patch(`${backendUrl}/Facilty/${id}`, updatedData, config);
      toast.success("Facility updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update facility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !facilityData) {
    return (
      <CircularProgress
        color="primary"
        sx={{ display: "block", margin: "auto" }}
      />
    );
  }

  return (
    <Box sx={{ padding: 1, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <CardContent>
        <Typography
          gutterBottom
          sx={{
            textAlign: "center",
            color: "#2A629A",
            marginBottom: 1,
          }}
        >
          Update Facility Information
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" error={!!errors.facilityType}>
                <Controller
                  name="facilityType"
                  control={control}
                  defaultValue={facilityData?.facilityType || ""}
                  rules={{ required: "Facility Type is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      name="facilityType"
                      label="Facility Type"
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.facilityType}
                      helperText={errors.facilityType?.message}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 1,
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Controller
                    name="facilityAvailability"
                    control={control}
                    defaultValue={facilityData?.facilityAvailability || false}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        color="primary"
                      />
                    )}
                  />
                }
                label="Facility Availability"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Controller
                    name="adequacyOfFacility"
                    control={control}
                    defaultValue={facilityData?.adequacyOfFacility || false}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        color="primary"
                      />
                    )}
                  />
                }
                label="Adequacy of Facility"
              />
            </Grid>

            {/* Remarks */}
            <Grid item xs={12}>
              <Controller
                name="remarks"
                control={control}
                defaultValue={facilityData?.remarks || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Remarks"
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      "& .MuiInputBase-root": {
                        borderRadius: 1,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid
              item
              xs={12}
              sx={{ mt: 2 }}
              display="flex"
              justifyContent="center"
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                disabled={loading}
                sx={{
                  borderRadius: "30px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: "#1d4d77",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      {errorMessage && (
        <Typography color="error" align="center">
          {errorMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography color="success" align="center">
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};

export default EditFacility;
