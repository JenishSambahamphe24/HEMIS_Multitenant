import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { blue } from "@mui/material/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ZoomIn } from "@mui/icons-material";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const StudentsDetails = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const baseUrl=config.VITE_BASE_URL;
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [actionType, setActionType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getStudentById = async () => {
      try {
        const response = await axios.get(`${backendUrl}/Student/${id}`);
        setStudentData(response.data);
      } catch (error) {
        toast.error("Failed to fetch student data", { autoClose: 2000 });
      }
    };

    getStudentById();
  }, [id]);

  const handleAction = async (type) => {
    setOpenConfirmDialog(false);
    setIsLoading(true);
    try {
      const config = getAuthConfigSafe()
      let response;

      if (type === "verify") {
        response = await axios.post(
          `${backendUrl}/Student/VerifyStudentSelf/${id}`,
          null,
          config
        );
      }
      navigate("/student-management/verified-students");
      if (response.status === 200) {
        toast.success("Student verified successfully", { autoClose: 2000 });
      } else {
        toast.error("Failed to verify student", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Failed to verify student", { autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  };
  const openConfirmationDialog = (action) => {
    setActionType(action);
    setOpenConfirmDialog(true);
  };

  const handleConfirmClose = (actionConfirmed) => {
    if (actionConfirmed) {
      handleAction(actionType);
    } else {
      setOpenConfirmDialog(false);
    }
  };

  const studentInfo = studentData || {};
  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentImage(null);
  };

  const renderField = (label, value) => (
    <Grid item xs={12} sm={6}>
      <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
        <Typography variant="body2" color="text.primary" sx={{ width: 160 }}>
          {`${label}:`}
        </Typography>
        <Typography variant="body2" color="#1976d2">
          {value || "-"}
        </Typography>
      </Stack>
    </Grid>
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <CircularProgress size={50} color="primary" />
        <Typography variant="h6" sx={{ color: "#1976d2", marginLeft: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }
  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", color: "#2A629A" }}
      >
        Student's Enrollment Details for Verification
      </Typography>
      <Box sx={{ p: 3, display: "flex", height: "100%", gap: 2 }}>
        <Card
          variant="outlined"
          sx={{
            flex: 2,
            borderRadius: 2,
            boxShadow: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography
              textAlign="center"
              variant="subtitle1"
              sx={{ color: blue[600], mt: ".5rem" }}
            >
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {renderField(
                "विद्यार्थीको पुरा नाम देबनगरीमा (unicode)",
                studentInfo.nepaliName
              )}
              {renderField("First Name", studentInfo.firstName)}
              {renderField("Middle Name", studentInfo.middleName)}
              {renderField("Last Name", studentInfo.lastName)}
              {renderField("Phone Number", studentInfo.phoneNumber)}
              {renderField("Gender", studentInfo.gender)}
              {renderField("Email", studentInfo.email)}
              {renderField("Date of Birth (BS)", studentInfo.doBBS)}
              {renderField(
                "Date of Birth (AD)",
                studentInfo?.doBAD?.slice(0, 10)
              )}
              {renderField("Ethnicity", studentInfo.ethnicity)}
              {renderField("Nationality", studentInfo.nationality)}
              {renderField("Disability Status", studentInfo.disabilityStatus)}
              {renderField("Citizenship No", studentInfo.citizenshipNo)}
              {renderField(
                "Citizen Issue District",
                studentInfo.citizenIssueDist
              )}
              {renderField("Address", studentInfo.gAddress)}
            </Grid>

            <Typography
              textAlign="center"
              variant="subtitle1"
              sx={{ color: blue[600], mt: ".5rem" }}
            >
              Guardian Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {renderField("Father Name", studentInfo.fatherName)}
              {renderField("Father Occupation", studentInfo.fOccupation)}
              {renderField("Father Phone No", studentInfo.fatherPhoneNo)}
              {renderField("Father Email", studentInfo.fatherEmail)}
              {renderField("Mother Name", studentInfo.motherName)}
              {renderField("Mother Occupation", studentInfo.mOccupation)}
              {renderField("Mother Phone No", studentInfo.motherPhoneNo)}
              {renderField("Mother Email", studentInfo.motherEmail)}
              {renderField("Guardian Name", studentInfo.guardianName)}
              {renderField("Guardian Phone", studentInfo.guardianPhone)}
              {renderField("Guardian Email", studentInfo.gEmail)}
            </Grid>

            <Typography
              textAlign="center"
              variant="subtitle1"
              sx={{ color: blue[600], mt: ".5rem" }}
            >
              Address Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ mb: 2, color: "#2A629A" }}
            >
              Permanent Address
            </Typography>
            <Grid container spacing={1}>
              {renderField("Province", studentInfo.pProvince)}
              {renderField("District", studentInfo.pDistrict)}
              {renderField("Local Level", studentInfo.pLocalLevel)}
              {renderField("Ward No", studentInfo.pWardNo)}
              {renderField("Block No", studentInfo.pBlockNo)}
              {renderField("House No", studentInfo.pHouseNo)}
            </Grid>

            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ mt: 3, mb: 2, color: "#2A629A" }}
            >
              Temporary Address
            </Typography>
            <Grid container spacing={1}>
              {renderField("Province", studentInfo.tProvince)}
              {renderField("District", studentInfo.tDistrict)}
              {renderField("Local Level", studentInfo.tLocalLevel)}
              {renderField("Ward No", studentInfo.tWardNo)}
              {renderField("Block No", studentInfo.tBlockNo)}
              {renderField("House No", studentInfo.tHouseNo)}
            </Grid>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            flex: 1,
            borderRadius: 2,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: 6,
            },
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              overflowY: "auto",
              maxHeight: "130vh",
              paddingBottom: "16px",
            }}
          >
            {[
              studentInfo.ppSizePhoto,
              studentInfo.citizenshipFront,
              studentInfo.citizenshipBack,
              studentInfo?.nidPic,
            ].map((image, index) => (
              <div
                key={index}
                style={{ marginBottom: "16px", position: "relative" }}
              >
                <img
                  src={`${baseUrl}/${image}`}
                  alt={`Student Document ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onClick={() => handleImageClick(`${baseUrl}/${image}`)}
                />
                <IconButton
                  onClick={() => handleImageClick(`${baseUrl}/${image}`)}
                  sx={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <ZoomIn />
                </IconButton>
              </div>
            ))}
          </CardContent>
        </Card>

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
          <DialogTitle sx={{ textAlign: "center", fontWeight: 500 }}>
            Image Preview
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={currentImage}
              alt="Enlarged"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "600",
            fontSize: "1rem",
            bgcolor: blue[700],
            color: "white",
            py: 1.5,
            mb: 1.5,
          }}
        >
          {`Confirm Verification`}
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            py: 2,
            px: 2,
            backgroundColor: "#f9f9f9",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.875rem",
              fontWeight: 400,
              textAlign: "center",
              mb: 2,
            }}
          >
            Are you sure you want to {actionType} this student? Upon successful
            verification, the student will be enrolled in this campus.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            p: 1,
            pb: 2,
            borderTop: "1px solid #ddd",
          }}
        >
          <Button
            onClick={() => handleConfirmClose(false)}
            color="error"
            variant="outlined"
            size="small"
            sx={{
              padding: "6px 12px",
              fontSize: "0.75rem",
              borderRadius: 2,
            }}
          >
            cancel
          </Button>
          <Button
            onClick={() => handleConfirmClose(true)}
            color="success"
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#1976d2",
              color: "white",
              "&:hover": {
                bgcolor: "#1565c0",
              },
              padding: "6px 12px",
              borderRadius: 2,
            }}
          >
            confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 0, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="standard"
          size="small"
          sx={{
            bgcolor: "#f44336",
            color: "white",
            "&:hover": {
              bgcolor: "#c62828",
            },
            padding: "6px 12px",
            fontSize: "0.75rem",
            borderRadius: 2,
          }}
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            "&:hover": {
              bgcolor: "#1565c0",
            },
            padding: "6px 12px",
            borderRadius: 2,
          }}
          onClick={() => openConfirmationDialog("verify")}
        >
          Verify
        </Button>
      </Box>
    </>
  );
};

export default StudentsDetails;
