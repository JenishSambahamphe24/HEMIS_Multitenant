import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import EditHolidayMgmt from "./EditHolidayMgmt";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const HolidayMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { currentUser } = useSelector((state) => state.user);
  const [holidayData, setHolidayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const universityId = currentUser?.institution?.universityId;
  const campusId = currentUser?.institution?.id;
  const fetchHolidayData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/HolidayForAttendance`,
        config
      );
      setHolidayData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHolidayData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const config = getAuthConfigSafe()
    const formData = {
      id: 0,
      universityId: universityId,
      campusId: campusId,
      isHoliday: true,
      holidayName: data.holidayName,
      dateStarted: new Date(data.dateStarted).toISOString(),
      dateEnd: new Date(data.dateEnd).toISOString(),
      isItOnlyForFemale: data.isOnlyForFemale === "yes",
      remarks: data.remarks || "",
    };
    try {
      await axios.post(`${backendUrl}/HolidayForAttendance`, formData, config);
      fetchHolidayData();
      toast.success("Holiday added successfully!", {
        autoClose: 2000,
      });
      reset();
    } catch (err) {
      console.error("Error during submission: ", err);

      if (err.response) {
        toast.error(`Failed to add holiday. Error: ${err.response.data}`, {
          autoClose: 2000,
        });
      } else {
        toast.error("Failed to add holiday. Please try again.", {
          autoClose: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => {
    setSelectedHolidayId(id);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedHolidayId(null);
    setOpenEditDialog(false);
  };

  return (
    <Grid container spacing={2} sx={{ mt: 10 }}>
      <Grid item xs={false} md={2} />
      <Grid item xs={12} md={8}>
        <Paper elevation={5} sx={{ borderRadius: "20px" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", color: "#2A629A" }}
            >
              Holiday Management
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    {...register("holidayName", { required: true })}
                    id="holidayName"
                    size="small"
                    name="holidayName"
                    label="Holiday Name"
                    fullWidth
                    error={!!errors.holidayName}
                    helperText={
                      errors.holidayName ? "Holiday Name is required" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    {...register("dateStarted", { required: true })}
                    id="dateStarted"
                    size="small"
                    name="dateStarted"
                    type="date"
                    label="Date Started"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateStarted}
                    helperText={
                      errors.dateStarted ? "Date Started is required" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    {...register("dateEnd")}
                    id="dateEnd"
                    size="small"
                    name="dateEnd"
                    type="date"
                    label="Date End"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateEnd}
                    helperText={
                      errors.dateStarted ? "Date End is required" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.isOnlyForFemale}
                  >
                    <InputLabel required id="isOnlyForFemale-label">
                      Is Only For Female
                    </InputLabel>
                    <Select
                      {...register("isOnlyForFemale", { required: true })}
                      id="isOnlyForFemale"
                      labelId="isOnlyForFemale-label"
                      defaultValue=""
                      label="Is Only For Female"
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("remarks")}
                    id="remarks"
                    size="small"
                    name="remarks"
                    label="Remarks"
                    fullWidth
                    error={!!errors.remarks}
                    helperText={errors.remarks}
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
                  variant="contained"
                  style={{ backgroundColor: "#007aff", color: "#inherit" }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Grid>
            </form>
          </CardContent>
        </Paper>

        <Grid margin="10px">
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", color: "#2A629A" }}
          >
            Holiday List
          </Typography>
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table
              style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
            >
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    S.No
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Holiday Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Date Started
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Date End
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Is Only For Female
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Remarks
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: "white" }}>
                {holidayData.length > 0 ? (
                  holidayData.map((data, index) => (
                    <TableRow key={data.id}>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.holidayName}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data?.dateStarted?.slice(0, 10)}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data?.dateEnd?.slice(0, 10) || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.isOnlyForFemale ? "Yes" : "No"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.remarks || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        <Button onClick={() => handleEditClick(data.id)}>
                          <EditNoteIcon /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: "center" }}>
                      No Holidays Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <EditHolidayMgmt
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        holidayId={selectedHolidayId}
        fetchHolidayData={fetchHolidayData}
      />
    </Grid>
  );
};

export default HolidayMgmt;
