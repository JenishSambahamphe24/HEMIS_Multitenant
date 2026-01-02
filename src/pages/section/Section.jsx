import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import SectionEdit from "./SectionEdit";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const Section = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sectionName, setSectionName] = useState("");
  const [index, setSectionIndex] = useState("");
  const [status, setStatus] = useState(true);
  const [remarks, setRemarks] = useState("");
  const sectionType = "Student";

  // Fetch data from API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const config = getAuthConfigSafe()

        const response = await axios.get(
          `${backendUrl}/Management/Sections`,
          config
        );
        const sortedSections = response.data.sort(
          (a, b) => Number(a.index) - Number(b.index)
        );
        setSections(sortedSections);

      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error("Failed to load sections");
      }
    };

    fetchSections();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const newSection = { sectionName, index, status, sectionType, remarks };

    try {
      const config = getAuthConfigSafe()
      await axios.post(
        `${backendUrl}/Management/AddSection`,
        newSection,
        config
      );
      toast.success("Section added successfully!");

      // Refresh the sections list
      const response = await axios.get(
        `${backendUrl}/Management/Sections`,
        config
      );
      const sortedSections = response.data.sort((a, b) => Number(a.index) - Number(b.index));
      setSections(sortedSections);

      // Reset form
      setSectionName("");
      setSectionIndex("");
      setStatus(true);
      setRemarks("");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Section already exists!");
      } else {
        console.error("Error adding section:", error);
        toast.error("Failed to add section");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle opening edit dialog
  const handleEditClick = (section) => {
    setSelectedSection(section);
    setEditDialogOpen(true);
  };

  // Handle closing edit dialog
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleUpdateSuccess = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/Management/Sections`,
        config
      );
      const sortedSections = response.data.sort(
        (a, b) => Number(a.index) - Number(b.index)
      );
      setSections(sortedSections);
    } catch (error) {
      console.error("Error refreshing sections:", error);
    }
  };

  return (
    <Container>
      {/* Add Section Form */}
      <Paper
        sx={{
          maxWidth: 624,
          margin: "auto",
          marginTop: 2,
          marginBottom: 1,
          padding: 2,
        }}
      >
        <Box
          sx={{
            mb: 2,
            padding: 2,
          }}
        >
          <Typography
            sx={{ textAlign: "center", paddingBottom: "10px" }}
            variant="h5"
            color="rgb(43, 110, 181)"
            gutterBottom
          >
            Add Section
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3.5}>
                <TextField
                  label="Section Index"
                  type="number"
                  required
                  size="small"
                  fullWidth
                  value={index}
                  onChange={(e) => {
                    const sanitizedValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    setSectionIndex(sanitizedValue);
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // Prevent non-numeric characters
                    }
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={5.4}>
                <TextField
                  label="Section Name"
                  required
                  fullWidth
                  size="small"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3.1}>
                <FormControl fullWidth>
                  <InputLabel required>Status</InputLabel>
                  <Select
                    label="Status"
                    value={status}
                    size="small"
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{ color: status ? "green" : "red" }}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Remarks"
                  fullWidth
                  size="small"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box textAlign="center" marginTop={2}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>

      {/* Sections Table */}
      <Typography
        variant="h5"
        gutterBottom
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "rgb(43, 110, 181)",
        }}
      >
        List of Sections
      </Typography>
      <Box sx={{ maxWidth: 624, margin: "auto", overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #ddd",
            maxWidth: 624, // Fixed table width
            overflowX: "auto",
          }}
        >
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead sx={{ backgroundColor: "rgb(43, 110, 181)" }}>
              <TableRow>
                <TableCell
                  sx={{
                    width: "50px",
                    borderRight: "1px solid #ddd",
                    color: "white",
                  }}
                >
                  S.No
                </TableCell>
                <TableCell
                  sx={{
                    width: "150px",
                    borderRight: "1px solid #ddd",
                    color: "white",
                  }}
                >
                  Section Name
                </TableCell>
                <TableCell
                  sx={{
                    width: "80px",
                    borderRight: "1px solid #ddd",
                    color: "white",
                  }}
                >
                  Index
                </TableCell>
                <TableCell
                  sx={{
                    width: "100px",
                    borderRight: "1px solid #ddd",
                    color: "white",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    width: "150px",
                    borderRight: "1px solid #ddd",
                    color: "white",
                  }}
                >
                  Remarks
                </TableCell>
                <TableCell sx={{ width: "90px", color: "white" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{
                      textAlign: "center",
                      fontStyle: "italic",
                      color: "gray",
                    }}
                  >
                    No sections available.
                  </TableCell>
                </TableRow>
              ) : (
                sections.map((section, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                      {idx + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        wordWrap: "break-word", // Break long words
                        whiteSpace: "normal", // Allow wrapping
                      }}
                    >
                      {section.sectionName}
                    </TableCell>
                    <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                      {section.index}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        color: section.status ? "green" : "red",
                      }}
                    >
                      {section.status ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        wordWrap: "break-word", // Break long words
                        whiteSpace: "normal", // Allow wrapping
                      }}
                    >
                      {section.remarks}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEditClick(section)}
                        variant="outlined"
                        size="small"
                        sx={{
                          backgroundColor: "rgb(43, 110, 181)",
                          color: "white",
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {selectedSection && (
        <SectionEdit
          section={selectedSection}
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </Container>
  );
};

export default Section;
