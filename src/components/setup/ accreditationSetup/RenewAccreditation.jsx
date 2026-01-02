import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { ADToBS } from "bikram-sambat-js";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const AddAccreditation = ({ open, onClose, campusId }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [campusData, setCampusData] = useState({});
  const [fiscalYears, setFiscalYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const watchedFile = watch("evidenceDoc");

  useEffect(() => {
    if (open && campusId) {
      const fetchCampusDetails = async () => {
        try {
          const config = getAuthConfigSafe()
          const fiscalYearResponse = await axios.get(
            `${backendUrl}/FiscalYear`,
            config
          );
          setFiscalYears(fiscalYearResponse.data);

          const response = await axios.get(
            `${backendUrl}/AddCampusAccreditation/${campusId}`,
            config
          );
          const campusDetails = response.data;
          setCampusData(campusDetails);

          setValue("universityId", campusDetails.universityId || 0);
          setValue("universityName", campusDetails.name || "");
          setValue("campusName", campusDetails.campusName || "");
          setValue("campusType", campusDetails.campusType || "");
        } catch (err) {
          console.error("Error fetching campus details:", err);
          toast.error("Error fetching campus details!");
        }
      };
      fetchCampusDetails();
    }
  }, [open, campusId, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const submissionData = new FormData();
      submissionData.append("universityId", campusData.universityId);
      submissionData.append("addCampusAccreditationId", campusId);
      submissionData.append(
        "fiscalYearId",
        data.fiscalYearId || activeFiscalYear
      );
      submissionData.append(
        "dateOfReAccreditationNep",
        data.dateOfReAccreditationNep || ""
      );
      submissionData.append(
        "dateOfReAccreditationEng",
        data.dateOfReAccreditationEng
      );
      submissionData.append(
        "dateOfExpireRenewAccreditationNep",
        data.dateOfExpireRenewAccreditationNep
      );
      submissionData.append(
        "dateOfExpireRenewAccreditationEng",
        data.dateOfExpireRenewAccreditationEng
      );

      submissionData.append("status", data.status);
      submissionData.append("remarks", data.remarks);
      if (watchedFile?.[0]) {
        submissionData.append("evidenceDoc", watchedFile[0]);
      }
      const config = getAuthConfigSafe()
      await axios.post(
        `${backendUrl}/AddAccreditation`,
        submissionData,
        config
      );
      toast.success("Form submitted successfully!", { autoClose: 2000 });
      reset();
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit the form!");
    } finally {
      setLoading(false);
    }
  };

  const activeFiscalYear = fiscalYears.find(
    (data) => data && data.activeFiscalYear === true
  );
  const activeYear = activeFiscalYear?.id;

  const handleNepaliDateChange = (name, value) => {
    setValue(name, value);

    try {
      if (name === "dateOfReAccreditationEng") {
        const nepaliDate = ADToBS(value);
        if (nepaliDate) {
          setValue("dateOfReAccreditationNep", nepaliDate);
        }
      } else if (name === "dateOfExpireRenewAccreditationEng") {
        const nepaliDate = ADToBS(value);
        if (nepaliDate) {
          setValue("dateOfExpireRenewAccreditationNep", nepaliDate);
        }
      }
    } catch (error) {
      console.error("Date conversion error:", error);
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
          Re-Accreditate for {watch("campusName")}
        </Typography>
        <Box
          component="form"
          id="addAccreditationForm"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 2 }}
        >
          <Grid container spacing={2}>
            {activeYear && (
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
                    defaultValue={activeYear || ""}
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
            )}
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
            <Grid item xs={12} sm={3}>
              <TextField
                value={watch("dateOfReAccreditationEng") || ""}
                {...register("dateOfReAccreditationEng")}
                size="small"
                label="Date of Accreditation (AD)"
                fullWidth
                type="date"
                onChange={(e) =>
                  handleNepaliDateChange("dateOfReAccreditationEng", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                value={watch("dateOfReAccreditationNep") || ""}
                {...register("dateOfReAccreditationNep")}
                size="small"
                label="Date of Accreditation (BS)"
                fullWidth
                disabled
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                value={watch("dateOfExpireRenewAccreditationEng") || ""}
                {...register("dateOfExpireRenewAccreditationEng")}
                size="small"
                label="Date of Expiry (AD)"
                fullWidth
                type="date"
                onChange={(e) =>
                  handleNepaliDateChange("dateOfExpireRenewAccreditationEng", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                value={watch("dateOfExpireRenewAccreditationNep") || ""}
                {...register("dateOfExpireRenewAccreditationNep")}
                size="small"
                label="Date of Expiry (BS)"
                disabled
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  {...register("status", { required: "Status is required" })}
                  defaultValue="renew"
                  error={!!errors.status}
                  fullWidth
                  label="Status"
                >
                  <MenuItem value="renew">
                    <span style={{ color: "green" }}>Re-Accredited</span>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register("evidenceDoc", { required: false })}
                id="evidenceDoc"
                size="small"
                name="evidenceDoc"
                label="Upload evidence document"
                type="file"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("remarks")}
                size="small"
                label="Remarks"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent={"center"} gap={1} padding={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={onClose}
            color="error"
          >
            Cancel
          </Button>
          <Button
            size="small"
            form="addAccreditationForm"
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Accreditation"}
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccreditation;
