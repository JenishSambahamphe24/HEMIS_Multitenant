import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Button,
    Popover,
    Grid
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { LoadingOverlay } from "@mantine/core";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { FileDownload, InsertDriveFile, PictureAsPdf } from "@mui/icons-material";
import { getFacultyByUniId, getFiscalYearForSelection, getLevelByUniId } from "../../../services/services";
import { useSelector } from "react-redux";
import { getPassRateForCampus } from "./CampusServices";

const StudentPassRateByProgram = ({ fiscalId }) => {
    const [data, setData] = React.useState([]);
    const [selectedYear, setSelectedYear] = React.useState("");
    const [selectedFiscalYearId, setSelectedFiscalYearId] = React.useState(0);
    const { currentUser } = useSelector((state) => state.user);
    const uniId = currentUser?.institution.universityId

    const [loading, setLoading] = useState(false)
    const [levelId, setLevelId] = useState(0);
    const [facultyId, setFacultyId] = useState(0)

    const [allLevel, setAllLevel] = useState([])
    const [allFaculty, setAllFaculty] = useState([])

    const handleYearChange = (event) => {
        const selectedYearValue = event.target.value;
        const selectedYearItem = data.find(
            (item) => item.yearNepali === selectedYearValue
        );
        setSelectedYear(selectedYearValue);
        setSelectedFiscalYearId(selectedYearItem ? selectedYearItem.id : "");
    };
    useEffect(() => {
        const fetchQueryData = async () => {
            try {
                const fiscalYear = await getFiscalYearForSelection()
                const levelResponse = await getLevelByUniId(uniId)
                const facultyResponse = await getFacultyByUniId(uniId)

                
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
              
                if (levelResponse) {
                    setAllLevel(levelResponse)
                } else {
                    setAllLevel([])
                }
                if (facultyResponse) {
                    setAllFaculty(facultyResponse)
                } else {
                    setAllFaculty([])
                }


            } catch (error) {
                console.log(error)
            }
        };
        fetchQueryData()
    }, [])

    const fetchReportData = async () => {
        setLoading(true)
        try {
            const response = await getPassRateForCampus({ fiscalId: selectedFiscalYearId, levelId, facultyId })
            if (response) {
                const rows = response.programs.map((item) => {
                    const malePassPercent = item.appearedMale !== 0
                        ? ((item.passedMale / item.appearedMale) * 100).toFixed(2)
                        : '0.00';

                    const femalePassPercent = item.appearedFemale !== 0
                        ? ((item.passedFemale / item.appearedFemale) * 100).toFixed(2)
                        : '0.00';

                    const otherPassPercent = item.appearedOthers !== 0
                        ? ((item.passedOthers / item.appearedOthers) * 100).toFixed(2)
                        : '0.00';

                    const totalPassPercent = item.totalAppeared !== 0
                        ? ((item.totalPassed / item.totalAppeared) * 100).toFixed(2)
                        : '0.00';
                    return {
                        program: item.programName,
                        appearedMale: item.appearedMale,
                        appearedFemale: item.appearedFemale,
                        appearedOther: item.appearedOthers,
                        totalAppeared: item.totalAppeared,
                        passedMale: item.passedMale,
                        passedFemale: item.passedFemale,
                        passedOthers: item.passedOthers,
                        totalPassed: item.totalPassed,
                        malePassPercent: malePassPercent,
                        femalePassPercent: femalePassPercent,
                        otherPassPercent: otherPassPercent,
                        totalPassPercent: totalPassPercent
                    };
                });
                setApiData(rows.sort((a, b) => a.program.localeCompare(b.program)))
            } else {
                setApiData([])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }
    useEffect(() => {
        fetchReportData()
    }, [selectedYear, levelId, facultyId])

    const [anchorEl, setAnchorEl] = useState(null);
    const [apiData, setApiData] = useState([]);

    const totals = apiData.reduce(
        (acc, curr) => {
            acc.appearedMale += curr.appearedMale;
            acc.appearedFemale += curr.appearedFemale;
            acc.appearedOther += curr.appearedOther;
            acc.totalAppeared += curr.totalAppeared;

            acc.passedMale += curr.passedMale;
            acc.passedFemale += curr.passedFemale;
            acc.passedOthers += curr.passedOthers;
            acc.totalPassed += curr.totalPassed;

            return acc;
        },
        {
            appearedMale: 0,
            appearedFemale: 0,
            appearedOther: 0,
            totalAppeared: 0,
            passedMale: 0,
            passedFemale: 0,
            passedOthers: 0,
            totalPassed: 0
        }
    );
    totals.malePassPercent = totals.appearedMale !== 0
        ? ((totals.passedMale / totals.appearedMale) * 100).toFixed(2)
        : "0.00";

    totals.femalePassPercent = totals.appearedFemale !== 0
        ? ((totals.passedFemale / totals.appearedFemale) * 100).toFixed(2)
        : "0.00";

    totals.otherPassPercent = totals.appearedOther !== 0
        ? ((totals.passedOthers / totals.appearedOther) * 100).toFixed(2)
        : "0.00";

    totals.totalPassPercent = totals.totalAppeared !== 0
        ? ((totals.totalPassed / totals.totalAppeared) * 100).toFixed(2)
        : "0.00";

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(apiData);
        const header = [
            [
                "S.No.",
                "Program",
                "Appeared-Male",
                "Appeared-Female",
                "Appeared-Other",
                "Appeared-Total",
                "Passed-Male",
                "Passed-Female",
                "Passed-Other",
                "Passed-Total",
                "Male (pass %)",
                "Female (pass %)",
                "Other (pass %)",
                "Total (pass %)",
            ],
        ];
        XLSX.utils.sheet_add_aoa(worksheet, header, { origin: "A1" });
        apiData.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.program,
                row.appearedMale,
                row.appearedFemale,
                row.appearedOther,
                row.totalAppeared,
                row.passedMale,
                row.passedFemale,
                row.passedOthers,
                row.totalPassed,
                row.malePassPercent,
                row.femalePassPercent,
                row.otherPassPercent,
                row.totalPassPercent,
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 2}` });
        });
        const totalsRow = [
            "",
            "Total",
            totals.appearedMale,
            totals.appearedFemale,
            totals.appearedOther,
            totals.totalAppeared,

            totals.passedMale,
            totals.passedFemale,
            totals.passedOthers,
            totals.totalPassed,

            totals.malePassPercent,
            totals.femalePassPercent,
            totals.otherPassPercent,
            totals.totalPassPercent,
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [totalsRow], { origin: `A${apiData.length + 2}` });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CampusTypeByFaculty");
        XLSX.writeFile(workbook, "students_pass_rate.xlsx");
        handleClose();
    };
    const open = Boolean(anchorEl);
    const id = open ? "export-popover" : undefined;

    return (
        <div>
            <Box sx={{ marginBottom: "0px", display: "flex", gap: 2 }}>
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
                <FormControl fullWidth sx={{ maxWidth: "30%" }} size="small">
                    <InputLabel>Select Level</InputLabel>
                    <Select
                        size="small"
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 2,
                        }}
                        onChange={(e) => setLevelId(e.target.value)}
                        label="Select Level"
                    >
                        <MenuItem value=" ">All Level</MenuItem>
                        {
                            allLevel?.map((item, index) => (
                                <MenuItem key={item.id} value={item.id}>{item.levelName}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ maxWidth: "30%" }} size="small">
                    <InputLabel>Select Faculty</InputLabel>
                    <Select
                        size="small"
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 2,
                        }}
                        onChange={(e) => setFacultyId(e.target.value)}
                        label="Select Faculty"
                    >
                        <MenuItem value=" ">All Faculty</MenuItem>
                        {
                            allFaculty?.map((item, index) => (
                                <MenuItem key={item.id} value={item.id}>{item.facultyName}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <Grid container justifyContent="right">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FileDownload />}
                        onClick={handleClick}
                        style={{ marginBottom: '10px' }}
                    >
                        Export
                    </Button>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <Box sx={{ padding: '10px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ backgroundColor: '#5FAD41' }}
                                startIcon={<InsertDriveFile />}
                                onClick={exportToExcel}
                                fullWidth
                            >
                                Excel
                            </Button>
                        </Box>
                    </Popover>
                </Grid>
            </Box>
            <TableContainer sx={{ border: "1px solid #ddd" }}>
                <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
                    <TableHead style={{ backgroundColor: "#2A629A" }}>
                        <TableRow>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                                rowSpan={2}
                            >
                                S.No.
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                                rowSpan={2}
                            >
                                Program
                            </TableCell>

                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                                colSpan={4}
                            >
                                Total Appeared students in Exam
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                                colSpan={4}
                            >
                                Total passed Students
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                                colSpan={4}
                            >
                                Pass Percent (%)
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            {Array(3)
                                .fill()
                                .flatMap((_, sectionIndex) =>
                                    ["Male", "Female", "Others", "Total"].map((category, index) => (
                                        <TableCell
                                            key={`${sectionIndex}-${category}-${index}`}
                                            sx={{
                                                border: "1px solid #ddd",
                                                color: "#ffffff",
                                                padding: "4px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {category}
                                        </TableCell>
                                    ))
                                )}
                        </TableRow>


                    </TableHead>
                    {
                        loading ? (
                            <LoadingOverlay
                                visible={loading}
                                zIndex={100}
                                overlayProps={{ radius: "sm", blur: 1 }}
                                loaderProps={{ color: "#1976d2", type: "bars" }}
                            />
                        ) : (
                            <TableBody>
                                {
                                    apiData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {index + 1}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "left",
                                                }}
                                                className="capitalize"
                                            >
                                                {item.program}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.appearedMale}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.appearedFemale}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.appearedOther}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.totalAppeared}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.passedMale}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.passedFemale}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.passedOthers}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.totalPassed}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.malePassPercent}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.femalePassPercent}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.otherPassPercent}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {item.totalPassPercent}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                                {
                                    apiData.length > 0 ? (
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",

                                                    textAlign: "center",
                                                }}
                                                colSpan={2}
                                            >
                                                Grand Total
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                    padding: "4px",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.appearedMale}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {totals.appearedFemale}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {totals.appearedOther}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                    padding: "4px",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.totalAppeared}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                    padding: "4px",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.passedMale}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                    padding: "4px",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.passedFemale}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                    padding: "4px",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.passedOthers}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    padding: '4px',
                                                    textAlign: "right",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.totalPassed}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                    padding: "4px",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.malePassPercent}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                    padding: "4px",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.femalePassPercent}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                    padding: "4px",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.otherPassPercent}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                    padding: "4px",
                                                    border: "1px solid #c2c2c2",
                                                }}
                                            >
                                                {totals.totalPassPercent}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableCell
                                            colSpan={16}
                                            sx={{
                                                padding: "4px",
                                                textAlign: "center",
                                                color: 'red'
                                            }}
                                        >
                                            No Data Found !!
                                        </TableCell>
                                    )
                                }
                            </TableBody>
                        )
                    }
                </Table>
            </TableContainer>
        </div>
    );
};

export default StudentPassRateByProgram;