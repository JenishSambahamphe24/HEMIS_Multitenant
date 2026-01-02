import React, { useContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, CircularProgress } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { EditEmployeeInfoContext } from "./EditEmployeeGeneralInfo";
import { EditAddressContext } from "./EditEmployeeAddressGeneralInfo";
import { EditWorkInfoContext } from "./EditWorkInfo";
import { EditAcademyContext } from "./EditAcademyGeneralInfo";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { getEmployeePositionById } from "../../../services/services";
import axios from "axios";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import  { EditBankInfoContext } from "./EditBankInfo";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const EditDetailsReview = ({
  handleBack,
  id,
  handleClose,
  closeDialogAndRefetch,
  handleFetch,
}) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [empPost, setEmpPost] = useState("");
  const { employeeInfo } = useContext(EditEmployeeInfoContext);
  const { employeeAddress } = useContext(EditAddressContext);
  const { workInfo } = useContext(EditWorkInfoContext);
  const { academyInfo } = useContext(EditAcademyContext);
  const { bankInfo } = useContext(EditBankInfoContext);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  let universityId;
  let campusId;

  useEffect(() => {
    const fetchEmpPosition = async () => {
      const response = await getEmployeePositionById(
        workInfo?.employeePositionId
      );
      setEmpPost(response.postName);
    };
    fetchEmpPosition();
  }, [workInfo.employeePositionId]);

  if (currentUser.type === "Uni") {
    universityId = currentUser.institution.id;
  } else if (currentUser.type === "college") {
    campusId = currentUser.institution.id;
  }
  const handleRegister = () => {
    setLoading(true);
    setTimeout(async () => {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("campusId", campusId || 0);
      formData.append("employeeType", employeeInfo.employeeType);
      formData.append("CtzIssueDistrict", employeeInfo.citizenIssueDist);
      formData.append("salutation", employeeInfo.salutation);
      formData.append("firstName", employeeInfo.firstName);
      formData.append("middleName", employeeInfo.middleName);
      formData.append("lastName", employeeInfo.lastName);
      formData.append("phoneNumber", employeeInfo.phone);
      formData.append("email", employeeInfo.email);
      formData.append("gender", employeeInfo.gender);
      formData.append("religion", employeeInfo.religion);
      formData.append("ethnicity", employeeInfo.ethnicity);
      formData.append("citizenshipNo", employeeInfo.citizenshipNo);
      formData.append("maritalStatus", employeeInfo.maritalStatus);
      formData.append("dateOfBirth", employeeInfo.dob);
      formData.append("dateOFBirthAd", employeeInfo.dobAd);
      formData.append("nidNo", employeeInfo.nidNo);
      formData.append("nidPic", "nidPicValue");
      formData.append("citizenshipFront", "citizenshipFrontValue");
      formData.append("citizenshipBack", "citizenshipBackValue");
      formData.append("ppSizePhoto", employeeInfo.ppSizePhoto);
      formData.append("admissionYear", "string");
      formData.append("graduatedfrom", academyInfo.graduatedfrom);
      formData.append("facultyName", academyInfo.facultyName);
      formData.append("levelName", academyInfo.level || academyInfo.levelName);
      formData.append("institutionName", academyInfo.institutionName);
      formData.append("enrolledYear", academyInfo.enrolledYear);
      formData.append("PassedYear", academyInfo.passedYear);
      formData.append("certificateCopy", academyInfo.certificateCopy);
      formData.append("transcriptCopy", academyInfo.transcriptCopy);
      formData.append("marksheetCopy", academyInfo.marksheetCopy);
      formData.append("otherDoc", academyInfo.otherDoc);
      formData.append("pProvince", employeeAddress.pProvince);
      formData.append("pDistrict", employeeAddress.pDistrict);
      formData.append("pLocalLevel", employeeAddress.pLocalLevel);
      formData.append("pWardNo", employeeAddress.pWardNo);
      formData.append("pBlockNo", 0);
      formData.append("pHouseNo", employeeAddress.pHouseNo);
      formData.append("pTole", employeeAddress.pTole);
      formData.append(
        "isSameAsPermanent",
        employeeAddress.isSameAsPermament || true
      );
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
      formData.append("pProvince", employeeAddress.tProvince);
      formData.append("pDistrict", employeeAddress.tDistrict);
      formData.append("tLocalLevel", employeeAddress.tLocalLevel);
      formData.append("tWardNo", employeeAddress.tWardNo);
      formData.append("tBlockNo", 0);
      formData.append("tHouseNo", employeeAddress.tHouseNo);
      formData.append("tTole", employeeAddress.tTole);
      formData.append("employeePositionId", workInfo.employeePositionId);
      formData.append("position", workInfo.position);
      formData.append("employeeType", workInfo.employeeType);
      formData.append("departmentId", workInfo.departmentId);
      formData.append("sectionId", workInfo.sectionId);
      formData.append("joiningType", workInfo.joiningType);
      formData.append("joiningDate", workInfo.joiningdate);
      formData.append("teachingFacultyName", workInfo.teachingFacultyName);
      formData.append("workPhone", workInfo.workphone);
      formData.append("workEmail", workInfo.workemail);
      formData.append("joiningLetter", workInfo.joiningletter);
      formData.append("otherLetter", workInfo.otherletter);
      formData.append("referenceletter", workInfo.reference);
      formData.append("bankName", bankInfo.bankName);
      formData.append("bankAc", bankInfo.bankAc);
      formData.append("bankBranch", bankInfo.bankBranch);
      formData.append("panNo", bankInfo.panNo);

      try {
       const config= getAuthConfigSafe()
        const response = await axios.patch(
          `${backendUrl}/Employee/${id}`,
          formData,
          config
        );
        if (response.status === 200 || response.status === 201) {
          toast.success("Employee data is Successfully Updated", {
            autoClose: 2000,
          });
          handleClose();
        } else {
          throw new Error("Network response was not ok");
        }
        handleFetch();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });
  };
  const formatDetail = (detail) => {
    if (detail === null || detail === undefined) return "N/A";
    if (typeof detail === "object") return JSON.stringify(detail);
    return detail.toString();
  };

  const employeeDetails = [
    {
      name: "Employee Type:",
      detail: formatDetail(employeeInfo.employeeType || "teaching"),
    },
    { name: "First Name:", detail: formatDetail(employeeInfo.firstName) },
    {
      name: "Middle Name:",
      detail: formatDetail(employeeInfo.middleName || "-"),
    },
    { name: "Last Name:", detail: formatDetail(employeeInfo.lastName) },
    { name: "Phone Number:", detail: formatDetail(employeeInfo.phone) },
    { name: "Email:", detail: formatDetail(employeeInfo.email) },
    { name: "DOB(B.S.):", detail: employeeInfo.dob },
    { name: "DOB(A.D):", detail: employeeInfo.dobAd },
    {
      name: "Citizenship No:",
      detail: formatDetail(employeeInfo.citizenshipNo),
    },
  ];

  const workDetails = [
    { name: "post:", detail: empPost },
    { name: "Position:", detail: formatDetail(workInfo.position) },
    { name: "Joining Type:", detail: formatDetail(workInfo.joiningType) },
    { name: "Teaching Faculty:", detail: workInfo.teachingFacultyName },
    {
      name: "Joining Date:",
      detail: formatDetail(new Date(workInfo.joiningdate).toLocaleDateString()),
    },
  ];

  const academicDetails = [
    { name: "Faculty:", detail: formatDetail(academyInfo.facultyName) },
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
          <Grid container>
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
                  Campus Details
                </Typography>
                <Grid
                  marginTop="-15px"
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
                  <Typography variant="body2" fontSize="12px" color="#2B6EB5">
                    <span style={{ color: "#6b6b6b", fontSize: "14px" }}>
                      Current Address :{" "}
                    </span>
                    {employeeAddress.tProvince}, {employeeAddress.tDistrict},{" "}
                    {employeeAddress.tLocalLevel} - {employeeAddress.tWardNo}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            <Grid mt="01.2rem" item xs={12} md={12}>
              <Box
                border="1px solid #c2c2c2"
                padding="0px"
                borderRadius="10px"
                position="relative"
                paddingBottom="5px"
              >
                <Typography
                  border="1px solid #c2c2c2"
                  fontSize="14px"
                  borderRadius="10px"
                  variant="subtitle1"
                  display="inline-block"
                  bgcolor="white"
                  padding="0 5px"
                  position="relative"
                  left="20px"
                  bottom="14px"
                >
                  work Info
                </Typography>
                <Grid marginTop="-15px" container paddingLeft="1.5rem">
                  {workDetails.map((details, index) => (
                    <Grid item xs={3} key={index}>
                      <Typography fontSize="14px" color="text.secondary">
                        {details.name}
                      </Typography>
                      <Typography fontSize="12px" color="#2B6EB5">
                        {details.detail}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
            <Grid mt="1.2rem" item xs={12} md={12}>
              <Box
                border="1px solid #c2c2c2"
                padding="0px"
                borderRadius="10px"
                position="relative"
                paddingBottom="5px"
              >
                <Typography
                  border="1px solid #c2c2c2"
                  fontSize="14px"
                  borderRadius="10px"
                  variant="subtitle1"
                  display="inline-block"
                  bgcolor="white"
                  padding="0 5px"
                  position="relative"
                  left="20px"
                  bottom="14px"
                >
                  Academic Info
                </Typography>
                <Grid
                  marginTop="-15px"
                  container
                  paddingLeft="1.5rem"
                  justifyContent="flex-start"
                >
                  {academicDetails.map((details, index) => (
                    <Grid item xs={3}>
                      <Typography fontSize="14px" color="text.secondary">
                        {details.name}
                      </Typography>
                      <Typography fontSize="12px" color="#2B6EB5">
                        {details.detail}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Box
            mt={1}
            mb={2}
            display="flex"
            width="100%"
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              color="error"
              onClick={handleBack}
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
              {loading ? "Submitting..." : "Update"}
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default EditDetailsReview;
