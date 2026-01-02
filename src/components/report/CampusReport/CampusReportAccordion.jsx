import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Box,
    Typography,
    Divider,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Grid,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import GraduatedStdByFiscal from "./GraduatedStdByFiscal";
import EnrollmentWithGPI from "./EnrollmentWithGPI";
import { getFiscalYearForSelection } from "../../../services/services";
import ProgramByEcobelts from "../CampusReport/ProgramByEcobelts";
import GraduatedStdByLevelFaculty from "./GraduatedStdByLevelFaculty";
import { useSelector } from "react-redux";
import DetailEnrollmentInProgram from "./DetailEnrollmentInProgram";
import CampusReportByProvince from "./CampusReportByProvince";
import StudentPassRateByProgram from "./StudentPassRateByProgram";
import TeachersByPosition from "./TeachersByPosition";
import TeachersByFacultyInCollege from "./TeachersByFacultyInCollege";
import DropoutReportCampus from "./DropoutReportCampus";
import DropOutByEthnicity from "./DropOutByEthnicity";
import TeacherByDepartment from "./TeacherByDepartment";
import GraduationByEthnicity from "./GraduationByEthnicty";
import CampusStudentsByAgeGroup from "./CampusStudentsByAgeGroup";
import NonTeachingByPosition from "./NonTeachingByPosition";
import NonTeachingBySection from "./NonTeachingBySection";
import DropOutByFiscal from "./DropOutByFiscal";
import TeachersByQualification from "./TeachersByQualification";
import PassRateInLast5FY from "./PassRateInLast5FY";

export default function CampusReportAccordion() {
    const { currentUser } = useSelector((state) => state.user);
    const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;

    const [campusExpanded1, setCampusExpanded1] = React.useState(false);
    const [campusExpanded2, setCampusExpanded2] = React.useState(false);
    const [campusExpanded3, setCampusExpanded3] = React.useState(false);
    const [teacherExpanded, setTeacherExpanded] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [selectedYear, setSelectedYear] = React.useState("");
    const [selectedFiscalYearId, setSelectedFiscalYearId] = React.useState(0);

    const handleCampusExpanded = (panel) => (event, isExpanded) => {
        setCampusExpanded1(isExpanded ? panel : false);
    };

    const handleCampusExpanded2 = (panel) => (event, isExpanded) => {
        setCampusExpanded2(isExpanded ? panel : false);
    };
    const handleCampusExpanded3 = (panel) => (event, isExpanded) => {
        setCampusExpanded3(isExpanded ? panel : false);
    };
    const handleTeacherExpanded = (panel) => (event, isExpanded) => {
        setTeacherExpanded(isExpanded ? panel : false);
    };

    const handleYearChange = (event) => {
        const selectedYearValue = event.target.value;
        const selectedYearItem = data.find(
            (item) => item.yearNepali === selectedYearValue
        );
        setSelectedYear(selectedYearValue);
        setSelectedFiscalYearId(selectedYearItem ? selectedYearItem.id : "");
    };
    React.useEffect(() => {
        const response = async () => {
            try {
                const fiscalYear = await getFiscalYearForSelection();

                const activeFiscalYear = fiscalYear.find(
                    (item) => item.activeFiscalYear === true
                );

                setData(fiscalYear);

                if (activeFiscalYear) {
                    setSelectedYear(activeFiscalYear.yearNepali);
                    setSelectedFiscalYearId(activeFiscalYear.id);
                } else if (fiscalYear.length > 0) {
                    setSelectedYear(fiscalYear[0].yearNepali);
                    setSelectedFiscalYearId(fiscalYear[0].id);
                }
            } catch (err) {
                console.log(err);
            }
        };
        response();
    }, []);
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    minHeight: "100vh",
                    padding: 2,
                }}
            >
                <Typography
                    variant="h6"
                    align="center"
                    gutterBottom
                    sx={{ marginTop: 2, color: blue[700] }}
                >
                    Summary Report of {currentUser?.institution.campusName} (F.Y.
                    {selectedYear ? selectedYear : "Select Year"})
                </Typography>
                <Divider sx={{ marginBottom: 2, width: "100%" }} />
                <Grid container justifyContent="left" marginBottom={1}>
                    <FormControl fullWidth sx={{ maxWidth: "20%" }} size="small">
                        <InputLabel>Select Fiscal Year</InputLabel>
                        <Select
                            size="small"
                            label="Select Fiscal Year"
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            <MenuItem disabled value="">
                                Select Fiscal Year
                            </MenuItem>
                            {data.map((item) => (
                                <MenuItem key={item.id} value={item.yearNepali}>
                                    {item.yearNepali}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container>
                    <Grid border="3px solid #2b6eb5" item sm={12}>
                        <Typography
                            bgcolor="#2B6EB5"
                            fontSize="18px"
                            padding="10px"
                            textAlign="center"
                            color="white"
                        >
                            Summary Report for students
                        </Typography>
                        {[
                            {
                                title:
                                    "Summary of student enrollment in each program",
                                component: (
                                    <DetailEnrollmentInProgram fiscalId={selectedFiscalYearId} />
                                ),
                            },
                            {
                                title:
                                    "GPI of enrolled students by faculty and level",
                                component: (
                                    <EnrollmentWithGPI fiscalId={selectedFiscalYearId} />
                                ),
                            },
                            {
                                title:
                                    "Gender-wise student enrollment in different programs based on ecological belt",
                                component: (
                                    <ProgramByEcobelts fiscalId={selectedFiscalYearId} />
                                ),
                            },

                            {
                                title:
                                    "Student enrollment According to Province",
                                component: (
                                    <CampusReportByProvince fiscalId={selectedFiscalYearId} />
                                ),
                            },
                            {
                                title:
                                    "Student Enrollment by Age group",
                                component: (
                                    <CampusStudentsByAgeGroup fiscalId={selectedFiscalYearId} />
                                ),
                            },
                        ].map((item, index) => (
                            <Accordion
                                key={index}
                                expanded={campusExpanded1 === `panel${index}`}
                                onChange={handleCampusExpanded(`panel${index}`)}
                                sx={{ marginBottom: 1.5, width: "100%", borderRadius: 1 }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: blue[700] }} />}
                                    aria-controls={`panel${index}-content`}
                                    id={`panel${index}-header`}
                                    sx={{
                                        backgroundColor: "#ffffff",
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                        borderRadius: 1,
                                        padding: "5px 12px",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 500, color: blue[700] }}
                                    >
                                        {index + 1}.{item.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{ padding: 1, backgroundColor: "#fafafa" }}
                                >
                                    {item.component}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid border="3px solid #2b6eb5" item sm={12}>
                        <Typography
                            bgcolor="#2B6EB5"
                            fontSize="18px"
                            padding="10px"
                            textAlign="center"
                            color="white"
                        >
                            Summary Report for Graduated and Drop out Students
                        </Typography>
                        {[
                            {
                                title:
                                    "Students pass rate by Program ",
                                component: (
                                    <StudentPassRateByProgram />
                                ),
                            },
                            {
                                title:
                                    "Students pass rate in the last 5 FY ",
                                component: (
                                    <PassRateInLast5FY roleName={roleName} />
                                ),
                            },
                            {
                                title:
                                    "Number of Graduated Students by Gender",
                                component: (
                                    <GraduatedStdByLevelFaculty roleName={roleName} fiscalId={selectedFiscalYearId} />
                                ),
                            },
                            {
                                title:
                                    "Number of Graduated Students by Ethnicity",
                                component: (
                                    <GraduationByEthnicity roleName={roleName} fiscalId={selectedFiscalYearId} />
                                ),
                            },
                            {
                                title:
                                    "Number of Graduated Students in the last 5 FY",
                                component: (
                                    <GraduatedStdByFiscal />
                                ),
                            },
                            {
                                title:
                                    "Number of Dropout Students by Gender",
                                component: (
                                    <DropoutReportCampus fiscalId={selectedFiscalYearId} />
                                ),
                            },
                            {
                                title:
                                    "Number of Dropout Students by Ethnicity ",
                                component: (
                                    <DropOutByEthnicity roleName={roleName} />
                                ),
                            },
                            {
                                title:
                                    "Number of Dropout Students in the last 5 FY",
                                component: (
                                    <DropOutByFiscal roleName={roleName} />
                                ),
                            },
                        ].map((item, index) => (
                            <Accordion
                                key={index}
                                expanded={campusExpanded2 === `panel${index}`}
                                onChange={handleCampusExpanded2(`panel${index}`)}
                                sx={{ marginBottom: 1.5, width: "100%", borderRadius: 1 }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: blue[700] }} />}
                                    aria-controls={`panel${index}-content`}
                                    id={`panel${index}-header`}
                                    sx={{
                                        backgroundColor: "#ffffff",
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                        borderRadius: 1,
                                        padding: "5px 12px",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 500, color: blue[700] }}
                                    >
                                        {index + 1}.{item.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{ padding: 1, backgroundColor: "#fafafa" }}
                                >
                                    {item.component}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid border="3px solid #2b6eb5" item sm={12}>
                        <Typography
                            bgcolor="#2B6EB5"
                            fontSize="18px"
                            padding="10px"
                            textAlign="center"
                            color="white"
                        >
                            Summary Report for Teachers
                        </Typography>
                        {[
                            {
                                title:
                                    "Summary of Teachers according to their qualification ",
                                component: (
                                    <TeachersByQualification fiscalId={selectedFiscalYearId} />
                                ),
                            },
                            {
                                title:
                                    "Summary of Teachers by their Teaching faculty in the college ",
                                component: (
                                    <TeachersByFacultyInCollege />
                                ),
                            },
                            {
                                title:
                                    "Summary of Teachers according to their position ",
                                component: (
                                    <TeachersByPosition fiscalId={selectedFiscalYearId} />
                                ),
                            },
                            {
                                title:
                                    "Summary of Teachers by Departments",
                                component: (
                                    <TeacherByDepartment fiscalId={selectedFiscalYearId} />
                                ),
                            }
                        ].map((item, index) => (
                            <Accordion
                                key={index}
                                expanded={teacherExpanded === `panel${index}`}
                                onChange={handleTeacherExpanded(`panel${index}`)}
                                sx={{ marginBottom: 1.5, width: "100%", borderRadius: 1 }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: blue[700] }} />}
                                    aria-controls={`panel${index}-content`}
                                    id={`panel${index}-header`}
                                    sx={{
                                        backgroundColor: "#ffffff",
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                        borderRadius: 1,
                                        padding: "5px 12px",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 500, color: blue[700] }}
                                    >
                                        {index + 1}.{item.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{ padding: 1, backgroundColor: "#fafafa" }}
                                >
                                    {item.component}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid border="3px solid #2b6eb5" item sm={12}>
                        <Typography
                            bgcolor="#2B6EB5"
                            fontSize="18px"
                            padding="10px"
                            textAlign="center"
                            color="white"
                        >
                            Summary Report for Non-teaching staffs
                        </Typography>
                        {[
                            {
                                title:
                                    "Summary of Non-teaching staffs according to their position ",
                                component: (
                                    <NonTeachingByPosition fiscalId={selectedFiscalYearId} />
                                ),
                            },
                            {
                                title:
                                    "Summary of Non-teaching staffs by Section",
                                component: (
                                    <NonTeachingBySection fiscalId={selectedFiscalYearId} />
                                ),
                            }
                        ].map((item, index) => (
                            <Accordion
                                key={index}
                                expanded={campusExpanded3 === `panel${index}`}
                                onChange={handleCampusExpanded3(`panel${index}`)}
                                sx={{ marginBottom: 1.5, width: "100%", borderRadius: 1 }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: blue[700] }} />}
                                    aria-controls={`panel${index}-content`}
                                    id={`panel${index}-header`}
                                    sx={{
                                        backgroundColor: "#ffffff",
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                        borderRadius: 1,
                                        padding: "5px 12px",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 500, color: blue[700] }}
                                    >
                                        {index + 1}.{item.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{ padding: 1, backgroundColor: "#fafafa" }}
                                >
                                    {item.component}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
