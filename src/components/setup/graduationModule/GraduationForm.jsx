import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const GraduationForm = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const baseUrl=config.VITE_BASE_URL;
  const [graduationData, setGraduationData] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const Logo = currentUser?.institution?.logo;
  const campusName = currentUser?.institution?.campusName;
  const universityName = currentUser?.institution?.campusName;
  const localLevel = currentUser?.institution?.localLevel;
  const district = currentUser?.institution?.district;
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const studentId = searchParams.get("id");
  const id = studentId;

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  useEffect(() => {
    const fetchGraduationData = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/Graduation/${id}`,
          config
        );
        setGraduationData(response.data);
      } catch (error) {
        console.error("Error fetching graduation data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraduationData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
 console.log(graduationData)
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <Box sx={{ maxWidth: 1000, margin: "auto" }} ref={componentRef}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              padding: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                bgcolor: "#1976d2",
                color: "white",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
                borderRadius: 2,
              }}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              backgroundColor: "white",
              minHeight: "600px",
              border: "1px solid #eee",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
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
                Tribhuvan University
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
                variant="subtitle2"
                align="right"
                sx={{ fontWeight: 400, color: "#444" }}
              >
                Date: {new Date().toLocaleDateString()}{" "}
              </Typography>
              <Divider sx={{ margin: "10px 0" }} />
              <Typography
                align="center"
                variant="body1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  textDecoration: "underline",
                  color: "#444",
                }}
              >
                Application for Character Certificate 
              </Typography>
              {type && type === "new" && (
                <Grid container spacing={2}>
                  {[
                    {
                      label: "Fiscal Year",
                      value: graduationData?.fiscalYear.yearNepali,
                    },
                    {
                      label: "Enrolled Year",
                      value: graduationData?.student?.admissionYear,
                    },
                    {
                      label: "Applicant Name",
                      value: `${graduationData?.student?.firstName} ${graduationData?.student?.middleName} ${graduationData?.student?.lastName} `,
                    },
                    { label: "Passed Year", value: graduationData?.passedYear },
                    {
                      label: "Date of Birth (Nepali)",
                      value: graduationData?.student?.doBBS,
                    },
                    {
                      label: "Date of Birth (English)",
                      value: graduationData?.student?.doBAD?.slice(0, 10),
                    },
                    { label: "Division", value: graduationData?.division },
                    { label: "GPA", value: graduationData?.gpa },
                    {
                      label: "Father's Name",
                      value: graduationData.fatherName,
                    },
                    {
                      label: "Mother's Name",
                      value: graduationData?.motherName,
                    },
                 
                    { label: "Remarks", value: graduationData?.remarks || "-" },
                  ].map((field, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 5,
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "#555",
                          }}
                        >
                          {field.label}:
                        </Typography>
                        <TextField
                          variant="standard"
                          size="small"
                          value={field.value || "N/A"}
                          sx={{
                            fontSize: "14px",
                            borderRadius: "4px",
                            maxWidth: "300px",
                            "& .MuiInput-underline:before": {
                              borderBottom: "1px dotted #ddd",
                            },
                            "& .MuiInput-underline:after": {
                              borderBottom: "1px solid #1976d2",
                            },
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
              {type && type === "old" && (
                <Grid container spacing={2}>
                  {[
                    {
                      label: "Fiscal Year",
                      value: graduationData?.fiscalYear,
                    },
                    {
                      label: "Enrolled Year",
                      value: graduationData?.enrolledYear,
                    },
                    {
                      label: "Applicant Name",
                      value: `${graduationData?.applicantNameEng} `,
                    },
                    { label: "Passed Year", value: graduationData?.passedYear },
                    {
                      label: "Date of Birth (Nepali)",
                      value: graduationData?.doBNepali?.slice(0, 10),
                    },
                    {
                      label: "Date of Birth (English)",
                      value: graduationData?.doBEng?.slice(0, 10),
                    },
                    { label: "Division", value: graduationData?.division },
                    { label: "GPA", value: graduationData?.gpa },
                    {
                      label: "Father's Name",
                      value: graduationData?.fatherName,
                    },
                    {
                      label: "Mother's Name",
                      value: graduationData?.motherName,
                    },
                    {
                      label: "Contact Number",
                      value: graduationData?.contactNo,
                    },
                    { label: "Remarks", value: graduationData?.remarks || "-" },
                  ].map((field, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 5,
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "#555",
                          }}
                        >
                          {field.label}:
                        </Typography>
                        <TextField
                          variant="standard"
                          size="small"
                          value={field.value || "N/A"}
                          sx={{
                            fontSize: "14px",
                            borderRadius: "4px",
                            maxWidth: "300px",
                            "& .MuiInput-underline:before": {
                              borderBottom: "1px dotted #ddd",
                            },
                            "& .MuiInput-underline:after": {
                              borderBottom: "1px solid #1976d2",
                            },
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Divider sx={{ margin: "10px 0" }} />

              <Typography variant="body2" sx={{ marginTop: "20px" }}>
                <strong>Note:</strong> Please verify all details before final
                submission.
              </Typography>

              <Typography variant="body2" textAlign={"end"}>
                Applicants Signature:
                .....................................................
              </Typography>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginTop: "30px" }}
              >
                <div style={{ border: "1px solid", padding: "10px" }}>
                  <Typography variant="body2" gutterBottom>
                    Library (Set Book) clearance By:
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Signature:
                    .....................................................
                  </Typography>
                  <Typography variant="body2">
                    Date: .....................................................
                  </Typography>
                </div>
                <div style={{ border: "1px solid", padding: "10px" }}>
                  <Typography variant="body2" gutterBottom>
                    Lab clearance By:
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Signature:
                    .....................................................
                  </Typography>
                  <Typography variant="body2">
                    Date: .....................................................
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>

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
              padding: 10px;
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
            .MuiTextField-root {
              width: 100% !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default GraduationForm;
