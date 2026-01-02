import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { blue } from "@mui/material/colors";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditHolidayMgmt = ({ open, onClose, holidayId, fetchHolidayData }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const { currentUser } = useSelector((state) => state.user);
  const [holidayData, setHolidayData] = useState({});
  const [loading, setLoading] = useState(false);

  const universityId = currentUser?.institution?.universityId;
  const campusId = currentUser?.institution?.id;

  // Fetch the holiday data based on the selected ID
  useEffect(() => {
    if (holidayId) {
      const fetchHolidayDetails = async () => {
        try {
          const config = getAuthConfigSafe()
          const response = await axios.get(
            `${backendUrl}/HolidayForAttendance/${holidayId}`,
            config
          );
          setHolidayData(response.data);
        } catch (err) {
          console.error("Error fetching holiday details:", err);
          toast.error("Failed to fetch holiday details.");
        }
      };
      fetchHolidayDetails();
    }
  }, [holidayId]);

  const handleSave = async () => {
    setLoading(true);

    const formData = {
      ...holidayData,
      universityId,
      campusId,
      isHoliday: true,
      holidayName: holidayData.holidayName,
      dateStarted: new Date(holidayData.dateStarted).toISOString(),
      dateEnd: new Date(holidayData.dateEnd).toISOString(),
      isItOnlyForFemale: holidayData.isOnlyForFemale === "yes",
      remarks: holidayData.remarks || "",
    };

    try {
      const config = getAuthConfigSafe()
      await axios.put(
        `${backendUrl}/HolidayForAttendance/${holidayId}`,
        formData,
        config
      );
      fetchHolidayData();
      toast.success("Holiday updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error during update:", err);
      toast.error("Failed to update holiday.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setHolidayData({ ...holidayData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md'>
      <Typography
        variant="h6"
        textAlign={"center"}
        padding={1}
        color={blue[700]}
      >
        Edit Holiday
      </Typography>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              required
              name="holidayName"
              label="Holiday Name"
              fullWidth
              size="small"
              value={holidayData.holidayName || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              name="dateStarted"
              label="Date Started"
              type="date"
              fullWidth
              size="small"
              value={holidayData.dateStarted?.slice(0, 10) || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              name="dateEnd"
              label="Date End"
              type="date"
              fullWidth
              size="small"
              value={holidayData.dateEnd?.slice(0, 10) || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Is Only For Female</InputLabel>
              <Select
                name="isOnlyForFemale"
                value={holidayData.isOnlyForFemale || ""}
                onChange={handleChange}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="remarks"
              label="Remarks"
              fullWidth
              size="small"
              value={holidayData.remarks || ""}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Updating..." : "Updating"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHolidayMgmt;
