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
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { toast } from "react-toastify";
import axios from "axios";
import {config} from '@config';


const StudentAgeMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [ageData, setAgeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAgeData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/AgeManagement/GetAll`);
      setAgeData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAgeData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = {
        ageKey: data.ageKey,
        ageFrom: data.ageFrom,
        ageTo: data.ageTo,
        remarks: data.remarks || "",
      };

      await axios.post(`${backendUrl}/AgeManagement/Add`, formData);
      fetchAgeData();
      toast.success("Age range added successfully!", {
        autoClose: 2000,
      });
      reset();
    } catch (err) {
      toast.error("Failed to add age range. Please try again.", {
        autoClose: 2000,
      });
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
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
              Age Management
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    {...register("ageIndex", { required: true })}
                    id="ageIndex"
                    size="small"
                    name="ageIndex"
                    label="Age Index"
                    type="number"
                    fullWidth
                    error={!!errors.ageIndex}
                    helperText={errors.ageIndex ? "Age Index is required" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    {...register("ageFrom", { required: true })}
                    id="ageFrom"
                    size="small"
                    name="ageFrom"
                    label="Age From"
                    type="number"
                    fullWidth
                    error={!!errors.ageFrom}
                    helperText={errors.ageFrom ? "Age From is required" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    {...register("ageTo", { required: true })}
                    id="ageTo"
                    size="small"
                    name="ageTo"
                    label="Age To"
                    type="number"
                    fullWidth
                    error={!!errors.ageTo}
                    helperText={errors.ageTo ? "Age To is required" : ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("remarks")}
                    id="remarks"
                    size="small"
                    name="remarks"
                    label="Remarks"
                    fullWidth
                    rows={2}
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
            Age Ranges
          </Typography>
          <TableContainer>
            <Table
              style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
            >
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd" }}>
                    S.N.
                  </TableCell>
                  <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd" }}>
                    Age Index
                  </TableCell>
                  <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd" }}>
                    Age From
                  </TableCell>
                  <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd" }}>
                    Age To
                  </TableCell>
                  <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd" }}>
                    Remarks
                  </TableCell>
                  <TableCell style={{ color: "#FFFFFF", border: "1px solid #ddd" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ageData.length > 0 ? (
                  ageData.map((data, index) => (
                    <TableRow key={data.id}>
                      <TableCell style={{ border: "1px solid #ddd" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ border: "1px solid #ddd" }}>
                        {data.ageIndex}
                      </TableCell>
                      <TableCell style={{ border: "1px solid #ddd" }}>
                        {data.ageFrom}
                      </TableCell>
                      <TableCell style={{ border: "1px solid #ddd" }}>
                        {data.ageTo}
                      </TableCell>
                      <TableCell style={{ border: "1px solid #ddd" }}>
                        {data.remarks || "N/A"}
                      </TableCell>
                      <TableCell style={{ border: "1px solid #ddd" }}>
                        <Button>
                          <EditNoteIcon /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: "center" }}>
                      No Age Ranges Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StudentAgeMgmt;
