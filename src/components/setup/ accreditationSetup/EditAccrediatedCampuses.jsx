import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  Typography,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { BSToAD, ADToBS } from "bikram-sambat-js";
import {config} from '@config';


const EditAccrediatedCampuses = ({ open, onClose, accrediationData }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [fiscalYears, setFiscalYears] = useState([]);
  const [campusData, setCampusData] = useState({});
  const [loading, setLoading] = useState(false);

  const Id = accrediationData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const currentStatus = watch("status");

  // Get auth token utility function to avoid repetition


  useEffect(() => {
    if (open && Id) {
      const fetchCampusDetails = async () => {
        try {
          const authToken = getAuthToken();
          const config = {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          };

          // Fetch fiscal years
          const fiscalYearResponse = await axios.get(
            `${backendUrl}/FiscalYear`,
            config
          );
          setFiscalYears(fiscalYearResponse.data);

          // Fetch campus accreditation data
          const response = await axios.get(
            `${backendUrl}/AddAccreditation/${Id}`,
            config
          );
          const datas = response.data[0];

          if (datas) {
            setCampusData(datas);

            // Set form values with existing data
            setValue("universityId", datas.universityId || 0);
            setValue("universityName", datas.universityName || "");
            setValue("campusName", datas.campusName || "");
            setValue("campusType", datas.campusType || "");
            setValue("fiscalYearId", datas.fiscalYearId || "");
            setValue("status", datas.status || "Accredited");
            setValue("remarks", datas.remarks || "");

            // Set Accreditation date fields
            if (datas.dateOfAccreditationEng) {
              setValue(
                "dateOfAccreditationEng",
                formatDateForInput(datas.dateOfAccreditationEng)
              );
            }
            setValue(
              "dateOfAccreditationNep",
              datas.dateOfAccreditationNep || ""
            );

            // Set Re-Accreditation date fields
            if (datas.dateOfReAccreditationEng) {
              setValue(
                "dateOfReAccreditationEng",
                formatDateForInput(datas.dateOfReAccreditationEng)
              );
            }
            setValue(
              "dateOfReAccreditationNep",
              datas.dateOfReAccreditationNep || ""
            );

            // Set Expiry date fields for Accreditation
            if (datas.dateOfExpireAccreditationEng) {
              setValue(
                "dateOfExpireAccreditationEng",
                formatDateForInput(datas.dateOfExpireAccreditationEng)
              );
            }
            setValue(
              "dateOfExpireAccreditationNep",
              datas.dateOfExpireAccreditationNep || ""
            );

            // Set Expiry date fields for Re-Accreditation
            if (datas.dateOfExpireRenewAccreditationEng) {
              setValue(
                "dateOfExpireRenewAccreditationEng",
                formatDateForInput(datas.dateOfExpireRenewAccreditationEng)
              );
            }
            setValue(
              "dateOfExpireRenewAccreditationNep",
              datas.dateOfExpireRenewAccreditationNep || ""
            );
          }
        } catch (err) {
          console.error("Error fetching campus details:", err);
          toast.error("Error fetching campus details!");
        }
      };
      fetchCampusDetails();
    }
  }, [open, Id, setValue]);

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  };

  // Handle English date change and convert to Nepali (BS)
  const handleEnglishDateChange = (event) => {
    const { name, value } = event.target;
    setValue(name, value);

    try {
      if (value && value.trim() !== "") {
        // Convert English (AD) date to Nepali (BS) date
        const nepaliDate = ADToBS(value);

        // Map English date field names to their Nepali counterparts
        const nepaliFieldMappings = {
          dateOfAccreditationEng: "dateOfAccreditationNep",
          dateOfReAccreditationEng: "dateOfReAccreditationNep",
          dateOfExpireAccreditationEng: "dateOfExpireAccreditationNep",
          dateOfExpireRenewAccreditationEng: "dateOfExpireRenewAccreditationNep",
        };

        // Set the corresponding Nepali date field
        const nepaliFieldName = nepaliFieldMappings[name];
        if (nepaliFieldName && nepaliDate) {
          setValue(nepaliFieldName, nepaliDate);
        }
      }
    } catch (error) {
      console.error(`Date conversion error for ${name}:`, error);
      toast.error("Error converting date format");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const submissionData = new FormData();
      submissionData.append("universityId", campusData.universityId);
      submissionData.append("addCampusAccreditationId", Id);
      submissionData.append("fiscalYearId", data.fiscalYearId);
      submissionData.append("status", data.status);
      submissionData.append("remarks", data.remarks || "");

      // Add date fields based on status
      if (data.status === "Accredited") {
        submissionData.append(
          "dateOfAccreditationNep",
          data.dateOfAccreditationNep || ""
        );
        submissionData.append(
          "dateOfAccreditationEng",
          data.dateOfAccreditationEng || ""
        );
        submissionData.append(
          "dateOfExpireAccreditationNep",
          data.dateOfExpireAccreditationNep || ""
        );
        submissionData.append(
          "dateOfExpireAccreditationEng",
          data.dateOfExpireAccreditationEng || ""
        );
        // Set reaccreditation fields to empty for Accredited status
        submissionData.append("dateOfReAccreditationNep", "");
        submissionData.append("dateOfReAccreditationEng", "");
        submissionData.append("dateOfExpireRenewAccreditationNep", "");
        submissionData.append("dateOfExpireRenewAccreditationEng", "");
      } else if (data.status === "renew") {
        // Preserve accreditation date if it exists
        submissionData.append(
          "dateOfAccreditationNep",
          data.dateOfAccreditationNep || ""
        );
        submissionData.append(
          "dateOfAccreditationEng",
          data.dateOfAccreditationEng || ""
        );
        submissionData.append(
          "dateOfExpireAccreditationNep",
          data.dateOfExpireAccreditationNep || ""
        );
        submissionData.append(
          "dateOfExpireAccreditationEng",
          data.dateOfExpireAccreditationEng || ""
        );
        // Add re-accreditation dates
        submissionData.append(
          "dateOfReAccreditationNep",
          data.dateOfReAccreditationNep || ""
        );
        submissionData.append(
          "dateOfReAccreditationEng",
          data.dateOfReAccreditationEng || ""
        );
        submissionData.append(
          "dateOfExpireRenewAccreditationNep",
          data.dateOfExpireRenewAccreditationNep || ""
        );
        submissionData.append(
          "dateOfExpireRenewAccreditationEng",
          data.dateOfExpireRenewAccreditationEng || ""
        );
      }

      // Handle file upload if provided
      if (data.evidenceDoc && data.evidenceDoc[0]) {
        submissionData.append("evidenceDoc", data.evidenceDoc[0]);
      }

      const authToken = getAuthToken();
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.put(
        `${backendUrl}/AddAccreditation/${Id}`,
        submissionData,
        config
      );
      toast.success("Accreditation updated successfully!");
      reset();
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(
        err.response?.data?.message || "Failed to update accreditation!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ textAlign: "center", color: "#2A629A", padding: "10px" }}
        >
          Update Accreditation
        </Typography>
        <Box
          component="form"
          id="renewAccreditationForm"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 2 }}
        >
          <Grid container spacing={2}>
            {/* Fiscal Year Selection */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel required id="fiscalYearId-label">
                  Fiscal Year
                </InputLabel>
                <Select
                  {...register("fiscalYearId", { required: true })}
                  id="fiscalYearId"
                  name="fiscalYearId"
                  labelId="fiscalYearId-label"
                  label="Fiscal Year"
                  value={watch("fiscalYearId") || ""}
                >
                  <MenuItem value="" disabled>
                    Select Fiscal Year
                  </MenuItem>
                  {fiscalYears.map((fy) => (
                    <MenuItem key={fy.id} value={fy.id}>
                      {fy.yearNepali}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* University and Campus Information - Read Only */}
            <Grid item xs={4}>
              <TextField
                {...register("universityName")}
                size="small"
                label="University Name"
                fullWidth
                InputProps={{
                  readOnly: true,
                  style: { color: "grey" },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                {...register("campusName")}
                size="small"
                label="Campus Name"
                fullWidth
                InputProps={{
                  readOnly: true,
                  style: { color: "grey" },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                {...register("campusType")}
                size="small"
                label="Campus Type"
                fullWidth
                InputProps={{
                  readOnly: true,
                  style: { color: "grey" },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Status Selection */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  {...register("status", { required: "Status is required" })}
                  value={watch("status") || "Accredited"}
                  fullWidth
                  label="Status"
                >
                  <MenuItem value="Accredited">
                    <span style={{ color: "blue" }}>Accredited</span>
                  </MenuItem>
                  <MenuItem value="renew">
                    <span style={{ color: "green" }}>Re-Accredited</span>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Accreditation Date Fields */}
            {(currentStatus === "Accredited" || !currentStatus) && (
              <>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    {...register("dateOfAccreditationEng", { required: true })}
                    size="small"
                    label="Date of Accreditation (AD)"
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleEnglishDateChange}
                    value={watch("dateOfAccreditationEng") || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    {...register("dateOfAccreditationNep")}
                    size="small"
                    label="Date of Accreditation (BS)"
                    fullWidth
                    value={watch("dateOfAccreditationNep") || ""}
                    InputProps={{
                      readOnly: true,
                      style: { color: "grey" },
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    {...register("dateOfExpireAccreditationEng", {
                      required: "Expiry Date is required",
                    })}
                    size="small"
                    label="Expiry Date (AD)"
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfExpireAccreditationEng}
                    helperText={errors.dateOfExpireAccreditationEng?.message}
                    value={watch("dateOfExpireAccreditationEng") || ""}
                    onChange={handleEnglishDateChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    {...register("dateOfExpireAccreditationNep")}
                    size="small"
                    label="Expiry Date (BS)"
                    fullWidth
                    value={watch("dateOfExpireAccreditationNep") || ""}
                    InputProps={{
                      readOnly: true,
                      style: { color: "grey" },
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfExpireAccreditationNep}
                    helperText={errors.dateOfExpireAccreditationNep?.message}
                  />
                </Grid>
              </>
            )}

            {/* Re-Accreditation Date Fields */}
            {currentStatus === "renew" && (
              <>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    {...register("dateOfReAccreditationEng", {
                      required: true,
                    })}
                    size="small"
                    label="Date of Re-Accreditation (AD)"
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleEnglishDateChange}
                    value={watch("dateOfReAccreditationEng") || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    {...register("dateOfReAccreditationNep")}
                    size="small"
                    label="Date of Re-Accreditation (BS)"
                    fullWidth
                    value={watch("dateOfReAccreditationNep") || ""}
                    InputProps={{
                      readOnly: true,
                      style: { color: "grey" },
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    {...register("dateOfExpireRenewAccreditationEng", {
                      required: "Expiry Date is required",
                    })}
                    size="small"
                    label="Expiry Date (AD)"
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfExpireRenewAccreditationEng}
                    helperText={errors.dateOfExpireRenewAccreditationEng?.message}
                    value={watch("dateOfExpireRenewAccreditationEng") || ""}
                    onChange={handleEnglishDateChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    {...register("dateOfExpireRenewAccreditationNep")}
                    size="small"
                    label="Expiry Date (BS)"
                    fullWidth
                    value={watch("dateOfExpireRenewAccreditationNep") || ""}
                    InputProps={{
                      readOnly: true,
                      style: { color: "grey" },
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfExpireRenewAccreditationNep}
                    helperText={errors.dateOfExpireRenewAccreditationNep?.message}
                  />
                </Grid>
              </>
            )}

            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                {...register("remarks")}
                size="small"
                label="Remarks"
                fullWidth
                multiline
                InputLabelProps={{ shrink: true }}
                rows={2}
              />
            </Grid>

            {/* Evidence Document Upload */}
            <Grid item xs={12} sm={3.5}>
              <FormControl fullWidth>
                <TextField
                  {...register("evidenceDoc")}
                  id="evidenceDoc"
                  size="small"
                  name="evidenceDoc"
                  label="Upload evidence document"
                  type="file"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          form="renewAccreditationForm"
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Accreditation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccrediatedCampuses;