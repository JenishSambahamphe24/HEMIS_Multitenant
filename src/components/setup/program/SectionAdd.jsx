import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  Chip,
  Button,
  Paper,
  TablePagination,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Container,
  Table,
  TableHead,
  Box,
  Alert,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { blue, green, red } from "@mui/material/colors";
import { Refresh, WifiOff, Add, Edit } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import EditSection from "./EditSection";
import {config} from '@config';

const AddSections = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [data, setData] = useState({
    sectionName: "",
    sectionType: "",
    status: true,
    remarks: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sectionData, setSectionData] = useState([]);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const config = await getAuthConfigSafe();
      const response = await axios.get(
        `${backendUrl}/Management/Sections`,
        config
      );

      // Sort data alphabetically by sectionName
      const sortedData = response.data.sort((a, b) =>
        a.sectionName.localeCompare(b.sectionName)
      );

      setSectionData(sortedData);
      setOffline(false);
    } catch (err) {
      console.error("Error fetching sections:", err);

      if (err.code === "NETWORK_ERROR" || err.message === "Network Error") {
        setError(
          "Cannot connect to server. Please check your network connection."
        );
        setOffline(true);
      } else if (err.response && err.response.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to load sections. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, retryCount]);

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
    try {
      const config = await getAuthConfigSafe();

      // Ensure we have proper headers
      if (!config.headers) {
        config.headers = {};
      }

      config.headers["Content-Type"] = "application/json";

      const postData = {
        sectionName: data.sectionName.trim(),
        sectionType: data.sectionType.trim(),
        remarks: data.remarks.trim(),
        status: data.status,
      };

      const response = await axios.post(
        `${backendUrl}/Management/AddSection`,
        postData,
        config
      );

      if (response.status === 200 || response.status === 201) {
        setData({
          sectionName: "",
          sectionType: "",
          status: true,
          remarks: "",
        });
        // Auto-refresh after successful submission
        fetchData();
        toast.success("Section added successfully");
      }
    } catch (err) {
      console.error("Error during API call:", err);
      console.error("Error details:", err.response?.data);

      if (err.code === "NETWORK_ERROR" || err.message === "Network Error") {
        setError("Network error. Please check your connection and try again.");
        setOffline(true);
        toast.error("Network error. Please check your connection.");
      } else if (err.response) {
        if (err.response.status === 409) {
          // Only show toast, not the error alert
          toast.error("Section already exists!");
        } else if (err.response.status >= 500) {
          setError("Server error. Please try again later.");
          toast.error("Server error. Please try again later.");
        } else {
          const errorMessage =
            err.response.data?.message ||
            "An error occurred. Please try again.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount((prev) => prev + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEditClick = (section) => {
    setSelectedSection(section);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedSection(null);
  };

  const handleSectionUpdate = () => {
    // Refresh data after update
    fetchData();
    handleEditDialogClose();
  };

  return (
    <div>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            mx: "auto",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            style={{
              color: blue[700],
              textAlign: "center",
              padding: "10px",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            Add New Section
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <IconButton
                  aria-label="retry"
                  color="inherit"
                  size="small"
                  onClick={handleRetry}
                >
                  <Refresh />
                </IconButton>
              }
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={3}
              sx={{
                marginBottom: "20px",
              }}
            >
              <Grid item xs={12} md={4}>
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

              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    required
                    id="status"
                    name="status"
                    labelId="status-label"
                    label="Status"
                    value={data.status}
                    onChange={(e) =>
                      setData({ ...data, status: e.target.value })
                    }
                    sx={{
                      "& .MuiSelect-select": {
                        color: data.status ? green[700] : red[700],
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <MenuItem value={true} sx={{ color: green[700] }}>
                      Active
                    </MenuItem>
                    <MenuItem value={false} sx={{ color: red[700] }}>
                      Inactive
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
            <Grid container justifyContent="center" marginTop={2}>
              <Grid item xs={12} md={6} display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || offline}
                  sx={{
                    backgroundColor: offline ? blue[300] : blue[700],
                    color: "white",
                    width: "40%",
                    py: 1,
                    "&:hover": {
                      backgroundColor: offline ? blue[300] : blue[800],
                    },
                  }}
                >
                  {submitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : offline ? (
                    <>
                      <WifiOff sx={{ mr: 1 }} />
                      Offline
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Box display="flex" justifyContent="center" mb={2}>
          <Typography
            variant="h5"
            component="h2"
            style={{
              color: blue[700],
              padding: "10px",
              marginBottom: "20px",
              fontWeight: "bold",
              fontSize: "1.8rem",
              marginBottom: "-3px",
            }}
          >
            List Of Sections
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : offline ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              You are currently offline. Sections cannot be loaded without a
              network connection.
            </Typography>
          </Alert>
        ) : sectionData.length > 0 ? (
          <>
            <TableContainer component={Paper} elevation={2}>
              <Table aria-label="sections table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: blue[700] }}>
                    <TableCell
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        padding: "8px",
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      S.No.
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        padding: "8px",
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Section Name
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        padding: "8px",
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        padding: "8px",
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Remarks
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        padding: "8px",
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sectionData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            padding: "8px",
                          }}
                        >
                          {row.sectionName}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          <Chip
                            label={row.status ? "Active" : "Inactive"}
                            color={row.status ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            padding: "8px",
                          }}
                        >
                          {row.remarks || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(row)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={sectionData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <Alert severity="info">
            No sections found. Add a new section using the form above.
          </Alert>
        )}
      </Container>

      {/* Edit Section Dialog */}
      {editDialogOpen && selectedSection && (
        <EditSection
          section={selectedSection}
          onClose={handleEditDialogClose}
          onUpdate={handleSectionUpdate}
        />
      )}
    </div>
  );
};

export default AddSections;
