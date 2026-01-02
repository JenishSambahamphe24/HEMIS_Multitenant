import { useForm, Controller } from "react-hook-form";
import React from "react";
import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Button,
  FormControl,
  Box,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Dialog,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import axios from "axios";
import { toast } from "react-toastify";
import EditFacility from "./EditFacility";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const FacilityMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [regFacilityData, setRegFacilityData] = useState([]);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  const fetchRegFacilityData = async () => {
    try {
      const config = getAuthConfigSafe();
      const response = await axios.get(`${backendUrl}/Facilty`, config);
      setRegFacilityData(response.data);
    } catch (error) {
      console.error("Error fetching facility data:", error);
    }
  };
  useEffect(() => {
    fetchRegFacilityData();
  }, []);

  const onSubmit = async (data) => {
    const apiRegFacilityData = {
      FacilityType: data.facilityType || "",
      FacilityAvailability: Boolean(data.facilityAvailability),
      AdequacyOfFacility: Boolean(data.adequacyOfFacility) || false,
      Remarks: data.remarks || "",
    };

    try {
      const config = getAuthConfigSafe();
      await axios.post(`${backendUrl}/Facilty`, apiRegFacilityData, config);
      toast.success("Data posted successfully", {
        autoClose: 1500,
      });
      reset();
      fetchRegFacilityData();
    } catch (error) {
      toast.error("Error posting data: " + error.message);
    }
  };
  const handleEditClick = (programId) => {
    setSelectedProgramId(programId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchRegFacilityData();
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={false} md={1} />
        <Grid item xs={12} md={10}>
          <Paper elevation={5} sx={{ borderRadius: "20px", marginTop: '16px' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Register Facility
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.facilityType}
                    >
                      <Controller
                        name="facilityType"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Facility Type is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Facility Type"
                            id="facilityType"
                            name="facilityType"
                            autoComplete="facilityType"
                            required
                            size="small"
                            error={!!errors.facilityType}
                          />
                        )}
                      />
                      {errors.facilityType && (
                        <FormHelperText>
                          {errors.facilityType.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="facilityAvailability"
                          control={control}
                          defaultValue={false}
                          rules={{
                            required: "Facility Availability is required",
                          }}
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              checked={field.value}
                              color="primary"
                            />
                          )}
                        />
                      }
                      label="Facility Availability"
                    />
                    {errors.facilityAvailability && (
                      <FormHelperText error>
                        {errors.facilityAvailability.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="adequacyOfFacility"
                          control={control}
                          defaultValue={false}
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              checked={field.value}
                              color="primary"
                            />
                          )}
                        />
                      }
                      label="Adequacy of Facility"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="remarks"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          label="Remarks"
                          fullWidth
                          autoComplete="remarks"
                          multiline
                          rows={2}
                          InputProps={{ style: { minWidth: "100%" } }} // Ensures full width for remarks
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ mt: 2 }}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <Button type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </Grid>
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
              Facility List
            </Typography>
            <TableContainer>
              <Table
                style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
              >
                <TableHead style={{ backgroundColor: "#2A629A" }}>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      S.No
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Facility Type
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Facility Availability
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Adequancy of Facility
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Remarks
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "white" }}>
                  {regFacilityData.length > 0 ? (
                    regFacilityData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.facilityType}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.facilityAvailability ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.adequacyOfFacility ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.remarks}
                        </TableCell>

                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <Button onClick={() => handleEditClick(data.id)}>
                            {" "}
                            <EditNoteIcon /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} style={{ textAlign: "center" }}>
                        No Data Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid item xs={false} md={2} />
      </Grid>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
      >
        <EditFacility
          id={selectedProgramId}
          onClose={() => setOpenEditDialog(false)}
          onUpdate={handleUpdate}
        />
      </Dialog>
    </>
  );
};

export default FacilityMgmt;
