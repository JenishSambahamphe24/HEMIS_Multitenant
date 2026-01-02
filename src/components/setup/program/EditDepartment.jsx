import React, { useState, useEffect } from "react";
import {
  Button,
  Chip,
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
} from "@mui/material";
import { blue } from "@mui/material/colors";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const EditDepartment = ({ handleClose, open, id }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [data, setData] = useState({
    id: id,
    departmentName: "",
    status: true,
    remarks: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/Management/Department/${id}`,
          config
        );
        setData({
          id: id,
          departmentName: response.data.departmentName || "",
          status: response.data.status || true,
          remarks: response.data.remarks || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthConfigSafe()
      await axios.put(
        `${backendUrl}/Management/UpdateDepartment/${id}`,
        data,
        config
      );
      toast.success("Section updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
    >
      <Paper
        elevation={3}
        sx={{
          mx: "auto",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          maxWidth: "md",
        }}
      >
        <Typography
          variant="h6"
          component="p"
          style={{
            color: blue[700],
            textAlign: "center",
            padding: "10px",
            textTransform: "uppercase",
          }}
        >
          Edit Department
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
            <Grid item xs={12} md={4}>
              <TextField
                required
                id="departmentName"
                size="small"
                name="departmentName"
                label="Department Name"
                fullWidth
                value={data.departmentName}
                onChange={(e) =>
                  setData({ ...data, departmentName: e.target.value })
                }
                autoComplete="given-name"
                variant="outlined"
                sx={{
                  borderRadius: "8px",
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
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  required
                  id="status"
                  size="small"
                  name="status"
                  label="Status"
                  value={data.status}
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem value={true}>
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value={false}>
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                id="remarks"
                size="small"
                name="remarks"
                label="Remarks"
                fullWidth
                value={data.remarks}
                onChange={(e) => setData({ ...data, remarks: e.target.value })}
                autoComplete="given-name"
                variant="outlined"
                sx={{
                  borderRadius: "8px",
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

          <Grid container justifyContent="center" marginTop={2}>
            <Grid item xs={12} md={3}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: blue[700],
                  color: "white",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: blue[800],
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Dialog>
  );
};

export default EditDepartment;
