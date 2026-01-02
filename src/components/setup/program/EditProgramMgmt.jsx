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
import { getFaculty, getLevel, getProgramById, patchProgram } from "../../../services/services";
// import { data } from "autoprefixer";
import { toast } from "react-toastify";

const EditProgramMgmt = ({ id, onClose, onUpdate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm();
  const [getProgramData, setGetProgramData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [levelData, setLevelData] = useState([])

  const onSubmit = async (data) => {
    try {
      await patchProgram(data, id);
      onUpdate()
      onClose()
      reset();
      onUpdate()

      toast.success('Data updated Successfully!!', {
        autoClose:2000
      })
    } catch (err) {
      toast.error('Failed to update!!', {
        autoClose:2000
      })    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultyData = await getFaculty();
        const levelData = await getLevel();
        setLevelData(levelData)
        const getProgramDataById = await getProgramById(id);
        setFacultyData(facultyData);
        setGetProgramData(Array.isArray(getProgramDataById)?getProgramDataById:[getProgramDataById]);
        // Set default values for form fields using setValue
        setValue('universityId', getProgramDataById.universityId)
        setValue('campusId', getProgramDataById.campusId)
        setValue("facultyId", getProgramDataById.facultyId);
        setValue("programType", getProgramDataById.programType);
        setValue("levelId", getProgramDataById.levelId)
        setValue("programName", getProgramDataById.programName);
        setValue("shortName", getProgramDataById.shortName);
        setValue("programType", getProgramDataById.programType);
        setValue("duration", getProgramDataById.duration);
        setValue("code", getProgramDataById.code);
        setValue("alias", getProgramDataById.alias);
        setValue("remarks", getProgramDataById.remarks);
        setValue("status", getProgramDataById.status);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, setValue]);

  return (
    <DialogContent fullWidth>
      <Grid container spacing={3}>
      <Grid item xs={12}>
            <CardContent>
      <Typography variant="h6" gutterBottom               sx={{ textAlign: "center", color: "#2A629A" }}
 padding='10px'>            Program Management
          </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {getProgramData.map((data) => (
            <Grid container spacing={3} key={data.id}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="facultyId" required>
                    Faculty Name
                  </InputLabel>
                  <Select
                    required
                    {...register("facultyId", { required: true })}
                    id="facultyId"
                    size="small"
                    name="facultyId"
                    label="Faculty Name"
                    fullWidth
                    autoComplete="given-name"
                    error={!!errors.facultyId}
                    helpertext={errors.levelId ? "Level required" : ""}
                    defaultValue={data.facultyId}
                  >
                    {facultyData.map((faculty) => (
                      <MenuItem key={faculty.id} value={faculty.id}>
                        {faculty.facultyName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                <InputLabel id="levelId" required>Level Name</InputLabel>
                  <Select
                    required
                    {...register("levelId", {required: true})}
                    id="levelId"
                    size="small"
                    name="levelId"
                    label="Level Name"
                    fullWidth
                    error={!!errors.levelId}
                    helpertext={errors.levelId}
                    defaultValue={data.levelId}

                  >
                  {levelData.map((data) => (
                    <MenuItem value={data.id}>{data.levelName}</MenuItem>
                  ))}
                  </Select>
                  </FormControl>
                </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="programType" required>
                    Program Type
                  </InputLabel>
                  <Select
                    required
                    {...register("programType", { required: true })}
                    id="programType"
                    size="small"
                    name="programType"
                    label="Program Type"
                    fullWidth
                    defaultValue={data.programType}
                    error={!!errors.programType}
                    helpertext={errors.programType ? "Program Type is required" : ""}
                  >
                    <MenuItem value="semester">Semester</MenuItem>
                    <MenuItem value="annual">Annual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                    <TextField
                    required
                      id="duration"
                      {...register("duration", { required: true })}
                      name="duration"
                      size="small"
                      label="Duration"
                      fullWidth
                      error={!!errors.duration}
                      helpertext={errors.duration ? "short Name required" : ""}
                    />
                  </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  {...register("programName", { required: true })}
                  id="programName"
                  size="small"
                  name="programName"
                  label="Program Name"
                  fullWidth
                  error={!!errors.programName}
                  helpertext={errors.programName}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="shortName"
                  {...register("shortName", { required: true })}
                  name="shortName"
                  size="small"
                  label="Short Name"
                  fullWidth
                  error={!!errors.shortName}
                  helpertext={errors.shortName ? "short Name required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  required
                  {...register("code", { required: true })}
                  id="code"
                  size="small"
                  name="code"
                  label="Code"
                  fullWidth
                  error={!!errors.code}
                  helpertext={errors.code ? "Code is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="alias"
                  {...register("alias")}
                  name="alias"
                  size="small"
                  label="Alias"
                  fullWidth
                  error={!!errors.alias}
                />
              </Grid>
             
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    {...register("status")}
                    size="small"
                    label="Status"
                    fullWidth
                    defaultValue={data.status}
                  >
                    <MenuItem value={true}><span style={{color:'green'}}>Active</span></MenuItem>
                    <MenuItem value={false}><span style={{color:'red'}}>InActive</span></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <TextField
                  id="remarks"
                  {...register("remarks")}
                  name="remarks"
                  size="small"
                  label="Details"
                  fullWidth
                  error={!!errors.remarks}
                  helpertext={errors.remarks}
                />
              </Grid>
            </Grid>
          ))}
          <Grid container justifyContent="center" spacing={2} style={{ marginTop: "10px" }}>
            <Grid item>
              <Button onClick={onClose}>Cancel</Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                size="small"
                variant="contained"
                style={{ backgroundColor: "#007aff", color: "#inherit" }}
                onClick={handleSubmit(onSubmit)}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </form>
        </CardContent>
        </Grid>
      </Grid>
    </DialogContent>
  );

};

export default EditProgramMgmt;
