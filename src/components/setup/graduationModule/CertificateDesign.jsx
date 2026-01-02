import React, { useRef, useState, useEffect } from "react";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { BSToAD } from "bikram-sambat-js";
import error_img from "../../../assets/error_img.png";
import {config} from '@config';

const CertificateDesign = ({ studentData, signatureData = [] }) => {
  const uploadURL = config.VITE_UPLOAD_URL;
  const baseUrl = config.VITE_BASE_URL;
  const firstSignature = signatureData.find((item) => item.index === 1) || {};
  const secondSignature = signatureData.find((item) => item.index === 2) || {};
  const componentRef = useRef();
  const [EstdDate, setEstdDate] = useState("");

  const { currentUser } = useSelector((state) => state.user);
  const Logo = currentUser?.institution?.logo;
  const campusName = currentUser?.institution?.campusName;
  const uniName = currentUser?.uniName;
  const localLevel = currentUser?.institution?.localLevel;
  const district = currentUser?.institution?.district;
  const rawEstd = currentUser?.institution?.dateOfEstd;

  useEffect(() => {
    if (!rawEstd) return;

    try {
      const formattedDate = new Date(rawEstd)
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "/");
      const estdInAD = BSToAD(formattedDate).slice(0, 4);
      setEstdDate(estdInAD);
    } catch (error) {
      console.error("Error formatting establishment date:", error);
    }
  }, [rawEstd]);

  // Print handler
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 5px 10px;
      }
      body {
        margin: 5px 10px;
      }
      @media print {
        body * {
          visibility: hidden;
        }
        #certificate-container, #certificate-container * {
          visibility: visible;
        }
        #certificate-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        /* Ensure colors are preserved when printing */
        * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  return (
    <>
      <Box id="certificate-container" ref={componentRef}>
        <Paper
          sx={{
            padding: 2.5,
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: 0,
            boxShadow: 10,
            border: "5px solid #003366",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            "@media print": {
              boxShadow: "none",
              border: "5px solid #003366",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${baseUrl}/${Logo})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              opacity: 0.09,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* Top Details */}
          <Grid
            container
            justifyContent="space-between"
            sx={{ zIndex: 2, mb: 1 }}
          >
            <Grid item textAlign="left">
              {studentData && (
                <Typography variant="body1">
                  T.U. Issue No: {studentData?.universityIssueNo}
                </Typography>
              )}
              {studentData && (
                <Typography variant="body1">
                  T.U. Regd. No: {studentData?.studentRegNo}
                </Typography>
              )}
              {studentData && (
                <Typography variant="body1">
                  Date of Birth (BS): {studentData?.doBNepali?.slice(0, 10)}
                </Typography>
              )}
            </Grid>
            <Grid item textAlign="left">
              {studentData?.symbolNoUniversity && (
                <Typography variant="body1">
                  Exam Roll No: {studentData.symbolNoUniversity}
                </Typography>
              )}
              <Typography variant="body1">CC Issue No:</Typography>
            </Grid>
          </Grid>

          {/* Header */}
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ zIndex: 2, mb: 2 }}
          >    <Grid item>
              <img
                src={`${baseUrl}/${Logo}`}
                alt="Campus Logo"
                width="80px"
                height="80px"
              />
            </Grid>
            <Grid item xs={8}>

              <Typography variant="body2" sx={{ fontSize: "18px" }}>
                Affiliated to {uniName}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "18px" }}>
                Faculty of {studentData?.facultyName}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", fontSize: "28px" }}
              >
                {campusName || "Campus Name Not Available"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {localLevel || "Local Level Not Available"},{" "}
                {district || "District Not Available"}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                ESTD: {rawEstd?.slice(0, 4)} BS ({EstdDate} AD)
              </Typography>
            </Grid>
            <Grid item>
              {studentData?.uploadPPSizePhoto ? (
                <img
                  src={`${baseUrl}/Graduation/${studentData.uploadPPSizePhoto}`}
                  alt="Student"
                  width="150px"
                  height="160px"
                />
              ) : (
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    border: "1px solid #000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Photo
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Fixed horizontal line with print-specific styling */}
          <Box
            sx={{
              width: "50%",
              height: "2px",
              backgroundColor: "#003366",
              margin: "10px auto",
              "@media print": {
                backgroundColor: "#003366 !important",
                color: "#003366 !important",
                WebkitPrintColorAdjust: "exact",
              },
            }}
          />

          <Typography
            className="certificateTitle"
            sx={{
              color: "red",
              fontFamily: '"Tangerine", serif',
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: "70px",
              zIndex: 2,
              my: 2,
            }}
          >
            Character Certificate 
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "22px",
              zIndex: 2,
              textAlign: "left",
              lineHeight: 1.5,
            }}
          >
            This is to certify that Mr./Mrs.{" "}
            <strong>{studentData?.applicantNameEng}</strong>, son/daughter of
            Mr. <strong>{studentData?.fatherName}</strong> and Mrs.{" "}
            <strong>{studentData?.motherName}</strong>, a resident of{" "}
            <strong>{studentData?.studentAddress}</strong>, was enrolled at this
            campus from <strong>{studentData?.enrolledYear}</strong> AD. He/She
            has successfully completed the{" "}
            <strong>
              {studentData?.programName || "Program Not Available"}
            </strong>{" "}
            program under Tribhuvan University, completed in the year{" "}
            <strong>{studentData?.passedYear}</strong> AD. Throughout his/her
            academic tenure, his/her conduct and character were found to be of
            an exemplary standard. To the best of our knowledge, there has been
            no record of misconduct or behavior unbecoming of a student.
            <br />
            We extend our best wishes for his/her continued success in all
            future endeavors.
          </Typography>

          <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      mt: '10px',
                      padding: 1,
                      zIndex: 2,
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ textAlign: "center", minWidth: "150px" }}>
                      {
                        secondSignature?.uploadSignature && (
        
                          <img
                            style={{
                              width: '100px',
                              height: '60px',
                              marginInline: 'auto',
                              mixBlendMode: 'multiply',
                              backgroundColor: 'transparent',
                              marginBottom: '-25px'
                            }}
                            src={`${uploadURL}/signatures/${secondSignature.uploadSignature}`}
                            alt="Signature"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = error_img;
                            }}
                          />
                        )
                      }
                      <Typography sx={{ fontSize: "16px", fontStyle: "italic", marginBottom: '-8px' }}>
                        ........................
                      </Typography>
        
        
                    </Box>
                    <Box sx={{ textAlign: "center", minWidth: "150px" }}>
                      <Typography sx={{ fontSize: "16px", fontStyle: "italic" }}>
                        Date of Issue: {new Date().toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", minWidth: "150px" }}>
                      {
                        firstSignature?.uploadSignature && (
        
                          <img
                            style={{
                              width: '100px',
                              height: '60px',
                              marginInline: 'auto',
                              mixBlendMode: 'multiply',
                              backgroundColor: 'transparent',
                              marginBottom: '-26px'
                            }}
                            src={`${uploadURL}/signatures/${firstSignature.uploadSignature}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = error_img;
                            }}
                            alt="Signature"
                          />
                        )
                      }
                      <Typography sx={{ fontSize: "16px", fontStyle: "italic", marginBottom: '-8px' }}>
                        .......................................
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      paddingX: 5,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      zIndex: 2,
                      marginTop: '-8px'
                    }}
                  >
                    <Typography sx={{ fontSize: "16px", fontStyle: "italic" }}>
                      Prepared By:
                      {
                        secondSignature.isPositionBelowSign === true && (
                          <>
                            {secondSignature.post}
                          </>
                        )
                      }
                    </Typography>
                    <Typography sx={{ fontSize: "16px", fontStyle: "italic", textAlign: 'center' }}>
                      {
                        firstSignature.isPositionBelowSign === true && (
                          <>
                            {firstSignature.post}
                          </>
                        )
                      }
                    </Typography>
        
                  </Box>
        </Paper>
      </Box>

      <Grid container justifyContent="center" marginTop={2}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
      </Grid>
    </>
  );
};

export default CertificateDesign;
