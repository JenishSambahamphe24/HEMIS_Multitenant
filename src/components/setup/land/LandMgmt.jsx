import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import React from "react";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
  FormHelperText,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Dialog,
  capitalize,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditLandMgmt from "./EditLandMgmt";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const LandMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedLandId, setSelectedLandId] = useState(null);
  const [landData, setLandData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLandData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Lands`, config);
      setLandData(response.data);
    } catch (error) {
      console.error("Error fetching land data:", error);
    }
  };

  useEffect(() => {
    fetchLandData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);

    const apiData = {
      totalArea: data.areaCoveredRooms || "",
      unit: data.areaUnit || "",
      sheetNo: data.sheetNo || "",
      kittaNo: data.kittaNo || "",
      ownerShip: data.ownership === "yes",
      remarks: data.remarks || "",
    };

    try {
      const config = getAuthConfigSafe()
      await axios.post(`${backendUrl}/Lands`, apiData, config);
      toast.success("Data posted successfully");
      reset();
      fetchLandData();
    } catch (error) {
      toast.error("Error posting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (landId) => {
    setSelectedLandId(landId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchLandData();
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={false} md={1} />
        <Grid item xs={12} md={10}>
          <Paper elevation={5} sx={{ borderRadius: "20px", marginTop: '16px'}}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Land Management
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="areaCoveredRooms"
                      control={control}
                      defaultValue=""
                      rules={{
                        required:
                          "Total Area Covered by Library Rooms is required",
                        pattern: {
                          value: /^\d+(\.\d+)?$|^(\d+-)+\d+$/,
                          message:
                            "Please enter a valid number (e.g., 12345, 123.45, 123-456-789)",
                        },
                        min: {
                          message:
                            "Total Area Covered by Library Rooms must be a positive number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Total Area of Land"
                          fullWidth
                          autoComplete="areaCoveredRooms"
                        />
                      )}
                    />
                    {errors.areaCoveredRooms && (
                      <FormHelperText error>
                        {errors.areaCoveredRooms.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={6} sm={6} md={3}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.areaUnit}
                    >
                      <InputLabel required id="area-unit-label">
                        Area Unit
                      </InputLabel>
                      <Controller
                        name="areaUnit"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Area Unit is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            name="areaUnit"
                            labelId="area-unit-label"
                            label="Area Unit"
                            autoComplete="areaUnit"
                          >
                            <MenuItem value="hector">Hector</MenuItem>
                            <MenuItem value="ropani">Ropani</MenuItem>
                            <MenuItem value="barga meter">barga meter</MenuItem>
                            <MenuItem value="barga feet">barga feet</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.areaUnit && (
                        <FormHelperText>
                          {errors.areaUnit.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={4} md={2}>
                    <Controller
                      name="sheetNo"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Sheet no."
                          fullWidth
                          autoComplete="sheetNo"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6} sm={4} md={2}>
                    <Controller
                      name="kittaNo"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          size="small"
                          label="Kitta no."
                          fullWidth
                          autoComplete="kittaNo"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6} sm={4} md={2}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.ownership}
                    >
                      <InputLabel required id="ownership-label">
                        Ownership
                      </InputLabel>
                      <Controller
                        name="ownership"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Ownership is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="ownership-label"
                            label="Ownership"
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
              Land List
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
                      Kitta No.
                    </TableCell>

                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Total Area
                    </TableCell>

                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Area Unit
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Ownership
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Sheet No. of Land
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
                  {landData.length > 0 ? (
                    landData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.kittaNo}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.totalArea}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {capitalize(data?.unit)}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.ownerShip ? "Yes" : "No"}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.sheetNo}
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
          <EditLandMgmt
            id={selectedLandId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default LandMgmt;
