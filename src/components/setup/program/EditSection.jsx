import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { blue, green, red } from "@mui/material/colors";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';
const EditSection = ({ section, onClose, onUpdate }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState({
    sectionName: "",
    sectionType: "",
    status: true,
    remarks: "",
  });

  useEffect(() => {
    if (section) {
      setData({
        sectionName: section.sectionName || "",
        sectionType: section.sectionType || "",
        status: section.status !== undefined ? section.status : true,
        remarks: section.remarks || "",
      });
    }
  }, [section]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validation
    if (!data.sectionName.trim()) {
      setError("Section name is required");
      setSubmitting(false);
      return;
    }

    if (!data.sectionType.trim()) {
      setError("Section type is required");
      setSubmitting(false);
      return;
    }

    try {
      const config = await getAuthConfigSafe();

      // Create a clean payload with proper boolean conversion
      const payload = {
        id: section.id,
        sectionName: data.sectionName.trim(),
        sectionType: data.sectionType.trim(),
        status: data.status === "true" || data.status === true, // Ensure boolean
        remarks: data.remarks.trim(),
      };

      const response = await axios.put(
        `${backendUrl}/Management/UpdateSection/${section.id}`,
        payload,
        config
      );

      if (response.status === 200) {
        toast.success("Section updated successfully!");
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating section:", error);

      if (error.response) {
        if (error.response.status === 409) {
          setError("This section already exists. Please use a different name.");
          toast.error("Section already exists!");
        } else if (error.response.status >= 500) {
          setError("Server error. Please try again later.");
          toast.error("Server error. Please try again later.");
        } else {
          setError(
            error.response.data?.message ||
              "An error occurred. Please try again."
          );
          toast.error(
            error.response.data?.message ||
              "An error occurred. Please try again."
          );
        }
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle select change to properly handle boolean values
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setData({ ...data, status: value === "true" });
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography
          variant="h6"
          component="p"
          style={{
            color: blue[700],
            textAlign: "center",
            padding: "10px",
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          Edit Section
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Paper
          elevation={3}
          sx={{
            mx: "auto",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            mt: 2,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
              <Grid item xs={12} md={5}>
                <TextField
                  required
                  id="sectionName"
                  size="small"
                  name="sectionName"
                  label="Section Name"
                  fullWidth
                  value={data.sectionName}
                  onChange={(e) =>
                    setData({ ...data, sectionName: e.target.value })
                  }
                  autoComplete="off"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: blue[500],
                      },
                      "&:hover fieldset": {
                        borderColor: blue[700],
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <TextField
                  required
                  id="sectionType"
                  size="small"
                  name="sectionType"
                  label="Section Type"
                  fullWidth
                  value={data.sectionType}
                  onChange={(e) =>
                    setData({ ...data, sectionType: e.target.value })
                  }
                  autoComplete="off"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: blue[500],
                      },
                      "&:hover fieldset": {
                        borderColor: blue[700],
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    required
                    id="status"
                    name="status"
                    labelId="status-label"
                    label="Status"
                    value={data.status.toString()} // Convert to string for Select
                    onChange={handleSelectChange} // Use the custom handler
                    sx={{
                      "& .MuiSelect-select": {
                        color: data.status ? green[700] : red[700],
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <MenuItem value="true" sx={{ color: green[700] }}>
                      Active
                    </MenuItem>
                    <MenuItem value="false" sx={{ color: red[700] }}>
                      Inactive
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="remarks"
                  size="small"
                  name="remarks"
                  label="Remarks"
                  fullWidth
                  value={data.remarks}
                  onChange={(e) =>
                    setData({ ...data, remarks: e.target.value })
                  }
                  autoComplete="off"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: blue[500],
                      },
                      "&:hover fieldset": {
                        borderColor: blue[700],
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <DialogActions>
              <Button onClick={onClose} color="secondary" disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  backgroundColor: blue[700],
                  color: "white",
                  "&:hover": {
                    backgroundColor: blue[800],
                  },
                }}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
            </DialogActions>
          </form>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default EditSection;
