import React, { useRef, useState, useEffect } from "react";
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { BSToAD } from "bikram-sambat-js";
import error_img from './../../../assets/error_img.png'
import {config} from '@config';

const CertificateDesignForOld = ({ studentData, signatureData }) => {
const baseUrl = config.VITE_BASE_URL;
const uploadURL = config.VITE_UPLOAD_URL;

  const firstSignature = signatureData.find(item => item.index === 1) || {}
  const secondSignature = signatureData.find(item => item.index === 2) || {}
  const componentRef = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const [EstdDate, setEstdDate] = useState("");

  const campusName = currentUser?.institution?.campusName;
  const uniName = currentUser?.uniName;
  const localLevel = currentUser?.institution?.localLevel;
  const district = currentUser?.institution?.district;
  const Logo = currentUser?.institution?.logo;
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

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 5px 10px;
      }
      body {
        margin: 5px  10px;
      }
    `,
  });
  return (
    <>
      <Box ref={componentRef}>
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
          }}
        >
          {/* Background Image */}
          <Box
            className="bg-print"
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
          <Grid container justifyContent="space-between" sx={{ zIndex: 2 }}>
            <Grid item textAlign='left'>
              <Typography variant="body1">
                T.U. Issue No: {studentData.universityIssueNo}
              </Typography>
              <Typography variant="body1">
                T.U. Regd. No: {studentData.studentRegNo}
              </Typography>
              <Typography variant="body1">
                Date of Birth (BS): {studentData?.doBNepali?.slice(0, 10)}
              </Typography>
            </Grid>
            <Grid item textAlign='left'>
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
            sx={{ zIndex: 2 }}
          >
            <Grid item>
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
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
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

          {/* Title */}
          <div
            style={{
              width: "50%",
              height: 2,
              backgroundColor: "#003366",
              margin: "10px auto",
            }}
          />
          <h1 className="text-4xl my-8 font-bold italic text-[#FF0000] font-['Tangerine, serif']">
            Character Certificate
          </h1>
          <Typography
            variant="body1"
            align="left"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "22px",
              marginTop: 1,
              zIndex: 2,
            }}
          >
            This is to certify that {" "}
            <strong>Mr./Mrs. {studentData?.applicantNameEng}</strong>,
            son/daughter of Mr. <strong>{studentData?.fatherName}</strong> and
            Mrs. <strong>{studentData?.motherName}</strong>, a resident of{" "}
            <strong>{studentData?.studentAddress}</strong>, was enrolled at this
            campus from <strong>{studentData?.enrolledYear}</strong> AD. He/She
            has successfully completed the{" "}
            <strong>{studentData?.programName}</strong> program under{" "}
            <strong>{studentData?.universityName}</strong>, completed in the
            year <strong>{studentData?.passedYear}</strong> AD. Throughout
            his/her academic tenure, his/her conduct and character were found to
            be of an <strong>exemplary</strong> standard. To the best of our
            knowledge, there has been no record of misconduct or behavior
            unbecoming of a student.
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

export default CertificateDesignForOld;
