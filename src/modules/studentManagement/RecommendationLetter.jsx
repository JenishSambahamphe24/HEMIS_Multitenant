import React, { useEffect, useState, useRef } from "react";
import { Button, Typography, Box, Paper, Grid } from "@mui/material";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

function RecommendationLetter() {
  const backendUrl = config.VITE_BACKEND_URL;
  const baseUrl = config.VITE_BASE_URL;
  const [dropoutData, setDropoutData] = useState({});
  const { id } = useParams();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });
  const { currentUser } = useSelector((state) => state.user);
  const Logo = currentUser?.institution?.logo;
  const campusName = currentUser?.institution?.campusName;
  const uniName = currentUser?.uniName;
  const localLevel = currentUser?.institution?.localLevel;
  const district = currentUser?.institution?.district;
  const userName = currentUser?.listUser[0]?.roleName;

  const fetchDropOutData = async () => {
    try {
     const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/DropOut/${id}`, config);
      setDropoutData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDropOutData();
  }, [id]);

  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f9",
      }}
    >
      <Box
        sx={{
          maxWidth: "800px",
          borderRadius: "8px",
          mt: 4,
        }}
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Recommendation Letter for a Former Student
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handlePrint}
          sx={{
            marginBottom: 2,
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Print Recommendation Letter
        </Button>

        <Paper>
          <Grid
            ref={componentRef}
            sx={{
              padding: "20px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="letter-head">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  marginBottom: 1,
                }}
              >
                <img
                  src={`${baseUrl}/${Logo}`}
                  alt="campus Logo"
                  width="70px"
                  height="70px"
                />
              </Box>
              <Typography variant="body2" align="center">
                {uniName}
              </Typography>
              <Typography
                variant="body1"
                align="center"
                sx={{ fontWeight: 700 }}
              >
                {campusName}
              </Typography>
              <Typography
                variant="body2"
                align="center"
                sx={{ fontWeight: 400 }}
                gutterBottom
              >
                {localLevel}, {district}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 2,
                  marginTop: 2,
                  textDecoration: "underline",
                }}
              >
                Recommendation Letter
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                Date: {new Date().toLocaleDateString()}
              </Typography>
            </div>

            <div className="subject" sx={{ marginTop: 3 }}>
              <Typography variant="body1">
                <strong>Subject:</strong> Recommendation for{" "}
                {dropoutData?.studentName}
              </Typography>
            </div>

            <div className="body" sx={{ marginTop: 3 }}>
              <Typography variant="body1" paragraph>
                To Whom It May Concern,
              </Typography>
              <Typography variant="body1" paragraph>
                I am writing to recommend{" "}
                <strong>{dropoutData?.studentName}</strong>, who was a student
                in our program. Although{" "}
                <strong>{dropoutData?.studentName}</strong> has left the program
                due to <strong>{dropoutData?.reason}</strong>, I want to
                acknowledge their hard work and commitment during their time
                here.
              </Typography>
              <Typography variant="body1" paragraph>
                I believe <strong>{dropoutData?.studentName}</strong> has the
                potential to succeed in future endeavors and strongly recommend
                them for any opportunities they pursue.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ lineHeight: "5px" }}
                  >
                    Sincerely,
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", lineHeight: "5px" }}
                  >
                    {userName}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", lineHeight: "5px" }}
                  >
                    Signature:..............................
                  </Typography>
                </Box>
              </Box>
            </div>
          </Grid>
        </Paper>
      </Box>
      <style>
        {`
          @media print {
            body {
              padding: 0 !important;
              margin: 0 !important;
            }
            .MuiCard-root {
              border: none;
              box-shadow: none;
              padding: 40px;
            }
            .MuiCardContent-root {
              padding: 0 !important;
            }
            .MuiTypography-body2 {
              font-size: 16px !important;
            }
            .MuiButton-root {
              display: none !important;
            }
            .MuiGrid-container {
              display: block !important;
            }
            .MuiGrid-item {
              display: inline-block !important;
              width: 48% !important;
              margin-right: 2% !important;
            }
            .MuiGrid-item:nth-child(2n) {
              margin-right: 0 !important;
            }
            .MuiTableCell-root {
              padding: 8px !important;
              font-size: 14px !important;
            }
            .MuiTableRow-root {
              border-bottom: 1px solid #ddd;
            }
            .MuiTableContainer-root {
              margin-top: 20px;
              margin-bottom: 20px;
            }
            .MuiTypography-h6, .MuiTypography-body2 {
              font-size: 18px !important;
            }
            .MuiTableHead-root {
              background-color: #f0f0f0 !important;
            }
          }
        `}
      </style>
    </Box>
  );
}

export default RecommendationLetter;
