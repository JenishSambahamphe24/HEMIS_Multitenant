import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { blue } from "@mui/material/colors";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditBudgetMgmt = ({ open, handleClose, budgetData, fetchBudgetData, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const { register, handleSubmit, watch, control, setValue } = useForm();
  const [fiscalYears, setFiscalYears] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDropdownData();
      if (budgetData) {
        setValue("universityNameId", budgetData.universityId);
        setValue("fiscalYearId", budgetData.fiscalYearID);
        setValue("regularBudget", budgetData.regularBudget);
        setValue("developBudget", budgetData.developBudget);
        setValue("otherBudget", budgetData.otherBudget);
        setValue("remarks", budgetData.remarks);
      }
    }
  }, [open, budgetData, setValue]);

  const fetchDropdownData = async () => {
    try {
      const config = getAuthConfigSafe()
      const fiscalYearResponse = await axios.get(
        `${backendUrl}/FiscalYear`,
        config
      );
      const universityResponse = await axios.get(
        `${backendUrl}/University/GetAllUniversities`,
        config
      );

      setFiscalYears(fiscalYearResponse.data);
      setUniversities(universityResponse.data);
    } catch (err) {
      console.error(err);
    }
  };
  const id = budgetData ? budgetData.id : 0;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const baseConfig = getAuthConfigSafe()
      const config = {
        ...baseConfig,
        headers: {
          ...baseConfig.headers,
          "Content-Type": "multipart/form-data",
        }
      }

      const formData = {
        ...budgetData,
        id: id,
        universityId: parseInt(data.universityNameId, 10),
        fiscalYearId: parseInt(data.fiscalYearId, 10),
        regularBudget: parseFloat(data.regularBudget),
        developBudget: parseFloat(data.developBudget),
        otherBudget: data.otherBudget ? parseFloat(data.otherBudget) : 0,
        remarks: data.remarks || "",
      };

      await axios.put(
        `${backendUrl}/BudgetDisbursement/${id}`,
        formData,
        config
      );
      toast.success("Budget updated successfully!", {
        autoClose: 2000,
      });
      onUpdate()
      fetchBudgetData();
      handleClose();

    } catch (err) {
      toast.error("Failed to update budget. Please try again.", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const regularBudget = parseFloat(watch("regularBudget") || 0);
  const developBudget = parseFloat(watch("developBudget") || 0);
  const otherBudget = parseFloat(watch("otherBudget") || 0);
  const totalBudget = regularBudget + developBudget + otherBudget;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <Typography
          variant="h6"
          textAlign={"center"}
          sx={{ padding: "5px", color: blue[700] }}
        >
          Update Budget
        </Typography>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={9}>
                <FormControl fullWidth size="small">
                  <InputLabel required>University Name</InputLabel>
                  <Controller
                    name="universityNameId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="University Name">
                        {universities.map((uni) => (
                          <MenuItem key={uni.id} value={uni.id}>
                            {uni.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel required>Fiscal Year</InputLabel>
                  <Controller
                    name="fiscalYearId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Fiscal Year">
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

              <Grid item xs={12} sm={3}>
                <TextField
                  {...register("regularBudget")}
                  type="number"
                  size="small"
                  label="Regular Budget (NRS)"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  {...register("developBudget")}
                  type="number"
                  size="small"
                  label="Development Budget (NRS)"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  {...register("otherBudget")}
                  type="number"
                  size="small"
                  label="Other Budget (NRS)"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label="Total Budget"
                  value={totalBudget.toFixed(2)}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register("remarks")}
                  label="Remarks"
                  size="small"
                  fullWidth
                  rows={2}
                />
              </Grid>
            </Grid>

            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant={"outlined"} onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditBudgetMgmt;
