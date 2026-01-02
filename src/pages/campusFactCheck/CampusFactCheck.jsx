import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  TableFooter,
} from "@mui/material";
import { useSelector } from "react-redux";
import { blue } from "@mui/material/colors";
import HomeAppBar from "../../modules/navbar/HomeAppBar";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const CampusInfo = ({ collegeData, uniName }) => (
  <Box
    border="1px solid #c2c2c2"
    borderRadius="10px"
    position="relative"
    width="100%"
    bgcolor={'white'}
    marginTop="30px"
    padding="22px 15px 15px 15px"
    marginLeft={1}
  >
    <Typography
      variant="body1"
      borderRadius="10px"
      display="inline-block"
      color="#1976d2"
      border="1px solid #8c8d90"
      padding="3px 5px"
      position="absolute"
      left="20px"
      top="-20px"
      bgcolor="white"
    >
      General Information of Campus
    </Typography>
    <Grid container spacing={3} justifyContent="space-between">
      <Grid item xs={12} md={6}>
        <div>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Campus Name:</strong> {collegeData.campusName}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Affiliating University:</strong> {uniName}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Address:</strong> {collegeData.locality}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Province:</strong> {collegeData?.province}
            {", "}
            <strong>District:</strong> {collegeData?.district}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Local Level:</strong> {collegeData?.localLevel}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Campus Phone/Email:</strong> {collegeData?.contactPhoneNo1}{" "}
            / {collegeData?.email}
          </Typography>
        </div>
      </Grid>

      <Grid item xs={12} md={6}>
        <div>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Campus Chief Name:</strong> {collegeData?.principalName}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Campus Chief Contact No:</strong>{" "}
            {collegeData?.principalPhoneNo}, {collegeData?.principalPhoneNo1}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Campus Chief Email:</strong> {collegeData?.principalEmail}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Landline Phone:</strong> {collegeData?.contactNo2}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Focal Person:</strong> {collegeData?.contactName}
          </Typography>
          <Typography
            variant="body1"
            align="left"
            style={{ marginBottom: "8px", fontSize: "14px" }}
          >
            <strong>Focal Person Email/Phone:</strong>{" "}
            {collegeData?.contactEmail} / {collegeData?.contactPhoneNo}
          </Typography>
        </div>
      </Grid>
    </Grid>
  </Box>
);

const EnrolledStudentTable = ({ enrolledReports }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: blue[700], color: "white" }}>
          <TableRow>
            <TableCell
              rowSpan={2}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              S.No.
            </TableCell>
            <TableCell
              rowSpan={2}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Program
            </TableCell>
            <TableCell
              rowSpan={2}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Level
            </TableCell>
            <TableCell
              colSpan={3}
              align="center"
              sx={{
                color: "white",
                border: "1px solid #c2c2c2",
                textAlign: "center",
              }}
            >
              Gender
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Male
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Female
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {enrolledReports?.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell sx={{ border: "1px solid #c2c2c2" }} align="left">
                {rowIndex + 1}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }} >
                {row.program}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {row.level}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }} align="right">
                {row.male}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }} align="right">
                {row.female}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }} align="right">
                {row.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableRow>
          <TableCell
            colSpan={3}
            align="center"
            sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}
          >
            Total
          </TableCell>
          <TableCell sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}>
            {enrolledReports?.reduce((acc, row) => acc + row.male, 0)}
          </TableCell>
          <TableCell sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}>
            {enrolledReports?.reduce((acc, row) => acc + row.female, 0)}
          </TableCell>
          <TableCell sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}>
            {enrolledReports?.reduce((acc, row) => acc + row.total, 0)}
          </TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
};

const GraduatedStudentTable = () => {
  const data = [
    {
      program: "Program 1",
      bachelorMale: 5,
      bachelorFemale: 3,
    },
    {
      program: "Program 2",
      bachelorMale: 4,
      bachelorFemale: 2,
    },
    {
      program: "Program 3",
      bachelorMale: 6,
      bachelorFemale: 4,
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: blue[700], color: "white" }}>
          <TableRow>
            <TableCell
              rowSpan={2}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Program
            </TableCell>
            {data?.map((data, index) => (
              <TableCell
                colSpan={3}
                key={index}
                align="center"
                sx={{
                  color: "white",
                  border: "1px solid #c2c2c2",
                  textAlign: "center",
                }}
              >
                {data.level}
              </TableCell>
            ))}
            <TableCell
              rowSpan={2}
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Grand Total
            </TableCell>
          </TableRow>
          <TableRow>
            {data?.map((data, index) => (
              <React.Fragment key={index}>
                <TableCell sx={{ color: "white", border: "1px solid #c2c2c2" }}>
                  Male
                </TableCell>
                <TableCell sx={{ color: "white", border: "1px solid #c2c2c2" }}>
                  Female
                </TableCell>
                <TableCell sx={{ color: "white", border: "1px solid #c2c2c2" }}>
                  Total
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell
                sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}
              >
                {row.program}
              </TableCell>
              {data?.map((levelData, colIndex) => (
                <React.Fragment key={colIndex}>
                  <TableCell
                    sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}
                  >
                    {levelData.bachelorMale}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}
                  >
                    {levelData.bachelorFemale}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}
                  >
                    {levelData.bachelorFemale + levelData.bachelorMale}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TeachingStaffTable = ({ teachingStaff }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: blue[700] }}>
          <TableRow>
            <TableCell
              rowSpan={2}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              S.No.
            </TableCell>
            <TableCell
              rowSpan={2}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Post
            </TableCell>
            <TableCell
              colSpan={3}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Gender{" "}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Male
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Female
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachingStaff.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {index + 1}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {row.position}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {row.male}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {row.female}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {row.total}
              </TableCell>
            </TableRow>
          ))}
          {/* Grand Total Row */}
          <TableRow sx={{ fontWeight: "bold" }}>
            <TableCell
              colSpan={2}
              align="center"
              sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}
            >
              Grand Total
            </TableCell>
            <TableCell sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}>
              {teachingStaff.reduce((acc, curr) => acc + curr.male, 0)}
            </TableCell>
            <TableCell sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}>
              {teachingStaff.reduce((acc, curr) => acc + curr.female, 0)}
            </TableCell>
            <TableCell sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}>
              {teachingStaff.reduce((acc, curr) => acc + curr.total, 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const NonTeachingStaffTable = ({ nonTeachingStaff }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: blue[700] }}>
          <TableRow>
            <TableCell
              rowSpan={2}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              S.No.
            </TableCell>
            <TableCell
              rowSpan={2}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Post
            </TableCell>
            <TableCell
              colSpan={3}
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Gender
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Male
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Female
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: "white", border: "1px solid #c2c2c2" }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nonTeachingStaff.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {index + 1}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {row.post?.positionName}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {row.male}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {row.female}
              </TableCell>
              <TableCell sx={{ border: "1px solid #c2c2c2" }}>
                {row.grandTotal}
              </TableCell>
            </TableRow>
          ))}
          {/* Grand Total Row */}
          <TableRow sx={{ fontWeight: "bold" }}>
            <TableCell
              colSpan={2}
              align="center"
              sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}
            >
              Grand Total
            </TableCell>
            <TableCell sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}>
              {nonTeachingStaff.reduce((acc, curr) => acc + curr.male, 0)}
            </TableCell>
            <TableCell sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}>
              {nonTeachingStaff.reduce((acc, curr) => acc + curr.female, 0)}
            </TableCell>
            <TableCell sx={{ border: "1px solid #c2c2c2", fontWeight: "bold" }}>
              {nonTeachingStaff.reduce((acc, curr) => acc + curr.grandTotal, 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const OfferedFacultyAndProgram = ({ collegePrograms }) => (
  <Box
    border="1px solid #c2c2c2"
    borderRadius="10px"
    position="relative"
    width="100%"
    marginTop="30px"
    padding="22px 15px 15px 15px"
    marginLeft={1}
    bgcolor={'white'}
  >
    <Typography
      variant="body1"
      borderRadius="10px"
      display="inline-block"
      color="#1976d2"
      border="1px solid #8c8d90"
      padding="3px 5px"
      position="absolute"
      left="20px"
      top="-20px"
      bgcolor="white"
    >
      Offered Faculty and Programs{" "}
    </Typography>

    <Typography
      variant="body2"
      style={{ marginTop: "1px", fontWeight: "bold" }}
    >
      Faculty:
    </Typography>
    <Grid container spacing={0} style={{ marginBottom: "1px" }}>
      {[...new Set(collegePrograms?.map((data) => data?.facultyName))].map(
        (facultyName, index) => (
          <Grid item xs={4} key={facultyName}>
            <Typography variant="body2">{`${String.fromCharCode(
              97 + index
            )}) ${facultyName}`}</Typography>
          </Grid>
        )
      )}
    </Grid>

    <Typography
      variant="body2"
      style={{ marginTop: "1px", fontWeight: "bold" }}
    >
      Level:
    </Typography>
    <Grid container spacing={0} style={{ marginBottom: "1px" }}>
      {[...new Set(collegePrograms?.map((data) => data?.levelName))].map(
        (levelName, index) => (
          <Grid item xs={4} key={levelName}>
            <Typography variant="body2">{`${String.fromCharCode(
              97 + index
            )}) ${levelName}`}</Typography>
          </Grid>
        )
      )}
    </Grid>

    <Typography
      variant="body2"
      style={{ marginTop: "1px", fontWeight: "bold" }}
    >
      Offered Programs:
    </Typography>
    <Grid container spacing={0} style={{ marginBottom: "1px" }}>
      {collegePrograms?.map((programName, index) => (
        <Grid item xs={4} key={programName.id}>
          <Typography variant="body2">{`${String.fromCharCode(97 + index)}) ${programName?.programName
            }`}</Typography>
        </Grid>
      ))}
    </Grid>
  </Box>
);
const baseUrl = config.VITE_BASE_URL;

const CampusFactCheck = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const { currentUser } = useSelector((state) => state.user);
  const campusName = currentUser.institution?.campusName;
  const district = currentUser?.institution?.district;
  const localLevel = currentUser?.institution?.localLevel;
  const campusLogo = currentUser?.institution?.logo;
  const uniName = currentUser?.uniName;
  const [collegeData, setCollegeData] = useState({});
  const [collegePrograms, setCollegePrograms] = useState([]);
  const [enrolledReports, setEnrolledReports] = useState([]);
  const [teachingStaff, setTeachingStaff] = useState([]);
  const [nonTeachingStaff, setNonTeachingStaff] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfigSafe();
        const response = await axios.get(
          `${backendUrl}/Student/GetUserDetails`,
          config
        );
        setCollegeData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/ProgramMgmt/GetCollegePrograms`,
          config
        );
        setCollegePrograms(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/Dashboard/GetStudentsFilterableReport`,
          config
        );
        setEnrolledReports(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/Employee/Report/GetTeachingEmployeeByGender`,
          config
        );
        setTeachingStaff(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/Employee/Report/GetNonTeachingStaffPositionSummary
`,
          config
        );
        setNonTeachingStaff(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });
  return (
    <>
      <Container style={{ maxWidth: '95%', paddingTop: 25 }} ref={componentRef}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{ marginBottom: "20px" }}
          justifyContent={"space-between"}
        >
          <Grid item xs={12} sm={6} display={"flex"}>
            <img
              src={`${baseUrl}/${campusLogo}`}
              alt="Campus Logo"
              style={{ width: "70px", height: "70px" }}
            />
            <Grid>
              <Typography variant="h6" color={blue[700]} pl={1}>
                {campusName}
              </Typography>
              <Typography variant="body2" color={blue[700]} pl={1}>
                {localLevel}, {district}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} display={"flex"}>
            <Typography
              variant="h6"
              color={blue[700]}
              pl={1}
              fontWeight={"bold"}
              sx={{ textDecoration: "underline" }}
            >
              FACT SHEET{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid>
          <CampusInfo collegeData={collegeData} uniName={uniName} />
          <OfferedFacultyAndProgram collegePrograms={collegePrograms} />
        </Grid>

        <Typography
          variant="body1"
          style={{ marginBottom: "1px", paddingTop: "5px", color: "#1976d2" }}
        >
          Summary Report of Enrolled Students
        </Typography>
        <EnrolledStudentTable enrolledReports={enrolledReports} />

        {/* <Typography
           variant="body1"
          style={{
            marginTop: "3px",
            marginBottom: "1px",
            paddingTop: "5px",
            color: "#1976d2",
          }}
        >
          Summary Report of Graduated Students
        </Typography>
        <GraduatedStudentTable /> */}

        <Typography
          variant="body1"
          style={{
            marginTop: "3px",
            marginBottom: "1px",
            paddingTop: "5px",
            color: "#1976d2",
          }}
        >
          Summary Report of Teaching Staff by Gender
        </Typography>
        <TeachingStaffTable teachingStaff={teachingStaff} />

        <Typography
          variant="body1"
          style={{
            marginTop: "3px",
            marginBottom: "1px",
            paddingTop: "5px",
            color: "#1976d2",
          }}
        >
          Summary Report of Non-Teaching Staff by Gender
        </Typography>
        <NonTeachingStaffTable nonTeachingStaff={nonTeachingStaff} />
        <Grid display={"flex"} justifyContent={"space-between"}>
          <Grid sx={{ padding: "2rem" }}>
            <Typography>..............................</Typography>
            <Typography>Campus Chief</Typography>
          </Grid>
          <Grid sx={{ padding: "2rem" }}>
            <Typography>...................................</Typography>
            <Typography>UGC Representative</Typography>
          </Grid>
        </Grid>
      </Container>
      <Grid ml={15}>
        <Button variant="contained" onClick={handlePrint}>
          Print
        </Button>
      </Grid>
    </>
  );
};

export default CampusFactCheck;
