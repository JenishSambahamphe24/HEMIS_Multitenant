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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { blue } from "@mui/material/colors";
import toast from "react-hot-toast";
import EditModule from "./EditModule";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const AddModule = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const [imagePreview, setImagePreview] = useState(null);
  const [moduleName, setModuleName] = useState("");
  const [index, setIndex] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState(false);
  const [accessToUni, setAccessToUni] = useState(false);
  const [accessToCollege, setAccessToCollege] = useState(false);
  const [AccessToUgc, setAccessToUgc] = useState(false);
  const [moduleIcon, setModuleIcon] = useState(null);
  const [moduleData, setModuleData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [moduleId, setModuleId] = useState(null);

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
    try {
      const config = getAuthConfigSafe();
      const formData = new FormData();
      formData.append("Id", 0);
      formData.append("DisplayName", moduleName);
      formData.append("Description", details);
      formData.append("IsActive", status);
      formData.append("AccessToUni", accessToUni);
      formData.append("AccessToCollege", accessToCollege); // fixed typo
      formData.append("AccessToUgc", AccessToUgc);
      formData.append("IconImage", moduleIcon);
      formData.append("index", index);

      const response = await axios.post(`${backendUrl}/Module`, formData, config);

      if (response.status === 200 || response.status === 201) {
        toast.success("Module added successfully!");
        fetchData();
        setModuleName("");
        setIndex("");
        setDetails("");
        setStatus(false);
        setAccessToUni(false);
        setAccessToCollege(false);
        setAccessToUgc(false);
        setModuleIcon(null);
        setImagePreview(null);
      } else {
        toast.error(`Error: ${response.data?.message || "Failed to add module"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Error adding module. Please try again.");
    }
  };

  const fetchData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/Moodule`, config);
      setModuleData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditOpen = (id) => {
    setModuleId(id);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          padding: 3,
          maxWidth: "80%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 500, padding: 1, color: blue[700] }}
        >
          Add Module
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
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
            <Grid item xs={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  required
                  id="status"
                  label="Status"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value={""}>Select Status</MenuItem>
                  <MenuItem value={true}>
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value={false}>
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Access To University?</InputLabel>
                <Select
                  required
                  id="accessToUni"
                  label="Access To University?"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={accessToUni}
                  onChange={(e) => setAccessToUni(e.target.value)}
                >
                  <MenuItem value={""}>Select Access To Uni</MenuItem>
                  <MenuItem value={true}>
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value={false}>
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Access To UGC?</InputLabel>
                <Select
                  required
                  id="AccessToUgc"
                  label="Access To UGC?"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={AccessToUgc}
                  onChange={(e) => setAccessToUgc(e.target.value)}
                >
                  <MenuItem value={""}>Select Access To UGC</MenuItem>
                  <MenuItem value={true}>
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value={false}>
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Access To College</InputLabel>
                <Select
                  required
                  id="accessToCollege"
                  label="Access To College"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={accessToCollege}
                  onChange={(e) => setAccessToCollege(e.target.value)}
                >
                  <MenuItem value={""}>Select accessToCollege</MenuItem>
                  <MenuItem value={true}>
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value={false}>
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
                variant="outlined"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px dashed #3f51b5",
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                }}
              >
                <input
                  type="file"
                  id="moduleIcon"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
                <label htmlFor="moduleIcon">
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

                {/* Preview Image */}
                {imagePreview && (
                  <Box
                    sx={{
                      marginLeft: 2,
                      width: 60,
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
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Details */}
            <Grid item xs={12}>
              <TextField
                id="details"
                label="Description"
                size="small"
                fullWidth
                multiline
                variant="outlined"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                sx={{
                  borderColor: "#3f51b5",
                }}
              />
            </Grid>

            {/* Module Icon */}

            {/* Submit Button */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
              >
                Add Module
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Grid margin={2}>
        <Typography
          textAlign={"center"}
          padding={1}
          variant="h6"
          color={blue[700]}
        >
          List of Modules
        </Typography>
      </Grid>
      <Grid container justifyContent={"center"}>
        <Grid item xs={12} md={10}>
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
                    Module Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Is Accessed to UGC?
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Is Accessed to Uni?
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Is Accessed to College?
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Details
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Index
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
                {moduleData.length > 0 &&
                  moduleData.map((data, index) => (
                    <TableRow key={data.id}>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.displayName}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.isActive ? (
                          <span style={{ color: "green" }}>Active</span>
                        ) : (
                          <span style={{ color: "red" }}>Inactive</span>
                        )}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.accessToUgc ? (
                          <span style={{ color: "green" }}>Access</span>
                        ) : (
                          <span style={{ color: "red" }}>No Access</span>
                        )}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.accessToUni ? (
                          <span style={{ color: "green" }}>Access</span>
                        ) : (
                          <span style={{ color: "red" }}>No Access</span>
                        )}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.accessToCollege ? (
                          <span style={{ color: "green" }}>Access</span>
                        ) : (
                          <span style={{ color: "red" }}>No Access</span>
                        )}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.description}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data?.index}
                      </TableCell>

                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        <Button onClick={() => handleEditOpen(data.id)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <EditModule
        open={dialogOpen}
        handleClose={handleDialogClose}
        Id={moduleId}
      />
    </>
  );
};

export default AddModule;
