import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, CircularProgress } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { EditStudentInfoContext } from "./EditGeneralInfo";
import { EditStudentAddressContext } from "./EditStudentAddressInfo";
import { EditStudentGuardianContext } from "./EditGuardianInfo";
import { EditStudentRegContext } from "./EditStudentRegistration";
import { LoadingOverlay } from "@mantine/core";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  getBatchById,
  getFacultyByFacultyId,
  getLevelById,
  getProgramById,
} from "../../../services/services";
import { capitaliseFirstLetter, getAuthConfigSafe } from "../../../utils/dateUtils";
import toast from "react-hot-toast";
import { config } from '@config';

const EditReviewDetails = ({
  handleBack,
  id,
  handleEditDialogClose,
  isTransferredIn,
  onUpdate,
}) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [AcademicDetails, setAcademicDetails] = useState({});
  const { editStudentInfo } = useContext(EditStudentInfoContext);
  const { editStudentAddress } = useContext(EditStudentAddressContext);
  const { editGuardianInfo } = useContext(EditStudentGuardianContext);
  const [loading, setLoading] = useState(false);
  const { editRegistrationInfo } = useContext(EditStudentRegContext);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchAcademicDetails = async () => {
      try {
        const facultyResponse = await getFacultyByFacultyId(
          editRegistrationInfo.facultyId
        );
        const levelResponse = await getLevelById(editRegistrationInfo.levelId);
        const admissionResponse = await getBatchById(
          editRegistrationInfo.admissionYearId
        );
        const programResponse = await getProgramById(
          editRegistrationInfo.programId
        );
        setAcademicDetails((prevDetails) => ({
          ...prevDetails,
          admissionYear: admissionResponse.batchNepali,
          facultyName: facultyResponse.facultyName,
          levelName: levelResponse.levelName,
          programName: programResponse.programName,
        }));
      } catch (error) {
        console.error("Error fetching academic details:", error);
      }
    };
    if (editRegistrationInfo) {
      fetchAcademicDetails();
    }
  }, [editRegistrationInfo]);

  let universityId;
  let campusId;

  if (currentUser.type === "Uni") {
    universityId = currentUser.institution.id;
  } else if (currentUser.type === "college") {
    campusId = currentUser.institution.id;
  }
  // const handleRegister = () => {
  //   setLoading(true);
  //   setTimeout(async () => {
  //     const formData = new FormData();
  //     formData.append("id", id);
  //     formData.append("campusId", campusId || 0);
  //     formData.append("universityId", universityId || 0);

  //     formData.append("citizenIssueDist", editStudentInfo.citizenIssueDist);
  //     formData.append("nidNo", editStudentInfo.nidNo);
  //     formData.append("nepaliName", editStudentInfo.nepaliName);
  //     formData.append("firstName", editStudentInfo.firstName.toUpperCase());
  //     formData.append("middleName", editStudentInfo.middleName?.toUpperCase() || "");
  //     formData.append("lastName", editStudentInfo.lastName.toUpperCase());
  //     formData.append("ppSizePhoto", editStudentInfo.ppSizePhoto);
  //     formData.append("phoneNumber", editStudentInfo.phone);
  //     formData.append("doBBS", editStudentInfo.doBBS);
  //     formData.append("doBAD", editStudentInfo.doBAD);
  //     formData.append("gender", editStudentInfo.gender);
  //     formData.append("ethnicity", editStudentInfo.ethnicity);
  //     formData.append("nationality", editStudentInfo.nationality);
  //     formData.append("disabilityStatus", editStudentInfo.disabilityStatus);
  //     formData.append("disabilityType", editStudentInfo.disabilityType || "");
  //     formData.append("email", editStudentInfo.email);
  //     formData.append("religion", editStudentInfo.religion);
  //     formData.append("citizenshipNo", editStudentInfo.citizenshipNo || "");
  //     formData.append("isMuktaKamaiya", editStudentInfo.isMuktaKamaiya);
  //     formData.append("isFromMartyrFamily", editStudentInfo.isFromMartyrFamily);
  //     formData.append("edg", editStudentInfo.edg);

  //     // Address Info
  //     formData.append("pProvince", editStudentAddress.pProvince);
  //     formData.append("pDistrict", editStudentAddress.pDistrict);
  //     formData.append("pLocalLevel", editStudentAddress.pLocalLevel);
  //     formData.append("pWardNo", editStudentAddress.pWardNo);
  //     formData.append("pBlockNo", 0);
  //     formData.append("pHouseNo", editStudentAddress.pHouseNo);
  //     formData.append("pLocality", editStudentAddress.pTole || "");

  //     if (editStudentAddress.isSameAsPermament) {
  //       formData.append("tProvince", editStudentAddress.pProvince);
  //       formData.append("tDistrict", editStudentAddress.pDistrict);
  //       formData.append("tLocalLevel", editStudentAddress.pLocalLevel);
  //       formData.append("tWardNo", editStudentAddress.pWardNo);
  //       formData.append("tBlockNo", 0);
  //       formData.append("tHouseNo", editStudentAddress.pHouseNo);
  //       formData.append("tLocality", editStudentAddress.pTole || "");
  //     } else {
  //       formData.append("tProvince", editStudentAddress.tProvince);
  //       formData.append("tDistrict", editStudentAddress.tDistrict);
  //       formData.append("tLocalLevel", editStudentAddress.tLocalLevel);
  //       formData.append("tWardNo", editStudentAddress.tWardNo);
  //       formData.append("tBlockNo", 0);
  //       formData.append("tHouseNo", editStudentAddress.tHouseNo);
  //       formData.append("tLocality", editStudentAddress.tTole || "");
  //     }

  //     // Guardian Info
  //     formData.append("fatherName", editGuardianInfo.fatherName);
  //     formData.append("fOccupation", editGuardianInfo.fatherOccupation);
  //     formData.append("fatherPhoneNo", editGuardianInfo.fatherPhoneNo);
  //     formData.append("fatherEmail", editGuardianInfo.fatherEmail);
  //     formData.append("motherName", editGuardianInfo.motherName);
  //     formData.append("mOccupation", editGuardianInfo.motherOccupation);
  //     formData.append("motherPhoneNo", editGuardianInfo.motherPhoneNo);
  //     formData.append("motherEmail", editGuardianInfo.motherEmail);
  //     formData.append("guardianName", editGuardianInfo.guardianName);
  //     formData.append("guardianOccupation", editGuardianInfo.guardianOccupation);
  //     formData.append("guardianPhone", editGuardianInfo.guardianPhone);
  //     formData.append("gAddress", editGuardianInfo.address);
  //     formData.append("gEmail", editGuardianInfo.guardianEmail);

  //     // Academic Info
  //     formData.append("levelId", editRegistrationInfo.levelId);
  //     formData.append("facultyId", editRegistrationInfo.facultyId);
  //     formData.append("programId", editRegistrationInfo.programId);
  //     formData.append("majorSubjectId", editRegistrationInfo.majorSubjectId);
  //     formData.append("admissionYearId", editRegistrationInfo.admissionYearId);

  //     formData.append("complitionYear", editRegistrationInfo.complitionYear);
  //     formData.append("rollNoManual", editRegistrationInfo.rollNoManual);
  //     formData.append("universityRegdNo", editRegistrationInfo.universityRegdNo || "");
  //     formData.append("isRollNoManual", true);
  //     formData.append("isRegdNoManual", true);
  //     formData.append("fiscalYearId", editRegistrationInfo.fiscalYearId);
  //     formData.append("dateOfEnrollment", editRegistrationInfo.dateOfEnrollment);

  //     if (isTransferredIn === true) {
  //       formData.append("isTransferredIn", true);
  //       formData.append("transferredFrom", editRegistrationInfo.transferredFrom || "");
  //       formData.append("transferStatus", true);
  //       formData.append("transferredDate", editRegistrationInfo.transferredDate || "");
  //       formData.append("year", editRegistrationInfo.year);
  //       formData.append("semester", editRegistrationInfo.semester);
  //       formData.append("programType", editRegistrationInfo.programType);
  //       if (editRegistrationInfo.transferDoc) {
  //         formData.append("transferDoc", editRegistrationInfo.transferDoc);
  //       }
  //     } else {
  //       formData.append("isTransferredIn", false);
  //       formData.append("transferStatus", false);
  //     }

  //     try {
  //       const config = getAuthConfigSafe()
  //       const response = await axios.patch(`${backendUrl}/Student/${id}`, formData, config);
  //       if (response.status === 200) {
  //         toast.success("Student updated successfully!");
  //         handleEditDialogClose();
  //         onUpdate();
  //       } else {
  //         throw new Error("Failed to update student");
  //       }
  //     } catch (err) {
  //       if (err.response && err.response.status === 409) {
  //         toast.error("Student already exists!", { autoClose: 2000 });
  //       } else {
  //         console.error(err);
  //         toast.error("Failed to update student!", { autoClose: 2000 });
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, 1600);
  // };
  const handleRegister = () => {
    setLoading(true);
    setTimeout(async () => {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("campusId", campusId || 0);
      formData.append("universityId", universityId || 0);

      formData.append("citizenIssueDist", editStudentInfo.citizenIssueDist);
      formData.append("nidNo", editStudentInfo.nidNo);
      formData.append("nepaliName", editStudentInfo.nepaliName);
      formData.append("firstName", editStudentInfo.firstName.toUpperCase());
      formData.append("middleName", editStudentInfo.middleName?.toUpperCase() || "");
      formData.append("lastName", editStudentInfo.lastName.toUpperCase());
      formData.append("ppSizePhoto", editStudentInfo.ppSizePhoto);
      formData.append("phoneNumber", editStudentInfo.phone);
      formData.append("doBBS", editStudentInfo.doBBS);
      formData.append("doBAD", editStudentInfo.doBAD);
      formData.append("gender", editStudentInfo.gender);
      formData.append("ethnicity", editStudentInfo.ethnicity);
      formData.append("nationality", editStudentInfo.nationality);
      formData.append("disabilityStatus", editStudentInfo.disabilityStatus);
      formData.append("disabilityType", editStudentInfo.disabilityType || "");
      formData.append("email", editStudentInfo.email);
      formData.append("religion", editStudentInfo.religion);
      formData.append("citizenshipNo", editStudentInfo.citizenshipNo || "");
      formData.append("isMuktaKamaiya", editStudentInfo.isMuktaKamaiya);
      formData.append("isFromMartyrFamily", editStudentInfo.isFromMartyrFamily);
      formData.append("edg", editStudentInfo.edg);

      // Address Info
      formData.append("pProvince", editStudentAddress.pProvince);
      formData.append("pDistrict", editStudentAddress.pDistrict);
      formData.append("pLocalLevel", editStudentAddress.pLocalLevel);
      formData.append("pWardNo", editStudentAddress.pWardNo);
      formData.append("pBlockNo", 0);
      formData.append("pHouseNo", editStudentAddress.pHouseNo);
      formData.append("pLocality", editStudentAddress.pTole || "");

      if (editStudentAddress.isSameAsPermament) {
        formData.append("tProvince", editStudentAddress.pProvince);
        formData.append("tDistrict", editStudentAddress.pDistrict);
        formData.append("tLocalLevel", editStudentAddress.pLocalLevel);
        formData.append("tWardNo", editStudentAddress.pWardNo);
        formData.append("tBlockNo", 0);
        formData.append("tHouseNo", editStudentAddress.pHouseNo);
        formData.append("tLocality", editStudentAddress.pTole || "");
      } else {
        formData.append("tProvince", editStudentAddress.tProvince);
        formData.append("tDistrict", editStudentAddress.tDistrict);
        formData.append("tLocalLevel", editStudentAddress.tLocalLevel);
        formData.append("tWardNo", editStudentAddress.tWardNo);
        formData.append("tBlockNo", 0);
        formData.append("tHouseNo", editStudentAddress.tHouseNo);
        formData.append("tLocality", editStudentAddress.tTole || "");
      }

      // Guardian Info
      formData.append("fatherName", editGuardianInfo.fatherName);
      formData.append("fOccupation", editGuardianInfo.fatherOccupation);
      formData.append("fatherPhoneNo", editGuardianInfo.fatherPhoneNo);
      formData.append("fatherEmail", editGuardianInfo.fatherEmail);
      formData.append("motherName", editGuardianInfo.motherName);
      formData.append("mOccupation", editGuardianInfo.motherOccupation);
      formData.append("motherPhoneNo", editGuardianInfo.motherPhoneNo);
      formData.append("motherEmail", editGuardianInfo.motherEmail);
      formData.append("guardianName", editGuardianInfo.guardianName);
      formData.append("guardianOccupation", editGuardianInfo.guardianOccupation);
      formData.append("guardianPhone", editGuardianInfo.guardianPhone);
      formData.append("gAddress", editGuardianInfo.address);
      formData.append("gEmail", editGuardianInfo.guardianEmail);

      // Academic Info
      formData.append("levelId", editRegistrationInfo.levelId);
      formData.append("facultyId", editRegistrationInfo.facultyId);
      formData.append("programId", editRegistrationInfo.programId);
      formData.append("majorSubjectId", editRegistrationInfo.majorSubjectId);
      formData.append("admissionYearId", editRegistrationInfo.admissionYearId);

      formData.append("complitionYear", editRegistrationInfo.complitionYear);
      formData.append("rollNoManual", editRegistrationInfo.rollNoManual);
      formData.append("universityRegdNo", editRegistrationInfo.universityRegdNo || "");
      formData.append("isRollNoManual", true);
      formData.append("isRegdNoManual", true);
      formData.append("fiscalYearId", editRegistrationInfo.fiscalYearId);
      formData.append("dateOfEnrollment", editRegistrationInfo.dateOfEnrollment);

      if (isTransferredIn === true) {
        formData.append("isTransferredIn", true);
        formData.append("transferredFrom", editRegistrationInfo.transferredFrom || "");
        formData.append("transferStatus", true);
        formData.append("transferredDate", editRegistrationInfo.transferredDate || "");
        formData.append("year", editRegistrationInfo.year);
        formData.append("semester", editRegistrationInfo.semester);
        formData.append("programType", editRegistrationInfo.programType);
        if (editRegistrationInfo.transferDoc) {
          formData.append("transferDoc", editRegistrationInfo.transferDoc);
        }
      } else {
        formData.append("isTransferredIn", false);
        formData.append("transferStatus", false);
      }

      try {
        const config = getAuthConfigSafe();

        const apiEndpoint = isTransferredIn === true
          ? `${backendUrl}/Student/UpdateTransferredStudent/${id}`
          : `${backendUrl}/Student/${id}`;

        const response = await axios.patch(apiEndpoint, formData, config);

        if (response.status === 200) {
          toast.success("Student updated successfully!");
          handleEditDialogClose();
          onUpdate();
        } else {
          throw new Error("Failed to update student");
        }
      } catch (err) {
        if (err.response && err.response.status === 409) {
          toast.error("Student already exists!", { autoClose: 2000 });
        } else {
          console.error(err);
          toast.error("Failed to update student!", { autoClose: 2000 });
        }
      } finally {
        setLoading(false);
      }
    }, 1600);
  };
  const StudentGeneralInfo = editStudentInfo
    ? [
      {
        name: "विद्यार्थीको पुरा नाम देबनगरीमा:",
        detail: editStudentInfo.nepaliName,
      },
      { name: "First Name:", detail: editStudentInfo.firstName },
      { name: "Middle Name:", detail: editStudentInfo.middleName },
      { name: "Last Name:", detail: editStudentInfo.lastName },
      {
        name: "Date Of Birth(BS):",
        detail: editStudentInfo.doBBS
          ? editStudentInfo.doBBS.split("T")[0] // removes time
          : "-"
      },

      { name: "Phone Number:", detail: editStudentInfo.phone },
      { name: "Email:", detail: editStudentInfo.email },

      {
        name: "Gender:",
        detail: capitaliseFirstLetter(editStudentInfo.gender),
      },
      {
        name: "Ethnicity:",
        detail: capitaliseFirstLetter(editStudentInfo.ethnicity),
      },
      {
        name: "Nationality:",
        detail: capitaliseFirstLetter(editStudentInfo.nationality),
      },
      {
        name: "Disability Status:",
        detail: capitaliseFirstLetter(editStudentInfo.disabilityStatus),
      },
      {
        name: "Disability Type:",
        detail: capitaliseFirstLetter(editStudentInfo.disabilityType),
      },
      { name: "Citizenship No:", detail: editStudentInfo.citizenshipNo },
      {
        name: "Citizenship issued District:",
        detail: editStudentInfo.citizenIssueDist,
      },
      {
        name: "Guardian Name:",
        detail: capitaliseFirstLetter(editGuardianInfo.guardianName),
      },
      {
        name: "Guardian Contact No.",
        detail: editGuardianInfo.guardianPhone,
      },
    ]
    : [];

  const AcademicInfo = editStudentInfo
    ? [
      { name: "Program:", detail: AcademicDetails.programName },
      { name: "Faculty:", detail: AcademicDetails.facultyName },
      { name: "Level:", detail: AcademicDetails.levelName },
      { name: "Admission Year:", detail: AcademicDetails.admissionYear },
      {
        name: "Enrollment Date:",
        detail: editRegistrationInfo.dateOfEnrollment,
      },
    ]
    : [];

  return (
    <>
      {loading ? (
        <>
          <LoadingOverlay
            visible={loading}
            zIndex={100}
            overlayProps={{ radius: "sm", blur: 1 }}
            loaderProps={{ color: "#1976d2", type: "bars" }}
          />
        </>
      ) : (
        <>
          <Grid container spacing={0.5}>
            <Grid item xs={12} md={12}>
              <Box
                border="1px solid #c2c2c2"
                padding="0px"
                borderRadius="10px"
                position="relative"
                paddingBottom="5px"
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
                  General Details
                </Typography>
                <Grid
                  marginTop="-15px"
                  container
                  paddingLeft="1rem"
                  justifyContent="flex-start"
                >
                  {StudentGeneralInfo.map((details, index) => (
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
                        <Typography fontSize="12px" color="#2B6EB5">
                          {details.detail || "-"}
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
                    {editStudentAddress.pProvince},{" "}
                    {editStudentAddress.pDistrict},{" "}
                    {editStudentAddress.pLocalLevel} -{" "}
                    {editStudentAddress.pWardNo || ""}
                  </Typography>
                  <Typography variant="body2" fontSize="12px" color="#2B6EB5">
                    <span style={{ color: "#6b6b6b", fontSize: "14px" }}>
                      Current Address :{" "}
                    </span>
                    {editStudentAddress.tProvince},{" "}
                    {editStudentAddress.tDistrict},{" "}
                    {editStudentAddress.tLocalLevel} -{" "}
                    {editStudentAddress.tWardNo}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            <Grid mt="15px" item xs={12} md={12}>
              <Box
                border="1px solid #c2c2c2"
                padding="0px"
                borderRadius="10px"
                position="relative"
                paddingBottom="5px"
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
                  Academic info
                </Typography>
                <Grid
                  marginTop="-15px"
                  container
                  paddingLeft="1rem"
                  justifyContent="flex-start"
                >
                  {AcademicInfo.map((details, index) => (
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
                        <Typography fontSize="12px" color="#2B6EB5">
                          {details.detail || "-"}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Grid display="flex" justifyContent="flex-end" sm={12}>
            <Box mt={1} mb={2} display="flex" justifyContent="space-between">
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
                {loading ? "Submitting..." : "Update & Next"}
              </Button>
            </Box>
          </Grid>
        </>
      )}
    </>
  );
};

export default EditReviewDetails;
