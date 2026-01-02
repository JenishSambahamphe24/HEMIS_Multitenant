import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';


const EditMajorSubject = ({ id, onClose, onUpdate, programs, campusId }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [majorById, setMajorById] = useState(null);
  
  const getMajorSubjectById = async (id) => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/MajorSubject/${id}`, config);
      return response.data;
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch major subject details");
      throw err;
    }
  };

  const updateMajorSubject = async (data, id) => {
    try {
     const config = getAuthConfigSafe()
      const response = await axios.put(`${backendUrl}/MajorSubject/${id}`, data, config);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const onSubmit = async (data) => {
    try {
      const updateData = {
        id: id,
        campusId:campusId,
        programMgmtId: parseInt(data.programId),
        majorSubjectName: data.majorSubjectName.trim(),
        remarks: data.remarks ? data.remarks.trim() : "",
        status: data.status,
      };

      await updateMajorSubject(updateData, id);
      onUpdate();
      onClose();
      toast.success("Major subject updated successfully", {
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Submission error:", err);
      if (err.response && err.response.status === 409) {
        toast.error("Major subject already exists!", {
          autoClose: 2000,
        });
      } else {
        toast.error("Failed to update data!", {
          autoClose: 2000,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const majorSubjectData = await getMajorSubjectById(id);
        setMajorById(majorSubjectData);
        setValue("programId", majorSubjectData.programMgmtId);
        setValue("majorSubjectName", majorSubjectData.majorSubjectName);
        setValue("status", majorSubjectData.status);
        setValue("remarks", majorSubjectData.remarks);
        fetchPrograms();
      } catch (err) {
        console.log(err);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, setValue]);

  return (
    <>
      <DialogContent fullWidth>
        <Grid container spacing={0}>
          <Grid item xs={12} md={12}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Edit Group/Program Major 
              </Typography>
              {majorById && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="program-label">Program</InputLabel>
                        <Select
                          labelId="program-label"
                          label="Program"
                          defaultValue={majorById.programMgmtId}
                          {...register("programId", {
                            required: "Program is required",
                          })}
                          error={!!errors.programId}
                        >
                          {programs.map((program) => (
                            <MenuItem key={program.id} value={program.id}>
                              {program.programName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        {...register("majorSubjectName", {
                          required: "Major Subject Name is required",
                        })}
                        size="small"
                        label="Group/Program Major"
                        fullWidth
                        error={!!errors.majorSubjectName}
                        helperText={errors.majorSubjectName?.message}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                          labelId="status-label"
                          label="Status"
                          defaultValue={majorById.status}
                          {...register("status")}
                        >
                          <MenuItem value={true}>Active</MenuItem>
                          <MenuItem value={false}>Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        {...register("remarks")}
                        size="small"
                        label="Remarks"
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    style={{
                      margin: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                      type="submit"
                      size="small"
                      variant="contained"
                      style={{
                        backgroundColor: "#007aff",
                        color: "#inherit",
                      }}
                    >
                      Update
                    </Button>
                  </Grid>
                </form>
              )}
            </CardContent>
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
};

export default EditMajorSubject;