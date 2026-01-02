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
  Dialog,
} from "@mui/material";
import EditLibraryMgmt from "./EditLibraryMgmt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const LibraryMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [libraryData, setLibraryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);
  const [buildingList, setBuildingList] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const campsuId = currentUser?.institution?.id;

  const fetchLibraryData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Library`, config);
      setLibraryData(response.data);
    } catch (error) {
      console.error("Error fetching library data:", error);
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
    fetchLibraryData();
    fetchBuildingList();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const apiLibraryData = {
      libraryName: data.libraryName || "",
      buildingId: data.buildingName || "",
      campusId: campsuId,
      noOfLibraryRooms: parseInt(data.numberOfLibraryrooms) || 0,
      totalAreaOfLibraryRoom: parseFloat(data.areaCoveredRooms) || 0,
      noOfReadingHalls: parseInt(data.numberOfReadingHalls) || 0,
      areaOfReadingHall: parseFloat(data.areaReadingHalls) || 0,
      noOfBooks: parseInt(data.numberofBooks) || 0,
      noOfDailyJournals: parseInt(data.numberofDailyJournals) || 0,
      noOfWeeklyJournals: parseInt(data.numberofweeklyJournals) || 0,
      noOfMonthlyJournals: parseInt(data.numberofmonthlyJournals) || 0,
      noOfAnnualJournals: parseInt(data.numberofannualJournals) || 0,
      hasELibraryFacility: data.hasELibrary === "yes",
      remarks: data.remarks || "",
    };

    try {
      const config = getAuthConfigSafe()
      await axios.post(`${backendUrl}/Library`, apiLibraryData, config);
      toast.success("Data posted successfully", {
        autoClose: 1500,
      });
      reset();
      fetchLibraryData();
    } catch (error) {
      toast.error("Error posting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (libraryId) => {
    setSelectedLibraryId(libraryId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchLibraryData();
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={false} md={2} />
        <Grid item xs={12} md={12}>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Library Management
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={5} md={6}>
                    <Controller
                      name="libraryName"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Library Name  is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Library Name"
                          fullWidth
                          autoComplete="libraryName"
                          error={!!errors.libraryName}
                        />
                      )}
                    />
                    {errors.libraryName && (
                      <FormHelperText error>
                        {errors.libraryName.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={6} sm={3.5} md={3}>
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
                  <Grid item xs={6} sm={3.5} md={3}>
                    <Controller
                      name="numberOfLibraryrooms"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Number of Library Rooms is required",
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
                          label="Number of Library Rooms"
                          fullWidth
                          autoComplete="numberOfLibraryrooms"
                          error={!!errors.numberOfLibraryrooms}
                          inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                        />
                      )}
                    />
                    {errors.numberOfLibraryrooms && (
                      <FormHelperText error>
                        {errors.numberOfLibraryrooms.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  {/* Area Covered by Library Rooms */}
                  <Grid item xs={6} sm={4} md={3}>
                    <Controller
                      name="areaCoveredRooms"
                      control={control}
                      defaultValue=""
                      rules={{
                        required:
                          "Total Area Covered by Library Rooms is required",
                        pattern: {
                          value: /^[0-9]*\.?[0-9]+$/,
                          message: "Please enter a valid decimal number",
                        },
                        min: {
                          value: 0.01,
                          message:
                            "Total Area Covered by Library Rooms must be a positive number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type="number"
                          size="small"
                          label="Total Area Covered by Library Rooms (sq.ft)"
                          fullWidth
                          autoComplete="areaCoveredRooms"
                          inputProps={{ step: "0.01", min: "0.01" }} // Allows only positive decimal numbers
                        />
                      )}
                    />
                    {errors.areaCoveredRooms && (
                      <FormHelperText error>
                        {errors.areaCoveredRooms.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={6} sm={4} md={3}>
                    <Controller
                      name="numberOfReadingHalls"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Number of Reading Halls  is required",
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
                          label="Number of Reading Halls"
                          fullWidth
                          autoComplete="numberOfReadingHalls"
                          error={!!errors.numberOfReadingHalls}
                          inputProps={{ step: "1", min: "1" }} // Allows only positive integers
                        />
                      )}
                    />
                    {errors.numberOfReadingHalls && (
                      <FormHelperText error>
                        {errors.numberOfReadingHalls.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Controller
                      name="areaReadingHalls"
                      control={control}
                      defaultValue=""
                      rules={{
                        required:
                          "Total Area Covered by Reading Halls is required",
                        pattern: {
                          value: /^[0-9]*\.?[0-9]+$/,
                          message: "Please enter a valid decimal number",
                        },
                        min: {
                          value: 0.01,
                          message:
                            "Area of Reading Hall must be a positive number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          type="number"
                          size="small"
                          label="Area of Reading Halls (sq.ft)"
                          fullWidth
                          autoComplete="areaReadingHalls"
                          inputProps={{ step: "0.01", min: "0.01" }} // Allows only positive decimal numbers
                        />
                      )}
                    />
                    {errors.areaReadingHalls && (
                      <FormHelperText error>
                        {errors.areaReadingHalls.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Controller
                      name="numberofBooks"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Number of Books is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Number of Books"
                          fullWidth
                          autoComplete="numberofBooks"
                          error={!!errors.numberofBooks}
                        />
                      )}
                    />
                    {errors.numberofBooks && (
                      <FormHelperText error>
                        {errors.numberofBooks.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={4} sm={4} md={2.4}>
                    <Controller
                      name="numberofDailyJournals"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Number of Daily Journals"
                          fullWidth
                          autoComplete="numberofDailyJournals"
                          error={!!errors.numberofDailyJournals}
                        />
                      )}
                    />
                    {errors.numberofDailyJournals && (
                      <FormHelperText error>
                        {errors.numberofDailyJournals.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={4} sm={4} md={2.4}>
                    <Controller
                      name="numberofweeklyJournals"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Number of Weekly Journals"
                          fullWidth
                          autoComplete="numberofweeklyJournals"
                          error={!!errors.numberofweeklyJournals}
                        />
                      )}
                    />
                    {errors.numberofweeklyJournals && (
                      <FormHelperText error>
                        {errors.numberofweeklyJournals.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={4} sm={4} md={2.4}>
                    <Controller
                      name="numberofmonthlyJournals"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Number of Monthly Journals"
                          fullWidth
                          autoComplete="numberofmonthlyJournals"
                          error={!!errors.numberofmonthlyJournals}
                        />
                      )}
                    />
                    {errors.numberofmonthlyJournals && (
                      <FormHelperText error>
                        {errors.numberofmonthlyJournals.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Controller
                      name="numberofannualJournals"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Number of Annual Journals"
                          fullWidth
                          autoComplete="numberofannualJournals"
                          error={!!errors.numberofannualJournals}
                        />
                      )}
                    />
                    {errors.numberofannualJournals && (
                      <FormHelperText error>
                        {errors.numberofanualJournals.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  {/* Has E-Library Facility */}
                  <Grid item xs={6} sm={4} md={2.4}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.hasELibrary}
                    >
                      <InputLabel required id="elibrary-label">
                        Has E-Library Facility{" "}
                      </InputLabel>
                      <Controller
                        name="hasELibrary"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Has ELibrary Facility is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="elibrary-label"
                            label="Has ELibrary Facility"
                            autoComplete="hasELibrary"
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.hasELibrary && (
                        <FormHelperText>
                          {errors.hasELibrary.message}
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
                          rows={1}
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
              Library List
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
                      Library Name
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Building Name (Block no)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Number of Library Rooms
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Total Area Covered By Library
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Number of Reading Halls
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Area of Reading Halls (sq. ft)
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Number of Books
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      No of Daily Journals
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      No of Weekly Journals
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      No of Monthly Journals
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Number of Annual Journals
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      E-Library
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
                  {libraryData.length > 0 ? (
                    libraryData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.libraryName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.buildingName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfLibraryRooms}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.totalAreaOfLibraryRoom}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfReadingHalls}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.areaOfReadingHall}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfBooks}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfDailyJournals}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfWeeklyJournals}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfMonthlyJournals}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.noOfAnnualJournals}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.hasELibraryFacility ? "Yes" : "No"}
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
          <EditLibraryMgmt
            id={selectedLibraryId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default LibraryMgmt;
