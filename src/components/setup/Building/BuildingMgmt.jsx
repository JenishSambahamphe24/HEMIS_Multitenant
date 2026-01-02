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
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Dialog,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditBuildingMgmt from "./EditBuildingMgmt";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const BuildingMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [buildingData, setBuildingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  const fetchBuildingData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Buildings`, config);
      setBuildingData(response.data);
    } catch (error) {
      console.error("Error fetching building data:", error);
    }
  };

  useEffect(() => {
    fetchBuildingData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiBuildingData = {
      houseName: data.houseName || "",
      areaCoveredByBuilding: parseFloat(data.areaCovered) || 0,
      noOfClassrooms: parseInt(data.numberOfClassrooms) || 0,
      areaCoveredByAllRooms: parseFloat(data.areaCoveredAllRooms) || 0,
      ownershipOfBuilding: data.ownership === "yes",
      hasInternetConnection: data.hasInternet === "yes",
      remarks: data.remarks || "",
    };

    try {
      const config = getAuthConfigSafe()
      await axios.post(`${backendUrl}/Buildings`, apiBuildingData, config);
      toast.success("Data posted successfully", {
        autoClose: 1500,
      });
      reset();
      fetchBuildingData();
    } catch (error) {
      toast.error("Error posting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (buildingId) => {
    setSelectedBuildingId(buildingId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchBuildingData();
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
                Building Management
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* House Name (Block No) */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="houseName"
                      control={control}
                      defaultValue=""
                      rules={{ required: "House Name (Block No) is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="House Name (Block No)"
                          fullWidth
                          autoComplete="houseName"
                          error={!!errors.houseName}
                        />
                      )}
                    />
                    {errors.houseName && (
                      <FormHelperText error>
                        {errors.houseName.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Area Covered by Building */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="areaCovered"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Area Covered by Building is required",
                        pattern: {
                          value: /^[0-9]*\.?[0-9]+$/,
                          message: "Please enter a valid decimal number",
                        },
                        min: {
                          value: 0.01,
                          message:
                            "Area Covered by Building must be a positive number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type="number"
                          size="small"
                          label="Area Covered by Building (sq.ft)"
                          fullWidth
                          autoComplete="areaCovered"
                          error={!!errors.areaCovered}
                          inputProps={{ step: "0.01", min: "0.01" }} // Allows only positive decimal numbers
                        />
                      )}
                    />
                    {errors.areaCovered && (
                      <FormHelperText error>
                        {errors.areaCovered.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Number of Classrooms */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="numberOfClassrooms"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Number of Classrooms is required",
                        pattern: {
                          value: /^[1-9][0-9]*$/,
                          message: "Please enter a positive integer",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type="number"
                          size="small"
                          label="Number of Classrooms"
                          fullWidth
                          autoComplete="numberOfClassrooms"
                          error={!!errors.numberOfClassrooms}
                          inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                        />
                      )}
                    />
                    {errors.numberOfClassrooms && (
                      <FormHelperText error>
                        {errors.numberOfClassrooms.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Area Covered by All Rooms */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="areaCoveredAllRooms"
                      control={control}
                      defaultValue=""
                      rules={{
                        pattern: {
                          value: /^[0-9]*\.?[0-9]+$/,
                          message: "Please enter a valid decimal number",
                        },
                        min: {
                          value: 0.01,
                          message:
                            "Area Covered by All Rooms must be a positive number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type="number"
                          size="small"
                          label="Area Covered by All Rooms (sq.ft)"
                          fullWidth
                          autoComplete="areaCoveredAllRooms"
                          inputProps={{ step: "0.01", min: "0.01" }} // Allows only positive decimal numbers
                        />
                      )}
                    />
                    {errors.areaCoveredAllRooms && (
                      <FormHelperText error>
                        {errors.areaCoveredAllRooms.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Ownership of Building */}
                  <Grid item xs={6} sm={6} md={4}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.ownership}
                    >
                      <InputLabel required id="ownership-label">
                        Ownership of Building
                      </InputLabel>
                      <Controller
                        name="ownership"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Ownership of Building is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="ownership-label"
                            label="Ownership of Building"
                            autoComplete="ownership"
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.ownership && (
                        <FormHelperText>
                          {errors.ownership.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Has Internet Connection */}
                  <Grid item xs={6} sm={6} md={4}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.hasInternet}
                    >
                      <InputLabel required id="internet-label">
                        Has Internet Connection
                      </InputLabel>
                      <Controller
                        name="hasInternet"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Has Internet Connection is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="internet-label"
                            label="Has Internet Connection"
                            autoComplete="hasInternet"
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.hasInternet && (
                        <FormHelperText>
                          {errors.hasInternet.message}
                        </FormHelperText>
                      )}
                    </FormControl>
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
              Building List
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
                        padding: "4px",
                      }}
                    >
                      S.No
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      House Name (Block No)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Area Covered By Building (sq. ft)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Number of Classrooms
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Area Covered By all Rooms (sq. ft)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Ownership of Building
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Has Internet Connection
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Remarks
                    </TableCell>

                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody sx={{ backgroundColor: "white" }}>
                  {buildingData.length > 0 ? (
                    buildingData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.houseName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.areaCoveredByBuilding}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.noOfClassrooms}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.areaCoveredByAllRooms}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.ownershipOfBuilding ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.hasInternetConnection ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
                        >
                          {data.remarks}
                        </TableCell>

                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "4px" }}
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
          <EditBuildingMgmt
            id={selectedBuildingId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default BuildingMgmt;
