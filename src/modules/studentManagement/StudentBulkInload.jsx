import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  LinearProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { blue } from "@mui/material/colors";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const fetchData = async (config) => {
  const [programResponse] = await Promise.all([
    axios.get(`${backendUrl}/ProgramMgmt/GetCollegePrograms`, config),
  ]);
  return {
    programs: programResponse.data,
  };
};

const InloadForm = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const { currentUser } = useSelector((state) => state.user);
  const campusId = currentUser?.institution?.id;
  const campusName = currentUser?.institution?.campusName;
  const uniId = currentUser?.institution?.universityId;
  const uniName = currentUser?.institution?.university?.name;
  const [formData, setFormData] = useState({
    universityId: uniId,
    campusId: campusId,
    programId: "",
    admissionYearId: "",
    fileInload: null,
  });

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // New states for tracking inload and insert operations
  const [inloadLoading, setInloadLoading] = useState(false);
  const [insertLoading, setInsertLoading] = useState(false);
  const [batchNo, setBatchNo] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // New state for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleExcelFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleExcelFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const config = getAuthConfigSafe()
        const { programs } = await fetchData(config);
        setPrograms(programs);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  useEffect(() => {
    let timer;
    if (batchNo) {
      timer = setTimeout(() => {
        handleInsert(batchNo);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [batchNo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInloadLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const authConfig = getAuthConfigSafe();
      if (!authConfig) {
        setError("Authentication failed. Please login again.");
        setOpenSnackbar(true);
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append("universityId", uniId);
      formDataObj.append("campusId", campusId);
      formDataObj.append("programId", formData.programId);

      if (file) {
        formDataObj.append("fileInLoad", file);
      }

      const config = {
        headers: {
          ...authConfig.headers,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

      const response = await axios.post(
        `${backendUrl}/StudentInload/Inload`,
        formDataObj,
        config
      );

      const responseData = response.data;
      if (responseData.includes("BatchNo:")) {
        const extractedBatchNo = responseData.split("BatchNo:")[1].trim();
        setBatchNo(extractedBatchNo);
        setSuccessMessage(
          `Inload successful. BatchNo: ${extractedBatchNo}. Insert will be triggered in 5 seconds...`
        );
        setOpenSnackbar(true);
      } else {
        setError("Could not extract batch number from response");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error during inload:", error);
      setError(error.response?.data || error.message || "Error during inload");
      setOpenSnackbar(true);
    } finally {
      setInloadLoading(false);
    }
  };

  const handleInsert = async (batchNumber) => {
    setInsertLoading(true);
    setError(null);

    try {
      const config = getAuthConfigSafe()
      const response = await axios.post(
        `${backendUrl}/StudentInload/Insert?BatchNo=${batchNumber}`,
        {},
        config
      );

      console.log("Insert Response", response);
      setSuccessMessage(
        `Student data inserted successfully for BatchNo: ${batchNumber}`
      );
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Insert Error:", error);
      setError(error.response?.data || error.message || "Error during insert");
      setOpenSnackbar(true);
    } finally {
      setInsertLoading(false);
      setBatchNo(null);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px"
      >
        <CircularProgress />
        <Typography variant="h6" style={{ marginLeft: "16px" }}>
          Loading form data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      style={{
        padding: "2rem",
        maxWidth: "70%",
        margin: "0 auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ color: blue[700], textDecoration: "underline", paddingBottom: '5px' }}
      >
        Student Bulk Data Management
      </Typography>

      {inloadLoading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mb={2}
          p={2}
          border="1px solid #e0e0e0"
          borderRadius="4px"
        >
          <Typography variant="body1" mb={1}>
            Uploading and processing inload data...
          </Typography>
          <Box sx={{ width: "100%", mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            {uploadProgress}% Complete
          </Typography>
        </Box>
      )}

      {insertLoading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mb={2}
          p={2}
          border="1px solid #e0e0e0"
          borderRadius="4px"
        >
          <CircularProgress size={30} />
          <Typography variant="body1" mt={1}>
            Processing insert request...
          </Typography>
          {batchNo && (
            <Typography variant="body2" color="textSecondary" mt={1}>
              Inserting data for batch: {batchNo}
            </Typography>
          )}
        </Box>
      )}

      {/* Only show the form when not loading */}
      {!inloadLoading && !insertLoading && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                value={uniName}
                size="small"
                label="University Name"
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                value={campusName}
                size="small"
                label="Campus Name"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel required>Program</InputLabel>
                <Select
                  value={formData.programId}
                  onChange={(e) =>
                    setFormData({ ...formData, programId: e.target.value })
                  }
                  label="Program"
                  size="small"
                  required
                >
                  <MenuItem value="">Select Program</MenuItem>
                  {programs.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.programName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={12} sx={{ width: "100%" }}>
              <fieldset
                style={{
                  border: "2px dashed #1565c0",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleExcelFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <legend
                  style={{
                    padding: "0px 10px",
                    color: "#1565c0",
                    fontWeight: "bold",
                  }}
                >
                  Upload Excel File Here
                </legend>
                <Typography variant="body2" color="textSecondary">
                  Drag and drop your Excel file here or click to browse
                </Typography>
                {preview && (
                  <Box mt={2} p={1} bgcolor="#f5f5f5" borderRadius="4px">
                    <Typography variant="body2" fontWeight="bold">
                      File Selected:
                    </Typography>
                    <Typography variant="body2">{file?.name}</Typography>
                  </Box>
                )}
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelFileChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
              </fieldset>
            </Grid>

            <Grid item xs={12} container justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!file || !formData.programId}
                size="large"
              >
                Upload and Process
              </Button>
            </Grid>
          </Grid>
        </form>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InloadForm;
