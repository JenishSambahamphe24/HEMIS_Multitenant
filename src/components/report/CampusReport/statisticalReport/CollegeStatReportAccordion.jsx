import React, { useState, useEffect } from "react";
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
import { getFiscalYear, getFiscalYearById } from "../../../../services/services";
import HomeAppBar from "../../../../modules/navbar/HomeAppBar";
import { useSelector } from "react-redux";
import AnnualStudentEnrollment from "../annual-reports/AnnualStudentEnrollment";
import YearWiseStudentEnrollment from "../annual-reports/YearWiseStudentEnrollment";
import PassedStdReport from "../annual-reports/PassedStdReport";
import CampusNonTeachingByPost from "./CampusNonTeachingByPost";
import CampusTeachingByPost from "./CampusTeachingByPost";

export default function CollegeStatReportAccordion() {
    const { currentUser } = useSelector((state) => state.user);
    const [campusExpanded1, setCampusExpanded1] = React.useState(false);
    const [campusExpanded2, setCampusExpanded2] = React.useState(false);

    const [data, setData] = React.useState([]);
    const [selectedYear, setSelectedYear] = React.useState("");
    const [activeFiscalYear, setActiveFiscalYear] = useState({});
    const [selectedFiscalYearId, setSelectedFiscalYearId] = React.useState(0);
    const [fiscalIdDetails, setFiscalIdDetails] = useState({})

    const handleCampusExpanded = (panel) => (event, isExpanded) => {
        setCampusExpanded1(isExpanded ? panel : false);
    };
    const handleCampusExpanded2 = (panel) => (event, isExpanded) => {
        setCampusExpanded2(isExpanded ? panel : false);
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
                const fiscalYear = await getFiscalYear();
                const activeFiscalYear = fiscalYear.find(
                    (item) => item.activeFiscalYear === true
                );
                setData(fiscalYear);
                if (activeFiscalYear) {
                    setSelectedYear(activeFiscalYear.yearNepali);
                    setSelectedFiscalYearId(activeFiscalYear.id);
                    setActiveFiscalYear(activeFiscalYear);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getFiscalYearById(
                    selectedFiscalYearId || activeFiscalYear.id
                );
                setFiscalIdDetails({
                    yearNepali: response.yearNepali,
                    yearEnglish: response.yearEnglish,
                });
            } catch (error) {
                console.error("Error fetching fiscal year details:", error);
            }
        };
        fetchData();
    }, [selectedFiscalYearId]);

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
                    Satistical Report  {currentUser?.institution.campusName} (F.Y.
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
                            Statistical Report for students
                        </Typography>
                        {[
                            {
                                title:
                                    "Student Enrollment - Semester System",
                                component: (
                                    <AnnualStudentEnrollment fiscalYear={fiscalIdDetails.yearNepali} />
                                ),
                            },
                            {
                                title:
                                    "Student Enrollment - Yearly System",
                                component: (
                                    <YearWiseStudentEnrollment fiscalYear={fiscalIdDetails.yearNepali} />
                                ),
                            },
                            {
                                title:
                                    "Student examination status",
                                component: (
                                    <PassedStdReport fiscalYear={fiscalIdDetails.yearNepali} />
                                ),
                            }

                        ].map((item, index) => (
                            <Accordion
                                key={index}
                                expanded={campusExpanded1 === `panel${index}`}
                                onChange={handleCampusExpanded(`panel${index}`)}
                                sx={{ width: "100%", borderRadius: 1 }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: blue[700] }} />}
                                    aria-controls={`panel${index}-content`}
                                    id={`panel${index}-header`}
                                    sx={{
                                        backgroundColor: "#ffffff",
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                        borderRadius: 1,
                                        padding: "0px 12px",
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
                    <Grid border="3px solid #2b6eb5" item sm={12}>
                        <Typography
                            bgcolor="#2B6EB5"
                            fontSize="18px"
                            padding="10px"
                            textAlign="center"
                            color="white"
                        >
                            Statistical Report for students
                        </Typography>
                        {[
                             {
                                title:
                                  "No of Teaching staffs in campus By Joining type",
                                component: (
                                  <CampusTeachingByPost fiscalId={selectedFiscalYearId} />
                                ),
                              },
                              {
                                title:
                                  "No of Non-teaching staff in Campus By position Type ",
                                component: (
                                  <CampusNonTeachingByPost fiscalId={selectedFiscalYearId} />
                                ),
                              },

                        ].map((item, index) => (
                            <Accordion
                                key={index}
                                expanded={campusExpanded2 === `panel${index}`}
                                onChange={handleCampusExpanded2(`panel${index}`)}
                                sx={{ width: "100%", borderRadius: 1 }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: blue[700] }} />}
                                    aria-controls={`panel${index}-content`}
                                    id={`panel${index}-header`}
                                    sx={{
                                        backgroundColor: "#ffffff",
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                        borderRadius: 1,
                                        padding: "0px 12px",
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
