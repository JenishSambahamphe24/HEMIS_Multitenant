import { Box, Typography, Card, Avatar } from "@mui/material";
import QRCode from "react-qr-code";
import { useEffect } from "react";

function RmcIdDesign({
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
  componentRef, // Use the ref from parent for printing
}) {
  // Split campus name into two parts
  const splitCampusName = () => {
    if (!campusName) return { first: "", rest: "" };
    const parts = campusName.split(" ");
    const first = parts[0];
    const rest = parts.slice(1).join(" ");
    return { first, rest };
  };

  const { first, rest } = splitCampusName();

  const generateQRData = () => {
    if (!student) return "";
    return JSON.stringify({
      studentId: student.id || student.studentId,
      name: `${student.firstName || ""} ${
        student.middleName ? student.middleName + " " : ""
      }${student.lastName || ""}`.trim(),
      program: student.programShortName || "",
      level:
        student.programType === "annual"
          ? `${student.year || ""} Year`
          : `${student.semester || ""} Semester`,
      validTill: student.ValidDateNep || student.validityDateNep || "",
    });
  };

  // Add print styles only for PDF saving
  useEffect(() => {
    const printStyles = `
      @media print {
        @page {
          size: 54mm 82mm;
          marginTop: 0;
          padding: 0;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!student) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <Typography color="error">No student data found</Typography>
      </Box>
    );
  }

  return (
    <Card
      ref={componentRef}
      sx={{
        width: "54mm",
        minHeight: "82mm",
        border: "1px solid #003399",
        py: "3px",
        borderRadius: 0,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "white",
        // Print styles only
        "@media print": {
          marginTop: 0,
          padding: 0,
          boxShadow: "none",
          maxHeight: "82mm !important",
        },
      }}
    >
      {/* ===== Header Section ===== */}
      <Box sx={{ width: "100%", mt: -0.1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", mt: 0.5 }}>
          {/* Logo */}
          {logo && (
            <Box
              sx={{
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={`${uploadURL}/${logo}`}
                alt="Logo"
                style={{
                  width: "90%",
                  height: "90%",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = error_img;
                }}
              />
            </Box>
          )}

          {/* Text beside logo */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "7.5px",
                lineHeight: 1.1,
                textAlign: "left",
                mb: 0.2,
              }}
            >
              {uniName}
            </Typography>

            {/* ===== Blue Box with Split Campus Name ===== */}
            <Box
              sx={{
                bgcolor: "#003399",
                color: "white",
                textAlign: "left-align",
                px: 0.6,
                py: 0.3,
                mt: 0.2,
                borderRadius: "2px",
                width: "101%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  lineHeight: 1.1,
                }}
              >
                {first}
              </Typography>
              {rest && (
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    lineHeight: 1.1,
                    mt: "1px",
                  }}
                >
                  {rest}
                </Typography>
              )}
            </Box>

            <Typography
              sx={{
                fontSize: "7.5px",
                lineHeight: 1.1,
                textAlign: "left",
                mt: 0.2,
              }}
            >
              {`${localLevel}, ${district}`}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ===== Red Student ID Text Only Bar ===== */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <Box
          sx={{
            bgcolor: "red",
            color: "white",
            borderRadius: "2px",
            px: 1,
            py: 0.2,
            display: "inline-block",
            mt: "-5px",
            mb: "1px",
          }}
        >
          <Typography sx={{ fontSize: "10px", fontWeight: "bold" }}>
            STUDENT ID CARD
          </Typography>
        </Box>
      </Box>

      {/* ===== Photo and Signature ===== */}
      <Box sx={{ textAlign: "center", position: "relative", mt: "2px" }}>
        <Box
          sx={{
            width: "64px",
            height: "64px",
            border: "1px solid black",
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "white",
            position: "relative",
          }}
        >
          <Avatar
            src={stdPhoto ? `${uploadURL}/${stdPhoto}` : error_img}
            alt="Student Photo"
            variant="square"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = error_img;
            }}
          />
          {firstSignature?.uploadSignature && (
            <img
              style={{
                width: "100px",
                height: "60px",
                position: "absolute",
                bottom: "-30px",
              }}
              src={`${uploadURL}/signatures/${firstSignature.uploadSignature}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = error_img;
              }}
              alt="Signature"
            />
          )}
        </Box>
        <Typography sx={{ fontSize: "10px", mb: "2px" }}>
          Authorized Signature
        </Typography>
      </Box>

      {/* ===== Student Details ===== */}
      <Box sx={{ px: 1, lineHeight: 1.2, mb: 0.5, position: "relative" }}>
        <Typography sx={{ fontSize: "10px" }}>
          <strong>
            Name: {student.firstName}{" "}
            {student.middleName ? student.middleName + " " : ""}
            {student.lastName}{" "}
          </strong>
        </Typography>

        <Typography sx={{ fontSize: "10px" }}>
          <b>Student Id:</b> {student?.id}
        </Typography>

        {/* Address Field - Simplified based on debug results */}
        <Typography sx={{ fontSize: "10px" }}>
          <b>Address:</b>{" "}
          {`${student.pMunicipality || ""} ${student.pDistrict || ""}`.trim() ||
            "N/A"}
        </Typography>

        <Typography sx={{ fontSize: "10px" }}>
          <strong style={{ marginRight: "4px" }}>Program:</strong>
          {student.programShortName},
          <span style={{ marginLeft: "4px" }}>
            {student.programType === "annual"
              ? `${student.year || ""} Year`
              : `${student.semester || ""} Semester`}
          </span>
        </Typography>

        {/* Row containing Batch Year, Contact No., Valid Date and QR Code */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          {/* Text fields column */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "10px" }}>
              <b>Batch Year:</b> {student?.batchNameNepali}
            </Typography>

            <Typography sx={{ fontSize: "10px" }}>
              <b>Contact No.:</b> {student?.phoneNumber}
            </Typography>

            <Typography sx={{ fontSize: "10px" }}>
              <b>Valid Date:</b> {student?.validDateNep || "N/A"}
            </Typography>
          </Box>

          {/* QR Code column */}
          <Box sx={{ flexShrink: 0 }}>
            <QRCode value={generateQRData()} size={46} />
          </Box>
        </Box>
      </Box>
      {/* ===== Footer Section ===== */}
      <Box
        sx={{
          borderTop: "1px solid #003399",
          mt: 0.5, // adjusted slightly to balance layout
          py: 0.35,
          px: 0.5,
          textAlign: "center",
          bgcolor: "#fff",
        }}
      >
        <Typography sx={{ fontSize: "9px" }}>
          <b> P. No.: {phoneNo}</b>
        </Typography>
        <Typography sx={{ fontSize: "9px" }}>
          <b>Email: {contactEmail}</b>
        </Typography>
      </Box>
    </Card>
  );
}

export default RmcIdDesign;
