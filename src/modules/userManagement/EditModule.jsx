import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { blue } from "@mui/material/colors";
import toast from "react-hot-toast";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const EditModule = ({ open, handleClose, Id }) => {
const backendUrl=config.VITE_BACKEND_URL;
const baseUrl=config.VITE_BASE_URL;

  const [imagePreview, setImagePreview] = useState(null);
  const [moduleName, setModuleName] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState(true);
  const [moduleIcon, setModuleIcon] = useState(null);
  const [accessToUni, setAccessToUni] = useState(false);
  const [accessToCollege, setAccessToCollege] = useState(false);
  const [accessToUgc, setAccessToUgc] = useState(false);
  const [index, setIndex] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectChange = (setter) => (e) => {
    setter(e.target.value === "true");
  };

  const fetchData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Moodule`, config);
      return response.data;
    } catch (err) {
      console.error("Error fetching data:", err);
      return [];
    }
  };

  useEffect(() => {
    if (Id && open) {
      fetchModuleDetails(Id);
    }
  }, [Id, open]);

  const fetchModuleDetails = async (Id) => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Moodule/${Id}`, config);
      const module = response.data;

      setModuleName(module.displayName || "");
      setDetails(module.description || "");
      setStatus(Boolean(module.isActive));
      setAccessToUgc(Boolean(module.accessToUgc));
      setAccessToUni(Boolean(module.accessToUni));
      setAccessToCollege(Boolean(module.accessToCollege));
      setIndex(module.index ?? "");

      // Set image preview with proper URL formatting
      if (module.icon) {
        setImagePreview(
          module.icon.startsWith("http")
            ? module.icon
            : `${baseUrl}/${module.icon}`
        );
      } else {
        setImagePreview(null);
      }
      // Reset moduleIcon to null since we haven't selected a new file
      setModuleIcon(null);
    } catch (error) {
      console.error("Error fetching module details:", error);
      toast.error("Error fetching module details.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setModuleIcon(file);
    }
  };

 const handleSubmit = async (event) => {
  event.preventDefault();
  if (isSubmitting) return; 
  setIsSubmitting(true);
  try {
    const config = getAuthConfigSafe(); 
    const formData = new FormData();
    formData.append("Id", Id);
    formData.append("DisplayName", moduleName);
    formData.append("Description", details);
    formData.append("IsActive", status.toString());
    formData.append("AccessToUgc", accessToUgc.toString());
    formData.append("AccessToUni", accessToUni.toString());
    formData.append("AccessToCollege", accessToCollege.toString());
    formData.append("Index", index);
    if (moduleIcon) {
      formData.append("IconImage", moduleIcon);
    }
    const response = await axios.put(`${backendUrl}/Moodule/${Id}`, formData, config);
    toast.success("Module updated successfully!");
    await fetchData();
    handleClose();

  } catch (error) {
    console.error("Error updating module:", error);
    const errorMessage = error.response?.data?.message || "Failed to update module";
    toast.error(`Error: ${errorMessage}`);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      onClick={(e) => e.stopPropagation()}
    >
      <Box
        sx={{
          margin: 5,
          padding: 0,
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 500, padding: 1, color: blue[700] }}
        >
          Edit Module
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                id="moduleName"
                label="Module Name"
                size="small"
                fullWidth
                variant="outlined"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
              />
            </Grid>

            {/* Status Select */}
            <Grid item xs={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  required
                  id="status"
                  label="Status"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={status.toString()}
                  onChange={handleSelectChange(setStatus)}
                >
                  <MenuItem value="true">
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value="false">
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Access To UGC</InputLabel>
                <Select
                  required
                  id="accessToUgc"
                  label="Access To UGC"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={accessToUgc.toString()}
                  onChange={handleSelectChange(setAccessToUgc)}
                >
                  <MenuItem value="true">
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value="false">
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl size="small" fullWidth>
                <InputLabel>Access To University</InputLabel>
                <Select
                  required
                  id="accessToUni"
                  label="Access To University"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={accessToUni.toString()}
                  onChange={handleSelectChange(setAccessToUni)}
                >
                  <MenuItem value="true">
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value="false">
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl size="small" fullWidth>
                <InputLabel>Access To College</InputLabel>
                <Select
                  required
                  id="accessToCollege"
                  label="Access To College"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={accessToCollege.toString()}
                  onChange={handleSelectChange(setAccessToCollege)}
                >
                  <MenuItem value="true">
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value="false">
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <TextField
                required
                id="index"
                label="Index"
                size="small"
                type="number"
                fullWidth
                variant="outlined"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px dashed #3f51b5",
                  borderRadius: 2,
                  padding: 1,
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                }}
              >
                <input
                  type="file"
                  id="moduleIconEdit"
                  name="moduleIconEdit"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
                <label htmlFor="moduleIconEdit">
                  Upload Module Icon &nbsp;
                  <IconButton
                    component="span"
                    sx={{
                      backgroundColor: "#3f51b5",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#303f9f",
                      },
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
                {imagePreview && (
                  <Box
                    sx={{
                      marginLeft: 2,
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      overflow: "hidden",
                      boxShadow: 1,
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Module Icon Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        console.error("Image failed to load:", imagePreview);
                        e.target.src = "/placeholder-image.png";
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="details"
                label="Description"
                size="small"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Module"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleClose}
                sx={{ ml: 2 }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Dialog>
  );
};

export default EditModule;