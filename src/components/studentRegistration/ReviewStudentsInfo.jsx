import { useContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, capitalize, CircularProgress } from "@mui/material";
import { StudentAddressContext } from "./StudentAddressInfo";
import { StudentInfoContext } from "./StudentGeneralInfo";
import { StudentGuardianContext } from "./StudentGuardianInfo";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { StudentRegContext } from "./StudentRegstration";
import axios from "axios";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import { capitaliseFirstLetter, getAuthConfigSafe } from "../../utils/dateUtils";
import {
  getBatchById,
  getFacultyByFacultyId,
  getLevelById,
  getProgramById,
} from "../../services/services";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { config } from '@config';

const ReviewDetails = ({ handleBack }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const navigate = useNavigate()
  const [AcademicDetails, setAcademicDetails] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const universityId = currentUser.institution.universityId;
  const campusId = currentUser.institution.id;
  const formatDetail = (detail) => {
    if (detail === null || detail === undefined) return "N/A";
    if (typeof detail === "object") return JSON.stringify(detail);
    return detail.toString();
  };
  const { studentInfo, getLogoURL } = useContext(StudentInfoContext);
  const { studentAddress } = useContext(StudentAddressContext);
  const { guardianInfo } = useContext(StudentGuardianContext);
  const { registrationInfo } = useContext(StudentRegContext);
  useEffect(() => {
    const fetchAcademicDetails = async () => {
      try {
        const FacultyRsponse = await getFacultyByFacultyId(
          registrationInfo.facultyId
        );
        const LevelRespose = await getLevelById(registrationInfo.levelId);
        const programResponse = await getProgramById(
          registrationInfo.programId
        );
        const batchResponse = await getBatchById(
          registrationInfo.admissionYear
        );
        setAcademicDetails((prevDetails) => ({
          ...prevDetails,
          facultyName: FacultyRsponse.facultyName,
          levelName: LevelRespose.levelName,
          programName: programResponse.programName,
          admissionBatch: batchResponse.batchNepali,
        }));
      } catch (error) { }
    };
    if (registrationInfo) {
      fetchAcademicDetails();
    }
  }, [registrationInfo]);
  const handleRegister = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("campusId", campusId || 0);
    formData.append("universityId", universityId || 0);
    formData.append("nepaliName", studentInfo.nepaliName || "");
    formData.append("firstName", studentInfo.firstName?.toUpperCase());
    formData.append("middleName", studentInfo.middleName?.toUpperCase() || "");
    formData.append("lastName", studentInfo.lastName?.toUpperCase());
    formData.append("phoneNumber", studentInfo.phone);
    formData.append(
      "doBBS",
      studentInfo.dobBs
    );
    formData.append(
      "doBAD",
      studentInfo?.dobAd
    );
    formData.append("gender", studentInfo.gender);
    formData.append("ethnicity", studentInfo.ethnicity);
    formData.append("nationality", studentInfo.nationality);
    formData.append("disabilityStatus", studentInfo.disabilityStatus);
    formData.append("edg", studentInfo.edg);
    formData.append("religion", studentInfo.religion);
    formData.append("isMuktaKamaiya", studentInfo.isMuktaKamaiya);
    formData.append("isFromMartyrFamily", studentInfo.isFromMartyrFamily);
    formData.append("disabilityType", studentInfo.disabilityType || "");
    formData.append("email", studentInfo.email);
    formData.append("citizenshipNo", studentInfo.citizenshipNo);
    formData.append("nidNo", studentInfo.nidNo || "");
    formData.append("citizenIssueDist", studentInfo.issuedDist);
    formData.append("citizenshipFrontFile", studentInfo.citizenFront || "");
    formData.append("citizenshipBackFile", studentInfo.citizenBack);
    formData.append("digitalSignature", studentInfo.digitalSignature);
    formData.append("nidPicFile", studentInfo.nidPic);
    formData.append("levelId", registrationInfo.levelId);
    formData.append("majorSubjectId", registrationInfo.majorSubjectId);
    formData.append("facultyId", registrationInfo.facultyId);
    formData.append("programId", registrationInfo.programId);
    formData.append("admissionYearId", registrationInfo.admissionYear);
    formData.append("complitionYear", registrationInfo.completionYear);
    formData.append("dateOfEnrollment", registrationInfo.dateOfEnrollment);
    formData.append("ppSizePhotoFile", studentInfo.ppSizePhoto);
    formData.append("programFee", registrationInfo.programFee);
    formData.append("paidAmount", registrationInfo.paidAmount);
    formData.append("hasScolorship", registrationInfo.haveScholarship);
    formData.append("entranceSymbol", registrationInfo.entranceSymbol);
    formData.append("entranceScore", registrationInfo.entranceScore);
    formData.append("entranceSymbol", registrationInfo.scholarshipAmount);
    formData.append("receiptImage", registrationInfo.receipt);
    formData.append("fiscalYearId", registrationInfo.fiscalYearId);
    formData.append("rollNoManual", registrationInfo.rollNoManual);
    formData.append("universityRegdNo", registrationInfo.universityRegdNo);
    formData.append("isRollNoManual", true);
    formData.append("isRegNoManual", true);
    // Permanent Address
    formData.append("pProvince", studentAddress.pProvince);
    formData.append("pDistrict", studentAddress.pDistrict);
    formData.append("pLocalLevel", studentAddress.pLocalLevel);
    formData.append("pWardNo", studentAddress.pWardNo);
    formData.append("pBlockNo", 0);
    formData.append("pHouseNo", studentAddress.pHouseNo);
    formData.append("pLocality", studentAddress.pTole);
    formData.append("isSameAsPermanent", studentAddress.isSameAsPermament);
    // Conditional Temporary Address
    if (studentAddress.isSameAsPermament) {
      formData.append("tProvince", studentAddress.pProvince);
      formData.append("tDistrict", studentAddress.pDistrict);
      formData.append("tLocalLevel", studentAddress.pLocalLevel);
      formData.append("tWardNo", studentAddress.pWardNo);
      formData.append("tBlockNo", 0);
      formData.append("tHouseNo", studentAddress.pHouseNo);
      formData.append("tLocality", studentAddress.pTole);
    } else {
      formData.append("tProvince", studentAddress.tProvince);
      formData.append("tDistrict", studentAddress.tDistrict);
      formData.append("tLocalLevel", studentAddress.tLocalLevel);
      formData.append("tWardNo", studentAddress.tWardNo);
      formData.append("tBlockNo", 0);
      formData.append("tHouseNo", studentAddress.tHouseNo);
      formData.append("tLocality", studentAddress.tTole);
    }
    formData.append("fatherName", guardianInfo.fatherName || "");
    formData.append("fOccupation", guardianInfo.fatherOccupation || "");
    formData.append("fatherPhoneNo", guardianInfo.fatherPhoneNo || "");
    formData.append("fatherEmail", guardianInfo.fatherEmail || "");
    formData.append("motherName", guardianInfo.motherName || "");
    formData.append("mOccupation", guardianInfo.motherOccupation || "");
    formData.append("motherPhoneNo", guardianInfo.motherPhoneNo || "");
    formData.append("motherEmail", guardianInfo.motherEmail || "");
    formData.append("guardianName", guardianInfo.guardianName || "");
    formData.append("gOccupation", guardianInfo.guardianOccupation || "");
    formData.append("guardianPhone", guardianInfo.guardianPhone || "");
    formData.append("gAddress", guardianInfo.address || "");
    formData.append("gEmail", guardianInfo.guardianEmail || "");
    try {
      const config = getAuthConfigSafe()
      const response = await axios.post(
        `${backendUrl}/Student/Create`,
        formData,
        config
      );
      const id = response.data.id;
      toast.success("Student added successfully", {
        autoClose: 1500,
      });
      navigate('/student-management/verified-students')
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("Student already exists!", {
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
  };
  const StudentGeneralInfo = studentInfo
    ? [
      { name: "Full Name (देबनगरी)", detail: studentInfo.nepaliName },
      {
        name: "Full Name (English):",
        detail: `${studentInfo.firstName.toUpperCase()} ${studentInfo.middleName.toUpperCase()} ${studentInfo.lastName.toUpperCase()}`,
      },
      {
        name: "Date Of Birth (BS):",
        detail: studentInfo.dobBs
          ? studentInfo.dobBs.split("T")[0]
          : "N/A",
      },
      { name: "Phone Number:", detail: studentInfo.phone },
      { name: "Email:", detail: studentInfo.email },
      {
        name: "Date Of Birth (AD):",
        detail: formatDetail(
          (studentInfo.dobAd)
        ),
      },
      { name: "Gender:", detail: capitaliseFirstLetter(studentInfo.gender) },
      { name: "Ethnicity:", detail: studentInfo.ethnicity },
      {
        name: "Nationality:",
        detail: capitaliseFirstLetter(studentInfo.nationality),
      },
      {
        name: "Disability Status:",
        detail: capitalize(studentInfo.disabilityStatus),
      },
      { name: "Disability Type:", detail: studentInfo.disabilityType || "-" },
      { name: "Citizenship No:", detail: studentInfo.citizenshipNo },
      { name: "Guardian Name:", detail: guardianInfo.guardianName },
      { name: "Guardian contact:", detail: guardianInfo.guardianPhone },
      { name: "Belong To EDG? ", detail: studentInfo.edg ? "Yes" : "No" },
      {
        name: "Is Mukta Kamaiya ?",
        detail: studentInfo.isMuktaKamaiya ? "Yes" : "No",
      },
      {
        name: "Is from martyr/conflict affected family ?",
        detail: studentInfo.isFromMartyrFamily ? "Yes" : "No",
      },
    ]
    : [];

  const registrationInfoStudent = registrationInfo
    ? [
      { name: "Level:", detail: AcademicDetails.levelName },
      { name: "Faculty:", detail: AcademicDetails.facultyName },
      { name: "Program:", detail: AcademicDetails.programName },
      { name: "Admission year:", detail: AcademicDetails.admissionBatch },
      {
        name: "Date of enrollment:",
        detail: registrationInfo.dateOfEnrollment,
      },
      { name: "Entrance score:", detail: registrationInfo.entranceScore },
      { name: "Entrance symbol:", detail: registrationInfo.entranceSymbol },
    ]
    : [];
  const profileURL = getLogoURL();
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
          <Grid mt="1rem" container spacing={1}>
            <Grid item xs={12} md={12}>
              <Box
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
                  Student's General Detail
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
                  paddingLeft="2rem"
                  justifyContent="flex-start"
                >
                  {StudentGeneralInfo.map((details, index) => (
                    <Grid item xs={4} key={index} sx={{ mb: 1 }}>
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
                <Stack paddingLeft="2rem" direction="column">
                  <Typography variant="body2" fontSize="12px" color="#2B6EB5">
                    <span style={{ color: "#6b6b6b", fontSize: "14px" }}>
                      Permanent Address :{" "}
                    </span>
                    {studentAddress.pProvince}, {studentAddress.pDistrict},{" "}
                    {studentAddress.pLocalLevel} -{" "}
                    {studentAddress.pWardNo || ""}
                  </Typography>
                   {studentAddress.isSameAsPermament ? (
                    <Typography variant="body2" fontSize="12px" color="#2B6EB5">
                      <span style={{ color: "#6b6b6b", fontSize: "14px" }}>
                        Current Address :{" "}
                      </span>
                      {studentAddress.isSameAsPermament 
                      ? `${studentAddress.pProvince}, ${studentAddress.pDistrict}, ${studentAddress.pLocalLevel} - ${studentAddress.pWardNo || ""}`
                      : `${studentAddress.tProvince}, ${studentAddress.tDistrict}, ${studentAddress.tLocalLevel} - ${studentAddress.tWardNo}`}
                    </Typography>
                  ) : (
                  <Typography variant="body2" fontSize="12px" color="#2B6EB5">
                    <span style={{ color: "#6b6b6b", fontSize: "14px" }}>
                      Current Address :{" "}
                    </span>
                    {studentAddress.tProvince}, {studentAddress.tDistrict},{" "}
                    {studentAddress.tLocalLevel} - {studentAddress.tWardNo}
                  </Typography>)}
                </Stack>
              </Box>
            </Grid>
            <Grid mt="1rem" item xs={12} md={12}>
              <Box
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
                  Student's Academic info
                </Typography>
                <Grid
                  marginTop="10px"
                  container
                  paddingLeft="2rem"
                  justifyContent="flex-start"
                >
                  {registrationInfoStudent.map((details, index) => (
                    <Grid item xs={4} key={index}>
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
          </Grid>

          <Box mt={4} display="flex" justifyContent="flex-start">
            <Button
              onClick={handleBack}
              color="error"
              variant="outlined"
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
                position: "relative",
                pointerEvents: loading ? "none" : "auto",
                opacity: loading ? 0.6 : 1,
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
              {loading ? "Submitting..." : "Submit & Next"}
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default ReviewDetails;
