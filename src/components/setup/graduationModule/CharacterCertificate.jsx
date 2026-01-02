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
import { getSignaturedEmpById } from "../../../services/services";
import "./CharacterCertificate.css";
// import CertificateDesign from "./CertificateDesign";
import CertificateDesign from "./CertificateDesign"
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const CharacterCertificate = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const baseUrl=config.VITE_BASE_URL;
    const [professor, setProfessor] = useState([])
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [openCCDialog, setOpenCCDialog] = useState(false);
  const [ccDetails, setCcDetails] = useState([]);
  const localLvl = currentUser?.institution?.localLevel;
  const districtName = currentUser?.institution?.district;
  const uniId = currentUser?.institution?.universityId;
  const fileInputRef = useRef(null);

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
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        let selectedStudent = null;
        let selectedStudentOld = null;
        if (location.state && location.state.studentData) {
          selectedStudent = location.state.studentData;
        } else {
          const config = getAuthConfigSafe()
          const response = await axios.get(
            `${backendUrl}/Graduation/GetGraduationApplicationsStudent`,
            config
          );
          selectedStudent = response.data.find(
            (st) => st.id === parseInt(id, 10)
          );
          const responseOld = await axios.get(
            `${backendUrl}/Graduation`,
            config
          );
          selectedStudentOld = responseOld.data.find(
            (st) => st.id === parseInt(id, 10)
          );
        }

        setStudentData(selectedStudent || selectedStudentOld);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudentData();
  }, [id, location.state]);

  useEffect(() => {
    const fetchCCDetails = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(`${backendUrl}/GraduationCC`, config);
        setCcDetails(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCCDetails();
  }, []);

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
      postData.append("campusName", studentData?.campusName);
      postData.append("studentId", studentData?.studentID);
      postData.append(
        "firstName",
        `${studentData?.student?.firstName} ${studentData?.student?.middleName || ""
        } ${studentData?.student?.lastName}`
      );
      postData.append("universityId", uniId);
      postData.append("universityName", studentData?.universityName);
      postData.append("dateOfCCGenerated", new Date().toISOString());
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
      }
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error("Failed to post data");
    }
    
  };

  const graduationData = ccDetails.filter(
    (data) => data.studentId === Number(id)
  );
  const uploadedCC = graduationData.map((data) => data.uploadedCCFile);
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
            University's Details of the Student
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
                      {studentData.student?.firstName}{" "}
                      {studentData.student?.middleName}{" "}
                      {studentData.student?.lastName}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px",
                      }}
                    >
                      {studentData.student?.rollNo}
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
                      {graduationData.length
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
        <CertificateDesign
          districtName={districtName}
           signatureData={professor}
          localLvl={localLvl}
          studentData={studentData}
        />
      </Grid>
      {graduationData.length ? (
        graduationData[0]?.hasUploaded === false && (
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
        )
      ) : (
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
          {graduationData.length ? (
            <>
              <Paper sx={{ p: 2, mb: 2, border: "1px solid #ccc" }}>
                <Typography variant="body2" mb={1}>
                  Generated Character Certificate:
                </Typography>

                <img src={`${baseUrl}/${uploadedCC[0]}`} alt="Uploaded CC" />
              </Paper>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary" mb={2}>
              No generated CC yet.
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

export default CharacterCertificate;
