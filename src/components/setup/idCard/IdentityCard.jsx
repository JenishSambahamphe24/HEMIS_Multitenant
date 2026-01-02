import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  Divider,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { BSToAD } from "bikram-sambat-js";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { getStudents } from "../../../../src/components/dashboard/services/service";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import toast from "react-hot-toast";
import { Refresh, WifiOff } from "@mui/icons-material";

import BikramSambatDateInput from "../../DateField/DateInputField";
import { getSignaturedEmpById } from "../../../services/services";
import error_img from "../../../assets/error_img.png";
import { getStdDocById } from "../../report/CampusReport/CampusServices";
import JmcIdDesign from "./JmcIdDesign";
import Portrait from "./Portrait";
import Landscape from "./LandScape";
import RmcIdDesign from "./RmcIdDesign";
import axios from "axios";
import {config} from '@config';


const IdentityCard = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const uploadURL = config.VITE_UPLOAD_URL;
  const baseUrl = config.VITE_BASE_URL;
  const [firstSignature, setFirstSignature] = useState([]);
  const componentRef = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const phoneNo = `${currentUser?.institution?.contactNo1 || ""}, ${currentUser?.institution?.phoneNo || ""}`;
  const contactEmail = currentUser?.institution?.contactEmail || "";
  const campusName = currentUser?.institution?.campusName;
  const campusId = currentUser?.institution?.id;
  const localLevel = currentUser?.institution?.localLevel;
  const district = currentUser?.institution?.district;
  const logo = currentUser?.institution?.logo;
  const uniName = currentUser?.institution?.university?.name;
  const { id } = useParams();
  const studentId = Number(id);
  const [student, setStudent] = useState(null);
  const [orientation, setOrientation] = useState("landscape");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [stdPhoto, setStdPhoto] = useState("");
  const [formData, setFormData] = useState({
    validityDateNep: "",
    date: "",
  });

  const getAuthToken = () => {
    try {
      const localStorageData = JSON.parse(localStorage.getItem("persist:root"));
      const userState = JSON.parse(localStorageData?.user || "{}");
      return userState?.currentUser?.tokenString || "";
    } catch (error) {
      console.error("Error getting auth token:", error);
      return "";
    }
  };

  const formatDateForBackend = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("T")) {
      const datePart = dateString.split("T")[0];
      return datePart.replace(/-/g, "/");
    }
    if (dateString.includes("-")) {
      return dateString.replace(/-/g, "/");
    }
    return dateString;
  };

  const isValidBikramSambatDate = (dateString) => {
    if (!dateString) return false;

    let dateToCheck = dateString;
    if (dateString.includes("T")) {
      dateToCheck = dateString.split("T")[0];
    }
    const pattern = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
    const match = dateToCheck.match(pattern);
    if (!match) {
      const altPattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
      return altPattern.test(dateToCheck);
    }
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    if (year < 1970 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 32) return false;
    return true;
  };

  const convertBStoAD = (bsDate) => {
    try {
      if (!bsDate) return "";
      
      // Format the date properly (YYYY/MM/DD)
      const formattedBSDate = bsDate.replace(/-/g, "/");
      
      // Convert BS to AD using bikram-sambat-js
      const adDateString = BSToAD(formattedBSDate);
      
      // adDateString will be in format YYYY/MM/DD, convert to YYYY-MM-DD
      const adDate = adDateString.replace(/\//g, "-");
      
      console.log("BS Date:", formattedBSDate, "-> AD Date:", adDate);
      
      return adDate;
    } catch (error) {
      console.error("Error converting BS to AD:", error);
      return "";
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const students = await getStudents(studentId);
      setStudent(students);
      setOffline(false);
    } catch (error) {
      console.error("Error fetching student data:", error);

      if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
        setError("Cannot connect to server. Please check your network connection.");
        setOffline(true);
      } else if (error.response && error.response.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (error.response && error.response.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to load student data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStudentDocument = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const response = await getStdDocById(id);
        setStdPhoto(response.ppSizePhoto);
        setOffline(false);
      } catch (error) {
        console.error("Failed to fetch student document:", error);
        setStdPhoto(null);

        if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
          setError("Cannot connect to server. Please check your network connection.");
          setOffline(true);
        } else if (error.response && error.response.status === 401) {
          setError("Authentication failed. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDocument();
  }, [id]);

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const response = await getSignaturedEmpById();
        const signature = response.find((item) => item.index === 1);
        if (signature) {
          setFirstSignature(signature);
        } else {
          setFirstSignature(null);
        }
        setOffline(false);
      } catch (error) {
        console.error("Failed to fetch signature:", error);
        setFirstSignature(null);

        if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
          setError("Cannot connect to server. Please check your network connection.");
          setOffline(true);
        } else if (error.response && error.response.status === 401) {
          setError("Authentication failed. Please log in again.");
        }
      }
    };

    fetchSignature();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [studentId, retryCount]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: ${orientation === "landscape" ? "86mm 54mm" : "54mm 86mm"};
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0;
          padding: 0;
        }
        * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const updateValidityDate = async (studentId, validityDateNep, validityDate) => {
    try {
      const authToken = getAuthToken();

      if (!authToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Format the AD date to include time component for backend
      const formattedValidityDate = validityDate ? `${validityDate}T00:00:00` : null;

      const requestBody = {
        validDateNep: validityDateNep,
        validDate: formattedValidityDate,
      };

      const response = await axios.patch(
        `${backendUrl}/Student/${studentId}/update-validity`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating validity date:", error);
      
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error(error.response.data?.message || "Invalid request. Please check the validity date format.");
        } else if (error.response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        } else if (error.response.status === 403) {
          throw new Error("You don't have permission to perform this action.");
        } else if (error.response.status === 500) {
          throw new Error("Server error. Please try again later.");
        }
      }
      
      throw new Error(error.message || "Failed to update validity date");
    }
  };

  const handleValiditySubmit = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      if (!formData.validityDateNep) {
        throw new Error("Please select a validity date");
      }

      const formattedDateNep = formatDateForBackend(formData.validityDateNep);
      
      if (!isValidBikramSambatDate(formattedDateNep)) {
        throw new Error("Please enter a valid date format");
      }

      // Convert BS date to AD (English) date
      const englishDate = convertBStoAD(formattedDateNep);

      if (!englishDate) {
        throw new Error("Failed to convert date to English format");
      }

      // Call the updateValidityDate function with both BS and AD dates
      await updateValidityDate(studentId, formattedDateNep, englishDate);

      toast.success("Validity date updated successfully!");
      handleClose();
      
      // Refresh student data
      await fetchStudents();
      
    } catch (err) {
      setError(err.message);
      
      if (
        err.message.includes("authentication") ||
        err.message.includes("token") ||
        err.message.includes("Session expired")
      ) {
        toast.error("Authentication error. Please log in again.");
      } else if (
        err.message.includes("Please select") ||
        err.message.includes("valid date") ||
        err.message.includes("convert date")
      ) {
        toast.error(err.message);
      } else if (err.message.includes("Failed to fetch") || err.message.includes("Network Error")) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(err.message || "Failed to save validity date");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount((prev) => prev + 1);
  };

  const commonProps = {
    student,
    baseUrl,
    logo,
    uniName,
    campusName,
    localLevel,
    district,
    phoneNo,
    contactEmail,
    uploadURL,
    campusId,
    stdPhoto,
    firstSignature,
    error_img,
    componentRef,
  };

  const renderDesignComponent = () => {
    switch (orientation) {
      case "landscape":
        return <Landscape {...commonProps} />;
      case "portrait":
        return <Portrait {...commonProps} />;
      case "jmc":
        return <JmcIdDesign {...commonProps} />;
      case "rmc":
        return <RmcIdDesign {...commonProps} />;
      default:
        return <Landscape {...commonProps} />;
    }
  };

  return (
    <>
      <Grid container justifyContent={"right"}>
        <Button onClick={handleClickOpen}>Add Validity</Button>
      </Grid>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, mx: 2 }}
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

      <Box
        my="20px"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          p: 2,
        }}
      >
        <FormControl sx={{ minWidth: 120, mb: 2 }} size="small">
          <Select
            variant="outlined"
            size="small"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
          >
            <MenuItem value="landscape">Landscape</MenuItem>
            <MenuItem value="portrait">Portrait</MenuItem>
            <MenuItem value="jmc">Template(JMC)</MenuItem>
            <MenuItem value="rmc">Template(RMC)</MenuItem>
          </Select>
        </FormControl>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : offline ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              You are currently offline. ID card cannot be loaded without a
              network connection.
            </Typography>
          </Alert>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
              {renderDesignComponent()}
            </Box>

            <Button variant="contained" color="primary" onClick={handlePrint}>
              Print ID Card
            </Button>
          </>
        )}
      </Box>

      {student && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="validity-dialog-title"
          aria-describedby="validity-dialog-description"
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: theme.shadows[10],
              p: 2,
            },
          }}
        >
          <DialogTitle
            id="validity-dialog-title"
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: 1,
              pb: 1.5,
            }}
          >
            Set Validity Date
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2}>
              <Typography
                id="validity-dialog-description"
                variant="body2"
                color="text.secondary"
              >
                Please select a valid date below.
              </Typography>
              <Box
                sx={{
                  background: theme.palette.action.hover,
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="subtitle2" color="text.primary">
                  Student Name:
                  <span style={{ fontWeight: 500, marginLeft: 8 }}>
                    {student.firstName}{" "}
                    {student.middleName ? student.middleName + " " : ""}
                    {student.lastName}
                  </span>
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  Semester/Year:
                  <span style={{ fontWeight: 500, marginLeft: 8 }}>
                    {student.semester ? `${student.semester} Semester` : ""}
                    {student.year ? `${student.year} Year` : ""}
                  </span>
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  Roll No:
                  <span style={{ fontWeight: 500, marginLeft: 8 }}>
                    {student.rollNoManual}
                  </span>
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  Program:
                  <span style={{ fontWeight: 500, marginLeft: 8 }}>
                    {student.programName}
                  </span>
                </Typography>
              </Box>
              <BikramSambatDateInput
                label="Validity Date (B.S)"
                name="validityDateNep"
                format={"YYYY/MM/DD"}
                value={formData.validityDateNep}
                onChange={(newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    validityDateNep: newValue,
                  }));
                }}
                required
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              size="small"
              onClick={handleClose}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleValiditySubmit}
              disabled={submitting || !formData.validityDateNep || offline}
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
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default IdentityCard;