import { useForm, Controller } from "react-hook-form";
import React from "react";
import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Select,
  MenuItem,
  Box,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Dialog,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditLabMgmt from "./EditLabMgmt";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const LabMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [labData, setLabData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [buildingList, setBuildingList] = useState([]);

  const fetchLabData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Labs`, config);
      setLabData(response.data);
    } catch (error) {
      console.error("Error fetching lab data:", error);
    }
  };

  const fetchBuildingList = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Buildings`, config);
      setBuildingList(response.data);
    } catch (error) {
      console.error("Error fetching building list:", error);
    }
  };
  useEffect(() => {
    fetchLabData();
    fetchBuildingList();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiLabData = {
      labName: data.labName || "",
      buildingId: data.buildingName || "",
      areaCoveredByLab: parseFloat(data.areaCovered) || 0,
      labType: data.labType || "",
      adequencyOfLabEquipment: data.equipmentAdequacy === "yes",
      hasInternetConnection: data.hasInternetConnection === "yes",
      equipmentAtLab: data.equipmentAtLab || "",
      remarks: data.remarks || "",
    };

    try {
      const config = getAuthConfigSafe()
      await axios.post(`${backendUrl}/Labs`, apiLabData, config);
      toast.success("Data posted successfully", {
        autoClose: 1500,
      });
      reset();
      fetchLabData();
    } catch (error) {
      toast.error("Error posting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = (labId) => {
    setSelectedLabId(labId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchLabData();
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={false} md={1} />
        <Grid item xs={12} md={12}>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Lab Management
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* Lab Name */}
                  <Grid item xs={12} sm={4} md={5}>
                    <Controller
                      name="labName"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Lab Name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Lab Name"
                          fullWidth
                          autoComplete="labName"
                          error={!!errors.labName}
                        />
                      )}
                    />
                    {errors.labName && (
                      <FormHelperText error>
                        {errors.labName.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Building Name (Block No) */}
                  <Grid item xs={6} sm={4} md={3.5}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.buildingName}
                    >
                      <InputLabel required id="building-name-label">
                        Building Name (Block No)
                      </InputLabel>
                      <Controller
                        name="buildingName"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Building Name (Block No) is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="building-name-label"
                            label="Building Name (Block No)"
                            autoComplete="buildingName"
                          >
                            {buildingList.length > 0 ? (
                              buildingList.map((building) => (
                                <MenuItem key={building.id} value={building.id}>
                                  {building.houseName}{" "}
                                  {/* Display the house name here */}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="" disabled>
                                No Buildings Available
                              </MenuItem>
                            )}
                          </Select>
                        )}
                      />
                      {errors.buildingName && (
                        <FormHelperText>
                          {errors.buildingName.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Area Covered by Lab */}
                  <Grid item xs={6} sm={4} md={3.5}>
                    <Controller
                      name="areaCovered"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Area Covered by Lab is required",
                        pattern: {
                          value: /^[0-9]*\.?[0-9]+$/,
                          message: "Please enter a valid decimal number",
                        },
                        min: {
                          value: 0.01,
                          message:
                            "Area Covered by Lab must be a positive number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type="number"
                          size="small"
                          label="Area Covered by Lab(in sq. ft)"
                          fullWidth
                          autoComplete="areaCovered"
                          error={!!errors.areaCovered}
                          inputProps={{ step: "0.01", min: "0.01" }} // Allows decimal input, min value set
                        />
                      )}
                    />
                    {errors.areaCovered && (
                      <FormHelperText error>
                        {errors.areaCovered.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Lab Type */}
                  <Grid item xs={12} sm={4} md={3.5}>
                    <Controller
                      name="labType"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Lab Type is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Lab Type"
                          fullWidth
                          autoComplete="labType"
                          error={!!errors.labType}
                        />
                      )}
                    />
                    {errors.labType && (
                      <FormHelperText error>
                        {errors.labType.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Adequacy of Lab Equipment */}
                  <Grid item xs={6} sm={4} md={2.5}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.equipmentAdequacy}
                    >
                      <InputLabel required id="equipment-adequacy-label">
                        Adequacy of Lab Equipment
                      </InputLabel>
                      <Controller
                        name="equipmentAdequacy"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Adequacy of Lab Equipment is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="equipment-adequacy-label"
                            label="Adequacy of Lab Equipment"
                            autoComplete="equipmentAdequacy"
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.equipmentAdequacy && (
                        <FormHelperText>
                          {errors.equipmentAdequacy.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Has Internet Connection */}
                  <Grid item xs={6} sm={4} md={2.5}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.hasInternetConnection}
                    >
                      <InputLabel required id="internet-connection-label">
                        Has Internet Connection
                      </InputLabel>
                      <Controller
                        name="hasInternetConnection"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Internet Connection status is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="internet-connection-label"
                            label="Has Internet Connection"
                            autoComplete="hasInternetConnection"
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.hasInternetConnection && (
                        <FormHelperText>
                          {errors.hasInternetConnection.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Equipment at Lab */}
                  <Grid item xs={12} sm={4} md={3.5}>
                    <Controller
                      name="equipmentAtLab"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Equipment at Lab is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Equipment at Lab"
                          fullWidth
                          autoComplete="equipmentAtLab"
                          error={!!errors.equipmentAtLab}
                        />
                      )}
                    />
                    {errors.equipmentAtLab && (
                      <FormHelperText error>
                        {errors.equipmentAtLab.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Remarks */}
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
                          InputProps={{ style: { minWidth: "100%" } }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                      <Button type="submit" variant="contained" color="primary">
                        Submit
                      </Button>
                    </Box>
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
              Lab List
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
                      Lab Name
                    </TableCell>

                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Building Name (Block No)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Area Covered By Lab (sq. ft)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Lab Type
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Adequacy of Lab Equipment
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Internet Connection
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Equipment At Lab
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
                  {labData.length > 0 ? (
                    labData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.labName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.buildingName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.areaCoveredByLab}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.labType}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.adequencyOfLabEquipment ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.hasInternetConnection ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.equipmentAtLab}
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
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="md"
        >
          <EditLabMgmt
            id={selectedLabId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default LabMgmt;
