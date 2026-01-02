import {
  Grid,
  TextField,
  Select,
  InputLabel,
  CardContent,
  Paper,
  Typography,
  FormControl,
  MenuItem,
  Button,
  Chip,
} from "@mui/material";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {config} from '@config';


const ExamType = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { currentUser } = useSelector((state) => state.user);

const onSubmit = async (data) => {
  try {
    const authConfig = getAuthConfigSafe();
    if (!authConfig) {
      toast.error("Authentication failed. Please login again.");
      return;
    }

    const formdata = {
      instituteID: currentUser.institution.universityId,
      exam: data.exam,
      examName: data.examName,
      status: data.status === "true",
      description: data.details,
    };

    await axios.post(`${backendUrl}/ExamType`, formdata, authConfig);
    
    toast.success("Exam Type Successfully Created!!");
    reset();
  } catch (error) {
    console.error("Error adding exam type:", error);
    toast.error(error.response?.data?.message || "An error occurred while creating exam type");
  }
};

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Exam Type Setup
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel required>Exam Type</InputLabel>
                      <Select
                        required
                        {...register("exam")}
                        id="exam"
                        size="small"
                        name="exam"
                        fullWidth
                        label="Exam Type"
                      >
                        <MenuItem value={""}>Select Semester</MenuItem>
                        <MenuItem value={"internal"}>Internal Exam</MenuItem>
                        <MenuItem value={"board"}>External Exam</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      {...register("examName", { required: true })}
                      id="examName"
                      size="small"
                      name="examName"
                      label="Exam Name"
                      fullWidth
                      error={!!errors.examName}
                      helpertext={errors.examName ? "Exam name required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="status" required>
                        Status
                      </InputLabel>
                      <Select
                        required
                        {...register("status")}
                        id="status"
                        size="small"
                        name="status"
                        fullWidth
                        label="Status"
                        error={!!errors.status}
                        helpertext={errors.status ? "Status required" : ""}
                      >
                        <MenuItem value={"true"}>
                          <Chip label="Active" color="success" size="small" />
                        </MenuItem>
                        <MenuItem value={"false"}>
                          <Chip label="Inactive" color="error" size="small" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="details"
                      label="Description"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      sx={{
                        borderColor: "#3f51b5",
                      }}
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
                  <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    style={{ backgroundColor: "#007aff", color: "#inherit" }}
                  >
                    Submit
                  </Button>
                </Grid>
              </form>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ExamType;
