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
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Dialog, // keep building name as the second field and area as the second last field and hostel type boys and girls
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditHostelMgmt from "./EditHostelMgmt";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const HostelMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [hostelData, setHostelData] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState(null);

  const fetchHostelData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Hostels`, config);
      setHostelData(response.data);
    } catch (error) {
      console.error("Error fetching hostel data:", error);
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
    fetchHostelData();
    fetchBuildingList();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiHostelData = {
      hostelType: data.hostelType || "",
      noOfRoomsInHostel: parseInt(data.numberOfRooms) || 0,
      noOfSeats: parseInt(data.numberOfSeats) || 0,
      areaCoveredByHostel: parseFloat(data.areaCovered) || 0,
      buildingId: data.buildingName || 0,
      hasPlayground: data.hasPlayground === "yes",
      hasInternet: data.hasInternet === "yes",
      hasDrinkingWater: data.hasDrinkingWater === "yes",
      hasToilet: data.hasToilet === "yes",
      remarks: data.remarks || "",
    };

    try {
      const config = getAuthConfigSafe()
      await axios.post(`${backendUrl}/Hostels`, apiHostelData, config);
      toast.success("Data posted successfully", {
        autoClose: 1500,
      });
      reset();
      fetchHostelData();
    } catch (error) {
      toast.error("Error posting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = (hostelId) => {
    setSelectedHostelId(hostelId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchHostelData();
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
                Hostel Management
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* Hostel Type */}
                  <Grid item xs={12} sm={4} md={3}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.hostelType}
                    >
                      <InputLabel required id="hostel-type-label">
                        Hostel Type
                      </InputLabel>
                      <Controller
                        name="hostelType"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Hostel Type is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="hostel-type-label"
                            label="Hostel Type"
                            autoComplete="hostelType"
                          >
                            <MenuItem value="boys">Boys</MenuItem>
                            <MenuItem value="girls">Girls</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.hostelType && (
                        <FormHelperText>
                          {errors.hostelType.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Building Name (Block No) */}
                  <Grid item xs={6} sm={4} md={3}>
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

                  {/* Number of Rooms in Hostel */}
                  <Grid item xs={6} sm={4} md={3}>
                    <Controller
                      name="numberOfRooms"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Number of Rooms is required",
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
                          label="Number of Rooms in Hostel"
                          fullWidth
                          autoComplete="numberOfRooms"
                          error={!!errors.numberOfRooms}
                          inputProps={{ step: "1", min: "1" }}
                        />
                      )}
                    />
                    {errors.numberOfRooms && (
                      <FormHelperText error>
                        {errors.numberOfRooms.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Number of Seats */}
                  <Grid item xs={6} sm={4} md={3}>
                    <Controller
                      name="numberOfSeats"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Number of Seats is required",
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
                          label="Number of Seats"
                          fullWidth
                          autoComplete="numberOfSeats"
                          error={!!errors.numberOfSeats}
                          inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                        />
                      )}
                    />
                    {errors.numberOfSeats && (
                      <FormHelperText error>
                        {errors.numberOfSeats.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Has Playground */}
                  <Grid item xs={6} sm={4} md={2.4}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.hasPlayground}
                    >
                      <InputLabel required id="playground-label">
                        Has Playground
                      </InputLabel>
                      <Controller
                        name="hasPlayground"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Playground status is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="playground-label"
                            label="Has Playground"
                            autoComplete="hasPlayground"
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.hasPlayground && (
                        <FormHelperText>
                          {errors.hasPlayground.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Has Internet */}
                  <Grid item xs={6} sm={4} md={2.4}>
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
                          required: "Internet Connection status is required",
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

                  {/* Has Drinking Water */}
                  <Grid item xs={6} sm={4} md={2.4}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.hasDrinkingWater}
                    >
                      <InputLabel required id="drinking-water-label">
                        Has Drinking Water
                      </InputLabel>
                      <Controller
                        name="hasDrinkingWater"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Drinking Water status is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="drinking-water-label"
                            label="Has Drinking Water"
                            autoComplete="hasDrinkingWater"
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.hasDrinkingWater && (
                        <FormHelperText>
                          {errors.hasDrinkingWater.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Has Toilet */}
                  <Grid item xs={6} sm={4} md={2.4}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.hasToilet}
                    >
                      <InputLabel required id="toilet-label">
                        Has Toilet
                      </InputLabel>
                      <Controller
                        name="hasToilet"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Toilet status is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="toilet-label"
                            label="Has Toilet"
                            autoComplete="hasToilet"
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.hasToilet && (
                        <FormHelperText>
                          {errors.hasToilet.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {/* Area Covered by Hostel */}
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Controller
                      name="areaCovered"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Area Covered by Hostel is required",
                        pattern: {
                          value: /^[0-9]*\.?[0-9]+$/,
                          message: "Please enter a valid decimal number",
                        },
                        min: {
                          value: 0.01,
                          message:
                            "Area Covered by Hostel must be a positive number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type="number"
                          size="small"
                          label="Area Covered by Hostel (sq.ft)"
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
              Hostel List
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
                      Hostel Type
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Number of Rooms in Hostel
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Number of Seats
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Area Covered By Hostels
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
                      Playground
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
                      Drinking Water
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Toilet
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
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {hostelData.length > 0 ? (
                    hostelData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.hostelType}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfRoomsInHostel}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfSeats}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.areaCoveredByHostel}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.buildingId}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.hasPlayground ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.hasInternet ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.hasDrinkingWater ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.hasToilet ? "Yes" : "No"}
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
          <EditHostelMgmt
            id={selectedHostelId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default HostelMgmt;
