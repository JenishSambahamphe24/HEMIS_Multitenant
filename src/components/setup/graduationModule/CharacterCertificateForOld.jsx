import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { blue } from "@mui/material/colors";
import toast from "react-hot-toast";
import "./CharacterCertificate.css";
import CertificateDesignForOld from "./CertificateDesignForOld";
import { getEmployees } from "../../dashboard/services/service";
import { getSignaturedEmpById } from "../../../services/services";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const CharacterCertificateForOld = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const baseUrl=config.VITE_BASE_URL;
  const [professor, setProfessor] = useState([])
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [studentData, setStudentData] = useState({});
  const [ccUploaded, setCcUploaded] = useState([]);

  const [openCCDialog, setOpenCCDialog] = useState(false);
  const [ccDetails, setCcDetails] = useState([]);
  const [isReUploading, setIsReUploading] = useState(false);
  const [reUploadFile, setReUploadFile] = useState(null);
  const [reUploadPreview, setReUploadPreview] = useState(null);
  const localLvl = currentUser?.institution?.localLevel;
  const districtName = currentUser?.institution?.district;
  const uniId = currentUser?.institution?.universityId;
  const fileInputRef = useRef(null);
  const reUploadFileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await getSignaturedEmpById();
      setProfessor(response)
    } catch (err) {
      console.error("Error fetching employee data:", err);
    }
  };
  useEffect(() => {
    fetchData()
  }, [])
  const handleSignedCCChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const filePreview = URL.createObjectURL(selectedFile);
      setPreview(filePreview);
    }
  };

  const handleSignedCCFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      const filePreview = URL.createObjectURL(droppedFile);
      setPreview(filePreview);
    }
  };

  const handleReUploadChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setReUploadFile(selectedFile);
      const filePreview = URL.createObjectURL(selectedFile);
      setReUploadPreview(filePreview);
    }
  };

  const handleReUploadDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setReUploadFile(droppedFile);
      const filePreview = URL.createObjectURL(droppedFile);
      setReUploadPreview(filePreview);
    }
  };

  const handleReUploadSubmit = async () => {
    try {
      const config = getAuthConfigSafe()
      const postData = new FormData();
      postData.append("campusId", studentData?.campusId);
      postData.append("universityId", uniId);
      postData.append("graduationApplicationId", id);
      postData.append(
        "dateOfCCGenerated",
        new Date().toISOString().split("T")[0]
      );
      postData.append("status", true);
      postData.append("hasUploaded", true);
      postData.append("uploadedCCFile", reUploadFile);

      const response_cc = await axios.post(
        `${backendUrl}/GraduationCC/GenerateGraduationCharacterCertificate`,
        postData,
        config
      );

      if (response_cc.status === 201) {
        toast.success("File re-uploaded successfully");
        // Refresh the ccUploaded data after successful upload

        setIsReUploading(false);
        setReUploadFile(null);
        setReUploadPreview(null);
      }
    } catch (error) {
      console.error("Error re-uploading file:", error);
      toast.error("Failed to re-upload file");
    }
  };

  const handleCancelReUpload = () => {
    setIsReUploading(false);
    setReUploadFile(null);
    setReUploadPreview(null);
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (location.state && location.state.studentData) {
          setStudentData(location.state.studentData);
        } else {
          const config = getAuthConfigSafe()
          const responseOld = await axios.get(
            `${backendUrl}/Graduation/${id}`,
            config
          );
          setStudentData(responseOld.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudentData();
  }, [id, location.state]);

  useEffect(() => {
    const fetchCCDetails = async () => {
      try {
        const config = getAuthConfigSafe(x)
        const response = await axios.get(`${backendUrl}/GraduationCC`, config);
        setCcDetails(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCCDetails();
  }, []);

  useEffect(() => {
    const fetchCCUploaded = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/GraduationCC/ByGraduationApplication/${id}`,
          config
        );
        setCcUploaded(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCCUploaded();
  }, [id]);

  const handleViewCC = () => {
    setOpenCCDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCCDialog(false);
  };

  const handleSubmitData = async () => {
    try {
      const config = getAuthConfigSafe()
      const postData = new FormData();
      postData.append("campusId", studentData?.campusId);
      postData.append("universityId", uniId);
      postData.append("graduationApplicationId", id);
      postData.append(
        "dateOfCCGenerated",
        new Date().toISOString().split("T")[0]
      );

      postData.append("status", true);
      postData.append("hasUploaded", true);
      postData.append("uploadedCCFile", file);
      const response_cc = await axios.post(
        `${backendUrl}/GraduationCC/GenerateGraduationCharacterCertificate`,
        postData,
        config
      );

      if (response_cc.status === 201) {
        toast.success("Data posted successfully");
        // Refresh the ccUploaded data after successful upload
        const response = await axios.get(
          `${backendUrl}/GraduationCC/${id}`,
          config
        );
        setCcUploaded(response.data);
      }
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error("Failed to post data");
    }
  };

  const graduationData = ccDetails.filter(
    (data) => data.studentId === Number(id)
  );

  // Check if CC has been uploaded
  const hasUploadedCC = ccUploaded && ccUploaded.hasUploaded;

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Grid container spacing={3} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" textAlign="center" color={blue[700]}>
            Student's Details for Character Certificate
          </Typography>
        </Grid>
        {studentData && (
          <Grid item xs={12}>
            <TableContainer sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead style={{ backgroundColor: "#2A629A" }}>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "24px",
                        textAlign: "center",
                      }}
                    >
                      Student Name
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "24px",
                        textAlign: "center",
                      }}
                    >
                      Campus Roll No.
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "24px",
                        textAlign: "center",
                      }}
                    >
                      Faculty
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "24px",
                        textAlign: "center",
                      }}
                    >
                      Level
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "24px",
                        textAlign: "center",
                      }}
                    >
                      Program
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "24px",
                        textAlign: "center",
                      }}
                    >
                      Date of CC Generation
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "4px",
                        height: "24px",
                        textAlign: "center",
                      }}
                    >
                      View CC
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      {studentData.applicantNameEng}{" "}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      {studentData.campusRolNo}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      {studentData.facultyName}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      {studentData.levelName}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      {studentData.programName}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      {ccUploaded && ccUploaded.dateOfCCGenerated
                        ? new Date(
                          ccUploaded.dateOfCCGenerated
                        ).toLocaleDateString()
                        : graduationData.length
                          ? new Date(
                            graduationData[0].dateOfCCGenerated
                          ).toLocaleDateString()
                          : "Not generated"}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleViewCC}
                        size="small"
                      >
                        View CC
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
        {!studentData && (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="textSecondary"
              textAlign="center"
            >
              Loading student data...
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} sm={8} md={12} container justifyContent="center">
        <CertificateDesignForOld
          signatureData={professor}
          districtName={districtName}
          localLvl={localLvl}
          studentData={studentData}
        />
      </Grid>
      {!hasUploadedCC && (
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ padding: 2 }}
        >
          <Grid item xs={12} sm={8} md={6} sx={{ width: "100%" }}>
            <fieldset
              style={{
                border: "2px dashed #1565c0",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleSignedCCFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <legend
                style={{
                  padding: "0px 10px",
                  color: "#1565c0",
                  fontWeight: "bold",
                }}
              >
                Upload Signed CC Here
              </legend>
              <Typography variant="body2" color="textSecondary">
                Drag and drop your signed CC file here or click to browse
              </Typography>
              {preview && (
                <div style={{ marginTop: "20px" }}>
                  <Typography variant="body2" color="textSecondary">
                    File Preview:
                  </Typography>
                  {file?.type?.startsWith("image/") ? (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ maxWidth: "200px", marginTop: "10px" }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ marginTop: "10px" }}
                    >
                      {file?.name}
                    </Typography>
                  )}
                </div>
              )}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleSignedCCChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
            </fieldset>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitData}
              disabled={!file}
            >
              Upload
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Show success message when file is already uploaded */}
      {hasUploadedCC && (
        <Grid container justifyContent="center" sx={{ padding: 2 }}>
          <Grid item>
            <Paper
              sx={{ p: 2, textAlign: "center", backgroundColor: "#e8f5e8" }}
            >
              <Typography variant="body1" color="success.main">
                Character Certificate has been uploaded!
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Click "View CC" to see the uploaded certificate.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Dialog
        open={openCCDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ color: blue[700], mb: 2 }}
          >
            View Character Certificate & Uploaded File
          </Typography>

          {/* Show generated certificate */}
          {graduationData.length > 0 && (
            <Paper sx={{ p: 2, mb: 2, border: "1px solid #ccc" }}>
              <Typography variant="subtitle1" mb={1} fontWeight="bold">
                Generated Character Certificate:
              </Typography>
              <div style={{ textAlign: "center" }}>
                <img
                  src={`${baseUrl}/GenerateGraduationCharacterCertificate`}
                  alt="Generated CC"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            </Paper>
          )}
          {hasUploadedCC && ccUploaded.uploadedCCFile && (
            <Paper sx={{ p: 2, mb: 2, border: "1px solid #ccc" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Uploaded Signed Character Certificate:
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => setIsReUploading(true)}
                  disabled={isReUploading}
                >
                  Re-upload
                </Button>
              </div>

              {!isReUploading ? (
                <div style={{ textAlign: "center" }}>
                  {ccUploaded.uploadedCCFile.toLowerCase().endsWith(".pdf") ? (
                    <div>
                      <Typography variant="body2" color="textSecondary" mb={1}>
                        PDF File: {ccUploaded.uploadedCCFile}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        href={`${baseUrl}/${ccUploaded.uploadedCCFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open PDF
                      </Button>
                    </div>
                  ) : (
                    <img
                      src={`${baseUrl}/${ccUploaded.uploadedCCFile}`}
                      alt="Uploaded CC"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  )}
                </div>
              ) : (
                <div>
                  <fieldset
                    style={{
                      border: "2px dashed #ff9800",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      margin: "10px 0",
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleReUploadDrop}
                    onClick={() => reUploadFileInputRef.current?.click()}
                  >
                    <legend
                      style={{
                        padding: "0px 10px",
                        color: "#ff9800",
                        fontWeight: "bold",
                      }}
                    >
                      Re-upload Signed CC Here
                    </legend>
                    <Typography variant="body2" color="textSecondary">
                      Drag and drop your new signed CC file here or click to
                      browse
                    </Typography>
                    {reUploadPreview && (
                      <div style={{ marginTop: "20px" }}>
                        <Typography variant="body2" color="textSecondary">
                          New File Preview:
                        </Typography>
                        {reUploadFile?.type?.startsWith("image/") ? (
                          <img
                            src={reUploadPreview}
                            alt="Re-upload Preview"
                            style={{ maxWidth: "200px", marginTop: "10px" }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{ marginTop: "10px" }}
                          >
                            {reUploadFile?.name}
                          </Typography>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleReUploadChange}
                      style={{ display: "none" }}
                      ref={reUploadFileInputRef}
                    />
                  </fieldset>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleReUploadSubmit}
                      disabled={!reUploadFile}
                    >
                      Confirm Re-upload
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelReUpload}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Paper>
          )}

          {!graduationData.length && !hasUploadedCC && (
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
            >
              No character certificate data available yet.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCloseDialog}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CharacterCertificateForOld;
