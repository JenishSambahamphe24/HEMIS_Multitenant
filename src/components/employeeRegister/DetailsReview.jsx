import React, { useContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EmployeeInfoContext } from "./employeeGeneralInfo";
import { AddressContext } from "./EmployeeAdressGeneralInfo";
import { WorkInfoContext } from "./Worknfo";
import { Button, CircularProgress } from "@mui/material";
import { AcademyContext } from "./AcademyGeneralInfo";
import { BankInfoContext } from "./BankInfo";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { LoadingOverlay } from "@mantine/core";
import { getEmployeePositionById } from "../../services/services";
import { capitaliseFirstLetter, getAuthConfigSafe } from "../../utils/dateUtils";
import { blue } from "@mui/material/colors";
import toast from "react-hot-toast";
import {config} from '@config';


const DetailsReview = ({ handleBack, employeeType }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [empPost, setEmpPost] = useState("");
  const { employeeInfo, getLogoURL } = useContext(EmployeeInfoContext);
  const { employeeAddress } = useContext(AddressContext);
  const { workInfo } = useContext(WorkInfoContext);
  const { academyInfo } = useContext(AcademyContext);
  const { bankInfo } = useContext(BankInfoContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  let campusId;

  useEffect(() => {
    const fetchEmpPosition = async () => {
      const response = await getEmployeePositionById(
        workInfo.employeePositionId
      );
      setEmpPost(response.postName);
    };
    fetchEmpPosition();
  }, [workInfo.employeePositionId]);

  if (currentUser.type === "Uni") {
  } else if (currentUser.type === "college") {
    campusId = currentUser.institution.id;
  }
  const profileURL = getLogoURL();


  const handleRegister = async () => {
    setLoading(true);
    setTimeout(async () => {
      const formData = new FormData();
      formData.append("campusId", campusId || 0);
      formData.append(
        "employeeType",
        workInfo.employeeType || employeeType || "Teaching"
      );
      formData.append("salutation", employeeInfo.salutation);
      formData.append("CtzIssueDistrict", employeeInfo.citizenIssueDist);
      formData.append("firstName", employeeInfo.firstName);
      formData.append("middleName", employeeInfo.middleName || "");
      formData.append("lastName", employeeInfo.lastName);
      formData.append("phoneNumber", employeeInfo.phone);
      formData.append("email", employeeInfo.email);
      formData.append("gender", employeeInfo.gender);
      formData.append("ethnicity", employeeInfo.ethnicity);
      formData.append("religion", employeeInfo.religion);
      formData.append("citizenshipNo", employeeInfo.citizenshipNo);
      formData.append("maritalStatus", employeeInfo.maritalStatus);
      formData.append("dateOFBirth", employeeInfo.dobBS);
      formData.append("dateOFBirthAd", employeeInfo.dobAd);
      formData.append("bankName", bankInfo.bankName);
      formData.append("bankAc", bankInfo.bankAc);
      formData.append("bankBranch", bankInfo.bankBranch);
      formData.append("panNo", bankInfo.panNo);

      formData.append("nidNo", employeeInfo.nidNo);
      formData.append("nid", employeeInfo.nidPic);
      formData.append("ctzFr", employeeInfo.citizenFront);
      formData.append("ctzBr", employeeInfo.citizenBack);
      formData.append("pPhoto", employeeInfo.pPsizePhoto);
      formData.append("employeePositionId", workInfo.employeePositionId);
      formData.append("graduatedfrom", academyInfo.graduatedfrom);
      formData.append("facultyName", academyInfo.faculty);
      formData.append("levelName", academyInfo?.level || academyInfo?.levelName);
      formData.append("programName", academyInfo.program);
      formData.append("enrolledYear", academyInfo.enrolledYear);
      formData.append("PassedYear", academyInfo.passedYear);
      formData.append("cert", academyInfo.certificateCopy);
      formData.append("trans", academyInfo.transcriptCopy);
      formData.append("Mark", academyInfo.marksheetCopy);
      formData.append("otherF", academyInfo.otherDoc);
      formData.append("fiscalYearId", workInfo.fiscalYear);
      formData.append("departmentId", workInfo.departmentId);
      formData.append("sectionId", workInfo.sectionId);
      // Address Info
      formData.append("pProvince", employeeAddress.pProvince);
      formData.append("pDistrict", employeeAddress.pDistrict);
      formData.append("pLocalLevel", employeeAddress.pLocalLevel);
      formData.append("pWardNo", employeeAddress.pWardNo);
      formData.append("pBlockNo", 0);
      formData.append("pHouseNo", employeeAddress.pHouseNo);
      formData.append("pTole", employeeAddress.pTole);
      formData.append("isSameAsPermament", employeeAddress.isSameAsPermament);
      if (employeeAddress.isSameAsPermament) {
        formData.append("tProvince", employeeAddress.pProvince);
        formData.append("tDistrict", employeeAddress.pDistrict);
        formData.append("tLocalLevel", employeeAddress.pLocalLevel);
        formData.append("tWardNo", employeeAddress.pWardNo);
        formData.append("tBlockNo", 0);
        formData.append("tHouseNo", employeeAddress.pHouseNo);
        formData.append("tTole", employeeAddress.pTole);
      } else {
        formData.append("tProvince", employeeAddress.tProvince);
        formData.append("tDistrict", employeeAddress.tDistrict);
        formData.append("tLocalLevel", employeeAddress.tLocalLevel);
        formData.append("tWardNo", employeeAddress.tWardNo);
        formData.append("tBlockNo", 0);
        formData.append("tHouseNo", employeeAddress.tHouseNo);
        formData.append("tTole", employeeAddress.tTole);
      }
      formData.append("position", workInfo.position);
      if (employeeType !== "administrator") {
        formData.append("facultyId", workInfo.facultyId || undefined);
      }
      formData.append("joiningType", workInfo.joiningType);
      formData.append("joiningDate", formatDetail(workInfo.joiningDate));
      formData.append("joiLet", workInfo.joiningletter);
      formData.append("othLet", workInfo.otherletter);
      formData.append("refLet", workInfo.reference);
      try {
      const config = getAuthConfigSafe()
        await axios.post(`${backendUrl}/Employee`, formData, config);
        toast.success("Data Successfully Updated!");
        if (employeeType === "teaching") {
          navigate("/employee-management/teaching-staff");
        } else {
          navigate("/employee-management/non-technical-staff");
        }
      } catch (err) {
        if (err.response && err.response.status === 409) {
          toast.error("Employee already exists!", {
            autoClose: 2000,
          });
        } else {
          toast.error("Failed to add data!", {
            autoClose: 2000,
          });
        }
      } finally {
        setLoading(false);
      }
    }, 1500);
  };
  const formatDetail = (detail) => {
    if (detail === null || detail === undefined) return "N/A";
    if (typeof detail === "object") return JSON.stringify(detail);
    return detail.toString();
  };
  const employeeDetails = [
    {
      name: "Full Name",
      detail: formatDetail(
        ` ${employeeInfo.salutation} ${employeeInfo.firstName} ${employeeInfo.middleName} ${employeeInfo.lastName}`
      ),
    },
    { name: "Phone Number:", detail: formatDetail(employeeInfo.phone) },
    { name: "Email:", detail: formatDetail(employeeInfo.email) },
   { name: "Date Of Birth(BS):", detail: `${employeeInfo.dobBS ? employeeInfo.dobBS.split('T')[0] : ''} B.S` },
    // {
    //   name: "Date Of Birth(AD):",
    //   detail: formatDetail(
    //     new Date(employeeInfo.dobAD).toLocaleDateString() || ""
    //   ),
    // },
    {
      name: "Citizenship No:",
      detail: formatDetail(employeeInfo.citizenshipNo),
    },
  ];
  const workDetails = [
    {
      name: "Employee Type:",
      detail: capitaliseFirstLetter(workInfo.employeeType) || "Teaching",
    },
    { name: "Post:", detail: empPost },
    { name: "Position:", detail: formatDetail(workInfo.position) },
    {
      name: "Joining Type:",
      detail: capitaliseFirstLetter(workInfo.joiningType),
    },
    {
      name: "Joining Date:",
        detail: workInfo.joiningDate ? workInfo.joiningDate.split('T')[0] : '',
    },
    employeeType === "teaching" && {
      name: "Teaching Faculty:",
      detail: workInfo.teachingFacultyName,
    },
  ];

  const bankDetails = [
    { name: "Bank Name:", detail: bankInfo.bankName },
    { name: "Bank A/C:", detail: formatDetail(bankInfo.bankAc) },
    { name: "Branch:", detail: formatDetail(bankInfo.bankBranch) },
    { name: "panNo:", detail: formatDetail(bankInfo.panNo) },
  ];

  const academicDetails = [
    { name: "Faculty:", detail: formatDetail(academyInfo.faculty) },
    { name: "Level:", detail: formatDetail(academyInfo.level) },
    {
      name: "Institution Name:",
      detail: formatDetail(academyInfo.graduatedfrom),
    },
    {
      name: "Graduated From:",
      detail: formatDetail(academyInfo.graduatedfrom),
    },
    { name: "Enrolled Year:", detail: formatDetail(academyInfo.enrolledYear) },
    { name: "Passed Year:", detail: formatDetail(academyInfo.passedYear) },
  ];

  return (
    <>
      {loading ? (
        <LoadingOverlay
          visible={loading}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ color: "#1976d2", type: "bars" }}
        />
      ) : (
        <>
           {/* FIXED Employee Details WIDTH */}
          <Grid item xs={12} mt="1rem">
            <Box
              width="100%"
              border="1px solid #8c8d90"
              borderRadius="10px"
              position="relative"
              paddingBottom="15px"
            >
              <Typography
                Typography
                border="1px solid #c2c2c2"
                borderRadius="10px"
                fontSize="14px"
                display="inline-block"
                bgcolor="white"
                padding="0 5px"
                position="relative"
                left="20px"
                bottom="14px"
              >
                Employee Details
              </Typography>
              {profileURL && (
                <Box paddingLeft="2rem">
                  <img
                    src={profileURL}
                    alt="University Logo"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              <Grid
                marginTop="10px"
                container
                paddingLeft="1rem"
                justifyContent="flex-start"
              >
                {employeeDetails.map((details, index) => (
                  <Grid item xs={3} key={index}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ width: "100%", mb: 1 }}
                    >
                      <Typography
                        variant="body2"
                        fontSize="14px"
                        color="text.secondary"
                      >
                        {details.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontSize="12px"
                        color="#2B6EB5"
                      >
                        {details.detail}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
              <Stack paddingLeft="1rem" direction="column">
                <Typography variant="body2" fontSize="12px" color="#2B6EB5">
                  <span style={{ color: "#6b6b6b", fontSize: "14px" }}>
                    Permanent Address :{" "}
                  </span>
                  {employeeAddress.pProvince}, {employeeAddress.pDistrict},{" "}
                  {employeeAddress.pLocalLevel} -{" "}
                  {employeeAddress.pWardNo || ""}
                </Typography>
                {employeeAddress.isSameAsPermament ? (
                    <Typography variant="body2" fontSize="12px" color="#2B6EB5">
                      <span style={{ color: "#6b6b6b", fontSize: "14px" }}>
                        Current Address :{" "}
                      </span>
                      {employeeAddress.isSameAsPermament 
                      ? `${employeeAddress.pProvince}, ${employeeAddress.pDistrict}, ${employeeAddress.pLocalLevel} - ${employeeAddress.pWardNo || ""}`
                      : `${employeeAddress.tProvince}, ${employeeAddress.tDistrict}, ${employeeAddress.tLocalLevel} - ${employeeAddress.tWardNo}`}
                    </Typography>
                  ) : (
                  <Typography variant="body2" fontSize="12px" color="#2B6EB5">
                    <span style={{ color: "#6b6b6b", fontSize: "14px" }}>
                      Current Address :{" "}
                    </span>
                    {employeeAddress.tProvince}, {employeeAddress.tDistrict},{" "}
                    {employeeAddress.tLocalLevel} - {employeeAddress.tWardNo}
                  </Typography>)}
              </Stack>
            </Box>
          </Grid>
          <Grid mt="1.5rem" item xs={12} md={12}>
            <Box
              border="1px solid #8c8d90"
              borderRadius="10px"
              position="relative"
              paddingBottom="15px"
            >
              <Typography
                border="1px solid #c2c2c2"
                borderRadius="10px"
                fontSize="14px"
                display="inline-block"
                bgcolor="white"
                padding="0 5px"
                position="relative"
                left="20px"
                bottom="14px"
              >
                Work Info
              </Typography>
              <Grid container paddingLeft="1rem" justifyContent="flex-start">
                {workDetails.map((details, index) => (
                  <Grid item xs={3} key={index}>
                    <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                      <Typography
                        variant="body2"
                        fontSize="14px"
                        color="text.secondary"
                      >
                        {details.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontSize="12px"
                        color="#2B6EB5"
                      >
                        {details.detail}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid mt="1.5rem" item xs={12} md={12}>
            <Box
              border="1px solid #8c8d90"
              borderRadius="10px"
              position="relative"
              paddingBottom="15px"
            >
              <Typography
                border="1px solid #c2c2c2"
                borderRadius="10px"
                fontSize="14px"
                display="inline-block"
                bgcolor="white"
                padding="0 5px"
                position="relative"
                left="20px"
                bottom="14px"
              >
                Academic Info
              </Typography>
              <Grid container paddingLeft="1rem" justifyContent="flex-start">
                {academicDetails.map((details, index) => (
                  <Grid item xs={3} key={index}>
                    <Stack direction="row" spacing={1}>
                      <Typography
                        variant="body2"
                        fontSize="14px"
                        color="text.secondary"
                      >
                        {details.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontSize="12px"
                        color="#2B6EB5"
                      >
                        {details.detail}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid mt="1.5rem" item xs={12} md={12}>
            <Box
              border="1px solid #8c8d90"
              borderRadius="10px"
              position="relative"
              paddingBottom="15px"
            >
              <Typography
                border="1px solid #c2c2c2"
                borderRadius="10px"
                fontSize="14px"
                display="inline-block"
                bgcolor="white"
                padding="0 5px"
                position="relative"
                left="20px"
                bottom="14px"
              >
                Bank Info
              </Typography>
              <Grid container paddingLeft="1rem" justifyContent="flex-start">
                {bankDetails.map((details, index) => (
                  <Grid item xs={3} key={index}>
                    <Stack direction="row" spacing={1}>
                      <Typography
                        variant="body2"
                        fontSize="14px"
                        color="text.secondary"
                      >
                        {details.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontSize="12px"
                        color="#2B6EB5"
                      >
                        {details.detail}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </>
      )}
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button
          onClick={handleBack}
          variant="outlined"
          color="error"
          type="reset"
          size="small"
          startIcon={<ChevronLeftRoundedIcon />}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          size="small"
          type="submit"
          sx={{
            marginLeft: "10px",
          }}
          onClick={handleRegister}
          endIcon={
            loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <ChevronRightRoundedIcon />
            )
          }
        >
          {loading ? "Submitting..." : "Register"}
        </Button>
      </Box>
    </>
  );
};

export default DetailsReview;
