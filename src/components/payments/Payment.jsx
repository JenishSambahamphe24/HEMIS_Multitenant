import {  useForm } from "react-hook-form";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl
  
} from "@mui/material";


export default function Payment() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //   const handleEditClick = (facultyId) => {
  //     setSelectedFacultyId(facultyId);
  //     setOpenEditDialog(true);
  //   };

  return (
    <Grid container spacing={3}>
      <Grid item xs={false} md={2} />
      <Grid item xs={12} md={8}>
        <Paper elevation={5} sx={{ borderRadius: "20px" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", color: "#2A629A" }}
            >
              Payment Information
            </Typography>
            <form
            // onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <FormControl size="small" fullWidth>
                    <TextField
                      required
                      {...register("paymentDate", { required: true })}
                      id="paymentDate"
                      size="small"
                      type="date"
                      label="Payment Date"
                      name="paymentDate"
                      fullWidth
                      autoComplete="given-name"
                      error={!!errors.paymentDate}
                      helpertext={
                        errors.paymentDate ? "Payment Date required" : ""
                      }
                      InputLabelProps={{
            shrink: true, // Always shrink the label
          }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="methods" required>
                      Methods{" "}
                    </InputLabel>
                    <Select
                      required
                      {...register("methods", { required: true })}
                      id="methods"
                      size="small"
                      name="methods"
                      label="Methods of Payment"
                      fullWidth
                      error={!!errors.methods}
                      helpertext={errors.methods}
                    >
                      <MenuItem value="active">Cash In counter</MenuItem>
                      <MenuItem value="inActive">Bank</MenuItem>
                      <MenuItem value="inActive">Online Payment</MenuItem>
                      <MenuItem value="inActive">Others</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    {...register("amount", { required: true })}
                    id="amount"
                    size="small"
                    name="amount"
                    label="Amount"
                    fullWidth
                    error={!!errors.amount}
                    helpertext={errors.amount ? "Amount required" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    {...register("rasidNo", { required: true })}
                    id="rasidNo"
                    size="small"
                    name="rasidNo"
                    label="Rasid No.:"
                    fullWidth
                    error={!!errors.rasidNo}
                    helpertext={errors.rasidNo}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    {...register("remarks", { required: true })}
                    id="remarks"
                    size="small"
                    name="remarks"
                    label="Remarks"
                    fullWidth
                    error={!!errors.remarks}
                    helpertext={errors.remarks}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  // height: '100vh', // Make the container full height of the viewport
                  margin: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
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
  );
}
