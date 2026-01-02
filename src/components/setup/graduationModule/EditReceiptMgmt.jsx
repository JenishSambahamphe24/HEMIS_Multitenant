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
  Autocomplete,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditReceiptMgmt = ({ id, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
  } = useForm();

  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [feeTypes, setFeeTypes] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const campusName = currentUser?.institution?.campusName;
  const campusId = currentUser?.institution?.id;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const config = getAuthConfigSafe()
        const receiptResponse = await axios.get(`${backendUrl}/Receipt/${id}`, config);
        const receiptData = receiptResponse.data;

        // Populate form fields with fetched data
        setValue("campusId", receiptData.campusId || 0);
        setValue("receiptNo", receiptData.receiptNo || 0);
        setValue("fiscalYearId", receiptData.fiscalYearID || 0);
        setValue("applicantName", receiptData.applicantNameEng || "");
        setValue("receiptItemId", receiptData.receiptItemID || 0);
        setValue("dob", receiptData.doBNepali || "");
        setValue("dateOfPayment", receiptData.dateOfPayment || "");
        setValue("amountPaid", receiptData.amountPaid || 0);
        setValue("remarks", receiptData.remarks || "");

        // Fetch fee types and fiscal years for dropdowns
        const [feeTypeResponse, fiscalYearResponse] = await Promise.all([
          axios.get(`${backendUrl}/FeeType`, config),
          axios.get(`${backendUrl}/FiscalYear`, config),
        ]);
        setFeeTypes(feeTypeResponse.data);
        setFiscalYears(fiscalYearResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitialData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("id", id);
    formData.append("campusId", data.campusId);
    formData.append("receiptNo", data.receiptNo);
    formData.append("fiscalYearID", data.fiscalYearId);
    formData.append("applicantNameEng", data.applicantName);
    formData.append("receiptItemID", data.receiptItemId);
    formData.append("doBNepali", data.dob);
    formData.append("cateOfPayment", data.dateOfPayment);
    formData.append("amountPaid", parseFloat(data.amountPaid) || 0);
    formData.append("remarks", data.remarks || "");
    if (data.uploadApplication?.[0]) {
      formData.append("uploadApplication", data.uploadApplication[0]);
    }

    try {
      const config = getAuthConfigSafe()
      await axios.put(`${backendUrl}/Receipt/${id}`, formData, config);
      toast.success("Receipt updated successfully", {
        autoClose: 1500,
      });
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Error updating receipt: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", color: "#2A629A", padding: "10px" }}
      >
        Edit Receipt Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              size="small"
              id="campusName"
              name="campusName"
              label="Campus Name"
              value={campusName || ""}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="receiptNo"
              control={control}
              defaultValue=""
              rules={{
                required: "Receipt No is required",
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Please enter a valid number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="receiptNo"
                  required
                  label="Receipt No."
                  fullWidth
                  size="small"
                  error={!!errors.receiptNo}
                  helperText={errors.receiptNo?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small" error={!!errors.fiscalYearId}>
              <InputLabel required id="fiscalYearId-label">Fiscal Year</InputLabel>
              <Controller
                name="fiscalYearId"
                control={control}
                defaultValue=""
                rules={{ required: "Fiscal Year is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="fiscalYearId"
                    labelId="fiscalYearId-label"
                    label="Fiscal Year"

                  >
                    {fiscalYears.map((fy) => (
                      <MenuItem key={fy.id} value={fy.id}>
                        {fy.yearNepali}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="applicantName"
              control={control}
              defaultValue=""
              rules={{ required: "Applicant Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...register("applicantName", { required: "Applicant Name is required" })}
                  id="applicantName"
                  label="Applicant Name (English)"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.applicantName}
                  helperText={errors.applicantName?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="receiptItemId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={feeTypes}

                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) => option.id === value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Receipt Item"
                      size="small"
                      required
                    />
                  )}
                  onChange={(_, value) => field.onChange(value?.id || null)}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="dateOfPayment"
              control={control}
              defaultValue=""
              rules={{ required: "Date of Birth is required" }}
              render={({ field }) => (
                <TextField
                  {...field}

                  id="dateOfPayment"
                  label="Date of Payment"
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="amountPaid"
              control={control}
              defaultValue=""
              rules={{ required: "Amount is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="amountPaid"
                  label="Amount Paid"
                  type="number"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.amountPaid}
                  helperText={errors.amountPaid?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              {...register("uploadApplication")}
              id="uploadApplication"
              label="Upload Application"
              type="file"
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="remarks"
              control={control}
              defaultValue=""
              rules={{ required: "Remarks is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="remarks"
                  label="Remarks"
                  fullWidth
                  multiline
                  rows={1}
                  size="small"
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

export default EditReceiptMgmt;
